import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu,
  SquarePen, 
  MoreVertical, 
  MoreHorizontal,
  Plus, 
  Mic, 
  MicOff, 
  Send, 
  ArrowUp,
  ArrowDown, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Paperclip, 
  Camera, 
  BookOpen, 
  Atom, 
  Compass, 
  Dna, 
  Binary, 
  X, 
  Loader2, 
  RefreshCw, 
  Globe, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Radio,
  AudioWaveform,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VoiceTutorModal } from '../voice/VoiceTutorModal';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
  attachmentPreview?: string;
  attachmentName?: string;
  sources?: Array<{ name: string; icon?: string; url?: string; count?: number }>;
  suggestedFollowups?: string[];
  liked?: boolean | null;
}

export interface ChatGPTConversationViewProps {
  title?: string;
  badgeLabel?: string;
  placeholder?: string;
  initialWelcome?: {
    headline: string;
    bullets: string[];
    followupSuggestion?: string;
    sources?: Array<{ name: string; icon?: string; url?: string; count?: number }>;
  };
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (text: string, attachment?: { data: string; mimeType: string; name: string; preview: string }) => void;
  onClearChat?: () => void;
  subjectOptions?: Array<{ id: string; name: string; icon?: any }>;
  selectedSubject?: string;
  onSelectSubject?: (subject: string) => void;
  targetLevel?: string;
  onChangeTargetLevel?: (level: string) => void;
  drawerContent?: React.ReactNode;
  isDrawerOpen?: boolean;
  onToggleDrawer?: () => void;
  voiceSubjectContext?: string;
  voiceDocumentContext?: string;
}

// Source favicon badge renderer
function SourceBadge({ name, count, url }: { name: string; count?: number; url?: string }) {
  const getBadgeIcon = (srcName: string) => {
    const lower = srcName.toLowerCase();
    if (lower.includes('cbs') || lower.includes('news')) return '📰';
    if (lower.includes('linktr')) return '🌿';
    if (lower.includes('vogue')) return '💎';
    if (lower.includes('ncert') || lower.includes('book')) return '📚';
    if (lower.includes('wolfram')) return '⚡';
    if (lower.includes('khan')) return '🔬';
    if (lower.includes('nature') || lower.includes('science')) return '🧪';
    if (lower.includes('wiki')) return '🌐';
    return '🔗';
  };

  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 ml-1.5 align-middle rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
      title={`Source: ${name}`}
      onClick={(e) => {
        e.stopPropagation();
        if (url) window.open(url, '_blank');
      }}
    >
      <span className="text-[10px] leading-none">{getBadgeIcon(name)}</span>
      <span className="truncate max-w-[120px]">{name}</span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] text-zinc-400 font-semibold">+{count}</span>
      )}
    </span>
  );
}

