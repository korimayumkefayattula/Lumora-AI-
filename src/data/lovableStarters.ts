import { StarterAppTemplate } from '../types/lovableStudio';

export const LOVABLE_STARTERS: StarterAppTemplate[] = [
  {
    id: 'periodic-table-quest',
    title: 'Atomic Quest: Interactive Periodic Table',
    tagline: 'Clickable elements with electron shells, atomic weights & audio pings',
    category: 'Science',
    icon: '🔬',
    badge: 'Chemistry',
    suggestedTweaks: [
      'Add a search filter for Nobel Gases and Halogens',
      'Add a quiz mode that asks to find the element by symbol',
      'Change theme to dark neon radioactive glow'
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atomic Quest</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 font-sans flex flex-col items-center">
  <div class="max-w-4xl w-full">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
      <div>
        <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
          <span>⚡ Student Science Studio</span>
        </div>
        <h1 class="text-3xl font-black tracking-tight text-white mt-1">Atomic Quest Periodic Lab</h1>
        <p class="text-xs sm:text-sm text-slate-400">Explore elements, orbital electron configurations, and chemical properties.</p>
      </div>
      <div class="flex items-center gap-2">
        <button id="soundToggle" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-cyan-400 font-bold transition">
          🔊 Sound: ON
        </button>
      </div>
    </header>

    <!-- Main Grid -->
    <main class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- Element Cards List -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase text-slate-400">Featured Elements</h2>
          <span class="text-xs text-cyan-400 font-semibold" id="elementCount">6 Elements Loaded</span>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3" id="elementsGrid">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- Detail Card / Electron Inspector -->
      <aside class="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between" id="inspectorCard">
        <div class="space-y-4 text-center">
          <div class="inline-block px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-extrabold uppercase" id="elementCategory">
            Selected Element
          </div>
          
          <div class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center text-white shadow-xl shadow-cyan-500/20" id="symbolBox">
            <span class="text-xs opacity-75" id="atomicNumber">1</span>
            <span class="text-3xl font-black" id="atomicSymbol">H</span>
            <span class="text-[10px] opacity-75" id="atomicMass">1.008</span>
          </div>

          <h3 class="text-xl font-black text-white" id="elementName">Hydrogen</h3>
          <p class="text-xs text-slate-400 leading-relaxed" id="elementDesc">The lightest and most abundant element in the universe. Powers the stars.</p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between text-slate-400">
            <span>Electronegativity:</span>
            <span class="text-white font-bold" id="elementElectro">2.20</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Standard State:</span>
            <span class="text-white font-bold" id="elementState">Gas</span>
          </div>
          <button id="simulateBtn" class="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-md shadow-cyan-500/20">
            ⚡ Pulse Electron Energy
          </button>
        </div>
      </aside>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* Atomic Quest Custom Styles */
@keyframes pulseGlow {
  0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(6, 182, 212, 0.3); }
  50% { transform: scale(1.03); box-shadow: 0 0 25px rgba(6, 182, 212, 0.6); }
}

.pulsing {
  animation: pulseGlow 0.4s ease-in-out;
}

.element-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.element-card:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.6);
}`,
    js: `// Elements dataset
