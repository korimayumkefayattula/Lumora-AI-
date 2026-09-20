import React, { useState } from 'react';
import { Flame, Zap, BatteryCharging, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';

interface StreakEnergyWidgetProps {
  streakDays?: number;
  xpPoints?: number;
}

export const StreakEnergyWidget: React.FC<StreakEnergyWidgetProps> = ({
  streakDays = 5,
  xpPoints = 340,
}) => {
  const { theme } = useTheme();
  const [energyLevel, setEnergyLevel] = useState(88); // %
  const [energyState, setEnergyState] = useState<'peak' | 'optimal' | 'recharging'>('peak');

  const weekDays = [
    { day: 'M', active: true, minutes: 45 },
    { day: 'T', active: true, minutes: 60 },
    { day: 'W', active: true, minutes: 50 },
    { day: 'T', active: true, minutes: 90 },
    { day: 'F', active: true, minutes: 75 },
    { day: 'S', active: false, minutes: 0 },
    { day: 'S', active: false, minutes: 0 },
  ];

  return (
    <WidgetContainer
      id="widget-streak-energy"
      title="Streak & Cognitive Battery"
      subtitle="Bio-rhythm & momentum tracking"
      icon={Flame}
      badge={`${streakDays} Days Fire`}
      badgeColor="bg-amber-500/20 text-amber-500 font-black border border-amber-500/30"
    >
      <div className="space-y-4">
        {/* Streak Main Stats Row - Claymorphic 3D Inflated Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className={`p-4 rounded-3xl clay-surface clay-card-interactive transition-all cursor-pointer ${
            theme === 'focus'
              ? 'bg-gradient-to-br from-[#26201a] to-[#1a1613] text-amber-100 border border-amber-500/20'
              : theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/95 text-white border border-white/10'
              : 'bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-white text-slate-800 border border-amber-200/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500/90">
                Current Streak
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center clay-pill bg-amber-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-display tracking-tight text-amber-500 drop-shadow-xs">
                {streakDays}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 theme-focus:text-amber-200/80">
                Days
              </span>
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black clay-pill bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/25">
              <Sparkles className="w-2.5 h-2.5" />
              <span>1.5x Multiplier</span>
            </div>
          </div>

          {/* Cognitive Battery - Claymorphic 3D Card */}
          <div className={`p-4 rounded-3xl clay-surface clay-card-interactive transition-all cursor-pointer ${
            theme === 'focus'
              ? 'bg-gradient-to-br from-[#1a2520] to-[#121a16] text-emerald-100 border border-emerald-500/20'
              : theme === 'dark'
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/95 text-white border border-white/10'
              : 'bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-white text-slate-800 border border-emerald-200/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500/90">
                Brain Battery
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center clay-pill bg-emerald-500/20">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-display tracking-tight text-emerald-500 drop-shadow-xs">
                {energyLevel}%
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 theme-focus:text-emerald-200/80">
                Optimal
              </span>
            </div>
            {/* Neuromorphic Inset Sunken Battery Channel */}
            <div className="mt-3 w-full h-2.5 neuro-inset rounded-full p-0.5 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${energyLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Day Dots - Neuromorphic Tactile Buttons */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/60 px-1">
            <span>Weekly Momentum</span>
            <span className="text-indigo-500 dark:text-rose-400 theme-focus:text-amber-400 font-extrabold">5 / 7 Days Active</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((item, idx) => (
              <div
                key={idx}
                className={`py-2.5 rounded-2xl text-center flex flex-col items-center justify-center transition-all ${
                  item.active
                    ? 'clay-btn bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black border border-amber-300/40'
                    : 'neuro-inset text-slate-400 dark:text-slate-500'
                }`}
              >
                <span className="text-[10px] uppercase font-black tracking-wider">{item.day}</span>
                {item.active ? (
                  <Flame className="w-3.5 h-3.5 mt-0.5 fill-slate-950" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 dark:bg-slate-600/60 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Badge - Glassmorphic Frosted Pill */}
        <div className={`p-3 rounded-2xl glass-panel flex items-center gap-3 text-xs ${
          theme === 'focus'
            ? 'border-amber-500/30 text-amber-200'
            : 'border-white/20 text-slate-700 dark:text-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center clay-icon-box shrink-0 bg-indigo-500/20 text-indigo-500 dark:text-rose-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium leading-relaxed">
            <strong className="font-extrabold">Peak Cognitive Rhythm:</strong> 10:00 AM – 12:30 PM. High neural retention predicted.
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
