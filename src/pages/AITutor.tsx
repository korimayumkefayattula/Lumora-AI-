import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Sparkles, Send, Mic, MicOff, Paperclip, 
  HelpCircle, Lightbulb, BookOpen, Layers, Target, CheckCircle2, 
  RotateCcw, Copy, Check, MessageSquare, ChevronRight, Volume2, 
  Brain, FileText, ArrowRight, X, ArrowUpRight, Compass, ShieldCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VoiceTutorModal } from '../components/voice/VoiceTutorModal';
import { useStudentProfile } from '../context/StudentProfileContext';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  level?: 'very-simple' | 'school-level' | 'detailed' | 'exam-level';
  isSocratic?: boolean;
  attachmentName?: string;
  attachmentPreview?: string;
  suggestedFollowups?: string[];
}

interface SavedConversation {
  id: string;
  title: string;
  subject: string;
  date: string;
  preview: string;
}

const PRESET_CONVERSATIONS: SavedConversation[] = [
  {
    id: 'conv-1',
    title: 'Quadratic Equations & Discriminant',
    subject: 'Mathematics',
    date: 'Today',
    preview: 'Discriminant determines real vs complex roots...'
  },
  {
    id: 'conv-2',
    title: 'Photosynthesis Light-Dependent Reactions',
    subject: 'Biology',
    date: 'Yesterday',
    preview: 'Thylakoid membranes absorbing photons to produce ATP...'
  },
  {
    id: 'conv-3',
    title: "Newton's 3rd Law & Momentum Conservation",
    subject: 'Physics',
    date: '3 days ago',
    preview: 'Action and reaction act on two different bodies...'
  }
];

