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
        {/* Concept Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'focus'
            ? 'bg-[#201c18] border-[#382e25]'
            : 'bg-gradient-to-br from-purple-50/60 to-indigo-50/40 dark:bg-slate-800/60 border-purple-100 dark:border-slate-700/70'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 theme-focus:text-amber-400">
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
              className="p-1 rounded-md text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
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

        {/* Micro Quiz */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 theme-focus:text-amber-100">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500 theme-focus:text-amber-400" />
            <span>Check your understanding: {concept.question}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {concept.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === concept.correctIndex;

              let style = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300 theme-focus:bg-[#201c18] theme-focus:border-[#382e25]';

              if (hasAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed animate-fade-in ${
              selectedOption === concept.correctIndex
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-500/30 text-amber-800 dark:text-amber-200'
            }`}>
              <strong>Insight:</strong> {concept.funFact}
            </div>
          )}
        </div>

        {/* Deep Dive Action */}
        <button
          onClick={() => navigate('/student/concept-explorer')}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 theme-focus:bg-amber-600 theme-focus:hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>Explore in 3D Concept Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </WidgetContainer>
  );
};
