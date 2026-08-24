import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2, Clock, AlertTriangle, Layers, ArrowRight, Trophy } from 'lucide-react';

export default function RevisionCenterPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const cards = [
    { topic: 'Physics', title: 'Gauss Law Statement', content: 'Total electric flux through any closed surface is 1/ε₀ times net charge enclosed inside.' },
    { topic: 'Chemistry', title: 'Arrhenius Equation', content: 'k = A * e^(-Ea / RT). Describes temperature dependency of reaction rates.' },
    { topic: 'Biology', title: 'Chloroplast Thylakoids', content: 'Site of light reactions containing Photosystems I & II.' }
  ];

  const handleNext = () => {
    if (currentStep < cards.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSessionActive(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" />
            <span>Lumora Spaced Repetition Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Revision Center
          </h1>
        </div>
      </div>

      {!sessionActive ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Due Today (12 Topics)</h3>
            <p className="text-xs text-slate-500">Optimized by SuperMemo-2 Spaced Repetition algorithm.</p>
            <button 
              onClick={() => setSessionActive(true)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
            >
              Start Revision Loop
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Weak Area Drill</h3>
            <p className="text-xs text-slate-500">5 topics where recent test accuracy was below 60%.</p>
            <button 
              onClick={() => setSessionActive(true)}
              className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Drill Weak Topics
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Formula Recall</h3>
            <p className="text-xs text-slate-500">Quick-fire flashcards covering key mathematical formulas.</p>
            <button 
              onClick={() => setSessionActive(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Practice Formulas
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
          <span className="text-xs font-bold text-blue-600 uppercase">Card {currentStep + 1} of {cards.length}</span>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 space-y-3">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">{cards[currentStep].topic}</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{cards[currentStep].title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{cards[currentStep].content}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleNext} className="p-3 bg-rose-100 text-rose-800 text-xs font-bold rounded-xl hover:bg-rose-200">Hard (1 Day)</button>
            <button onClick={handleNext} className="p-3 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl hover:bg-amber-200">Good (3 Days)</button>
            <button onClick={handleNext} className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-200">Easy (7 Days)</button>
          </div>
        </div>
      )}
    </div>
  );
}
