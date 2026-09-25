import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertCircle, Clock } from 'lucide-react';

interface RecommendationProps {
  topic?: string;
  subject?: string;
  reason?: string;
  durationMin?: number;
}

export const LumoraRecommendationCard: React.FC<RecommendationProps> = ({
  topic = 'Chemical Reactions & Stoichiometry',
  subject = 'Chemistry',
  reason = 'You missed 3 questions related to balancing redox equations in yesterday\'s practice.',
  durationMin = 10
}) => {
  const navigate = useNavigate();

  return (
    <div className="clay-widget rounded-[16px] p-5 bg-gradient-to-br from-purple-900/10 via-purple-500/5 to-indigo-900/10 dark:from-purple-950/40 dark:via-[#130E26] dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/60 relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>Lumora Recommends</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            You may want to revise <span className="text-purple-600 dark:text-purple-400 underline decoration-purple-400/40">{topic}</span>
          </h3>

          <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-700 dark:text-slate-200">Why? </strong>
              {reason}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/revision')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-[14px] clay-btn bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm hover:shadow transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Start {durationMin}-minute revision</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
