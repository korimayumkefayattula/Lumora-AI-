import React, { useState, useRef, useEffect } from 'react';
import { useAIProvider } from '../context/AIProviderContext';
import { 
  Upload, 
  File, 
  Send, 
  Sparkles, 
  FileText, 
  Layers, 
  Network, 
  X, 
  Loader2, 
  User, 
  Mic, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  BookOpen, 
  Atom, 
  Dna, 
  Compass, 
  Binary, 
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VoiceTutorButton } from '../components/voice/VoiceTutorButton';
import { VoiceTutorModal } from '../components/voice/VoiceTutorModal';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  name: string;
  data: string; // base64
  mimeType: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  subject?: string;
  attachmentPreview?: string;
  timestamp: string;
}

const SUBJECT_OPTIONS = [
  { id: 'All', name: 'All Subjects', icon: BookOpen },
  { id: 'Physics', name: 'Physics', icon: Atom },
  { id: 'Chemistry', name: 'Chemistry', icon: Compass },
  { id: 'Biology', name: 'Biology', icon: Dna },
  { id: 'Mathematics', name: 'Mathematics', icon: Binary },
];

const SUGGESTED_DOUBTS = [
  {
    subject: 'Physics',
    label: 'Derive Time Period of Simple Pendulum',
    query: 'Derive the formula for the time period of a simple pendulum $T = 2\\pi \\sqrt{l/g}$ using simple harmonic motion restoring torque and small-angle approximation.'
  },
  {
    subject: 'Chemistry',
    label: 'Balancing Redox Reaction in Acidic Medium',
    query: 'Explain step-by-step how to balance the redox reaction: $MnO_4^- + Fe^{2+} \\rightarrow Mn^{2+} + Fe^{3+}$ in an acidic medium using the ion-electron method.'
  },
  {
    subject: 'Biology',
    label: 'Why is DNA Replication Semi-Conservative?',
    query: 'Explain Meselson and Stahl\'s experiment proving semi-conservative DNA replication using heavy nitrogen isotopes (15N and 14N) with density gradient centrifugation.'
  },
  {
    subject: 'Mathematics',
    label: 'Prove why √2 is an irrational number',
    query: 'Provide the rigorous mathematical proof by contradiction showing why $\\sqrt{2}$ is irrational, explaining the co-prime assumption and fundamental theorem of arithmetic.'
  }
];

