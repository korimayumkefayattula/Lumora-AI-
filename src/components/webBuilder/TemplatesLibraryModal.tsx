import React, { useState } from 'react';
import { 
  FolderOpen, Code, Sparkles, X, Check, Copy, ArrowRight, 
  Layers, Gamepad2, Laptop, Atom, Music, Compass, Eye,
  FileCode, Play
} from 'lucide-react';

export interface StarterTemplate {
  id: string;
  title: string;
  category: 'html-css' | 'react' | 'canvas' | 'audio' | 'portfolio';
  tagline: string;
  badge: string;
  icon: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'landing-page',
    title: 'Modern HTML5/CSS Landing Page',
    category: 'html-css',
    tagline: 'Clean responsive hero, feature grid, and newsletter subscription',
    badge: 'HTML5 & CSS3',
    icon: '🚀',
    description: 'A complete responsive landing page built with semantic HTML5, CSS Grid, custom properties, and smooth scrolling.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexus Next-Gen Student Platform</title>
</head>
<body>
  <!-- Navigation Header -->
  <header class="navbar">
    <div class="logo">✦ NEXUS</div>
    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#showcase">Showcase</a>
      <a href="#community">Community</a>
    </nav>
    <button id="cta-btn" class="btn btn-primary">Join the Lab</button>
  </header>

  <!-- Hero Section -->
  <main>
    <section class="hero">
      <div class="hero-badge">✨ NEW: Interactive Student Sandbox v2.0</div>
      <h1 class="hero-title">Build the Future with Code & Curiosity</h1>
      <p class="hero-desc">An interactive digital laboratory where students design, code, experiment, and deploy live web experiences effortlessly.</p>
      <div class="hero-actions">
        <button id="explore-btn" class="btn btn-primary">Get Started Free</button>
        <button id="demo-btn" class="btn btn-outline">Live Demo ↗</button>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="features">
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>Ultra Fast</h3>
        <p>Zero-configuration sandboxing with real-time browser preview and instant feedback loops.</p>
      </div>
      <div class="card">
        <div class="card-icon">🎨</div>
        <h3>Design Systems</h3>
        <p>Modern CSS Grid, fluid typography, and dynamic dark mode color palettes out of the box.</p>
      </div>
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3>AI Pair Pilot</h3>
        <p>Context-aware suggestions and automatic code refactoring to elevate your software skills.</p>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>© 2026 Nexus Lab • Crafted by Student Creators</p>
  </footer>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #090d16;
  --surface: #111827;
  --border: #1f2937;
  --primary: #6366f1;
  --accent: #ec4899;
  --text: #f3f4f6;
  --text-muted: #9ca3af;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
  background: rgba(9, 13, 22, 0.85);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-weight: 900;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  margin: 0 1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--text);
}

