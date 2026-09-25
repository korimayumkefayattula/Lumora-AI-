import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowRight, Clock, CheckCircle2, Award } from 'lucide-react';

export const CompactProgressCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="clay-widget rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[10px] bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Your Progress
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">Weekly Target Metrics</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/analytics')}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>View Progress</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* This Week Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">This week</span>
          <span className="text-purple-600 dark:text-purple-400 font-mono font-black">78%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-[78%]" />
        </div>
      </div>

      {/* 3 Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-2 rounded-[12px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
          <span className="text-[10px] text-slate-400 block font-mono">Study time</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">6h 40m</span>
        </div>

        <div className="p-2 rounded-[12px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
          <span className="text-[10px] text-slate-400 block font-mono">Questions</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">124</span>
        </div>

        <div className="p-2 rounded-[12px] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
          <span className="text-[10px] text-slate-400 block font-mono">Mastered</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">18 topics</span>
        </div>
      </div>
    </div>
  );
};
