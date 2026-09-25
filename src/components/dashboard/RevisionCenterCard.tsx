import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const DUE_REVISIONS = [
  { topic: 'Photosynthesis & Light Reactions', subject: 'Biology', interval: 'Day 3 recall' },
  { topic: 'Chemical Reactions & Balancing', subject: 'Chemistry', interval: 'Day 7 recall' },
  { topic: 'Trigonometric Identities & Proofs', subject: 'Mathematics', interval: 'Day 14 recall' }
];

export const RevisionCenterCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="clay-widget rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[10px] bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Revision Center
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">Active Recall Spaced Reviews</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/revision')}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>Start Revision</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
          Due Today ({DUE_REVISIONS.length})
        </span>

        {DUE_REVISIONS.map((item) => (
          <div
            key={item.topic}
            onClick={() => navigate('/student/revision')}
            className="p-2.5 rounded-[12px] border border-slate-100 dark:border-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 cursor-pointer transition flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {item.topic}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {item.subject} • {item.interval}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
              Revise →
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <button
          onClick={() => navigate('/student/revision')}
          className="w-full py-2.5 rounded-[14px] clay-btn bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Start All Due Revisions (15m)</span>
        </button>
      </div>
    </div>
  );
};
