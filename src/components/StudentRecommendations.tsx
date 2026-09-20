import React from 'react';
import { AlertTriangle, Clock, RefreshCw, ArrowRight, Sparkles, CheckCircle2, ChevronRight, BookOpen, Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendationItem {
  id: string;
  subject: string;
  topic: string;
  priority: 'High' | 'Medium' | 'Low';
  priorityLabel: string;
  actionType: 'Targeted Lesson' | 'Flashcards & Quiz' | 'Quick Spaced Recall';
  route: string;
  accuracyScore: number;
  reason: string;
  color: string;
}

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-1',
    subject: 'Physics',
    topic: 'Kinematics Numericals with Calculus',
    priority: 'High',
    priorityLabel: 'Weak Concept',
    actionType: 'Targeted Lesson',
    route: '/student/doubt-solver',
    accuracyScore: 54,
    reason: 'Recent test accuracy below 60%. Calculus integration in 1D motion needs practice.',
    color: '#ef4444',
  },
  {
    id: 'rec-2',
    subject: 'Chemistry',
    topic: 'Reaction Kinetics (SN1 vs SN2 Mechanisms)',
    priority: 'Medium',
    priorityLabel: 'Reinforcement Due',
    actionType: 'Flashcards & Quiz',
    route: '/student/flashcards',
    accuracyScore: 68,
    reason: 'Mastered 5 days ago. Spaced repetition interval is active for long-term retention.',
    color: '#f59e0b',
  },
  {
    id: 'rec-3',
    subject: 'Mathematics',
    topic: 'Determinants & Cramer\'s Rule Inverses',
    priority: 'Low',
    priorityLabel: 'Spaced Recall',
    actionType: 'Quick Spaced Recall',
    route: '/student/quiz',
    accuracyScore: 86,
    reason: 'High accuracy topic due for rapid 5-minute memory refresh.',
    color: '#3b82f6',
  },
];

export const StudentRecommendations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="section-recommendations" className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Section 5 • PRD Priority Module 6
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Adaptive AI Recommendations & Revision</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              3 Needs Action
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Core diagnostic loop: Quiz Result → Weak Concept Identification → Targeted Revision Task → Retest.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/revision')}
          className="self-start sm:self-center px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span>Open Revision Center</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_RECOMMENDATIONS.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#12121a] border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700/60 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      item.priority === 'High'
                        ? 'rgba(239, 68, 68, 0.12)'
                        : item.priority === 'Medium'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(59, 130, 246, 0.12)',
                    color: item.color,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  {item.priority} Priority • {item.priorityLabel}
                </span>

                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                  {item.accuracyScore}% Acc
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  {item.subject}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.topic}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {item.reason}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-500" />
                {item.actionType}
              </span>

              <button
                onClick={() => navigate(item.route)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95"
              >
                <span>Start</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentRecommendations;
