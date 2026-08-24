import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

interface VoiceTutorButtonProps {
  onClick: () => void;
  variant?: 'prominent' | 'compact' | 'floating' | 'banner';
  className?: string;
  label?: string;
}

export const VoiceTutorButton: React.FC<VoiceTutorButtonProps> = ({
  onClick,
  variant = 'prominent',
  className = '',
  label = 'Google Assistant Voice',
}) => {
  if (variant === 'floating') {
    return (
      <button
        onClick={onClick}
        className={`fixed bottom-6 right-6 z-40 p-3.5 bg-slate-900 text-white rounded-full shadow-2xl shadow-blue-500/30 flex items-center gap-3 border-2 border-slate-700/80 group hover:scale-105 transition-all ${className}`}
        title="Start Google Assistant Voice Tutor"
      >
        <div className="relative flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#FBBC05] animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#34A853] animate-bounce" style={{ animationDelay: '450ms' }} />
        </div>
        <span className="font-extrabold text-xs tracking-wide hidden md:inline">{label}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`px-2.5 py-1 bg-[#141418] border border-zinc-800 hover:border-rose-500/60 text-white font-bold text-[11px] rounded-full shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 ${className}`}
        title="Start Google Assistant Voice Tutor"
      >
        <div className="flex items-center gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
        </div>
        <span className="hidden sm:inline">Voice Assistant</span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <div 
        onClick={onClick}
        className={`p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex items-center justify-between cursor-pointer group hover:border-blue-500/50 transition-all ${className}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white border border-slate-700 group-hover:scale-110 transition-transform">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#FBBC05] animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" style={{ animationDelay: '450ms' }} />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-cyan-300" /> Google Assistant Voice
            </div>
            <h4 className="font-black text-base sm:text-lg font-display">Speak with Lumora AI Voice Assistant</h4>
            <p className="text-xs text-slate-400 font-medium">Ask doubts hands-free in English, Hindi, or Hinglish with live speech recognition</p>
          </div>
        </div>

        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-colors shrink-0 hidden sm:block">
          Start Voice Assistant
        </button>
      </div>
    );
  }

  // Default Prominent
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
        <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#FBBC05] animate-pulse" style={{ animationDelay: '300ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" style={{ animationDelay: '450ms' }} />
      </div>
      <span>{label}</span>
    </button>
  );
};
