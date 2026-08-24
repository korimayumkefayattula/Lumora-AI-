import React, { useState } from 'react';
import { 
  Edit3, Sparkles, Code, Calculator, Atom, BookOpen, Send, 
  HelpCircle, Copy, Check, FileCode
} from 'lucide-react';

interface TextInputEditorProps {
  onSubmitText: (text: string) => void;
  isLoading?: boolean;
}

export const TextInputEditor: React.FC<TextInputEditorProps> = ({
  onSubmitText,
  isLoading = false
}) => {
  const [text, setText] = useState<string>('');

  const samplePrompts = [
    {
      label: "Math Algebra",
      icon: Calculator,
      content: "Solve the equation 3x² - 12x + 9 = 0 using factoring and quadratic formula, and check your answer."
    },
    {
      label: "Physics Velocity",
      icon: Atom,
      content: "A vehicle accelerates uniformly from rest to 20 m/s in 5 seconds. Calculate the acceleration and distance traveled."
    },
    {
      label: "Chemistry Balancing",
      icon: BookOpen,
      content: "Balance the reaction: Fe + O2 -> Fe2O3 and calculate how many moles of Fe are needed for 4 moles of Fe2O3."
    },
    {
      label: "Python Coding",
      icon: Code,
      content: "Write a recursive Python function to find the N-th Fibonacci number with memoization."
    }
  ];

  const handleInsertSymbol = (symbol: string) => {
    setText((prev) => prev + symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmitText(text.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100">Type or Paste Homework Question</h3>
            <p className="text-xs text-slate-400">Claude-style clean editor with Math & LaTeX support</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mr-1">Insert Symbols:</span>
          {['x²', '√x', 'π', 'θ', 'Δ', '∫', '±', '≠', '≤', '≥', '→', 'λ'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleInsertSymbol(` ${sym} `)}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded font-mono text-indigo-300 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your homework question here (e.g. math equations, word problems, physics questions, coding assignments)..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/50 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans leading-relaxed"
          />
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-medium">Or select an example problem:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((sample, idx) => {
              const IconComp = sample.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(sample.content)}
                  className="p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-indigo-500/30 rounded-xl text-left transition-all text-xs flex items-center gap-2 group"
                >
                  <IconComp className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 line-clamp-1 font-medium">{sample.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Understanding Question...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Understand & Solve <Sparkles className="w-4 h-4 text-indigo-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
