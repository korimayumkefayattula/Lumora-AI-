import React, { useState, useEffect } from 'react';
import { 
  AgnesScene, 
  AgnesDiagramType 
} from '../../types/agnesVideo';
import { 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Activity, 
  ArrowRight,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AgnesVideoCanvasProps {
  scene: AgnesScene;
  isSpeaking: boolean;
  activeSentenceIndex?: number;
  onOpenCheckpoint?: () => void;
  onAskDoubt?: () => void;
}

export const AgnesVideoCanvas: React.FC<AgnesVideoCanvasProps> = ({
  scene,
  isSpeaking,
  onOpenCheckpoint,
  onAskDoubt,
}) => {
  const [revealedStep, setRevealedStep] = useState(0);

  // Progressive chalkboard writing effect as scene plays
  useEffect(() => {
    setRevealedStep(0);
    const totalPoints = scene.chalkboardPoints.length;
    const interval = setInterval(() => {
      setRevealedStep((prev) => (prev < totalPoints ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [scene]);

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[500px] rounded-3xl bg-[#090b10] border border-slate-800 text-slate-100 p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Blackboard Texture / Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent pointer-events-none" />

      {/* Top Bar: Scene Chapter & Chalkboard Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-[11px] font-black tracking-wider">
            SCENE {scene.sceneNumber}
          </span>
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>{scene.title}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {scene.quizCheckpoint && (
            <button
              onClick={onOpenCheckpoint}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Checkpoint Quiz</span>
            </button>
          )}

          <button
            onClick={onAskDoubt}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Pause video and ask Dr. Agnes a doubt about this chalkboard"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Ask Agnes Doubt</span>
          </button>
        </div>
      </div>

      {/* Center Stage: Interactive Diagram & Blackboard Derivations */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 items-center flex-1">
        
        {/* Left Column: Interactive Visual Diagram & Simulation */}
        <div className="lg:col-span-6 bg-[#0f131d]/90 rounded-2xl border border-slate-800 p-4 shadow-inner flex flex-col justify-between min-h-[240px] relative overflow-hidden group">
          {/* Diagram Title Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2 mb-2">
            <span className="flex items-center gap-1.5 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{scene.diagramTitle || 'Dynamic Visual Simulation'}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Agnes Live HUD</span>
          </div>

          {/* Render Specific Dynamic Diagram */}
          <div className="flex-1 flex items-center justify-center py-2">
            <DiagramVisualizer type={scene.diagramType} isSpeaking={isSpeaking} />
          </div>

          {/* Laser Pointer Pulse on Diagram when Agnes is speaking */}
          {isSpeaking && (
            <div className="absolute top-12 right-8 flex items-center gap-1 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-full text-[10px] text-rose-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-400 animate-ping" />
              <span>Agnes Pointing</span>
            </div>
          )}
        </div>

        {/* Right Column: Chalkboard Derivations & Formulas */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          {/* Illuminated Chalkboard Formula Box */}
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-lg">
            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Core Formula / Principle</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wide select-all bg-black/40 px-3 py-2 rounded-xl border border-amber-500/20">
              {scene.keyFormulaOrConcept}
            </div>
          </div>

          {/* Progressive Chalkboard Points */}
          <div className="space-y-2 bg-[#0d1017]/80 rounded-2xl border border-slate-800/80 p-3.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
              Chalkboard Derivation Points
            </div>
            {scene.chalkboardPoints.map((point, idx) => {
              const isRevealed = idx <= revealedStep;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 text-xs transition-all duration-500 ${
                    isRevealed
                      ? 'opacity-100 translate-x-0 text-slate-200'
                      : 'opacity-25 translate-x-2 text-slate-500'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${
                    isRevealed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              );
            })}
          </div>

          {/* Agnes Callout Box (Intuition, Warning, or Tip) */}
          {scene.callout && (
            <div
              className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs ${
                scene.callout.type === 'warning'
                  ? 'bg-rose-950/40 border-rose-600/40 text-rose-200'
                  : scene.callout.type === 'tip'
                  ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-600/40 text-amber-200'
              }`}
            >
              {scene.callout.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-[11px] uppercase tracking-wide mb-0.5">
                  {scene.callout.title}
                </div>
                <div className="text-[11px] leading-relaxed text-slate-200">
                  {scene.callout.text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Diagram Visualizer Component: Renders tailored SVG animations for different tough topics
 */
const DiagramVisualizer: React.FC<{ type: AgnesDiagramType; isSpeaking: boolean }> = ({ type, isSpeaking }) => {
  switch (type) {
    case 'wave_interference':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Emitter */}
            <circle cx="20" cy="75" r="8" fill="#f43f5e" />
            <text x="12" y="100" fill="#cbd5e1" fontSize="8" fontFamily="monospace">Emitter</text>
            
            {/* Barrier with two slits */}
            <line x1="100" y1="10" x2="100" y2="55" stroke="#64748b" strokeWidth="4" />
            <line x1="100" y1="65" x2="100" y2="85" stroke="#64748b" strokeWidth="4" />
            <line x1="100" y1="95" x2="100" y2="140" stroke="#64748b" strokeWidth="4" />
            <text x="90" y="8" fill="#94a3b8" fontSize="8" fontFamily="monospace">Slits</text>

            {/* Ripple Waves from Slit 1 */}
            <circle cx="100" cy="60" r="25" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="100" cy="60" r="50" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
            <circle cx="100" cy="60" r="75" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.4" />

            {/* Ripple Waves from Slit 2 */}
            <circle cx="100" cy="90" r="25" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <circle cx="100" cy="90" r="50" fill="none" stroke="#ec4899" strokeWidth="1.2" opacity="0.6" />
            <circle cx="100" cy="90" r="75" fill="none" stroke="#ec4899" strokeWidth="1.2" opacity="0.4" />

            {/* Detector Screen on Right */}
            <line x1="260" y1="10" x2="260" y2="140" stroke="#cbd5e1" strokeWidth="3" />
            
            {/* Interference Pattern Intensity Curve */}
            <path
              d="M 260 20 Q 285 30 260 40 Q 295 55 260 70 Q 305 75 260 80 Q 295 95 260 110 Q 285 120 260 130"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
            <text x="235" y="146" fill="#fbbf24" fontSize="8" fontFamily="monospace">Interference Fringes</text>
          </svg>
        </div>
      );

    case 'relativity_grid':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Spacetime Grid */}
            <g stroke="#1e293b" strokeWidth="1">
              <line x1="20" y1="20" x2="280" y2="20" />
              <line x1="20" y1="50" x2="280" y2="50" />
              <line x1="20" y1="80" x2="280" y2="80" />
              <line x1="20" y1="110" x2="280" y2="110" />
              <line x1="20" y1="140" x2="280" y2="140" />

              <line x1="50" y1="10" x2="50" y2="145" />
              <line x1="100" y1="10" x2="100" y2="145" />
              <line x1="150" y1="10" x2="150" y2="145" />
              <line x1="200" y1="10" x2="200" y2="145" />
              <line x1="250" y1="10" x2="250" y2="145" />
            </g>

            {/* Moving Light Clock Rocket */}
            <rect x="70" y="35" width="160" height="80" rx="12" fill="#0f172a" stroke="#6366f1" strokeWidth="2" opacity="0.9" />
            <text x="80" y="50" fill="#818cf8" fontSize="8" fontFamily="monospace">Rocket Frame (v = 0.8c)</text>

            {/* Mirrors */}
            <line x1="90" y1="60" x2="130" y2="60" stroke="#f59e0b" strokeWidth="3" />
            <line x1="90" y1="105" x2="130" y2="105" stroke="#f59e0b" strokeWidth="3" />
            <text x="135" y="85" fill="#f59e0b" fontSize="8" fontFamily="monospace">Δt₀ (Rest)</text>

            {/* Bouncing Photon Diagonal Zigzag (Dilated Time) */}
            <path
              d="M 110 105 L 160 60 L 210 105"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <circle cx="160" cy="60" r="4" fill="#fbbf24" className="animate-pulse" />
            <text x="145" y="45" fill="#ec4899" fontSize="9" fontFamily="monospace" fontWeight="bold">Hypotenuse D &gt; 2L</text>
            <text x="155" y="125" fill="#38bdf8" fontSize="8" fontFamily="monospace">Earth Observer: Δt = γΔt₀</text>
          </svg>
        </div>
      );

    case 'chemical_mechanism':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Nucleophile attacking backside */}
            <circle cx="45" cy="75" r="14" fill="#06b6d4" />
            <text x="35" y="79" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">Nu:⁻</text>
            <path d="M 65 75 Q 90 75 110 75" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="3 2" />

            {/* Transition State Carbon Center */}
            <circle cx="140" cy="75" r="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
            <text x="135" y="79" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">C*</text>

            {/* R Groups (Umbrella Inversion) */}
            <line x1="140" y1="59" x2="140" y2="35" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="140" cy="30" r="6" fill="#64748b" />
            <text x="148" y="32" fill="#94a3b8" fontSize="8">R₁</text>

            <line x1="130" y1="88" x2="115" y2="115" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="110" cy="120" r="6" fill="#64748b" />
            <text x="95" y="125" fill="#94a3b8" fontSize="8">R₂</text>

            <line x1="150" y1="88" x2="165" y2="115" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="170" cy="120" r="6" fill="#64748b" />
            <text x="180" y="125" fill="#94a3b8" fontSize="8">R₃</text>

            {/* Leaving Group Halide Departing */}
            <path d="M 160 75 Q 190 75 220 75" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="240" cy="75" r="14" fill="#f43f5e" />
            <text x="233" y="79" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">X⁻</text>

            <text x="80" y="142" fill="#a78bfa" fontSize="9" fontFamily="monospace">Walden Inversion: 180° Backside Attack</text>
          </svg>
        </div>
      );

    case 'dna_crispr':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Cas9 Protein Boundary Envelope */}
            <path
              d="M 50 40 Q 150 15 250 40 Q 280 80 250 120 Q 150 145 50 120 Q 20 80 50 40 Z"
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth="2"
              opacity="0.85"
            />
            <text x="60" y="32" fill="#818cf8" fontSize="9" fontFamily="monospace" fontWeight="bold">Cas9 Endonuclease</text>

            {/* Target DNA Strands */}
            <path d="M 20 65 Q 150 65 280 65" stroke="#38bdf8" strokeWidth="3" />
            <path d="M 20 90 Q 150 90 280 90" stroke="#38bdf8" strokeWidth="3" />
            <text x="25" y="58" fill="#38bdf8" fontSize="8" fontFamily="monospace">Target DNA</text>

            {/* Guide RNA with Complementary Base Pairing */}
            <path d="M 80 77 Q 150 77 210 77" stroke="#ec4899" strokeWidth="3.5" />
            <text x="100" y="73" fill="#f472b6" fontSize="8" fontFamily="monospace" fontWeight="bold">20-nt Guide RNA (sgRNA)</text>

            {/* PAM Sequence 5'-NGG-3' Highlight */}
            <rect x="215" y="58" width="35" height="38" rx="4" fill="#fbbf24" opacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="218" y="80" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">PAM: NGG</text>

            {/* Scissor Double-Strand Cleavage Point */}
            <line x1="190" y1="50" x2="190" y2="105" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 2" />
            <text x="170" y="118" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">DSB Cut Site</text>
          </svg>
        </div>
      );

    case 'fourier_transform':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Left: Time Domain Jagged Wave */}
            <rect x="10" y="20" width="125" height="110" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="20" y="35" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">Time Domain f(t)</text>
            <path
              d="M 20 75 Q 35 45 50 75 T 80 75 T 110 75 T 125 75"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <path
              d="M 20 75 Q 28 60 35 75 T 50 75 T 65 75 T 80 75 T 95 75 T 110 75"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Center Transformation Arrow */}
            <path d="M 140 75 L 160 75" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="135" y="65" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">FFT</text>

            {/* Right: Frequency Domain Discrete Peaks */}
            <rect x="165" y="20" width="125" height="110" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="175" y="35" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">Frequency Domain F(ω)</text>
            <line x1="175" y1="110" x2="280" y2="110" stroke="#475569" strokeWidth="1.5" />

            {/* Frequency Spikes */}
            <line x1="200" y1="110" x2="200" y2="55" stroke="#38bdf8" strokeWidth="4" />
            <circle cx="200" cy="55" r="4" fill="#38bdf8" />
            <text x="190" y="122" fill="#94a3b8" fontSize="7" fontFamily="monospace">ω₁ (440Hz)</text>

            <line x1="245" y1="110" x2="245" y2="75" stroke="#a855f7" strokeWidth="4" />
            <circle cx="245" cy="75" r="4" fill="#a855f7" />
            <text x="235" y="122" fill="#94a3b8" fontSize="7" fontFamily="monospace">ω₂ (880Hz)</text>
          </svg>
        </div>
      );

    case 'attention_matrix':
      return (
        <div className="w-full h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <rect x="25" y="15" width="250" height="120" rx="8" fill="#0f172a" stroke="#4338ca" strokeWidth="1.5" />
            <text x="35" y="32" fill="#818cf8" fontSize="9" fontFamily="monospace" fontWeight="bold">Self-Attention Heatmap (Softmax Q·Kᵀ / √d)</text>

            {/* Word labels */}
            <text x="40" y="55" fill="#cbd5e1" fontSize="8" fontFamily="monospace">The</text>
            <text x="40" y="75" fill="#cbd5e1" fontSize="8" fontFamily="monospace">frog</text>
            <text x="40" y="95" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">bank</text>
            <text x="40" y="115" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">river</text>

            {/* Matrix Heatmap Cells */}
            {/* Row 1 */}
            <rect x="80" y="45" width="30" height="15" fill="#1e1b4b" stroke="#312e81" />
            <rect x="120" y="45" width="30" height="15" fill="#1e1b4b" stroke="#312e81" />
            <rect x="160" y="45" width="30" height="15" fill="#1e1b4b" stroke="#312e81" />
            <rect x="200" y="45" width="30" height="15" fill="#1e1b4b" stroke="#312e81" />

            {/* Row 2 */}
            <rect x="80" y="65" width="30" height="15" fill="#312e81" stroke="#4338ca" />
            <rect x="120" y="65" width="30" height="15" fill="#4338ca" stroke="#6366f1" />
            <rect x="160" y="65" width="30" height="15" fill="#312e81" stroke="#4338ca" />
            <rect x="200" y="65" width="30" height="15" fill="#4338ca" stroke="#6366f1" />

            {/* Row 3 (bank) heavily attending to river! */}
            <rect x="80" y="85" width="30" height="15" fill="#1e1b4b" stroke="#312e81" />
            <rect x="120" y="85" width="30" height="15" fill="#4338ca" stroke="#6366f1" />
            <rect x="160" y="85" width="30" height="15" fill="#4338ca" stroke="#6366f1" />
            <rect x="200" y="85" width="30" height="15" fill="#e11d48" stroke="#f43f5e" className="animate-pulse" />
            <text x="206" y="96" fill="#ffffff" fontSize="8" fontWeight="bold">0.82</text>

            {/* Top labels */}
            <text x="85" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace">The</text>
            <text x="125" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace">frog</text>
            <text x="165" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace">bank</text>
            <text x="205" y="40" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">river</text>
          </svg>
        </div>
      );

    case 'generic_flow':
    default:
      return (
        <div className="w-full h-44 relative flex items-center justify-around px-2">
          <div className="flex items-center gap-2 w-full justify-around">
            <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-600/40 text-center flex-1 max-w-[85px]">
              <Cpu className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold text-indigo-200">First Principle</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-600/40 text-center flex-1 max-w-[85px] animate-pulse">
              <Zap className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold text-rose-200">Active Force</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/40 text-center flex-1 max-w-[85px]">
              <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold text-emerald-200">Equilibrium</span>
            </div>
          </div>
        </div>
      );
  }
};
