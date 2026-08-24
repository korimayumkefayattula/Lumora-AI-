import React from 'react';
import { X, Check, RotateCcw, LayoutGrid, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { WidgetConfig, WidgetId } from './types';
import { useTheme } from '../../context/ThemeContext';

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: WidgetConfig[];
  onToggleWidget: (id: WidgetId) => void;
  onResetWidgets: () => void;
}

export const WidgetCustomizerModal: React.FC<WidgetCustomizerModalProps> = ({
  isOpen,
  onClose,
  configs,
  onToggleWidget,
  onResetWidgets,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const categories = ['Core Study', 'AI & Learning', 'Productivity', 'Wellness & Social'] as const;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors ${
          theme === 'focus'
            ? 'bg-[#181512] border-[#382e25] text-amber-100'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 theme-focus:border-[#2d241d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 theme-focus:bg-amber-500/10 border border-indigo-500/20 theme-focus:border-amber-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 theme-focus:text-amber-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Customize Dashboard Widgets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/70">
                Personalize your workspace modules and study companion cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 hover:bg-slate-100 dark:hover:bg-slate-800 theme-focus:hover:bg-[#26201a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Category List */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {categories.map((cat) => {
            const catWidgets = configs.filter((w) => w.category === cat);
            if (catWidgets.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 theme-focus:text-amber-400">
                  {cat}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      onClick={() => onToggleWidget(widget.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        widget.enabled
                          ? theme === 'focus'
                            ? 'bg-[#201c18] border-amber-500/50 shadow-xs'
                            : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500/50 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-xs truncate">{widget.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 theme-focus:text-amber-300/60 line-clamp-2 leading-relaxed">
                          {widget.description}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          widget.enabled
                            ? 'bg-indigo-600 theme-focus:bg-amber-500 text-white border-transparent'
                            : 'bg-transparent border-slate-300 dark:border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 theme-focus:border-[#2d241d] bg-slate-50/50 dark:bg-slate-900/50 theme-focus:bg-[#14120f] flex items-center justify-between">
          <button
            onClick={onResetWidgets}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 theme-focus:text-amber-300 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Recommended</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 theme-focus:bg-amber-600 theme-focus:hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
          >
            Done Customizing
          </button>
        </div>
      </div>
    </div>
  );
};
