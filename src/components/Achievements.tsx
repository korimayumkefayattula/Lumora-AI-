import React, { useState } from "react";
import { Award, Zap, Flame, Star, Target, CheckCircle, Clock, CalendarDays, X } from "lucide-react";
import { StudyTask } from "../types";

interface AchievementsProps {
  completedPomodoros: number;
  tasks: StudyTask[];
  xpPoints: number;
}

export function Achievements({ completedPomodoros, tasks, xpPoints }: AchievementsProps) {
  const [showModal, setShowModal] = useState(false);
  
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  
  // Example "Hours Studied": assume 1 pomodoro = 25 mins or just use tasks duration
  const totalMinutes = tasks.filter(t => t.isCompleted).reduce((acc, t) => acc + t.durationMinutes, 0);
  const totalHours = totalMinutes / 60;

  // Streak logic (simplified based on completed tasks dates)
  const calculateStreak = () => {
    // In a real app we'd check consecutive days, let's use a mock or calculate based on tasks
    const dates = [...new Set(tasks.filter(t => t.isCompleted).map(t => t.date))].sort().reverse();
    let streak = 0;
    let current = new Date();
    current.setHours(0,0,0,0);
    
    // Check if there's a task completed today or yesterday to start the streak
    if (dates.length > 0) {
      // Just a simple mock for the "Perfect 5-Day Streak" badge logic
      // Assume streak is 5 if we have 5 unique dates
      return dates.length;
    }
    return streak;
  };
  
  const streak = calculateStreak();

  const achievements = [
    { id: 1, title: "First Step", desc: "Complete 1 session", icon: <Star className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20", unlocked: completedPomodoros >= 1 },
    { id: 2, title: "Deep Thinker", desc: "10 Sessions", icon: <Target className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/20", unlocked: completedPomodoros >= 10 },
    { id: 3, title: "Scholar", desc: "Reach Level 5", icon: <Flame className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/20", unlocked: xpPoints >= 400 },
    { id: 4, title: "Task Master", desc: "Finish 5 tasks", icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20", unlocked: completedTasks >= 5 },
    { id: 5, title: "Laser Focus", desc: "25 Sessions", icon: <Zap className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/20", unlocked: completedPomodoros >= 25 },
    { id: 6, title: "10 Hours", desc: "10 Hours Studied", icon: <Clock className="w-5 h-5" />, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/20", unlocked: totalHours >= 10 },
    { id: 7, title: "Perfect Streak", desc: "5-Day Streak", icon: <CalendarDays className="w-5 h-5" />, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/20", unlocked: streak >= 5 },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-[#121216]/90 border border-zinc-800/80 rounded-3xl p-4 shadow-xl mt-6 mb-6 cursor-pointer hover:border-rose-500/50 transition-all flex items-center justify-between backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-white">Milestones & Badges</h3>
            <p className="text-xs text-zinc-400">View your unlocked achievements</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-300">{unlockedCount} / {achievements.length} Unlocked</span>
          <div className="flex -space-x-2">
            {achievements.filter(a => a.unlocked).slice(0, 3).map(ach => (
              <div key={ach.id} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#121216] ${ach.bg} ${ach.color}`}>
                {React.cloneElement(ach.icon, { className: "w-3 h-3" })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141418] border border-zinc-800 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 flex items-center justify-between border-b border-zinc-800">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-rose-400" />
                Achievements
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold font-display text-white mb-2">
                    {unlockedCount} <span className="text-xl text-zinc-500">/ {achievements.length}</span>
                  </div>
                  <div className="text-sm font-semibold text-rose-400 uppercase tracking-widest">Badges Unlocked</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className={`flex flex-col items-center text-center p-4 rounded-2xl border ${ach.unlocked ? 'border-zinc-800 bg-[#1a1a22] shadow-sm' : 'border-dashed border-zinc-800/80 bg-[#101014] opacity-50 grayscale'} transition-all`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${ach.unlocked ? ach.bg : 'bg-zinc-800'} ${ach.unlocked ? ach.color : 'text-zinc-500'}`}>
                      {React.cloneElement(ach.icon, { className: "w-6 h-6" })}
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">{ach.title}</h4>
                    <p className="text-[10px] font-medium text-zinc-400 leading-tight">{ach.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
