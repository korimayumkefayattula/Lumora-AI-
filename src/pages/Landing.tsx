import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  Target, 
  Layers, 
  BarChart3, 
  BookOpen, 
  Camera, 
  Mic, 
  FileText, 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  X, 
  Clock, 
  Video, 
  Check, 
  Calendar, 
  BookMarked,
  ShieldCheck,
  Send,
  Eye,
  School,
  Play
} from 'lucide-react';
import LumoraLogo from '../components/LumoraLogo';
import AuthModal from '../components/AuthModal';

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Interactive state for 01 - Understand showcase demo
  const [explainLevel, setExplainLevel] = useState<'simple' | 'school' | 'detailed' | 'exam'>('simple');
  
  // Interactive state for 03 - Practice showcase demo
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [practiceAnswerChecked, setPracticeAnswerChecked] = useState(false);

  // Interactive state for 04 - Organize showcase demo
  const [activeOrganizeStep, setActiveOrganizeStep] = useState<'pdf' | 'summary' | 'notes' | 'flashcards' | 'mindmap'>('notes');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const heroChips = [
    { name: 'AI Tutor', icon: BrainCircuit, route: '/student/tutor' },
    { name: 'Doubt Solver', icon: HelpCircle, route: '/student/doubt-solver' },
    { name: 'Homework Helper', icon: Camera, route: '/student/homework-helper' },
    { name: 'Study Planner', icon: Calendar, route: '/student/study-planner' },
    { name: 'Quiz Generator', icon: CheckCircle2, route: '/student/quiz' },
    { name: 'Smart Revision', icon: Zap, route: '/student/revision' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F0A1E] text-[#1F2937] dark:text-slate-100 font-sans selection:bg-purple-500 selection:text-white transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — STICKY NAVIGATION                                            */}
      {/* ========================================================================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-[#0F0A1E]/85 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-purple-900/30 py-2.5' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <LumoraLogo size="md" />
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How it works</a>
            <a href="#for-schools" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <span>For Schools</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">New</span>
            </a>
            <Link to="/pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-1.5 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all active:scale-98"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => openAuth('signup')}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold shadow-xs"
            >
              Start
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <span className="text-xl leading-none">☰</span>}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#130E26] border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3 animate-fade-in shadow-xl">
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 py-1.5"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 py-1.5"
            >
              How it works
            </a>
            <a 
              href="#for-schools" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 py-1.5"
            >
              For Schools
            </a>
            <Link 
              to="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 py-1.5"
            >
              Pricing
            </Link>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); openAuth('login'); }}
                className="w-full py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Log in
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); openAuth('signup'); }}
                className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* SECTION 02 & 03 — HERO SECTION & WORKSPACE PREVIEW & FEATURE CHIPS        */}
      {/* ========================================================================= */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Lumora AI Study Workspace</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Learn smarter. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500">
              Understand better.
            </span>
          </h1>

          {/* Supporting line */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Your AI study mentor for Class 10 & 12 — helping you understand concepts, solve doubts, practice questions, and stay on track.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuth('signup')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 group"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/student')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all shadow-xs"
            >
              Explore Lumora
            </button>
          </div>

          {/* Realistic Workspace Preview Card */}
          <div className="pt-8 sm:pt-12 max-w-2xl mx-auto text-left">
            <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200/90 dark:border-purple-900/40 p-5 sm:p-7 shadow-xl shadow-purple-900/5 relative">
              
              {/* Window Bar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">app.lumora.ai/student</span>
                </div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Class 12 • Science</span>
              </div>

              {/* Greeting */}
              <div className="space-y-0.5 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Good evening 👋</p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">What are you learning?</h3>
              </div>

              {/* Mock Ask Lumora Input Box */}
              <div 
                onClick={() => navigate('/student?focus=ask')}
                className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0716] border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600/60 cursor-pointer transition-all flex items-center justify-between mb-5 group"
              >
                <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    Ask Lumora: e.g., Explain Faraday's Law or solve quadratic...
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Mic className="w-4 h-4" />
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* Today's Progress Bar */}
              <div className="space-y-1.5 bg-slate-50/70 dark:bg-purple-950/20 rounded-2xl p-3 border border-slate-100 dark:border-purple-900/30">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-200">Today's study progress</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">72% complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-[72%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Target: 2 hrs • Completed: 1h 26m</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ On track</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 03 — Hero Feature Chips */}
          <div className="pt-8">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-bold">
              Core Study Tools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {heroChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.name}
                    onClick={() => navigate(chip.route)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-2xs hover:shadow-xs active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{chip.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — PROBLEM → SOLUTION SECTION                                    */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-slate-100/70 dark:bg-[#0B0716]/60 border-y border-slate-200 dark:border-purple-900/30">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Studying shouldn't feel scattered.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Students waste hours jumping between PDFs, video links, chat tools, and scattered notebooks.
            </p>
          </div>

          {/* Three Problems */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
              <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center">
                01
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Too many resources</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hundreds of textbook pages and videos without a clear roadmap of what actually matters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                02
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hard to understand concepts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dense academic jargon creates anxiety when you hit an obstacle and have no one to explain it simply.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
              <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center">
                03
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No consistent study plan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Revision is left to the last minute without structured daily active recall or mistake tracking.
              </p>
            </div>
          </div>

          {/* Solution Banner */}
          <div className="space-y-4 pt-4">
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
              Lumora brings your entire study workflow together.
            </p>

            {/* Visual Workflow: ASK -> UNDERSTAND -> PRACTICE -> REVISE -> IMPROVE */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-black font-mono">
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white shadow-xs">ASK</span>
              <span className="text-slate-400">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">UNDERSTAND</span>
              <span className="text-slate-400">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white shadow-xs">PRACTICE</span>
              <span className="text-slate-400">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white shadow-xs">REVISE</span>
              <span className="text-slate-400">→</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">IMPROVE</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — CORE FEATURE SHOWCASE (5 LARGE SECTIONS)                     */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Five Core Engines
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Built for Real Learning, Not AI Gimmicks
          </h2>
        </div>

        {/* 01 — UNDERSTAND: AI Tutor + Explain Simply */}
        <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200 dark:border-purple-900/40 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-xs font-black">
              01 — Understand
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Tutor + Explain Simply
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Never get stuck on dense textbook definitions. Switch explanations instantly between beginner analogies and rigorous board exam answers.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/student/explain-simply')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Try Explain Simply Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B0716] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
              <strong className="text-purple-700 dark:text-purple-300 block mb-0.5 font-bold">You:</strong>
              <p className="text-slate-800 dark:text-slate-200 font-medium">Explain photosynthesis like I'm a beginner.</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lumora:</span>
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">Response calibrated</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {explainLevel === 'simple' && "Think of a plant as a tiny solar-powered food factory. Leaves use sunlight to cook water and air into sweet sugar energy, releasing fresh oxygen into the air!"}
                {explainLevel === 'school' && "Photosynthesis is the biological process where chlorophyll in green plants absorbs light energy to convert carbon dioxide (CO2) and water (H2O) into glucose (C6H12O6) and oxygen (O2)."}
                {explainLevel === 'detailed' && "Occurs in two distinct phases inside chloroplasts: the light-dependent reactions on thylakoid membranes generating ATP and NADPH, followed by the Calvin cycle in the stroma fixing CO2."}
                {explainLevel === 'exam' && "Chemical Equation: 6CO2 + 6H2O + light → C6H12O6 + 6O2. Key scoring points: Photolysis of water in PSII, ATP synthase phosphorylation, and Rubisco carbon fixation."}
              </p>

              {/* 4 Interactive Level Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setExplainLevel('simple')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    explainLevel === 'simple'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Very Simple
                </button>
                <button
                  onClick={() => setExplainLevel('school')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    explainLevel === 'school'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  School Level
                </button>
                <button
                  onClick={() => setExplainLevel('detailed')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    explainLevel === 'detailed'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setExplainLevel('exam')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    explainLevel === 'exam'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Exam Level
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 02 — SOLVE: Doubt Solver + Homework Helper */}
        <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200 dark:border-purple-900/40 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-black">
              02 — Solve
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Doubt Solver + Homework Helper
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Capture questions by photo, file, keyboard, or voice. Lumora breaks them down into step-by-step logic, never just spitting out raw answers without understanding.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/student/homework-helper')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Homework Helper</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B0716] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            {/* Input Modality Pills */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 flex items-center gap-1">📷 Scan</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 flex items-center gap-1">📄 Upload</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 flex items-center gap-1">⌨ Type</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 flex items-center gap-1">🎙 Speak</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Auto-detected</span>
            </div>

            {/* Step-by-step breakdown */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">
                Step-by-Step Explanation
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Find the magnetic field at distance r = 0.05m from a straight wire carrying I = 10A.
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <p>1. Formula: B = (μ₀ · I) / (2π · r)</p>
                <p>2. Substitute: B = (4π × 10⁻⁷ × 10) / (2π × 0.05)</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">3. Result: B = 4.0 × 10⁻⁵ Tesla</p>
              </div>
            </div>

            {/* Follow-up practice question */}
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 flex items-center justify-between">
              <span>🎯 Practice Question: What if current is doubled to 20A?</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0">Try it →</span>
            </div>
          </div>
        </div>

        {/* 03 — PRACTICE: Quiz + PYQs + Mock Tests */}
        <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200 dark:border-purple-900/40 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-black">
              03 — Practice
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Quiz + PYQs + Mock Tests
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Test your understanding with real interactive questions and past-year examination formats with instant feedback and misconception detection.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/student/quiz')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Launch Quiz Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B0716] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Question 4 of 10 • CBSE Class 12 Chemistry</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">PYQ 2024</span>
            </div>

            <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Which of the following compounds undergoes SN1 reaction at the fastest rate?
            </p>

            {/* Actual Question Options Interface */}
            <div className="space-y-1.5">
              {[
                { id: 0, text: 'A) Primary alkyl halide (1°)', correct: false },
                { id: 1, text: 'B) Tertiary alkyl halide (3°)', correct: true },
                { id: 2, text: 'C) Methyl halide (CH3-X)', correct: false },
                { id: 3, text: 'D) Vinyl halide', correct: false }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedPracticeOption(opt.id);
                    setPracticeAnswerChecked(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left font-medium transition flex items-center justify-between ${
                    selectedPracticeOption === opt.id
                      ? opt.correct
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{opt.text}</span>
                  {selectedPracticeOption === opt.id && (
                    opt.correct ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />
                  )}
                </button>
              ))}
            </div>

            {practiceAnswerChecked && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200 animate-fade-in">
                <strong>Correct!</strong> Tertiary carbocation is stabilized by hyperconjugation and inductive effect (+I), favoring SN1.
              </div>
            )}
          </div>
        </div>

        {/* 04 — ORGANIZE: Notes + Flashcards + Mind Maps */}
        <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200 dark:border-purple-900/40 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-black">
              04 — Organize
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Notes + Flashcards + Mind Maps
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Watch one study chapter transform automatically: upload a PDF or note, and Lumora synthesizes it into summaries, concise bullet notes, spaced-repetition flashcards, and a visual mind map.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/student/notes')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Explore Notes & Mind Maps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B0716] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            {/* Transformation Steps */}
            <div className="flex items-center justify-between text-[11px] font-bold font-mono">
              <button 
                onClick={() => setActiveOrganizeStep('pdf')} 
                className={`px-2 py-1 rounded ${activeOrganizeStep === 'pdf' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
              >
                PDF
              </button>
              <span className="text-slate-400">→</span>
              <button 
                onClick={() => setActiveOrganizeStep('summary')} 
                className={`px-2 py-1 rounded ${activeOrganizeStep === 'summary' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
              >
                Summary
              </button>
              <span className="text-slate-400">→</span>
              <button 
                onClick={() => setActiveOrganizeStep('notes')} 
                className={`px-2 py-1 rounded ${activeOrganizeStep === 'notes' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
              >
                Notes
              </button>
              <span className="text-slate-400">→</span>
              <button 
                onClick={() => setActiveOrganizeStep('flashcards')} 
                className={`px-2 py-1 rounded ${activeOrganizeStep === 'flashcards' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
              >
                Cards
              </button>
              <span className="text-slate-400">→</span>
              <button 
                onClick={() => setActiveOrganizeStep('mindmap')} 
                className={`px-2 py-1 rounded ${activeOrganizeStep === 'mindmap' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
              >
                Mind Map
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[110px] space-y-1.5">
              {activeOrganizeStep === 'notes' && (
                <>
                  <strong className="text-rose-600 dark:text-rose-400 block font-bold">Electromagnetic Waves — Key Formula Notes:</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                    <li>Speed of light relation: c = 1 / √(μ₀ · ε₀) = 3 × 10⁸ m/s</li>
                    <li>Wave impedance in free space: Z₀ = E / B = 377 Ω</li>
                    <li>Poynting vector: S = (1/μ₀) (E × B) [Energy flux density]</li>
                  </ul>
                </>
              )}
              {activeOrganizeStep === 'summary' && (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>3-Sentence Executive Summary:</strong> Maxwell modified Ampere's circuital law by introducing displacement current, establishing that accelerating charges radiate EM waves. These waves are transverse and require no material medium for propagation.
                </p>
              )}
              {activeOrganizeStep === 'flashcards' && (
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-center">
                  <span className="text-[10px] uppercase font-mono text-purple-600 font-bold block mb-1">Flashcard #1 • Tap to flip</span>
                  <p className="font-bold text-slate-900 dark:text-white">What did Maxwell's displacement current solve?</p>
                </div>
              )}
              {activeOrganizeStep === 'mindmap' && (
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="font-bold text-purple-600">● Electromagnetic Waves</p>
                  <p className="pl-4">├── Transverse Nature (E ⟂ B ⟂ v)</p>
                  <p className="pl-4">├── Spectrum: Radio → Gamma</p>
                  <p className="pl-4">└── Energy Density: u = ½ ε₀E² + ½ B²/μ₀</p>
                </div>
              )}
              {activeOrganizeStep === 'pdf' && (
                <p className="text-slate-500 italic">
                  Uploaded Chapter 8: NCERT Class 12 Physics (28 pages analyzed in 1.4 seconds).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 05 — IMPROVE: Planner + Revision + Analytics */}
        <div className="bg-white dark:bg-[#130E26] rounded-3xl border border-slate-200 dark:border-purple-900/40 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-black">
              05 — Improve
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Planner + Revision + Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Maintain an actionable daily study queue, target identified weak areas, and monitor your mastery scores without guesswork.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/student/study-planner')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View Study Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B0716] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 dark:text-white font-bold">Today's Study Plan</strong>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">2/3 done</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span className="line-through text-slate-400">Physics — Magnetism Problem Set</span>
                  </span>
                  <span className="font-mono text-slate-400">30 min</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span className="line-through text-slate-400">Chemistry — Equilibrium Review</span>
                  </span>
                  <span className="font-mono text-slate-400">40 min</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
                    <span className="w-3.5 h-3.5 rounded-full border border-purple-500 inline-block" />
                    <span>Mathematics — Integration by Parts</span>
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">45 min</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <div>
                <strong>Weak area: </strong>Chemical Reactions (Balancing equations)
              </div>
              <button 
                onClick={() => navigate('/student/revision')}
                className="px-2 py-1 rounded bg-amber-600 text-white font-bold text-[10px]"
              >
                15 min revision →
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 06 — HOW LUMORA WORKS (TIMELINE)                                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-slate-100/70 dark:bg-[#0B0716]/60 border-y border-slate-200 dark:border-purple-900/30">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              Simple 4-Step Cycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How Lumora Works
            </h2>
          </div>

          {/* Timeline Grid (Desktop Horizontal, Mobile Vertical) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Ask */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center font-mono">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ask</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ask anything. Type, speak, or take a picture of any difficult problem.
              </p>
            </div>

            {/* Step 2: Understand */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center font-mono">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Understand</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Get explanations at your level. Toggle analogies or step-by-step proofs.
              </p>
            </div>

            {/* Step 3: Practice */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center font-mono">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Practice</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Turn knowledge into questions, quizzes, and mock tests to build memory.
              </p>
            </div>

            {/* Step 4: Improve */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center font-mono">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Improve</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Track progress, conquer identified weak areas, and stay exam-ready.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 — SOCIAL PROOF / PRODUCT CAPABILITIES AREA                     */}
      {/* ========================================================================= */}
      <section id="for-schools" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Academic Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Designed for Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Grounded in actual curriculum standards for secondary and senior secondary education.
          </p>
        </div>

        {/* 6 Capabilities Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { label: 'Class 10', desc: 'Board Foundation' },
            { label: 'Class 12', desc: 'Senior Secondary' },
            { label: 'Science', desc: 'Physics, Chemistry, Bio' },
            { label: 'Mathematics', desc: 'Calculus, Algebra, Stats' },
            { label: 'Languages', desc: 'English & Literature' },
            { label: 'Exam Preparation', desc: 'PYQs & Adaptive Mocks' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-2xs"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Agnes Video & Extra Features Link Banner */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Includes Agnes Video AI & 20 Extra Academic Modules</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Cinematic chalkboard videos, exam strategy coach, mistake analyzer, and viva practice.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/agnes-videos')}
            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shrink-0 hover:bg-purple-700 transition"
          >
            Preview Videos
          </button>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — FINAL LANDING CTA                                            */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent to-purple-500/10 dark:to-purple-950/20">
        <div className="max-w-3xl mx-auto text-center space-y-5 bg-white dark:bg-[#130E26] rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-purple-900/40 shadow-xl">
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your next study session starts here.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Ask a question. Understand the concept. Practice it. Keep moving.
          </p>

          <div className="pt-2">
            <button
              onClick={() => openAuth('signup')}
              className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              Start Learning Free
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            No credit card required • Instant access to Class 10 & 12 tools
          </p>

        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-purple-900/30 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LumoraLogo size="sm" />
            <span>— AI Study Workspace</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/student" className="hover:text-purple-600">Student Workspace</Link>
            <Link to="/parent" className="hover:text-purple-600">Parent Dashboard</Link>
            <Link to="/pricing" className="hover:text-purple-600">Pricing</Link>
          </div>

          <p className="text-[10px]">© 2026 LumoraAI. Designed for academic mastery.</p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

    </div>
  );
}
