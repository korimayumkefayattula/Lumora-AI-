import React, { useState, useEffect, useRef } from 'react';
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
  Play, 
  Star, 
  BookOpen, 
  ShieldCheck,
  Compass,
  Camera,
  Mic,
  FileText,
  Zap,
  HelpCircle,
  Award,
  ChevronRight,
  Send,
  Check,
  GraduationCap,
  Search,
  X,
  Quote,
  RefreshCw,
  Volume2,
  Flame,
  Heart,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Code,
  Users,
  Video,
  MonitorPlay,
  Cpu,
  Sparkle
} from 'lucide-react';
import LumoraLogo from '../components/LumoraLogo';
import AuthModal from '../components/AuthModal';

// Curated motivational quotes for students
const MOTIVATIONAL_QUOTES = [
  {
    quote: "The expert in anything was once a beginner. Mastery is not an accident—it is the sum of small, quiet efforts repeated day after day.",
    author: "Helen Hayes",
    title: "On Consistency & Deliberate Practice",
    discipline: "Lifelong Mastery",
    tag: "Daily Mindset"
  },
  {
    quote: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible. Curiosity is the greatest engine of human intellect.",
    author: "Richard Feynman",
    title: "Nobel Laureate in Physics",
    discipline: "Theoretical Physics",
    tag: "Curiosity Driven"
  },
  {
    quote: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
    author: "Marie Curie",
    title: "Pioneer in Radioactivity",
    discipline: "Physics & Chemistry",
    tag: "Fearless Learning"
  },
  {
    quote: "It's not that I'm so smart, it's just that I stay with problems longer. Persistence through confusion is where true insight is born.",
    author: "Albert Einstein",
    title: "Theoretical Physicist",
    discipline: "Physics & Cosmology",
    tag: "Deep Focus"
  },
  {
    quote: "Becoming is better than being. A growth mindset turns setbacks into springboards and difficult questions into opportunities to expand.",
    author: "Dr. Carol S. Dweck",
    title: "Pioneering Psychologist",
    discipline: "Cognitive Science",
    tag: "Growth Mindset"
  }
];

// Quick suggestions for the search bar
const SEARCH_SUGGESTIONS = [
  { title: 'Interactive Concept Knowledge Graph', category: 'Core Tool', route: '/student/concept-explorer', icon: Compass },
  { title: 'AI Homework & Math Solver', category: 'Tool', route: '/student/homework-helper', icon: Camera },
  { title: 'Real-Time Voice AI Tutor', category: 'Tool', route: '/student/tutor', icon: Mic },
  { title: 'Spaced Repetition Flashcards', category: 'Tool', route: '/student/flashcards', icon: Layers },
  { title: 'Adaptive Diagnostic Mock Tests', category: 'Tool', route: '/student/mock-tests', icon: Target },
  { title: 'Calculus & Derivatives', category: 'Concept', route: '/student/concept-explorer', icon: Brain },
  { title: 'Organic Chemistry Mechanisms', category: 'Concept', route: '/student/concept-explorer', icon: Zap },
  { title: 'Quantum Physics & Entanglement', category: 'Concept', route: '/student/concept-explorer', icon: Sparkles },
  { title: 'Cellular Respiration & Photosynthesis', category: 'Concept', route: '/student/concept-explorer', icon: BookOpen },
  { title: 'Data Structures & Algorithms', category: 'Subject', route: '/student', icon: BrainCircuit },
];

