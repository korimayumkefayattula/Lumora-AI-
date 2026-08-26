import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  Search,
  Flame,
  Shield,
  Eye
} from 'lucide-react';
import LumoraLogo from '../components/LumoraLogo';
import { VoiceTutorModal } from '../components/voice/VoiceTutorModal';
import { VoiceTutorButton } from '../components/voice/VoiceTutorButton';
import { FloatingSelectionToolbar } from '../components/explain/FloatingSelectionToolbar';
import { ExplainSimplyModal } from '../components/explain/ExplainSimplyModal';
import { FloatingSidebar } from '../components/navigation/FloatingSidebar';
import { ThemeSwitcher } from '../components/theme/ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

export default function StudentLayout() {
  const navigate = useNavigate();
  const { theme, isFocusMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVoiceTutorOpen, setIsVoiceTutorOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [explainSelectedText, setExplainSelectedText] = useState('');

  const handleExplainSimplyFromSelection = (text: string) => {
    setExplainSelectedText(text);
    setIsExplainModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${
      theme === 'focus'
        ? 'theme-focus bg-[#0e0d0b] text-[#fffbeb]'
        : theme === 'dark'
        ? 'dark lumora-crimson-bg text-slate-100'
        : 'light bg-slate-100/70 text-slate-900'
    } flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Top Floating Glass Navbar */}
      <header className={`sticky top-0 z-40 px-3 md:px-5 h-13 flex items-center justify-between border-b backdrop-blur-xl transition-colors ${
        theme === 'focus'
          ? 'bg-[#161311]/90 border-[#382e25] text-amber-100'
          : theme === 'dark'
          ? 'bg-[#0a0a0d]/90 border-zinc-800/80 text-slate-100'
          : 'bg-white/80 border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 theme-focus:text-amber-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          
          <div className="lg:hidden">
            <LumoraLogo size="sm" variant={theme === 'light' ? 'light' : 'dark'} />
          </div>

          {/* Eye-Care / Focus Mode Indicator Badge in Navbar */}
          {isFocusMode && (
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-200 text-[10px] font-bold shadow-xs">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>Eye Focus</span>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl border w-56 lg:w-80 transition-all ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#443930] text-amber-100 focus-within:border-amber-500'
            : 'bg-slate-100/80 dark:bg-[#141418] border-slate-200 dark:border-zinc-800/90 focus-within:border-rose-500/80'
        }`}>
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search concepts, questions, flashcards..." 
            className="bg-transparent text-[11px] text-slate-800 dark:text-slate-100 theme-focus:text-amber-100 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Dynamic Theme Switcher Component */}
          <ThemeSwitcher variant="compact" />

          {/* Voice AI Tutor Quick Launcher */}
          <VoiceTutorButton onClick={() => setIsVoiceTutorOpen(true)} variant="compact" />

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-1.5 rounded-lg border transition-colors relative flex items-center justify-center ${
                theme === 'focus'
                  ? 'bg-[#201c18] border-[#443930] text-amber-200 hover:bg-[#2c2620]'
                  : 'bg-slate-100/80 dark:bg-[#141418] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl p-3 z-50 space-y-2.5 animate-fade-in border backdrop-blur-xl ${
                theme === 'focus'
                  ? 'bg-[#181512]/95 border-[#382e25] text-amber-100'
                  : 'bg-[#141418]/95 border-zinc-800 text-slate-100'
              }`}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <span className="font-bold text-[11px] text-white">Notifications</span>
                  <span className="text-[10px] text-rose-400 font-bold cursor-pointer hover:underline">Mark read</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 bg-rose-950/30 rounded-xl space-y-0.5 border border-rose-800/40">
                    <p className="font-bold text-rose-200 text-[10px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>5-Day Study Streak Active!</span>
                    </p>
                    <p className="text-[9px] text-zinc-400">You've completed 3 concept maps this week.</p>
                  </div>
                  <div className="p-2 bg-zinc-900/60 rounded-xl space-y-0.5 border border-zinc-800">
                    <p className="font-bold text-zinc-200 text-[10px]">Physics Mock Exam</p>
                    <p className="text-[9px] text-zinc-400">Scheduled for tomorrow at 10:00 AM.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button 
            onClick={() => navigate('/student/profile')}
            className={`flex items-center gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full border transition-all ${
              theme === 'focus'
                ? 'bg-[#201c18] border-[#443930] text-amber-100 hover:bg-[#2c2620]'
                : 'bg-slate-100/80 dark:bg-[#141418] border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
              alt="Alex Morgan" 
              className="w-5.5 h-5.5 rounded-full object-cover border border-rose-500/80 theme-focus:border-amber-400"
            />
            <span className="text-[11px] font-bold hidden sm:inline">Alex</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area with Floating Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Floating Sidebar Menu */}
        <div className="hidden lg:flex">
          <FloatingSidebar />
        </div>

        {/* Mobile Drawer Floating Sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md lg:hidden p-4 flex" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-full max-w-xs h-full" onClick={(e) => e.stopPropagation()}>
              <FloatingSidebar 
                isMobile={true} 
                onCloseMobile={() => setIsMobileMenuOpen(false)} 
              />
            </div>
          </div>
        )}

        {/* Main Content View with Rounded Padding */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 lg:p-5">
          <div className={`w-full max-w-7xl mx-auto rounded-3xl min-h-full transition-colors ${
            theme === 'focus'
              ? 'bg-[#14120f] border border-[#2f2720] text-amber-100'
              : theme === 'dark'
              ? 'bg-slate-900/60 border border-slate-800/80 text-slate-100'
              : 'bg-white border border-slate-200/80 text-slate-900 shadow-xs'
          } p-4 sm:p-6 lg:p-8`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Voice AI Tutor Float */}
      <VoiceTutorButton 
        onClick={() => setIsVoiceTutorOpen(true)} 
        variant="floating" 
      />

      <VoiceTutorModal
        isOpen={isVoiceTutorOpen}
        onClose={() => setIsVoiceTutorOpen(false)}
      />

      {/* Global Text Selection Explain Simply Toolbar */}
      <FloatingSelectionToolbar onExplainSimply={handleExplainSimplyFromSelection} />

      {/* Global Explain Simply Modal */}
      <ExplainSimplyModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        selectedText={explainSelectedText}
      />

    </div>
  );
}

