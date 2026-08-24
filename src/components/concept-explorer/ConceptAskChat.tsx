import React, { useState } from 'react';
import { ConceptExplorerService } from '../../services/conceptExplorerService';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';

interface ConceptAskChatProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  activeNodeLabel?: string;
  initialQuestion?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const ConceptAskChat: React.FC<ConceptAskChatProps> = ({
  isOpen,
  onClose,
  topic,
  activeNodeLabel,
  initialQuestion
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialQuestion) {
      return [
        { id: '1', sender: 'user', text: initialQuestion }
      ];
    }
    return [
      { 
        id: '1', 
        sender: 'ai', 
        text: `Hi! I'm Lumora AI Tutor. I'm ready to answer any questions about "${activeNodeLabel || topic}". Ask me anything!` 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = input;
    setInput('');
    setIsLoading(true);

    const answer = await ConceptExplorerService.askConceptQuestion(topic, currentQuery, activeNodeLabel);
    const aiMsg: ChatMessage = { id: `ai_${Date.now()}`, sender: 'ai', text: answer };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 flex flex-col">
      
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Lumora AI</span>
          </div>
          <h2 className="text-sm font-black text-white">
            Context: {activeNodeLabel || topic}
          </h2>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar bg-slate-50 dark:bg-slate-900/60">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-xs font-medium'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
            }`}>
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium p-2">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Lumora AI is analyzing the concept...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${activeNodeLabel || topic}...`}
            className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
