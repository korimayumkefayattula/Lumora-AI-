import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

interface WeakItem {
  subject: string;
  topic: string;
  masteryPercent: number;
}

const WEAK_AREAS: WeakItem[] = [
  { subject: 'Chemistry', topic: 'Chemical Reactions', masteryPercent: 55 },
  { subject: 'Mathematics', topic: 'Quadratic Equations', masteryPercent: 62 },
  { subject: 'Physics', topic: 'Current Electricity', masteryPercent: 70 }
];

export const WeakAreasCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="clay-widget rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Needs Attention
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">Identified Weak Areas</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/revision')}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Start Revision</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {WEAK_AREAS.map((item) => (
          <div key={item.topic} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 font-normal mr-1">{item.subject}:</span>
                {item.topic}
              </span>
              <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                {item.masteryPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${item.masteryPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1">
        <button
          onClick={() => navigate('/student/revision')}
          className="w-full py-2.5 rounded-[14px] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Launch Targeted Practice</span>
        </button>
      </div>
    </div>
  );
};
