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
        {/* Add Form if toggled */}
        {isAdding && (
          <form onSubmit={handleAddExam} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 theme-focus:bg-[#201c18] border border-slate-200 dark:border-slate-700 space-y-2">
            <input
              type="text"
              placeholder="Exam Name (e.g. Organic Chemistry Final)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full p-2 text-xs bg-white dark:bg-slate-900 theme-focus:bg-[#14120f] border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-slate-900 theme-focus:bg-[#14120f] border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 theme-focus:bg-amber-500 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Exams List */}
        <div className="space-y-3">
          {exams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.date);
            return (
              <div
                key={exam.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  theme === 'focus'
                    ? 'bg-[#201c18] border-[#382e25]'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white theme-focus:text-amber-100">
                      {exam.subject}
                    </h4>
                    <p className="text-[10px] text-slate-400 theme-focus:text-amber-300/60 font-medium">
                      Target: {exam.targetScore}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black font-display text-amber-500 block leading-none">
                      {daysLeft}d
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">remaining</span>
                  </div>
                </div>

                {/* Readiness Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400 theme-focus:text-amber-300/60">Syllabus Readiness</span>
                    <span className="text-emerald-500 font-extrabold">{exam.readinessScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 theme-focus:bg-[#332b22] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${exam.readinessScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/student/mock-tests')}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>Take AI Diagnostic Mock Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </WidgetContainer>
  );
};
