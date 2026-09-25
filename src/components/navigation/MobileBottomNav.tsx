import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BrainCircuit, 
  Plus, 
  BookOpen, 
  BarChart3, 
  X, 
  Camera, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Calendar,
  Video
} from 'lucide-react';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/student' && location.pathname === '/student') return true;
    if (path !== '/student' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleAction = (route: string) => {
    setIsQuickActionOpen(false);
    navigate(route);
  };

  return (
    <>
      {/* Central Plus Modal Action Sheet */}
      {isQuickActionOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsQuickActionOpen(false)}
        >
          <div 
            className="w-full max-w-sm clay-widget rounded-[16px] p-5 border border-slate-200 dark:border-purple-900/50 shadow-2xl space-y-4 animate-slide-up bg-white dark:bg-[#130E26]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-[12px] bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Study Actions</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose a learning workflow</p>
                </div>
              </div>
              <button 
                onClick={() => setIsQuickActionOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close action sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => handleAction('/student?focus=ask')}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 hover:bg-purple-100/80 dark:hover:bg-purple-900/40 text-left transition group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-[12px] bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Ask Lumora
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Ask any concept or doubt</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('/student/homework-helper')}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-left transition group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-[12px] bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Scan Question
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Capture with camera or upload image</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('/student/pdf-learning')}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-left transition group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-[12px] bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Upload PDF
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Extract notes, summaries and mind maps</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('/student/quiz')}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-left transition group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-[12px] bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Create Quiz
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Generate targeted practice questions</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('/student/notes')}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-left transition group active:scale-[0.98]"
              >
                <div className="w-9 h-9 rounded-[12px] bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Create Notes
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Structured markdown study notes</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar (5 Primary Destinations) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#0F0A1E]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-purple-900/40 px-2 sm:px-4 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-center justify-around pb-[max(env(safe-area-inset-bottom),0.5rem)]"
        aria-label="Mobile Navigation"
      >
        {/* 1. Home */}
        <button
          onClick={() => navigate('/student')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-[12px] transition ${
            isActive('/student') && location.pathname === '/student'
              ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Learn */}
        <button
          onClick={() => navigate('/student/tutor')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-[12px] transition ${
            isActive('/student/tutor') || isActive('/student/doubt-solver') || isActive('/student/homework-helper') || isActive('/student/explain-simply') || isActive('/student/pdf-learning')
              ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Learn"
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Learn</span>
        </button>

        {/* 3. Central ＋ Action Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="relative -top-3 w-12 h-12 rounded-[16px] clay-btn bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/35 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Create or Ask Quick Action"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. Study */}
        <button
          onClick={() => navigate('/student/study-planner')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-[12px] transition ${
            isActive('/student/study-planner') || isActive('/student/revision') || isActive('/student/notes') || isActive('/student/mind-map')
              ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Study"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Study</span>
        </button>

        {/* 5. Progress */}
        <button
          onClick={() => navigate('/student/analytics')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-[12px] transition ${
            isActive('/student/analytics') || isActive('/student/profile') || isActive('/student/goals')
              ? 'text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-950/30'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Progress"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Progress</span>
        </button>
      </nav>
    </>
  );
}
