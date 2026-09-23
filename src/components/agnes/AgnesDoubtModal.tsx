import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Check, Loader2 } from 'lucide-react';
import { AgnesScene } from '../../types/agnesVideo';
import { askAgnesDoubt } from '../../services/agnesVideoService';
import { AgnesAvatar } from './AgnesAvatar';

interface AgnesDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  currentScene: AgnesScene;
}

export const AgnesDoubtModal: React.FC<AgnesDoubtModalProps> = ({
  isOpen,
  onClose,
  topic,
  currentScene,
}) => {
  const [doubtText, setDoubtText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ sender: 'student' | 'agnes'; text: string }>>([
    {
      sender: 'agnes',
      text: `Hello! I am Dr. Agnes. We just paused on "${currentScene.title}". What part of this derivation or concept feels cloudy? Ask me anything—no doubt is too basic!`
    }
  ]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Can you give me a simple real-life analogy for this?',
    'Why does the equation take this mathematical form?',
    'What is the #1 mistake students make on exams here?'
  ];

  const handleSendDoubt = async (textToSend?: string) => {
    const question = (textToSend || doubtText).trim();
    if (!question || isLoading) return;

    // Append student message
    setConversation((prev) => [...prev, { sender: 'student', text: question }]);
    setDoubtText('');
    setIsLoading(true);

    try {
      const answer = await askAgnesDoubt({
        topic,
        currentSceneTitle: currentScene.title,
        sceneContext: `Key Formula: ${currentScene.keyFormulaOrConcept}. Chalkboard: ${currentScene.chalkboardPoints.join('; ')}`,
        studentDoubt: question,
      });

      setConversation((prev) => [...prev, { sender: 'agnes', text: answer }]);
    } catch (e) {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'agnes',
          text: `In ${topic}, this specific step always tests your mental model. Consider what happens at the boundary limit: if you set the variable to zero, does the formula behave consistently with physical reality? That is the litmus test to remember!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <AgnesAvatar isSpeaking={isLoading} mood="explaining" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">Ask Dr. Agnes a Doubt</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                  Scene {currentScene.sceneNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                {currentScene.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Formula Reminder Strip */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs font-mono text-amber-300">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Active Equation:</span>
          <span className="truncate">{currentScene.keyFormulaOrConcept}</span>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {conversation.map((msg, idx) => {
            const isAgnes = msg.sender === 'agnes';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isAgnes ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAgnes
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isAgnes ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isAgnes
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 italic py-1">
              <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
              <span>Dr. Agnes is analyzing your question...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendDoubt(q)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendDoubt();
          }}
          className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Type your question or where you got stuck..."
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={!doubtText.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
