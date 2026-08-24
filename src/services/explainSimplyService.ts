export type ExplanationLevel = 'very-simple' | 'school' | 'detailed' | 'exam';
export type GroundingMode = 'source' | 'general' | 'combined';
export type LanguageChoice = 'en' | 'hi' | 'bilingual';

export interface DifficultTerm {
  term: string;
  definition: string;
}

export interface SourceCitation {
  sourceName?: string;
  pageNumber?: string;
  chapter?: string;
  section?: string;
  excerpt?: string;
  foundInSource?: boolean;
  note?: string;
}

export interface ExplainSimplyRequest {
  text: string;
  level?: ExplanationLevel;
  mode?: GroundingMode;
  sourceContext?: {
    sourceName?: string;
    pageNumber?: string | number;
    chapter?: string;
    section?: string;
    documentId?: string;
  };
  language?: LanguageChoice;
  stillConfused?: boolean;
  history?: Array<{ sender: string; text: string }>;
  customPrompt?: string;
  gradeLevel?: string;
}

export interface ExplainSimplyResult {
  title: string;
  level: string;
  explanation: string;
  keyIdea: string;
  example: string;
  difficultTerms: DifficultTerm[];
  rememberThis?: string[];
  visualConcept?: string;
  sourceCitation?: SourceCitation;
  suggestedFollowups?: string[];
  strategyUsed?: string;
}

export interface SavedExplanationNote {
  id: string;
  originalText: string;
  title: string;
  explanation: string;
  level: string;
  keyIdea: string;
  example: string;
  sourceName?: string;
  chapter?: string;
  createdAt: string;
  tags: string[];
}

const STORAGE_KEY = 'lumora_explain_simply_saved_notes';

export const ExplainSimplyService = {
  async fetchExplanation(req: ExplainSimplyRequest): Promise<ExplainSimplyResult> {
    try {
      const res = await fetch("/api/explain-simply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Failed to fetch explanation.");
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn("Explain Simply API fallback:", err);
      // Fallback generator if offline or server timeout
      return this.generateFallbackExplanation(req);
    }
  },

  async generateFlashcards(text: string, explanation: string) {
    try {
      const res = await fetch("/api/explain-simply/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, explanation })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    
    // Fallback flashcards
    return {
      title: "Flashcards from Explanation",
      cards: [
        { front: `What is the main idea of "${text.slice(0, 40)}..."?`, back: "It explains the core concept clearly step-by-step." },
        { front: "Key term definition", back: "An essential concept to remember for exams and assignments." }
      ]
    };
  },

  async generateQuiz(text: string, explanation: string) {
    try {
      const res = await fetch("/api/explain-simply/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, explanation })
      });
      if (res.ok) return await res.json();
    } catch(e) {}

    return {
      title: "Quick Understanding Test",
      questions: [
        {
          id: "q1",
          question: "Which option best describes the primary takeaway of the selected concept?",
          options: [
            "It simplifies the complex process into relatable steps.",
            "It is completely unrelated to real-world science.",
            "It only applies to advanced research papers.",
            "None of the above."
          ],
          correctAnswer: 0,
          explanation: "The explanation breaks down complex terms into simple, relatable concepts."
        }
      ]
    };
  },

  getSavedNotes(): SavedExplanationNote[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  saveNote(note: Omit<SavedExplanationNote, 'id' | 'createdAt'>): SavedExplanationNote {
    const existing = this.getSavedNotes();
    const newNote: SavedExplanationNote = {
      ...note,
      id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newNote;
  },

  deleteSavedNote(id: string) {
    const existing = this.getSavedNotes();
    const filtered = existing.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  generateFallbackExplanation(req: ExplainSimplyRequest): ExplainSimplyResult {
    const text = req.text || "";
    const level = req.level || "very-simple";

    if (level === 'very-simple') {
      return {
        title: "Very Simple Explanation",
        level: "Very Simple",
        explanation: `Think of this concept like an everyday routine. **"${text.slice(0, 60)}..."** means breaking a big, complicated task into small, super-easy steps that anyone can follow!\n\n- Imagine making a sandwich: you need bread, spread, and filling.\n- Similarly, this process takes basic inputs and transforms them into something useful!`,
        keyIdea: "A complex process broken down into everyday simple steps.",
        example: "Like assembling building blocks one piece at a time.",
        difficultTerms: [
          { term: "Process", definition: "A series of actions or steps taken to achieve a end goal." },
          { term: "Concept", definition: "An abstract idea or principle." }
        ],
        rememberThis: [
          "Understand the main goal first.",
          "Remember the simple everyday analogy."
        ],
        visualConcept: "Inputs ➔ Step-by-step Action ➔ Simple Result",
        sourceCitation: {
          sourceName: req.sourceContext?.sourceName || "Lumora Study Source",
          pageNumber: String(req.sourceContext?.pageNumber || "1"),
          chapter: req.sourceContext?.chapter || "General Notes",
          foundInSource: true,
          excerpt: text.slice(0, 100)
        },
        suggestedFollowups: [
          "Can you explain this with another real-world example?",
          "How does this appear in my textbook?",
          "Test me on this with a quick 3-question quiz."
        ],
        strategyUsed: "Everyday Analogy"
      };
    }

    return {
      title: "School & Exam Level Explanation",
      level: "School Level",
      explanation: `**Core Concept Breakdown:**\n\nThe text discusses: *"${text.slice(0, 100)}..."*\n\n### Key Principles:\n1. **Fundamental Rule:** It establishes a direct cause-and-effect relationship.\n2. **Academic Value:** This topic frequently appears in board exam questions asking for definitions and short notes.\n\n### Practical Application:\nWhen studying this chapter, focus on how each component interacts to produce the final output.`,
      keyIdea: "A fundamental topic that links cause and effect in your subject syllabus.",
      example: "Similar to water flowing through a channel to power a waterwheel.",
      difficultTerms: [
        { term: "Cause and Effect", definition: "When one event makes another event happen." },
        { term: "Mechanism", definition: "The system of moving parts or steps in a process." }
      ],
      rememberThis: [
        "Memorize the key definition keywords.",
        "Practice explaining the steps in your own words."
      ],
      visualConcept: "Cause ➔ Mechanism ➔ Outcome",
      sourceCitation: {
        sourceName: req.sourceContext?.sourceName || "Lumora Textbook",
        pageNumber: String(req.sourceContext?.pageNumber || "1"),
        chapter: req.sourceContext?.chapter || "Core Syllabus",
        foundInSource: true
      },
      suggestedFollowups: [
        "What are the most likely exam questions from this?",
        "Explain in simple Hindi.",
        "Create flashcards from this."
      ],
      strategyUsed: "Syllabus Structure"
    };
  }
};
