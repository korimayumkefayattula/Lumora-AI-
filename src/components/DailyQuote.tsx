import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function DailyQuote() {
  const quotes = [
    "You don't have to be extreme, just consistent.",
    "Every expert was once a beginner.",
    "Small steps every day equal massive results.",
    "Focus on the step in front of you, not the whole staircase.",
    "Your future self will thank you for the work you do today."
  ];
  
  const [quote, setQuote] = useState("");
  
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-[#121216]/90 border border-zinc-800/80 rounded-3xl p-4 flex items-center gap-4 mb-6 shadow-lg backdrop-blur-xl">
      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-rose-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-200 italic">"{quote}"</p>
        <p className="text-[10px] text-rose-400/90 font-bold tracking-wider uppercase mt-1">LumoraAI Mentor</p>
      </div>
    </div>
  );
}
