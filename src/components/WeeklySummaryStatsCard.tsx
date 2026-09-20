import React from 'react';
import { Clock, BookOpen, TrendingUp, CheckCircle2, ArrowRight, Sparkles, BarChart3, Calendar, Target, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface WeeklySummaryStatsProps {
  hoursStudied: number;
  weeklyGoalHours: number;
  topicsCovered: number;
  topicsMastered?: number;
  topicsInRevision?: number;
  subjectBreakdown?: { name: string; count: number; color: string }[];
  quizAccuracyAvg?: number;
  trendDelta?: string;
  className?: string;
}

export const WeeklySummaryStatsCard: React.FC<WeeklySummaryStatsProps> = ({
  hoursStudied,
  weeklyGoalHours = 15,
  topicsCovered,
  topicsMastered = 14,
  topicsInRevision = 4,
  subjectBreakdown = [
    { name: 'Mathematics', count: 6, color: '#3b82f6' },
    { name: 'Chemistry', count: 5, color: '#10b981' },
    { name: 'Physics', count: 4, color: '#f59e0b' },
    { name: 'Biology', count: 3, color: '#8b5cf6' },
  ],
  quizAccuracyAvg = 78,
  trendDelta = '+2.4 hrs vs last week',
  className = '',
}) => {
  const navigate = useNavigate();

  const progressPercent = Math.min(Math.round((hoursStudied / Math.max(weeklyGoalHours, 1)) * 100), 100);
  const hoursRemaining = Math.max(0, +(weeklyGoalHours - hoursStudied).toFixed(1));

  // Get formatted dates for the current calendar week (Monday to Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatShortDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const weekRangeString = `${formatShortDate(monday)} – ${formatShortDate(sunday)}`;

  return (
    <div
      id="weekly-summary-stats-card"
      className={`relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-zinc-800/90 bg-white/90 dark:bg-[#12121a]/95 backdrop-blur-xl shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-7 space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                <Calendar className="w-3 h-3 text-blue-500" />
                Current Week • {weekRangeString}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                <ShieldCheck className="w-3 h-3" />
                Verified Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
              Weekly Learning Momentum
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Continuous diagnostic tracking of your active study volume and syllabus coverage.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/analytics')}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
            aria-label="View Full Progress & Performance Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Core Requested Stats: 2 Prominent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Hours Studied */}
          <div
            id="stat-hours-studied"
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-[#181824] dark:to-[#14141e] border border-blue-100 dark:border-blue-900/40 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-blue-300 dark:hover:border-blue-700/60 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider">
                    Hours Studied
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {hoursStudied}
                  </span>
                  <span className="text-lg font-bold text-slate-500 dark:text-zinc-400">
                    hrs
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="w-3 h-3" />
                  {trendDelta}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                  Goal: {weeklyGoalHours} hrs/week
                </p>
              </div>
            </div>

            {/* Weekly Target Progress Bar */}
            <div className="space-y-2 mt-5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-zinc-300">
                  Weekly Goal Completion
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                <span>
                  {hoursRemaining === 0
                    ? '🎉 Weekly goal achieved!'
                    : `${hoursRemaining} hrs to hit weekly target`}
                </span>
                <span className="font-medium">
                  {((hoursStudied / 7)).toFixed(1)} hrs/day pace
                </span>
              </div>
            </div>

            {/* Verification label (PRD Page 12 design rule) */}
            <div className="mt-4 pt-3 border-t border-blue-100/60 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
              <span>Logged across Focus Timers & Completed Tasks</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">● Live Synced</span>
            </div>
          </div>

          {/* Card 2: Topics Covered */}
          <div
            id="stat-topics-covered"
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-[#151f1c] dark:to-[#131818] border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider">
                    Topics Covered
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {topicsCovered}
                  </span>
                  <span className="text-lg font-bold text-slate-500 dark:text-zinc-400">
                    Topics
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  +4 This Week
                </span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                  Avg Accuracy: {quizAccuracyAvg}%
                </p>
              </div>
            </div>

            {/* Mastery Distinction (PRD Page 12 Rule: Activity != Mastery) */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                  Mastery Breakdown:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {topicsMastered} Mastered
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {topicsInRevision} In Revision
                  </span>
                </div>
              </div>

              {/* Subject Distribution Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {subjectBreakdown.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700 text-xs font-medium text-slate-700 dark:text-zinc-300 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[11px] font-semibold">{s.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">({s.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification label (PRD Page 12 design rule) */}
            <div className="mt-4 pt-3 border-t border-emerald-100/60 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
              <span>Verified through active recall & chapter quizzes</span>
              <button
                onClick={() => navigate('/student/revision')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>Revise Weak Topics</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pedagogical Action & Next Step Banner (PRD Page 2 & Page 12) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  AI Pedagogical Diagnostic
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  99/100 Learning Loop
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                Quiz accuracy rose to <strong>{quizAccuracyAvg}%</strong> this week. Revise your 2 weak concepts in <em>Physics (Kinematics)</em> before advancing to the next chapter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/student/revision')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Practice Weak Areas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryStatsCard;
