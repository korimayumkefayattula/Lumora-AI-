/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Check, 
  Download, 
  CalendarDays, 
  Target, 
  Moon, 
  Sun,
  Eye,
  User,
  LayoutGrid,
  SlidersHorizontal,
  Headphones,
  Lightbulb,
  Layers,
  Heart,
  Droplet,
  StickyNote,
  Compass,
  Camera
} from "lucide-react";
import { Subject, StudyTask } from "../types";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";
import StudyStats from "../components/StudyStats";
import TaskTracker from "../components/TaskTracker";
import SmartCalendar from "../components/SmartCalendar";
import QuickBrainDump from "../components/QuickBrainDump";
import FocusTimer from "../components/FocusTimer";
import QuickNotes from "../components/QuickNotes";
import LearningStyle from "../components/LearningStyle";
import { Achievements } from "../components/Achievements";
import { DailyQuote } from "../components/DailyQuote";
import { OmniRouteBanner } from "../components/OmniRouteBanner";
import { VoiceTutorButton } from "../components/voice/VoiceTutorButton";
import { VoiceTutorModal } from "../components/voice/VoiceTutorModal";
import { useTheme } from "../context/ThemeContext";

// Widget Imports
import { WidgetConfig, WidgetId } from "../components/widgets/types";
import { StreakEnergyWidget } from "../components/widgets/StreakEnergyWidget";
import { SoundscapesFocusWidget } from "../components/widgets/SoundscapesFocusWidget";
import { DailyBrainBoostWidget } from "../components/widgets/DailyBrainBoostWidget";
import { SpacedRepetitionWidget } from "../components/widgets/SpacedRepetitionWidget";
import { ExamCountdownWidget } from "../components/widgets/ExamCountdownWidget";
import { WellnessWidget } from "../components/widgets/WellnessWidget";
import { LiveStudyRoomWidget } from "../components/widgets/LiveStudyRoomWidget";
import { QuickScratchpadWidget } from "../components/widgets/QuickScratchpadWidget";
import { WidgetCustomizerModal } from "../components/widgets/WidgetCustomizerModal";

const DEFAULT_WIDGET_CONFIGS: WidgetConfig[] = [
  {
    id: "streak_energy",
    title: "Streak & Cognitive Battery",
    category: "Productivity",
    description: "Real-time study energy gauge, daily streak multiplier & peak hour insight.",
    iconName: "Flame",
    defaultSize: "md",
    enabled: true,
    order: 1,
  },
  {
    id: "soundscapes",
    title: "Binaural Beats & Soundscapes",
    category: "Productivity",
    description: "Synthesized neuro-acoustics (10Hz Alpha, 40Hz Gamma, rain, brown noise).",
    iconName: "Headphones",
    defaultSize: "md",
    enabled: true,
    order: 2,
  },
  {
    id: "daily_brain_boost",
    title: "Daily Brain Boost",
    category: "AI & Learning",
    description: "Bite-sized AI daily concept with 10s audio breakdown & quick 15 XP quiz.",
    iconName: "Lightbulb",
    defaultSize: "md",
    enabled: true,
    order: 3,
  },
  {
    id: "spaced_repetition",
    title: "Spaced Repetition & Recall",
    category: "AI & Learning",
    description: "Interactive active recall flip cards due today with retention rating.",
    iconName: "Layers",
    defaultSize: "md",
    enabled: true,
    order: 4,
  },
  {
    id: "exam_countdown",
    title: "Exam Countdown & Readiness",
    category: "Core Study",
    description: "Milestone syllabus mastery rings and countdown timers for target exams.",
    iconName: "Target",
    defaultSize: "md",
    enabled: true,
    order: 5,
  },
  {
    id: "wellness",
    title: "Ergonomics & Eye-Care",
    category: "Wellness & Social",
    description: "Hydration logger and automated 20-20-20 eye strain countdown rule.",
    iconName: "Eye",
    defaultSize: "md",
    enabled: true,
    order: 6,
  },
  {
    id: "live_study_room",
    title: "Global Study Room",
    category: "Wellness & Social",
    description: "Live peer presence pulse, focus sprints, and motivation high-fives.",
    iconName: "Users",
    defaultSize: "md",
    enabled: true,
    order: 7,
  },
  {
    id: "quick_scratchpad",
    title: "Scratchpad & Quick Memo",
    category: "Productivity",
    description: "Auto-saved local note buffer with instant AI bullet formatter.",
    iconName: "StickyNote",
    defaultSize: "md",
    enabled: true,
    order: 8,
  },
];

