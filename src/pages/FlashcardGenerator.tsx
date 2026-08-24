import React, { useState } from 'react';
import { Layers, Sparkles, Loader2, ArrowRight, ArrowLeft, RotateCw, Check, X, RefreshCw } from 'lucide-react';
import confetti from "canvas-confetti";

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardGenerator() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numCards, setNumCards] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState<{ title: string, flashcards: Flashcard[] } | null>(null);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const generateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    
    setLoading(true);
    setDeck(null);
    setCurrentIdx(0);
    setIsFlipped(false);
    setShowSummary(false);
    setKnownCount(0);
    
    try {
      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numberOfCards: numCards })
      });
      const data = await res.json();
      if (data.flashcards) {
        setDeck(data);
      } else {
        alert(data.error || "Failed to generate flashcards");
      }
    } catch(err) {
      alert("Error reaching server");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = (knewIt: boolean) => {
    if (knewIt) setKnownCount(k => k + 1);
    
    if (currentIdx < deck!.flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIdx(i => i + 1), 150);
    } else {
      setShowSummary(true);
      if (knownCount + (knewIt ? 1 : 0) > deck!.flashcards.length * 0.8) {
         confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
             <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">Smart Flashcards</h1>
        </div>

        {!deck && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
             <div className="text-center mb-8">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Generate a Flashcard Deck</h2>
               <p className="text-slate-500 text-sm mt-1">AI creates perfect spaced-repetition cards for active recall.</p>
             </div>
             
             <form onSubmit={generateCards} className="space-y-6 max-w-xl mx-auto">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic or Chapter</label>
                 <input 
                   type="text" 
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                   placeholder="e.g. Human Anatomy, Organic Chemistry"
                   className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                   <select 
                     value={difficulty} 
                     onChange={e => setDifficulty(e.target.value)}
                     className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                   >
                     <option value="beginner">Beginner</option>
                     <option value="intermediate">Intermediate</option>
                     <option value="advanced">Advanced</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Cards</label>
                   <select 
                     value={numCards} 
                     onChange={e => setNumCards(parseInt(e.target.value))}
                     className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-purple-500 transition-colors"
                   >
                     <option value={10}>10 Cards</option>
                     <option value={20}>20 Cards</option>
                     <option value={30}>30 Cards</option>
                   </select>
                 </div>
               </div>
               
               <button 
                 type="submit" 
                 disabled={!topic.trim()}
                 className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
               >
                 <Sparkles className="w-5 h-5" />
                 Generate Deck
               </button>
             </form>
          </div>
        )}
        
        {loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="relative mb-6">
               <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
               </div>
               <div className="absolute top-0 right-0 -mt-1 -mr-1">
                 <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
               </div>
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display mb-1">Synthesizing concepts...</h3>
             <p className="text-slate-500 text-sm">Extracting high-yield facts for your flashcards.</p>
          </div>
        )}
        
        {deck && !showSummary && (
          <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in">
             
             <div className="w-full flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display truncate">{deck.title}</h2>
               <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 font-bold px-4 py-1.5 rounded-full text-sm">
                 {currentIdx + 1} / {deck.flashcards.length}
               </div>
             </div>
             
             {/* Flashcard 3D Container */}
             <div className="w-full aspect-[4/3] sm:aspect-video perspective-1000 mb-8">
               <div 
                 onClick={() => setIsFlipped(!isFlipped)}
                 className={`w-full h-full relative transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
               >
                 {/* Front (Question) */}
                 <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl flex items-center justify-center p-8 text-center">
                   <div className="absolute top-6 left-6 text-slate-400">
                     <Layers className="w-6 h-6 opacity-50" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-display font-medium text-slate-800 dark:text-slate-100">
                     {deck.flashcards[currentIdx].front}
                   </h3>
                   <div className="absolute bottom-6 inset-x-0 text-center text-xs text-slate-400 uppercase tracking-widest font-bold">
                     Click to flip
                   </div>
                 </div>
                 
                 {/* Back (Answer) */}
                 <div className="absolute inset-0 backface-hidden bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-3xl shadow-xl flex items-center justify-center p-8 text-center rotate-y-180">
                   <div className="absolute top-6 left-6 text-purple-400">
                     <Sparkles className="w-6 h-6 opacity-50" />
                   </div>
                   <p className="text-xl md:text-2xl font-medium text-purple-900 dark:text-purple-100 leading-relaxed">
                     {deck.flashcards[currentIdx].back}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Controls */}
             <div className={`w-full flex items-center justify-center gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <button 
                 onClick={() => nextCard(false)}
                 className="flex-1 max-w-[200px] bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold py-4 rounded-2xl flex flex-col items-center gap-1 transition-colors"
               >
                 <X className="w-6 h-6" />
                 <span>Needs Review</span>
               </button>
               <button 
                 onClick={() => nextCard(true)}
                 className="flex-1 max-w-[200px] bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold py-4 rounded-2xl flex flex-col items-center gap-1 transition-colors"
               >
                 <Check className="w-6 h-6" />
                 <span>Got It</span>
               </button>
             </div>
          </div>
        )}
        
        {showSummary && deck && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700 shadow-sm text-center animate-fade-in">
            <h2 className="text-3xl font-bold font-display text-slate-800 dark:text-white mb-2">Deck Completed!</h2>
            <p className="text-slate-500 mb-8">Great job reviewing "{deck.title}"</p>
            
            <div className="w-32 h-32 mx-auto border-8 border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-8 relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-purple-500" strokeDasharray={`${(knownCount / deck.flashcards.length) * 289} 289`} strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-800 dark:text-white">{Math.round((knownCount/deck.flashcards.length)*100)}%</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mastery</p>
              </div>
            </div>
            
            <button 
              onClick={() => setDeck(null)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Study Another Topic
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
