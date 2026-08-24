import React from 'react';
import { VoiceState } from '../../types/voice';

interface VoiceOrbProps {
  state: VoiceState;
  volume: number; // 0 - 100
  onClick?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state, volume, onClick }) => {
  // Normalize volume for scale calculation
  const scaleFactor = 1 + Math.min(0.5, (volume / 100) * 0.4);

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer group flex flex-col items-center justify-center transition-all duration-300 select-none ${
        onClick ? 'hover:scale-105 active:scale-95' : ''
      }`}
    >
      {/* Google 4-Color Ambient Aura Glow (Blue, Red, Yellow, Green) */}
      <div 
        className="absolute rounded-full transition-all duration-200 blur-2xl opacity-60 pointer-events-none"
        style={{
          width: `${200 * scaleFactor}px`,
          height: `${200 * scaleFactor}px`,
          background: 'radial-gradient(circle, rgba(66,133,244,0.4) 0%, rgba(234,67,53,0.3) 30%, rgba(251,188,5,0.3) 60%, rgba(52,168,83,0.4) 100%)'
        }}
      />

      {/* Outer Pulse Waves during listening */}
      {state === 'listening' && (
        <>
          <div 
            className="absolute rounded-full border-2 border-[#4285F4]/50 animate-ping pointer-events-none"
            style={{
              width: `${160 * scaleFactor}px`,
              height: `${160 * scaleFactor}px`,
              animationDuration: '2s',
            }}
          />
          <div 
            className="absolute rounded-full border border-[#34A853]/40 animate-pulse pointer-events-none"
            style={{
              width: `${190 * scaleFactor}px`,
              height: `${190 * scaleFactor}px`,
            }}
          />
        </>
      )}

      {/* Main Glass Sphere with Google Gradient Ring */}
      <div 
        className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-slate-900/90 shadow-2xl flex items-center justify-center border-4 border-slate-700/80 transition-transform duration-100 relative z-10 overflow-hidden"
        style={{
          transform: `scale(${scaleFactor})`,
          boxShadow: state === 'listening' 
            ? '0 0 35px rgba(66, 133, 244, 0.6), inset 0 0 20px rgba(52, 168, 83, 0.4)' 
            : state === 'speaking'
            ? '0 0 35px rgba(52, 168, 83, 0.6), inset 0 0 20px rgba(66, 133, 244, 0.4)'
            : '0 0 25px rgba(66, 133, 244, 0.3)'
        }}
      >
        {/* Subtle internal shine */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent)] pointer-events-none" />
        
        {/* Four Animated Google Dots inside Orb */}
        <div className="flex items-center justify-center gap-2.5 z-20">
          <span 
            className="w-3 h-3 rounded-full bg-[#4285F4] shadow-md shadow-[#4285F4]/60 transition-all duration-150"
            style={{
              height: state === 'listening' ? `${Math.max(12, 16 + (volume / 100) * 28)}px` : state === 'speaking' ? '28px' : '12px',
              animation: state === 'processing' ? 'bounce 1s infinite 0ms' : undefined
            }}
          />
          <span 
            className="w-3 h-3 rounded-full bg-[#EA4335] shadow-md shadow-[#EA4335]/60 transition-all duration-150"
            style={{
              height: state === 'listening' ? `${Math.max(12, 20 + (volume / 100) * 34)}px` : state === 'speaking' ? '36px' : '12px',
              animation: state === 'processing' ? 'bounce 1s infinite 150ms' : undefined
            }}
          />
          <span 
            className="w-3 h-3 rounded-full bg-[#FBBC05] shadow-md shadow-[#FBBC05]/60 transition-all duration-150"
            style={{
              height: state === 'listening' ? `${Math.max(12, 18 + (volume / 100) * 30)}px` : state === 'speaking' ? '32px' : '12px',
              animation: state === 'processing' ? 'bounce 1s infinite 300ms' : undefined
            }}
          />
          <span 
            className="w-3 h-3 rounded-full bg-[#34A853] shadow-md shadow-[#34A853]/60 transition-all duration-150"
            style={{
              height: state === 'listening' ? `${Math.max(12, 14 + (volume / 100) * 26)}px` : state === 'speaking' ? '24px' : '12px',
              animation: state === 'processing' ? 'bounce 1s infinite 450ms' : undefined
            }}
          />
        </div>
      </div>
    </div>
  );
};
