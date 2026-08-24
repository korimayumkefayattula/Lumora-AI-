import React from 'react';

interface LumoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
}

export const LumoraLogo: React.FC<LumoraLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  // Colors based on variant or theme
  const textColor = variant === 'dark' 
    ? 'text-white' 
    : variant === 'light' 
      ? 'text-slate-900' 
      : 'text-slate-900 dark:text-white';

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Icon: Modern Aperture / Octagon with metallic gradient blades & central 'L' */}
      <div className={`relative flex items-center justify-center ${currentSize.icon} rounded-xl bg-slate-900 shadow-md border border-slate-700/60 p-1 overflow-hidden group`}>
        {/* Glowing backdrop gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 opacity-90 group-hover:scale-105 transition-transform" />
        
        {/* SVG Aperture geometry faithfully matching uploaded logo */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full relative z-10 text-white"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lumoraMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A1A1AA" />
              <stop offset="100%" stopColor="#52525B" />
            </linearGradient>
            <linearGradient id="lumoraAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Octagonal Outer Aperture Blades */}
          <path d="M 28 12 L 72 12 L 88 28 L 88 72 L 72 88 L 28 88 L 12 72 L 12 28 Z" stroke="url(#lumoraMetal)" strokeWidth="4" strokeLinejoin="miter" fill="none" />
          
          {/* Internal Interlocking Blades */}
          <path d="M 28 12 L 72 28 L 88 72 L 40 88" stroke="url(#lumoraMetal)" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 72 12 L 88 40 L 72 88 L 28 72" stroke="url(#lumoraMetal)" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 88 28 L 72 88 L 12 72 L 28 28" stroke="url(#lumoraMetal)" strokeWidth="3" fill="none" opacity="0.8" />
          <path d="M 12 28 L 60 12 L 88 28 L 72 72" stroke="url(#lumoraMetal)" strokeWidth="3" fill="none" opacity="0.8" />

          {/* Central Frame & 'L' emblem */}
          <rect x="36" y="34" width="28" height="32" rx="3" stroke="url(#lumoraMetal)" strokeWidth="3.5" fill="#090D16" />
          <path d="M 44 42 V 58 H 56" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 font-display font-black tracking-wider uppercase select-none">
          <span className={`${currentSize.text} ${textColor} tracking-wider font-extrabold`}>
            LUMORA
          </span>
          <span className={`${currentSize.text} text-blue-500 font-extrabold`}>
            AI
          </span>
        </div>
      )}
    </div>
  );
};

export default LumoraLogo;
