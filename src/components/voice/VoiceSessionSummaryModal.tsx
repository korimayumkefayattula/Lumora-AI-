import React from 'react';
import { X, CheckCircle2, Clock, HelpCircle, BookOpen, Award, ArrowRight } from 'lucide-react';
import { VoiceSession } from '../../types/voice';

interface VoiceSessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: VoiceSession | null;
}

export const VoiceSessionSummaryModal: React.FC<VoiceSessionSummaryModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  if (!isOpen || !session) return null;

  const minutes = Math.floor((session.durationSeconds || 0) / 60);
  const seconds = (session.durationSeconds || 0) % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;
  const xpEarned = Math.max(15, (session.questionsCount || 0) * 15 + minutes * 5);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden text-center p-6 space-y-6">
        
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Session Completed</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Voice Learning Session Ended</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your voice conversation has been saved to your AI Tutor history.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-700/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-600/80 text-left">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>Duration</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{timeFormatted}</p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <HelpCircle className="w-3 h-3 text-indigo-500" />
              <span>Questions</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{session.questionsCount || 0}</p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <Award className="w-3 h-3 text-amber-500" />
              <span>XP Earned</span>
            </div>
            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">+{xpEarned} XP</p>
          </div>
        </div>

        {/* Topics Covered */}
        {session.topics && session.topics.length > 0 && (
          <div className="text-left space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Topics Discussed</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {session.topics.map((top, i) => (
                <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-[10px] rounded-lg border border-blue-100 dark:border-blue-800">
                  {top}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Return to Lumora AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
