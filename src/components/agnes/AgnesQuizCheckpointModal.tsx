import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import { AgnesQuizCheckpoint } from '../../types/agnesVideo';

interface AgnesQuizCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpoint: AgnesQuizCheckpoint;
  sceneTitle: string;
  onContinue: () => void;
}

export const AgnesQuizCheckpointModal: React.FC<AgnesQuizCheckpointModalProps> = ({
  isOpen,
  onClose,
  checkpoint,
  sceneTitle,
  onContinue,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!isOpen) return null;

  const isCorrect = selectedIndex === checkpoint.correctIndex;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setHasSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Dr. Agnes Concept Check
              </span>
              <h3 className="text-sm font-black text-white">{sceneTitle}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question */}
        <div className="text-sm font-bold text-slate-100 leading-relaxed">
          {checkpoint.question}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {checkpoint.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isTarget = idx === checkpoint.correctIndex;

            let buttonStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700';

            if (hasSubmitted) {
              if (isTarget) {
                buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
              } else if (isSelected && !isTarget) {
                buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                buttonStyle = 'opacity-40 bg-slate-800/40 border-slate-800 text-slate-400';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-400/40';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmitted}
                onClick={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
              >
                <span>{option}</span>
                {hasSubmitted && isTarget && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {hasSubmitted && isSelected && !isTarget && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation Box */}
        {hasSubmitted && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              isCorrect
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCorrect ? 'Outstanding Intuition!' : 'Dr. Agnes Explanation:'}</span>
            </div>
            <p>{checkpoint.explanation}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onContinue();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Resume Video</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