.hero {
  text-align: center;
  padding: 5rem 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  background: linear-gradient(to bottom, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.75rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
}

.btn-outline {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}

.btn-outline:hover {
  background: #1f2937;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: 1.25rem;
  transition: border-color 0.2s, transform 0.2s;
}

.card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.footer {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  margin-top: 4rem;
}`,
    js: `// Interactive actions and greeting
console.log("Nexus Landing Page initialized successfully!");

document.getElementById('cta-btn')?.addEventListener('click', () => {
  alert("🎉 Welcome to the Nexus Student Lab! Ready to create something epic?");
});

document.getElementById('explore-btn')?.addEventListener('click', () => {
  const features = document.getElementById('features');
  features?.scrollIntoView({ behavior: 'smooth' });
  console.log("Smooth scrolled to features section.");
});

document.getElementById('demo-btn')?.addEventListener('click', () => {
  console.info("Demo button clicked! Generating celebratory console log...");
  console.log("✨ Student tip: You can modify the CSS variables in style.css to change the entire color scheme instantly!");
});`
  },
  {
    id: 'react-component',
    title: 'React Standalone Component (State & Hooks)',
    category: 'react',
    tagline: 'Interactive task tracker with React useState, useEffect, and animated counter',
    badge: 'React & Babel CDN',
    icon: '⚛️',
    description: 'A pure client-side React component running in the browser via React 18 & Babel standalone CDN with real-time state management.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React Student Task Manager</title>
  <!-- React 18 & Babel CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
  <div id="root" class="w-full max-w-lg"></div>
  <script type="text/babel" src="app.js"></script>
</body>
</html>`,
    css: `/* Custom animations and smooth scroll */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-task {
  animation: fadeIn 0.25s ease-out forwards;
}`,
    js: `// React 18 Standalone Interactive Component
const { useState, useEffect } = React;

function StudentTaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Explore the Periodic Table", done: true },
    { id: 2, text: "Build a Canvas Mini Game", done: false },
    { id: 3, text: "Publish site to Firebase Hosting", done: false }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    console.log("React Task Manager mounted! Active tasks:", tasks.length);
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTask = { id: Date.now(), text: inputVal.trim(), done: false };
    setTasks([newTask, ...tasks]);
    setInputVal("");
    console.log("Added new task:", newTask.text);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    console.warn("Deleted task ID:", id);
  };

  const completedCount = tasks.filter(t => t.done).length;
  const filtered = tasks.filter(t => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚛️</span>
            <h2 className="text-xl font-black text-white">Student Goals</h2>
          </div>
          <p className="text-xs text-slate-400">Powered by React useState & Tailwind</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/80 text-xs font-bold text-indigo-300">
          {completedCount} / {tasks.length} Done
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full transition-all duration-300"
          style={{ width: tasks.length ? (completedCount / tasks.length) * 100 + "%" : "0%" }}
        />
      </div>

      {/* Add Form */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="What will you learn or build today?..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95"
        >
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={\`px-3 py-1 rounded-lg text-xs font-bold capitalize transition \${
              filter === f ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300'
            }\`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="animate-task flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
          >
            <div 
              onClick={() => toggleTask(t.id)}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <div className={\`w-5 h-5 rounded-md flex items-center justify-center border text-xs \${
                t.done ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
              }\`}>
                {t.done ? "✓" : ""}
              </div>
              <span className={\`text-sm font-medium \${t.done ? 'line-through text-slate-500' : 'text-slate-200'}\`}>
                {t.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(t.id)}
              className="text-slate-500 hover:text-rose-400 p-1 text-xs font-bold transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StudentTaskManager />);`
  },
  {
    id: 'canvas-game',
    title: 'HTML5 Canvas Retro Space Dodger',
    category: 'canvas',
    tagline: '60 FPS requestAnimationFrame arcade game with score, stars, and controls',
    badge: 'Canvas API & 60fps Loop',
    icon: '👾',
    description: 'A full 60 FPS HTML5 canvas space game with smooth keyboard/touch controls, particle collisions, and real-time score tracking.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cosmic Dodger - HTML5 Canvas</title>
</head>
<body>
  <div class="game-wrapper">
    <div class="header">
      <h2>✦ COSMIC DODGER ✦</h2>
      <div class="stats">
        <span>SCORE: <b id="score-val">0</b></span>
        <span>HIGH: <b id="high-val">0</b></span>
      </div>
    </div>

    <canvas id="gameCanvas" width="480" height="400"></canvas>

    <div class="controls-bar">
      <button id="restart-btn">Restart Game</button>
      <p class="hint">Use ← / → Arrow keys or Click/Touch sides to steer</p>
    </div>
  </div>
</body>
</html>`,
    css: `body {
  margin: 0;
  padding: 20px;
  background: #050811;
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

.game-wrapper {
  background: #0e1628;
  border: 2px solid #1e293b;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  margin: 0;
  font-size: 16px;
  color: #38bdf8;
  letter-spacing: 2px;
}

.stats span {
  margin-left: 14px;
  font-size: 14px;
  color: #facc15;
}

canvas {
  background: #02040a;
  border: 1px solid #334155;
  border-radius: 12px;
  display: block;
}

.controls-bar {
  text-align: center;
}

#restart-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 6px;
}

#restart-btn:hover {
  background: #4f46e5;
}

