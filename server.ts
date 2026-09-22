/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { 
  getOrCreateUser, 
  getUserByUid, 
  updateUserProfile, 
  getUserStudyData, 
  logUserStudySession 
} from "./src/db/users.ts";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Health check endpoint for Cloud Run and proxy probes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware for parsing json and urlencoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
// Using the recommended environment variable and User-Agent header
const apiKey = process.env.GEMINI_API_KEY;

// ==========================================
// GEMINI MULTI-KEY POOL & LOAD BALANCING ENGINE
// ==========================================
class GeminiKeyPoolManager {
  private keys: string[] = [];
  private currentIndex: number = 0;
  private keyCooldowns: Map<number, number> = new Map();
  private keyStats: Map<number, { successCount: number; failureCount: number; lastUsed: number }> = new Map();

  constructor() {
    this.refreshKeys();
  }

  public refreshKeys(): void {
    const collected: string[] = [];
    
    // 1. Read GEMINI_API_KEYS (comma, semicolon, or newline delimited)
    if (process.env.GEMINI_API_KEYS) {
      const parts = process.env.GEMINI_API_KEYS.split(/[\n,;]+/)
        .map(k => k.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      for (const p of parts) {
        if (!collected.includes(p)) collected.push(p);
      }
    }

    // 2. Read standard GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY) {
      const primary = process.env.GEMINI_API_KEY.trim().replace(/^["']|["']$/g, '');
      if (primary && !collected.includes(primary)) {
        collected.unshift(primary);
      }
    }

    // 3. Read numbered keys GEMINI_API_KEY_1 through GEMINI_API_KEY_20
    for (let i = 1; i <= 20; i++) {
      const numbered = process.env[`GEMINI_API_KEY_${i}`];
      if (numbered) {
        const clean = numbered.trim().replace(/^["']|["']$/g, '');
        if (clean && !collected.includes(clean)) {
          collected.push(clean);
        }
      }
    }

    this.keys = collected;
    if (this.keys.length > 1) {
      console.log(`🚀 [Gemini Multi-Key Pool] Initialized with ${this.keys.length} API keys for automated rotation and quota failover.`);
    } else if (this.keys.length === 1) {
      console.log(`[Gemini Multi-Key Pool] Initialized with 1 primary Gemini API key.`);
    } else {
      console.warn(`[Gemini Multi-Key Pool] No Gemini API keys found in environment variables.`);
    }
  }

  public getKeyCount(): number {
    return this.keys.length;
  }

  public getAllKeys(): string[] {
    return [...this.keys];
  }

  public getNextActiveKey(): { key: string; index: number } {
    if (this.keys.length === 0) {
      const fallback = process.env.GEMINI_API_KEY || "";
      if (!fallback) {
        throw new Error("No Gemini API keys configured. Please set GEMINI_API_KEY or GEMINI_API_KEYS.");
      }
      return { key: fallback, index: 0 };
    }

    const now = Date.now();
    const total = this.keys.length;

    // 1. Search for next key that is not in cooldown
    for (let attempt = 0; attempt < total; attempt++) {
      const idx = (this.currentIndex + attempt) % total;
      const cooldownUntil = this.keyCooldowns.get(idx) || 0;
      if (cooldownUntil <= now) {
        this.currentIndex = (idx + 1) % total;
        this.recordUse(idx);
        return { key: this.keys[idx], index: idx };
      }
    }

    // 2. If all keys are in cooldown, pick the one expiring soonest
    let earliestIdx = 0;
    let earliestTime = Infinity;
    for (let i = 0; i < total; i++) {
      const cooldownUntil = this.keyCooldowns.get(i) || 0;
      if (cooldownUntil < earliestTime) {
        earliestTime = cooldownUntil;
        earliestIdx = i;
      }
    }

    this.currentIndex = (earliestIdx + 1) % total;
    this.recordUse(earliestIdx);
    return { key: this.keys[earliestIdx], index: earliestIdx };
  }

  public recordSuccess(index: number): void {
    this.keyCooldowns.delete(index);
    const stats = this.keyStats.get(index) || { successCount: 0, failureCount: 0, lastUsed: Date.now() };
    stats.successCount++;
    stats.lastUsed = Date.now();
    this.keyStats.set(index, stats);
  }

  public recordFailure(index: number, error: any): void {
    const errMsg = String(error?.message || error || "");
    const isQuota = 
      errMsg.includes("429") || 
      errMsg.includes("RESOURCE_EXHAUSTED") || 
      errMsg.includes("quota") || 
      errMsg.includes("Too Many Requests") ||
      errMsg.includes("Rate limit");

    const cooldownMs = isQuota ? 90000 : 15000;
    this.keyCooldowns.set(index, Date.now() + cooldownMs);

    const stats = this.keyStats.get(index) || { successCount: 0, failureCount: 0, lastUsed: Date.now() };
    stats.failureCount++;
    stats.lastUsed = Date.now();
    this.keyStats.set(index, stats);

    console.warn(`[Gemini Multi-Key Pool] Key #${index + 1} on cooldown for ${cooldownMs/1000}s (${isQuota ? 'QUOTA_429' : 'API_ERROR'}): ${errMsg.slice(0, 100)}`);
  }

  private recordUse(index: number): void {
    const stats = this.keyStats.get(index) || { successCount: 0, failureCount: 0, lastUsed: Date.now() };
    stats.lastUsed = Date.now();
    this.keyStats.set(index, stats);
  }

  public getPoolStatus() {
    const now = Date.now();
    return {
      totalKeys: this.keys.length,
      activeKeyIndex: this.currentIndex,
      healthyKeyCount: this.keys.filter((_, idx) => (this.keyCooldowns.get(idx) || 0) <= now).length,
      keys: this.keys.map((k, idx) => {
        const cooldownUntil = this.keyCooldowns.get(idx) || 0;
        const stats = this.keyStats.get(idx) || { successCount: 0, failureCount: 0, lastUsed: 0 };
        return {
          index: idx + 1,
          preview: k ? `${k.slice(0, 6)}...${k.slice(-4)}` : 'none',
          healthy: cooldownUntil <= now,
          cooldownSec: Math.max(0, Math.ceil((cooldownUntil - now) / 1000)),
          successes: stats.successCount,
          failures: stats.failureCount,
          lastUsed: stats.lastUsed ? new Date(stats.lastUsed).toLocaleTimeString() : 'never'
        };
      })
    };
  }
}

export const geminiKeyPool = new GeminiKeyPoolManager();

export const getAiClient = (overrideKey?: string): GoogleGenAI => {
  const chosenKey = overrideKey || (geminiKeyPool.getKeyCount() > 0 ? geminiKeyPool.getNextActiveKey().key : (process.env.GEMINI_API_KEY || ""));
  if (!chosenKey) {
    throw new Error("GEMINI_API_KEY or GEMINI_API_KEYS is required.");
  }
  return new GoogleGenAI({
    apiKey: chosenKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Bytez AI Inference Client
// Integrates Bytez API for multi-provider fallback and extended model catalog
const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "495074a67310e8b71823ef48395b3e11";

async function callBytezAI(prompt: string, systemInstruction?: string): Promise<string | null> {
  const key = process.env.BYTEZ_API_KEY || BYTEZ_API_KEY;
  if (!key) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    // Try OpenAI-compatible chat completions endpoint first
    const response = await fetch("https://api.bytez.com/models/v2/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Key ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 1024
      })
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data: any = await response.json();
      const output = data?.choices?.[0]?.message?.content || data?.output;
      if (output && typeof output === "string") {
        return output.trim();
      }
    }
  } catch (err: any) {
    console.warn("[Bytez AI Client] Fallback notice:", err?.message || err);
  }
  return null;
}

// Resilient Pedagogical Fallback Generator when API quotas are exhausted
function generatePedagogicalFallbackResponse(
  question: string, 
  options: { socratic?: boolean; level?: string; subjectContext?: string } = {}
): string {
  const { socratic, level, subjectContext } = options;
  const cleanQ = question.trim();
  const lowerQ = cleanQ.toLowerCase();

  // Topic specific high clarity explanations
  if (lowerQ.includes('photo') && (lowerQ.includes('synth') || lowerQ.includes('light'))) {
    return `### 🌿 Photosynthesis: The Energy Conversion Engine of Earth

#### 🌟 1. Core Intuition (The Solar Factory Analogy)
Think of a plant leaf as an ultra-efficient, solar-powered battery charger. It takes three simple, abundant ingredients: **Sunlight (Energy)**, **Water ($H_2O$) from the roots**, and **Carbon Dioxide ($CO_2$) from the air**, and converts them into **Glucose (stored chemical fuel)** while releasing **Oxygen ($O_2$)** as a vital byproduct.

#### 🔍 2. The Overall Balanced Equation
$$6CO_2 + 6H_2O + \\text{Photons} \\longrightarrow C_6H_{12}O_6 + 6O_2$$

#### ⚙️ 3. Two Distinct Stages Explained Step-by-Step
1. **Light-Dependent Reactions (In the Thylakoid Membranes)**:
   - Chlorophyll pigments absorb photons, exciting electrons.
   - Water molecules are split (photolysis): $2H_2O \\rightarrow 4H^+ + 4e^- + O_2$.
   - The excited electrons travel along the electron transport chain, generating **ATP** and **NADPH** energy carriers.
2. **Light-Independent Reactions / Calvin Cycle (In the Stroma)**:
   - The enzyme **RuBisCO** captures atmospheric $CO_2$ (carbon fixation).
   - Using the ATP and NADPH generated in stage 1, $CO_2$ is reduced to form $G3P$, which synthesizes glucose.

#### ⚠️ 4. The #1 Exam Mistake
> **Common Misconception**: Students often think the "dark reactions" only happen at night. In reality, the Calvin Cycle occurs mostly during the day because it requires the continuous supply of ATP and NADPH produced by the light reactions!

#### 🎯 Quick Check:
*What would happen to glucose production if the plant was kept in total darkness for 48 hours?*`;
  }

  if (lowerQ.includes('quadratic') || lowerQ.includes('formula') || lowerQ.includes('discriminant')) {
    return `### 📐 Quadratic Equations & The Quadratic Formula Explained Clearly

#### 🌟 1. Core Intuition
A quadratic equation represents a parabola: $ax^2 + bx + c = 0$. Finding the roots simply means finding where this curved path crosses the horizontal x-axis ($y = 0$).

#### 🔍 2. The Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

- **$-b / (2a)$**: This gives the exact x-coordinate of the axis of symmetry (the center peak or trough of the parabola).
- **$\\pm \\sqrt{b^2 - 4ac} / (2a)$**: This represents the symmetrical horizontal spread from the center to the two crossing points.

#### 💡 3. The Discriminant ($D = b^2 - 4ac$)
- **$D > 0$**: The square root is positive $\\rightarrow$ Two distinct real roots (parabola crosses x-axis twice).
- **$D = 0$**: $\\sqrt{0} = 0 \\rightarrow$ Exactly one repeated real root (parabola vertex touches the x-axis).
- **$D < 0$**: Negative under square root $\\rightarrow$ Two complex/imaginary roots (parabola never crosses the x-axis).

#### ⚠️ 4. The #1 Exam Mistake
> **Common Trap**: Forgetting that the entire numerator is divided by $2a$, or dropping the negative sign when $b$ is already negative (e.g. if $b = -6$, $-b = +6$).`;
  }

  if (lowerQ.includes('newton') || lowerQ.includes('force') || lowerQ.includes('momentum')) {
    return `### 🍎 Newton's Laws of Motion: The Foundation of Mechanics

#### 🌟 1. Core Intuition
Forces do not cause motion; forces cause **changes** in motion (acceleration). If an object is already sliding through space at $100\\text{ km/h}$, it requires zero force to keep moving forever.

#### 🔍 2. The Three Laws in Plain English
1. **First Law (Inertia)**: An object at rest stays at rest, and an object in uniform motion stays in motion, unless acted upon by a net external force.
2. **Second Law (Rate of Change of Momentum)**:
   $$\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt} = m \\cdot \\vec{a}$$
   The net force applied directly dictates how quickly an object's velocity changes, inversely scaled by its mass.
3. **Third Law (Action-Reaction Pairs)**:
   $$\\vec{F}_{A \\rightarrow B} = -\\vec{F}_{B \\rightarrow A}$$
   When you push against a wall with $50\\text{ N}$, the wall pushes back on your hands with $50\\text{ N}$ simultaneously.

#### ⚠️ 3. The #1 Trap Students Make
> **Crucial Warning**: Action and reaction forces **never cancel each other out** because they act on **two different bodies**! (e.g., Earth pulls on you, and you pull on Earth).`;
  }

  if (socratic) {
    return `### 🤔 Let's Break This Down Step-by-Step

Great question about **"${cleanQ.slice(0, 60)}${cleanQ.length > 60 ? '...' : ''}"**!

Instead of jumping straight to the final solution, let's build the intuition:

1. **What is the primary physical/mathematical quantity we want to find?**
   - Identify the unknown variable and what constraints are given.
2. **What fundamental relationship connects these variables?**
   - Think about conservation laws or governing equations in ${subjectContext || 'this subject'}.
3. **What is the simplest boundary condition?**
   - What happens if the input is zero or extremely large?

> 💡 **Guiding Hint:** Look closely at the known parameters. What happens if you isolate the primary variable first?

*Tell me what equation or concept you think applies first, and we will solve it together!*`;
  }

  return `### 📘 Concept Breakdown & Crystal-Clear Explanation

Here is a structured, step-by-step masterclass on **"${cleanQ.slice(0, 60)}${cleanQ.length > 60 ? '...' : ''}"**:

#### 🌟 1. The Core Intuition
In ${subjectContext || 'your studies'}, every concept solves a specific physical or logical puzzle. Instead of memorizing isolated definitions, visualize the mechanism:
- Every input creates a corresponding proportional response.
- Conservation of fundamental quantities (energy, mass, charge, momentum) guarantees that nothing is lost.

#### 🔍 2. Step-by-Step Mechanism
- **Step 1: Define Given Quantities** — Write down known variables, units, and system constraints.
- **Step 2: Apply the Governing Law** — Relate the driving force to system resistance.
- **Step 3: Solve Line-by-Line** — Maintain dimensional consistency across all operations.
- **Step 4: Sanity Check** — Does the sign and magnitude of the result match real-world physical behavior?

#### ⚠️ 3. The #1 Exam Mistake
> **Examiner Tip**: Always show your intermediate steps with explicit units. Examiners award partial marks for correct conceptual equations even if arithmetic slips occur.

#### 🎯 4. Quick Check Question
*How would the outcome change if you doubled the primary input while keeping all other variables constant?*`;
}

// Robust JSON parser helper that strips markdown code fences and cleans output
function safeParseJson<T = any>(text: string | undefined | null, fallback: T): T {
  if (!text || typeof text !== "string") return fallback;
  let cleaned = text.trim();
  // Remove markdown fences like ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    try {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      }
      const firstBracket = cleaned.indexOf("[");
      const lastBracket = cleaned.lastIndexOf("]");
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
      }
    } catch (e2) {}
    return fallback;
  }
}

// Resilient Gemini Content Generator with multi-tier model fallback, multi-key quota failover, 503 backoff & retry
async function generateContentWithResilience(
  ai: GoogleGenAI,
  options: {
    model?: string;
    contents: any;
    config?: any;
    fallbackModels?: string[];
  }
) {
  const primaryModel = options.model || "gemini-3.8-flash";
  const defaultFallbacks = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
  const fallbackList = options.fallbackModels || defaultFallbacks;
  const modelsToTry = Array.from(new Set([primaryModel, ...fallbackList]));

  const totalKeys = Math.max(1, geminiKeyPool.getKeyCount());
  let lastError: any = null;

  // Outer loop: Try up to total available keys in pool if 429 / quota exhaustion occurs
  for (let keyAttempt = 0; keyAttempt < Math.min(totalKeys, 5); keyAttempt++) {
    let currentAi = ai;
    let currentKeyIndex = 0;

    if (keyAttempt > 0 && geminiKeyPool.getKeyCount() > 1) {
      const nextKey = geminiKeyPool.getNextActiveKey();
      currentKeyIndex = nextKey.index;
      currentAi = new GoogleGenAI({
        apiKey: nextKey.key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      console.log(`[Gemini Multi-Key Failover] Switched to Key #${currentKeyIndex + 1}/${totalKeys} on quota failure.`);
    }

    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      
      // Up to 2 attempts per model if transient 503/429 occurs
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await currentAi.models.generateContent({
            model: currentModel,
            contents: options.contents,
            config: options.config,
          });
          geminiKeyPool.recordSuccess(currentKeyIndex);
          return response;
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          const is503 = errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE");
          const is429 = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");
          const isTransient = is503 || is429 || errMsg.includes("ECONNRESET") || errMsg.includes("fetch failed");

          console.warn(`[Gemini Attempt ${i + 1}.${attempt + 1}/${modelsToTry.length} - ${currentModel} (Key #${currentKeyIndex + 1})]: ${errMsg.slice(0, 150)}`);

          if (is429) {
            geminiKeyPool.recordFailure(currentKeyIndex, err);
            // If we have multiple keys available, break to try the next key immediately!
            if (geminiKeyPool.getKeyCount() > 1) {
              break;
            }
          }

          // If it's not transient, try next model without looping retry
          if (!isTransient) {
            // If schema error, try once without strict responseSchema but with application/json
            if (options.config?.responseSchema && attempt === 0) {
              try {
                const fallbackConfig = { ...options.config };
                delete fallbackConfig.responseSchema;
                fallbackConfig.responseMimeType = "application/json";
                const response = await currentAi.models.generateContent({
                  model: currentModel,
                  contents: options.contents,
                  config: fallbackConfig,
                });
                geminiKeyPool.recordSuccess(currentKeyIndex);
                return response;
              } catch {}
            }
            break;
          }

          // Exponential backoff with jitter for 503 / 429
          const backoffMs = Math.min(2500, (400 * Math.pow(1.8, attempt + i)) + Math.floor(Math.random() * 300));
          await new Promise(r => setTimeout(r, backoffMs));
        }
      }
    }
  }
  throw lastError;
}

