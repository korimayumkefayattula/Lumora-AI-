import React from 'react';
import { Palette, Type, Check, Sparkles } from 'lucide-react';
import { ThemeId, FontId } from '../../types/websiteBuilder';
import { THEME_DEFINITIONS } from '../../data/websiteTemplates';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  currentFont: FontId;
  onSelectTheme: (theme: ThemeId) => void;
  onSelectFont: (font: FontId) => void;
}

const FONTS: { id: FontId; label: string; preview: string; fontClass: string }[] = [
  { id: 'sans', label: 'Modern Sans', preview: 'Clean & Ultra Legible', fontClass: 'font-sans' },
  { id: 'display', label: 'Playful Display', preview: 'Punchy & Energetic', fontClass: 'font-sans font-black tracking-tight' },
  { id: 'mono', label: 'Retro Monospace', preview: 'Code & 8-Bit Vibes', fontClass: 'font-mono' },
  { id: 'serif', label: 'Classical Serif', preview: 'Academic & Scholarly', fontClass: 'font-serif' }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  currentFont,
  onSelectTheme,
  onSelectFont
}) => {
  return (
    <div className="space-y-6">
      {/* Themes List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Palette className="w-4 h-4 text-rose-500" />
          <span>Color Aesthetics & Ambience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(THEME_DEFINITIONS).map(theme => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md bg-white dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{theme.emoji}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-3">
                  {theme.description}
                </p>

                {/* Color Swatch Pill */}
                <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${theme.gradient}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family Selector */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Type className="w-4 h-4 text-rose-500" />
          <span>Typography Styling</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {FONTS.map(f => {
            const isSelected = currentFont === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFont(f.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 font-bold text-rose-600 dark:text-rose-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold">{f.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <p className={`text-[11px] opacity-70 mt-1 ${f.fontClass}`}>
                  {f.preview}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