export default function AIDoubtSolver() {
  const navigate = useNavigate();
  const { provider, omniRouteUrl, omniRouteModel } = useAIProvider();
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [targetLevel, setTargetLevel] = useState("Class 11-12");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [attachment, setAttachment] = useState<{ name: string; data: string; mimeType: string; preview: string } | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `### 👋 Welcome to Lumora AI Doubt Solver!
Ask any academic question, math derivation, chemical mechanism, or biology concept. You can also upload textbook images or notes.

**How I resolve doubts:**
- 💡 **Direct Verdict & Core Result**
- 🔍 **Step-by-Step Rigorous Breakdown** with LaTeX equations
- 🧠 **Intuitive Real-Life Analogy**
- ⚠️ **Common Exam Mistakes to Avoid**
- 🎯 **Check Your Understanding Question**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      newFiles.push({
        id: Math.random().toString(),
        name: file.name,
        data,
        mimeType: file.type || 'application/pdf'
      });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const full = reader.result as string;
      setAttachment({
        name: file.name,
        data: full.split(',')[1],
        mimeType: file.type || 'image/png',
        preview: full
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSolve = async (textToAsk?: string) => {
    const q = (textToAsk !== undefined ? textToAsk : query).trim();
    if ((!q && !attachment && files.length === 0) || loading) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      sender: "user", 
      text: q || (attachment ? `Solve this question in attached image: ${attachment.name}` : "Solve attached documents"),
      attachmentPreview: attachment?.preview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    const currentAttachment = attachment;
    setAttachment(null);
    setLoading(true);

    try {
      const res = await fetch("/api/solve-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          subject: selectedSubject !== 'All' ? selectedSubject : undefined,
          targetLevel,
          attachment: currentAttachment ? { data: currentAttachment.data, mimeType: currentAttachment.mimeType } : undefined,
          files: files.length > 0 ? files.map(f => ({ data: f.data, mimeType: f.mimeType, name: f.name })) : undefined,
          provider,
          omniRouteUrl,
          omniRouteModel
        })
      });

      const data = await res.json();
      if (!res.ok || !data.solution) {
        throw new Error(data.details || data.error || "Failed to solve doubt");
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.solution,
        subject: data.subject,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Doubt solver error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `⚠️ **Unable to resolve doubt:** ${err.message || 'Network error'}. Please try rephrasing or check your connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown for audio speech
    const cleanSpeech = text
      .replace(/#+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\$\$.*?\$\$/g, ' formula ')
      .replace(/\$.*?\$/g, ' formula ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingMessageId(msgId);
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-950 flex overflow-hidden text-slate-900 dark:text-slate-100">
      
      {/* LEFT SIDEBAR: Sources & Subject Filtering */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col hidden lg:flex shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Doubt Workspace
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            Socratic AI
          </span>
        </div>

        {/* Subject Filter Pills */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Subject Focus
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SUBJECT_OPTIONS.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exam Level Target */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Target Grade / Exam
          </label>
          <select
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none"
          >
            <option>Class 9-10 Foundation</option>
            <option>Class 11-12 Board Exam</option>
            <option>JEE Main & Advanced</option>
            <option>NEET Medical Entrance</option>
            <option>University / College STEM</option>
          </select>
        </div>

        {/* Upload Sources Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reference Sources ({files.length})
            </h4>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Add PDF</span>
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="application/pdf,.txt,.md" 
            onChange={handleFileUpload} 
          />

          {files.length === 0 ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
            >
              <File className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Optional: Ground with textbook</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Upload notes or PDFs to ground AI solutions</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <File className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Curated Syllabus Preset Doubts */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quick Exemplar Doubts
            </h4>
            <div className="space-y-1.5">
              {SUGGESTED_DOUBTS.filter(d => selectedSubject === 'All' || d.subject === selectedSubject).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSolve(item.query)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all group"
                >
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">{item.subject}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 line-clamp-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MAIN WORKSPACE CHAT & SOLUTION AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 relative">
        
        {/* Top Sticky Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white font-display flex items-center gap-2">
                <span>AI Doubt Solver</span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {selectedSubject !== 'All' ? selectedSubject : 'Universal'} • {targetLevel}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoiceTutorButton 
              onClick={() => setIsVoiceModalOpen(true)} 
              variant="compact" 
              label="Speak Doubt (Voice)" 
            />
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 custom-scrollbar pb-36">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-5 shadow-xs transition-all ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-tr-xs" 
                    : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs"
                }`}>
                  
                  {/* User attachment preview if any */}
                  {msg.attachmentPreview && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-white/20">
                      <img 
                        src={msg.attachmentPreview} 
                        alt="User doubt question" 
                        referrerPolicy="no-referrer"
                        className="max-h-48 w-full object-cover" 
                      />
                    </div>
                  )}

                  {msg.sender === "user" ? (
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}

                  {/* AI Message Footer Toolbar */}
                  {msg.sender === "ai" && (
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-400">
                      <span className="text-[10px]">{msg.timestamp}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-semibold ${
                            speakingMessageId === msg.id ? 'text-blue-600 font-bold animate-pulse' : ''
                          }`}
                          title="Read solution aloud"
                        >
                          {speakingMessageId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{speakingMessageId === msg.id ? 'Stop' : 'Read'}</span>
                        </button>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                          title="Copy solution"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl rounded-tl-xs p-5 shadow-xs flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Formulating Socratic derivation & mental model...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* BOTTOM FIXED FLOATING INPUT BAR */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white/95 dark:from-slate-950 dark:via-slate-950/95 to-transparent">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Attachment Badge */}
            {attachment && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl self-start max-w-sm">
                <img 
                  src={attachment.preview} 
                  alt="Doubt attachment" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-xl border border-blue-200" 
                />
                <div className="flex-1 text-xs truncate">
                  <p className="font-bold text-blue-900 dark:text-blue-200 truncate">{attachment.name}</p>
                  <p className="text-[10px] text-blue-500">Image question attached</p>
                </div>
                <button onClick={() => setAttachment(null)} className="p-1 text-slate-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                handleSolve(); 
              }} 
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl shadow-xl p-2 pl-4 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
            >
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageAttachment}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                title="Attach question photo or diagram"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any math derivation, chemistry reaction, or conceptual doubt..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />

              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                title="Ask using voice"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button 
                type="submit" 
                disabled={loading || (!query.trim() && !attachment)} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
              <span>Supports LaTeX ($math$)</span>
              <span>•</span>
              <span>Instant step-by-step Socratic breakdown</span>
              <span>•</span>
              <span>Click mic for Google Assistant Voice Mode</span>
            </div>
          </div>
        </div>

      </div>

      {/* Voice Assistant Modal */}
      <VoiceTutorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        subjectContext={selectedSubject !== 'All' ? selectedSubject : undefined}
        documentContext={files.length > 0 ? `Uploaded documents: ${files.map(f => f.name).join(', ')}` : undefined}
      />
    </div>
  );
}