// Custom Markdown Renderer that matches the ChatGPT clean typographic style
function ChatGPTMarkdownRenderer({ 
  content, 
  onFollowupClick 
}: { 
  content: string; 
  onFollowupClick?: (prompt: string) => void; 
}) {
  // Parse lines to render ChatGPT formatted lists, bold highlights, inline citations, and hook followups (↳)
  const lines = content.split('\n');

  return (
    <div className="space-y-3.5 text-[15px] sm:text-[16px] leading-[1.65] text-zinc-900 dark:text-zinc-100 font-normal selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-1.5" />;

        // Header ### or ##
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={lIdx} className="font-bold text-[17px] text-zinc-900 dark:text-white pt-2 pb-0.5">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={lIdx} className="font-bold text-[19px] text-zinc-900 dark:text-white pt-3 pb-1">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // Hook Follow-up Line (e.g. "If you're asking ↳ how Miranda Kerr met...")
        if (trimmed.includes('↳') || trimmed.startsWith('If you\'re asking') || trimmed.startsWith('Suggested:')) {
          const cleanText = trimmed.replace(/^[-*•]\s*/, '');
          return (
            <div 
              key={lIdx} 
              className="pt-3 pb-1 text-[14.5px] sm:text-[15.5px] text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5 flex-wrap"
            >
              <span>{cleanText.split('↳')[0]}</span>
              {cleanText.includes('↳') && (
                <button
                  onClick={() => {
                    const prompt = cleanText.split('↳')[1]?.replace(/,\s*I can explain that too\.?/i, '')?.trim() || cleanText;
                    onFollowupClick?.(prompt);
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 border-b border-dotted border-zinc-400 hover:border-blue-500 transition-colors text-left group"
                >
                  <span className="text-zinc-500 group-hover:text-blue-500 font-bold">↳</span>
                  <span className="underline decoration-dotted underline-offset-4">{cleanText.split('↳')[1]}</span>
                </button>
              )}
            </div>
          );
        }

        // Bullet line
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const textToProcess = isBullet ? trimmed.replace(/^[•\-*]\s+/, '') : trimmed;

        // Process bold (**text**) and source badges inline
        const parts = textToProcess.split(/(\*\*.*?\*\*|\[cite:[^\]]+\]|\[source:[^\]]+\]|\[[^\]]+?\.(?:com|org|edu|in|ee|gov|net)[^\]]*\])/g);

        const renderedLineContent = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-zinc-950 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Inline citation tag like [cite: CBS News +1] or [vogue.com]
          if (part.startsWith('[') && part.endsWith(']')) {
            const cleanTag = part.slice(1, -1).replace(/^(cite|source):\s*/i, '');
            return <SourceBadge key={pIdx} name={cleanTag} />;
          }
          return <span key={pIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2.5 pl-1 my-1">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold text-[18px] leading-[1.2] select-none shrink-0">•</span>
              <div className="flex-1 leading-[1.6]">{renderedLineContent}</div>
            </div>
          );
        }

        return <p key={lIdx} className="leading-[1.65]">{renderedLineContent}</p>;
      })}
    </div>
  );
}

