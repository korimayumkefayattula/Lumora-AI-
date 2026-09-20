import React, { useState, useEffect } from 'react';
import { StickyNote, Sparkles, Check, Trash2, Copy, Palette } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';

export const QuickScratchpadWidget: React.FC = () => {
  const { theme } = useTheme();

  const [noteContent, setNoteContent] = useState(() => {
    return (
      localStorage.getItem('lumora_scratchpad_note') ||
      '• Remember: Gauss-Jordan elimination on Page 44\n• Review formula sheet for SN2 mechanism\n• Submit Web Dev PR before Friday 5 PM'
    );
  });

  const [colorTheme, setColorTheme] = useState<'amber' | 'lavender' | 'emerald' | 'rose'>('amber');
  const [copied, setCopied] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumora_scratchpad_note', noteContent);
  }, [noteContent]);

  const handleAiFormat = () => {
    setIsFormatting(true);
    setTimeout(() => {
      const lines = noteContent
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const formatted = lines
        .map((l) => (l.startsWith('•') || l.startsWith('-') ? l : `• ${l}`))
        .join('\n');

      setNoteContent(formatted);
      setIsFormatting(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const colorStyles = {
    amber: 'neuro-inset bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100 border border-amber-300/40',
    lavender: 'neuro-inset bg-purple-50/50 dark:bg-purple-950/20 text-purple-950 dark:text-purple-100 border border-purple-300/40',
    emerald: 'neuro-inset bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100 border border-emerald-300/40',
    rose: 'neuro-inset bg-rose-50/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-100 border border-rose-300/40',
  };

  return (
    <WidgetContainer
      id="widget-quick-scratchpad"
      title="Scratchpad & Quick Memo"
      subtitle="Auto-saved local note buffer"
      icon={StickyNote}
      badge="Auto-saved"
      badgeColor="bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30"
      headerAction={
        <div className="flex items-center gap-1.5 p-1 rounded-full neuro-inset">
          {(['amber', 'lavender', 'emerald', 'rose'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColorTheme(c)}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                colorTheme === c ? 'scale-125 shadow-xs ring-1.5 ring-white' : 'opacity-60 hover:opacity-100'
              } ${
                c === 'amber'
                  ? 'bg-amber-400'
                  : c === 'lavender'
                  ? 'bg-purple-400'
                  : c === 'emerald'
                  ? 'bg-emerald-400'
                  : 'bg-rose-400'
              }`}
              title={`Switch to ${c} color theme`}
            />
          ))}
        </div>
      }
    >
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Recessed Neuromorphic Note Slate */}
        <div className={`flex-1 rounded-2xl p-3.5 flex flex-col transition-all ${
          theme === 'focus' ? 'neuro-inset bg-[#14120f] text-amber-100 border border-[#382e25]' : colorStyles[colorTheme]
        }`}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Jot down quick thoughts, formulas, or reminders..."
            className="w-full flex-1 bg-transparent text-xs font-mono resize-none focus:outline-none leading-relaxed placeholder-slate-400"
            rows={5}
          />
        </div>

        {/* Action Controls - Neuromorphic Tactile Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleAiFormat}
            disabled={isFormatting}
            className="px-3 py-1.5 rounded-xl neuro-btn-convex text-[11px] font-extrabold flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isFormatting ? 'animate-spin' : ''}`} />
            <span>Format Bullets</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl neuro-btn-convex bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs flex items-center gap-1"
              title="Copy note"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setNoteContent('')}
              className="p-2 rounded-xl neuro-btn-convex bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-500 text-xs"
              title="Clear note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};
