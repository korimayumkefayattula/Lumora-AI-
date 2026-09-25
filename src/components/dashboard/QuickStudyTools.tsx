import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  HelpCircle, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Calendar,
  Video,
  Target
} from 'lucide-react';

export const QuickStudyTools: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    { label: 'Tutor', icon: BrainCircuit, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', route: '/student/tutor' },
    { label: 'Solve', icon: HelpCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', route: '/student/homework-helper' },
    { label: 'Quiz', icon: CheckCircle2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', route: '/student/quiz' },
    { label: 'Notes', icon: FileText, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', route: '/student/notes' },
    { label: 'Cards', icon: Layers, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', route: '/student/flashcards' },
    { label: 'Plan', icon: Calendar, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', route: '/student/study-planner' },
    { label: 'Agnes AI', icon: Video, color: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', route: '/student/agnes-videos' },
    { label: '20 Features', icon: Target, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40', route: '/student/extra-features' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Quick Study Tools
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">Workspace Launchers</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              onClick={() => navigate(tool.route)}
              className="clay-widget clay-widget-interactive rounded-[16px] p-3 border border-slate-200/90 dark:border-purple-900/40 transition-all flex flex-col items-center justify-center gap-1.5 group active:scale-95 text-center"
            >
              <div className={`w-8 h-8 rounded-[12px] ${tool.bg} ${tool.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
