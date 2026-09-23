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
  StickyNote
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
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>('exam_strategy_coach');

  // Modals for comparator & vault
  const [isTopicComparatorOpen, setIsTopicComparatorOpen] = useState(false);
  const [isFormulaVaultOpen, setIsFormulaVaultOpen] = useState(false);

  // States for interactive tool executions
  const [isLoading, setIsLoading] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);

  // Form states for various tools
  const [strategyExamName, setStrategyExamName] = useState('CBSE Class 12 / JEE Main');
  const [strategyExamDate, setStrategyExamDate] = useState('2026-05-15');
  const [strategySubjects, setStrategySubjects] = useState('Physics, Chemistry, Mathematics');
  const [strategyWeakTopics, setStrategyWeakTopics] = useState('Electromagnetic Induction, Rotational Motion');

  const [mistakeQuestion, setMistakeQuestion] = useState('Calculate the speed of a particle with de Broglie wavelength 0.1 nm (mass = 9.1e-31 kg).');
  const [mistakeStudentAnswer, setMistakeStudentAnswer] = useState('I used λ = p / h and got 1.45 x 10^-24 m/s.');

  const [socraticTopic, setSocraticTopic] = useState('Why does light bend when entering water?');
  const [socraticStudentMsg, setSocraticStudentMsg] = useState('Because water is denser so light gets tired?');
  const [socraticChat, setSocraticChat] = useState<Array<{ role: 'student' | 'tutor'; text: string }>>([]);

  const [checkerQuestion, setCheckerQuestion] = useState('Explain why SN2 reactions occur with inversion of configuration.');
  const [checkerAnswer, setCheckerAnswer] = useState('The nucleophile attacks the carbon with the leaving group. Because the leaving group blocks the front, it has to attack from the back, which flips the groups like an umbrella in a storm.');

  const [writerQuestion, setWriterQuestion] = useState('Derive the expression for the magnetic field at the center of a circular current-carrying coil.');
  const [writerMarks, setWriterMarks] = useState('5');

  const [vivaTopic, setVivaTopic] = useState('Newton\'s Laws of Motion & Conservation of Momentum');
  const [vivaQuestion, setVivaQuestion] = useState('If action and reaction forces are always equal and opposite, why don\'t they simply cancel each other out?');
  const [vivaAnswer, setVivaAnswer] = useState('Because they act on two completely different objects, not on the same object.');

  const [learningGoalTopic, setLearningGoalTopic] = useState('General Relativity & Black Hole Thermodynamics');
  const [textbookExcerpt, setTextbookExcerpt] = useState('Kirchhoff\'s circuit laws are two equalities that deal with the current and potential difference in the lumped element model of electrical circuits. They were first described in 1845 by German physicist Gustav Kirchhoff.');
  const [presentationTopic, setPresentationTopic] = useState('CRISPR-Cas9 Gene Editing Mechanism');

  // Smart Study Mode state
  const [smartStudyActive, setSmartStudyActive] = useState(false);
  const [smartStudyObjective, setSmartStudyObjective] = useState('Master SN1 vs SN2 Reaction Mechanisms');
  const [smartStudySeconds, setSmartStudySeconds] = useState(25 * 60);
  const [smartStudyTimer, setSmartStudyTimer] = useState<any>(null);

  // Audio recording state for Study Session Recorder (#9)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');

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
        subject: 'Physics',
        question: writerQuestion,
        marks: writerMarks
      };
    } else if (featureId === 'oral_practice_viva') {
      payload = {
        topic: vivaTopic,
        currentQuestion: vivaQuestion,
        studentAnswer: vivaAnswer
      };
    } else if (featureId === 'learning_path') {
      payload = {
        goalTopic: learningGoalTopic,
        currentLevel: 'Intermediate'
      };
    } else if (featureId === 'textbook_companion') {
      payload = {
        chapterTitle: 'Electric Circuits & Kirchhoff Laws',
        textExcerpt: textbookExcerpt
      };
    } else if (featureId === 'presentation_maker') {
      payload = {
        topic: presentationTopic,
        level: 'High School / Undergraduate',
        slideCount: 5
      };
    } else if (featureId === 'parent_learning_brief') {
      payload = {
        studyHours: '10.5',
        completedTasks: 18,
        subjects: 'Physics, Chemistry, Math',
        strengths: 'Consistent daily problem solving, high score in Mechanics'
      };
    } else if (featureId === 'study_routine_check') {
      payload = {
        dailyHours: 4.5,
        subjectsPerDay: 3,
        breaksTaken: 2,
        fatigueLevel: 'Moderate'
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
    setSmartStudySeconds(25 * 60);
    const interval = setInterval(() => {
      setSmartStudySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSmartStudyActive(false);
          alert(`🎯 Smart Study session complete for: ${smartStudyObjective}! Great focus.`);
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
  };

  const handleToggleSpeechRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. You can type in the notes box.');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-indigo-950/80 to-slate-900 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>LumoraAI • 20 Extra Features & Functions</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                Complete Personalized Learning Platform
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              The 20 Academic Powerhouses of LumoraAI
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every tool engineered to power the non-negotiable core learning cycle: 
              <span className="text-amber-300 font-bold ml-1">Ask → Understand → Practice → Correct → Revise → Improve</span>. 
              Select any of the 20 features below to launch and run it directly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">✓ 20 Active AI Modules</span>
              <span>•</span>
              <span className="text-sky-400 font-bold">✓ Google Keep Connected</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">✓ Dr. Agnes Pedagogical Integration</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/student/agnes-videos')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <span>Agnes Video AI</span>
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
                    Launch →
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
                {activeFeature.functionText}
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

          {/* How It Works Guidance Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-mono flex items-start gap-2.5">
            <span className="text-purple-400 font-bold shrink-0">How it works:</span>
            <span>{activeFeature.howItWorks}</span>
          </div>

          {/* Dynamic Interactive Input Stage per Tool */}
          <div className="space-y-4">
            
            {/* Feature #1: Exam Strategy Coach */}
            {activeFeature.id === 'exam_strategy_coach' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Target Exam Name</label>
                    <input
                      type="text"
                      value={strategyExamName}
                      onChange={(e) => setStrategyExamName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Exam Date</label>
                    <input
                      type="date"
                      value={strategyExamDate}
                      onChange={(e) => setStrategyExamDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Target Subjects</label>
                  <input
                    type="text"
                    value={strategySubjects}
                    onChange={(e) => setStrategySubjects(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Self-Assessed Weak Topics</label>
                  <input
                    type="text"
                    value={strategyWeakTopics}
                    onChange={(e) => setStrategyWeakTopics(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Feature #2: Mistake Analyzer */}
            {activeFeature.id === 'mistake_analyzer' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Question / Problem You Got Wrong</label>
                  <textarea
                    rows={2}
                    value={mistakeQuestion}
                    onChange={(e) => setMistakeQuestion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Your Incorrect Attempt / Calculation</label>
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
                    Distraction-Free Objective Session
                  </span>
                  <h4 className="text-base font-black text-white">Smart Study Objective</h4>
                </div>

                <input
                  type="text"
                  value={smartStudyObjective}
                  onChange={(e) => setSmartStudyObjective(e.target.value)}
                  disabled={smartStudyActive}
                  className="w-full max-w-md mx-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                />

                <div className="text-4xl sm:text-5xl font-mono font-black text-indigo-400 tracking-widest py-2">
                  {Math.floor(smartStudySeconds / 60).toString().padStart(2, '0')}:
                  {(smartStudySeconds % 60).toString().padStart(2, '0')}
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!smartStudyActive ? (
                    <button
                      onClick={handleStartSmartStudy}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 transition"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Focused Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSmartStudy}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>End Session & Generate Report</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Feature #4: Socratic Tutor */}
            {activeFeature.id === 'socratic_tutor' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Concept or Doubt You Want Guided Through</label>
                  <input
                    type="text"
                    value={socraticTopic}
                    onChange={(e) => setSocraticTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Your Reasoning / Attempt So Far</label>
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
                          {msg.role === 'tutor' ? 'Dr. Agnes (Socratic Guide):' : 'You:'}
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
                  <label className="text-slate-400 font-bold block mb-1">Your Written Draft Answer</label>
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
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-slate-400 font-bold block mb-1">Subject Question</label>
                    <input
                      type="text"
                      value={writerQuestion}
                      onChange={(e) => setWriterQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="w-28 shrink-0">
                    <label className="text-slate-400 font-bold block mb-1">Target Marks</label>
                    <select
                      value={writerMarks}
                      onChange={(e) => setWriterMarks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="2">2 Marks</option>
                      <option value="5">5 Marks</option>
                      <option value="10">10 Marks</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Feature #7: AI Oral Practice (Viva) */}
            {activeFeature.id === 'oral_practice_viva' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Viva Topic & Chapter</label>
                  <input
                    type="text"
                    value={vivaTopic}
                    onChange={(e) => setVivaTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
                  <strong className="text-amber-400 block font-mono text-[10px] uppercase">
                    Examiner Viva Question:
                  </strong>
                  <p className="font-bold text-white text-xs">{vivaQuestion}</p>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Your Spoken / Typed Viva Answer</label>
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
                  <label className="text-slate-400 font-bold block mb-1">Paste Dense Textbook Paragraph</label>
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
                    <h4 className="font-black text-white">Speech-to-Study Notes Recorder</h4>
                    <p className="text-[11px] text-slate-400">Speak your thoughts aloud while studying to auto-generate structured notes</p>
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
                    <span>{isRecording ? 'Listening...' : 'Start Recording Voice'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 min-h-[90px] font-mono text-slate-300">
                  {recordedTranscript || 'Tap "Start Recording Voice" and speak aloud about any concept...'}
                </div>
              </div>
            )}

            {/* Feature #12: Learning Path */}
            {activeFeature.id === 'learning_path' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Target Mastery Goal Topic</label>
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

            {/* Feature #16: Presentation Maker */}
            {activeFeature.id === 'presentation_maker' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Presentation Subject / Presentation Topic</label>
                  <input
                    type="text"
                    value={presentationTopic}
                    onChange={(e) => setPresentationTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
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
                  <span>AI Analysis & Strategic Output</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Ready & Actionable</span>
              </div>

              {/* Formatted Display based on returned payload structure */}
              {toolResult.readinessScore && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
                    <span className="font-bold text-white">Current Exam Readiness Index:</span>
                    <span className="text-lg font-mono font-black text-amber-300">{toolResult.readinessScore}%</span>
                  </div>

                  {toolResult.highPriorityTopics && (
                    <div>
                      <strong className="text-rose-400 block mb-1">High-Priority Priority Topics:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300">
                        {toolResult.highPriorityTopics.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {toolResult.scoreBoosterAdvice && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                      <strong>Score Booster: </strong>{toolResult.scoreBoosterAdvice}
                    </div>
                  )}
                </div>
              )}

              {toolResult.classification && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
                    <strong className="text-rose-400 font-mono text-[10px] uppercase block mb-0.5">Diagnosed Mistake Classification:</strong>
                    <span className="text-sm font-black text-white">{toolResult.classification}</span>
                    <p className="text-xs text-slate-300 mt-1">{toolResult.rootCauseAnalysis}</p>
                  </div>

                  {toolResult.stepByStepCorrection && (
                    <div>
                      <strong className="text-emerald-400 block mb-1">Step-by-Step Mathematical Remedy:</strong>
                      <div className="space-y-1 text-slate-300">
                        {toolResult.stepByStepCorrection.map((s: string, i: number) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">{s}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {toolResult.mirrorPracticeProblem && (
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                      <strong className="text-indigo-300 block font-mono text-[10px] uppercase">Mirror Practice Drill:</strong>
                      <p className="text-white font-bold">{toolResult.mirrorPracticeProblem.question}</p>
                      <p className="text-slate-400 text-[11px]">{toolResult.mirrorPracticeProblem.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {toolResult.predictedScore && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="font-bold text-white">Predicted Marks:</span>
                    <span className="text-lg font-mono font-black text-emerald-400">{toolResult.predictedScore} / {toolResult.maxScore}</span>
                  </div>

                  {toolResult.missingMarkScoringPoints && (
                    <div>
                      <strong className="text-rose-400 block mb-1">Missing Mark-Scoring Keywords & Steps:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-rose-200">
                        {toolResult.missingMarkScoringPoints.map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {toolResult.recommendedModelImprovements && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 space-y-1">
                      <strong className="text-amber-400 block font-mono text-[10px] uppercase">Model Perfect Rewrite:</strong>
                      <p className="leading-relaxed italic">{toolResult.recommendedModelImprovements}</p>
                    </div>
                  )}
                </div>
              )}

              {toolResult.recommendedStructure && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200">
                    <strong>Time Budget: </strong>{toolResult.timeAllocation}
                  </div>

                  <div className="space-y-2">
                    <strong className="text-white block font-bold">Ideal Exam Sectional Breakdown:</strong>
                    {toolResult.recommendedStructure.map((sec: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="font-bold text-amber-300 block">{sec.section}</span>
                        <p className="text-slate-300 text-xs">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {toolResult.stages && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Target: {toolResult.targetTopic}</span>
                    <span>Estimated Effort: {toolResult.estimatedStudyHours} hrs</span>
                  </div>

                  <div className="space-y-2.5">
                    {toolResult.stages.map((stg: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>Stage {stg.step}: {stg.title}</span>
                          <span className="text-[10px] font-mono text-emerald-400">Prerequisite</span>
                        </div>
                        <p className="text-slate-400 text-xs">{stg.whyNeeded}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {stg.topics.map((top: string, tIdx: number) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                              {top}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {toolResult.slides && (
                <div className="space-y-3">
                  <strong className="text-white block font-bold">Generated Slide Deck Outline:</strong>
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

              {toolResult.executiveSummary && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-pink-200">
                    <p className="font-bold">{toolResult.greeting}</p>
                    <p className="text-xs text-slate-300 mt-1">{toolResult.executiveSummary}</p>
                  </div>

                  {toolResult.howParentCanSupportAtHome && (
                    <div>
                      <strong className="text-amber-300 block mb-1">Recommended Ways to Support at Home:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300">
                        {toolResult.howParentCanSupportAtHome.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
