import React, { useState } from 'react';
import { 
  RefreshCw, Sparkles, CheckCircle2, Clock, AlertTriangle, 
  Layers, ArrowRight, Trophy, BookOpen, Target, Check, RotateCcw,
  Zap, Brain, ChevronRight, Play, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '../context/StudentProfileContext';

interface RevisionQueueItem {
  id: string;
  topic: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  recommendedAction: string;
  lastScore?: number;
  dueDate: string;
  streak: number;
  content: string;
}

const REVISION_QUEUE: RevisionQueueItem[] = [
  {
    id: 'rev-1',
    topic: "Optics & Snell's Law Refraction",
    subject: 'Physics',
    priority: 'High',
    reason: 'Weak / recently missed on Quiz (Accuracy: 42%)',
    recommendedAction: 'Targeted lesson + 3 derivation questions',
    lastScore: 42,
    dueDate: 'Today (Overdue)',
    streak: 1,
    content: "Snell's Law states n₁ sin(θ₁) = n₂ sin(θ₂). Remember that when light passes from a rarer to a denser optical medium, it bends towards the normal line."
  },
  {
    id: 'rev-2',
    topic: 'SN1 vs SN2 Reaction Mechanisms',
    subject: 'Chemistry',
    priority: 'High',
    reason: 'Weak / recently missed (Confused carbocation stability)',
    recommendedAction: 'Targeted concept breakdown + mechanism drill',
    lastScore: 50,
    dueDate: 'Today',
    streak: 2,
    content: 'SN1 reactions occur in 2 steps via a planar carbocation intermediate (favored in polar protic solvents). SN2 occurs in a single concerted step with backside attack and Walden inversion.'
  },
  {
    id: 'rev-3',
    topic: 'Quadratic Equations & Discriminant',
    subject: 'Mathematics',
    priority: 'Medium',
    reason: 'Needs reinforcement (Last reviewed 4 days ago)',
    recommendedAction: 'Flashcards + 5-question short quiz',
    lastScore: 75,
    dueDate: 'Tomorrow',
    streak: 4,
    content: 'Discriminant D = b² - 4ac. If D > 0, two distinct real roots. If D = 0, two equal real roots. If D < 0, complex conjugate roots.'
  },
  {
    id: 'rev-4',
    topic: 'Photosynthesis Light-Dependent Reactions',
    subject: 'Biology',
    priority: 'Medium',
    reason: 'Needs reinforcement (Last reviewed 6 days ago)',
    recommendedAction: 'Flashcards + pathway diagram review',
    lastScore: 78,
    dueDate: 'In 2 days',
    streak: 3,
    content: 'Light reactions in thylakoid membranes photolyze H₂O, releasing O₂ and energizing ATP & NADPH through non-cyclic photophosphorylation.'
  },
  {
    id: 'rev-5',
    topic: "Newton's Laws of Motion & Momentum",
    subject: 'Physics',
    priority: 'Low',
    reason: 'Strong concept, scheduled for periodic spaced recall',
    recommendedAction: 'Quick 2-minute recall session',
    lastScore: 92,
    dueDate: 'In 5 days',
    streak: 7,
    content: 'F_net = dp/dt = m*a (for constant mass). Action and reaction forces act simultaneously on mutually interacting bodies.'
  }
];

export default function RevisionCenterPage() {
  const navigate = useNavigate();
  const { profile } = useStudentProfile();
  
  const [activeTab, setActiveTab] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [sessionActive, setSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [retestCompleted, setRetestCompleted] = useState(false);

  const filteredItems = REVISION_QUEUE.filter(item => {
    const matchesPriority = activeTab === 'All' || item.priority === activeTab;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchesPriority && matchesSubject;
  });

  const handleNextCard = () => {
    if (currentStep < filteredItems.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSessionActive(false);
      setCurrentStep(0);
      setRetestCompleted(true);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" />
            <span>PRD Page 11 • Spaced Repetition Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Revision Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Review weak topics and previously learned material with spaced repetition algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setCurrentStep(0);
              setSessionActive(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Due Revision ({filteredItems.length})</span>
          </button>
        </div>
      </div>

      {/* CORE LOOP BANNER (PRD Page 11 Specification) */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-rose-500 font-black uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            PRD Page 11 Core Learning Loop
          </span>
          <span className="text-[10px] text-slate-400">Continuous cognitive feedback engine</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { step: 'Quiz Result', desc: 'Identify errors', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' },
            { step: 'Weak Concept', desc: 'Auto-flagged', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
            { step: 'Revision Task', desc: 'High priority drill', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
            { step: 'Completion', desc: 'Active recall', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
            { step: 'Retest', desc: 'Verify retention', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
            { step: 'Updated Progress', desc: '+15% Mastery', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div className={`px-3 py-2 rounded-xl border ${item.color} shrink-0 text-center`}>
                <div className="font-extrabold text-xs">{item.step}</div>
                <div className="text-[9px] opacity-80">{item.desc}</div>
              </div>
              {idx < arr.length - 1 && (
                <span className="text-slate-400 font-bold shrink-0">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {retestCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-black">Revision Session Successfully Completed!</div>
              <div className="text-[11px] opacity-90">Your retention scores and learning streak have been updated across your telemetry dashboard.</div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/student/quiz')} 
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
          >
            Take 3-Min Retest
          </button>
        </div>
      )}

      {!sessionActive ? (
        <>
          {/* Priority Meaning Table (PRD Page 11 Table) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveTab('High')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'High' 
                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500 ring-2 ring-rose-500/30' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 uppercase">
                  High Priority
                </span>
                <span className="text-xs font-extrabold text-slate-400">2 Items</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weak / Recently Missed</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Targeted lesson + questions to correct fundamental misunderstandings.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Medium')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'Medium' 
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/30' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 uppercase">
                  Medium Priority
                </span>
                <span className="text-xs font-extrabold text-slate-400">2 Items</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Needs Reinforcement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Flashcards + short quiz to shift concepts from working to long-term memory.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Low')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'Low' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/30' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 uppercase">
                  Low Priority
                </span>
                <span className="text-xs font-extrabold text-slate-400">1 Item</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Strong but Due</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quick recall session to keep knowledge fresh before final exams.
              </p>
            </div>
          </div>

          {/* Queue Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['All', 'High', 'Medium', 'Low'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab} {tab !== 'All' && `Priority`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
          </div>

          {/* Due-for-Review Queue List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : item.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.topic}
                  </h3>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {item.reason}
                  </div>

                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Action: {item.recommendedAction}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/student/explain-simply')}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                  >
                    Explain Simply
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(filteredItems.findIndex(x => x.id === item.id) || 0);
                      setSessionActive(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Revise Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Active SuperMemo-2 Spaced Repetition Card */
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-rose-500">
              Active Recall • Card {currentStep + 1} of {filteredItems.length}
            </span>
            <button 
              onClick={() => setSessionActive(false)} 
              className="font-bold hover:text-slate-700 dark:hover:text-white"
            >
              Exit Session
            </button>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-black">
                {filteredItems[currentStep]?.subject}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Streak: {filteredItems[currentStep]?.streak} days
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {filteredItems[currentStep]?.topic}
            </h2>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {filteredItems[currentStep]?.content}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Recall trigger: {filteredItems[currentStep]?.recommendedAction}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400">Rate your active recall difficulty:</div>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={handleNextCard} 
                className="p-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-extrabold rounded-xl transition-all"
              >
                Hard (1 Day Review)
              </button>
              <button 
                onClick={handleNextCard} 
                className="p-3 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold rounded-xl transition-all"
              >
                Good (3 Days Review)
              </button>
              <button 
                onClick={handleNextCard} 
                className="p-3 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold rounded-xl transition-all"
              >
                Easy (7 Days Review)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

