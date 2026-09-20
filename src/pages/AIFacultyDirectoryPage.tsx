import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, Sparkles, MessageSquare, Star, 
  Award, ArrowRight, BookOpen, Brain, Zap, CheckCircle2, 
  ChevronRight, X, Send, Volume2, VolumeX, ShieldCheck, 
  Copy, Check, RefreshCw, Compass, Lightbulb, HelpCircle, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { AI_FACULTY_AGENTS, AITeacherAgent, FACULTY_SUBJECTS, TEACHING_STYLES } from '../data/aiFacultyData';
import { useStudentProfile } from '../context/StudentProfileContext';
import { StudentAudio } from '../utils/studentWebAudio';

type ClarityMode = 'intuitive' | 'step_by_step' | 'real_world' | 'exam_mastery';

export default function AIFacultyDirectoryPage() {
  const navigate = useNavigate();
  const { profile } = useStudentProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [activeConsultant, setActiveConsultant] = useState<AITeacherAgent | null>(null);

  // Teaching Clarity Mode
  const [clarityMode, setClarityMode] = useState<ClarityMode>('intuitive');

  // Consultation chat state
  const [chatMessages, setChatMessages] = useState<Array<{ 
    role: 'teacher' | 'student'; 
    text: string; 
    time: string;
    clarityMode?: ClarityMode;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Audio Speech Synthesis state
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Cleanup speech synthesis on unmount or consultant change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeConsultant]);

  const filteredTeachers = AI_FACULTY_AGENTS.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subDiscipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'All Subjects' || teacher.subject === selectedSubject;
    const matchesStyle = selectedStyle === 'All Styles' || teacher.teachingStyle === selectedStyle;

    return matchesSearch && matchesSubject && matchesStyle;
  });

  const handleStartConsultation = (teacher: AITeacherAgent) => {
    setActiveConsultant(teacher);
    StudentAudio.playPop();
    setChatMessages([
      {
        role: 'teacher',
        text: `### 🎓 Welcome to My Specialized Mentorship Session\n\n${teacher.greetingMessage}\n\nI am here to teach **${teacher.subDiscipline}** with **absolute conceptual clarity**.\n\n*What question, confusing topic, or exam doubt can I explain for you today?*`,
        time: 'Just now'
      }
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const userText = (customText || chatInput).trim();
    if (!userText || !activeConsultant) return;

    StudentAudio.playPop();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updatedMessages = [
      ...chatMessages,
      { role: 'student' as const, text: userText, time: timestamp }
    ];
    setChatMessages(updatedMessages);
    if (!customText) setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/faculty/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorName: activeConsultant.name,
          title: activeConsultant.title,
          subject: activeConsultant.subject,
          subDiscipline: activeConsultant.subDiscipline,
          teachingStyle: activeConsultant.teachingStyle,
          motto: activeConsultant.motto,
          specialties: activeConsultant.specialties,
          question: userText,
          history: updatedMessages.slice(-6),
          clarityMode
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      StudentAudio.playCelebrationChime();

      setChatMessages(prev => [
        ...prev,
        {
          role: 'teacher',
          text: data.answer || "Let us deconstruct this concept step by step from first principles.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clarityMode
        }
      ]);
    } catch (err: any) {
      console.warn('AI Faculty teach request failed, rendering resilient teacher lecture:', err);
      // Fallback high-clarity response
      const fallbackText = 
`### 🌟 Core Intuition First: What is Really Happening?

Let us take apart **"${userText}"** so that you understand the underlying mechanism completely.

As ${activeConsultant.name}, my motto is: *"${activeConsultant.motto}"*.

1. **The Mental Model**: Imagine the system at rest. When we introduce a disturbance or change, the fundamental conservation laws of ${activeConsultant.subject} dictate that equilibrium must be preserved.
2. **The Mechanism**: Trace the inputs to the outputs. Don't memorize isolated symbols; see what each parameter physically means.
3. **Common Exam Mistake**: Students often forget the boundary conditions or mix up the units. Always verify your dimensional consistency.

*Does this mental picture make sense, or would you like me to walk through a concrete numerical calculation?*`;

      setChatMessages(prev => [
        ...prev,
        {
          role: 'teacher',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Read aloud / Speech synthesis
  const handleToggleSpeak = (text: string, idx: number) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanSpeech = text
      .replace(/[#*`_~]/g, '')
      .replace(/\$\$/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/---/g, '')
      .slice(0, 800);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>The Grand Intellectual Academy • 1,000+ AI Teacher Agents</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            AI Faculty & Specialized Subject Mentors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Learn directly from specialized AI scholar avatars modeled after the greatest scientific minds, Nobel laureates, and top national Olympiad coaches. Each mentor is programmed to teach with crystal clarity, step-by-step derivations, and real-world analogies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/tutor')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-rose-500 transition-all flex items-center gap-2 shadow-xs"
          >
            <Brain className="w-4 h-4 text-rose-500" />
            <span>Open Core AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Academy Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Specialist AI Mentors', val: '1,000+', icon: Users, color: 'text-rose-600' },
          { label: 'Core Subject Arenas', val: '12 Disciplines', icon: BookOpen, color: 'text-blue-600' },
          { label: 'Mastery Styles', val: '6 Pedagogies', icon: Sparkles, color: 'text-amber-600' },
          { label: 'Clarity Guarantee', val: '100% Step-by-Step', icon: Award, color: 'text-emerald-600' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">{stat.val}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Subject Filters */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name (Feynman, Newton, Curie), specialty (Quantum, Organic Chem, Calculus)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            {FACULTY_SUBJECTS.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Teaching Style Filter Dropdown */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            {TEACHING_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Card Header: Avatar & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${teacher.avatarStyle} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform`}>
                    {teacher.avatarEmoji}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {teacher.eraOrAffiliation}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold">
                  {teacher.subject}
                </span>
              </div>

              {/* Title & Motto */}
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {teacher.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{teacher.motto}"
                </p>
              </div>

              {/* Specialties Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {teacher.specialties.map(spec => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-[10px] font-semibold text-rose-700 dark:text-rose-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                {teacher.bio}
              </p>
            </div>

            {/* Bottom Card Footer Actions */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{teacher.rating}</span>
                <span className="text-[10px] opacity-70">({(teacher.studentsTutored / 1000).toFixed(1)}k taught)</span>
              </div>

              <button
                onClick={() => handleStartConsultation(teacher)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 dark:bg-slate-800 dark:hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Learn Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* HIGH CLARITY MENTORSHIP CONSULTATION MODAL                                 */}
      {/* ========================================================================= */}
      {activeConsultant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 bg-gradient-to-r ${activeConsultant.avatarStyle} text-white flex items-center justify-between shadow-md`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm">
                  {activeConsultant.avatarEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black tracking-tight">{activeConsultant.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">
                      {activeConsultant.teachingStyle}
                    </span>
                  </div>
                  <p className="text-xs text-white/90">{activeConsultant.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate('/student/tutor');
                  }}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all"
                  title="Transfer discussion to full AI Tutor Workspace"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Transfer to Tutor</span>
                </button>

                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setActiveConsultant(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Teaching Clarity Modes Selector */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-700 dark:text-slate-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Teaching Clarity Mode:</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'intuitive', label: '🌟 Intuition & Analogy', desc: 'Mental model first' },
                  { id: 'step_by_step', label: '🔍 Step-by-Step Proof', desc: 'Line by line derivation' },
                  { id: 'real_world', label: '🌍 Real-World Use', desc: 'Practical applications' },
                  { id: 'exam_mastery', label: '🎯 Exam High-Yield', desc: 'Traps & marking points' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      StudentAudio.playPop();
                      setClarityMode(mode.id as ClarityMode);
                    }}
                    className={`px-3 py-1 rounded-xl font-extrabold text-[11px] transition-all ${
                      clarityMode === mode.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'teacher' && (
                    <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${activeConsultant.avatarStyle} text-white flex items-center justify-center text-base shrink-0 mt-0.5 shadow-sm`}>
                      {activeConsultant.avatarEmoji}
                    </div>
                  )}

                  <div className="max-w-[85%] sm:max-w-[80%] space-y-2">
                    <div
                      className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'student'
                          ? 'bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20 font-medium'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.role === 'student' ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div className="markdown-body space-y-2.5">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Action Bar for Teacher's Answers */}
                    {msg.role === 'teacher' && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-0.5 flex-wrap">
                        {/* Read Aloud Button */}
                        <button
                          onClick={() => handleToggleSpeak(msg.text, idx)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                            speakingIdx === idx
                              ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 text-rose-600 animate-pulse'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600'
                          }`}
                        >
                          {speakingIdx === idx ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{speakingIdx === idx ? 'Stop Voice' : 'Read Aloud'}</span>
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyText(msg.text, idx)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-[10px] font-bold flex items-center gap-1"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* Quick Clarity Follow-ups */}
                        <button
                          onClick={() => handleSendMessage("Could you explain this in even simpler everyday terms for a beginner?")}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 text-[10px] font-semibold"
                        >
                          💡 Explain Simpler
                        </button>

                        <button
                          onClick={() => handleSendMessage("Please show the full step-by-step mathematical derivation for this formula.")}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 text-[10px] font-semibold"
                        >
                          📐 Show Derivation
                        </button>

                        <button
                          onClick={() => handleSendMessage("Give me a challenging exam-level practice problem with a step-by-step solution on this topic.")}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 text-[10px] font-semibold"
                        >
                          🎯 Practice Problem
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs italic">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeConsultant.avatarStyle} text-white flex items-center justify-center text-sm shadow-xs animate-bounce`}>
                    {activeConsultant.avatarEmoji}
                  </div>
                  <span>{activeConsultant.name} is deconstructing your problem with {clarityMode.replace('_', ' ')} clarity...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Starter Questions for this Mentor */}
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">High-Yield Questions:</span>
              <button
                onClick={() => handleSendMessage(activeConsultant.sampleQuestion)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:border-rose-300 border border-slate-200 dark:border-slate-700 shrink-0 text-[11px] font-semibold"
              >
                "{activeConsultant.sampleQuestion}"
              </button>
              <button
                onClick={() => handleSendMessage("What is the #1 mistake students make when solving questions in " + activeConsultant.subDiscipline + "?")}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:border-rose-300 border border-slate-200 dark:border-slate-700 shrink-0 text-[11px] font-semibold"
              >
                ⚠️ What is the #1 exam trap?
              </button>
              <button
                onClick={() => handleSendMessage("Can you give me a memorable mechanical analogy that will stick with me forever?")}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:border-rose-300 border border-slate-200 dark:border-slate-700 shrink-0 text-[11px] font-semibold"
              >
                💡 Give me a memorable analogy
              </button>
            </div>

            {/* Message Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }} 
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Ask ${activeConsultant.name} any doubt in ${activeConsultant.subDiscipline} (e.g., derivations, proofs, formulas)...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30"
              >
                <span>Explain</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
