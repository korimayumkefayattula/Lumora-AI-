import React, { useState, useEffect } from 'react';
import { Droplet, Eye, Shield, Smile, Check, Plus, Minus, RotateCcw } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';

export const WellnessWidget: React.FC = () => {
  const { theme } = useTheme();

  // Water tracking
  const [glasses, setGlasses] = useState(5);
  const targetGlasses = 8;

  // 20-20-20 Eye timer (20 min countdown)
  const [eyeSeconds, setEyeSeconds] = useState(20 * 60);
  const [isEyeTimerRunning, setIsEyeTimerRunning] = useState(true);
  const [eyeBreakActive, setEyeBreakActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isEyeTimerRunning && eyeSeconds > 0) {
      interval = setInterval(() => {
        setEyeSeconds((prev) => prev - 1);
      }, 1000);
    } else if (eyeSeconds === 0) {
      setEyeBreakActive(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEyeTimerRunning, eyeSeconds]);

  const resetEyeTimer = () => {
    setEyeSeconds(20 * 60);
    setEyeBreakActive(false);
    setIsEyeTimerRunning(true);
  };

  const formatEyeTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <WidgetContainer
      id="widget-wellness"
      title="Ergonomics & Eye-Care"
      subtitle="Hydration & 20-20-20 eye strain protection"
      icon={Eye}
      badge="20-20-20 Active"
      badgeColor="bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/30"
    >
      <div className="space-y-4">
        {/* Eye Break Alert if time hit */}
        {eyeBreakActive && (
          <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-200 text-xs space-y-2 animate-bounce">
            <div className="flex items-center gap-2 font-bold">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Time for your 20-20-20 Eye Break!</span>
            </div>
            <p className="text-[11px] leading-tight text-amber-100">
              Look at an object at least 20 feet away for 20 seconds to relax your optic ciliary muscles.
            </p>
            <button
              onClick={resetEyeTimer}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Done & Reset Timer
            </button>
          </div>
        )}

        {/* 2-Column Row: Water + Eye Timer */}
        <div className="grid grid-cols-2 gap-3">
          {/* Hydration Tracker */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#382e25]'
              : 'bg-sky-50/60 dark:bg-slate-800/40 border-sky-100 dark:border-slate-700/60'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/60 uppercase">
                Hydration
              </span>
              <Droplet className="w-4 h-4 text-sky-500 fill-sky-500/30" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-display text-sky-500">
                {glasses}
              </span>
              <span className="text-xs font-bold text-slate-400">/ {targetGlasses} cups</span>
            </div>

            {/* Quick +/- buttons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <button
                onClick={() => setGlasses(Math.max(0, glasses - 1))}
                className="p-1 rounded-lg bg-white dark:bg-slate-700 theme-focus:bg-[#14120f] border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-slate-800"
                title="Remove cup"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setGlasses(glasses + 1)}
                className="flex-1 py-1 px-2 rounded-lg bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs hover:bg-sky-600 active:scale-95"
              >
                <Plus className="w-3 h-3" /> +250ml
              </button>
            </div>
          </div>

          {/* 20-20-20 Eye Timer */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#382e25]'
              : 'bg-teal-50/60 dark:bg-slate-800/40 border-teal-100 dark:border-slate-700/60'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 theme-focus:text-amber-300/60 uppercase">
                Next Eye Rest
              </span>
              <Eye className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-display text-teal-500">
                {formatEyeTime(eyeSeconds)}
              </span>
            </div>

            {/* Quick Reset */}
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-400">Rule: 20ft / 20sec</span>
              <button
                onClick={resetEyeTimer}
                className="p-1 rounded-lg bg-white dark:bg-slate-700 theme-focus:bg-[#14120f] border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-teal-600"
                title="Restart 20min timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Posture Nudge */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-[11px] ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#382e25] text-amber-200'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
        }`}>
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>Posture Check:</strong> Keep spine straight and screen at eye-level to maintain oxygen flow to the brain.
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};
