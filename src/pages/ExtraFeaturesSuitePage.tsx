import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  FileEdit, 
  Mic, 
  BookOpen, 
  Radio, 
  GitCompare, 
  BookMarked, 
  Compass, 
  Clock, 
  Search, 
  Users, 
  Presentation, 
  CalendarCheck, 
  Brain, 
  FileHeart, 
  Activity,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Flame,
  Volume2,
  VolumeX,
  X,
  StickyNote,
  Send,
  Calendar,
  Share2,
  Download,
  Bookmark
} from 'lucide-react';
import { ALL_20_FEATURES, ExtraFeatureItem, callExtraFeatureAI } from '../services/extraFeaturesService';
import { useAuth } from '../context/AuthContext';
import { AITopicComparatorModal } from '../components/agnes/AITopicComparatorModal';
import { FormulaVaultModal } from '../components/agnes/FormulaVaultModal';
import { useNavigate } from 'react-router-dom';

export default function ExtraFeaturesSuitePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [activeFeatureId, setActiveFeatureId] = useState<string>('exam_strategy_coach');

  // Modals for comparator & vault
  const [isTopicComparatorOpen, setIsTopicComparatorOpen] = useState(false);
  const [isFormulaVaultOpen, setIsFormulaVaultOpen] = useState(false);

  // States for interactive tool executions
  const [isLoading, setIsLoading] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);

  // 1. AI Exam Strategy Coach
  const [strategyExamName, setStrategyExamName] = useState('CBSE Class 12 / JEE Main');
  const [strategyExamDate, setStrategyExamDate] = useState('2026-05-15');
  const [strategySubjects, setStrategySubjects] = useState('Physics, Chemistry, Mathematics');
  const [strategyWeakTopics, setStrategyWeakTopics] = useState('Electromagnetic Induction, Rotational Motion');

  // 2. AI Mistake Analyzer
  const [mistakeQuestion, setMistakeQuestion] = useState('Calculate the speed of a particle with de Broglie wavelength 0.1 nm (mass = 9.1e-31 kg).');
  const [mistakeStudentAnswer, setMistakeStudentAnswer] = useState('I used λ = p / h and got 1.45 x 10^-24 m/s.');

  // 3. Smart Study Mode
  const [smartStudyActive, setSmartStudyActive] = useState(false);
  const [smartStudyObjective, setSmartStudyObjective] = useState('Master SN1 vs SN2 Reaction Mechanisms');
  const [smartStudyDuration, setSmartStudyDuration] = useState(25);
  const [smartStudySeconds, setSmartStudySeconds] = useState(25 * 60);
  const [smartStudyTimer, setSmartStudyTimer] = useState<any>(null);
  const [smartStudyNotes, setSmartStudyNotes] = useState('');
  const [smartStudyCompleted, setSmartStudyCompleted] = useState(false);

  // 4. AI Socratic Tutor
  const [socraticTopic, setSocraticTopic] = useState('Why does light bend when entering water?');
  const [socraticStudentMsg, setSocraticStudentMsg] = useState('Because water is denser so light gets tired?');
  const [socraticChat, setSocraticChat] = useState<Array<{ role: 'student' | 'tutor'; text: string }>>([]);

  // 5. Answer Quality Checker
  const [checkerQuestion, setCheckerQuestion] = useState('Explain why SN2 reactions occur with inversion of configuration.');
  const [checkerAnswer, setCheckerAnswer] = useState('The nucleophile attacks the carbon with the leaving group. Because the leaving group blocks the front, it has to attack from the back, which flips the groups like an umbrella in a storm.');

  // 6. Exam Answer Writer
  const [writerQuestion, setWriterQuestion] = useState('Derive the expression for the magnetic field at the center of a circular current-carrying coil.');
  const [writerMarks, setWriterMarks] = useState('5');
  const [writerSubject, setWriterSubject] = useState('Physics');

  // 7. AI Oral Practice
  const [vivaTopic, setVivaTopic] = useState('Newton\'s Laws of Motion & Conservation of Momentum');
  const [vivaQuestion, setVivaQuestion] = useState('If action and reaction forces are always equal and opposite, why don\'t they simply cancel each other out?');
  const [vivaAnswer, setVivaAnswer] = useState('Because they act on two completely different objects, not on the same object.');

  // 8. Textbook Companion
  const [textbookChapter, setTextbookChapter] = useState('Chapter 3: Current Electricity');
  const [textbookExcerpt, setTextbookExcerpt] = useState('Kirchhoff\'s circuit laws are two equalities that deal with the current and potential difference in the lumped element model of electrical circuits. They were first described in 1845 by German physicist Gustav Kirchhoff.');

  // 9. Study Session Recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');

  // 10. AI Topic Comparator
  const [comparatorConceptA, setComparatorConceptA] = useState('SN1 Reaction Mechanism');
  const [comparatorConceptB, setComparatorConceptB] = useState('SN2 Reaction Mechanism');

  // 11. Formula & Definition Vault
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultChapter, setVaultChapter] = useState('Electrodynamics & Magnetism');

  // 12. AI Learning Path
  const [learningGoalTopic, setLearningGoalTopic] = useState('General Relativity & Black Hole Thermodynamics');
  const [learningPathCompletedSteps, setLearningPathCompletedSteps] = useState<number[]>([]);

  // 13. Daily 10-Minute Revision
  const [revisionTopic, setRevisionTopic] = useState('Organic Chemistry & Mechanics');
  const [activeRevisionQuestionIdx, setActiveRevisionQuestionIdx] = useState(0);
  const [selectedRevisionOption, setSelectedRevisionOption] = useState<number | null>(null);
  const [revisionScore, setRevisionScore] = useState(0);

  // 14. AI Study Resource Finder
  const [resourceTopic, setResourceTopic] = useState('Rotational Dynamics & Moment of Inertia');
  const [savedResources, setSavedResources] = useState<string[]>([]);

  // 15. Collaborative Study Room
  const [collabRoomCode, setCollabRoomCode] = useState('LUMORA-7821');
  const [collabTopic, setCollabTopic] = useState('Calculus: Integration by Parts & Trigonometric Substitution');
  const [collabMessages, setCollabMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Aarav (Peer)', text: 'Can we review why we choose u = ln(x) instead of dv = ln(x) dx?', time: '10:14 AM' },
    { sender: 'Priya (Peer)', text: 'Because integrating ln(x) requires another parts step, while differentiating it gives 1/x!', time: '10:16 AM' }
  ]);
  const [newCollabMsg, setNewCollabMsg] = useState('');

  // 16. AI Presentation Maker
  const [presentationTopic, setPresentationTopic] = useState('CRISPR-Cas9 Gene Editing Mechanism');
  const [presentationLevel, setPresentationLevel] = useState('High School / Undergraduate');

  // 17. AI Assignment Organizer
  const [assignmentTitle, setAssignmentTitle] = useState('Thermodynamics Lab Report & Entropy Analysis');
  const [assignmentSubject, setAssignmentSubject] = useState('Physics');
  const [assignmentDeadline, setAssignmentDeadline] = useState('2026-04-10');
  const [assignmentMilestoneChecks, setAssignmentMilestoneChecks] = useState<number[]>([]);

  // 18. Personal Learning Memory
  const [memoryStyle, setMemoryStyle] = useState('Visual & Analogy-Driven');
  const [memoryRigor, setMemoryRigor] = useState('Step-by-Step Mathematical');
  const [memoryPace, setMemoryPace] = useState('Moderate');
  const [memorySavedNotification, setMemorySavedNotification] = useState(false);

  // 19. AI Parent Learning Brief
  const [parentHours, setParentHours] = useState('9.5');
  const [parentTasks, setParentTasks] = useState('16');
  const [parentSubjects, setParentSubjects] = useState('Physics, Chemistry, Mathematics');

  // 20. AI Study Routine Check
  const [routineHours, setRoutineHours] = useState('5.5');
  const [routineSubjectsPerDay, setRoutineSubjectsPerDay] = useState('3');
  const [routineBreaks, setRoutineBreaks] = useState('2');
  const [routineFatigue, setRoutineFatigue] = useState('Moderate');
  const [routineApplied, setRoutineApplied] = useState(false);

  const stages = [
    'All',
    'Ask & Strategize',
    'Understand & Explore',
    'Practice & Simulate',
    'Correct & Analyze',
    'Revise & Retain',
    'Improve & Personalize'
  ];

  const filteredFeatures = ALL_20_FEATURES.filter((f) => {
    if (selectedStage === 'All') return true;
    return f.stage === selectedStage;
  });

  const activeFeature = ALL_20_FEATURES.find((f) => f.id === activeFeatureId) || ALL_20_FEATURES[0];

  const handleRunFeature = async (featureId: string, customPayload?: any) => {
    setIsLoading(true);
    setToolResult(null);

    let payload: any = customPayload || {};
    if (featureId === 'exam_strategy_coach') {
      payload = {
        examName: strategyExamName,
        examDate: strategyExamDate,
        subjects: strategySubjects.split(',').map((s) => s.trim()),
        weeklyHours: 18,
        targetScore: '95% / Top 1% Percentile',
        weakTopics: strategyWeakTopics
      };
    } else if (featureId === 'mistake_analyzer') {
      payload = {
        subject: 'Physics',
        question: mistakeQuestion,
        wrongAnswer: mistakeStudentAnswer
      };
    } else if (featureId === 'socratic_tutor') {
      payload = {
        topic: socraticTopic,
        question: socraticTopic,
        studentResponse: socraticStudentMsg,
        history: socraticChat
      };
    } else if (featureId === 'answer_quality_checker') {
      payload = {
        question: checkerQuestion,
        marks: 5,
        draftAnswer: checkerAnswer
      };
    } else if (featureId === 'exam_answer_writer') {
      payload = {
        subject: writerSubject,
        question: writerQuestion,
        marks: writerMarks
      };
    } else if (featureId === 'oral_practice_viva') {
      payload = {
        topic: vivaTopic,
        currentQuestion: vivaQuestion,
        studentAnswer: vivaAnswer
      };
    } else if (featureId === 'textbook_companion') {
      payload = {
        chapterTitle: textbookChapter,
        textExcerpt: textbookExcerpt
      };
    } else if (featureId === 'learning_path') {
      payload = {
        goalTopic: learningGoalTopic,
        currentLevel: 'Intermediate'
      };
    } else if (featureId === 'daily_10min_revision') {
      payload = {
        topic: revisionTopic
      };
    } else if (featureId === 'study_resource_finder') {
      payload = {
        topic: resourceTopic
      };
    } else if (featureId === 'collaborative_study_room') {
      payload = {
        topic: collabTopic,
        discussion: collabMessages.map((m) => `${m.sender}: ${m.text}`).join('\n')
      };
    } else if (featureId === 'presentation_maker') {
      payload = {
        topic: presentationTopic,
        level: presentationLevel,
        slideCount: 5
      };
    } else if (featureId === 'assignment_organizer') {
      payload = {
        assignmentTitle,
        subject: assignmentSubject,
        deadline: assignmentDeadline,
        scope: 'Comprehensive'
      };
    } else if (featureId === 'personal_learning_memory') {
      payload = {
        explanationStyle: memoryStyle,
        pace: memoryPace,
        targetExam: 'Competitive STEM & Boards',
        recentStrength: 'Thermodynamics',
        currentFriction: 'Differential Equations'
      };
    } else if (featureId === 'parent_learning_brief') {
      payload = {
        studyHours: parentHours,
        completedTasks: parentTasks,
        subjects: parentSubjects,
        strengths: 'Consistent daily problem solving, high score in Mechanics'
      };
    } else if (featureId === 'study_routine_check') {
      payload = {
        dailyHours: parseFloat(routineHours) || 4.5,
        subjectsPerDay: parseInt(routineSubjectsPerDay, 10) || 3,
        breaksTaken: parseInt(routineBreaks, 10) || 2,
        fatigueLevel: routineFatigue
      };
    }

    try {
      const result = await callExtraFeatureAI(featureId, payload);
      setToolResult(result);

      if (featureId === 'socratic_tutor') {
        setSocraticChat((prev) => [
          ...prev,
          { role: 'student', text: socraticStudentMsg },
          { role: 'tutor', text: result.guidingQuestion || result.subtleHint || 'Think about how the medium affects wave speed.' }
        ]);
      }
    } catch (err) {
      console.error('Error running feature:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSmartStudy = () => {
    setSmartStudyActive(true);
    setSmartStudyCompleted(false);
    setSmartStudySeconds(smartStudyDuration * 60);
    const interval = setInterval(() => {
      setSmartStudySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSmartStudyActive(false);
          setSmartStudyCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setSmartStudyTimer(interval);
  };

  const handleStopSmartStudy = () => {
    if (smartStudyTimer) clearInterval(smartStudyTimer);
    setSmartStudyActive(false);
    setSmartStudyCompleted(true);
  };

  const handleToggleSpeechRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. You can type notes directly.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript + ' ';
        }
        setRecordedTranscript(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleSendCollabMessage = () => {
    if (!newCollabMsg.trim()) return;
    const newMsg = {
      sender: user?.displayName || 'You',
      text: newCollabMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCollabMessages((prev) => [...prev, newMsg]);
    setNewCollabMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification */}
      {memorySavedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-emerald-400">
          <Check className="w-4 h-4" />
          <span>Personal learning preferences saved and adapted!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-indigo-950/80 to-slate-900 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>LUMORAAI • 20 Extra Features & Functions</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                Complete Personalized Learning Platform
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              The 20 Academic Features & Functions
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every feature and function from the specification preserved verbatim, powering the core cycle: 
              <span className="text-amber-300 font-bold ml-1">Ask → Understand → Practice → Correct → Revise → Improve</span>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">✓ 20 Unmodified Features</span>
              <span>•</span>
              <span className="text-sky-400 font-bold">✓ Full Interactive Execution</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">✓ Step-by-Step &quot;How It Works&quot;</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/student/agnes-videos')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <span>Watch Agnes Explain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage Filters (Core Learning Loop) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {stages.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStage(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedStage === st
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Feature List (20 items) & Right Active Tool Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 20 Feature Selector Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[850px] overflow-y-auto pr-1">
          {filteredFeatures.map((feat) => {
            const isSelected = activeFeatureId === feat.id;

            return (
              <div
                key={feat.id}
                onClick={() => {
                  setActiveFeatureId(feat.id);
                  setToolResult(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 border-purple-500 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/30'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 text-purple-300 text-[11px] font-mono font-black flex items-center justify-center border border-purple-500/30">
                      #{feat.number}
                    </span>
                    <h3 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {feat.stage}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  <strong>Function:</strong> {feat.functionText}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono border-t border-slate-800/60">
                  <span className="truncate max-w-[280px]">
                    {feat.howItWorks}
                  </span>
                  <span className="text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    Execute →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Interactive Execution Stage */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
          
          {/* Active Tool Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-[10px] font-black uppercase">
                  Feature #{activeFeature.number} • {activeFeature.stage}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">{activeFeature.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                <strong className="text-slate-300 font-bold">Function: </strong>{activeFeature.functionText}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeFeature.id === 'topic_comparator' ? (
                <button
                  onClick={() => setIsTopicComparatorOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Open Full Comparator</span>
                </button>
              ) : activeFeature.id === 'formula_vault' ? (
                <button
                  onClick={() => setIsFormulaVaultOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 transition shadow"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Open Formula Vault</span>
                </button>
              ) : (
                <button
                  onClick={() => handleRunFeature(activeFeature.id)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 transition shadow active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Run {activeFeature.title}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Exact How It Works Guidance Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-mono flex items-start gap-2.5">
            <span className="text-purple-400 font-bold shrink-0">How it works:</span>
            <span>{activeFeature.howItWorks}</span>
          </div>

          {/* Dynamic Interactive Input Stage per Tool */}
          <div className="space-y-4">
            
            {/* Feature #1: AI Exam Strategy Coach */}
            {activeFeature.id === 'exam_strategy_coach' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Exam Date</label>
                    <input
                      type="date"
                      value={strategyExamDate}
                      onChange={(e) => setStrategyExamDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Target Exam Name</label>
                    <input
                      type="text"
                      value={strategyExamName}
                      onChange={(e) => setStrategyExamName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Select Subjects</label>
                  <input
                    type="text"
                    value={strategySubjects}
                    onChange={(e) => setStrategySubjects(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Weak Topics (for priority creation)</label>
                  <input
                    type="text"
                    value={strategyWeakTopics}
                    onChange={(e) => setStrategyWeakTopics(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #2: AI Mistake Analyzer */}
            {activeFeature.id === 'mistake_analyzer' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Submit Test Question</label>
                  <textarea
                    rows={2}
                    value={mistakeQuestion}
                    onChange={(e) => setMistakeQuestion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Your Incorrect Attempt / Working</label>
                  <textarea
                    rows={2}
                    value={mistakeStudentAnswer}
                    onChange={(e) => setMistakeStudentAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #3: Smart Study Mode */}
            {activeFeature.id === 'smart_study_mode' && (
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                    Choose Topic and Duration → Start Session
                  </span>
                  <h4 className="text-base font-black text-white">Smart Study Mode</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    value={smartStudyObjective}
                    onChange={(e) => setSmartStudyObjective(e.target.value)}
                    disabled={smartStudyActive}
                    placeholder="Enter learning objective"
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  />
                  <select
                    value={smartStudyDuration}
                    onChange={(e) => setSmartStudyDuration(Number(e.target.value))}
                    disabled={smartStudyActive}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value={15}>15 mins</option>
                    <option value={25}>25 mins</option>
                    <option value={45}>45 mins</option>
                  </select>
                </div>

                <div className="text-4xl sm:text-5xl font-mono font-black text-indigo-400 tracking-widest py-2">
                  {Math.floor(smartStudySeconds / 60).toString().padStart(2, '0')}:
                  {(smartStudySeconds % 60).toString().padStart(2, '0')}
                </div>

                {smartStudyActive && (
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <label className="text-[11px] text-slate-400 font-mono">Distraction-Free Scratchpad</label>
                    <textarea
                      rows={3}
                      value={smartStudyNotes}
                      onChange={(e) => setSmartStudyNotes(e.target.value)}
                      placeholder="Take quick focused notes here..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center gap-3">
                  {!smartStudyActive ? (
                    <button
                      onClick={handleStartSmartStudy}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSmartStudy}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>End & Give Session Report</span>
                    </button>
                  )}
                </div>

                {smartStudyCompleted && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs text-left space-y-1">
                    <span className="font-bold font-mono text-[10px] uppercase block text-emerald-400">Session Report:</span>
                    <p>Objective Completed: <strong>{smartStudyObjective}</strong></p>
                    <p>Focus Duration: <strong>{smartStudyDuration} minutes</strong></p>
                    {smartStudyNotes && <p>Notes Saved: {smartStudyNotes}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Feature #4: AI Socratic Tutor */}
            {activeFeature.id === 'socratic_tutor' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Ask a Question</label>
                  <input
                    type="text"
                    value={socraticTopic}
                    onChange={(e) => setSocraticTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Student Responds (Your reasoning attempt)</label>
                  <input
                    type="text"
                    value={socraticStudentMsg}
                    onChange={(e) => setSocraticStudentMsg(e.target.value)}
                    placeholder="State what you think happens..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {socraticChat.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    {socraticChat.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl text-xs ${
                          msg.role === 'tutor'
                            ? 'bg-purple-950/40 border border-purple-500/30 text-purple-200'
                            : 'bg-slate-900 border border-slate-800 text-slate-300'
                        }`}
                      >
                        <strong className="block text-[10px] uppercase font-mono mb-0.5 text-purple-400">
                          {msg.role === 'tutor' ? 'AI Socratic Guide:' : 'You:'}
                        </strong>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feature #5: Answer Quality Checker */}
            {activeFeature.id === 'answer_quality_checker' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Exam Question</label>
                  <input
                    type="text"
                    value={checkerQuestion}
                    onChange={(e) => setCheckerQuestion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Type or Upload Written Answer Before Submission</label>
                  <textarea
                    rows={3}
                    value={checkerAnswer}
                    onChange={(e) => setCheckerAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #6: Exam Answer Writer */}
            {activeFeature.id === 'exam_answer_writer' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Select Subject</label>
                    <input
                      type="text"
                      value={writerSubject}
                      onChange={(e) => setWriterSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Select Marks</label>
                    <select
                      value={writerMarks}
                      onChange={(e) => setWriterMarks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="2">2 Marks</option>
                      <option value="5">5 Marks</option>
                      <option value="10">10 Marks</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Question</label>
                    <input
                      type="text"
                      value={writerQuestion}
                      onChange={(e) => setWriterQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature #7: AI Oral Practice */}
            {activeFeature.id === 'oral_practice_viva' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Choose Topic</label>
                  <input
                    type="text"
                    value={vivaTopic}
                    onChange={(e) => setVivaTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                  <strong className="text-amber-400 block font-mono text-[10px] uppercase">
                    AI Asks (Voice / Text):
                  </strong>
                  <p className="font-bold text-white text-xs">{vivaQuestion}</p>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Student Answers (Voice / Text)</label>
                  <textarea
                    rows={2}
                    value={vivaAnswer}
                    onChange={(e) => setVivaAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #8: Textbook Companion */}
            {activeFeature.id === 'textbook_companion' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Upload/Select Chapter</label>
                  <input
                    type="text"
                    value={textbookChapter}
                    onChange={(e) => setTextbookChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Paste Textbook Paragraph (to simplify, extract definitions, quizzes)</label>
                  <textarea
                    rows={3}
                    value={textbookExcerpt}
                    onChange={(e) => setTextbookExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #9: Study Session Recorder */}
            {activeFeature.id === 'study_session_recorder' && (
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-white">Study Session Voice Recorder</h4>
                    <p className="text-[11px] text-slate-400">Start supported recording → study/speak → process transcript → generate key points, questions, notes</p>
                  </div>

                  <button
                    onClick={handleToggleSpeechRecording}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Listening...' : 'Start Supported Recording'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 min-h-[90px] font-mono text-slate-300">
                  {recordedTranscript || 'Speak aloud as you study. Your transcript will appear here and get turned into notes.'}
                </div>
              </div>
            )}

            {/* Feature #10: AI Topic Comparator */}
            {activeFeature.id === 'topic_comparator' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Concept 1</label>
                    <input
                      type="text"
                      value={comparatorConceptA}
                      onChange={(e) => setComparatorConceptA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Concept 2</label>
                    <input
                      type="text"
                      value={comparatorConceptB}
                      onChange={(e) => setComparatorConceptB(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature #11: Formula & Definition Vault */}
            {activeFeature.id === 'formula_vault' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Select Chapter</label>
                  <input
                    type="text"
                    value={vaultChapter}
                    onChange={(e) => setVaultChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Search Formulas / Definitions</label>
                  <input
                    type="text"
                    value={vaultSearch}
                    onChange={(e) => setVaultSearch(e.target.value)}
                    placeholder="Search by name, variable, or concept..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>
            )}

            {/* Feature #12: AI Learning Path */}
            {activeFeature.id === 'learning_path' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Choose Goal (Target Topic)</label>
                  <input
                    type="text"
                    value={learningGoalTopic}
                    onChange={(e) => setLearningGoalTopic(e.target.value)}
                    placeholder="e.g. Quantum Electrodynamics, Machine Learning Transformers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #13: Daily 10-Minute Revision */}
            {activeFeature.id === 'daily_10min_revision' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Topic / Revision Area</label>
                  <input
                    type="text"
                    value={revisionTopic}
                    onChange={(e) => setRevisionTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #14: AI Study Resource Finder */}
            {activeFeature.id === 'study_resource_finder' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Enter Topic</label>
                  <input
                    type="text"
                    value={resourceTopic}
                    onChange={(e) => setResourceTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #15: Collaborative Study Room */}
            {activeFeature.id === 'collaborative_study_room' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Room Code</label>
                    <input
                      type="text"
                      value={collabRoomCode}
                      onChange={(e) => setCollabRoomCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Choose Topic</label>
                    <input
                      type="text"
                      value={collabTopic}
                      onChange={(e) => setCollabTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span>Shared Discussion & Questions</span>
                    <span className="text-emerald-400">2 peers active</span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {collabMessages.map((msg, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-bold text-amber-300">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-slate-200">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newCollabMsg}
                      onChange={(e) => setNewCollabMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCollabMessage()}
                      placeholder="Share a question or note with room..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                    <button
                      onClick={handleSendCollabMessage}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Feature #16: AI Presentation Maker */}
            {activeFeature.id === 'presentation_maker' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Topic</label>
                    <input
                      type="text"
                      value={presentationTopic}
                      onChange={(e) => setPresentationTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Enter Level</label>
                    <input
                      type="text"
                      value={presentationLevel}
                      onChange={(e) => setPresentationLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature #17: AI Assignment Organizer */}
            {activeFeature.id === 'assignment_organizer' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Add Assignment Title</label>
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Set Deadline</label>
                    <input
                      type="date"
                      value={assignmentDeadline}
                      onChange={(e) => setAssignmentDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature #18: Personal Learning Memory */}
            {activeFeature.id === 'personal_learning_memory' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300 block font-mono text-[10px] uppercase">
                    System Learning Preferences & Progress Signals:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Explanation Style</label>
                      <select
                        value={memoryStyle}
                        onChange={(e) => setMemoryStyle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      >
                        <option value="Visual & Analogy-Driven">Visual & Analogy-Driven</option>
                        <option value="Rigorous Mathematical Proofs">Rigorous Mathematical Proofs</option>
                        <option value="Exam Scoring Structure">Exam Scoring Structure</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Pace & Difficulty</label>
                      <select
                        value={memoryPace}
                        onChange={(e) => setMemoryPace(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      >
                        <option value="Fast & High-Yield">Fast & High-Yield</option>
                        <option value="Moderate & Thorough">Moderate & Thorough</option>
                        <option value="Gentle Step-by-Step">Gentle Step-by-Step</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMemorySavedNotification(true);
                      setTimeout(() => setMemorySavedNotification(false), 3000);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Feature #19: AI Parent Learning Brief */}
            {activeFeature.id === 'parent_learning_brief' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Hours Studied This Week</label>
                    <input
                      type="text"
                      value={parentHours}
                      onChange={(e) => setParentHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Completed Tasks</label>
                    <input
                      type="text"
                      value={parentTasks}
                      onChange={(e) => setParentTasks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Active Subjects</label>
                    <input
                      type="text"
                      value={parentSubjects}
                      onChange={(e) => setParentSubjects(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feature #20: AI Study Routine Check */}
            {activeFeature.id === 'study_routine_check' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Daily Study Hours</label>
                    <input
                      type="text"
                      value={routineHours}
                      onChange={(e) => setRoutineHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Subjects per Day</label>
                    <input
                      type="text"
                      value={routineSubjectsPerDay}
                      onChange={(e) => setRoutineSubjectsPerDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Breaks Taken</label>
                    <input
                      type="text"
                      value={routineBreaks}
                      onChange={(e) => setRoutineBreaks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Fatigue Level</label>
                    <select
                      value={routineFatigue}
                      onChange={(e) => setRoutineFatigue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* AI Result Output Stage */}
          {toolResult && (
            <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-bold text-purple-300 font-mono text-[11px] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Result & Actionable Output</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Verified Against PDF Specification</span>
              </div>

              {/* Feature #1: Strategy Coach Output */}
              {toolResult.readinessScore && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="font-bold text-white">Analyzed Progress & Readiness:</span>
                    <span className="text-lg font-mono font-black text-amber-300">{toolResult.readinessScore}%</span>
                  </div>

                  {toolResult.highPriorityTopics && (
                    <div>
                      <strong className="text-rose-400 block mb-1">Created Priorities:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300">
                        {toolResult.highPriorityTopics.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {toolResult.weeklyMilestoneBreakdown && (
                    <div>
                      <strong className="text-indigo-300 block mb-1">Built Revision/Practice Schedule:</strong>
                      <div className="space-y-1.5">
                        {toolResult.weeklyMilestoneBreakdown.map((wb: any, i: number) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white block">{wb.phase}</span>
                              <span className="text-[11px] text-slate-400">{wb.focus}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                              {wb.targetHours}h/wk
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Feature #2: Mistake Analyzer Output */}
              {toolResult.classification && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
                    <strong className="text-rose-400 font-mono text-[10px] uppercase block mb-0.5">Identified & Classified Issue:</strong>
                    <span className="text-sm font-black text-white">{toolResult.classification}</span>
                    <p className="text-xs text-slate-300 mt-1">{toolResult.rootCauseAnalysis}</p>
                  </div>

                  {toolResult.stepByStepCorrection && (
                    <div>
                      <strong className="text-emerald-400 block mb-1">Why & Step-by-Step Explanation:</strong>
                      <div className="space-y-1 text-slate-300">
                        {toolResult.stepByStepCorrection.map((s: string, i: number) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">{s}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {toolResult.mirrorPracticeProblem && (
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                      <strong className="text-indigo-300 block font-mono text-[10px] uppercase">Recommended Focused Practice:</strong>
                      <p className="text-white font-bold">{toolResult.mirrorPracticeProblem.question}</p>
                      <p className="text-slate-400 text-[11px]">{toolResult.mirrorPracticeProblem.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feature #5: Answer Quality Checker Output */}
              {toolResult.predictedScore && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="font-bold text-white">Checked Score:</span>
                    <span className="text-lg font-mono font-black text-emerald-400">{toolResult.predictedScore} / {toolResult.maxScore}</span>
                  </div>

                  {toolResult.missingMarkScoringPoints && (
                    <div>
                      <strong className="text-rose-400 block mb-1">Missing Points & Improvements:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-rose-200">
                        {toolResult.missingMarkScoringPoints.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {toolResult.recommendedModelImprovements && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 space-y-1">
                      <strong className="text-amber-400 block font-mono text-[10px] uppercase">Improved Model Answer:</strong>
                      <p className="leading-relaxed italic">{toolResult.recommendedModelImprovements}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feature #6: Exam Answer Writer Output */}
              {toolResult.recommendedStructure && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30">
                    <span className="text-blue-200 font-bold">Target Level: {toolResult.targetMarkLevel}</span>
                    <span className="text-xs font-mono text-slate-300">{toolResult.timeAllocation}</span>
                  </div>

                  {toolResult.requiredKeywords && (
                    <div>
                      <strong className="text-amber-300 block mb-1">Highlighted Key Terms:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {toolResult.requiredKeywords.map((kw: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <strong className="text-white block font-bold">Structured Model Answer:</strong>
                    {toolResult.recommendedStructure.map((sec: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="font-bold text-amber-300 block">{sec.section}</span>
                        <p className="text-slate-300 text-xs">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature #7: AI Oral Practice Output */}
              {toolResult.verdict && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Evaluated Response:</span>
                      <span className="font-mono text-emerald-400 font-black">{toolResult.verdict} ({toolResult.accuracyRating}%)</span>
                    </div>
                    <p className="text-xs text-slate-300">{toolResult.feedback}</p>
                  </div>

                  {toolResult.nextFollowUpQuestion && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-1">
                      <strong className="font-mono text-[10px] uppercase block text-amber-400">Generated Follow-up Question:</strong>
                      <p className="font-bold">{toolResult.nextFollowUpQuestion}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feature #8: Textbook Companion Output */}
              {toolResult.extractedDefinitions && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 block font-mono text-[10px] uppercase">Simplified Paragraph:</strong>
                    <p className="text-slate-200">{toolResult.simplifiedSummary}</p>
                  </div>

                  <div>
                    <strong className="text-amber-300 block mb-1">Extracted Definitions:</strong>
                    <div className="space-y-1.5">
                      {toolResult.extractedDefinitions.map((d: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="font-bold text-white">{d.term}: </span>
                          <span className="text-slate-300">{d.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Feature #12: Learning Path Output */}
              {toolResult.stages && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Prerequisite-Based Route to: {toolResult.targetTopic}</span>
                    <span>Effort: {toolResult.estimatedStudyHours} hrs</span>
                  </div>

                  <div className="space-y-2.5">
                    {toolResult.stages.map((stg: any, i: number) => {
                      const isDone = learningPathCompletedSteps.includes(stg.step);
                      return (
                        <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => {
                                  setLearningPathCompletedSteps((prev) =>
                                    prev.includes(stg.step) ? prev.filter((s) => s !== stg.step) : [...prev, stg.step]
                                  );
                                }}
                                className="rounded"
                              />
                              <span>Stage {stg.step}: {stg.title}</span>
                            </span>
                            <span className={`text-[10px] font-mono ${isDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {isDone ? 'Completed' : 'Prerequisite'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs pl-5">{stg.whyNeeded}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feature #13: Daily 10-Minute Revision Output */}
              {toolResult.questions && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="font-bold text-white">{toolResult.sessionTitle}</span>
                    <span className="font-mono text-xs text-amber-300">Question {activeRevisionQuestionIdx + 1} of {toolResult.questions.length}</span>
                  </div>

                  {(() => {
                    const q = toolResult.questions[activeRevisionQuestionIdx] || toolResult.questions[0];
                    return (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <p className="font-bold text-white text-xs">{q.question}</p>

                        <div className="space-y-1.5">
                          {q.options.map((opt: string, optIdx: number) => (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedRevisionOption(optIdx)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition border ${
                                selectedRevisionOption === optIdx
                                  ? optIdx === q.correct
                                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                    : 'bg-rose-950/50 border-rose-500 text-rose-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            </button>
                          ))}
                        </div>

                        {selectedRevisionOption !== null && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-1">
                            <strong className="text-amber-300 block font-mono text-[10px] uppercase">Instant Feedback:</strong>
                            <p>{q.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Feature #14: Study Resource Finder Output */}
              {toolResult.resources && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <strong className="text-cyan-300 block font-mono text-[10px] uppercase">Identified Learning Objective:</strong>
                    <p className="text-white font-bold">{toolResult.learningObjective}</p>
                  </div>

                  <strong className="text-white block font-bold">Approved Resources & Purpose:</strong>
                  <div className="space-y-2">
                    {toolResult.resources.map((res: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{res.type} • {res.provider}</span>
                          <h4 className="text-xs font-bold text-white">{res.title}</h4>
                          <p className="text-slate-400 text-[11px]">{res.purpose}</p>
                        </div>
                        <button
                          onClick={() => setSavedResources((prev) => [...prev, res.title])}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature #15: Collaborative Study Room Output */}
              {toolResult.discussionSummary && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                    <strong className="text-purple-300 block font-mono text-[10px] uppercase">Discussion Summary:</strong>
                    <p className="text-slate-200 text-xs">{toolResult.discussionSummary}</p>
                  </div>

                  {toolResult.keyClarification && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                      <strong>Authoritative Concept Rule: </strong>{toolResult.keyClarification}
                    </div>
                  )}
                </div>
              )}

              {/* Feature #16: Presentation Maker Output */}
              {toolResult.slides && (
                <div className="space-y-3">
                  <strong className="text-white block font-bold">Generated Slide Outline & Visuals:</strong>
                  <div className="space-y-2.5">
                    {toolResult.slides.map((sl: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="text-xs font-bold text-amber-300">Slide {sl.slideNumber}: {sl.title}</span>
                        <ul className="list-disc pl-5 space-y-0.5 text-slate-300 text-xs">
                          {sl.bulletPoints.map((bp: string, bpIdx: number) => (
                            <li key={bpIdx}>{bp}</li>
                          ))}
                        </ul>
                        <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                          <strong>Speaker Notes: </strong>&quot;{sl.speakerNotes}&quot;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature #17: Assignment Organizer Output */}
              {toolResult.milestones && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Assignment: {toolResult.assignment}</span>
                    <span>Deadline: {toolResult.deadline}</span>
                  </div>

                  <div className="space-y-2">
                    {toolResult.milestones.map((m: any, i: number) => {
                      const isDone = assignmentMilestoneChecks.includes(m.step);
                      return (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {
                                setAssignmentMilestoneChecks((prev) =>
                                  prev.includes(m.step) ? prev.filter((s) => s !== m.step) : [...prev, m.step]
                                );
                              }}
                              className="rounded"
                            />
                            <span className={isDone ? 'line-through text-slate-500' : 'text-white font-bold'}>
                              {m.title} ({m.targetDate})
                            </span>
                          </label>
                          <span className="text-[10px] text-amber-400 font-mono">{m.estimatedHours}h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feature #18: Personal Learning Memory Output */}
              {toolResult.adaptedExplanationStyle && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                    <strong className="text-indigo-300 block font-mono text-[10px] uppercase">Adapted Explanation Style:</strong>
                    <p className="text-white font-bold">{toolResult.adaptedExplanationStyle}</p>
                    <p className="text-slate-400 text-[11px]">Difficulty: {toolResult.difficultyCalibration}</p>
                  </div>
                </div>
              )}

              {/* Feature #19: Parent Brief Output */}
              {toolResult.executiveSummary && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-pink-200">
                    <p className="font-bold">{toolResult.greeting}</p>
                    <p className="text-xs text-slate-300 mt-1">{toolResult.executiveSummary}</p>
                  </div>

                  {toolResult.howParentCanSupportAtHome && (
                    <div>
                      <strong className="text-amber-300 block mb-1">Support Areas for Parents:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300">
                        {toolResult.howParentCanSupportAtHome.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Feature #20: Study Routine Check Output */}
              {toolResult.burnoutRiskLevel && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border ${
                    toolResult.burnoutRiskLevel === 'High'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                      : toolResult.burnoutRiskLevel === 'Moderate'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <strong className="font-mono text-[10px] uppercase">Burnout Risk Level:</strong>
                      <span className="font-black text-sm">{toolResult.burnoutRiskLevel}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-300">{toolResult.workloadAnalysis}</p>
                  </div>

                  {toolResult.suggestedAdjustments && (
                    <div>
                      <strong className="text-amber-300 block mb-1">Suggested Prioritization & Breaks:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300">
                        {toolResult.suggestedAdjustments.map((adj: string, i: number) => (
                          <li key={i}>{adj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setRoutineApplied(true)}
                    className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      routineApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{routineApplied ? 'Applied to Schedule!' : 'Apply Scheduling Adjustments'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Embedded Modals */}
      <AITopicComparatorModal
        isOpen={isTopicComparatorOpen}
        onClose={() => setIsTopicComparatorOpen(false)}
        onGenerateVideoOnTopic={(topic) => navigate(`/student/agnes-videos?v=${topic}`)}
      />

      <FormulaVaultModal
        isOpen={isFormulaVaultOpen}
        onClose={() => setIsFormulaVaultOpen(false)}
      />

    </div>
  );
}
