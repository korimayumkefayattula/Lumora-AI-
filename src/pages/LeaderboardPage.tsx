import React, { useState } from 'react';
import { Trophy, Flame, Award, Star, Medal, Sparkles } from 'lucide-react';

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'Weekly' | 'Monthly' | 'All Time'>('Weekly');

  const leaderboard = [
    { rank: 1, name: 'Siddharth V.', xp: 4250, streak: 28, badge: '🥇 Gold Scholar', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'Ananya Gupta', xp: 3890, streak: 21, badge: '🥈 Silver Master', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { rank: 3, name: 'Rohan Mehta', xp: 3410, streak: 19, badge: '🥉 Bronze Elite', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
    { rank: 4, name: 'Alex Morgan (You)', xp: 2850, streak: 14, badge: '⭐ Top 5%', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { rank: 5, name: 'Diya Sen', xp: 2600, streak: 12, badge: '✨ Rising Star', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Lumora Student Ranking Arena</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Leaderboard & XP Champions
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {(['Weekly', 'Monthly', 'All Time'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase">
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Badge</th>
                <th className="p-4">Study Streak</th>
                <th className="p-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs font-medium">
              {leaderboard.map((user) => {
                const isYou = user.name.includes('(You)');
                return (
                  <tr 
                    key={user.rank} 
                    className={`${isYou ? 'bg-blue-50/80 dark:bg-blue-900/30 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                  >
                    <td className="p-4 font-black text-slate-900 dark:text-white">
                      {user.rank === 1 && '🥇 #1'}
                      {user.rank === 2 && '🥈 #2'}
                      {user.rank === 3 && '🥉 #3'}
                      {user.rank > 3 && `#${user.rank}`}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-slate-900 dark:text-white font-bold">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-extrabold">
                        {user.badge}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{user.streak} Days</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400">
                      {user.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