export default function AITutor() {
  const navigate = useNavigate();
  const { profile } = useStudentProfile();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello ${profile.name.split(' ')[0]}! 👋 I'm your **Lumora AI Study Companion**.

I'm here to help you **understand concepts deeply**, not just memorize formulas.

• **Ask any concept or doubt**: We'll break it down step-by-step with intuitive real-world analogies.
• **Explain Simply**: For any answer, choose between *Very Simple (ELI5)*, *School Level*, *Detailed*, or *Exam Level*.
• **Socratic Learning Mode**: Toggle below so I ask guiding questions to help you think through solutions yourself!

What would you like to explore today?`,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Explain Photosynthesis light reactions simply',
        'Why does quadratic formula have ±√b²-4ac?',
        'How does CRISPR Cas-9 gene editing work?',
        'Guide me through Newton’s 2nd law step-by-step'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>(profile.subjects[0] || 'Mathematics');
  const [isSocraticMode, setIsSocraticMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'very-simple' | 'school-level' | 'detailed' | 'exam-level'>('school-level');
  
  // Mobile drawers
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightTools, setShowRightTools] = useState(false);
  
  // Voice Modal
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Attachment
  const [attachment, setAttachment] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Key formulas / notes gathered during session
  const [keyNotes, setKeyNotes] = useState<string[]>([
    'Discriminant Δ = b² - 4ac: Δ > 0 (2 Real), Δ = 0 (1 Real), Δ < 0 (2 Complex)',
    'Light reactions convert solar photons into chemical ATP + NADPH'
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setAttachment({
        name: file.name,
        base64,
        mimeType: file.type || 'application/octet-stream'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string, overrideLevel?: 'very-simple' | 'school-level' | 'detailed' | 'exam-level') => {
    const q = (textToSend !== undefined ? textToSend : inputQuery).trim();
    if (!q && !attachment) return;

    const chosenLevel = overrideLevel || currentLevel;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q || `Please analyze this study material: ${attachment?.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentName: attachment?.name,
      attachmentPreview: attachment?.mimeType.startsWith('image/') ? `data:${attachment.mimeType};base64,${attachment.base64}` : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setAttachment(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          subjectContext: selectedSubject,
          socratic: isSocraticMode,
          level: chosenLevel,
          fileBase64: attachment?.base64,
          mimeType: attachment?.mimeType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "I'm here to help you understand every step.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: chosenLevel,
        isSocratic: isSocraticMode,
        suggestedFollowups: isSocraticMode 
          ? ["Let's try step 1", "Give me a small hint", "Show me the underlying formula"]
          : ["Explain this simpler", "Give a real-world example", "Generate a practice question"]
      };

      setMessages(prev => [...prev, aiMessage]);

      // If user asks for formulas, capture key takeaways
      if (data.answer.includes('=')) {
        const lines = data.answer.split('\n');
        const eqLine = lines.find((l: string) => l.includes('=') && l.length < 80);
        if (eqLine) {
          setKeyNotes(prev => Array.from(new Set([...prev, eqLine.replace(/[#*`]/g, '').trim()])));
        }
      }

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Could not connect to Lumora AI:** ${err.message || 'Please check your connection and try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExplainLevel = (originalQuestion: string, level: 'very-simple' | 'school-level' | 'detailed' | 'exam-level') => {
    setCurrentLevel(level);
    const levelPrompt = `Please explain: "${originalQuestion}" at the ${level.replace('-', ' ').toUpperCase()} level.`;
    handleSendMessage(levelPrompt, level);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'new-chat-msg',
        sender: 'ai',
        text: `Starting a fresh study session in **${selectedSubject}**. What concept would you like to tackle?`,
        timestamp: 'Just now',
        suggestedFollowups: [
          'What are the core foundational topics here?',
          'Walk me through a typical exam problem',
          'Test my knowledge with a quick question'
        ]
      }
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0c0c12] text-slate-900 dark:text-slate-100 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. LEFT COLUMN: Conversation History & Subjects (Collapsible on Mobile)    */}
      {/* ========================================================================= */}
      <aside className={`
        ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#12121a] border-r border-slate-200 dark:border-slate-800/80
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">AI Tutor</h2>
              <p className="text-[10px] text-slate-400">Personal Study Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearChat}
              title="Start New Session"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowLeftSidebar(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subjects Selector */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Subject
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {profile.subjects.map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left truncate transition-all ${
                  selectedSubject === subj
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Socratic Mode Toggle Card */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Socratic Mode</span>
            </div>
            <button
              onClick={() => setIsSocraticMode(!isSocraticMode)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                isSocraticMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isSocraticMode ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {isSocraticMode 
              ? 'Active: Lumora guides with questions instead of giving raw answers.' 
              : 'Off: Lumora provides full direct explanations & solutions.'}
          </p>
        </div>

        {/* Saved Sessions / History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Recent Conversations
          </label>
          <div className="space-y-1.5">
            {PRESET_CONVERSATIONS.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedSubject(conv.subject);
                  handleSendMessage(`Let's review ${conv.title}`);
                  setShowLeftSidebar(false);
                }}
                className="p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{conv.subject}</span>
                  <span className="text-[10px] text-slate-400">{conv.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {conv.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {conv.preview}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Voice Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Open Voice Tutor</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. CENTER COLUMN: AI Conversation                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-[#0c0c12]">
        
        {/* Top Chat Bar */}
        <header className="px-4 py-3 bg-white/80 dark:bg-[#12121a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedSubject} AI Study Session
                </h1>
                {isSocraticMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                    Socratic Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Level: {currentLevel.replace('-', ' ')} • Curriculum: {profile.classGrade}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Explain Simply Level Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['very-simple', 'school-level', 'detailed', 'exam-level'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setCurrentLevel(lvl)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    currentLevel === lvl
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {lvl.replace('-', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRightTools(!showRightTools)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Tools</span>
            </button>
          </div>
        </header>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isAI 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs'
                }`}>
                  {isAI ? <Sparkles className="w-4 h-4" /> : profile.name.slice(0, 1).toUpperCase()}
                </div>

                {/* Message Body */}
                <div className={`space-y-2 max-w-[85%] ${isAI ? 'text-left' : 'text-right'}`}>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-white dark:bg-[#161622] border border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    {/* Attachment preview if any */}
                    {msg.attachmentName && (
                      <div className="mb-2 p-2 rounded-lg bg-black/10 flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{msg.attachmentName}</span>
                      </div>
                    )}
                    {msg.attachmentPreview && (
                      <img src={msg.attachmentPreview} alt="upload" className="mb-2 rounded-lg max-h-48 object-contain" />
                    )}

                    <div className="prose dark:prose-invert prose-xs max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* AI Quick Actions: Explain this bar & study tools */}
                  {isAI && idx > 0 && (
                    <div className="space-y-2 pt-1">
                      {/* Explain this in 4 levels (PRD Section 15) */}
                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Explain this:</span>
                        {(['very-simple', 'school-level', 'detailed', 'exam-level'] as const).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => handleRequestExplainLevel(msg.text.slice(0, 80), lvl)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-semibold border border-slate-200 dark:border-slate-700/60 transition-colors"
                          >
                            {lvl.replace('-', ' ')}
                          </button>
                        ))}
                      </div>

                      {/* Micro actions */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <button
                          onClick={() => navigate('/student/notes')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-emerald-500" /> Save to Notes
                        </button>
                        <button
                          onClick={() => navigate('/student/flashcards')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Layers className="w-3 h-3 text-indigo-500" /> Make Flashcards
                        </button>
                        <button
                          onClick={() => navigate('/student/quiz')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Target className="w-3 h-3 text-amber-500" /> 3-Question Quiz
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowups.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(fu)}
                          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-800/60 transition-colors flex items-center gap-1"
                        >
                          <span>{fu}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-xl text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{isSocraticMode ? 'Analyzing concept & preparing guiding question...' : 'Synthesizing pedagogical explanation...'}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#12121a] border-t border-slate-200 dark:border-slate-800">
          
          {/* Attachment chip if selected */}
          {attachment && (
            <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs max-w-md">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate font-semibold text-blue-950 dark:text-blue-200">{attachment.name}</span>
              </div>
              <button onClick={() => setAttachment(null)} className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* File upload button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Document or Image"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice input button */}
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              title="Voice Tutor"
              className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Query input field */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask Lumora anything in ${selectedSubject}... (e.g., "Explain why light bends in water")`}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={(!inputQuery.trim() && !attachment) || loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT COLUMN: Learning Tools & Context (Collapsible)                    */}
      {/* ========================================================================= */}
      <aside className={`
        ${showRightTools ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 right-0 z-40 w-72 bg-white dark:bg-[#12121a] border-l border-slate-200 dark:border-slate-800/80
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        {/* Right Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Learning Accelerators
            </h3>
          </div>
          <button
            onClick={() => setShowRightTools(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          
          {/* Socratic Mode Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Socratic Questioning</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              When Socratic mode is active, Lumora won't spoil the answer. It asks guiding questions to build your independent problem-solving skills.
            </p>
            <button
              onClick={() => setIsSocraticMode(!isSocraticMode)}
              className={`w-full py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                isSocraticMode
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              {isSocraticMode ? '✓ Socratic Mode Active' : 'Enable Socratic Mode'}
            </button>
          </div>

          {/* Quick Learning Tools */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Workspace Actions
            </label>
            
            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/student/homework-helper')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600">Homework Helper</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/explain-simply')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600">Explain Simply</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/flashcards')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Active Flashcards</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/quiz')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">Practice Quiz</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/student/mind-map')}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600">Concept Mind Map</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Key Takeaways Captured */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Session Formulas
              </label>
              <span className="text-[10px] text-slate-400 font-mono">{keyNotes.length} saved</span>
            </div>

            <div className="space-y-2">
              {keyNotes.map((note, nIdx) => (
                <div
                  key={nIdx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-mono leading-relaxed"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Voice Tutor Modal Component */}
      <VoiceTutorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        subjectContext={selectedSubject}
      />

    </div>
  );
}
