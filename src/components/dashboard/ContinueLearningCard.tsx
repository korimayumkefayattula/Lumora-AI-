import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

interface RecentTopic {
  id: string;
  subject: string;
  topic: string;
  progress: number;
  route: string;
  lastStudied: string;
}

const DEFAULT_RECENT_TOPICS: RecentTopic[] = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    progress: 72,
    route: '/student/quiz',
    lastStudied: 'Yesterday'
  },
  {
    id: '2',
    subject: 'Chemistry',
    topic: 'Chemical Reactions & Equilibrium',
    progress: 54,
    route: '/student/concept-explorer',
    lastStudied: '2 days ago'
  },
  {
    id: '3',
    subject: 'Physics',
    topic: 'Electromagnetic Induction',
    progress: 80,
    route: '/student/tutor',
    lastStudied: '3 days ago'
  }
];

export const ContinueLearningCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Continue Learning</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">Recent modules</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEFAULT_RECENT_TOPICS.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.route)}
            className="clay-widget clay-widget-interactive rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                {item.subject}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                {item.topic}
              </h4>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{item.progress}% complete</span>
                  <span>{item.lastStudied}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform pt-1">
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