export default function Landing() {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [demoPrompt, setDemoPrompt] = useState('Explain Photosynthesis light reactions simply');
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Search Bar State in Top Panel
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Motivational Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFlippingQuote, setIsFlippingQuote] = useState(false);
  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  // Hotkey listener for '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleNextQuote = () => {
    setIsFlippingQuote(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setIsFlippingQuote(false);
    }, 250);
  };

  const handleSpeakQuote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${currentQuote.quote} — ${currentQuote.author}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    navigate('/student');
  };

  const filteredSuggestions = searchQuery.trim()
    ? SEARCH_SUGGESTIONS.filter(
        (s) => 
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  const handleRunDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoPrompt.trim()) return;
    setIsGeneratingDemo(true);
    setTimeout(() => {
      setDemoResponse(
        `🌱 **Photosynthesis (Light Reactions Made Simple)**:\n\n` +
        `1. **Solar Panels of the Cell**: Chlorophyll molecules in the thylakoid membrane catch sunlight photons like tiny solar panels.\n` +
        `2. **Water Splitting**: Water (H₂O) is split into Hydrogen ions (H⁺), Electrons (e⁻), and Oxygen (O₂) gas (which plants release for us to breathe!).\n` +
        `3. **Energy Currency**: The released electrons charge up **ATP** and **NADPH** batteries to power the Calvin Cycle (sugar making)!`
      );
      setIsGeneratingDemo(false);
    }, 600);
  };

  const PLATFORM_FEATURES = [
    {
      title: "AI-Powered Learning Paths",
      desc: "Custom syllabus sequences and spaced-repetition schedules automatically tailored to your weak areas and exam dates.",
      tag: "Adaptive Roadmaps",
      previewHeader: "Personalized Roadmap • Class 12 STEM",
      previewItems: [
        { name: "Thermodynamics & Carnot Cycles", status: "Mastered", progress: 100, color: "text-emerald-400" },
        { name: "Electromagnetic Induction & Lenz's Law", status: "In Progress", progress: 74, color: "text-indigo-400" },
        { name: "Organic Reaction Mechanisms (SN1 vs SN2)", status: "Next Focus", progress: 35, color: "text-amber-400" }
      ]
    },
    {
      title: "Interactive & Engaging Content",
      desc: "3D interactive concept graphs, precision annotated SVG diagrams, and step-by-step mathematical breakdowns.",
      tag: "Visual Knowledge Graph",
      previewHeader: "3D Spatial Visualization Engine",
      previewItems: [
        { name: "Multi-Tier Explanations (5-Yr-Old to Advanced)", status: "Active", progress: 95, color: "text-emerald-400" },
        { name: "Precision SVG Vector Scientific Diagrams", status: "Rendered", progress: 100, color: "text-blue-400" },
        { name: "NotebookLM Source-Aware PDF Grounding", status: "Synced", progress: 88, color: "text-purple-400" }
      ]
    },
    {
      title: "Real-Time Progress Tracking",
      desc: "Comprehensive diagnostic mastery analytics, daily streak velocity, error log retrospectives, and exam readiness scores.",
      tag: "Telemetry & Analytics",
      previewHeader: "Live Telemetry & Score Projection",
      previewItems: [
        { name: "Target Exam Readiness Score", status: "94.8% Probable", progress: 95, color: "text-emerald-400" },
        { name: "Problem Solving Velocity", status: "1.4 min / Q", progress: 85, color: "text-indigo-400" },
        { name: "Active Focus Streak", status: "14 Days", progress: 90, color: "text-amber-400" }
      ]
    },
    {
      title: "Community & Mentorship",
      desc: "Peer study rooms, global leaderboards, collaborative problem solving, and 24/7 AI mentor chat.",
      tag: "Global Network",
      previewHeader: "Study Circles & AI Mentorship",
      previewItems: [
        { name: "Global Leaderboard Rank", status: "Top 1% Worldwide", progress: 98, color: "text-amber-400" },
        { name: "Peer Doubt Forum Solutions", status: "42 Resolved", progress: 90, color: "text-blue-400" },
        { name: "Voice AI Live Tutor", status: "Available 24/7", progress: 100, color: "text-emerald-400" }
      ]
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-rose-600 selection:text-white overflow-x-hidden ocean-atmosphere-bg">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
      />

      {/* Atmospheric Ambient Glow Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[700px] h-[700px] bg-teal-900/15 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 left-10 w-[500px] h-[500px] bg-rose-950/15 rounded-full blur-[140px]" />
      </div>

      {/* Header / Navbar Matching Edual Reference Layout */}
      <header className="fixed top-0 inset-x-0 bg-[#020b12]/85 backdrop-blur-xl z-50 border-b border-cyan-950/60 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* Brand Logo with Edual-inspired Red Accent */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" className="flex items-center gap-1.5 group">
              <div className="flex items-center gap-0.5">
                <span className="w-2 h-4.5 bg-rose-600 rounded-xs transform -skew-x-12"></span>
                <span className="w-2 h-4.5 bg-rose-500 rounded-xs transform -skew-x-12"></span>
                <span className="w-2 h-4.5 bg-rose-400 rounded-xs transform -skew-x-12"></span>
              </div>
              <span className="text-base font-black tracking-wider text-white font-mono uppercase group-hover:text-rose-400 transition-colors">
                EDUAL<span className="text-rose-500">.AI</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/40 text-cyan-300 text-[9px] font-bold tracking-wide">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              <span>OmniRoute</span>
            </span>
          </div>

          {/* Top Panel Search */}
          <div className="relative flex-1 max-w-sm hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border transition-all ${
                  isSearchFocused 
                    ? 'border-rose-500 ring-2 ring-rose-500/20 bg-slate-900 text-white' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <Search className={`w-3 h-3 shrink-0 ${isSearchFocused ? 'text-rose-400' : 'text-slate-400'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search courses, concepts, flashcards, AI tools... (/)"
                  className="w-full bg-transparent text-[11px] text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.2 text-[8px] font-mono text-slate-400 bg-slate-800 rounded">
                  /
                </kbd>
              </div>
            </form>

            {/* Dropdown Suggestions */}
            {isSearchFocused && (
              <div 
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-1">
                  {filteredSuggestions.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate(item.route);
                        }}
                        className="w-full p-2 rounded-xl hover:bg-rose-600/15 border border-transparent hover:border-rose-500/30 text-left flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-rose-300">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white block truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-[11px] font-semibold text-slate-300">
            <a href="#hero" className="text-white hover:text-rose-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-rose-400 transition-colors">About</a>
            <a href="#features" className="hover:text-rose-400 transition-colors">Features</a>
            <a href="#skills" className="hover:text-rose-400 transition-colors">Skills</a>
            <a href="#motivation" className="hover:text-rose-400 transition-colors">Motivation</a>
          </nav>

          {/* Auth / Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => openAuth('login')} 
              className="text-[11px] font-bold text-slate-300 hover:text-white transition-colors px-2.5 py-1.5"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/student')} 
              className="text-[11px] font-black bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-full transition-all shadow-md shadow-rose-600/30 flex items-center gap-1 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </header>

      <main className="pt-24 relative z-10">
        
        {/* ========================================================================= */}
        {/* HERO SECTION (Matching User's "Learn Smarter Grow Faster" Reference)     */}
        {/* ========================================================================= */}
        <section id="hero" className="relative px-6 pt-12 pb-20 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Online Learning Badge (Inspired by Education Template Image) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Next-Gen AI Learning Platform</span>
                <span className="text-rose-400 font-bold">• 2026 Edition</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                Learn Smarter <br />
                <span className="text-white">Grow Faster</span>
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => navigate('/student')} 
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-rose-600/25 transition-all active:scale-95 group"
                >
                  <span>Get Started Free</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button 
                  onClick={() => navigate('/student/subjects')} 
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-extrabold flex items-center gap-2 transition-all"
                >
                  <span>Explore Courses</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Partner Logos Bar (Inspired by Mockup) */}
              <div className="pt-6 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 opacity-70">
                  <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase font-mono text-slate-300">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>EDUAL</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase font-mono text-slate-300">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>GEMINI</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase font-mono text-slate-300">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>OMNIROUTE</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase font-mono text-slate-300">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>LUMORA</span>
                  </div>
                </div>
              </div>

              {/* Big Statistics (5.2M+ / 129+ / Description) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4">
                <div className="sm:col-span-3">
                  <div className="text-3xl sm:text-4xl font-black text-white">5.2M+</div>
                  <div className="text-xs text-slate-400 font-medium">Learners Worldwide</div>
                </div>

                <div className="sm:col-span-3">
                  <div className="text-3xl sm:text-4xl font-black text-white">129+</div>
                  <div className="text-xs text-slate-400 font-medium">Courses & Programs</div>
                </div>

                <div className="sm:col-span-6 flex items-center">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Empowering learners and educators with cutting-edge AI tools, interactive courses, instant doubt solving, and real-world skills for the digital age.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Interactive Hero Card (With Red Glow & Join Now Card) */}
            <div className="lg:col-span-5 relative">
              
              {/* Red/Crimson Ambient Glow Sphere */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-rose-600/30 via-red-500/20 to-cyan-500/15 rounded-3xl blur-2xl -z-10" />

              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl overflow-hidden space-y-4">
                
                {/* Classroom / Mentor Visual Mockup Header */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-56 flex flex-col justify-between p-4 bg-gradient-to-br from-rose-950/40 via-slate-950 to-cyan-950/40">
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Live AI Mentor Session
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Class 12 STEM</span>
                  </div>

                  {/* Waveform Animation */}
                  <div className="flex items-center justify-center gap-1 py-4">
                    <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-12 bg-rose-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-1.5 h-16 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-10 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    <span className="w-1.5 h-14 bg-rose-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce [animation-delay:0.25s]"></span>
                  </div>

                  {/* Join Now Floating CTA */}
                  <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-xs text-white">
                        AI
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">LuminatiAI Master Tutor</div>
                        <div className="text-[10px] text-emerald-400">Online • Ready to solve doubts</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/student/tutor')}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg shadow-lg transition-all active:scale-95"
                    >
                      Join Now
                    </button>
                  </div>

                </div>

                {/* Sub Features Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div 
                    onClick={() => navigate('/student/concept-explorer')}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                      <Compass className="w-3.5 h-3.5" />
                      <span>3D Knowledge Map</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Interactive concept prerequisite graph</p>
                  </div>

                  <div 
                    onClick={() => navigate('/student/doubt-solver')}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera Solver</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Instant LaTeX equation step breakdown</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SMARTER MINDS. REAL IMPACT FOR LEARNING                        */}
        {/* ========================================================================= */}
        <section id="about" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Smarter Minds. Real <br className="hidden sm:inline" />
              Impact for Learning.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Join the fastest growing EdTech community and discover courses, tools, and support to fuel your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Video / Interactive Studio Card */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-80 sm:h-96 flex flex-col justify-between p-6 bg-gradient-to-tr from-slate-950 via-rose-950/20 to-slate-900">
                
                {/* Top Instructor Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>350+ Master Instructors</span>
                  </div>
                  <span className="text-xs text-slate-400">Empowered with AI</span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <button 
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 hover:scale-105 transition-all active:scale-95"
                    aria-label="Play demonstration video"
                  >
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-300">
                    {isVideoPlaying ? 'Playing Interactive Demo...' : 'Watch How It Works (2 min)'}
                  </span>
                </div>

                {/* Bottom Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-semibold text-slate-300 border border-slate-800">
                    Flexible
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-semibold text-slate-300 border border-slate-800">
                    Personalized
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-[11px] font-semibold text-slate-300 border border-slate-800">
                    Future Ready
                  </span>
                </div>

              </div>
            </div>

            {/* Right Informational Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
                <span className="text-xs font-black uppercase text-rose-400 tracking-wider">
                  Scalable & Adaptive
                </span>
                <h3 className="text-2xl font-black text-white">
                  Designed for Deep Cognitive Clarity
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Our platform doesn't just hold courses—it adapts, personalizes, and evolves with every learner. Synthetic AI models are calibrated to replicate real classroom engagement and deliver measurable skills for your future.
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => navigate('/student/concept-explorer')}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: PLATFORM FEATURES TO POWER SMARTER LEARNING                   */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block mb-2">
                Unified Ecosystem
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Platform Features to <br />
                Power Smarter Learning
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              With a driving focus on research, user experience, and measurable exam scores.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Feature Selector Tabs */}
            <div className="lg:col-span-5 space-y-3">
              {PLATFORM_FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all text-left ${
                    activeFeatureTab === idx
                      ? 'bg-slate-900 border-rose-500/80 ring-1 ring-rose-500/30 shadow-xl'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`text-sm font-extrabold ${activeFeatureTab === idx ? 'text-white' : 'text-slate-300'}`}>
                      {feat.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {feat.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Interactive Telemetry & Code Showcase */}
            <div className="lg:col-span-7">
              <div className="h-full rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl space-y-6">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-extrabold text-white">
                      {PLATFORM_FEATURES[activeFeatureTab].previewHeader}
                    </div>
                    <div className="text-[10px] text-slate-400">Live AI telemetry synchronizing in real time</div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-base font-black text-white">8.1K+</div>
                      <div className="text-[10px] text-slate-400">Active Learners</div>
                    </div>
                    <div>
                      <div className="text-base font-black text-white">90.1K+</div>
                      <div className="text-[10px] text-slate-400">Hours Delivered</div>
                    </div>
                  </div>
                </div>

                {/* Progress Visualizer List */}
                <div className="space-y-4 flex-1 justify-center flex flex-col">
                  {PLATFORM_FEATURES[activeFeatureTab].previewItems.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className={`font-mono font-bold ${item.color}`}>{item.status}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Ready to start this module?</span>
                  <button 
                    onClick={() => navigate('/student')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Launch in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: LEARN THE SKILLS THAT MATTER (Cards Grid from Mockup)         */}
        {/* ========================================================================= */}
        <section id="skills" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Learn the Skills That Matter
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              From STEM to creativity, explore courses designed to prepare you for real-world challenges and future opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Data Science & AI */}
            <div 
              onClick={() => navigate('/student')}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all p-6 cursor-pointer shadow-xl flex flex-col justify-between h-72 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold border border-rose-500/30">
                  High Demand
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-rose-300 transition-colors">
                  Data Science & AI Intelligence
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Machine learning fundamentals, Python data pipelines, neural network architectures, and predictive analytics.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-bold text-rose-400">
                <span>12 Modules • 48 Hours</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: UI/UX & Digital Product Design */}
            <div 
              onClick={() => navigate('/student')}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all p-6 cursor-pointer shadow-xl flex flex-col justify-between h-72 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30">
                  Creative Tech
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                  UI/UX Design & Product Strategy
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Design systems, spatial UI paradigms, micro-interactions, responsive Figma workflows, and user empathy frameworks.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-bold text-cyan-400">
                <span>9 Modules • 36 Hours</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Advanced STEM Physics & Calculus */}
            <div 
              onClick={() => navigate('/student/concept-explorer')}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all p-6 cursor-pointer shadow-xl flex flex-col justify-between h-72 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                  Exam Mastery
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                  Theoretical Physics & Calculus
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Differential equations, electromagnetism, quantum mechanics, and thermodynamics with interactive 3D graphs.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-bold text-amber-400">
                <span>16 Modules • 64 Hours</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: LIVE INTERACTIVE DOUBT & CONCEPT SANDBOX                      */}
        {/* ========================================================================= */}
        <section id="demo" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Interactive Sandbox</span>
                </div>
                <h3 className="text-2xl font-black text-white">Ask Any Question in Real Time</h3>
              </div>
              <span className="text-xs text-slate-400">Powered by Gemini 2.5 Flash & OmniRoute</span>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleRunDemo} className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-2xl p-2 focus-within:border-rose-500 transition-colors">
                <Sparkles className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  placeholder="Ask any concept question (Math, Physics, Biology, History)..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-2"
                />
                <button
                  type="submit"
                  disabled={isGeneratingDemo}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  {isGeneratingDemo ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Response Card */}
            {demoResponse ? (
              <div className="bg-slate-950 rounded-2xl p-5 border border-rose-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
                <div className="flex items-center justify-between text-xs text-rose-400 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    AI Concept Response Generated
                  </span>
                  <button 
                    onClick={() => navigate('/student/concept-explorer')}
                    className="text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <span>Open in full visual graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>{demoResponse}</div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  'Explain Quantum Entanglement',
                  'How does RuBisCO work in Calvin Cycle?',
                  'Derive the quadratic formula step-by-step',
                  'Compare AC and DC Current'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDemoPrompt(preset);
                      setIsGeneratingDemo(true);
                      setTimeout(() => {
                        setDemoResponse(
                          `✨ **${preset}**:\n\n` +
                          `• **Core Idea**: Edual breaks complex syllabus topics into intuitive mental models, high-school textbook rigor, and exam scoring strategies.\n` +
                          `• **Interactive Graph**: Connected to 8 prerequisite and derivative concepts.\n` +
                          `• **Exam Ready**: Includes common misconceptions, key formulas, and self-check quizzes.`
                        );
                        setIsGeneratingDemo(false);
                      }, 500);
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-950 hover:bg-rose-950/40 text-[11px] font-semibold text-slate-300 border border-slate-800 hover:border-rose-500/50 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: MOTIVATION & GROWTH MINDSET HUB                               */}
        {/* ========================================================================= */}
        <section id="motivation" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Daily Motivation Spark</span>
                </div>
                <h3 className="text-2xl font-black text-white">Fuel Your Focus & Discipline</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakQuote}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
                <button
                  onClick={handleNextQuote}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFlippingQuote ? 'animate-spin' : ''}`} />
                  <span>Next Spark</span>
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 transition-opacity ${
              isFlippingQuote ? 'opacity-40' : 'opacity-100'
            }`}>
              <p className="text-lg sm:text-xl font-serif italic text-slate-200">
                "{currentQuote.quote}"
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-bold text-white">{currentQuote.author} • {currentQuote.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-bold">{currentQuote.tag}</span>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Modern Dark Footer */}
      <footer className="bg-[#02090e] text-slate-400 py-12 px-6 border-t border-cyan-950/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-5 bg-rose-600 rounded-xs transform -skew-x-12"></span>
              <span className="w-2 h-5 bg-rose-500 rounded-xs transform -skew-x-12"></span>
              <span className="w-2 h-5 bg-rose-400 rounded-xs transform -skew-x-12"></span>
            </div>
            <span className="text-base font-black tracking-wider text-white font-mono uppercase">
              EDUAL<span className="text-rose-500">.AI</span>
            </span>
          </div>

          <p className="text-slate-500 font-medium text-xs text-center md:text-left">
            © 2026 Edual / Lumora AI Inc. All rights reserved. Next-generation AI learning workspace.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
            <button onClick={() => openAuth('login')} className="hover:text-white">Sign In</button>
            <button onClick={() => openAuth('signup')} className="hover:text-white">Sign Up</button>
            <Link to="/student" className="hover:text-white">Student App</Link>
            <Link to="/parent" className="hover:text-white">Parent Portal</Link>
            <Link to="/admin" className="hover:text-white">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
