import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Flame, Clock, Target, Award, AlertTriangle, ArrowRight, Mic, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VoiceSessionService, VoiceStats } from '../services/voiceSessionService';

export default function ProgressAnalyticsPage() {
  const navigate = useNavigate();
  const [voiceStats, setVoiceStats] = useState<VoiceStats>({
    totalSessions: 0,
    totalDurationSeconds: 0,
    totalQuestions: 0,
    lastSessionDate: new Date().toISOString(),
  });

  useEffect(() => {
    setVoiceStats(VoiceSessionService.getStats());
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Lumora Student Mastery Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Progress & Performance Analytics
          </h1>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] font-bold uppercase text-slate-400">STUDY STREAK</span>
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">14 Days</p>
          <span className="text-[10px] text-emerald-600 font-bold">Top 5% among peers</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[10px] font-bold uppercase text-slate-400">STUDY HOURS</span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">48.5 Hrs</p>
          <span className="text-[10px] text-blue-600 font-bold">+6.2 hrs this week</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[10px] font-bold uppercase text-slate-400">QUIZ ACCURACY</span>
            <Target className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">88%</p>
          <span className="text-[10px] text-emerald-600 font-bold">+4% from last month</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-[10px] font-bold uppercase text-slate-400">XP POINTS</span>
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">2,850 XP</p>
          <span className="text-[10px] text-purple-600 font-bold">Level 12 Master</span>
        </div>
      </div>

      {/* Subject Mastery Distribution */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span>Subject Mastery Levels</span>
        </h2>

        <div className="space-y-3">
          {[
            { name: 'Physics', percent: 85, color: 'bg-blue-600' },
            { name: 'Chemistry', percent: 72, color: 'bg-emerald-600' },
            { name: 'Mathematics', percent: 94, color: 'bg-indigo-600' },
            { name: 'Biology', percent: 68, color: 'bg-amber-600' }
          ].map(s => (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{s.name}</span>
                <span>{s.percent}% Mastered</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div className={`${s.color} h-full rounded-full transition-all duration-500`} style={{ width: `${s.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Areas Identified */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>AI-Identified Weak Concepts (Requires Attention)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase">Physics Ch 4</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Kinematics Numericals with Calculus</h3>
            </div>
            <button 
              onClick={() => navigate('/student/doubt-solver')} 
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
            >
              <span>Practice</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase">Chemistry Ch 2</span>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Organic Reaction Mechanisms</h3>
            </div>
            <button 
              onClick={() => navigate('/student/doubt-solver')}
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
            >
              <span>Practice</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Learning Intelligence Stats */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl border border-blue-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-display">AI Voice Learning Intelligence</h3>
              <p className="text-[11px] text-blue-200">Real-time oral Q&A and doubt resolution activity</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student/tutor')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Open Voice Tutor
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-blue-200">Total Voice Sessions</span>
            <p className="text-xl font-extrabold text-white mt-1">{voiceStats.totalSessions || 1} Sessions</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-blue-200">Voice Practice Time</span>
            <p className="text-xl font-extrabold text-white mt-1">{Math.max(4, Math.round(voiceStats.totalDurationSeconds / 60))} Mins</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold uppercase text-blue-200">Doubts Solved by Voice</span>
            <p className="text-xl font-extrabold text-cyan-300 mt-1">{voiceStats.totalQuestions || 3} Questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
