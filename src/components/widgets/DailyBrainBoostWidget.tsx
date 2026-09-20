import React, { useState } from 'react';
import { Lightbulb, Sparkles, ArrowRight, CheckCircle2, XCircle, HelpCircle, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const DailyBrainBoostWidget: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [xpClaimed, setXpClaimed] = useState(false);

  const concept = {
    title: 'Entropy & The Arrow of Time',
    subject: 'Thermodynamics & Information Theory',
    tag: 'Daily Concept',
    summary:
      'Entropy is a measure of molecular disorder in a closed system. According to the Second Law of Thermodynamics, total entropy always increases over time, creating the irreversible forward flow of time.',
    question: 'Why does an unbroken egg never spontaneously reassemble after cracking?',
    options: [
      'Gravitational constant reversal',
      'The Second Law of Thermodynamics (Entropy Increase)',
      'Centripetal friction loss',
      'Quantum entanglement decay',
    ],
    correctIndex: 1,
    funFact: 'Claude Shannon applied this exact statistical concept to telecommunications in 1948 to invent Information Theory!',
  };

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    if (index === concept.correctIndex && !xpClaimed) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      setXpClaimed(true);
    }
  };

  return (
    <WidgetContainer
      id="widget-daily-brain-boost"
      title="Daily Brain Boost"
      subtitle={concept.subject}
      icon={Lightbulb}
      badge="15 XP Quiz"
      badgeColor="bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/30"
    >
      <div className="space-y-4">
        {/* Concept Card - Glassmorphic Frosted Plaque with Clay Accent */}
        <div className={`p-4 rounded-3xl glass-panel relative overflow-hidden transition-all ${
          theme === 'focus'
            ? 'border-amber-500/30'
            : 'border-purple-200/50 dark:border-purple-900/30 bg-gradient-to-br from-purple-50/60 to-white/40 dark:from-purple-950/20 dark:to-slate-900/40'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full clay-pill bg-purple-500/20 text-purple-600 dark:text-purple-300 theme-focus:text-amber-400 border border-purple-500/30">
              {concept.tag}
            </span>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(concept.summary);
                  utterance.rate = 1.0;
                  window.speechSynthesis.speak(utterance);
                }
              }}
              className="w-7 h-7 rounded-xl flex items-center justify-center neuro-btn-convex text-purple-600 dark:text-purple-300 hover:scale-105 active:scale-95 transition-all"
              title="Listen to summary"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white theme-focus:text-amber-100 mb-1.5">
            {concept.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 theme-focus:text-amber-200/90 leading-relaxed">
            {concept.summary}
          </p>
        </div>

        {/* Micro Quiz with Neuromorphic Option Tiles */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 theme-focus:text-amber-100 px-1">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500 theme-focus:text-amber-400" />
            <span>Check your understanding: {concept.question}</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {concept.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === concept.correctIndex;

              let style = 'neuro-btn-convex text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white/50 dark:bg-slate-800/50';

              if (hasAnswered) {
                if (isCorrect) {
                  style = 'clay-surface bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black border border-emerald-400/40 shadow-[0_8px_16px_rgba(16,185,129,0.3)]';
                } else if (isSelected && !isCorrect) {
                  style = 'neuro-inset bg-rose-500/20 border border-rose-500/60 text-rose-600 dark:text-rose-200 font-bold';
                } else {
                  style = 'opacity-50 neuro-inset text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between ${style}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2 drop-shadow-xs" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className={`p-3 rounded-2xl glass-panel text-[11px] leading-relaxed animate-fade-in ${
              selectedOption === concept.correctIndex
                ? 'border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                : 'border-amber-500/40 text-amber-800 dark:text-amber-200'
            }`}>
              <strong className="font-extrabold">Neural Insight:</strong> {concept.funFact}
            </div>
          )}
        </div>

        {/* Deep Dive Action - 3D Clay Button */}
        <button
          onClick={() => navigate('/student/concept-explorer')}
          className="w-full py-3 rounded-2xl clay-btn bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(147,51,234,0.3)]"
        >
          <span>Explore in 3D Concept Explorer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </WidgetContainer>
  );
};
