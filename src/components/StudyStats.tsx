/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, Flame, CheckCircle, BookOpen, Clock, Target, ChevronRight } from "lucide-react";
import { Subject, StudyTask } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface StudyStatsProps {
  subjects: Subject[];
  tasks: StudyTask[];
  completedPomodoros: number;
  xpPoints: number;
}

export default function StudyStats({ subjects, tasks, completedPomodoros, xpPoints }: StudyStatsProps) {
  const [dailyGoal, setDailyGoal] = useState<number>(5);

  // Calculations
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  
  const totalMinutesPlanned = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const totalHoursPlanned = (totalMinutesPlanned / 60).toFixed(1);
  
  const totalMinutesCompleted = tasks
    .filter((t) => t.isCompleted)
    .reduce((acc, t) => acc + t.durationMinutes, 0);
  const totalHoursCompleted = (totalMinutesCompleted / 60).toFixed(1);

  // Focus time in Pomodoros (25 mins per session) + checked tasks focus minutes
  const totalPomodoroMinutes = completedPomodoros * 25;
  const grandTotalMinutes = totalMinutesCompleted + totalPomodoroMinutes;
  const grandTotalHours = (grandTotalMinutes / 60).toFixed(1);

  // Daily Study Goal calculations
  const todayDate = new Date().toISOString().split("T")[0];
  const todayCompletedTasks = tasks.filter((t) => t.isCompleted && t.date === todayDate).length;
  const dailyGoalProgress = dailyGoal > 0 ? Math.min((todayCompletedTasks / dailyGoal) * 100, 100) : 0;

  // Chart Data calculation for the last 7 days
  const last7DaysTasks = tasks.filter((t) => {
    if (!t.isCompleted) return false;
    const taskDate = new Date(t.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - taskDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const chartData = subjects.map(subject => {
    const subjectTasks = last7DaysTasks.filter(t => t.subjectId === subject.id);
    const totalMinutes = subjectTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
    return {
      name: subject.name,
      hours: Number((totalMinutes / 60).toFixed(1)),
      color: subject.color
    };
  });

  return (
    <div className="flex flex-col gap-6 mb-6">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display text-white">Overview</h2>
        <select className="bg-[#141418] border border-zinc-800 text-xs rounded-xl py-1.5 px-3 text-zinc-300 outline-none hover:border-rose-500/50 transition-all font-medium">
          <option>This Week</option>
          <option>Today</option>
          <option>This Month</option>
        </select>
      </div>

      <div id="stats-dashboard-panel" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-default hover:shadow-xl shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-3xl font-bold font-display text-white tracking-tight">
              {todayCompletedTasks}
            </h3>
            <svg className="w-16 h-8 opacity-70" viewBox="0 0 50 20">
              <path d="M0 15 Q 10 5, 20 10 T 35 2 L 50 8" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-sm font-medium text-zinc-300">Today</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#121216]/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-default hover:shadow-xl shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-3xl font-bold font-display text-white tracking-tight">
              {completedPomodoros}
            </h3>
            <svg className="w-16 h-8 opacity-70" viewBox="0 0 50 20">
               <path d="M0 10 Q 10 18, 20 8 T 40 12 L 50 5" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-sm font-medium text-zinc-300">Focus</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#121216]/90 border border-zinc-800/80 hover:border-rose-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-default hover:shadow-xl shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-3xl font-bold font-display text-white tracking-tight">
              {subjects.length}
            </h3>
            <svg className="w-16 h-8 opacity-70" viewBox="0 0 50 20">
               <path d="M0 12 Q 10 2, 25 10 T 40 5 L 50 15" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-sm font-medium text-zinc-300">Projects</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#121216]/90 border border-zinc-800/80 hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-default hover:shadow-xl shadow-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-3xl font-bold font-display text-white tracking-tight">
              {Math.round(xpPoints * 1.2 + completedPomodoros * 5)}
            </h3>
            <svg className="w-16 h-8 opacity-70" viewBox="0 0 50 20">
               <path d="M0 5 Q 15 15, 25 5 T 45 10 L 50 2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-sm font-medium text-zinc-300">Focus Score</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-[#121216]/90 border border-zinc-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-sm font-bold font-display text-white mb-4">Study Hours per Subject (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#18181c', borderRadius: '12px', border: '1px solid #27272a', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#e11d48'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121216]/90 border border-zinc-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col">
          <h3 className="text-sm font-bold font-display text-white mb-4">Subject Targets vs Completion</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[256px] custom-scrollbar">
            {subjects.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-sm">No subjects added yet.</div>
            ) : (
              subjects.map(subject => {
                const subjectTasks = tasks.filter(t => t.subjectId === subject.id && t.isCompleted);
                const completedMins = subjectTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
                const currentHours = Number((completedMins / 60).toFixed(1));
                const targetHours = subject.targetHoursPerWeek;
                const percent = Math.min(Math.round((currentHours / targetHours) * 100) || 0, 100);

                return (
                  <div key={subject.id} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject.color }} />
                        <span className="text-sm font-medium text-zinc-200">{subject.name}</span>
                      </div>
                      <div className="text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-200">{currentHours}h</span> / {targetHours}h
                      </div>
                    </div>
                    <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${percent}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
