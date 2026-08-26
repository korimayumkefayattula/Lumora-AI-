import React, { useState, useRef, useEffect } from 'react';
import { useAIProvider } from '../context/AIProviderContext';
import { 
  ChatGPTConversationView, 
  ChatMessage 
} from '../components/chat/ChatGPTConversationView';
import { 
  BookOpen, 
  Atom, 
  Compass, 
  Dna, 
  Binary, 
  Upload, 
  File, 
  X, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  data: string;
  mimeType: string;
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
  const { provider, omniRouteUrl, omniRouteModel } = useAIProvider();
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [targetLevel, setTargetLevel] = useState("Class 11-12");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Ah, welcome to **Lumora AI Doubt Solver** [cite: NCERT Core +1].

• **Direct & Precise Verdict**: State the core conclusion and key formulas upfront in clean LaTeX.
• **Rigorous Step-by-Step Derivation**: Detailed logic and step justifications with clear physical & chemical rules [cite: WolframAlpha].
• **Intuitive Mental Model**: Real-world visual analogy to make concepts permanently click [cite: Khan Academy].
• **Exam Traps & Common Mistakes**: Key pitfalls students must avoid during competitive & board exams.

If you're asking ↳ how to derive the simple pendulum formula / solve complex redox reactions, I can explain that step-by-step.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSendMessage = async (
    text: string, 
    attachment?: { data: string; mimeType: string; name: string; preview: string }
  ) => {
    const q = text.trim();
    if (!q && !attachment && files.length === 0) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q || (attachment ? `Solve and explain this problem: ${attachment.name}` : "Solve attached documents"),
      attachmentPreview: attachment?.preview,
      attachmentName: attachment?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/solve-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          subject: selectedSubject !== 'All' ? selectedSubject : undefined,
          targetLevel,
          attachment: attachment ? { data: attachment.data, mimeType: attachment.mimeType } : undefined,
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

      // Format response with clean bullets and hook follow-up if applicable
      let solutionFormatted = data.solution;
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: solutionFormatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Doubt solver error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ **Unable to resolve doubt:** ${err.message || 'Connection error'}. Please try again or rephrase your question.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Drawer Content: Subject selection, Grounding sources, and Quick exemplars
  const drawerContent = (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
      
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Doubt Settings
          </h3>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(false)} 
          className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Level */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Target Exam Level
        </label>
        <select
          value={targetLevel}
          onChange={(e) => setTargetLevel(e.target.value)}
          className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none"
        >
          <option>Class 9-10 Foundation</option>
          <option>Class 11-12 Board Exam</option>
          <option>JEE Main & Advanced</option>
          <option>NEET Medical Entrance</option>
          <option>University / College STEM</option>
        </select>
      </div>

      {/* Grounding PDF Documents */}
      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Reference Notes ({files.length})
          </label>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            <span>Upload</span>
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
            className="p-3 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-400 rounded-2xl text-center cursor-pointer transition-colors bg-white/50 dark:bg-zinc-800/30"
          >
            <File className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Ground with PDF Notes</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Attach syllabus or textbook chapters</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <File className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">{file.name}</span>
                </div>
                <button onClick={() => removeFile(file.id)} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Exemplar Doubts */}
      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Quick Exemplar Doubts
        </label>
        <div className="space-y-1.5">
          {SUGGESTED_DOUBTS.filter(d => selectedSubject === 'All' || d.subject === selectedSubject).map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleSendMessage(item.query);
                setIsDrawerOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-300 transition-all group"
            >
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">{item.subject}</span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 line-clamp-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <ChatGPTConversationView
      title="AI Doubt Solver"
      badgeLabel={selectedSubject !== 'All' ? `${selectedSubject} • ${targetLevel}` : `Doubt Solver • ${targetLevel}`}
      placeholder="Reply to ChatGPT"
      messages={messages}
      loading={loading}
      onSendMessage={handleSendMessage}
      onClearChat={handleClearChat}
      subjectOptions={SUBJECT_OPTIONS}
      selectedSubject={selectedSubject}
      onSelectSubject={setSelectedSubject}
      targetLevel={targetLevel}
      onChangeTargetLevel={setTargetLevel}
      drawerContent={drawerContent}
      isDrawerOpen={isDrawerOpen}
      onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      voiceSubjectContext={selectedSubject !== 'All' ? selectedSubject : undefined}
      voiceDocumentContext={files.length > 0 ? `Uploaded documents: ${files.map(f => f.name).join(', ')}` : undefined}
    />
  );
}