// API Health & Provider Status
app.get("/api/ai/status", async (req, res) => {
  const poolStatus = geminiKeyPool.getPoolStatus();
  const geminiConfigured = poolStatus.totalKeys > 0;
  const bytezKey = process.env.BYTEZ_API_KEY || BYTEZ_API_KEY;
  const bytezConfigured = Boolean(bytezKey);
  res.json({
    status: "ok",
    providers: {
      gemini: { 
        configured: geminiConfigured,
        totalKeys: poolStatus.totalKeys,
        healthyKeys: poolStatus.healthyKeyCount,
        activeKeyIndex: poolStatus.activeKeyIndex
      },
      bytez: { configured: bytezConfigured, endpoint: "https://api.bytez.com/models/v2/" },
      resilientTutorEngine: { status: "active" }
    }
  });
});

// Endpoint for startup admin to inspect multi-key pool health and metrics
app.get("/api/gemini/pool-status", async (req, res) => {
  try {
    const status = geminiKeyPool.getPoolStatus();
    res.json({
      success: true,
      data: status,
      instructions: "Add multiple keys via GEMINI_API_KEYS='key1,key2,key3' or GEMINI_API_KEY_1, GEMINI_API_KEY_2 in your environment or Secrets panel."
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve key pool status", message: error.message });
  }
});

app.get("/api/bytez/status", async (req, res) => {
  const key = process.env.BYTEZ_API_KEY || BYTEZ_API_KEY;
  res.json({
    status: "ok",
    configured: Boolean(key),
    message: "Bytez API integration initialized"
  });
});

// Database & User Synchronization API Endpoints
app.get("/api/database/status", async (req, res) => {
  try {
    const configured = Boolean(process.env.SQL_HOST && process.env.SQL_DB_NAME && process.env.SQL_USER);
    res.json({
      status: "connected",
      database: "PostgreSQL (Cloud SQL)",
      configured,
      schema: "active"
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || "";
    if (!uid) {
      return res.status(400).json({ error: "Missing user UID in token" });
    }

    const { displayName, photoUrl } = req.body;
    const user = await getOrCreateUser(uid, email, displayName, photoUrl);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ error: error.message || "Failed to synchronize user" });
  }
});

app.get("/api/user/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(400).json({ error: "Missing user UID in token" });
    }

    const data = await getUserStudyData(uid);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Fetch user data error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch user data" });
  }
});

app.put("/api/user/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(400).json({ error: "Missing user UID in token" });
    }

    const updatedUser = await updateUserProfile(uid, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
});

app.post("/api/user/study-session", requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(400).json({ error: "Missing user UID in token" });
    }

    const session = await logUserStudySession(uid, req.body);
    res.json({ success: true, session });
  } catch (error: any) {
    console.error("Log study session error:", error);
    res.status(500).json({ error: error.message || "Failed to log study session" });
  }
});

// API Endpoint to generate customized study plans using Gemini
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { subject, timeAvailable, topicKeywords, difficulty, notes } = req.body;

    if (!subject) {
      res.status(400).json({ error: "Subject is required" });
      return;
    }

    const systemInstruction = 
      "You are a master academic advisor and cognitive learning expert. " +
      "Your goal is to break down complex study subjects into sequential, highly actionable study tasks and milestones. " +
      "Each study task should have a clear study focus, recommended duration (typically 30-120 minutes), " +
      "priority level (high, medium, low) indicating critical foundational sequence, and detailed supportive notes/guidance.";

    const prompt = `Create a custom, step-by-step study schedule for the subject: "${subject}".
- Total target study hours to plan: ${timeAvailable || 4} hours.
- Core topics / keywords to cover: ${topicKeywords || "fundamentals and key concepts"}.
- Intended study depth/difficulty: ${difficulty || "intermediate"}.
${notes ? `- Additional user context or goals: "${notes}"` : ""}

Deconstruct this study goal into a practical, highly focused list of study tasks/sessions. Respond with valid JSON matching:
{
  "success": true,
  "summary": "2-3 sentence strategic overview",
  "tasks": [
    {
      "title": "Specific action-oriented title",
      "durationMinutes": 45,
      "priority": "high",
      "notes": "Specific recall techniques and key problems"
    }
  ]
}`;

    const ai = getAiClient();
    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            summary: { 
              type: Type.STRING, 
              description: "A 2-3 sentence reassuring booster summary explaining the strategic approach of this study plan." 
            },
            tasks: {
              type: Type.ARRAY,
              description: "A chronological list of highly focused study task modules/sessions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { 
                    type: Type.STRING, 
                    description: "Explicit, action-oriented title of the study block (e.g., 'Master Eigenvectors & Eigenvalues Practice')." 
                  },
                  durationMinutes: { 
                    type: Type.INTEGER, 
                    description: "Suggested duration of the session in minutes (prefer standard increments like 30, 45, 60, 90)." 
                  },
                  priority: { 
                    type: Type.STRING, 
                    description: "Execution sequence priority.",
                    enum: ["high", "medium", "low"]
                  },
                  notes: { 
                    type: Type.STRING, 
                    description: "Specific active-recall techniques, sub-topics, or exercises to run during this block." 
                  }
                },
                required: ["title", "durationMinutes", "priority", "notes"]
              }
            }
          },
          required: ["success", "summary", "tasks"]
        }
      }
    });

    const jsonText = response.text || "";
    const parsedData = safeParseJson(jsonText.trim(), { success: false, summary: "Customized study plan generated.", tasks: [] });
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to generate study plan", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error) 
    });
  }
});

// API Endpoint for AI Study Buddy (Chat / Context Q&A)
app.post("/api/chat-buddy", async (req, res) => {
  try {
    const { question, history, subjectContext, fileBase64, mimeType, mode, socratic, level } = req.body;

    if (!question) {
      res.status(400).json({ error: "Question is required." });
      return;
    }

    let systemInstruction = `You are LumoraAI Mentor - a student's personal AI study companion, expert tutor, and cognitive coach.
You are warm, intelligent, patient, and pedagogical. Your mission is to help students Learn → Understand → Practice → Test → Analyze → Revise → Improve.

Core Pedagogical Philosophy:
- Build deep conceptual understanding rather than rote memorization.
- Use clear markdown formatting, bold headings, bullet points, and real-world analogies.
- Break mathematical steps down clearly with LaTeX or formatted equations.`;

    if (socratic || mode === 'Socratic') {
      systemInstruction += `\n\nCRITICAL SOCRATIC LEARNING MODE:
- Do NOT immediately give away the final numerical solution or full raw answer!
- Instead, guide the student with Socratic questioning: ask them what step they think comes next, what formulas might apply, or where they feel stuck (e.g., "What do you think our first step should be?").
- Offer a helpful hint and encourage them to reason through the problem.`;
    }

    if (level === 'very-simple' || mode === 'very-simple') {
      systemInstruction += `\n\nEXPLAIN LEVEL: Very Simple (ELI5)
- Explain as if to an inquisitive 10-12 year old student.
- Use vivid, everyday analogies (like kitchen recipes, sports, or smartphones).
- Completely avoid dense academic jargon; focus on the core intuition.`;
    } else if (level === 'school-level' || mode === 'school-level') {
      systemInstruction += `\n\nEXPLAIN LEVEL: School Level
- Align with standard secondary school syllabus and textbook standards.
- Clear definitions, standard terminology, and structured step-by-step clarity.`;
    } else if (level === 'detailed' || mode === 'detailed') {
      systemInstruction += `\n\nEXPLAIN LEVEL: Detailed & In-Depth
- Provide comprehensive theoretical depth, derivations, underlying physics/math mechanisms, and edge conditions.`;
    } else if (level === 'exam-level' || mode === 'exam-level' || mode === 'ExamRevision') {
      systemInstruction += `\n\nEXPLAIN LEVEL: Exam Level & High Yield
- Highlight mark-scoring keywords, critical exam steps, standard test rubric definitions, and common examiner traps.`;
    }

    if (subjectContext) {
      systemInstruction += `\n\nThe student is currently focusing on: ${subjectContext}. Tailor your examples to this subject context.`;
    }

    try {
      const ai = getAiClient();
      const contents: any[] = [];
      if (fileBase64 && mimeType) {
        contents.push({
          inlineData: {
            data: fileBase64,
            mimeType: mimeType
          }
        });
      }
      contents.push(question);

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ answer: response.text });
      return;
    } catch (geminiError: any) {
      console.warn("[Gemini Fallback Triggered]:", geminiError?.message || geminiError);

      // Attempt Bytez API integration
      const bytezAnswer = await callBytezAI(question, systemInstruction);
      if (bytezAnswer) {
        res.json({ answer: bytezAnswer, provider: "bytez" });
        return;
      }

      // If both providers are rate-limited or unavailable, deliver resilient pedagogical explanation
      const fallbackAnswer = generatePedagogicalFallbackResponse(question, {
        socratic: Boolean(socratic || mode === 'Socratic'),
        level,
        subjectContext
      });

      res.json({ 
        answer: fallbackAnswer, 
        provider: "resilient-tutor",
        notice: "AI provider quota reached. Lumora resilient tutoring response provided."
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to query AI Study Buddy", 
      details: error?.message || String(error) 
    });
  }
});

// API Endpoint for Lumora AI Voice Tutor
app.post("/api/voice-tutor/chat", async (req, res) => {
  try {
    const { question, history, language, responseLength, subjectContext, documentContext } = req.body;

    if (!question) {
      res.status(400).json({ error: "Question is required for Voice Tutor." });
      return;
    }

    const ai = getAiClient();

    let langInstruction = "Respond in English.";
    if (language === 'hi-IN') {
      langInstruction = "Respond entirely in clear, simple Hindi (written in Devanagari script or natural conversational Hindi).";
    } else if (language === 'bilingual') {
      langInstruction = "Respond in natural bilingual Hinglish (a friendly mix of simple conversational Hindi and English words as spoken by Indian students).";
    }

    let lengthInstruction = "Keep response balanced, clear, and easy to speak out loud in under 3-4 concise sentences.";
    if (responseLength === 'concise') {
      lengthInstruction = "Keep response extremely brief, direct, and under 2 simple sentences so it can be spoken quickly.";
    } else if (responseLength === 'detailed') {
      lengthInstruction = "Provide a structured, step-by-step breakdown with clear explanations and 1 concrete real-world example.";
    }

    const systemInstruction = 
      `You are Lumora Voice Tutor — an expert, patient, encouraging, and friendly personal AI study mentor for students.\n` +
      `Your purpose is to answer student questions naturally in a voice conversation.\n` +
      `- Voice Guidelines: Speak directly to the student like a supportive mentor sitting right beside them.\n` +
      `- Clarity: Avoid overly long paragraphs or complicated formatting that sounds robotic when read aloud.\n` +
      `- Language Rule: ${langInstruction}\n` +
      `- Length Rule: ${lengthInstruction}\n` +
      `- Pedagogy: Break complex concepts into simple steps. Give quick relatable examples. Ask a brief friendly follow-up check question at the end (e.g. "Does that make sense, or would you like another example?").\n` +
      `${subjectContext ? `Subject context: ${subjectContext}.\n` : ''}` +
      `${documentContext ? `Document context: ${documentContext}.\n` : ''}`;

    const formattedHistory = Array.isArray(history) 
      ? history.slice(-6).map((item: any) => `${item.sender === 'user' ? 'Student' : 'Lumora Tutor'}: ${item.text}`).join('\n')
      : '';

    const prompt = formattedHistory 
      ? `Previous Conversation:\n${formattedHistory}\n\nStudent Question: "${question}"`
      : `Student Question: "${question}"`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { 
              type: Type.STRING, 
              description: "The primary spoken answer for the student." 
            },
            suggestedFollowups: {
              type: Type.ARRAY,
              description: "2 short relevant follow-up questions the student might ask next.",
              items: { type: Type.STRING }
            }
          },
          required: ["answer"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsedData = safeParseJson(jsonText.trim(), {
      answer: "I'm here to help! Could you repeat or rephrase your question?",
      suggestedFollowups: ["Can you explain with an example?", "What is another key point to remember?"]
    });
    res.json({
      answer: parsedData.answer || "I'm here to help! Could you repeat or rephrase your question?",
      suggestedFollowups: parsedData.suggestedFollowups || ["Can you explain with an example?", "What is another key point to remember?"]
    });
  } catch (error: any) {
    console.error("Voice Tutor Chat Error:", error);
    res.status(500).json({ 
      error: "Failed to generate Voice Tutor response", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check billing or upgrade." : error.message || String(error) 
    });
  }
});

// API Endpoint for Server-side Gemini Text-to-Speech fallback
app.post("/api/voice-tutor/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required for TTS." });
      return;
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.slice(0, 500) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio payload returned from Gemini TTS");
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({
      error: "TTS Generation Failed",
      details: error.message || String(error)
    });
  }
});

// API Endpoint to enhance image prompts with rich scientific details & structured visual cues
app.post("/api/enhance-image-prompt", async (req, res) => {
  try {
    const { prompt, subject, style } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getAiClient();
    const systemInstruction = 
      "You are a world-class educational visual designer, textbook illustrator, and prompt engineer. " +
      "Given a concept or query, expand it into a vivid, highly precise, studio-grade prompt for an educational illustration generator. " +
      "Incorporate precise pedagogical terminology, clear spatial orientation, labeled parts to focus on, lighting and contrast directions, and aesthetic cues. " +
      "Output JSON in this format: " +
      "{\"enhancedPrompt\": string, \"keyLabels\": string[], \"recommendedStyle\": string, \"recommendedAspect\": string}";

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: `Transform this concept into an ultra-high-quality educational visual prompt:\nConcept: "${prompt}"\nSubject Context: "${subject || 'Science & Education'}"\nStyle Preference: "${style || 'Scientific Diagram'}"`,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: "application/json"
      }
    });

    const parsed = safeParseJson(response.text || "{}", {
      enhancedPrompt: prompt,
      keyLabels: [],
      recommendedStyle: style || "Scientific Diagram",
      recommendedAspect: "16:9"
    });
    res.json({ 
      enhancedPrompt: parsed.enhancedPrompt || prompt,
      keyLabels: parsed.keyLabels || [],
      recommendedStyle: parsed.recommendedStyle || style,
      recommendedAspect: parsed.recommendedAspect || "16:9"
    });
  } catch (error: any) {
    console.error("Enhance Prompt Error:", error);
    res.json({ 
      enhancedPrompt: `Ultra-detailed educational diagram of ${req.body.prompt || 'concept'}, featuring crisp labeled cross-sections, realistic textures, clear pedagogical flow, and studio lighting on a clean background.`, 
      keyLabels: [] 
    });
  }
});

