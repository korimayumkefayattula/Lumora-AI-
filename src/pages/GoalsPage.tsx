import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Circle, Calendar, Trophy, Trash2 } from 'lucide-react';
import { StudyGoal } from '../types';

export default function GoalsPage() {
  const [goals, setGoals] = useState<StudyGoal[]>([
    {
      id: '1',
      title: 'Score 90%+ in Physics Board Mock Exam',
      targetDate: '2026-03-01',
      category: 'score',
      targetValue: 90,
      currentValue: 85,
      unit: '%',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Complete 100 Flashcards in Chemistry',
      targetDate: '2026-02-15',
      category: 'chapter',
      targetValue: 100,
      currentValue: 100,
      unit: 'cards',
      isCompleted: true
    },
    {
      id: '3',
      title: 'Solve All 2020-2024 Math PYQs',
      targetDate: '2026-02-28',
      category: 'exam_prep',
      targetValue: 50,
      currentValue: 30,
      unit: 'papers',
      isCompleted: false
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'score' | 'study_hours' | 'chapter' | 'exam_prep'>('score');
  const [newDate, setNewDate] = useState('2026-03-15');
  const [newTargetValue, setNewTargetValue] = useState(100);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: StudyGoal = {
      id: Date.now().toString(),
      title: newTitle,
      targetDate: newDate,
      category: newCategory,
      targetValue: newTargetValue,
      currentValue: 0,
      unit: newCategory === 'score' ? '%' : newCategory === 'study_hours' ? 'hrs' : 'items',
      isCompleted: false
    };
    setGoals([...goals, item]);
    setNewTitle('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted, currentValue: !g.isCompleted ? g.targetValue : Math.floor(g.targetValue / 2) } : g));
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Lumora Goal Setting Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Goals & Targets
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Goal Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            <span>Set New Target Goal</span>
          </h2>

          <form onSubmit={handleAddGoal} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Goal Description</label>
              <input 
                type="text" 
                placeholder="e.g. Score 95% in Physics Mock"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
              >
                <option value="score">Exam Score</option>
                <option value="study_hours">Study Hours</option>
                <option value="chapter">Chapter Mastery</option>
                <option value="exam_prep">Exam Prep</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Target Value</label>
              <input 
                type="number" 
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Target Date</label>
              <input 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md"
            >
              Add Academic Goal
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Active Goals ({goals.length})</h2>

          <div className="space-y-3">
            {goals.map(g => {
              const progressPercent = Math.min(100, Math.round((g.currentValue / (g.targetValue || 1)) * 100));
              return (
                <div 
                  key={g.id} 
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    g.isCompleted 
                      ? 'bg-slate-50 dark:bg-slate-700/20 border-slate-200 dark:border-slate-700 opacity-80' 
                      : 'bg-white dark:bg-slate-700/40 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleGoal(g.id)}>
                        {g.isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-400" />}
                      </button>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase">{g.category}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {g.targetDate}</span>
                    </div>
                    <button onClick={() => handleDelete(g.id)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className={`font-bold text-xs ${g.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{g.title}</h3>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Target Progress ({g.currentValue} / {g.targetValue} {g.unit})</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