export function ChatGPTConversationView({
  title = "AI Doubt Solver & Tutor",
  badgeLabel,
  placeholder = "Reply to ChatGPT",
  initialWelcome,
  messages,
  loading,
  onSendMessage,
  onClearChat,
  subjectOptions,
  selectedSubject = "All",
  onSelectSubject,
  targetLevel = "Class 11-12",
  onChangeTargetLevel,
  drawerContent,
  isDrawerOpen = false,
  onToggleDrawer,
  voiceSubjectContext,
  voiceDocumentContext
}: ChatGPTConversationViewProps) {
  const [inputQuery, setInputQuery] = useState("");
  const [attachment, setAttachment] = useState<{ data: string; mimeType: string; name: string; preview: string } | null>(null);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isListeningDictation, setIsListeningDictation] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down' | null>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle scroll detection for scroll-to-bottom floating button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAwayFromBottom = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isAwayFromBottom);
  };

  // Web Speech API for dictate mic button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputQuery(prev => (prev ? `${prev} ${transcript}` : transcript));
        };

        recognition.onend = () => {
          setIsListeningDictation(false);
        };

        recognition.onerror = () => {
          setIsListeningDictation(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      setIsVoiceModalOpen(true);
      return;
    }

    if (isListeningDictation) {
      recognitionRef.current.stop();
      setIsListeningDictation(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListeningDictation(true);
      } catch (err) {
        console.error("Dictation start error:", err);
      }
    }
  };

  const handleSend = () => {
    if ((!inputQuery.trim() && !attachment) || loading) return;
    onSendMessage(inputQuery.trim(), attachment || undefined);
    setInputQuery("");
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const full = reader.result as string;
      setAttachment({
        name: file.name,
        data: full.split(',')[1],
        mimeType: file.type || 'image/jpeg',
        preview: full
      });
      setIsPlusMenuOpen(false);
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting for natural speech
    const cleanSpeech = text
      .replace(/#+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\$\$.*?\$\$/g, ' formula ')
      .replace(/\$.*?\$/g, ' formula ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(id);
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type
    }));
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Lumora AI Study Assistant',
        text: text.slice(0, 500)
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Answer text copied to clipboard!');
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#0d0d11] text-zinc-900 dark:text-zinc-100 flex overflow-hidden relative font-sans">
      
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={imageInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        accept="image/*,.pdf,.txt" 
        className="hidden" 
      />

      {/* Optional Left Drawer / Sidebar */}
      {drawerContent && isDrawerOpen && (
        <div className="w-72 sm:w-80 border-r border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-[#131317] flex flex-col shrink-0 z-30 animate-in slide-in-from-left duration-200">
          {drawerContent}
        </div>
      )}

      {/* Main ChatGPT Conversation Screen */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* TOP FLOATING / MINIMAL APP HEADER (Exact ChatGPT Layout) */}
        <header className="h-14 px-3 sm:px-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 bg-white/95 dark:bg-[#0d0d11]/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
          
          {/* Left: Menu / Drawer button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDrawer}
              className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors"
              title="Open Navigation & Subjects"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1 w-4 items-start">
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-3 h-0.5 bg-current rounded-full" />
              </div>
            </button>

            {/* Title / Subject Pill Badge */}
            <div className="relative">
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>{selectedSubject !== 'All' ? selectedSubject : (badgeLabel || title)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Subject selector popup */}
              {isSubjectDropdownOpen && subjectOptions && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1a1a20] border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Select Subject
                  </div>
                  {subjectOptions.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectSubject?.(sub.id);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors ${
                        selectedSubject === sub.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span>{sub.name}</span>
                      {selectedSubject === sub.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                  {onChangeTargetLevel && (
                    <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 px-3">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Grade Level</div>
                      <select
                        value={targetLevel}
                        onChange={(e) => onChangeTargetLevel(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 p-1.5 rounded-lg border-none outline-none font-medium"
                      >
                        <option>Class 9-10</option>
                        <option>Class 11-12</option>
                        <option>JEE / NEET</option>
                        <option>College / STEM</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Floating action pill with New Chat (Pencil) & More Options (⋮) */}
          <div className="flex items-center gap-1">
            <div className="flex items-center p-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 shadow-2xs">
              <button
                onClick={onClearChat}
                className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
                title="New Chat / Doubt"
              >
                <SquarePen className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown menu */}
                {isOptionsOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#1a1a20] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        onClearChat?.();
                        setIsOptionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Start New Conversation</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsVoiceModalOpen(true);
                        setIsOptionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                    >
                      <Mic className="w-3.5 h-3.5 text-blue-500" />
                      <span>Voice Tutor Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        imageInputRef.current?.click();
                        setIsOptionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Scan Question Photo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CHAT MESSAGES STREAM */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 py-6 space-y-8 custom-scrollbar pb-36"
        >
          <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-8">
            
            {/* If no messages yet, render elegant ChatGPT Welcome */}
            {messages.length === 0 && initialWelcome && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                <div className="text-[16px] sm:text-[17px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {initialWelcome.headline}
                </div>

                <div className="space-y-2.5">
                  {initialWelcome.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 pl-1">
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold text-[18px] leading-[1.2] select-none shrink-0">•</span>
                      <div className="text-[15px] sm:text-[16px] leading-[1.6] text-zinc-800 dark:text-zinc-200">
                        {b}
                      </div>
                    </div>
                  ))}
                </div>

                {initialWelcome.followupSuggestion && (
                  <div className="pt-2 text-[14.5px] text-zinc-700 dark:text-zinc-300 flex items-start gap-1 flex-wrap">
                    <span>If you're asking</span>
                    <button
                      onClick={() => onSendMessage(initialWelcome.followupSuggestion || "")}
                      className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 border-b border-dotted border-zinc-400 transition-colors"
                    >
                      <span className="text-zinc-500">↳</span>
                      <span>{initialWelcome.followupSuggestion}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2 group">
                
                {/* User Message */}
                {msg.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 text-[15px] font-medium leading-relaxed shadow-2xs">
                      {msg.attachmentPreview && (
                        <div className="mb-2.5 rounded-2xl overflow-hidden border border-zinc-300/40 dark:border-zinc-700/40">
                          <img 
                            src={msg.attachmentPreview} 
                            alt={msg.attachmentName || "Attached query"} 
                            referrerPolicy="no-referrer"
                            className="max-h-56 w-full object-cover" 
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  /* AI Message (Rendered on clean white canvas with ChatGPT styling) */
                  <div className="space-y-4 pt-1">
                    
                    {/* Message Body */}
                    <ChatGPTMarkdownRenderer 
                      content={msg.text} 
                      onFollowupClick={(prompt) => onSendMessage(prompt)} 
                    />

                    {/* AI Action Bar underneath response (Copy, Like, Dislike, Speaker, Share, More) */}
                    <div className="flex items-center gap-1 pt-1.5 text-zinc-400 dark:text-zinc-500">
                      
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Thumbs Up */}
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={`p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          feedbackState[msg.id] === 'up' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      {/* Thumbs Down */}
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={`p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          feedbackState[msg.id] === 'down' ? 'text-rose-500' : 'hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>

                      {/* Read Aloud / Voice Speaker */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                          speakingMessageId === msg.id ? 'text-blue-600 animate-pulse font-bold' : 'hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Read aloud"
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(msg.text)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Share response"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {/* More */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* AI Loading State (Typing Pulse) */}
            {loading && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse" />
                  <span className="text-xs font-medium">Lumora AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* FLOATING SCROLL TO BOTTOM BUTTON */}
        {showScrollBottom && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
              title="Scroll to latest message"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SIGNATURE CHATGPT FLOATING PILL INPUT BAR */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 bg-gradient-to-t from-white via-white/95 dark:from-[#0d0d11] dark:via-[#0d0d11]/95 to-transparent z-20">
          <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-2">
            
            {/* Image Attachment Preview Chip */}
            {attachment && (
              <div className="flex items-center gap-2 p-1.5 pl-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl self-start max-w-xs shadow-xs animate-in fade-in">
                <img 
                  src={attachment.preview} 
                  alt={attachment.name} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 object-cover rounded-xl border border-zinc-300 dark:border-zinc-700" 
                />
                <div className="flex-1 text-xs truncate">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{attachment.name}</p>
                  <p className="text-[10px] text-zinc-400">Attached</p>
                </div>
                <button 
                  onClick={() => setAttachment(null)} 
                  className="p-1 text-zinc-400 hover:text-red-500 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* The Floating Pill Input Bar */}
            <div className="relative">
              
              {/* Plus Menu Popup */}
              {isPlusMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#1a1a20] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={() => {
                      imageInputRef.current?.click();
                      setIsPlusMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Camera / OCR Photo</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Scan textbook or homework equation</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsPlusMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Upload PDF / Notes</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Ground AI answers in your documents</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsVoiceModalOpen(true);
                      setIsPlusMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Two-Way Voice Tutor</div>
                      <div className="text-[10px] text-zinc-400 font-normal">Spoken interactive mentor</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Main Pill Input Box */}
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100/90 dark:bg-[#18181d] border border-zinc-200/80 dark:border-zinc-800 rounded-full shadow-md focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition-all">
                
                {/* Plus (+) Button */}
                <button
                  type="button"
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700/80 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-all shrink-0 active:scale-95"
                  title="Attach file, photo or options"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Textarea / Input */}
                <textarea
                  ref={textareaRef}
                  value={inputQuery}
                  onChange={(e) => {
                    setInputQuery(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-[14.5px] sm:text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 py-1 max-h-32 custom-scrollbar font-normal leading-normal"
                />

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  
                  {/* Microphone dictation button */}
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isListeningDictation 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80'
                    }`}
                    title={isListeningDictation ? "Listening... (Click to stop)" : "Dictate with voice"}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* If text is typed -> Show Send button; Otherwise show the signature blue live voice waveform button! */}
                  {inputQuery.trim() || attachment ? (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center transition-all shadow-xs active:scale-95 disabled:opacity-50"
                      title="Send prompt"
                    >
                      <ArrowUp className="w-4 h-4 font-bold" />
                    </button>
                  ) : (
                    /* Signature Blue Live Waveform Button (launches live voice tutor) */
                    <button
                      type="button"
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="w-8 h-8 rounded-full bg-[#1c71d8] hover:bg-[#1a62be] text-white flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 group relative"
                      title="Launch AI Voice Tutor"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Voice Assistant Modal */}
      <VoiceTutorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        subjectContext={voiceSubjectContext || (selectedSubject !== 'All' ? selectedSubject : undefined)}
        documentContext={voiceDocumentContext}
      />
    </div>
  );
}
