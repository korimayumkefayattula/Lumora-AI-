import React, { useState } from 'react';
import { BookOpen, Search, CheckCircle2, ChevronRight, Sparkles, Layers, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chapter {
  id: string;
  name: string;
  subject: string;
  progressPercent: number;
  totalTopics: number;
  completedTopics: number;
}

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [chapters] = useState<Chapter[]>([
    { id: '1', name: 'Electric Charges & Fields', subject: 'Physics', progressPercent: 100, totalTopics: 8, completedTopics: 8 },
    { id: '2', name: 'Electrostatic Potential & Capacitance', subject: 'Physics', progressPercent: 75, totalTopics: 10, completedTopics: 7 },
    { id: '3', name: 'Current Electricity', subject: 'Physics', progressPercent: 50, totalTopics: 12, completedTopics: 6 },
    { id: '4', name: 'Electromagnetic Induction', subject: 'Physics', progressPercent: 30, totalTopics: 9, completedTopics: 3 },
    { id: '5', name: 'Solutions & Colligative Properties', subject: 'Chemistry', progressPercent: 90, totalTopics: 10, completedTopics: 9 },
    { id: '6', name: 'Electrochemistry', subject: 'Chemistry', progressPercent: 60, totalTopics: 10, completedTopics: 6 },
    { id: '7', name: 'Matrices & Determinants', subject: 'Mathematics', progressPercent: 100, totalTopics: 6, completedTopics: 6 },
    { id: '8', name: 'Continuity & Differentiability', subject: 'Mathematics', progressPercent: 40, totalTopics: 15, completedTopics: 6 },
    { id: '9', name: 'Sexual Reproduction in Flowering Plants', subject: 'Biology', progressPercent: 80, totalTopics: 10, completedTopics: 8 }
  ]);

  const filteredChapters = chapters.filter(c => {
    const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Lumora Syllabus Mastery</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Subjects & Chapter Directory
          </h1>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSubject === sub 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChapters.map(ch => (
          <div key={ch.id} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold">
                {ch.subject}
              </span>
              <span className="text-xs font-bold text-slate-500">{ch.completedTopics}/{ch.totalTopics} Topics</span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{ch.name}</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Progress</span>
                <span>{ch.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${ch.progressPercent}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
              <button 
                onClick={() => navigate('/student/doubt-solver')} 
                className="flex-1 p-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Ask AI</span>
              </button>
              <button 
                onClick={() => navigate('/student/flashcards')} 
                className="flex-1 p-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
