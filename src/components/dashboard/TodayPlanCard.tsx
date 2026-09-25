import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Calendar, ArrowRight } from 'lucide-react';

interface PlanItem {
  id: string;
  subject: string;
  topic: string;
  durationMin: number;
  completed: boolean;
}

const INITIAL_PLAN: PlanItem[] = [
  { id: '1', subject: 'Physics', topic: 'Magnetism Problem Set', durationMin: 30, completed: true },
  { id: '2', subject: 'Chemistry', topic: 'Chemical Equilibrium Review', durationMin: 40, completed: false },
  { id: '3', subject: 'Mathematics', topic: 'Quadratic Roots Practice', durationMin: 45, completed: false }
];

export const TodayPlanCard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<PlanItem[]>(INITIAL_PLAN);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="clay-widget rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[10px] bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Today's Plan
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {completedCount} of {tasks.length} completed
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/study-planner')}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>View full plan</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>Daily Completion</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between p-2.5 rounded-[12px] border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition text-xs select-none"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
              <div>
                <span
                  className={`font-semibold ${
                    task.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {task.subject} — {task.topic}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 font-medium">
              {task.durationMin} min
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
