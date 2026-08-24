import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Eye, Shield, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  variant?: 'segmented' | 'compact' | 'dropdown' | 'floating';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'segmented',
  className = ''
}) => {
  const { theme, setTheme, isFocusMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string; accentColor: string }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: Sun,
      desc: 'Daylight clean theme',
      accentColor: 'text-amber-500'
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: Moon,
      desc: 'Midnight slate theme',
      accentColor: 'text-indigo-400'
    },
    {
      mode: 'focus',
      label: 'Focus',
      icon: Eye,
      desc: 'High-contrast eye comfort',
      accentColor: 'text-amber-400'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            theme === 'focus'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-xs'
              : theme === 'dark'
              ? 'bg-[#141418] border-zinc-800 text-rose-300 hover:border-zinc-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
          title="Switch Display Theme"
          aria-label="Theme Switcher"
        >
          {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
          {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-rose-400" />}
          {theme === 'focus' && <Eye className="w-3.5 h-3.5 text-amber-400" />}
          
          {theme === 'focus' && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 hidden sm:inline">
              Focus
            </span>
          )}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 mt-2 w-56 p-2 rounded-2xl shadow-2xl border z-50 backdrop-blur-xl ${
                theme === 'focus'
                  ? 'bg-[#181512]/95 border-[#382e25] text-amber-100'
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
              }`}
            >
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                Select Workspace Theme
              </div>
              <div className="space-y-1">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      onClick={() => {
                        setTheme(opt.mode);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? opt.mode === 'focus'
                            ? 'bg-amber-950/60 text-amber-200 font-bold border border-amber-600/30'
                            : 'bg-indigo-600 text-white font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : opt.accentColor}`} />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{opt.label}</div>
                          <div className={`text-[10px] leading-tight ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                    </button>
                  );
                })}
              </div>

              {isFocusMode && (
                <div className="mt-2 pt-2 border-t border-amber-900/40 px-2 py-1 flex items-center gap-1.5 text-[10px] text-amber-400">
                  <Shield className="w-3 h-3" />
                  <span>Blue light reduction & high-contrast active</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Segmented Pill Control (Default)
  return (
    <div className={`inline-flex items-center p-1 rounded-2xl border backdrop-blur-md relative transition-all ${
      theme === 'focus'
        ? 'bg-[#181512]/90 border-[#382e25] shadow-inner'
        : 'bg-slate-100/90 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 shadow-sm'
    } ${className}`}>
      {themeOptions.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.mode;

        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all z-10 ${
              isSelected
                ? opt.mode === 'focus'
                  ? 'text-amber-100 font-extrabold'
                  : 'text-white font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={`${opt.label} - ${opt.desc}`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeThemePill"
                className={`absolute inset-0 rounded-xl shadow-md -z-10 ${
                  opt.mode === 'focus'
                    ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border border-amber-400/40 shadow-amber-950/60'
                    : opt.mode === 'dark'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25'
                }`}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : opt.accentColor}`} />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
