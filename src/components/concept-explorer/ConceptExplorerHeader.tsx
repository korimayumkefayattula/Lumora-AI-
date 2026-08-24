import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Shuffle, 
  History, 
  Bookmark, 
  BookOpen, 
  Compass, 
  Filter,
  GraduationCap
} from 'lucide-react';

interface ConceptExplorerHeaderProps {
  onExplore: (topic: string, subject: string, gradeLevel: string) => void;
  onOpenHistory: () => void;
  onOpenSaved: () => void;
  onOpenCompare: () => void;
  isLoading: boolean;
  activeTopic?: string;
}

const POPULAR_SUBJECTS = [
  'All Subjects',
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'History & Civics',
  'Economics'
];

const GRADE_LEVELS = [
  'Middle School (Class 6-8)',
  'Class 9 & 10 (Board Prep)',
  'Class 11 & 12 (JEE/NEET/High School)',
  'Undergraduate / College',
  'General Curiosity'
];

const SURPRISE_TOPICS = [
  { topic: 'Quantum Entanglement', subject: 'Physics' },
  { topic: 'Photosynthesis & Carbon Fixation', subject: 'Biology' },
  { topic: 'CRISPR Gene Editing', subject: 'Biology' },
  { topic: 'Neural Networks & Deep Learning', subject: 'Computer Science' },
  { topic: 'Black Holes & Event Horizons', subject: 'Physics' },
  { topic: 'Electrochemical Cells & Batteries', subject: 'Chemistry' },
  { topic: 'The French Revolution', subject: 'History & Civics' },
  { topic: 'Game Theory & Nash Equilibrium', subject: 'Economics' },
  { topic: 'Fourier Transform', subject: 'Mathematics' }
];

export const ConceptExplorerHeader: React.FC<ConceptExplorerHeaderProps> = ({
  onExplore,
  onOpenHistory,
  onOpenSaved,
  onOpenCompare,
  isLoading,
  activeTopic
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('Class 9 & 10 (Board Prep)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onExplore(
      topicInput, 
      selectedSubject === 'All Subjects' ? 'General Science' : selectedSubject, 
      selectedGrade
    );
  };

  const handleSurpriseMe = () => {
    const random = SURPRISE_TOPICS[Math.floor(Math.random() * SURPRISE_TOPICS.length)];
    setTopicInput(random.topic);
    setSelectedSubject(random.subject);
    onExplore(random.topic, random.subject, selectedGrade);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden mb-6">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {/* Header Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Knowledge Map</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              AI Concept Explorer
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/80 mt-1">
              Transform any complex topic into an interactive visual learning map. Explore connections, ask why, and master deeply.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/80 transition-all hover:scale-105"
              title="Compare two concepts side by side"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Compare Concepts</span>
            </button>
            <button
              onClick={onOpenSaved}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition-all"
              title="Saved Concept Maps"
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onOpenHistory}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700/80 transition-all"
              title="Exploration History"
            >
              <History className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Main Search Bar & Surprise Button */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-400">
            
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-indigo-300 shrink-0" />
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter any topic (e.g. Photosynthesis, Newton's Laws, Neural Networks, Inflation)..."
                className="bg-transparent text-sm md:text-base text-white placeholder-indigo-200/60 focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSurpriseMe}
                disabled={isLoading}
                className="px-3 py-2.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs font-bold rounded-xl border border-indigo-700/60 flex items-center gap-1.5 transition-all"
              >
                <Shuffle className="w-3.5 h-3.5 text-indigo-300 animate-spin-slow" />
                <span className="hidden sm:inline">Surprise Me</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !topicInput.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mapping...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Explore Map</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filters Row: Subject & Grade Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            {/* Subject Pill Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar max-w-full">
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3 h-3" />
                Subject:
              </span>
              {POPULAR_SUBJECTS.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedSubject === subj
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-indigo-200/80 border border-white/5'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Grade Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-800/90 text-indigo-200 text-xs font-medium rounded-lg px-2.5 py-1 border border-slate-700/80 focus:outline-none cursor-pointer"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-slate-100">
                    {g}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