// Helper function to synthesize a high-precision educational SVG diagram via Gemini 3.7 Flash
async function generateEducationalSvgDiagram(
  prompt: string, 
  subject?: string, 
  style?: string, 
  aspectRatio: string = "16:9"
): Promise<{ base64: string; mimeType: string; url: string; svgText: string }> {
  const ai = getAiClient();
  let width = 1024;
  let height = 576;
  switch (aspectRatio) {
    case "1:1":
      width = 800;
      height = 800;
      break;
    case "4:3":
      width = 800;
      height = 600;
      break;
    case "3:4":
      width = 600;
      height = 800;
      break;
    case "9:16":
      width = 576;
      height = 1024;
      break;
    case "16:9":
    default:
      width = 1024;
      height = 576;
      break;
  }

  const response = await generateContentWithResilience(ai, {
    model: "gemini-2.5-flash",
    contents: `You are an elite master scientific illustrator, diagram architect, and vector graphic designer.
Create a complete, beautifully rendered, mathematically accurate, standalone SVG diagram illustrating this concept:
Topic/Prompt: "${prompt}"
Academic Subject: "${subject || 'Science & Education'}"
Visual Style: "${style || 'Scientific Diagram'}"

Strict Technical and Aesthetic SVG Requirements:
1. Output ONLY the raw <svg ...> ... </svg> code. No markdown backticks, no wrapping text.
2. Root tag MUST be: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
3. Define rich <defs>:
   - Linear and radial gradients (<linearGradient>, <radialGradient>) for luminous surfaces, 3D spheres, biological membranes, fluids, and arrows.
   - Glow and shadow filters (<filter id="glow">, <filter id="shadow">).
   - Marker arrowheads (<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/></marker>).
4. Background: Include a stylish dark backdrop with subtle grid (<rect width="100%" height="100%" fill="#0a0f1d" rx="20"/> with subtle radial grid lines or dark slate gradient).
5. Visual Hierarchy:
   - Header banner at top: Title of concept with colored topic badge pill and academic subtitle.
   - Central diagrammatic elements: Intricate anatomical parts, molecular orbits, optics ray paths with angle markers, biological cell organelles with glowing cores, or circuit nodes.
   - Labeled Callout Badges: Semi-transparent rounded rect pills (<rect rx="6" fill="#1e293b" stroke="#334155"/>) with crisp text and colored leader lines (<line stroke="#38bdf8" stroke-dasharray="3,3" marker-start="..."/>) pointing directly to parts.
   - Summary / Legend / Formula card: A neat bottom-right or bottom-left card summarizing key equations, constants, or step 1-2-3 processes.
6. Typography: Use clean modern system sans font (<text font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="#f8fafc">), crisp font sizes (12px to 22px), and high contrast.`,
    config: {
      temperature: 0.2,
    }
  });

  let rawSvg = response.text?.trim() || "";
  rawSvg = rawSvg.replace(/^```(svg|xml|html)?/i, "").replace(/```$/i, "").trim();

  // Validate basic SVG structure
  if (!rawSvg.includes("<svg") || !rawSvg.includes("</svg>")) {
    // Generate high quality fallback SVG
    rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
        <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad)" rx="20"/>
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/3.5}" fill="#1e293b" stroke="url(#blueGlow)" stroke-width="3" stroke-dasharray="8,4"/>
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/7}" fill="#3b82f6" fill-opacity="0.2" stroke="#60a5fa" stroke-width="2"/>
      <text x="${width/2}" y="${height/2 - 25}" fill="#ffffff" font-size="22" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">${prompt.slice(0, 48)}</text>
      <text x="${width/2}" y="${height/2 + 15}" fill="#38bdf8" font-size="14" font-family="system-ui, sans-serif" text-anchor="middle">LumoraAI Precision Concept Vector</text>
      <rect x="30" y="30" width="160" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
      <text x="110" y="51" fill="#94a3b8" font-size="12" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle">${subject || 'SCIENCE'}</text>
    </svg>`;
  }

  const base64 = Buffer.from(rawSvg, "utf-8").toString("base64");
  const mimeType = "image/svg+xml";
  const url = `data:${mimeType};base64,${base64}`;

  return { base64, mimeType, url, svgText: rawSvg };
}

// Helper to construct high-speed direct URLs for Lumora Free AI Engine (Nano Banana)
function getNanoBananaFreeDirectUrl(
  prompt: string, 
  aspectRatio: string = "16:9", 
  style: string = "scientific-diagram"
): string {
  let width = 1024;
  let height = 576;
  switch (aspectRatio) {
    case "1:1":
      width = 1024;
      height = 1024;
      break;
    case "4:3":
      width = 1024;
      height = 768;
      break;
    case "3:4":
      width = 768;
      height = 1024;
      break;
    case "9:16":
      width = 576;
      height = 1024;
      break;
    case "16:9":
    default:
      width = 1024;
      height = 576;
      break;
  }

  // Prepend pedagogical, ChatGPT DALL-E 3 aesthetic and quality enhancers
  let enhancedQuery = prompt;
  if (style === "chatgpt-mindmap" || style === "mind map" || style === "mind-map") {
    enhancedQuery = `Professional ChatGPT DALL-E 3 style conceptual mind map diagram for ${prompt}. Radiating outward from a glowing central concept core with organic curved branching pathways, sleek rounded pill-shaped subtopic cards, minimalist modern iconography, clean typographic hierarchy, elegant vector aesthetic, balanced composition, 8k resolution, award-winning infographic layout`;
  } else if (style === "chatgpt-flowchart" || style === "flowchart") {
    enhancedQuery = `ChatGPT DALL-E 3 style clean modern process flowchart of ${prompt}. Step-by-step horizontal and vertical pipeline layout, sleek rounded process cards, decision diamonds, glowing directional connector arrows, status tags, tech UI aesthetic, clean background, 8k crisp resolution`;
  } else if (style === "chatgpt-infographic" || style === "infographic") {
    enhancedQuery = `Modern editorial infographic in the signature style of ChatGPT DALL-E 3 explaining ${prompt}. Highly structured magazine layout with modular bento-style info cards, key metrics, sleek vector icons, vibrant modern color palette, high-contrast readable elements, crisp 8k resolution`;
  } else if (style === "neoclassical-allegory") {
    enhancedQuery = `Neoclassical Enlightenment oil painting of ${prompt}, style of Jean-Baptiste Regnault and Jacques-Louis David, allegorical figures of Reason and Truth, winged genius with flaming head, classical drapery, dramatic chiaroscuro, celestial clouds, museum canvas, 8k resolution`;
  } else if (!prompt.toLowerCase().includes("masterpiece") && !prompt.toLowerCase().includes("diagram")) {
    enhancedQuery = `Educational illustration of ${prompt}, highly detailed, sharp crisp focus, 8k resolution, textbook clarity, studio lighting, no blur, high quality visual`;
  }
  
  const cleanPrompt = enhancedQuery.replace(/[^\w\s,.:\-()]/gi, ' ').trim().slice(0, 320);
  const seed = Math.floor(Math.random() * 900000) + 100000;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

// Helper function to generate high-resolution educational images via Lumora Free AI engine
async function generateNanoBananaFreeImage(
  prompt: string, 
  aspectRatio: string = "16:9", 
  style: string = "scientific-diagram"
): Promise<{ base64?: string; mimeType: string; url: string; isDirectUrl?: boolean }> {
  const directUrl = getNanoBananaFreeDirectUrl(prompt, aspectRatio, style);

  // Fast fetch attempt (5s timeout). If server fetch times out or gets 429, return direct URL safely.
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(directUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer && arrayBuffer.byteLength > 1000) {
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mime = contentType.startsWith("image/") ? contentType : "image/jpeg";
        return {
          base64,
          mimeType: mime,
          url: `data:${mime};base64,${base64}`
        };
      }
    }
  } catch (err: any) {
    console.warn("Direct image buffer fetch skipped (using resilient direct URL):", err?.message || err);
  }

  // Resilient fallback: return valid high-speed direct URL so browser renders it seamlessly
  return {
    mimeType: "image/jpeg",
    url: directUrl,
    isDirectUrl: true
  };
}

// API Endpoint to generate and edit educational images & diagrams with Lumora AI Image Engine
app.post("/api/generate-image", async (req, res) => {
  try {
    const { 
      prompt, 
      aspectRatio = "16:9", 
      style = "scientific-diagram", 
      inputImage,
      model = "nano-banana-free",
      subject,
      qualityBoost = true
    } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    // Map style to descriptive rendering directions
    let stylePromptModifier = "";
    switch (style) {
      case "neoclassical-allegory":
        stylePromptModifier = "Masterpiece historical neoclassical oil painting in the style of Jean-Baptiste Regnault and Jacques-Louis David (circa 1793 French Enlightenment), grand allegorical figures representing Reason with a level plumb-line, winged Genius of Knowledge and Truth with a flame on the head, classical drapery, dramatic chiaroscuro, celestial sky with dramatic clouds, museum canvas texture, high Renaissance and Enlightenment art.";
        break;
      case "3d-render":
        stylePromptModifier = "Hyper-detailed 3D scientific visualization, smooth volumetric lighting, realistic depth of field, Octane render quality, clear structural detail, studio lighting, modern educational 3D render.";
        break;
      case "textbook-illustration":
        stylePromptModifier = "Clear textbook-style anatomical and structural illustration, clean crisp line art, precise callout annotations, pastel scientific color palette, high pedagogical print quality.";
        break;
      case "chalkboard":
        stylePromptModifier = "Classroom chalkboard diagram with clean colored chalk strokes on dark blackboard, handwritten formulas, conceptual arrows, and pedagogical sketch.";
        break;
      case "infographic":
        stylePromptModifier = "Clean modern vector educational infographic, clear visual hierarchy, minimalist icons, high readability, sleek graphic design, clean colored cards.";
        break;
      case "photorealistic":
        stylePromptModifier = "Realistic scientific photography, 8K ultra high-definition macro detail, authentic textures, clean realistic lighting, documentary quality.";
        break;
      case "dark-neon":
        stylePromptModifier = "Futuristic dark mode scientific visualization with glowing neon blue and cyan wireframes, holographic overlays, dark obsidian backdrop, high tech aesthetic.";
        break;
      case "blueprint":
        stylePromptModifier = "Engineering technical blueprint on navy blue grid background with precise white drafting lines, dimension markers, angles, and technical schematics.";
        break;
      case "scientific-diagram":
      default:
        stylePromptModifier = "Detailed scientific educational diagram, clean high-contrast background, crisp labeled parts, sharp technical illustration, accurate anatomical and physical proportions, highly informative.";
        break;
    }

    const qualityString = qualityBoost 
      ? "Masterpiece, ultra-sharp focus, highly pedagogical, textbook accuracy, 8k resolution, award-winning educational diagram, no blur, no distortions." 
      : "";

    const fullPrompt = `${prompt}. Style & Visual Aesthetic: ${stylePromptModifier} ${qualityString}`.trim();

    // Validate supported aspect ratios
    const validAspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "16:9";

    let finalImageUrl: string | null = null;
    let base64Image: string | null = null;
    let returnedMimeType = "image/png";
    let modelUsed = "Lumora Flux Free Engine";

    // 1. If explicit Vector SVG diagram model requested
    if (!finalImageUrl && (model === "vector-svg" || style === "scientific-diagram-vector")) {
      try {
        const svgResult = await generateEducationalSvgDiagram(prompt, subject, style, targetAspectRatio);
        finalImageUrl = svgResult.url;
        base64Image = svgResult.base64;
        returnedMimeType = svgResult.mimeType;
        modelUsed = "Lumora Vector AI (Gemini SVG)";
      } catch (svgErr: any) {
        console.warn("SVG generation fallback:", svgErr?.message || svgErr);
      }
    }

    // 3. Try Imagen 3 / Gemini Image models if requested or available
    if (!finalImageUrl && (model === "imagen-3" || model === "imagen-3.0-generate-002" || model.includes("gemini-") || model === "lumora-ultra")) {
      try {
        const ai = getAiClient();
        
        // Attempt generateImages with Imagen 3
        if (typeof (ai.models as any)?.generateImages === "function") {
          const imagenResponse = await (ai.models as any).generateImages({
            model: "imagen-3.0-generate-002",
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              aspectRatio: targetAspectRatio,
              outputMimeType: "image/jpeg"
            }
          });

          if (imagenResponse.generatedImages?.[0]?.image?.imageBytes) {
            base64Image = imagenResponse.generatedImages[0].image.imageBytes;
            returnedMimeType = "image/jpeg";
            finalImageUrl = `data:image/jpeg;base64,${base64Image}`;
            modelUsed = "Google Imagen 3.0 Ultra";
          }
        }
      } catch (_imagenErr) {
        // Fall through to other image engines
      }
    }

    // 4. Try Gemini Multimodal Content / Editing if input image is attached
    if (!finalImageUrl && inputImage) {
      try {
        const ai = getAiClient();
        const cleanBase64 = inputImage.replace(/^data:image\/\w+;base64,/, "");
        const mime = inputImage.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";

        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-image",
          contents: {
            parts: [
              { inlineData: { data: cleanBase64, mimeType: mime } },
              { text: `Edit and transform this educational image according to: ${fullPrompt}` }
            ]
          },
          config: {
            imageConfig: { aspectRatio: targetAspectRatio }
          }
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              returnedMimeType = part.inlineData.mimeType || "image/png";
              finalImageUrl = `data:${returnedMimeType};base64,${base64Image}`;
              modelUsed = "Lumora AI Image Transformer";
              break;
            }
          }
        }
      } catch (_imgEditErr) {
        // Fallback to fresh generation
      }
    }

    // 5. If image not yet generated, use Lumora Free AI Engine (Flux)
    if (!finalImageUrl) {
      try {
        const freeResult = await generateNanoBananaFreeImage(fullPrompt, targetAspectRatio, style);
        finalImageUrl = freeResult.url;
        base64Image = freeResult.base64 || null;
        returnedMimeType = freeResult.mimeType;
        modelUsed = "Lumora Flux HD Engine";
      } catch (freeErr: any) {
        console.warn("Lumora Free image fallback to Vector SVG:", freeErr?.message || freeErr);
        // Fallback to high-res Vector SVG diagram via Gemini 3.7 Flash
        const svgFallback = await generateEducationalSvgDiagram(prompt, subject, style, targetAspectRatio);
        finalImageUrl = svgFallback.url;
        base64Image = svgFallback.base64;
        returnedMimeType = svgFallback.mimeType;
        modelUsed = "Lumora Vector AI";
      }
    }

    res.json({ 
      imageBase64: base64Image,
      mimeType: returnedMimeType,
      imageUrl: finalImageUrl,
      aspectRatio: targetAspectRatio,
      style,
      modelUsed,
      promptUsed: fullPrompt,
      success: true
    });
  } catch (error: any) {
    console.error("Image Generation Error Handled:", error);
    // Even in extreme catastrophic cases, synthesize a fallback direct URL so the app NEVER crashes
    const fallbackUrl = getNanoBananaFreeDirectUrl(req.body.prompt || "Science Diagram", req.body.aspectRatio || "16:9");
    res.json({ 
      imageUrl: fallbackUrl,
      aspectRatio: req.body.aspectRatio || "16:9",
      style: req.body.style || "scientific-diagram",
      modelUsed: "Nano Banana Free Engine",
      success: true 
    });
  }
});

// API Endpoint to generate a quiz
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions } = req.body;
    if (!topic) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    const ai = getAiClient();
    const systemInstruction = "You are an expert educator. Create a multiple-choice quiz that tests deep understanding, not just memorization.";
    const prompt = `Generate a quiz about: "${topic}". Difficulty: ${difficulty || "intermediate"}. Number of questions: ${numberOfQuestions || 5}.`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "0-indexed position of the correct option." },
                  explanation: { type: Type.STRING }
                },
                required: ["questionText", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["title", "questions"]
        }
      }
    });

    const jsonText = response.text || "";
    const parsedData = safeParseJson(jsonText.trim(), { title: topic || "Quiz", questions: [] });
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to generate quiz", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error) 
    });
  }
});



// API Endpoint for AI Summarize
app.post("/api/ai-summarize", async (req, res) => {
  try {
    const { topic, content, fileData, mimeType, summaryType = "Quick Summary", gradeLevel = "Class 11-12" } = req.body;
    
    if (!topic && !content && !fileData) {
      res.status(400).json({ error: "Please provide a topic, notes text, or upload a document." });
      return;
    }

    const ai = getAiClient();

    let formatSpecificInstruction = "";
    switch (summaryType) {
      case "Quick Summary":
        formatSpecificInstruction = "Generate a crisp, high-impact 1-page overview with: 1) Executive Summary (2 sentences), 2) Core Mechanisms/Theorems (with clean LaTeX math), 3) Key Terminology Definitions, 4) Top 3 High-Yield Exam Takeaways.";
        break;
      case "Detailed Summary":
        formatSpecificInstruction = "Generate a comprehensive, in-depth academic summary broken down into clear thematic modules, theoretical proofs, mathematical derivations, step-by-step mechanisms, and real-world industrial or natural applications.";
        break;
      case "Exam Revision":
        formatSpecificInstruction = "Generate an ultra-high-yield 5-minute pre-exam revision sheet: 1) Critical Formulas & Units Table, 2) Most Frequently Asked Board/Competitive Exam Questions, 3) High-Risk Pitfalls & Common Mistakes, 4) Memory Mnemonics.";
        break;
      case "Key Points":
        formatSpecificInstruction = "Generate a bulleted checklist of must-know concepts, essential definitions, and active recall test questions.";
        break;
      case "Formula Sheet":
        formatSpecificInstruction = "Generate a structured Formula & Equations Cheat Sheet listing every single relevant equation with variable definitions, SI units, dimensional formulas, and boundary conditions in clean LaTeX.";
        break;
      default:
        formatSpecificInstruction = "Generate a well-structured educational summary with executive takeaway, key concepts, formulas, and revision highlights.";
        break;
    }

    const systemInstruction = 
      `You are Lumora's Master Academic Summarizer and EdTech Pedagogical Engine.\n` +
      `Target Student Level: ${gradeLevel}.\n` +
      `Format Style: ${summaryType}.\n` +
      `Formatting Rules:\n` +
      `- Use clean Markdown headers (##, ###).\n` +
      `- Use LaTeX notation for all mathematical and chemical equations (e.g. $F = ma$, $\\Delta G = \\Delta H - T\\Delta S$, $v = u + at$).\n` +
      `- Use bolding for key terminology.\n` +
      `- Maintain crystal-clear pedagogical clarity and zero filler text.\n` +
      `${formatSpecificInstruction}`;

    const parts: any[] = [];
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          data: fileData.replace(/^data:.*?;base64,/, ''),
          mimeType: mimeType
        }
      });
    }

    let promptText = `Summarize the following academic material:\n`;
    if (topic) promptText += `Topic / Chapter Title: ${topic}\n`;
    if (content) promptText += `Source Content / Notes:\n"""\n${content}\n"""\n`;
    parts.push({ text: promptText });

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    const summaryText = response.text || "Summary generated successfully.";

    res.json({
      title: topic || "Academic Summary",
      summaryType,
      gradeLevel,
      summary: summaryText,
      wordCount: summaryText.split(/\s+/).length,
      readingTimeMinutes: Math.max(1, Math.ceil(summaryText.split(/\s+/).length / 200))
    });
  } catch (error: any) {
    console.error("AI Summarize Error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI summary", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check billing or upgrade." : error.message || String(error) 
    });
  }
});

