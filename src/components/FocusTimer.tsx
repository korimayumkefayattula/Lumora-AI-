/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Music } from "lucide-react";
import { Subject } from "../types";

interface FocusTimerProps {
  subjects: Subject[];
  onSessionComplete: (subjectId: string, durationMinutes: number) => void;
}

type TimerMode = "pomodoro" | "short" | "long";

const MODE_TIMES: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export default function FocusTimer({ subjects, onSessionComplete }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("general");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [loFiEnabled, setLoFiEnabled] = useState<boolean>(false);

  const incrementTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Global Keyboard Shortcut for Timer Toggle (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync mode changes
  useEffect(() => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[mode]);
    if (incrementTimerRef.current) {
      clearInterval(incrementTimerRef.current);
    }
  }, [mode]);

  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [reflectionText, setReflectionText] = useState("");

  // Audio trigger
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play a peaceful double chime (e.g. digital bell)
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = audioCtx.currentTime;
      playTone(now, 523.25, 0.4); // C5
      playTone(now + 0.15, 659.25, 0.6); // E5
    } catch (e) {
      console.warn("Audio Context could not play:", e);
    }
  };

  // Timer Tick implementation
  useEffect(() => {
    // Simulated Lofi Audio Element
    let lofiAudio: HTMLAudioElement | null = null;
    if (loFiEnabled) {
      lofiAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
      lofiAudio.loop = true;
      lofiAudio.volume = 0.2;
      lofiAudio.play().catch(e => console.warn("Audio autoplay blocked", e));
    }
    
    return () => {
      if (lofiAudio) {
        lofiAudio.pause();
      }
    };
  }, [loFiEnabled]);

  useEffect(() => {
    if (isActive) {
      incrementTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (incrementTimerRef.current) clearInterval(incrementTimerRef.current);
            
            // Audio alerting
            playAlertSound();
            
            // Complete session
            if (mode === "pomodoro") {
              onSessionComplete(selectedSubject, 25);
              setTimeout(() => {
                setShowReflectionPrompt(true);
              }, 1000);
            }
            
            // Return to master state
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (incrementTimerRef.current) {
        clearInterval(incrementTimerRef.current);
      }
    }

    return () => {
      if (incrementTimerRef.current) {
        clearInterval(incrementTimerRef.current);
      }
    };
  }, [isActive, mode, selectedSubject]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  // Calculate percentage of dial completed
  const totalDuration = MODE_TIMES[mode];
  const percentageCompleted = ((totalDuration - timeLeft) / totalDuration) * 100;
  
  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Circular progress properties
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageCompleted / 100) * circumference;

  return (
    <div id="focus-timer-container" className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse-slow" /> Focus Flow Zone
          </h2>
          <div className="flex items-center gap-2">
            {/* Lofi Music Toggle */}
            <button 
              onClick={() => setLoFiEnabled(!loFiEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-bold ${loFiEnabled ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-slate-600'}`}
              title={loFiEnabled ? "Pause Lo-Fi Study Beats" : "Play Lo-Fi Study Beats"}
            >
              <Music className={`w-3.5 h-3.5 ${loFiEnabled ? 'animate-pulse' : ''}`} />
              {loFiEnabled ? "Lo-Fi On" : "Lo-Fi Off"}
            </button>
            {/* Sound control Toggle */}
            <button 
              id="toggle-sound-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 hover:bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              title={soundEnabled ? "Disable Timer Sound" : "Enable Timer Sound"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
          {(["pomodoro", "short", "long"] as TimerMode[]).map((tMode) => (
            <button
              key={tMode}
              id={`time-mode-btn-${tMode}`}
              onClick={() => setMode(tMode)}
              className={`text-xs py-2 px-2 font-medium rounded-lg capitalize transition-all duration-200 ${
                mode === tMode
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100/55"
              }`}
            >
              {tMode === "pomodoro" ? "Study" : tMode === "short" ? "Deep Focus" : "Break"}
            </button>
          ))}
        </div>

        {/* Circular Clock Dial */}
        <div className="relative flex justify-center items-center my-6">
          <svg className="w-52 h-52 transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="stroke-slate-100 fill-transparent"
              strokeWidth="10"
            />
            {/* Active elapsed ring */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="stroke-blue-600 fill-transparent transition-all duration-300"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Time digits display centering */}
          <div className="absolute text-center">
            <div className="text-4xl font-extrabold font-mono text-slate-800 dark:text-slate-100 tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 mt-1">
              {isActive ? "Deep in Focus" : "Paused"}
            </div>
          </div>
        </div>

        {/* Playback controllers */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            id="reset-timer-btn"
            onClick={resetTimer}
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer"
            title="Reset Countdown"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="toggle-timer-btn"
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all ${
              isActive 
                ? "bg-slate-800 hover:bg-slate-900" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
            title="Start/Pause (Cmd+K or Ctrl+K)"
          >
            {isActive ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
          </button>
        </div>
        <div className="text-center text-[10px] text-slate-400 font-medium mb-2">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md">Cmd/Ctrl + K</kbd> to toggle
        </div>
      </div>

      {/* Target Subject Selector */}
      {mode === "pomodoro" && (
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Assign Session To Subject:
          </label>
          <select
            id="timer-subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
          >
            <option value="general">📚 General Study Flow</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                📖 {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reflection Prompt */}
      {showReflectionPrompt && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/50">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mb-2">Session Complete!</h3>
          <p className="text-sm font-medium text-slate-500 mb-6">What did you learn today? Taking 30 seconds to summarize boosts retention by 40%.</p>
          <textarea
            value={reflectionText}
            onChange={e => setReflectionText(e.target.value)}
            placeholder="I learned about..."
            className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm resize-none mb-4"
          ></textarea>
          <button
            onClick={() => {
              setShowReflectionPrompt(false);
              setReflectionText("");
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Save Reflection
          </button>
        </div>
      )}
    </div>
  );
}
