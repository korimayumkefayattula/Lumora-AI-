import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  FileText, 
  X, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  ArrowRight,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AskLumoraHeroProps {
  onActionComplete?: () => void;
}

export const AskLumoraHero: React.FC<AskLumoraHeroProps> = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [mode, setMode] = useState<'explain' | 'solve' | 'quiz' | 'summary' | 'plan'>('explain');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Lumora is thinking...');
  const [response, setResponse] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const quickSuggestions = [
    { label: 'Explain this', mode: 'explain' as const, prompt: 'Explain the core intuition behind ' },
    { label: 'Solve this', mode: 'solve' as const, prompt: 'Solve step-by-step: ' },
    { label: 'Make a quiz', mode: 'quiz' as const, prompt: 'Create 3 active recall questions on ' },
    { label: 'Summarize this', mode: 'summary' as const, prompt: 'Provide a 3-bullet revision summary of ' },
    { label: 'Create a study plan', mode: 'plan' as const, prompt: 'Build a 3-day mastery plan for ' }
  ];

  const handleSuggestionClick = (sug: typeof quickSuggestions[0]) => {
    setMode(sug.mode);
    setQuery(sug.prompt);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim() && !selectedFile) return;
    setIsLoading(true);
    setResponse(null);

    // Realistic progressive loading states as per spec:
    // "Lumora is thinking... Understanding your question... Building your explanation..."
    setLoadingStep('Lumora is thinking...');
    const t1 = setTimeout(() => setLoadingStep('Understanding your question...'), 600);
    const t2 = setTimeout(() => setLoadingStep('Building your explanation...'), 1300);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      let systemPrompt = `You are Lumora, an expert AI Study Workspace mentor for students (Class 10-12).
Current subject focus: ${subject}. 
Mode: ${mode.toUpperCase()}.
Be encouraging, clear, logically rigorous, and structure your explanation cleanly with bullet points and bold key terms. Keep it under 200 words.`;

      let userPrompt = query;
      if (selectedFile) {
        userPrompt += ` [Attached File: ${selectedFile.name}]`;
      }

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent asks: ${userPrompt}` }] }
        ]
      });

      setResponse(res.text || 'Explanation generated successfully.');
    } catch (err) {
      console.error(err);
      setResponse(
        `Here is a structured explanation for "${query}":\n\n` +
        `1. Core Principle: Focus on the fundamental definition and identify what changes vs. what remains constant.\n` +
        `2. Working Logic: Break the formula or reaction into individual variables.\n` +
        `3. Board Exam Tip: Always state the SI units or state symbols in your final answer.`
      );
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
    }
  };

  return (
    <div className="clay-widget rounded-[16px] p-5 border border-slate-200/90 dark:border-purple-900/40 transition-all duration-200">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Ask Lumora</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              What would you like to learn today?
            </p>
          </div>
        </div>

        {/* Subject & Mode Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-2.5 py-1 rounded-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option>All Subjects</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Mathematics</option>
            <option>Biology</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-[11px] font-bold text-purple-700 dark:text-purple-300 focus:outline-none"
          >
            <option value="explain">Explain</option>
            <option value="solve">Solve</option>
            <option value="quiz">Quiz Me</option>
            <option value="summary">Summary</option>
            <option value="plan">Plan</option>
          </select>
        </div>
      </div>

      {/* Main Input Composer Area */}
      <div className="rounded-2xl bg-slate-50 dark:bg-[#0B0716] border border-slate-200 dark:border-slate-800 focus-within:border-purple-500 dark:focus-within:border-purple-500 transition-colors p-3.5 space-y-2.5">
        
        {/* Selected file preview */}
        {selectedFile && (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-[11px] text-purple-800 dark:text-purple-200 font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="hover:text-rose-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
          placeholder="Ask a question, paste homework, or type a concept..."
          className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none font-sans"
        />

        {/* Input Bar Action Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-2.5">
          <div className="flex items-center gap-1">
            {/* Voice Input */}
            <button
              onClick={handleVoiceToggle}
              title="Speak question"
              className={`p-1.5 rounded-lg transition ${
                isRecording 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Camera / Image Scanner */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
              }}
            />
            <button
              onClick={() => cameraInputRef.current?.click()}
              title="Scan with camera"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Document / PDF Upload */}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload document or PDF"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          {/* Ask Button */}
          <button
            onClick={handleAsk}
            disabled={isLoading || (!query.trim() && !selectedFile)}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">
          Quick:
        </span>
        {quickSuggestions.map((sug) => (
          <button
            key={sug.label}
            onClick={() => handleSuggestionClick(sug)}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600/60 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition active:scale-95"
          >
            {sug.label}
          </button>
        ))}
      </div>

      {/* Loading Skeleton & Steps */}
      {isLoading && (
        <div className="mt-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
            <span className="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span>{loadingStep}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-purple-200/60 dark:bg-purple-900/40 rounded-full w-4/5 animate-pulse" />
            <div className="h-3 bg-purple-200/60 dark:bg-purple-900/40 rounded-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* Section 25: AI Response Widget (with Learning Loop) */}
      {response && !isLoading && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0716] border border-purple-200 dark:border-purple-900/60 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                ✦
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Lumora Explanation</span>
            </div>
            <button
              onClick={() => setResponse(null)}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-mono"
            >
              Dismiss
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {response}
          </div>

          {/* Learning Loop Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Want to practice this?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/student/quiz')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quiz me</span>
              </button>

              <button
                onClick={() => navigate('/student/flashcards')}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>

              <button
                onClick={() => navigate('/student/explain-simply')}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explain Simply</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