.hint {
  margin: 0;
  font-size: 11px;
  color: #64748b;
}`,
    js: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');
const highEl = document.getElementById('high-val');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let highScore = 0;
let gameOver = false;
let animationId;

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 40,
  w: 30,
  h: 24,
  speed: 6,
  dx: 0
};

let stars = [];
for (let i = 0; i < 40; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 0.5
  });
}

let asteroids = [];
let spawnInterval = 45;
let frameCount = 0;

function spawnAsteroid() {
  const size = Math.random() * 20 + 15;
  asteroids.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size: size,
    speed: Math.random() * 3 + 2.5,
    color: '#f43f5e'
  });
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
  if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
    player.dx = 0;
  }
});

// Touch/Mouse support
canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  player.dx = x < canvas.width / 2 ? -player.speed : player.speed;
});
window.addEventListener('pointerup', () => player.dx = 0);

function update() {
  if (gameOver) return;

  frameCount++;
  if (frameCount % spawnInterval === 0) spawnAsteroid();

  // Move player
  player.x += player.dx;
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

  // Move stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
  });

  // Move asteroids & collision
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const a = asteroids[i];
    a.y += a.speed;

    // Collision check
    if (
      player.x < a.x + a.size &&
      player.x + player.w > a.x &&
      player.y < a.y + a.size &&
      player.y + player.h > a.y
    ) {
      gameOver = true;
      if (score > highScore) {
        highScore = score;
        highEl.textContent = highScore;
      }
      console.error("Collision! Game Over at Score:", score);
    }

    if (a.y > canvas.height) {
      asteroids.splice(i, 1);
      score += 10;
      scoreEl.textContent = score;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background stars
  ctx.fillStyle = '#94a3b8';
  stars.forEach(s => {
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Draw Player ship
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(player.x + player.w / 2, player.y);
  ctx.lineTo(player.x + player.w, player.y + player.h);
  ctx.lineTo(player.x, player.y + player.h);
  ctx.closePath();
  ctx.fill();

  // Thruster glow
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(player.x + player.w / 2 - 3, player.y + player.h, 6, 8);

  // Draw Asteroids
  asteroids.forEach(a => {
    ctx.fillStyle = a.color;
    ctx.beginPath();
    ctx.arc(a.x + a.size / 2, a.y + a.size / 2, a.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION FAILED', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Courier New';
    ctx.fillText('Click Restart to launch again', canvas.width / 2, canvas.height / 2 + 20);
  }
}

function gameLoop() {
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function resetGame() {
  score = 0;
  scoreEl.textContent = 0;
  gameOver = false;
  asteroids = [];
  player.x = canvas.width / 2 - 15;
  player.dx = 0;
  console.log("Game restarted. Fly safe!");
}

restartBtn.addEventListener('click', resetGame);
gameLoop();
console.log("Canvas game loaded! High score system active.");`
  },
  {
    id: 'pomodoro-timer',
    title: 'Cyberpunk Pomodoro Focus Engine',
    category: 'audio',
    tagline: 'Neon glow timer with Web Audio API chime generator and statistics',
    badge: 'Web Audio & Canvas',
    icon: '⏳',
    description: 'A study timer with synthwave neon aesthetic, session progress ring, and audio synthesis using standard Web Audio API oscillators.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk Focus Engine</title>
</head>
<body>
  <div class="timer-card">
    <div class="glow-tag">✦ NEON FOCUS ENGINE</div>
    <div class="time-display" id="time">25:00</div>
    <div class="mode-label" id="mode-text">DEEP WORK SESSION</div>

    <div class="button-group">
      <button id="start-btn" class="btn btn-start">START SESSION</button>
      <button id="reset-btn" class="btn btn-reset">RESET</button>
    </div>

    <div class="stats-row">
      <div>Completed: <b id="sessions-count">0</b></div>
      <div>Mode: <b>Pomodoro 25m</b></div>
    </div>
  </div>
</body>
</html>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #090a10;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #fff;
}

.timer-card {
  background: #121420;
  border: 1px solid #ff007f;
  box-shadow: 0 0 30px rgba(255, 0, 127, 0.25);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  width: 320px;
}

.glow-tag {
  color: #00ffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
}

.time-display {
  font-size: 64px;
  font-weight: 900;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  margin: 10px 0;
}