// Pre-populate beautiful default data so the user begins with a lively dashboard
const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub-linear-alg", name: "Linear Algebra", color: "#6366f1", targetHoursPerWeek: 5 },
  { id: "sub-web-dev", name: "Web Engineering", color: "#06b6d4", targetHoursPerWeek: 4 },
];

const INITIAL_TASKS: StudyTask[] = [
  { id: "task-1", subjectId: "sub-linear-alg", title: "Review page 12 Matrix Multiplication exercises", durationMinutes: 45, isCompleted: true, priority: "high", date: "2026-06-03" },
  { id: "task-2", subjectId: "sub-linear-alg", title: "Practice eigenvalues & eigenvectors calculations", durationMinutes: 30, isCompleted: false, priority: "high", date: "2026-06-03" },
  { id: "task-3", subjectId: "sub-web-dev", title: "Complete study review of React Context API pattern", durationMinutes: 60, isCompleted: false, priority: "medium", date: "2026-06-03" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const local = localStorage.getItem("socrates_subjects");
    return local ? JSON.parse(local) : INITIAL_SUBJECTS;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const local = localStorage.getItem("socrates_tasks");
    return local ? JSON.parse(local) : INITIAL_TASKS;
  });

  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const local = localStorage.getItem("socrates_pomodoros");
    return local ? parseInt(local, 10) : 1;
  });

  const [xpPoints, setXpPoints] = useState<number>(() => {
    return parseInt(localStorage.getItem("socrates_xp") || "0", 10);
  });
  
  const userLevel = Math.floor(xpPoints / 100) + 1;

  const [dailyGoal, setDailyGoal] = useState<string>(() => {
    return localStorage.getItem("socrates_daily_goal") || "";
  });

  // Widget management state
  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const local = localStorage.getItem("lumora_widget_configs");
    return local ? JSON.parse(local) : DEFAULT_WIDGET_CONFIGS;
  });
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [selectedWidgetCategory, setSelectedWidgetCategory] = useState<string>("all");

  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [isStudyBuddyOpen, setIsStudyBuddyOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lumora_widget_configs", JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);

  const handleToggleWidget = (id: WidgetId) => {
    setWidgetConfigs((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleResetWidgets = () => {
    setWidgetConfigs(DEFAULT_WIDGET_CONFIGS);
  };

  const isWidgetEnabled = (id: WidgetId) => {
    const widget = widgetConfigs.find((w) => w.id === id);
    if (!widget || !widget.enabled) return false;
    if (selectedWidgetCategory === "all") return true;
    return widget.category === selectedWidgetCategory;
  };
  

  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToCalendar = () => {
    const el = document.getElementById('smart-calendar-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToTasks = () => {
    const el = document.getElementById('task-tracker-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Calculate daily streak
  const calculateStreak = () => {
    const completedTasks = tasks.filter((t) => t.isCompleted);
    const dateSet = new Set<string>(completedTasks.map((t) => t.date));
    const dates = Array.from(dateSet).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    // Normalize to YYYY-MM-DD
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;
    
    let currentDate = new Date(dates[0]);
    
    for (let i = 0; i < dates.length; i++) {
      const dateStr = dates[i];
      const d = new Date(dateStr);
      
      const diffTime = Math.abs(currentDate.getTime() - d.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const dailyStreak = calculateStreak();

  const toggleAudio = () => {
    if (!audioRef.current) {
      // Using a reliable royalty-free public lo-fi stream or audio file
      audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
      audioRef.current.loop = true;
    }
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem("socrates_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("socrates_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("socrates_pomodoros", completedPomodoros.toString());
  }, [completedPomodoros]);

  useEffect(() => {
    localStorage.setItem("socrates_xp", xpPoints.toString());
  }, [xpPoints]);

  useEffect(() => {
    localStorage.setItem("socrates_daily_goal", dailyGoal);
  }, [dailyGoal]);

  // Master Callback managers
  const handleAddSubject = (name: string, targetHours: number, color: string) => {
    const newSub: Subject = {
      id: `sub-${Math.random().toString()}`,
      name,
      color,
      targetHoursPerWeek: targetHours
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Cascade removal to related tasks
    setTasks((prev) => prev.filter((t) => t.subjectId !== id));
  };

  const handleAddMockSubject = (name: string) => {
    const newId = `sub-${Math.random().toString()}`;
    const newSub: Subject = {
      id: newId,
      name,
      color: "#8b5cf6", // default violet
      targetHoursPerWeek: 4
    };
    setSubjects((prev) => [...prev, newSub]);
    return newId;
  };

  const handleAddTask = (title: string, duration: number, priority: 'low' | 'medium' | 'high', subjectId: string, category?: 'Exam Prep' | 'Assignment' | 'Research' | 'Reading' | 'Writing' | 'Coding' | 'Other', dueDate?: string, notes?: string) => {
    const newTask: StudyTask = {
      id: `task-${Math.random().toString()}`,
      subjectId,
      title,
      durationMinutes: duration,
      isCompleted: false,
      priority,
      category,
      dueDate,
      notes,
      date: new Date().toISOString().split("T")[0]
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleAddMultipleTasks = (generatedTasks: { title: string; durationMinutes: number; priority: 'low' | 'medium' | 'high'; notes: string; subjectId: string }[]) => {
    const mapped: StudyTask[] = generatedTasks.map((gt) => ({
      id: `task-${Math.random().toString()}`,
      subjectId: gt.subjectId,
      title: gt.title,
      durationMinutes: gt.durationMinutes,
      isCompleted: false,
      priority: gt.priority,
      notes: gt.notes,
      isAiGenerated: true,
      date: new Date().toISOString().split("T")[0]
    }));
    setTasks((prev) => [...prev, ...mapped]);
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks((prev) => {
      const newTasks = prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      const task = prev.find(t => t.id === id);
      if (task && !task.isCompleted) {
        // Trigger confetti when marking a task as complete
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setXpPoints(prevXp => prevXp + 25);
      } else if (task && task.isCompleted) {
        setXpPoints(prevXp => Math.max(0, prevXp - 25));
      }
      return newTasks;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSessionComplete = (subjectId: string, durationMinutes: number) => {
    setCompletedPomodoros((prev) => prev + 1);
    
    // Add XP proportional to duration
    const xpEarned = Math.floor(durationMinutes * 1.5);
    setXpPoints(prev => prev + xpEarned);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#10B981', '#F59E0B']
    });
    
    // Attempt to formulate visual/message banner
    const subjectName = subjects.find(s => s.id === subjectId)?.name || "Study Target";
    setSuccessBanner(`🌟 Fantastic Job! You earned ${xpEarned} XP and successfully logged a ${durationMinutes}-minute study block for: "${subjectName}"`);
    
    // Auto clear banner
    setTimeout(() => {
      setSuccessBanner(null);
    }, 6000);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all subjects, tasks, and timers to defaults?")) {
      setSubjects(INITIAL_SUBJECTS);
      setTasks(INITIAL_TASKS);
      setCompletedPomodoros(1);
    }
  };

  const handleDownloadData = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Study Performance Report", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Total Tasks: ${tasks.length}`, 20, 35);
    doc.text(`Completed Tasks: ${tasks.filter(t => t.isCompleted).length}`, 20, 45);
    doc.text(`Completed Pomodoros: ${completedPomodoros}`, 20, 55);
    
    doc.text("Completed Tasks:", 20, 75);
    
    let yPos = 85;
    doc.setFontSize(10);
    
    tasks.filter(t => t.isCompleted).forEach((task, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${task.title} (${task.durationMinutes} mins)`, 25, yPos);
      yPos += 10;
    });
    
    doc.save("study-report.pdf");
  };

    return (
    <div className="h-full edual-crimson-bg bg-[#08080a] text-slate-100 overflow-y-auto font-sans transition-colors duration-300">
      {/* Dynamic Success notifications banner */}
      {successBanner && (
        <div id="success-floater-banner" className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#141418] border border-rose-900/60 text-white text-xs font-bold py-3.5 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successBanner}</span>
        </div>
      )}
      
      {/* Top Header */}
      <header className="px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-20 bg-[#08080a]/85 dark:bg-[#08080a]/85 backdrop-blur-md border-b border-zinc-800/40 transition-colors duration-300">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-rose-950/40 dark:bg-rose-950/40 text-rose-300 rounded-full border border-rose-900/50 shadow-xs">
             <Flame className="w-3.5 h-3.5 text-rose-400" />
             <span className="font-bold text-xs tracking-wide">{dailyStreak} Day Streak</span>
          </div>
          
          <div className="flex items-center justify-end w-full lg:w-auto gap-2">
             <div className="text-right hidden sm:block mr-1">
              <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider block">Workspace Node</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Active
              </span>
            </div>
            
            <button
              onClick={() => {
                if (theme === 'light') setTheme('dark');
                else if (theme === 'dark') setTheme('focus');
                else setTheme('light');
              }}
              className="w-8 h-8 rounded-xl bg-[#141418] dark:bg-[#141418] theme-focus:bg-[#201c18] border border-zinc-800 dark:border-zinc-800 theme-focus:border-[#382e25] flex items-center justify-center text-zinc-300 dark:text-zinc-300 theme-focus:text-amber-400 hover:text-rose-400 hover:border-rose-700/60 shadow-xs transition-all"
              title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : theme === 'focus' ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
            <button
              onClick={handleDownloadData}
              className="w-8 h-8 rounded-xl bg-[#141418] dark:bg-[#141418] border border-zinc-800 dark:border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-400 hover:border-rose-700/60 shadow-xs transition-all"
              title="Export PDF Report"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetData}
              className="w-8 h-8 rounded-xl bg-[#141418] dark:bg-[#141418] border border-zinc-800 dark:border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-rose-400 hover:border-rose-700/60 shadow-xs transition-all"
              title="Reset workspace coordinates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-[#1a1a20] flex items-center justify-center overflow-hidden border border-zinc-700 shadow-xs ml-0.5">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </header>

      <main className="px-6 lg:px-10 pb-20">
          
          {/* OmniRoute Status & Control Banner */}
          <OmniRouteBanner />

          {/* Welcome Banner - Edual Crimson Dark Gradient */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1c080d] via-[#12080a] to-[#0a0a0d] border border-rose-900/40 p-8 lg:p-10 text-white shadow-2xl mb-8">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-rose-600/40 text-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" /> AI Mentor
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-3 leading-tight text-white">
                  "What should I study today?"
                </h2>
                <p className="text-zinc-300 font-medium text-lg max-w-xl">
                  Your personalized study schedule is ready. Let's tackle those weak chapters and build momentum.
                </p>
              </div>
              <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#16161b]/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/[0.08]">
                  <div>
                    <label className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1"><Target className="w-4 h-4 text-rose-400" /> Current Level</label>
                    <div className="text-2xl font-bold font-display text-white">Level {userLevel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 font-medium mb-1">{xpPoints} XP</div>
                    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full" style={{ width: `${(xpPoints % 100)}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#16161b]/80 backdrop-blur-md rounded-2xl p-4 border border-white/[0.08]">
                  <label className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays className="w-4 h-4 text-rose-400" /> Next Milestone</label>
                  <div className="flex justify-between items-end">
                    <span className="font-semibold text-lg text-white">Final Exams</span>
                    <span className="text-2xl font-bold font-display text-rose-400">14 Days</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background red glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-600/20 opacity-40 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-red-600/15 opacity-30 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 items-start">
            
            {/* Main widgets */}
            <div className="space-y-8">
              <VoiceTutorButton variant="banner" onClick={() => setIsVoiceModalOpen(true)} />
              
              {/* AI HOMEWORK HELPER BANNER */}
              <div className="p-6 bg-gradient-to-r from-[#18080c] via-[#140810] to-[#0c0c10] text-white rounded-3xl border border-rose-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      📷 Lens Camera OCR + Photomath Steps
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">Lumora AI Homework Helper</h3>
                  <p className="text-xs text-zinc-300">Scan printed questions, upload handwritten notes, or attach PDFs to get step-by-step guidance & hints.</p>
                </div>
                <button 
                  onClick={() => navigate('/student/homework-helper')}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-950/50 hover:scale-105 transition-all shrink-0"
                >
                  Scan Homework
                </button>
              </div>

              {/* EXPLAIN SIMPLY QUICK BANNER */}
              <div className="p-6 bg-gradient-to-r from-[#140812] via-[#100816] to-[#0c0c10] text-white rounded-3xl border border-zinc-800/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      ✨ NotebookLM Grounded + Notion AI Inline
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">Lumora Explain Simply AI</h3>
                  <p className="text-xs text-zinc-300">Highlight any complex concept or paste text to transform it into 4 age-appropriate levels with flashcards & quizzes.</p>
                </div>
                <button 
                  onClick={() => navigate('/student/explain-simply')}
                  className="px-5 py-3 bg-[#181820] hover:bg-[#22222c] border border-zinc-700 hover:border-rose-500/60 text-white font-extrabold text-xs rounded-2xl shadow-md hover:scale-105 transition-all flex items-center gap-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-rose-400" /> Open Explain Simply
                </button>
              </div>

              {/* ========================================================= */}
              {/* DYNAMIC BENTO WIDGETS HUB                                  */}
              {/* ========================================================= */}
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 theme-focus:bg-amber-500/10 border border-rose-500/20 theme-focus:border-amber-500/20 flex items-center justify-center text-rose-400 theme-focus:text-amber-400">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-white theme-focus:text-amber-100 flex items-center gap-2">
                        Study Companion Widgets
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60">
                          {widgetConfigs.filter((w) => w.enabled).length} Active
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400 theme-focus:text-amber-300/60">
                        Modular cognitive tools, neuro-soundscapes, active recall & ergonomic trackers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCustomizerOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs bg-[#141418] theme-focus:bg-[#201c18] border-zinc-800 theme-focus:border-[#382e25] text-zinc-300 theme-focus:text-amber-200 hover:border-rose-500/60 hover:text-white"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400 theme-focus:text-amber-400" />
                      <span>Customize Widgets</span>
                    </button>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {[
                    { id: 'all', label: 'All Modules' },
                    { id: 'Core Study', label: 'Core Study' },
                    { id: 'AI & Learning', label: 'AI & Learning' },
                    { id: 'Productivity', label: 'Productivity & Sound' },
                    { id: 'Wellness & Social', label: 'Wellness & Social' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedWidgetCategory(tab.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedWidgetCategory === tab.id
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-950/50'
                          : 'bg-[#121216] theme-focus:bg-[#1a1714] border border-zinc-800/80 theme-focus:border-[#2e261f] text-zinc-400 theme-focus:text-amber-200/70 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Widgets Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {isWidgetEnabled('streak_energy') && <StreakEnergyWidget />}
                  {isWidgetEnabled('soundscapes') && <SoundscapesFocusWidget />}
                  {isWidgetEnabled('daily_brain_boost') && <DailyBrainBoostWidget />}
                  {isWidgetEnabled('spaced_repetition') && <SpacedRepetitionWidget />}
                  {isWidgetEnabled('exam_countdown') && <ExamCountdownWidget />}
                  {isWidgetEnabled('wellness') && <WellnessWidget />}
                  {isWidgetEnabled('live_study_room') && <LiveStudyRoomWidget />}
                  {isWidgetEnabled('quick_scratchpad') && <QuickScratchpadWidget />}
                </div>
              </section>

              <DailyQuote />
              <Achievements completedPomodoros={completedPomodoros} tasks={tasks} xpPoints={xpPoints} />
              <StudyStats xpPoints={xpPoints} 
                subjects={subjects} 
                tasks={tasks} 
                completedPomodoros={completedPomodoros} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FocusTimer subjects={subjects} onSessionComplete={handleSessionComplete} />
                
              </div>
              
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div id="smart-calendar-section"><SmartCalendar tasks={tasks} subjects={subjects} onUpdateTaskDate={(taskId, newDate) => {
                    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, date: newDate } : t));
                  }} /></div>
                  <div id="task-tracker-section"><TaskTracker

                    subjects={subjects}
                    tasks={tasks}
                    onAddSubject={handleAddSubject}
                    onDeleteSubject={handleDeleteSubject}
                    onAddTask={handleAddTask}
                    onToggleTaskComplete={handleToggleTaskComplete}
                    onDeleteTask={handleDeleteTask}
                  /></div>
                  
                </div>
                <div className="flex flex-col gap-8 h-full">
                  <QuickNotes />
                  <LearningStyle />
                </div>
              </div>
            </div>
          </div>
          
          <footer className="mt-12 py-6 text-center select-none opacity-50 pb-32">
            <p className="text-[11px] font-medium text-slate-500 capitalize">
              Luminati AI • Structuring focus intervals and active recall map templates
            </p>
          </footer>
              </main>
      <QuickBrainDump />
      <VoiceTutorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <WidgetCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        configs={widgetConfigs}
        onToggleWidget={handleToggleWidget}
        onResetWidgets={handleResetWidgets}
      />
    </div>
  );
}
