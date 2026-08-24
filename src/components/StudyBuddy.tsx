/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Sparkles, RefreshCw, ChevronDown, ChevronUp, Bot, HelpCircle, Image as ImageIcon, Paperclip, UploadCloud, Mic, MicOff } from "lucide-react";
import { Subject } from "../types";

interface StudyBuddyProps {
  subjects: Subject[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text?: string;
  imageBase64?: string;
  imageUrl?: string;
}

// Simple Helper to process simple markdown (bolds and bullets) for high craft presentation
function FormattedSocratesResponse({ text }: { text?: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // Handle bullets
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        if (isBullet) {
          trimmed = trimmed.substring(2);
        }

        // Parse bold elements (**text**)
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        const elementContent = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex gap-2 pl-2">
              <span className="text-blue-500 shrink-0 select-none">•</span>
              <div>{elementContent}</div>
            </div>
          );
        }

        return <p key={idx}>{elementContent}</p>;
      })}
    </div>
  );
}

export default function StudyBuddy({ subjects }: StudyBuddyProps) {
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-id",
      sender: "ai",
      text: "**Greetings!** I am **Luminati AI**, your supportive study buddy. \n\nAsk me to deconstruct hard concepts, write quick active-recall quizzes, or draft supportive study templates. What is on our mind today?"
    }
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const toggleRecording = () => { setIsRecording(!isRecording); if (!isRecording) { setTimeout(() => setIsRecording(false), 2000); alert("Voice input requires microphone permissions and server setup."); } };
  const [selectedSubjectContext, setSelectedSubjectContext] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e?: React.FormEvent, customQuestion?: string, isImageMode = false) => {
    if (e) e.preventDefault();
    const query = customQuestion || inputValue;
    if (!query.trim() && !selectedFile || loading) return;

    let base64File = null;
    let mimeType = null;
    if (selectedFile) {
      base64File = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(selectedFile);
      });
      mimeType = selectedFile.type;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: isImageMode ? `Draw me an image to explain: ${query}` : query
    };
    if (selectedFile) {
      userMsg.text += " (File attached)";
    }

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setSelectedFile(null);
    setLoading(true);


    try {
      const activeSubjectName = subjects.find(s => s.id === selectedSubjectContext)?.name || "";

      if (isImageMode) {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query, inputImage: base64File ? `data:${mimeType};base64,${base64File}` : undefined })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || "Unable to generate image.");
        }
        const data = await response.json();
        
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: "ai",
          text: "Here is an educational visual diagram:",
          imageBase64: data.imageBase64,
          imageUrl: data.imageUrl
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const response = await fetch("/api/chat-buddy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: query,
            subjectContext: activeSubjectName
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || "Unable to establish connect.");
        }

        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: "ai",
          text: data.answer || "Speak again? I didn't catch that context."
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: "⚠️ Luminati AI encountered an error. Please ensure your GEMINI_API_KEY is configured in Settings."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(undefined, prompt);
  };

  return (
    <div id="ai-companion-drawer" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 shadow-sm flex flex-col h-full overflow-hidden min-h-[460px]">
      {/* Header bar and collapsible triggers */}
      <div 
        id="chat-header-bar"
        
        className="bg-blue-600 p-4 flex items-center justify-between cursor-pointer text-white select-none transition-all hover:bg-blue-700"
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 animate-pulse-slow text-blue-100" />
          <div>
            <h3 className="font-bold font-display text-sm tracking-wide">
              LuminatiAI Mentor
            </h3>
            <p className="text-[10px] text-blue-100/80 font-medium">
              Your Personal Coach & Best Friend
            </p>
          </div>
        </div>
        <div>
          
        </div>
      </div>

      {/* Main Box body */}
      <>
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Quick Context Picker selection */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-blue-50/50 p-2 text-xs flex items-center justify-between gap-1.5 snap-x overflow-x-auto select-none">
            <span className="text-[10px] font-semibold text-blue-600/90 whitespace-nowrap">Focus Target:</span>
            <select
              id="buddy-subject-context"
              value={selectedSubjectContext}
              onChange={(e) => setSelectedSubjectContext(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 text-[11px] rounded-lg py-1 px-2 text-slate-700 outline-none max-w-[170px]"
            >
              <option value="">-- General Topic Flow --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>📖 {s.name}</option>
              ))}
            </select>
          </div>

          {/* Interactive Chat messages body */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-800/50/20 max-h-[290px]"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Visual Avatar icons */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 select-none ${
                  msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white border border-slate-150 text-blue-600"
                }`}>
                  {msg.sender === "user" ? "Me" : <Bot className="w-4 h-4" />}
                </div>

                {/* Message speech bubble wrapper */}
                <div className={`rounded-2xl py-2.5 px-3.5 shadow-3xs flex flex-col gap-2 ${
                  msg.sender === "user" 
                    ? "bg-slate-800 text-white text-xs leading-normal" 
                    : "bg-white border border-slate-100 dark:border-slate-700"
                }`}>
                  {msg.sender === "user" ? (
                    <p className="whitespace-pre-line text-xs font-medium">{msg.text}</p>
                  ) : (
                    <FormattedSocratesResponse text={msg.text} />
                  )}
                  {(msg.imageUrl || msg.imageBase64) && (
                    <img 
                      src={msg.imageUrl || `data:image/png;base64,${msg.imageBase64}`} 
                      alt="AI generated explanation" 
                      referrerPolicy="no-referrer"
                      className="rounded-lg max-w-full object-cover mt-1 border border-slate-100 dark:border-slate-700"
                    />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-xs text-blue-600 shrink-0">
                  <Bot className="w-4 h-4 animate-spin text-blue-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-2 px-3 text-xs text-slate-500 flex items-center gap-1">
                  <span>Luminati AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Luminati AI Quick Prompts block suggestions */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 select-none">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 pb-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Spark Study Inspiration
            </h4>
            <div className="flex gap-1.5 overflow-x-auto snap-x py-1 no-scrollbar whitespace-nowrap">
              {["Explain this like I'm 10", "Quick 3-question quiz", "How was my school day?", "Tell me a fun fact", "Tell me a joke"].map((p, idx) => (
                <button
                  key={idx}
                  id={`buddy-prompt-tip-${idx}`}
                  type="button"
                  onClick={() => handleQuickPrompt(p)}
                  className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-blue-600 px-2.5 py-1 rounded-full cursor-pointer transition-colors snap-center"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input control form */}
          
          {selectedFile && (
            <div className="px-3 pt-2 pb-1 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                {selectedFile.name}
              </span>
              <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          )}
          <form 
            onSubmit={(e) => handleSendMessage(e)}
            className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2 items-center"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Attach File (Image/PDF)"
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-sm border border-slate-200"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              id="buddy-chat-input"
              type="text"
              placeholder="Ask Luminati AI a topic study question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white border border-slate-200 text-xs rounded-xl py-2 px-3 text-slate-700 outline-none focus:border-blue-500 transition-all disabled:opacity-50"
              required
            />
            
            <button
              type="button"
              onClick={toggleRecording}
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer shadow-sm border ${isRecording ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'}`}
              title="Voice Input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              id="buddy-chat-img-btn"
              type="button"
              onClick={(e) => handleSendMessage(e, undefined, true)}
              disabled={loading || (!inputValue.trim() && !selectedFile)}
              title="Generate explanation image"
              className="w-8 h-8 rounded-xl bg-slate-100 text-blue-600 hover:bg-slate-200 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm border border-slate-200"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              id="buddy-chat-send-btn"
              type="submit"
              disabled={loading || (!inputValue.trim() && !selectedFile)}
              className="w-8 h-8 rounded-xl bg-blue-600 text-white hover:bg-blue-750 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shadow-blue-150"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </>
    </div>
  );
}
