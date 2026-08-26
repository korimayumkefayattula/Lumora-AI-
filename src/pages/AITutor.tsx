import React, { useState } from 'react';
import { 
  ChatGPTConversationView, 
  ChatMessage 
} from '../components/chat/ChatGPTConversationView';
import { 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Target, 
  Sparkles,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

const TUTOR_MODES = [
  { id: 'General', name: 'General Study Mentor' },
  { id: 'Socratic', name: 'Socratic Questioning' },
  { id: 'ExamRevision', name: 'Exam Prep & High Yield' },
  { id: 'ConceptExplainer', name: 'ELI5 & Visual Analogy' },
  { id: 'Motivation', name: 'Focus & Study Strategy' },
];

const SUGGESTED_MENTOR_PROMPTS = [
  {
    topic: 'Physics',
    title: 'Explain Quantum Entanglement simply',
    query: 'Explain quantum entanglement and Einstein-Podolsky-Rosen paradox using a simple everyday analogy with a pair of shoes in boxes.'
  },
  {
    topic: 'Study Strategy',
    title: 'How to use Feynman Technique for difficult chapters?',
    query: 'Guide me on how to apply the 4-step Feynman Technique to master complex organic chemistry reaction mechanisms.'
  },
  {
    topic: 'Mathematics',
    title: 'Intuitive meaning of Eigenvalues & Eigenvectors',
    query: 'What is the physical geometric intuition behind eigenvalues and eigenvectors in linear algebra? Why do axes not rotate?'
  },
  {
    topic: 'Biology',
    title: 'How CRISPR Cas-9 gene editing works',
    query: 'Explain how CRISPR Cas9 acts as molecular scissors to cut and modify specific DNA sequences with guide RNA.'
  }
];

export default function AITutor() {
  const [selectedMode, setSelectedMode] = useState("General");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your **Lumora AI Study Mentor & Pedagogical Guide** [cite: Lumora Core].

• **Socratic Concept Exploration**: Ask any concept and we'll break it down step-by-step with real-world analogies [cite: MIT OpenCourseWare].
• **High-Yield Exam Strategy**: Master tricky topics, memory mnemonics, and active recall frameworks [cite: Khan Academy].
• **Two-Way Voice Coaching**: Tap the blue waveform button anytime to speak naturally in voice mode.

If you're asking ↳ how quantum entanglement works / how to design an effective study schedule, I can guide you through it.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = async (
    text: string, 
    attachment?: { data: string; mimeType: string; name: string; preview: string }
  ) => {
    const q = text.trim();
    if (!q && !attachment) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q || (attachment ? `Analyze this document: ${attachment.name}` : ""),
      attachmentPreview: attachment?.preview,
      attachmentName: attachment?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat-buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: q,
          mode: selectedMode,
          attachment: attachment ? { data: attachment.data, mimeType: attachment.mimeType } : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get AI mentor response");
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || "I'm here to help you understand every step.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("AI Tutor Chat Error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ **AI Mentor connection error:** ${err.message || 'Please try again.'}`,
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

  // Drawer Content for AI Tutor
  const drawerContent = (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Mentor Settings
          </h3>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(false)} 
          className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Teaching Style / Mode */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Pedagogical Teaching Style
        </label>
        <div className="space-y-1">
          {TUTOR_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                selectedMode === mode.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <span>{mode.name}</span>
              {selectedMode === mode.id && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Exemplar Discussion Prompts */}
      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Topic Explorations
        </label>
        <div className="space-y-1.5">
          {SUGGESTED_MENTOR_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleSendMessage(item.query);
                setIsDrawerOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-300 transition-all group"
            >
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">{item.topic}</span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 line-clamp-1">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ChatGPTConversationView
      title="AI Study Mentor"
      badgeLabel={`AI Tutor • ${TUTOR_MODES.find(m => m.id === selectedMode)?.name || 'General'}`}
      placeholder="Reply to ChatGPT"
      messages={messages}
      loading={loading}
      onSendMessage={handleSendMessage}
      onClearChat={handleClearChat}
      subjectOptions={TUTOR_MODES}
      selectedSubject={selectedMode}
      onSelectSubject={setSelectedMode}
      drawerContent={drawerContent}
      isDrawerOpen={isDrawerOpen}
      onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
      voiceSubjectContext={`Teaching Mode: ${selectedMode}`}
    />
  );
}
