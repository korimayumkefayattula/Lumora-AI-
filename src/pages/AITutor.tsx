import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Mic, Send, Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VoiceTutorModal } from '../components/voice/VoiceTutorModal';
import { VoiceTutorButton } from '../components/voice/VoiceTutorButton';

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function AITutor() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init",
    sender: "ai",
    text: "Hi there! I'm your Luminati AI Mentor. How can I help you study today?"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const text = input;
    setInput("");
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: "user", text }]);
    setLoading(true);
    
    try {
      const res = await fetch("/api/chat-buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Math.random().toString(), sender: "ai", text: data.answer || "I'm here to help!" }]);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4 lg:p-6 overflow-hidden">
      
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full overflow-hidden relative">
        
        {/* Voice Banner Prompt */}
        <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <Mic className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI Voice Tutor Mode Available</h3>
                <p className="text-[11px] text-blue-100 font-medium">Have a two-way spoken conversation in English, Hindi, or Hinglish</p>
              </div>
            </div>
            <VoiceTutorButton onClick={() => setIsVoiceModalOpen(true)} variant="prominent" label="Launch Voice Tutor" />
          </div>
        </div>

        {/* Header */}
        <div className="h-14 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white font-display text-xs leading-tight">AI Study Mentor Chat</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMessages([{ id: "init", sender: "ai", text: "Chat cleared. What's next?" }])}
              className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/30">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-slate-800 dark:bg-slate-700 text-white" : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm"}`}>
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl p-4 shadow-sm ${msg.sender === "user" ? "bg-slate-800 dark:bg-slate-700 text-white rounded-tr-sm" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"}`}>
                 {msg.sender === "user" ? (
                   <p className="text-sm leading-relaxed">{msg.text}</p>
                 ) : (
                   <div className="markdown-body prose dark:prose-invert max-w-none text-sm prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-xl">
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
                 )}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0">
          <form onSubmit={handleSendText} className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:scale-105"
              title="Open AI Voice Tutor"
            >
              <Mic className="w-5 h-5 text-cyan-300 animate-pulse" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-4 pr-12 outline-none focus:border-blue-500 transition-colors text-slate-700 dark:text-slate-200 text-xs font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
        
      </div>

      <VoiceTutorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
