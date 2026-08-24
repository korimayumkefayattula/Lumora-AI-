import React from 'react';
import { VoiceState } from '../../types/voice';

interface GoogleAssistantWaveProps {
  state: VoiceState;
  volume: number; // 0 - 100
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const GoogleAssistantWave: React.FC<GoogleAssistantWaveProps> = ({
  state,
  volume,
  onClick,
  size = 'md'
}) => {
  // Volume normalized multiplier
  const volNorm = Math.min(1, Math.max(0, volume / 100));

  // 4 Google Colors
  const colors = [
    { name: 'blue', bg: 'bg-[#4285F4]', shadow: 'shadow-[#4285F4]/60', glow: '#4285F4' },
    { name: 'red', bg: 'bg-[#EA4335]', shadow: 'shadow-[#EA4335]/60', glow: '#EA4335' },
    { name: 'yellow', bg: 'bg-[#FBBC05]', shadow: 'shadow-[#FBBC05]/60', glow: '#FBBC05' },
    { name: 'green', bg: 'bg-[#34A853]', shadow: 'shadow-[#34A853]/60', glow: '#34A853' }
  ];

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer select-none py-2"
    >
      {/* 4 Glowing Google Dots / Bar */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 h-16 sm:h-20 relative">
        {colors.map((color, index) => {
          let heightPx = 16;
          let scaleVal = 1;
          let animClass = '';

          if (state === 'listening') {
            // Height moves dynamically with voice volume
            const extraHeight = Math.sin((index + 1) * 1.5) * 10 + volNorm * 40;
            heightPx = Math.max(16, 24 + extraHeight);
            animClass = 'animate-pulse';
          } else if (state === 'processing') {
            // Wave rolling animation
            animClass = 'animate-bounce';
          } else if (state === 'speaking') {
            // Rhythmic equalizer bar
            heightPx = index % 2 === 0 ? 36 : 48;
            animClass = 'animate-pulse';
          } else {
            // Idle state: 4 neat circular dots
            heightPx = 14;
            scaleVal = 1;
          }

          return (
            <div
              key={color.name}
              className={`w-3.5 sm:w-4 rounded-full ${color.bg} ${color.shadow} shadow-lg transition-all duration-150 relative`}
              style={{
                height: `${heightPx}px`,
                transform: `scale(${scaleVal})`,
                animationDelay: `${index * 120}ms`,
                boxShadow: state !== 'idle' ? `0 0 16px ${color.glow}` : undefined
              }}
            >
              {/* Inner ambient shine */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full" />
            </div>
          );
        })}
      </div>

      {/* State label badge */}
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${
          state === 'listening' 
            ? 'bg-[#4285F4] animate-ping' 
            : state === 'processing' 
            ? 'bg-[#FBBC05] animate-spin' 
            : state === 'speaking' 
            ? 'bg-[#34A853] animate-pulse' 
            : 'bg-slate-400'
        }`} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {state === 'listening' && 'Listening to you...'}
          {state === 'processing' && 'Thinking with Gemini...'}
          {state === 'speaking' && 'Google Assistant Speaking...'}
          {state === 'paused' && 'Paused'}
          {state === 'idle' && 'Tap mic or say anything'}
          {state === 'error' && 'Tap to retry'}
        </span>
      </div>
    </div>
  );
};