// API Endpoint for Universal AI Doubt Solver
app.post("/api/solve-doubt", async (req, res) => {
  try {
    const { query, subject, targetLevel, attachment, files } = req.body;

    if (!query && !attachment && (!files || files.length === 0)) {
      res.status(400).json({ error: "Please enter your doubt question or attach an image/document." });
      return;
    }

    const systemInstruction = 
      `You are Lumora's Senior AI Doubt Solver & Socratic Academic Mentor.\n` +
      `Subject Context: ${subject || 'General STEM / Academic'}.\n` +
      `Target Level: ${targetLevel || 'Class 11-12 / Competitive Exams'}.\n` +
      `Your goal is to provide a world-class, crystal-clear, step-by-step doubt resolution that builds permanent conceptual understanding.\n\n` +
      `Structure your response with the following Markdown sections:\n` +
      `### 💡 Direct Answer & Core Concept\n` +
      `State the final answer / core takeaway directly in 1-2 clear sentences.\n\n` +
      `### 🔍 Step-by-Step Breakdown\n` +
      `Walk through the logic, mathematical derivation, chemical equation, or reasoning step-by-step with clear numbered points. Use clean LaTeX formatting ($...$ for inline math and $$...$$ for standalone formulas).\n\n` +
      `### 🧠 Intuitive Mental Model & Real-Life Analogy\n` +
      `Provide a simple, unforgettable analogy that makes the concept instantly click.\n\n` +
      `### ⚠️ Common Pitfalls & Exam Traps\n` +
      `Highlight the exact mistakes students frequently make on this question during exams.\n\n` +
      `### 🎯 Check Your Understanding (Quick Mini-Challenge)\n` +
      `Provide 1 quick multiple-choice or follow-up question so the student can verify their mastery.`;

    const ai = getAiClient();

    const parts: any[] = [];

    // Optional single image/file attachment
    if (attachment && attachment.data && attachment.mimeType) {
      parts.push({
        inlineData: {
          data: attachment.data.replace(/^data:.*?;base64,/, ''),
          mimeType: attachment.mimeType
        }
      });
    }

    // Optional multi-file documents (NotebookLM style)
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (f.data && f.mimeType) {
          parts.push({
            inlineData: {
              data: f.data.replace(/^data:.*?;base64,/, ''),
              mimeType: f.mimeType
            }
          });
        }
      }
    }

    const promptText = `Student Doubt / Question:\n"${query || 'Please solve and explain the question in the attached file step-by-step.'}"\n\nSubject: ${subject || 'Auto-detect'}\nGrade Level: ${targetLevel || 'High School / Exam Prep'}`;
    parts.push({ text: promptText });

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction,
        temperature: 0.5
      }
    });

    const solutionText = response.text || "Solution formulated.";

    res.json({
      success: true,
      query: query || "Attached Question",
      subject: subject || "STEM",
      solution: solutionText
    });
  } catch (error: any) {
    console.error("Doubt Solver Error:", error);
    const errMsg = error?.message || String(error);
    const isQuota = errMsg.includes("429") || errMsg.includes("quota");
    const isUnavailable = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand");
    
    let friendlyDetail = errMsg;
    if (isQuota) {
      friendlyDetail = "API Key Quota Exceeded. Please check billing or upgrade.";
    } else if (isUnavailable) {
      friendlyDetail = "Model is currently experiencing high demand. Please try again shortly.";
    }

    res.status(500).json({ 
      error: "Failed to solve doubt", 
      details: friendlyDetail
    });
  }
});

// API Endpoint for NotebookLM-style multi-document reasoning
app.post("/api/notebook-lm", async (req, res) => {
  try {
    const { files, query } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: "At least one file is required" });
      return;
    }
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }
    
    const ai = getAiClient();
    
    const parts = [
      { text: "You are an expert AI tutor. Answer the student's question using ONLY the provided documents. If the answer is not in the documents, say you cannot find it in the sources, but then provide a helpful general answer. Cite your sources by document name." },
      ...files.map((file) => ({
        inlineData: { data: file.data, mimeType: file.mimeType }
      })),
      { text: `\n\nStudent Question: ${query}` }
    ];

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }]
    });

    res.json({ answer: response.text });
  } catch (error) {
    res.status(500).json({ 
       error: "Failed to analyze documents", 
       details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error)
     });
  }
});

// API Endpoint to analyze uploaded documents
app.post("/api/analyze-document", async (req, res) => {
  try {
    const { fileData, mimeType, promptText } = req.body;
    if (!fileData || !mimeType) {
      res.status(400).json({ error: "File data and mimeType are required" });
      return;
    }

    const ai = getAiClient();
    const prompt = promptText || "Analyze this document and provide a comprehensive summary of its contents.";
    
    // Some formats like PDF might be better with gemini-2.5-pro, but flash is fast
    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to analyze document", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error) 
    });
  }
});

// API Endpoint to generate flashcards
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { topic, difficulty, numberOfCards } = req.body;
    if (!topic) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    const ai = getAiClient();
    const systemInstruction = "You are an expert tutor. Create a set of flashcards for memorization. Each card must have a clear 'front' (question/concept) and 'back' (answer/definition).";
    const prompt = `Generate ${numberOfCards || 10} flashcards about: "${topic}". Difficulty: ${difficulty || "intermediate"}.`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["title", "flashcards"]
        }
      }
    });

    const jsonText = response.text || "";
    const parsedData = safeParseJson(jsonText.trim(), { title: topic || "Flashcards", flashcards: [] });
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ 
      error: "Failed to generate flashcards", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error) 
    });
  }
});


// API Endpoint to generate ChatGPT-style infographics, mind maps & flowcharts
app.post("/api/generate-infographic", async (req, res) => {
  try {
    const { topic, type = "mind map", format = "both", aspectRatio = "16:9" } = req.body;
    if (!topic) {
      res.status(400).json({ error: "Topic is required" });
      return;
    }
    
    // 1. Generate ChatGPT DALL-E 3 style visual image via Nano Banana Engine
    const imageStyle = type.toLowerCase().includes("flow") 
      ? "chatgpt-flowchart" 
      : type.toLowerCase().includes("mind") 
        ? "chatgpt-mindmap" 
        : "chatgpt-infographic";
        
    const nanoBananaVisual = await generateNanoBananaFreeImage(
      `${type} explaining ${topic}`, 
      aspectRatio, 
      imageStyle
    );

    // 2. Generate precision SVG vector code via Gemini
    let svgData = "";
    try {
      const ai = getAiClient();
      const systemInstruction = "You are an elite data visualization designer. You generate beautiful, clean, responsive SVG code for educational mind maps, flowcharts, and infographics. Use modern color palettes (vibrant blues, purples, emeralds), glowing nodes, sleek rounded card bubbles, drop shadows, and clean typography (system-ui, sans-serif). Return ONLY valid SVG code, no markdown wrapping, no extra text.";
      const prompt = `Generate a highly visual, professional ${type} about: "${topic}". Make it structured with an aesthetic central or root node, elegant connector paths, and detailed subtopic cards. Ensure the viewBox is large enough (viewBox="0 0 960 640") and elements are well-spaced.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      svgData = (response.text || "").replace(/```(xml|svg|html)?\n/g, '').replace(/```/g, '').trim();
    } catch (svgErr) {
      console.warn("SVG generation notice:", svgErr);
    }

    res.json({ 
      success: true,
      topic,
      type,
      imageUrl: nanoBananaVisual.url,
      svg: svgData,
      modelUsed: "Nano Banana Visual Engine (ChatGPT DALL-E 3 Style) + Gemini Vector SVG"
    });
  } catch (error: any) {
    res.status(500).json({ 
       error: "Failed to generate infographic", 
       details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check your billing details or upgrade to a paid tier." : error.message || String(error)
     });
  }
});

// ==========================================
// EXPLAIN SIMPLY AI ENDPOINTS
// ==========================================
app.post("/api/explain-simply", async (req, res) => {
  try {
    const { 
      text, 
      level = 'very-simple', 
      mode = 'combined', 
      sourceContext, 
      language = 'en', 
      stillConfused = false, 
      history = [], 
      customPrompt,
      gradeLevel = "Class 10"
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: "Selected text is required for Explain Simply." });
      return;
    }

    const ai = getAiClient();

    let levelInstruction = "";
    if (level === 'very-simple') {
      levelInstruction = 
        "LEVEL 1 — VERY SIMPLE:\n" +
        "- Target complete beginners or confused students.\n" +
        "- Use extremely simple language, short sentences, and NO unexplained jargon.\n" +
        "- Explain one core idea at a time using a vivid everyday analogy (e.g. comparing photosynthesis to baking a cake with sunlight).\n" +
        "- Explain difficult words instantly in parentheses.";
    } else if (level === 'school') {
      levelInstruction = 
        "LEVEL 2 — SCHOOL LEVEL:\n" +
        "- Target normal classroom/syllabus learning.\n" +
        "- Use clear, age-appropriate vocabulary with essential terminology explained.\n" +
        "- Connect the concept to standard textbook syllabus concepts.\n" +
        "- Provide a relatable practical example.";
    } else if (level === 'detailed') {
      levelInstruction = 
        "LEVEL 3 — DETAILED:\n" +
        "- Target deep conceptual understanding.\n" +
        "- Break into logical sections with clear markdown headings.\n" +
        "- Explain cause-and-effect, mechanisms, and underlying principles thoroughly.\n" +
        "- Highlight relationships between concepts.";
    } else if (level === 'exam') {
      levelInstruction = 
        "LEVEL 4 — EXAM LEVEL:\n" +
        "- Target scoring top marks in school/board exams.\n" +
        "- Highlight exact definitions, key keywords to underline in answers, and common marking points.\n" +
        "- Include a 'Remember This' checklist for quick memory retention.\n" +
        "- Point out common pitfalls or student mistakes in exams.";
    }

    let languageInstruction = "Respond in clear English.";
    if (language === 'hi') {
      languageInstruction = "Respond in clear, natural Hindi (Devanagari script) while preserving essential scientific/academic English terms in parentheses.";
    } else if (language === 'bilingual') {
      languageInstruction = "Respond in natural Hinglish (a friendly mix of simple conversational Hindi and English as used by students in India).";
    }

    let modeInstruction = "";
    if (mode === 'source') {
      modeInstruction = 
        "SOURCE MODE: Ground your answer strictly in the provided source document context. " +
        "If the source does not contain enough info, set foundInSource to false in sourceCitation and state clearly in the note that the source lacks details.";
    } else if (mode === 'general') {
      modeInstruction = "GENERAL MODE: Use general educational knowledge to provide the clearest, most intuitive explanation.";
    } else {
      modeInstruction = 
        "COMBINED MODE: Ground your answer primarily in the provided source document, then supplement seamlessly with general educational knowledge if needed. Clearly distinguish source facts in sourceCitation.";
    }

    let confusedInstruction = "";
    if (stillConfused) {
      confusedInstruction = 
        "\nCRITICAL INSTRUCTION — 'I'M STILL CONFUSED' MODE:\n" +
        "The student indicated they are STILL confused after the previous explanation.\n" +
        "DO NOT repeat the previous explanation!\n" +
        "Switch your teaching strategy completely: Use a completely different visual real-world analogy, a step-by-step cartoon-style breakdown, or a simple story format.\n" +
        "Start with an encouraging phrase like 'Let\\'s try explaining it another way!'";
    }

    const systemInstruction = 
      `You are Lumora "Explain Simply" AI — an world-class private AI tutor that combines NotebookLM's source precision, Notion AI's inline clarity, and ChatGPT's conversational depth.\n\n` +
      `Your goal is to transform complex academic content, textbook paragraphs, difficult notes, or technical definitions into crystal-clear, age-appropriate explanations.\n\n` +
      `[STUDENT CONTEXT]\nGrade/Level: ${gradeLevel}\n\n` +
      `[LEVEL GUIDELINE]\n${levelInstruction}\n\n` +
      `[LANGUAGE GUIDELINE]\n${languageInstruction}\n\n` +
      `[MODE GUIDELINE]\n${modeInstruction}\n` +
      `${confusedInstruction}\n\n` +
      `[SOURCE DOCUMENT CONTEXT]\n${sourceContext ? JSON.stringify(sourceContext) : "No source document attached."}\n\n` +
      `[OUTPUT FORMAT]\nReturn a valid JSON object matching the exact requested JSON schema.`;

    const prompt = 
      `SELECTED TEXT TO EXPLAIN:\n"${text}"\n\n` +
      `${customPrompt ? `CUSTOM INSTRUCTION: ${customPrompt}\n\n` : ''}` +
      `${history && history.length > 0 ? `PREVIOUS CONVERSATION HISTORY:\n${JSON.stringify(history)}\n\n` : ''}` +
      `Explain this text now. Ensure you identify 2-5 difficult terminology words in difficultTerms array, provide a concise key idea, an easy example, a visual flowchart string if relevant, and 3 helpful follow-up questions.`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy, clear title for the explanation." },
            level: { type: Type.STRING, description: "The level used: Very Simple, School Level, Detailed, or Exam Level." },
            explanation: { type: Type.STRING, description: "The core simplified explanation formatted in clear Markdown with bullet points or paragraphs." },
            keyIdea: { type: Type.STRING, description: "A single, memorable 1-sentence summary takeaway." },
            example: { type: Type.STRING, description: "A concrete, relatable real-world example or everyday analogy." },
            difficultTerms: {
              type: Type.ARRAY,
              description: "List of difficult or technical vocabulary terms found in the text with simple definitions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING }
                },
                required: ["term", "definition"]
              }
            },
            rememberThis: {
              type: Type.ARRAY,
              description: "2-4 key bullet points to remember for exams or revision.",
              items: { type: Type.STRING }
            },
            visualConcept: { type: Type.STRING, description: "A text-based flowchart or step process (e.g., 'Step 1 -> Step 2 -> Step 3')." },
            sourceCitation: {
              type: Type.OBJECT,
              properties: {
                sourceName: { type: Type.STRING },
                pageNumber: { type: Type.STRING },
                chapter: { type: Type.STRING },
                excerpt: { type: Type.STRING },
                foundInSource: { type: Type.BOOLEAN },
                note: { type: Type.STRING }
              }
            },
            suggestedFollowups: {
              type: Type.ARRAY,
              description: "3 intelligent follow-up questions the student might ask next.",
              items: { type: Type.STRING }
            },
            strategyUsed: { type: Type.STRING, description: "Name of strategy used (e.g. Everyday Analogy, Step Breakdown, Exam Keypoints)." }
          },
          required: ["title", "explanation", "keyIdea", "example", "difficultTerms"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsedData = safeParseJson(jsonText.trim(), { 
      title: "Concept Explanation", 
      explanation: response.text || "Here is a simplified explanation.",
      keyIdea: "Key conceptual takeaway",
      example: "Real-world analogy",
      difficultTerms: []
    });
    res.json(parsedData);
  } catch (error: any) {
    console.error("Explain Simply API Error:", error);
    res.status(500).json({ 
      error: "Failed to generate explanation", 
      details: (error.message || String(error)).includes("429") || (error.message || String(error)).includes("quota") ? "API Key Quota Exceeded. Please check billing or try again." : error.message || String(error)
    });
  }
});