const ELEMENTS = [
  { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', cat: 'Reactive Nonmetal', state: 'Gas', electro: '2.20', desc: 'Lightest element, constitutes ~75% of the baryonic mass of the universe.', color: 'from-cyan-500 to-blue-600' },
  { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', cat: 'Polyatomic Nonmetal', state: 'Solid', electro: '2.55', desc: 'The chemical basis of all known organic life. Forms strong covalent bonds.', color: 'from-emerald-500 to-teal-700' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', cat: 'Reactive Nonmetal', state: 'Gas', electro: '3.04', desc: 'Makes up about 78% of Earth\\'s atmosphere. Essential component of amino acids.', color: 'from-blue-600 to-indigo-700' },
  { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', cat: 'Reactive Nonmetal', state: 'Gas', electro: '3.44', desc: 'Highly reactive oxidizing agent that readily forms oxides with most elements.', color: 'from-sky-400 to-cyan-600' },
  { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', cat: 'Alkali Metal', state: 'Solid', electro: '0.93', desc: 'Soft, silvery-white alkali metal. Reacts violently with water to form NaOH.', color: 'from-amber-500 to-orange-600' },
  { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', cat: 'Transition Metal', state: 'Solid', electro: '2.54', desc: 'Noble metal that does not tarnish or corrode. Unmatched malleability and luster.', color: 'from-yellow-400 to-amber-600' }
];

let soundEnabled = true;

// Web Audio API Synthesizer
function playBeep(freq = 440, type = 'sine') {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

const grid = document.getElementById('elementsGrid');

function renderElements() {
  grid.innerHTML = '';
  ELEMENTS.forEach(el => {
    const card = document.createElement('div');
    card.className = 'element-card p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between';
    card.innerHTML = \`
      <div class="flex justify-between items-start text-xs text-slate-500">
        <span class="font-bold">\${el.num}</span>
        <span class="text-[10px] uppercase font-bold">\${el.state}</span>
      </div>
      <div class="my-2 text-center">
        <span class="text-2xl font-black text-white">\${el.sym}</span>
        <p class="text-xs font-bold text-slate-300 truncate">\${el.name}</p>
      </div>
      <div class="text-[10px] text-center text-cyan-400 font-semibold">\${el.mass} u</div>
    \`;
    card.addEventListener('click', () => selectElement(el));
    grid.appendChild(card);
  });
}

function selectElement(el) {
  playBeep(el.num * 40 + 200, 'triangle');
  document.getElementById('atomicNumber').textContent = el.num;
  document.getElementById('atomicSymbol').textContent = el.sym;
  document.getElementById('atomicMass').textContent = el.mass + ' u';
  document.getElementById('elementName').textContent = el.name;
  document.getElementById('elementDesc').textContent = el.desc;
  document.getElementById('elementCategory').textContent = el.cat;
  document.getElementById('elementElectro').textContent = el.electro;
  document.getElementById('elementState').textContent = el.state;

  const symbolBox = document.getElementById('symbolBox');
  symbolBox.className = \`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br \${el.color} flex flex-col items-center justify-center text-white shadow-xl shadow-cyan-500/20 pulsing\`;
  setTimeout(() => symbolBox.classList.remove('pulsing'), 400);
}

document.getElementById('simulateBtn').addEventListener('click', () => {
  playBeep(880, 'sine');
  setTimeout(() => playBeep(1174, 'sine'), 120);
  const symbolBox = document.getElementById('symbolBox');
  symbolBox.classList.add('pulsing');
  setTimeout(() => symbolBox.classList.remove('pulsing'), 400);
});

document.getElementById('soundToggle').addEventListener('click', (e) => {
  soundEnabled = !soundEnabled;
  e.target.textContent = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  if (soundEnabled) playBeep(523, 'sine');
});

renderElements();
selectElement(ELEMENTS[0]);
console.log('Atomic Quest lab engine initialized successfully!');`
  },
  {
    id: 'cyberpunk-pomodoro',
    title: 'Cyberpunk Focus & Lofi Study Station',
    tagline: 'Ambient procedural rain synthesizer with animated timer & streak counter',
    category: 'Productivity',
    icon: '🍅',
    badge: 'Focus',
    suggestedTweaks: [
      'Add a task checklist with completion checkboxes',
      'Add a 5-minute break timer mode',
      'Change color palette to vaporwave purple and pink'
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyberpunk Focus</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col items-center justify-center p-4 font-mono">
  <div class="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
    <div class="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/20 rounded-full blur-2xl"></div>
    <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-600/20 rounded-full blur-2xl"></div>

    <header class="text-center relative z-10">
      <span class="text-[10px] uppercase font-bold text-rose-500 tracking-widest">⚡ Neural Focus Protocol</span>
      <h1 class="text-2xl font-black text-white mt-1">Cyberpunk Pomodoro</h1>
      <p class="text-xs text-zinc-400 mt-0.5">Deep study mode with procedural ambient white noise</p>
    </header>

    <!-- Timer Circle Display -->
    <div class="my-8 text-center relative z-10 flex flex-col items-center">
      <div class="w-48 h-48 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center relative shadow-inner" id="timerRing">
        <span class="text-4xl font-black tracking-tight text-white" id="timeDisplay">25:00</span>
        <span class="text-[10px] text-zinc-500 uppercase tracking-wider mt-1" id="timerStatus">Ready to Study</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-3 relative z-10">
      <button id="startBtn" class="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-lg shadow-rose-600/30">
        ▶ Start Focus
      </button>
      <button id="resetBtn" class="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition">
        ↺ Reset
      </button>
      <button id="ambientBtn" class="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition">
        🌧️ Rain: OFF
      </button>
    </div>

    <!-- Streak Bar -->
    <div class="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400 relative z-10">
      <span>Completed Cycles:</span>
      <span class="font-bold text-rose-400 text-sm" id="streakCount">0 Sessions 🔥</span>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* Cyberpunk Glows */
@keyframes neonPulse {
  0%, 100% { border-color: #e11d48; box-shadow: 0 0 20px rgba(225, 29, 72, 0.4); }
  50% { border-color: #06b6d4; box-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
}

.active-timer {
  animation: neonPulse 3s infinite ease-in-out;
}`,
    js: `let totalSeconds = 25 * 60;
let remaining = totalSeconds;
let timerId = null;
let completedSessions = 0;
let isRainPlaying = false;
let audioCtx = null;
let rainNode = null;

const timeDisplay = document.getElementById('timeDisplay');
const timerStatus = document.getElementById('timerStatus');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const ambientBtn = document.getElementById('ambientBtn');
const streakCount = document.getElementById('streakCount');
const timerRing = document.getElementById('timerRing');

function updateDisplay() {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  timeDisplay.textContent = \`\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
}

function startTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = '▶ Resume';
    timerStatus.textContent = 'Paused';
    timerRing.classList.remove('active-timer');
  } else {
    timerId = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;
        completedSessions++;
        streakCount.textContent = \`\${completedSessions} Sessions 🔥\`;
        timerStatus.textContent = 'Session Complete! 🎉';
        startBtn.textContent = '▶ Start Focus';
        timerRing.classList.remove('active-timer');
        playChime();
      }
    }, 1000);
    startBtn.textContent = '⏸ Pause';
    timerStatus.textContent = 'Deep Focus in Progress...';
    timerRing.classList.add('active-timer');
  }
}

function resetTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  remaining = totalSeconds;
  updateDisplay();
  startBtn.textContent = '▶ Start Focus';
  timerStatus.textContent = 'Ready to Study';
  timerRing.classList.remove('active-timer');
}

// Procedural Rain Audio via Web Audio Noise Generator
function toggleRain() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  if (isRainPlaying) {
    if (rainNode) rainNode.disconnect();
    isRainPlaying = false;
    ambientBtn.textContent = '🌧️ Rain: OFF';
  } else {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05; // Pink/white rain noise
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter to simulate gentle rainfall
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noise.connect(filter);
    filter.connect(audioCtx.destination);
    noise.start();
    rainNode = noise;
    isRainPlaying = true;
    ambientBtn.textContent = '🌧️ Rain: ON';
  }
}

function playChime() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
ambientBtn.addEventListener('click', toggleRain);
updateDisplay();
console.log('Cyberpunk Pomodoro loaded!');`
  },
  {
    id: 'gravity-particle-sim',
    title: 'Zero-G Gravity & Particle Canvas',
    tagline: 'Interactive HTML5 canvas physics simulator with orbital mechanics',
    category: 'Science',
    icon: '🪐',
    badge: 'Physics',
    suggestedTweaks: [
      'Add a toggle for anti-gravity repulsion',
      'Change particle trail colors to rainbow spectrum',
      'Add planetary mass sliders'
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zero-G Orbital Simulator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-black text-white min-h-screen flex flex-col items-center justify-between p-4 overflow-hidden font-sans">
  <!-- HUD Top Bar -->
  <header class="w-full max-w-4xl flex items-center justify-between py-2 z-10">
    <div>
      <h1 class="text-lg font-black tracking-tight flex items-center gap-2">
        <span class="text-indigo-400">🌌</span> Gravity Orbit Lab
      </h1>
      <p class="text-[11px] text-slate-400">Click canvas to spawn solar gravitational attractor or drag particles</p>
    </div>
    <div class="flex items-center gap-2 text-xs">
      <button id="clearBtn" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold">
        Clear Canvas
      </button>
      <button id="spawnBurstBtn" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black">
        💥 Particle Burst
      </button>
    </div>
  </header>

  <!-- Canvas Stage -->
  <main class="w-full max-w-4xl flex-1 flex items-center justify-center my-2 relative">
    <canvas id="simCanvas" class="w-full h-[500px] rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl cursor-crosshair"></canvas>
  </main>

  <footer class="w-full max-w-4xl text-center text-[10px] text-slate-500 pb-2 z-10">
    Physics equation: F = G * (m1 * m2) / r² | Rendered at 60 FPS
  </footer>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* Canvas Glow Styles */
canvas {
  touch-action: none;
}`,
    js: `const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
window.addEventListener('resize', resize);
resize();

const particles = [];
let attractors = [
  { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2, mass: 1200, color: '#818cf8' }
];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.radius = Math.random() * 2.5 + 1.5;
    this.color = \`hsl(\${Math.random() * 60 + 190}, 90%, 65%)\`;
    this.trail = [];
  }

  update() {
    attractors.forEach(att => {
      const dx = att.x - this.x;
      const dy = att.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 8) {
        const force = att.mass / (dist * dist);
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    });

    this.x += this.vx;
    this.y += this.vy;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();
  }

  draw() {
    // Draw trail
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Draw core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function spawnBurst(cx, cy, count = 40) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(cx, cy));
  }
}

canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  attractors.push({ x, y, mass: 1000, color: '#f43f5e' });
  spawnBurst(x, y, 20);
});

document.getElementById('spawnBurstBtn').addEventListener('click', () => {
  spawnBurst(canvas.clientWidth / 2, canvas.clientHeight / 2, 50);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  particles.length = 0;
  attractors = [{ x: canvas.clientWidth / 2, y: canvas.clientHeight / 2, mass: 1200, color: '#818cf8' }];
});

// Initial spawn
spawnBurst(canvas.clientWidth / 2, canvas.clientHeight / 2, 60);

function animate() {
  ctx.fillStyle = 'rgba(2, 6, 23, 0.25)';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Draw attractors
  attractors.forEach(att => {
    ctx.beginPath();
    ctx.arc(att.x, att.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = att.color;
    ctx.shadowColor = att.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
  }

  requestAnimationFrame(animate);
}
animate();
console.log('Gravity simulator running!');`
  },
  {
    id: 'hacker-dev-portfolio',
    title: 'Student Hacker Terminal & Portfolio',
    tagline: 'Interactive UNIX terminal with typed commands, skills matrix & project deck',
    category: 'Portfolio',
    icon: '💻',
    badge: 'Coding',
    suggestedTweaks: [
      'Add a contact form that logs messages',
      'Add a matrix digital rain animation background',
      'Add interactive badge achievements'
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Dev Terminal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-emerald-400 min-h-screen p-4 sm:p-8 font-mono flex flex-col items-center">
  <div class="max-w-3xl w-full">
    <!-- Window Frame -->
    <div class="rounded-2xl bg-black border border-emerald-900/60 shadow-2xl shadow-emerald-950/40 overflow-hidden">
      <!-- Window Titlebar -->
      <div class="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-rose-500"></div>
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-xs text-zinc-400 ml-2">bash - student@lumora: ~</span>
        </div>
        <span class="text-[10px] text-zinc-500">v2.4.0-release</span>
      </div>

      <!-- Terminal Output Content -->
      <div class="p-6 space-y-4 text-xs sm:text-sm" id="terminalOutput">
        <p class="text-zinc-400">Welcome to Lumora Student OS (x86_64-student-linux)</p>
        <p class="text-emerald-500">Type <span class="text-white font-bold bg-emerald-950 px-1.5 py-0.5 rounded">'help'</span> to see available commands or click the shortcut buttons below.</p>
        <hr class="border-zinc-800 my-2">
      </div>

      <!-- Quick Action Buttons -->
      <div class="px-6 py-2 bg-zinc-950 border-t border-zinc-900 flex flex-wrap gap-2 text-xs">
        <button class="cmd-btn px-2.5 py-1 rounded bg-zinc-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50" data-cmd="bio">bio</button>
        <button class="cmd-btn px-2.5 py-1 rounded bg-zinc-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50" data-cmd="skills">skills</button>
        <button class="cmd-btn px-2.5 py-1 rounded bg-zinc-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50" data-cmd="projects">projects</button>
        <button class="cmd-btn px-2.5 py-1 rounded bg-zinc-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50" data-cmd="clear">clear</button>
      </div>

      <!-- Command Input Prompt -->
      <form id="terminalForm" class="p-4 bg-black border-t border-zinc-900 flex items-center gap-2">
        <span class="text-emerald-500 font-bold">student@lumora:~$</span>
        <input 
          type="text" 
          id="cmdInput" 
          autofocus 
          placeholder="Type a command..." 
          class="flex-1 bg-transparent text-white focus:outline-none text-xs sm:text-sm placeholder-zinc-700"
        />
      </form>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* Hacker Terminal Aesthetics */
::selection {
  background: #059669;
  color: #000;
}`,
    js: `const output = document.getElementById('terminalOutput');
const form = document.getElementById('terminalForm');
const input = document.getElementById('cmdInput');

const COMMANDS = {
  help: 'Available commands:\\n- bio: Who am I and student background\\n- skills: Technical and scientific superpowers\\n- projects: Cool things I built\\n- clear: Cleans the terminal buffer',
  bio: '👤 STUDENT IDENTITY:\\nName: Alex Chen\\nSchool: Lumora STEM Academy\\nInterests: Quantum computing, astrophysics, and web engineering\\nMotto: "Build software that solves hard problems."',
  skills: '⚡ SUPERPOWERS MATRIX:\\n[██████████] 100% Python & Mathematics\\n[█████████░] 90% JavaScript & React\\n[████████░░] 85% Physics Simulations\\n[██████████] 100% Curiosity & Grit',
  projects: '🚀 INVENTIONS & EXPERIENCES:\\n1. Orbital Physics Simulator (HTML5 Canvas)\\n2. BioCell Quiz Game (Interactive Web App)\\n3. Automatic Plant Hydration Controller (Arduino/IoT)'
};

function printLine(text, isCommand = false) {
  const p = document.createElement('div');
  p.className = isCommand ? 'text-white font-bold mt-2' : 'text-emerald-300 leading-relaxed whitespace-pre-wrap';
  p.textContent = isCommand ? \`student@lumora:~$ \${text}\` : text;
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cmd = input.value.trim().toLowerCase();
  if (!cmd) return;

  printLine(cmd, true);
  input.value = '';

  if (cmd === 'clear') {
    output.innerHTML = '<p class="text-zinc-500">Terminal buffer cleared.</p>';
  } else if (COMMANDS[cmd]) {
    printLine(COMMANDS[cmd]);
  } else {
    printLine(\`Command not recognized: "\${cmd}". Type 'help' for command list.\`);
  }
});

document.querySelectorAll('.cmd-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    input.value = btn.getAttribute('data-cmd');
    form.dispatchEvent(new Event('submit'));
  });
});

console.log('Terminal ready.');`
  },
  {
    id: 'speed-math-challenge',
    title: 'Speed Math & Mental Recall Arena',
    tagline: 'Lightning 30-second arithmetic game with streak combos and confetti celebrations',
    category: 'Math',
    icon: '⚡',
    badge: 'Mental Math',
    suggestedTweaks: [
      'Add multiplication tables up to 25',
      'Add a high score saving to localStorage',
      'Add wrong answer buzz sound'
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Speed Math Arena</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-amber-950/20 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans bg-slate-950">
  <div class="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
    
    <!-- Top Stats -->
    <div class="flex items-center justify-between text-xs font-bold">
      <div class="text-amber-400">⏱ Time: <span id="timerVal" class="text-lg">30</span>s</div>
      <div class="text-emerald-400">🔥 Streak: <span id="streakVal" class="text-lg">0</span></div>
      <div class="text-cyan-400">🏆 Score: <span id="scoreVal" class="text-lg">0</span></div>
    </div>

    <!-- Arithmetic Question -->
    <div class="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 shadow-inner">
      <span class="text-xs text-slate-400 uppercase tracking-widest font-bold">Solve Fast:</span>
      <div class="text-5xl font-black text-white my-3 tracking-tight" id="problemDisplay">12 × 7</div>
    </div>

    <!-- Multiple Choice Grid -->
    <div class="grid grid-cols-2 gap-3" id="optionsGrid">
      <!-- Generated by JS -->
    </div>

    <button id="restartBtn" class="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20">
      ⚡ Start 30s Blitz
    </button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* Speed Math Styles */
.option-btn {
  transition: all 0.15s ease;
}
.option-btn:hover {
  transform: translateY(-2px);
}`,
    js: `let score = 0;
let streak = 0;
let timeLeft = 30;
let timerId = null;
let currentAnswer = 0;
let isPlaying = false;

const timerVal = document.getElementById('timerVal');
const streakVal = document.getElementById('streakVal');
const scoreVal = document.getElementById('scoreVal');
const problemDisplay = document.getElementById('problemDisplay');
const optionsGrid = document.getElementById('optionsGrid');
const restartBtn = document.getElementById('restartBtn');

function generateProblem() {
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, ans;

  if (op === '+') {
    a = Math.floor(Math.random() * 45) + 5;
    b = Math.floor(Math.random() * 45) + 5;
    ans = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 20;
    b = Math.floor(Math.random() * (a - 5)) + 1;
    ans = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    ans = a * b;
  }

  currentAnswer = ans;
  problemDisplay.textContent = \`\${a} \${op} \${b}\`;

  const choices = [ans];
  while (choices.length < 4) {
    const wrong = ans + (Math.floor(Math.random() * 11) - 5);
    if (wrong !== ans && !choices.includes(wrong) && wrong > 0) {
      choices.push(wrong);
    }
  }
  choices.sort(() => Math.random() - 0.5);

  optionsGrid.innerHTML = '';
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'option-btn py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl border border-slate-700 shadow-sm';
    btn.textContent = ch;
    btn.addEventListener('click', () => checkAnswer(ch, btn));
    optionsGrid.appendChild(btn);
  });
}

function checkAnswer(val, btn) {
  if (!isPlaying) return;

  if (val === currentAnswer) {
    score += 10 + (streak * 2);
    streak++;
    btn.classList.add('bg-emerald-600', 'border-emerald-500');
    scoreVal.textContent = score;
    streakVal.textContent = streak;
    setTimeout(generateProblem, 200);
  } else {
    streak = 0;
    streakVal.textContent = streak;
    btn.classList.add('bg-rose-600', 'border-rose-500');
    setTimeout(generateProblem, 400);
  }
}

function startGame() {
  score = 0;
  streak = 0;
  timeLeft = 30;
  isPlaying = true;
  scoreVal.textContent = '0';
  streakVal.textContent = '0';
  timerVal.textContent = '30';
  restartBtn.textContent = 'Blitz in Progress...';
  restartBtn.disabled = true;

  generateProblem();

  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerVal.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerId = null;
      isPlaying = false;
      problemDisplay.textContent = \`Final: \${score} Pts!\`;
      restartBtn.textContent = '↺ Play Again';
      restartBtn.disabled = false;
      optionsGrid.innerHTML = '';
      if (score >= 50 && typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, 1000);
}

restartBtn.addEventListener('click', startGame);
generateProblem();
console.log('Speed math ready!');`
  }
];
