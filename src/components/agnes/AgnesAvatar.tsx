import React from 'react';
import { Sparkles, Volume2, Mic, Eye, Zap } from 'lucide-react';

interface AgnesAvatarProps {
  isSpeaking: boolean;
  mood?: 'explaining' | 'aha' | 'warning' | 'tip' | 'listening';
  speakingProgress?: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AgnesAvatar: React.FC<AgnesAvatarProps> = ({
  isSpeaking,
  mood = 'explaining',
  speakingProgress = 0,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  const moodBadges: Record<string, { label: string; color: string }> = {
    explaining: { label: 'Explaining', color: 'bg-indigo-500/90 text-white' },
    aha: { label: 'Aha! Intuition', color: 'bg-amber-500/90 text-white' },
    warning: { label: 'Exam Trap', color: 'bg-rose-500/90 text-white' },
    tip: { label: 'Scoring Tip', color: 'bg-emerald-500/90 text-white' },
    listening: { label: 'Listening...', color: 'bg-cyan-500/90 text-white' },
  };

  const currentBadge = moodBadges[mood] || moodBadges.explaining;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speaking Soundwave Halo */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-500/30 animate-ping opacity-60 pointer-events-none scale-110" />
      )}

      {/* Outer Glow Ring */}
      <div
        className={`relative ${sizeClasses} rounded-3xl p-1 bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-400 shadow-xl transition-transform duration-300 ${
          isSpeaking ? 'scale-105 shadow-rose-500/25 ring-4 ring-rose-400/40' : 'hover:scale-102'
        }`}
      >
        <div className="w-full h-full rounded-[22px] bg-slate-950 overflow-hidden relative flex items-center justify-center border-2 border-slate-900/60">
          {/* Subtle laboratory blackboard grid background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Dr. Agnes Vector Portrait */}
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="agnesHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="60%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="agnesSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fbcfe8" />
              </linearGradient>
              <linearGradient id="agnesCoat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="agnesGlasses" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Hair Back */}
            <path d="M 30 50 Q 20 85 28 105 Q 60 115 92 105 Q 100 85 90 50 Z" fill="url(#agnesHair)" />

            {/* Shoulders & Lab Coat */}
            <path d="M 22 120 Q 26 95 44 90 L 76 90 Q 94 95 98 120 Z" fill="url(#agnesCoat)" />
            {/* Lab Coat Lapels */}
            <path d="M 44 90 L 52 120 L 40 120 Z" fill="#94a3b8" />
            <path d="M 76 90 L 68 120 L 80 120 Z" fill="#94a3b8" />
            {/* Tie / Inner Blouse */}
            <path d="M 52 90 L 68 90 L 64 112 L 60 118 L 56 112 Z" fill="#e11d48" />

            {/* Neck */}
            <rect x="52" y="78" width="16" height="15" rx="3" fill="url(#agnesSkin)" />

            {/* Head */}
            <ellipse cx="60" cy="58" rx="24" ry="28" fill="url(#agnesSkin)" />

            {/* Hair Front / Bangs */}
            <path
              d="M 35 50 Q 60 30 85 50 Q 88 34 76 26 Q 60 20 44 26 Q 32 34 35 50 Z"
              fill="url(#agnesHair)"
            />
            {/* Side strand */}
            <path d="M 36 48 Q 32 68 35 78 Q 38 68 40 50 Z" fill="url(#agnesHair)" />
            <path d="M 84 48 Q 88 68 85 78 Q 82 68 80 50 Z" fill="url(#agnesHair)" />

            {/* Cheerful Eyebrows */}
            <path
              d={mood === 'aha' ? "M 44 43 Q 49 39 54 44" : "M 44 46 Q 49 43 54 46"}
              stroke="#1e1b4b"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={mood === 'aha' ? "M 66 44 Q 71 39 76 43" : "M 66 46 Q 71 43 76 46"}
              stroke="#1e1b4b"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Eyes */}
            <ellipse cx="49" cy="52" rx="3.5" ry="4" fill="#0f172a" />
            <ellipse cx="71" cy="52" rx="3.5" ry="4" fill="#0f172a" />
            {/* Eye sparkle highlight */}
            <circle cx="50" cy="50" r="1.2" fill="#ffffff" />
            <circle cx="72" cy="50" r="1.2" fill="#ffffff" />

            {/* Glasses Frame (Professor Specs) */}
            <rect
              x="42"
              y="45"
              width="15"
              height="13"
              rx="3"
              fill="none"
              stroke="url(#agnesGlasses)"
              strokeWidth="2"
            />
            <rect
              x="63"
              y="45"
              width="15"
              height="13"
              rx="3"
              fill="none"
              stroke="url(#agnesGlasses)"
              strokeWidth="2"
            />
            {/* Glasses Bridge */}
            <path d="M 57 50 Q 60 48 63 50" stroke="url(#agnesGlasses)" strokeWidth="2" fill="none" />
            {/* Glasses Sides */}
            <path d="M 42 49 L 36 47" stroke="url(#agnesGlasses)" strokeWidth="1.5" />
            <path d="M 78 49 L 84 47" stroke="url(#agnesGlasses)" strokeWidth="1.5" />

            {/* Nose */}
            <path d="M 60 55 Q 61 62 58 64 L 62 64" stroke="#d97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Rosy Cheeks */}
            <circle cx="43" cy="62" r="4" fill="#f43f5e" opacity="0.3" />
            <circle cx="77" cy="62" r="4" fill="#f43f5e" opacity="0.3" />

            {/* Interactive Mouth (Animated Speech Lip-Sync) */}
            {isSpeaking ? (
              <g className="animate-pulse">
                <ellipse cx="60" cy="72" rx="6" ry="4.5" fill="#881337" />
                <path d="M 56 70 Q 60 72 64 70" stroke="#fecdd3" strokeWidth="1" fill="none" />
              </g>
            ) : mood === 'aha' ? (
              <path d="M 54 71 Q 60 77 66 71" stroke="#881337" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 55 72 Q 60 75 65 72" stroke="#881337" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </svg>

          {/* Speaking Audio Visualizer Waves at bottom of avatar */}
          {isSpeaking && (
            <div className="absolute bottom-2 inset-x-4 flex items-end justify-center gap-0.8 h-3.5 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2.5" />
              <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.4s] h-3.5" />
              <span className="w-1 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Mood / Status Indicator Badge */}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm flex items-center gap-1 ${currentBadge.color}`}
        >
          {isSpeaking ? (
            <Volume2 className="w-2.5 h-2.5 animate-pulse" />
          ) : (
            <Sparkles className="w-2.5 h-2.5" />
          )}
          <span>{isSpeaking ? 'Agnes Speaking' : currentBadge.label}</span>
        </span>
      </div>
    </div>
  );
};