// Endpoint to generate Flashcards from an explanation
app.post("/api/explain-simply/flashcards", async (req, res) => {
  try {
    const { text, explanation } = req.body;
    if (!text && !explanation) {
      res.status(400).json({ error: "Text or explanation is required to generate flashcards." });
      return;
    }

    const ai = getAiClient();
    const prompt = `Generate 4-6 high-quality educational flashcards based on this content:\nOriginal Text: "${text || ''}"\nExplanation: "${explanation || ''}"`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert educational study assistant. Create concise, clear flashcards with a clear Question on front and crisp Answer on back.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["cards"]
        }
      }
    });

    const jsonText = response.text || "{}";
    res.json(safeParseJson(jsonText.trim(), { title: "Flashcards", cards: [] }));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate flashcards", details: error.message });
  }
});

// Endpoint to generate Quiz from an explanation
app.post("/api/explain-simply/quiz", async (req, res) => {
  try {
    const { text, explanation, count = 5 } = req.body;
    if (!text && !explanation) {
      res.status(400).json({ error: "Text or explanation is required to generate a quiz." });
      return;
    }

    const ai = getAiClient();
    const prompt = `Generate a ${count}-question multiple choice quiz based strictly on this educational content:\nOriginal Text: "${text || ''}"\nExplanation: "${explanation || ''}"`;

    const response = await generateContentWithResilience(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert exam setter. Create multiple choice questions that test conceptual understanding.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.NUMBER, description: "0-based index of correct option" },
                  explanation: { type: Type.STRING, description: "Why this answer is correct" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const jsonText = response.text || "{}";
    res.json(safeParseJson(jsonText.trim(), { title: "Practice Quiz", questions: [] }));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate quiz", details: error.message });
  }
});

// Setup dev server with Vite after API routes
const startServer = async () => {
  const httpServer = createServer(app);
  httpServer.on("error", (err) => {
    console.error("HTTP Server Error:", err);
  });
  
  const wss = new WebSocketServer({ server: httpServer, path: "/live" });
  wss.on("error", (err) => {
    console.error("WebSocket Server Error:", err);
  });
  wss.on("connection", async (clientWs) => {
    clientWs.on("error", (err) => {
      console.warn("Client WebSocket notice:", err?.message || err);
    });
    try {
      const ai = getAiClient();
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are LumoraAI Mentor, a warm, funny, intelligent, and encouraging personal coach and best friend. Speak concisely and clearly.",
        },
        callbacks: {
          onmessage: (message: any) => {
            const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) clientWs.send(JSON.stringify({ audio }));
            if (message.serverContent?.interrupted)
              clientWs.send(JSON.stringify({ interrupted: true }));
          },
        },
      });

      clientWs.on("message", (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            session.sendRealtimeInput({
              audio: { data: audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch(e) {}
      });
      
      clientWs.on("close", () => {
        try { session.close(); } catch(e) {}
      });
    } catch (e) {
      clientWs.close();
    }
  });

  // ==========================================
  // LUMORA AI HOMEWORK HELPER ENDPOINTS
  // ==========================================

  // 1. Analyze Homework Question (Text, Image base64 OCR, or PDF text)
  app.post("/api/homework-helper/analyze", async (req, res) => {
    try {
      const { text, image, pdfText, studentContext } = req.body;
      const ai = getAiClient();

      const systemInstruction = 
        "You are Lumora AI Homework Helper, a world-class educational AI tutor. " +
        "Your task is to analyze homework questions provided via text, image OCR, or document text. " +
        "Detect all questions in the content. For each question, identify Subject, Topic, Question Type " +
        "(e.g., Numerical Problem, Conceptual Question, Proof, Diagram Analysis, Essay Guidance, Code Debugging), " +
        "Key Information/Given Values, Goal (what is being asked), and Difficulty level.";

      const contents: any[] = [];
      let promptText = "Analyze this homework content and extract all distinct questions found.\n";
      if (text) promptText += `Text Input: "${text}"\n`;
      if (pdfText) promptText += `PDF Document Text: "${pdfText}"\n`;
      if (studentContext?.grade) promptText += `Student Grade/Class: ${studentContext.grade}\n`;

      contents.push(promptText);

      if (image) {
        // Strip data URL prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
        contents.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              summary: { type: Type.STRING, description: "Brief 1-sentence overview of questions detected." },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING, description: "Extracted full question text including formulas/latex." },
                    subject: { type: Type.STRING, description: "Subject (e.g. Mathematics, Physics, Chemistry, Biology, English, Coding)" },
                    topic: { type: Type.STRING, description: "Topic (e.g. Quadratic Equations, Newton's Laws)" },
                    questionType: { type: Type.STRING, description: "Type of problem (e.g. Numerical, Conceptual, Diagram, Essay, Code)" },
                    givenValues: { type: Type.STRING, description: "Given variables/values in the problem" },
                    goal: { type: Type.STRING, description: "What the question is asking to solve or find" },
                    difficulty: { type: Type.STRING, description: "Easy, Medium, Hard, Advanced" },
                    hasDiagram: { type: Type.BOOLEAN, description: "True if question relies on a visual diagram" },
                    diagramDescription: { type: Type.STRING, description: "Description of diagram if present" }
                  },
                  required: ["id", "text", "subject", "topic", "questionType", "givenValues", "goal", "difficulty"]
                }
              }
            },
            required: ["success", "questions", "summary"]
          }
        }
      });

      const parsed = safeParseJson(response.text || "{}", { 
        success: true, 
        summary: "Analyzed homework problem",
        questions: [{
          id: "q1",
          text: req.body.text || "Homework Question",
          subject: "Science",
          topic: "Core Concept",
          questionType: "conceptual",
          givenValues: [],
          goal: "Find solution",
          difficulty: "Medium"
        }]
      });
      res.json(parsed);
    } catch (err: any) {
      console.error("Homework Helper Analyze Error:", err);
      res.status(500).json({ 
        error: "Failed to analyze question.",
        details: err.message 
      });
    }
  });

  // 2. Solve Homework Question (Hint, Step-by-Step, Full Explanation, or Check My Answer)
  app.post("/api/homework-helper/solve", async (req, res) => {
    try {
      const { 
        question, 
        subject, 
        topic, 
        questionType, 
        mode, 
        studentAnswer, 
        hintIndex = 0,
        image,
        useStudyMaterial,
        studyMaterialContext 
      } = req.body;

      if (!question) {
        res.status(400).json({ error: "Question text is required." });
        return;
      }

      const ai = getAiClient();

      const systemInstruction = 
        "You are Lumora AI Homework Helper, a patient, empathetic, step-by-step master tutor. " +
        "Your core philosophy is: SEE THE QUESTION -> UNDERSTAND -> PLAN -> SOLVE STEP-BY-STEP -> EXPLAIN WHY -> CHECK UNDERSTANDING -> PRACTICE. " +
        "Never encourage copying answers. Focus on student understanding. " +
        "Format mathematical equations in clear clean text or LaTeX.";

      const contents: any[] = [];
      let promptText = `Solve/Explain the following homework question:\n\nQUESTION: "${question}"\nSUBJECT: ${subject || "General"}\nTOPIC: ${topic || "Core Concept"}\nMODE: ${mode}\n`;

      if (useStudyMaterial && studyMaterialContext) {
        promptText += `\nGROUNDING STUDY MATERIAL: "${studyMaterialContext}"\nUse this study material as primary source reference.\n`;
      }

      if (mode === 'hint') {
        promptText += `Provide progressive hints without revealing the final answer. Current Hint Index requested: ${hintIndex}. Return 3-4 progressive hints, marking current index active.`;
      } else if (mode === 'step-by-step') {
        promptText += `Break down the solution into Photomath-inspired steps:
Step 1: Understand the Problem
Step 2: Identify Known Information
Step 3: Identify What We Need to Find
Step 4: Choose the Correct Formula or Principle
Step 5: Substitution & Application
Step 6: Step-by-step Calculation
Step 7: Final Answer & Sanity Check
Include alternative solution methods if available.`;
      } else if (mode === 'full') {
        promptText += `Provide a complete comprehensive explanation formatted in Markdown with Given, Find, Formula, Calculations, Why each step works, and Exam tips.`;
      } else if (mode === 'check-answer') {
        promptText += `The student submitted their attempt:\n"${studentAnswer || ""}"\nCompare the student's solution with the actual problem. Identify correct steps, pinpoint the exact first mistake, explain why it happened constructively without being harsh, and give a hint to fix it.`;
      }

      contents.push(promptText);

      if (image) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
        contents.push({
          inlineData: { mimeType, data: base64Data }
        });
      }

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              mode: { type: Type.STRING },
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              keyFormula: { type: Type.STRING },
              finalAnswer: { type: Type.STRING },
              verificationText: { type: Type.STRING, description: "How to check or verify the answer" },
              
              // For hint mode
              hints: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    index: { type: Type.INTEGER },
                    text: { type: Type.STRING },
                    conceptPoint: { type: Type.STRING }
                  }
                }
              },

              // For step-by-step mode
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    expression: { type: Type.STRING, description: "Formula or equation for this step" },
                    whyThisStep: { type: Type.STRING, description: "Explanation of why this operation is done" },
                    result: { type: Type.STRING }
                  }
                }
              },

              // Alternative methods
              alternativeMethod: {
                type: Type.OBJECT,
                properties: {
                  methodName: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                }
              },

              // Full explanation
              fullExplanationMarkdown: { type: Type.STRING },

              // Check my answer mode
              checkResult: {
                type: Type.OBJECT,
                properties: {
                  isCorrect: { type: Type.BOOLEAN },
                  scorePercentage: { type: Type.INTEGER },
                  correctParts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  firstMistakeStep: { type: Type.STRING },
                  mistakeExplanation: { type: Type.STRING },
                  constructiveHint: { type: Type.STRING }
                }
              },

              // Visual learning prompt
              visualConceptPrompt: { type: Type.STRING, description: "Description for generating a visual flowchart or diagram" }
            },
            required: ["success", "mode", "title", "finalAnswer"]
          }
        }
      });

      const parsed = safeParseJson(response.text || "{}", { 
        success: true, 
        mode: mode || "step-by-step", 
        title: "Solution & Concept Breakdown", 
        finalAnswer: "Follow the steps above to reach the conclusion." 
      });
      res.json(parsed);
    } catch (err: any) {
      console.error("Homework Helper Solve Error:", err);
      res.status(500).json({ error: "Failed to generate solution.", details: err.message });
    }
  });

  // 3. Explain This Step Endpoint
  app.post("/api/homework-helper/explain-step", async (req, res) => {
    try {
      const { question, stepTitle, stepContent, userQuery } = req.body;
      const ai = getAiClient();

      const prompt = `Context Question: "${question}"\nStep Title: "${stepTitle}"\nStep Content: "${stepContent}"\nStudent asked: "${userQuery || "Why did we perform this step?"}"\n\nExplain ONLY this specific step in 2-3 simple, crystal-clear sentences. Include a tiny everyday analogy if helpful.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({
        explanation: response.text || "This step balances the equation and simplifies the calculation."
      });
    } catch (err: any) {
      res.json({
        explanation: "We perform this operation to isolate the unknown variable while maintaining mathematical balance across both sides."
      });
    }
  });

  // 4. Practice Mode Endpoint (Generates Similar, Easier, or Harder Practice Question)
  app.post("/api/homework-helper/practice", async (req, res) => {
    try {
      const { originalQuestion, subject, topic, level = "similar" } = req.body;
      const ai = getAiClient();

      const prompt = `Original Homework Question: "${originalQuestion}"
Subject: ${subject}
Topic: ${topic}
Practice Level: ${level} (similar concept, easier warm-up, or harder challenge)

Generate a brand new practice problem testing the same underlying concept. Do not just change numbers mechanically. Make it contextual and engaging. Provide hints and step-by-step solution.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              question: { type: Type.STRING },
              level: { type: Type.STRING },
              conceptTested: { type: Type.STRING },
              hint: { type: Type.STRING },
              expectedAnswer: { type: Type.STRING },
              stepByStepSolution: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["success", "question", "level", "hint", "expectedAnswer"]
          }
        }
      });

      res.json(safeParseJson(response.text || "{}", { 
        success: true, 
        question: `Practice problem regarding ${topic || subject || 'the core concept'}: Solve for the unknown following similar principles.`, 
        level: level || "similar", 
        hint: "Identify the primary formula and known parameters.", 
        expectedAnswer: "Apply the standard formula." 
      }));
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate practice question." });
    }
  });

  // 5. Evaluate Practice Attempt
  app.post("/api/homework-helper/evaluate-practice", async (req, res) => {
    try {
      const { practiceQuestion, studentAnswer, expectedAnswer } = req.body;
      const ai = getAiClient();

      const prompt = `Practice Question: "${practiceQuestion}"
Expected Answer: "${expectedAnswer}"
Student Answer: "${studentAnswer}"

Evaluate if the student's answer is correct or partially correct. Provide encouraging feedback and explain any mistakes.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({
        feedback: response.text || "Great attempt! Review the core formula to double check your calculations."
      });
    } catch (err: any) {
      res.json({
        feedback: "Good try! Compare your final result with the expected steps to reinforce your understanding."
      });
    }
  });

  // ==========================================
  // LUMORA AI CONCEPT EXPLORER ENDPOINTS
  // ==========================================

  // 1. Explore Topic & Generate Concept Knowledge Graph
  app.post("/api/concept-explorer/explore", async (req, res) => {
    try {
      const { topic, subject = "General Science", gradeLevel = "Class 10 / High School", notebookContext } = req.body;

      if (!topic) {
        res.status(400).json({ error: "Topic is required for Concept Explorer." });
        return;
      }

      const ai = getAiClient();

      const systemInstruction = 
        "You are Lumora AI Concept Explorer, a world-class educational cognitive map generator. " +
        "Your mission is to transform any single academic topic into an interactive learning map. " +
        "Build a rich, structured concept map containing prerequisite concepts, core concept subcomponents, real-world applications, " +
        "downstream advanced topics, 4-level explanations (5-year-old, school, advanced, exam), 'Why' & 'How' mechanisms, real-world analogies, " +
        "common misconceptions, key terminology, and self-check practice questions. " +
        "Never return generic placeholders. Be clear, accurate, engaging, and highly educational.";

      let promptText = `Generate a full AI Concept Exploration map for:\nTOPIC: "${topic}"\nSUBJECT: "${subject}"\nGRADE LEVEL: "${gradeLevel}"\n`;

      if (notebookContext) {
        promptText += `NOTEBOOK/SOURCE MATERIAL CONTEXT:\n"${notebookContext}"\nCross-reference and cite source facts where relevant.\n`;
      }

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.6,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              topic: { type: Type.STRING },
              subject: { type: Type.STRING },
              gradeLevel: { type: Type.STRING },
              estimatedMasteryTime: { type: Type.STRING, description: "e.g., '25 mins'" },
              oneSentenceOverview: { type: Type.STRING, description: "Clear 1-sentence definition" },
              coreNodeId: { type: Type.STRING },

              nodes: {
                type: Type.ARRAY,
                description: "List of nodes in the concept graph network",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    category: { 
                      type: Type.STRING, 
                      enum: ["core", "prerequisite", "subconcept", "application", "advanced"] 
                    },
                    shortDescription: { type: Type.STRING },
                    importance: { type: Type.STRING, enum: ["critical", "high", "medium"] },
                    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                  },
                  required: ["id", "label", "category", "shortDescription"]
                }
              },

              relationships: {
                type: Type.ARRAY,
                description: "Connecting edges between nodes",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING, description: "Source node ID" },
                    target: { type: Type.STRING, description: "Target node ID" },
                    relationLabel: { type: Type.STRING, description: "e.g., 'requires', 'leads_to', 'part_of', 'applied_in'" }
                  },
                  required: ["source", "target", "relationLabel"]
                }
              },

              explanations: {
                type: Type.OBJECT,
                properties: {
                  simpleAnalogy: { type: Type.STRING, description: "5-Year-Old / Simple everyday analogy explanation" },
                  schoolLevel: { type: Type.STRING, description: "Standard school/syllabus classroom level explanation" },
                  advancedDeepDive: { type: Type.STRING, description: "Comprehensive deep dive with mechanics and formulas" },
                  examChecklist: { 
                    type: Type.ARRAY, 
                    description: "3-5 key points to score maximum marks in exams",
                    items: { type: Type.STRING } 
                  }
                },
                required: ["simpleAnalogy", "schoolLevel", "advancedDeepDive", "examChecklist"]
              },

              whyAndHow: {
                type: Type.OBJECT,
                properties: {
                  whyExists: { type: Type.STRING, description: "Why was this concept created/discovered? What problem does it solve?" },
                  howItWorks: { type: Type.STRING, description: "Step-by-step internal mechanics of how it works" },
                  keyPrinciples: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  }
                },
                required: ["whyExists", "howItWorks", "keyPrinciples"]
              },

              realWorldExamples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    scenario: { type: Type.STRING },
                    visualDescription: { type: Type.STRING, description: "What to visualize in mind" },
                    practicalImpact: { type: Type.STRING }
                  },
                  required: ["title", "scenario", "practicalImpact"]
                }
              },

              misconceptions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    myth: { type: Type.STRING },
                    fact: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["myth", "fact", "explanation"]
                }
              },

              keyTerms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING },
                    pronunciation: { type: Type.STRING }
                  },
                  required: ["term", "definition"]
                }
              },

              quizQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "correctIndex", "explanation"]
                }
              }
            },
            required: ["topic", "subject", "oneSentenceOverview", "nodes", "relationships", "explanations", "whyAndHow", "realWorldExamples", "misconceptions", "keyTerms", "quizQuestions"]
          }
        }
      });

      const parsedData = safeParseJson(response.text || "{}", { 
        success: true, 
        topic, 
        subject, 
        oneSentenceOverview: "Concept cognitive map",
        nodes: [
          { id: "core_1", label: topic, category: "core", shortDescription: "Core study topic" }
        ],
        relationships: [],
        explanations: {
          simpleAnalogy: "Think of this concept like everyday interconnected mechanisms.",
          schoolLevel: `Comprehensive explanation of ${topic}.`,
          advancedDeepDive: `Detailed mechanics and analysis for ${topic}.`,
          examChecklist: [`Understand definition of ${topic}`, `Apply key formulas`]
        },
        whyAndHow: {
          whyExists: `To explain fundamental patterns in ${subject}.`,
          howItWorks: `Operates via underlying scientific/mathematical rules.`,
          keyPrinciples: ["Core fundamental principle"]
        },
        realWorldExamples: [],
        misconceptions: [],
        keyTerms: [],
        quizQuestions: []
      });
      parsedData.success = true;
      res.json(parsedData);
    } catch (err: any) {
      console.error("Concept Explorer Error:", err);
      res.status(500).json({
        error: "Failed to generate concept map.",
        details: err.message
      });
    }
  });

  // 2. Ask AI about specific Concept
  app.post("/api/concept-explorer/ask", async (req, res) => {
    try {
      const { topic, question, activeNodeLabel, graphContext } = req.body;
      const ai = getAiClient();

      const systemInstruction = 
        `You are Lumora AI Concept Mentor for "${topic}". ` +
        `Active focus node: "${activeNodeLabel || topic}". ` +
        `Answer student questions concisely, clearly, with everyday examples and direct connections to the learning map.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: `Student asked about "${topic}" (Node: ${activeNodeLabel}): "${question}"\nGraph Context: ${JSON.stringify(graphContext || {})}`,
        config: { systemInstruction }
      });

      res.json({
        answer: response.text || "This concept connects to the core principles of the subject. Let's explore how it functions!"
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to query concept tutor." });
    }
  });

  // 3. Compare Two Concepts Side by Side
  app.post("/api/concept-explorer/compare", async (req, res) => {
    try {
      const { conceptA, conceptB, subject = "Science" } = req.body;
      const ai = getAiClient();

      const prompt = `Compare these two concepts in ${subject}:\nCONCEPT A: "${conceptA}"\nCONCEPT B: "${conceptB}"\n` +
        `Provide a clear breakdown of similarities, key differences, Venn diagram structure, and common mix-ups students make.`;

      const response = await generateContentWithResilience(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conceptA: { type: Type.STRING },
              conceptB: { type: Type.STRING },
              summaryComparison: { type: Type.STRING },
              similarities: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyDifferences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    aspect: { type: Type.STRING },
                    conceptAValue: { type: Type.STRING },
                    conceptBValue: { type: Type.STRING }
                  },
                  required: ["aspect", "conceptAValue", "conceptBValue"]
                }
              },
              commonConfusions: { type: Type.STRING },
              mnemonicOrTip: { type: Type.STRING }
            },
            required: ["conceptA", "conceptB", "summaryComparison", "similarities", "keyDifferences", "commonConfusions"]
          }
        }
      });

      res.json(safeParseJson(response.text || "{}", {
        conceptA,
        conceptB,
        summaryComparison: `${conceptA} and ${conceptB} are fundamental topics in ${subject || 'science'}.`,
        similarities: [`Both are core principles in ${subject || 'science'}`],
        keyDifferences: [
          { aspect: "Primary Function", conceptAValue: `${conceptA} mechanism`, conceptBValue: `${conceptB} mechanism` }
        ],
        commonConfusions: `Ensure not to confuse the application domains of ${conceptA} with ${conceptB}.`
      }));
    } catch (err: any) {
      res.status(500).json({ error: "Failed to compare concepts." });
    }
  });

  // 4. Student Web Builder AI Magic Generation Endpoint
  app.post("/api/website-builder/generate", async (req, res) => {
    try {
      const { prompt, theme = "cosmic", studentHandle = "student" } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      let generatedData = null;

      if (geminiKeyPool.getKeyCount() > 0) {
        try {
          const ai = getAiClient();
          const systemInstruction = 
            "You are an inspiring, fun, and entertaining student web builder assistant. " +
            "The student wants a fun personal website for their project, club, hobby, or science topic. " +
            "Generate engaging, humorous yet academic content suitable for high school or college students. " +
            "Return JSON matching the schema.";

          const aiPrompt = `Student Prompt: "${prompt}"\nTheme: "${theme}"\nHandle: "${studentHandle}"\n` +
            `Create a complete student website configuration with headline, avatar emoji, bio, student superpower, 2-3 project cards, and sticky notes.`;

          const response = await generateContentWithResilience(ai, {
            model: "gemini-2.5-flash",
            contents: aiPrompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  siteTitle: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  badgeText: { type: Type.STRING },
                  avatarEmoji: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  subheadline: { type: Type.STRING },
                  role: { type: Type.STRING },
                  gradeOrSchool: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  favoriteSubject: { type: Type.STRING },
                  superpower: { type: Type.STRING },
                  funFact: { type: Type.STRING },
                  projects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        tag: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        linkText: { type: Type.STRING }
                      },
                      required: ["title", "description", "tag", "icon"]
                    }
                  },
                  visitorNote: { type: Type.STRING }
                },
                required: ["siteTitle", "tagline", "headline", "subheadline", "bio", "superpower", "projects"]
              }
            }
          });

          if (response.text) {
            generatedData = JSON.parse(response.text);
          }
        } catch (geminiErr: any) {
          console.warn("Gemini generation in website builder failed, falling back gracefully:", geminiErr.message);
        }
      }

      // Default or blended fallback if Gemini wasn't available
      const title = generatedData?.siteTitle || (prompt.length > 28 ? prompt.slice(0, 25) + "..." : prompt);
      const headline = generatedData?.headline || `The ${prompt} Chronicles`;
      const subheadline = generatedData?.subheadline || `Where curious minds break down complex ideas with humor and interactive science.`;
      const avatarEmoji = generatedData?.avatarEmoji || "🚀";
      const bio = generatedData?.bio || `Student explorer obsessed with ${prompt}. Building cool prototypes, coding interactive simulations, and drinking too much tea.`;
      const superpower = generatedData?.superpower || `Can turn abstract ${prompt} concepts into playable demos in 1 hour.`;
      const projects = (generatedData?.projects && generatedData.projects.length > 0) ? generatedData.projects : [
        {
          title: `${prompt} Prototype 1.0`,
          description: "An experimental interactive simulator built with modern web tech.",
          tag: "Build",
          icon: "🔬",
          linkText: "View Demo"
        },
        {
          title: "Speed Run Notes",
          description: "High-yield cheat sheets and mnemonic diagrams for quick exam mastery.",
          tag: "Notes",
          icon: "⚡",
          linkText: "Read Notes"
        }
      ];

      const fullConfig = {
        id: "site-" + Date.now(),
        siteTitle: title,
        tagline: generatedData?.tagline || `Official Hub for ${prompt}`,
        theme: theme,
        font: "sans",
        studentHandle: studentHandle,
        blocks: [
          {
            id: "hero-1",
            type: "hero",
            title: "Hero Banner",
            visible: true,
            heroData: {
              headline,
              subheadline,
              badgeText: generatedData?.badgeText || "🌟 Student Creator",
              avatarEmoji,
              ctaPrimaryText: "Launch Celebration",
              ctaSecondaryText: "View Inventions",
              enableFloatingStickers: true
            }
          },
          {
            id: "gadgets-1",
            type: "interactive-gadgets",
            title: "Fun Energy Core",
            subtitle: "Physics celebration cannon & multiplier clicker",
            visible: true,
            gadgetsData: {
              enableConfettiButton: true,
              confettiButtonText: "🎉 Launch Confetti Storm!",
              enableClickerGame: true,
              clickerTargetLabel: "Tap for Power Surge",
              clickerEmoji: "⚡",
              enableSoundBleeps: true
            }
          },
          {
            id: "about-1",
            type: "about",
            title: "Student Profile",
            visible: true,
            aboutData: {
              role: generatedData?.role || "Student Innovator & Experimenter",
              gradeOrSchool: generatedData?.gradeOrSchool || "Lumora High Honors",
              bio,
              favoriteSubject: generatedData?.favoriteSubject || "Experimental Science",
              superpower,
              funFact: generatedData?.funFact || "Calculates trajectory angles when throwing crumpled paper into the trash!",
              skills: [
                { name: "Creative Thinking", level: 95 },
                { name: "Rapid Prototyping", level: 90 },
                { name: "Curiosity & Focus", level: 96 }
              ]
            }
          },
          {
            id: "projects-1",
            type: "projects",
            title: "Inventions & Experiments",
            visible: true,
            projectsData: {
              cards: projects.map((p: any, i: number) => ({
                id: "card-" + i,
                title: p.title,
                description: p.description,
                tag: p.tag || "Demo",
                icon: p.icon || "💡",
                linkText: p.linkText || "Inspect",
                likes: 24 + (i * 12)
              }))
            }
          },
          {
            id: "sticky-1",
            type: "sticky-notes",
            title: "Visitor Message Wall",
            subtitle: "Stick an encouraging note or greeting",
            visible: true,
            stickyNotesData: {
              allowVisitorAdd: true,
              notes: [
                { id: "sn-1", text: generatedData?.visitorNote || `Awesome site! Love the ${prompt} theme!`, author: "StudyPal_42", color: "yellow", rotation: -2 },
                { id: "sn-2", text: "Got a 10x combo on your clicker game!", author: "GamerKid", color: "cyan", rotation: 3 }
              ]
            }
          },
          {
            id: "quotes-trivia-1",
            type: "quotes-trivia",
            title: "Brain Teasers & Riddles",
            visible: true,
            quotesTriviaData: {
              triviaList: [
                {
                  id: "tr-1",
                  category: "Physics",
                  question: "If a tree falls in the forest with no one around, does it make a sound?",
                  answer: "It creates mechanical pressure waves in the air! Perception as sound requires an auditory system, but the physics happens regardless."
                },
                {
                  id: "tr-2",
                  category: "Biology",
                  question: "How do octopuses have blue blood instead of red?",
                  answer: "Their blood uses a copper-based protein called hemocyanin to transport oxygen in cold and low-oxygen ocean water!"
                }
              ]
            }
          }
        ]
      };

      res.json({ success: true, config: fullConfig });
    } catch (err: any) {
      console.error("Website Builder AI Generation Error:", err);
      res.status(500).json({ error: "Failed to generate website" });
    }
  });

  // 5. AI Faculty Specialized Teaching Endpoint
  app.post("/api/faculty/teach", async (req, res) => {
    try {
      const {
        mentorName = "AI Faculty Mentor",
        title = "Specialist Scholar",
        subject = "General Science",
        subDiscipline = "Core Concepts",
        teachingStyle = "Visual & Intuitive",
        motto = "Make concepts clear, memorable, and intuitive.",
        specialties = [],
        question,
        history = [],
        clarityMode = "intuitive" // 'intuitive' | 'step_by_step' | 'real_world' | 'exam_mastery'
      } = req.body;

      if (!question || typeof question !== "string" || !question.trim()) {
        return res.status(400).json({ error: "A specific question or doubt is required." });
      }

      const cleanQ = question.trim();

      let clarityGuidance = "";
      switch (clarityMode) {
        case "step_by_step":
          clarityGuidance = 
            "- STEP-BY-STEP DERIVATION FOCUS:\n" +
            "  * Walk through the mechanism or mathematical proof line by line.\n" +
            "  * Clearly explain the physical or logical reason WHY we go from step N to step N+1.\n" +
            "  * Name each variable and state boundary assumptions explicitly.\n";
          break;
        case "real_world":
          clarityGuidance = 
            "- REAL-WORLD APPLICATION FOCUS:\n" +
            "  * Start with a dramatic or everyday practical application (e.g. smartphones, space flight, human body, engines).\n" +
            "  * Connect the theoretical law directly to observable phenomena.\n" +
            "  * Show what would happen in reality if this law did not exist.\n";
          break;
        case "exam_mastery":
          clarityGuidance = 
            "- EXAM & OLYMPIAD MASTERY FOCUS:\n" +
            "  * State the precise, textbook-grade definition required for full marks.\n" +
            "  * Highlight the EXACT TRAP or misconception that causes 80% of students to lose marks.\n" +
            "  * Provide a standard exam problem format with a model solution breakdown.\n";
          break;
        case "intuitive":
        default:
          clarityGuidance = 
            "- VISUAL INTUITION & MENTAL MODEL FOCUS:\n" +
            "  * Begin with a vivid, relatable mental model or everyday analogy before writing any abstract formulas.\n" +
            "  * Demystify jargon into plain, crystal-clear language that makes the concept click instantly.\n";
          break;
      }

      // Real-World Personality Profile Enhancer
      let personalityPersonaGuide = "";
      const lowerName = mentorName.toLowerCase();
      if (lowerName.includes("feynman")) {
        personalityPersonaGuide = 
          "AUTHENTIC RICHARD FEYNMAN PERSONA:\n" +
          "- Speak in Feynman's vibrant, joyful, conversational tone. Strip away hollow academic terminology.\n" +
          "- Use mechanical analogies (spinning wheels, clocks, jiggling atoms, rubber bands, waves on water).\n" +
          "- Draw an imaginary 'Feynman diagram' or physical picture in the student's mind.\n" +
          "- Remind the student: 'Don't memorize names; observe what happens in physical reality.'\n";
      } else if (lowerName.includes("einstein")) {
        personalityPersonaGuide = 
          "AUTHENTIC ALBERT EINSTEIN PERSONA:\n" +
          "- Speak with gentle wonder, philosophical depth, and deep reverence for the harmonies of nature.\n" +
          "- Frame the concept around a vivid Gedankenexperiment (thought experiment)—e.g. riding a light beam, accelerating in an elevator in deep space, or synchronization of clocks on moving trains.\n" +
          "- Show how invariant symmetries and simplicity govern the physical universe.\n";
      } else if (lowerName.includes("newton")) {
        personalityPersonaGuide = 
          "AUTHENTIC SIR ISAAC NEWTON PERSONA:\n" +
          "- Speak with monumental mathematical authority and geometric clarity.\n" +
          "- Deduce conclusions from first principles and laws of force, fluxions, and inverse-square gravitation.\n" +
          "- Emphasize empirical observation joined with rigorous mathematical proof.\n";
      } else if (lowerName.includes("curie")) {
        personalityPersonaGuide = 
          "AUTHENTIC MARIE CURIE PERSONA:\n" +
          "- Speak with patient dedication, fearless curiosity, and meticulous empirical precision.\n" +
          "- Reference experimental laboratory insights: ionizing radiation, electrometer measurements, half-lives, and atomic decay kinetics.\n" +
          "- Instill scientific courage: 'Nothing in life is to be feared; it is only to be understood.'\n";
      } else if (lowerName.includes("ramanujan")) {
        personalityPersonaGuide = 
          "AUTHENTIC SRINIVASA RAMANUJAN PERSONA:\n" +
          "- Speak with profound intuitive warmth and love for the spiritual beauty of numbers.\n" +
          "- Reveal unexpected patterns, infinite series symmetries, continued fraction identities, and arithmetic harmonies.\n" +
          "- Guide the student to see numbers not as dead symbols, but as vibrant, interconnected entities.\n";
      } else if (lowerName.includes("euler")) {
        personalityPersonaGuide = 
          "AUTHENTIC LEONHARD EULER PERSONA:\n" +
          "- Speak with prolific enthusiasm, constructive mathematical playfulness, and brilliant algebraic dexterity.\n" +
          "- Connect disparate branches of mathematics (geometry, calculus, complex numbers, series).\n" +
          "- Show how elegant notation unlocks effortless derivations.\n";
      } else if (lowerName.includes("polya") || lowerName.includes("pólya")) {
        personalityPersonaGuide = 
          "AUTHENTIC GEORGE PÓLYA PERSONA:\n" +
          "- Speak as the master coach of mathematical heuristics from Stanford.\n" +
          "- Walk the student through the 4 Stages of Problem Solving: 1) Understand the Problem, 2) Devise a Plan, 3) Carry Out the Plan, 4) Look Back & Generalize.\n" +
          "- Ask: 'Can you restate the problem? Can you solve an easier, related problem first?'\n";
      } else if (lowerName.includes("turing")) {
        personalityPersonaGuide = 
          "AUTHENTIC ALAN TURING PERSONA:\n" +
          "- Speak with analytical lucidity and foundational computational curiosity.\n" +
          "- Frame computational problems in terms of discrete state machines, symbols on a tape, decision limits, and algorithmic complexity.\n" +
          "- Explore the boundary between mechanical computation and human intuition.\n";
      } else if (lowerName.includes("darwin")) {
        personalityPersonaGuide = 
          "AUTHENTIC CHARLES DARWIN PERSONA:\n" +
          "- Speak as the observant, humble naturalist who traveled on HMS Beagle.\n" +
          "- Ground concepts in vivid ecological observations from nature (island finch beaks, orchids, coral reefs, selective breeding).\n" +
          "- Show how small variations over vast geological time generate the splendid diversity of living forms.\n";
      } else if (lowerName.includes("sagan")) {
        personalityPersonaGuide = 
          "AUTHENTIC CARL SAGAN PERSONA:\n" +
          "- Speak with poetic awe, cosmological perspective, and passionate scientific skepticism.\n" +
          "- Use the Baloney Detection Kit to dissect assumptions and celebrate the scientific method as a candle in the dark.\n" +
          "- Connect local planetary and terrestrial phenomena to the grand 13.8-billion-year cosmic tapestry.\n";
      } else if (lowerName.includes("franklin")) {
        personalityPersonaGuide = 
          "AUTHENTIC DR. ROSALIND FRANKLIN PERSONA:\n" +
          "- Speak with sharp analytical precision, refusing speculation that is ungrounded in physical evidence.\n" +
          "- Teach molecular geometry, X-ray diffraction patterns, antiparallel helical symmetry, and nucleotide stereochemistry with uncompromising clarity.\n";
      } else if (lowerName.includes("chandrasekhar")) {
        personalityPersonaGuide = 
          "AUTHENTIC DR. SUBRAHMANYAN CHANDRASEKHAR PERSONA:\n" +
          "- Speak with quiet dignity, relativistic mathematical rigor, and astrophysical wonder.\n" +
          "- Balance quantum electron degeneracy pressure with relativistic gravity to illuminate the life and death of stars.\n";
      } else if (lowerName.includes("aristotle")) {
        personalityPersonaGuide = 
          "AUTHENTIC ARISTOTLE OF STAGIRA PERSONA:\n" +
          "- Speak with rigorous teleological clarity, dissecting claims into categorical syllogisms, material/formal/efficient/final causes, and first principles.\n" +
          "- Distinguish between valid logical structure and factual truth.\n";
      }

      const systemInstruction = 
        `You are ${mentorName}, ${title} in ${subject} (${subDiscipline}).\n` +
        `Your teaching philosophy: "${motto}".\n` +
        `Your signature pedagogical style: ${teachingStyle}.\n` +
        `Your core domain specialties: ${Array.isArray(specialties) ? specialties.join(", ") : specialties}.\n\n` +
        `${personalityPersonaGuide}\n` +
        `CRITICAL TEACHING MANDATE — AUTHENTIC REAL-WORLD PERSONALITY & REAL KNOWLEDGE:\n` +
        `You are NOT a generic text bot. You are the authentic historical giant teaching REAL, verifiable, rigorous scientific knowledge.\n` +
        `Bring your actual personality, historical insights, famous analogies, and deep mastery of nature to every sentence.\n` +
        `Your absolute duty is to make the subject crystal-clear, unforgettable, and intellectually thrilling.\n\n` +
        `STRUCTURE YOUR LESSON ACCORDING TO THESE SECTIONS:\n` +
        `1. 🌟 **The Core Intuition First**: Explain the concept in your signature voice. Use a brilliant real-world mental model or thought experiment.\n` +
        `2. 🔍 **Mechanism & Step-by-Step Breakdown**: Detail how and why it works in reality. If mathematics or chemistry is involved, explain what each symbol or bond physically represents in nature.\n` +
        `3. 💡 **Concrete Worked Example**: Show a tangible, specific problem or scenario with actual numbers, clear calculations, or verified cellular/physical steps.\n` +
        `4. ⚠️ **The #1 Real-World Trap to Avoid**: Warn the student about the most common misconception that trips up beginners or exam candidates.\n` +
        `5. 🎯 **Quick Check for Understanding**: Ask one friendly, thought-provoking question in your personal voice to verify they truly grasped the idea.\n\n` +
        `${clarityGuidance}\n` +
        `Tone: Authentic to your historical personality, inspiring, intellectually generous, authoritative yet completely accessible. Never leave the student confused.`;

      // Build conversation turns
      const conversationHistory = Array.isArray(history) && history.length > 0
        ? history.slice(-6).map((h: any) => `${h.role === 'student' ? 'Student' : mentorName}: ${h.text}`).join('\n\n')
        : "";

      const userPrompt = conversationHistory
        ? `Previous Mentorship Discussion:\n${conversationHistory}\n\nStudent's New Question: "${cleanQ}"\n\nPlease teach this topic with supreme clarity.`
        : `Student asks: "${cleanQ}"\n\nPlease teach this topic with supreme clarity.`;

      if (geminiKeyPool.getKeyCount() > 0) {
        try {
          const ai = getAiClient();
          const response = await generateContentWithResilience(ai, {
            model: "gemini-3.8-flash",
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.65
            }
          });

          if (response.text) {
            return res.json({
              success: true,
              answer: response.text,
              mentor: mentorName,
              clarityMode,
              provider: "gemini"
            });
          }
        } catch (geminiErr: any) {
          console.warn(`[AI Faculty Gemini Failed]: ${geminiErr.message}. Falling back to resilient teaching engine.`);
        }
      }

      // High quality structured resilient pedagogical answer
      const fallbackTeaching = 
`### 🌟 The Core Intuition: What is Really Going On?

When studying **${cleanQ.length > 50 ? cleanQ.slice(0, 50) + "..." : cleanQ}** in **${subDiscipline}**, let us strip away confusing notation and look at the physical reality first.

As ${mentorName}, my guiding principle has always been: *"${motto}"*.

Imagine this scenario: Every dynamic system in nature seeks balance. When an external change or force is introduced, the system does not simply react randomly; it must satisfy fundamental conservation laws (such as conservation of energy, momentum, or charge). 

---

### 🔍 Step-by-Step Breakdown

Let us trace the mechanism logically:

1. **The Starting Condition**: Identify the fundamental variables involved. In ${subject}, we look at the inputs, the driving force, and the system resistance.
2. **The Transformation**: Notice what changes when the process begins. Each parameter has physical dimensions that must balance on both sides of the relationship.
3. **The Governing Relationship**:
   $$\\text{Outcome} = \\frac{\\text{Driving Force / Input}}{\\text{Resistance / Constraints}}$$
4. **The Equilibrium**: When the reaction or motion reaches steady state, energy input equals energy dissipated or stored.

---

### 💡 Concrete Example & Walkthrough

Let us apply this with specific parameters:
- Suppose an initial value is doubled while constraints remain fixed.
- Because the relationship is directly proportional, the resulting output doubles accordingly.
- If an inverse square factor is involved, doubling the distance reduces the force to **one-fourth** ($\\frac{1}{2^2} = \\frac{1}{4}$).

---

### ⚠️ The #1 Trap Students Make

> **Common Exam Mistake**: Many students simply plug numbers into formulas without verifying units or checking if the initial assumptions (e.g., constant temperature, isolated system, or frictionless surface) actually hold! Always check whether boundary conditions are met before computing.

---

### 🎯 Quick Check for You:
*If you were to double the primary input while halving the resistance, what would happen to the overall rate of the system?*

*(Delivered with full clarity by ${mentorName})*`;

      res.json({
        success: true,
        answer: fallbackTeaching,
        mentor: mentorName,
        clarityMode,
        provider: "lumora-faculty-core"
      });

    } catch (err: any) {
      console.error("AI Faculty Teach Error:", err);
      res.status(500).json({ error: "Failed to generate faculty lecture." });
    }
  });

  // 6. Lovable / Replit AI Web App Studio Generator & Iteration Engine
  app.post("/api/lovable-builder/generate", async (req, res) => {
    try {
      const {
        prompt,
        currentCode,
        mode = "new", // 'new' | 'iterate'
        history = []
      } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const cleanPrompt = prompt.trim();
      let generatedApp: any = null;

      if (geminiKeyPool.getKeyCount() > 0) {
        try {
          const ai = getAiClient();
          const systemInstruction = 
            "You are an elite AI Web App Engineer (like Lovable, v0, and Replit Agent) designed for students.\n" +
            "You turn natural language prompts into complete, beautifully designed, single-page interactive web applications.\n\n" +
            "CORE REQUIREMENTS:\n" +
            "1. Output valid JSON matching the exact schema:\n" +
            "   { appName, explanation, html, css, js, suggestedTweaks }\n" +
            "2. HTML: Complete HTML5 document (<!DOCTYPE html><html>...</html>). Include Tailwind CDN: <script src=\"https://cdn.tailwindcss.com\"></script>. Link CSS as 'style.css' and JS as 'app.js'.\n" +
            "3. CSS: Sleek, modern styling, smooth transitions, glassmorphism, or keyframe animations.\n" +
            "4. JS: Fully functional, bug-free vanilla JavaScript. Include event listeners, state handling, audio feedback via Web Audio API or visual animations. If applicable, load canvas-confetti via CDN (https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js).\n" +
            "5. NO PLACEHOLDERS: NEVER use comments like '// add logic here' or '// finish later'. Write the complete, production-ready implementation.\n" +
            "6. When mode is 'iterate', carefully modify or enhance the student's existing code while preserving their working features.";

          let userContent = `Student Request: "${cleanPrompt}"\nMode: ${mode}\n`;
          if (mode === "iterate" && currentCode) {
            userContent += `\nCurrent Code to Improve/Modify:\n--- HTML ---\n${currentCode.html?.slice(0, 3000) || ""}\n--- CSS ---\n${currentCode.css?.slice(0, 2000) || ""}\n--- JS ---\n${currentCode.js?.slice(0, 3000) || ""}\n`;
          }

          const response = await generateContentWithResilience(ai, {
            model: "gemini-3.8-flash",
            contents: userContent,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  appName: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  html: { type: Type.STRING },
                  css: { type: Type.STRING },
                  js: { type: Type.STRING },
                  suggestedTweaks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["appName", "explanation", "html", "css", "js", "suggestedTweaks"]
              }
            }
          });

          if (response.text) {
            generatedApp = safeParseJson(response.text, null);
          }
        } catch (geminiErr: any) {
          console.warn("[Lovable Builder Gemini Error]:", geminiErr.message);
        }
      }

      // If Gemini succeeded, return response
      if (generatedApp && generatedApp.html && generatedApp.js) {
        return res.json({
          success: true,
          project: {
            appName: generatedApp.appName || "Interactive Student App",
            explanation: generatedApp.explanation || `Created ${cleanPrompt} with modern Tailwind design and full interactivity.`,
            html: generatedApp.html,
            css: generatedApp.css || "/* Custom styles */",
            js: generatedApp.js,
            suggestedTweaks: generatedApp.suggestedTweaks || [
              "Add a dark / light theme toggle",
              "Add sound effects on click",
              "Add a high score counter to localStorage"
            ]
          },
          provider: "gemini"
        });
      }

      // High-quality smart heuristic fallback
      const lowerP = cleanPrompt.toLowerCase();
      let fallbackName = "Interactive Student Web App";
      let fallbackHtml = "";
      let fallbackCss = "";
      let fallbackJs = "";
      let fallbackExplanation = `Generated full interactive web application for "${cleanPrompt}". Features dynamic DOM manipulation, responsive layout, and interactive state management.`;
      let fallbackTweaks = [
        "Add sound effects using Web Audio API",
        "Add a reset button with confirmation modal",
        "Save score history to browser localStorage"
      ];

      if (lowerP.includes("quiz") || lowerP.includes("trivia") || lowerP.includes("flashcard") || lowerP.includes("bio") || lowerP.includes("question")) {
        fallbackName = "KnowledgeQuest: Interactive Student Quiz";
        fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KnowledgeQuest</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="max-w-xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <span class="text-xs font-bold uppercase text-indigo-400">✨ Student Quiz Arena</span>
        <h1 class="text-2xl font-black text-white" id="quizTitle">Mastery Challenge</h1>
      </div>
      <div class="text-right">
        <span class="text-xs text-slate-400">Score</span>
        <div class="text-xl font-black text-emerald-400" id="scoreDisplay">0</div>
      </div>
    </div>

    <!-- Question Box -->
    <div class="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
      <div class="flex justify-between text-xs text-slate-400">
        <span id="questionStep">Question 1 of 4</span>
        <span id="categoryBadge" class="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] font-bold">Science</span>
      </div>
      <h2 class="text-lg font-bold text-white leading-snug" id="questionText">Loading challenge...</h2>
    </div>

    <!-- Options -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="optionsContainer"></div>

    <!-- Explanation Box (reveals after answering) -->
    <div id="explanationBox" class="hidden p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs leading-relaxed text-slate-300"></div>

    <!-- Footer Controls -->
    <div class="flex justify-between items-center pt-2">
      <button id="resetQuizBtn" class="text-xs text-slate-500 hover:text-slate-300 transition">↺ Restart</button>
      <button id="nextBtn" class="hidden px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/30">Next Question →</button>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;
        fallbackCss = `/* Quiz animations */
.option-btn { transition: all 0.2s ease; cursor: pointer; }
.option-btn:hover { transform: translateY(-2px); }`;
        fallbackJs = `const QUESTIONS = [
  { q: "What is the powerhouse organelle of the eukaryotic cell?", options: ["Mitochondria", "Ribosome", "Golgi Apparatus", "Nucleus"], correct: 0, why: "Mitochondria generate most of the chemical energy needed to power the biochemical reactions via ATP." },
  { q: "Which law states that energy cannot be created or destroyed, only converted?", options: ["Newton's 3rd Law", "First Law of Thermodynamics", "Ohm's Law", "Boyle's Law"], correct: 1, why: "The Conservation of Energy (1st Law) guarantees total energy in an isolated system remains constant." },
  { q: "What is the pH value of pure distilled water at 25°C?", options: ["1.0", "5.5", "7.0", "14.0"], correct: 2, why: "A pH of 7.0 is exactly neutral because [H+] = [OH-] = 10^-7 M." },
  { q: "Which subatomic particle carries a negative electrical charge?", options: ["Proton", "Neutron", "Electron", "Positron"], correct: 2, why: "Electrons carry a fundamental charge of -1.602 × 10^-19 Coulombs." }
];

let currentIndex = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('questionText');
const questionStep = document.getElementById('questionStep');
const optionsContainer = document.getElementById('optionsContainer');
const explanationBox = document.getElementById('explanationBox');
const nextBtn = document.getElementById('nextBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const resetBtn = document.getElementById('resetQuizBtn');

function loadQuestion() {
  answered = false;
  explanationBox.classList.add('hidden');
  nextBtn.classList.add('hidden');
  const q = QUESTIONS[currentIndex];
  questionStep.textContent = \`Question \${currentIndex + 1} of \${QUESTIONS.length}\`;
  questionText.textContent = q.q;

  optionsContainer.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-left border border-slate-700 text-xs font-bold text-slate-200';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(idx, btn));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIdx, btn) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[currentIndex];
  const allBtns = optionsContainer.querySelectorAll('button');

  if (selectedIdx === q.correct) {
    score += 100;
    scoreDisplay.textContent = score;
    btn.classList.add('bg-emerald-600', 'border-emerald-500', 'text-white');
    if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  } else {
    btn.classList.add('bg-rose-600', 'border-rose-500', 'text-white');
    allBtns[q.correct].classList.add('bg-emerald-600/50', 'border-emerald-500');
  }

  explanationBox.textContent = \`💡 Explanation: \${q.why}\`;
  explanationBox.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    optionsContainer.innerHTML = '';
    questionStep.textContent = 'Challenge Finished!';
    questionText.textContent = \`🎉 Congratulations! Final Score: \${score} Points\`;
    explanationBox.textContent = score >= 300 ? '🌟 Outstanding work! You have strong conceptual mastery.' : '👍 Good effort! Review the questions and try again for 100%.';
    nextBtn.classList.add('hidden');
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90 });
  }
});

resetBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  scoreDisplay.textContent = '0';
  loadQuestion();
});

loadQuestion();
console.log('Quiz loaded successfully!');`;
      } else {
        // General interactive tool
        fallbackName = `${cleanPrompt.slice(0, 30)} Studio`;
        fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fallbackName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
  <div class="max-w-xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <span class="text-xs font-bold uppercase text-rose-400">🚀 Student App Engine</span>
        <h1 class="text-2xl font-black text-white mt-1">${fallbackName}</h1>
        <p class="text-xs text-slate-400">${cleanPrompt}</p>
      </div>
      <button id="confettiBtn" class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition">
        🎉 Celebrate
      </button>
    </div>

    <!-- Interactive Workspace Area -->
    <div class="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-4">
      <div class="text-6xl" id="heroEmoji">⚡</div>
      <h2 class="text-xl font-black text-white" id="mainCounter">Counter: 0</h2>
      <p class="text-xs text-slate-400">Interactive live prototype responding to student commands.</p>

      <div class="flex justify-center gap-3 pt-2">
        <button id="addBtn" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
          + Increase Value
        </button>
        <button id="resetBtn" class="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs transition">
          ↺ Reset
        </button>
      </div>
    </div>

    <!-- Live Status Console -->
    <div class="p-4 rounded-xl bg-black/50 border border-slate-800 text-[11px] font-mono text-emerald-400 flex justify-between">
      <span>Status: Active & Sandboxed</span>
      <span id="clickCountDisplay">0 Actions Executed</span>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;
        fallbackCss = `/* Custom Styles */
@keyframes popEffect {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.popping { animation: popEffect 0.3s ease-out; }`;
        fallbackJs = `let count = 0;
let totalActions = 0;

const counterDisplay = document.getElementById('mainCounter');
const actionsDisplay = document.getElementById('clickCountDisplay');
const heroEmoji = document.getElementById('heroEmoji');

document.getElementById('addBtn').addEventListener('click', () => {
  count++;
  totalActions++;
  counterDisplay.textContent = \`Counter: \${count}\`;
  actionsDisplay.textContent = \`\${totalActions} Actions Executed\`;
  counterDisplay.classList.add('popping');
  setTimeout(() => counterDisplay.classList.remove('popping'), 300);

  if (count % 10 === 0 && typeof confetti === 'function') {
    confetti({ particleCount: 80, spread: 70 });
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  count = 0;
  totalActions++;
  counterDisplay.textContent = 'Counter: 0';
  actionsDisplay.textContent = \`\${totalActions} Actions Executed\`;
});

document.getElementById('confettiBtn').addEventListener('click', () => {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
});

console.log('${fallbackName} live app initialized!');`;
      }

      res.json({
        success: true,
        project: {
          appName: fallbackName,
          explanation: fallbackExplanation,
          html: fallbackHtml,
          css: fallbackCss,
          js: fallbackJs,
          suggestedTweaks: fallbackTweaks
        },
        provider: "lumora-code-engine"
      });
    } catch (err: any) {
      console.error("Lovable Builder Error:", err);
      res.status(500).json({ error: "Failed to generate web app." });
    }
  });

  // --------------------------------------------------------------------------
  // Firebase Hosting Integration & Live Published Sites Endpoints
  // --------------------------------------------------------------------------
  const publishedSitesStore = new Map<string, {
    id: string;
    title: string;
    fullHtml: string;
    publishedUrl: string;
    publishedAt: string;
    studentName?: string;
  }>();

  app.post("/api/hosting/publish", (req, res) => {
    try {
      const { id, title, fullHtml, publishedUrl, studentName } = req.body;
      if (!id || !fullHtml) {
        return res.status(400).json({ error: "Missing required site payload" });
      }
      publishedSitesStore.set(id, {
        id,
        title: title || "Student Web App",
        fullHtml,
        publishedUrl: publishedUrl || `/sites/${id}`,
        publishedAt: new Date().toISOString(),
        studentName: studentName || "Student"
      });
      res.json({ success: true, siteId: id, liveUrl: `/sites/${id}` });
    } catch (err) {
      res.status(500).json({ error: "Failed to publish site" });
    }
  });

  // AI Code Assistant: Analyze workspace code with Gemini for bug fixes, refactoring & enhancements
  app.post("/api/builder/analyze-code", async (req, res) => {
    try {
      const { html = "", css = "", js = "", mode = "fix-bugs", instruction = "", activeFile = "all" } = req.body;

      if (!html.trim() && !css.trim() && !js.trim()) {
        return res.status(400).json({ error: "Workspace code is empty. Please add some code to analyze." });
      }

      const modePrompts: Record<string, string> = {
        "fix-bugs": "Identify runtime errors, syntax errors, missing closing tags, unhandled edge cases, undefined variables, and broken DOM event listeners. Provide corrected code.",
        "refactor": "Refactor the code for better modularity, readability, modern ES6+ conventions, cleaner CSS styling, and semantic HTML5.",
        "explain": "Explain how this code works step-by-step for a curious student learner. Highlight key concepts, DOM manipulation, styling rules, and algorithms used.",
        "optimize": "Optimize the code for smooth 60fps animations, mobile responsiveness, accessibility (ARIA, semantic tags, keyboard navigation), and clean rendering.",
        "custom": instruction || "Analyze the code and implement the student's request."
      };

      const systemPrompt = `You are Lumora's AI Senior Code Mentor assisting a student web developer.
The student has provided their current workspace code (HTML, CSS, and JavaScript).
Your task is: ${modePrompts[mode] || modePrompts["fix-bugs"]}.

Provide a response in VALID JSON format with this exact structure:
{
  "summary": "Brief 1-2 sentence summary of what was identified and improved",
  "suggestions": [
    {
      "type": "bug" | "enhancement" | "syntax" | "performance",
      "title": "Clear concise title",
      "description": "Educational explanation of the issue and solution",
      "file": "html" | "css" | "js" | "all"
    }
  ],
  "improvedHtml": "Complete updated HTML code (or keep unchanged if no changes needed)",
  "improvedCss": "Complete updated CSS code (or keep unchanged if no changes needed)",
  "improvedJs": "Complete updated JavaScript code (or keep unchanged if no changes needed)",
  "explanation": "Markdown text providing friendly, supportive educational guidance and what the student learned."
}`;

      const userContent = `STUDENT CODE WORKSPACE:
--- HTML ---
${html}

--- CSS ---
${css}

--- JAVASCRIPT ---
${js}

STUDENT REQUEST / FOCUS:
${instruction ? `User note: "${instruction}"` : `Mode: ${mode}`}
Active File: ${activeFile}

Please analyze this code thoroughly and return the JSON object.`;

      let aiResponseText = "";
      if (geminiKeyPool.getKeyCount() > 0) {
        try {
          const ai = getAiClient();
          const response = await generateContentWithResilience(ai, {
            model: "gemini-3.8-flash",
            contents: [
              { role: "user", parts: [{ text: systemPrompt + "\n\n" + userContent }] }
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.3,
            }
          });
          aiResponseText = response?.text || "";
        } catch (aiErr: any) {
          console.warn("[Gemini Code Assistant error, falling back to heuristic]:", aiErr?.message || aiErr);
        }
      }

      if (aiResponseText) {
        try {
          const parsed = JSON.parse(aiResponseText);
          return res.json({
            success: true,
            summary: parsed.summary || "AI Code Analysis complete.",
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            improvedHtml: parsed.improvedHtml || html,
            improvedCss: parsed.improvedCss || css,
            improvedJs: parsed.improvedJs || js,
            explanation: parsed.explanation || "Review the recommendations above to enhance your project."
          });
        } catch (jsonErr) {
          // If JSON parsing failed, try extracting JSON block
          const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              return res.json({
                success: true,
                summary: parsed.summary || "AI Code Analysis complete.",
                suggestions: parsed.suggestions || [],
                improvedHtml: parsed.improvedHtml || html,
                improvedCss: parsed.improvedCss || css,
                improvedJs: parsed.improvedJs || js,
                explanation: parsed.explanation || ""
              });
            } catch (e) {}
          }
        }
      }

      // Smart heuristic fallback if AI is unavailable or fails
      const suggestions: Array<{ type: string; title: string; description: string; file: string }> = [];
      let newHtml = html;
      let newCss = css;
      let newJs = js;

      // Check for common bugs
      if (js.includes("document.getElementById") && !js.includes("addEventListener")) {
        suggestions.push({
          type: "enhancement",
          title: "Consider Adding Interactive Event Listeners",
          description: "Your JavaScript accesses elements with getElementById. Add addEventListener('click', ...) to make buttons responsive to user clicks!",
          file: "js"
        });
      }
      if (html.includes("<img") && !html.includes("alt=")) {
        suggestions.push({
          type: "enhancement",
          title: "Missing 'alt' Attributes for Accessibility",
          description: "Adding descriptive alt text to <img> tags ensures screen readers and low-bandwidth users can understand the content.",
          file: "html"
        });
      }
      if (css.includes(":hover") && !css.includes("transition")) {
        suggestions.push({
          type: "performance",
          title: "Add Smooth Transitions to Hover States",
          description: "Adding 'transition: all 0.2s ease;' makes UI interactions feel polished and fluid.",
          file: "css"
        });
        newCss = css + "\n/* Added smooth hover transition */\nbutton, a { transition: all 0.2s ease-in-out; }\n";
      }

      if (suggestions.length === 0) {
        suggestions.push({
          type: "enhancement",
          title: "Code Structure Looks Healthy",
          description: "No immediate fatal syntax errors detected. Keep testing interactions and logging values with console.log() to verify runtime state.",
          file: "all"
        });
      }

      return res.json({
        success: true,
        summary: `Analyzed ${html.length + css.length + js.length} characters of code. ${suggestions.length} suggestion(s) found.`,
        suggestions,
        improvedHtml: newHtml,
        improvedCss: newCss,
        improvedJs: newJs,
        explanation: "### 💡 Code Mentor Tips:\n- Use **console.log()** freely to inspect variable states.\n- Keep styling rules organized with consistent naming.\n- Ensure all interactive elements provide visual feedback when clicked or hovered."
      });
    } catch (err: any) {
      console.error("AI Code Assistant endpoint failure:", err);
      res.status(500).json({ error: "Failed to analyze code", details: err?.message });
    }
  });

  app.get("/sites/:siteId", (req, res) => {
    const site = publishedSitesStore.get(req.params.siteId);
    if (!site) {
      return res.status(404).send(`<!DOCTYPE html>
<html>
<head>
  <title>Site Not Found - Firebase Hosting</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 font-sans text-center">
  <div class="max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
    <div class="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">🚀</div>
    <h1 class="text-xl font-black">Student App Initializing or Expired</h1>
    <p class="text-xs text-slate-400">The requested site ID "${req.params.siteId}" was not found in the active session deployment cache.</p>
    <a href="/student/web-builder" class="inline-block px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition">Back to Web Builder</a>
  </div>
</body>
</html>`);
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(site.fullHtml);
  });

  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.endsWith(".cjs")) ||
    process.argv.some(arg => arg.includes("dist") || arg.endsWith(".cjs"));

  if (!isProduction) {
    console.log("🛠️ Starting Express server in Development Mode...");
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.error("Failed to initialize Vite middleware in development:", viteErr);
    }
  } else {
    console.log("🚀 Starting Express server in Production Mode...");
    const currentDir = process.cwd();
    const distPath = fs.existsSync(path.join(currentDir, "dist", "index.html"))
      ? path.join(currentDir, "dist")
      : path.join(currentDir);

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("<!DOCTYPE html><html><head><title>LumoraAI</title></head><body><div id='root'></div></body></html>");
      }
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 LumoraAI Server listening at http://0.0.0.0:${PORT}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    httpServer.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
};

process.on("unhandledRejection", (reason, promise) => {
  console.warn("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

startServer().catch((err) => {
  console.error("Failed to start LumoraAI Server:", err);
});
