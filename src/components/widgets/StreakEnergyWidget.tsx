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
        {/* Streak Main Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3.5 rounded-2xl border transition-all ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#382e25]'
              : theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/60'
              : 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-amber-200/60'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/70 uppercase tracking-wider">
                Current Streak
              </span>
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-display tracking-tight text-amber-500">
                {streakDays}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 theme-focus:text-amber-200">
                Days in a row
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles className="w-3 h-3" />
              <span>1.5x XP Boost Active</span>
            </div>
          </div>

          {/* Cognitive Battery */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#382e25]'
              : theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/60'
              : 'bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-emerald-200/60'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/70 uppercase tracking-wider">
                Brain Energy
              </span>
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-display tracking-tight text-emerald-500">
                {energyLevel}%
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 theme-focus:text-amber-200">
                Optimal
              </span>
            </div>
            {/* Battery bar */}
            <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 theme-focus:bg-[#332b22] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${energyLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Day Dots */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/60">
            <span>Weekly Consistency</span>
            <span className="text-indigo-500 theme-focus:text-amber-400">5 / 7 Days Done</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((item, idx) => (
              <div
                key={idx}
                className={`py-2 rounded-xl text-center flex flex-col items-center justify-center border transition-all ${
                  item.active
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-xs shadow-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/40 theme-focus:bg-[#201c18] border-slate-200 dark:border-slate-800 theme-focus:border-[#382e25] text-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{item.day}</span>
                {item.active ? (
                  <Flame className="w-3 h-3 mt-0.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Badge */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#382e25] text-amber-200'
            : 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200'
        }`}>
          <Clock className="w-4 h-4 text-indigo-500 theme-focus:text-amber-400 shrink-0" />
          <span className="text-[11px] font-medium leading-tight">
            <strong>Optimal Focus Window:</strong> 10:00 AM – 12:30 PM today. High cognitive endurance detected.
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