.mode-label {
  color: #ff007f;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-start {
  background: linear-gradient(135deg, #ff007f, #7928ca);
  color: white;
  box-shadow: 0 0 15px rgba(255, 0, 127, 0.5);
}

.btn-start:hover {
  transform: scale(1.04);
}

.btn-reset {
  background: #1e2132;
  color: #94a3b8;
  border: 1px solid #334155;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  border-top: 1px solid #1e2132;
  padding-top: 16px;
}`,
    js: `let totalSeconds = 25 * 60;
let remaining = totalSeconds;
let timerId = null;
let completedSessions = 0;

const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const countEl = document.getElementById('sessions-count');

function updateDisplay() {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  timeEl.textContent = \`\${m < 10 ? '0' : ''}\${m}:\${s < 10 ? '0' : ''}\${s}\`;
}

function playSynthesizedChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {
    console.warn("AudioContext note:", e);
  }
}

startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'RESUME';
    console.log("Timer paused at:", timeEl.textContent);
  } else {
    startBtn.textContent = 'PAUSE';
    console.log("Pomodoro session started!");
    timerId = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        completedSessions++;
        countEl.textContent = completedSessions;
        playSynthesizedChime();
        alert("🔔 Deep work session complete! Take a 5 minute stretch break.");
        remaining = 25 * 60;
        updateDisplay();
        startBtn.textContent = 'START SESSION';
      }
    }, 1000);
  }
});

resetBtn.addEventListener('click', () => {
  if (timerId) clearInterval(timerId);
  timerId = null;
  remaining = 25 * 60;
  updateDisplay();
  startBtn.textContent = 'START SESSION';
  console.log("Timer reset to 25:00.");
});

updateDisplay();`
  }
];

interface TemplatesLibraryModalProps {
  onSelectTemplate: (template: StarterTemplate, mode: 'replace' | 'merge') => void;
  onClose: () => void;
}

export const TemplatesLibraryModal: React.FC<TemplatesLibraryModalProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<StarterTemplate>(STARTER_TEMPLATES[0]);
  const [activePreviewTab, setActivePreviewTab] = useState<'html' | 'css' | 'js'>('html');
  const [insertMode, setInsertMode] = useState<'replace' | 'merge'>('replace');

  const filtered = STARTER_TEMPLATES.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      return (
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl font-bold shadow-md">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Starter Boilerplate Templates</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {STARTER_TEMPLATES.length} Projects
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Insert production-ready code into your workspace to customize, study, and remix
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Sidebar list + Right Code Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Template List (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-800 flex flex-col overflow-hidden bg-slate-950/50">
            
            {/* Search & Category Filter */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates (e.g. React, Canvas, landing)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {['all', 'html-css', 'react', 'canvas', 'audio'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold uppercase transition whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat === 'html-css' ? 'HTML/CSS' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filtered.map((t) => {
                const isSelected = selectedTemplate.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-slate-800/80 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.icon}</span>
                        <span className="font-bold text-xs text-white">{t.title}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-amber-500/30">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {t.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Code Inspection & Insertion (7 cols) */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-slate-950">
            
            {/* Top Toolbar */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActivePreviewTab('html')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                    activePreviewTab === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActivePreviewTab('css')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                    activePreviewTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setActivePreviewTab('js')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                    activePreviewTab === 'js' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JavaScript
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px] hidden sm:inline">Mode:</span>
                <select
                  value={insertMode}
                  onChange={(e) => setInsertMode(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="replace">Replace Workspace</option>
                  <option value="merge">Append / Merge</option>
                </select>
              </div>
            </div>

            {/* Template Description Banner */}
            <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{selectedTemplate.icon}</span>
                  <span>{selectedTemplate.title}</span>
                </h4>
                <p className="text-[11px] text-slate-400">{selectedTemplate.description}</p>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 select-all leading-relaxed">
              <pre className="whitespace-pre-wrap">
                {activePreviewTab === 'html'
                  ? selectedTemplate.html
                  : activePreviewTab === 'css'
                  ? selectedTemplate.css
                  : selectedTemplate.js}
              </pre>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {activePreviewTab.toUpperCase()} •{' '}
                {activePreviewTab === 'html'
                  ? selectedTemplate.html.length
                  : activePreviewTab === 'css'
                  ? selectedTemplate.css.length
                  : selectedTemplate.js.length}{' '}
                characters
              </span>

              <button
                onClick={() => {
                  onSelectTemplate(selectedTemplate, insertMode);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Insert Template into Workspace</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
