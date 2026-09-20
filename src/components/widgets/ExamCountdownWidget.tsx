import React, { useState } from 'react';
import { Target, Calendar, Plus, Trophy, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';
import { ExamItem } from './types';

export const ExamCountdownWidget: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [exams, setExams] = useState<ExamItem[]>([
    {
      id: 'exam-1',
      subject: 'Final Exams (Physics & Math)',
      date: '2026-09-04',
      targetScore: 'Grade A+ (95%)',
      readinessScore: 78,
    },
    {
      id: 'exam-2',
      subject: 'Web Engineering Term Project',
      date: '2026-09-15',
      targetScore: 'Grade A (90%)',
      readinessScore: 88,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDate, setNewDate] = useState('');

  const calculateDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDate) return;
    const newExam: ExamItem = {
      id: `exam-${Date.now()}`,
      subject: newSubject,
      date: newDate,
      targetScore: 'Grade A',
      readinessScore: 65,
    };
    setExams([...exams, newExam]);
    setNewSubject('');
    setNewDate('');
    setIsAdding(false);
  };

  return (
    <WidgetContainer
      id="widget-exam-countdown"
      title="Exam Countdown & Readiness"
      subtitle="Milestone deadlines & target mastery"
      icon={Target}
      badge="14 Days Left"
      badgeColor="bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30"
      headerAction={
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 theme-focus:hover:text-amber-200 transition-colors"
          title="Add target milestone"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-4">
        {/* Add Form if toggled - Glassmorphic / Neuromorphic Input Deck */}
        {isAdding && (
          <form onSubmit={handleAddExam} className="p-3.5 rounded-2xl glass-panel border border-amber-500/30 space-y-2.5 animate-fade-in">
            <input
              type="text"
              placeholder="Exam Name (e.g. Organic Chemistry Final)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full p-2.5 text-xs bg-white/60 dark:bg-slate-900/60 theme-focus:bg-[#14120f]/60 neuro-inset rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-white/60 dark:bg-slate-900/60 theme-focus:bg-[#14120f]/60 neuro-inset rounded-xl outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 clay-btn bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Exams List - Claymorphic 3D Cards */}
        <div className="space-y-3">
          {exams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.date);
            return (
              <div
                key={exam.id}
                className={`p-4 rounded-3xl clay-surface transition-all ${
                  theme === 'focus'
                    ? 'bg-gradient-to-br from-[#26201a] to-[#191512] text-amber-100 border border-amber-500/20'
                    : 'bg-gradient-to-br from-white via-amber-50/20 to-slate-50 dark:from-slate-800/80 dark:to-slate-900/90 border border-white/60 dark:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100">
                      {exam.subject}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 theme-focus:text-amber-300/60 font-semibold mt-0.5">
                      Target: {exam.targetScore}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-2xl clay-pill bg-amber-500/15 border border-amber-500/30 text-right shrink-0">
                    <span className="text-base font-black font-display text-amber-500 block leading-none">
                      {daysLeft}d
                    </span>
                    <span className="text-[8px] uppercase font-black tracking-wider text-amber-600 dark:text-amber-400">left</span>
                  </div>
                </div>

                {/* Readiness Progress Bar in Neuromorphic Sunken Trench */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold px-0.5">
                    <span className="text-slate-400 theme-focus:text-amber-300/60">Syllabus Readiness</span>
                    <span className="text-emerald-500 font-black">{exam.readinessScore}%</span>
                  </div>
                  <div className="w-full h-2 neuro-inset rounded-full p-0.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                      style={{ width: `${exam.readinessScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button - 3D Clay Button */}
        <button
          onClick={() => navigate('/student/mock-tests')}
          className="w-full py-3 rounded-2xl clay-btn bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(245,158,11,0.3)]"
        >
          <span>Take AI Diagnostic Mock Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </WidgetContainer>
  );
};
