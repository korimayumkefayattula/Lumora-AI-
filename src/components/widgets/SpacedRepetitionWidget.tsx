import React, { useState } from 'react';
import { Layers, RotateCw, Check, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WidgetContainer } from './WidgetContainer';
import { useTheme } from '../../context/ThemeContext';
import { FlashcardItem } from './types';
import confetti from 'canvas-confetti';

export const SpacedRepetitionWidget: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [cards, setCards] = useState<FlashcardItem[]>([
    {
      id: 'fc-1',
      subject: 'Linear Algebra',
      question: 'What constitutes an Eigenvector of a linear transformation matrix A?',
      answer: 'A non-zero vector v such that Av = λv, where λ is a scalar known as the Eigenvalue.',
      dueIn: 'Due today',
      masteryLevel: 4,
    },
    {
      id: 'fc-2',
      subject: 'Organic Chemistry',
      question: 'What is the primary difference between SN1 and SN2 reaction mechanisms?',
      answer: 'SN1 is a two-step mechanism with a carbocation intermediate (unimolecular rate), while SN2 is a one-step concerted backside attack (bimolecular rate).',
      dueIn: 'Due today',
      masteryLevel: 3,
    },
    {
      id: 'fc-3',
      subject: 'Web Engineering',
      question: 'What is the purpose of React reconciliation and the Virtual DOM tree?',
      answer: 'To compute the minimal set of real DOM mutations needed by diffing the newly rendered tree against the previous fiber tree.',
      dueIn: 'Due in 2h',
      masteryLevel: 5,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const currentCard = cards[currentIndex];

  const handleRate = (rating: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setCompletedCount((prev) => prev + 1);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      // Loop back or mark finished
      setCurrentIndex(0);
    }
  };

  return (
    <WidgetContainer
      id="widget-spaced-repetition"
      title="Spaced Repetition & Recall"
      subtitle={`${cards.length} flashcards due for optimal retention`}
      icon={Layers}
      badge={`${completedCount}/${cards.length} Reviewed`}
      badgeColor="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30"
    >
      <div className="space-y-4">
        {/* Flashcard Frame - Glassmorphic / Claymorphic Tactile Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[170px] p-5 rounded-3xl cursor-pointer relative flex flex-col justify-between transition-all duration-300 transform clay-surface hover:scale-[1.01] active:scale-[0.99] ${
            theme === 'focus'
              ? 'border border-amber-500/30 text-amber-100 bg-gradient-to-br from-[#26201a] to-[#171310]'
              : isFlipped
              ? 'bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-cyan-950/90 text-white border border-cyan-500/40 shadow-[0_16px_35px_rgba(6,182,212,0.2)]'
              : 'glass-panel bg-gradient-to-br from-cyan-50/70 via-white/50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/60 dark:border-white/10'
          }`}
        >
          {/* Top Label */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full clay-pill bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 theme-focus:text-amber-400 border border-cyan-500/30">
              {currentCard.subject} • Card {currentIndex + 1}/{cards.length}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded-full neuro-inset">
              <RotateCw className="w-3 h-3 text-cyan-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{isFlipped ? 'Answer' : 'Tap to reveal'}</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="my-3">
            <p className={`font-bold text-sm sm:text-base leading-relaxed ${
              isFlipped
                ? 'text-cyan-200 drop-shadow-xs'
                : 'text-slate-900 dark:text-white theme-focus:text-amber-100'
            }`}>
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
          </div>

          {/* Bottom Prompt with Recessed Neuromorphic Dots */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-white/10">
            <span className="text-[10px] font-bold text-slate-400 theme-focus:text-amber-300/60">
              Retention target: {currentCard.dueIn}
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-full neuro-inset">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`w-2 h-2 rounded-full transition-all ${
                    lvl <= currentCard.masteryLevel
                      ? 'bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                      : 'bg-slate-300/60 dark:bg-slate-700/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating Buttons (Shown when flipped) - 3D Clay Buttons */}
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-2.5 animate-fade-in">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('hard');
              }}
              className="py-2.5 px-3 rounded-2xl clay-btn bg-gradient-to-b from-rose-500 to-rose-600 text-white font-extrabold text-xs shadow-[0_8px_16px_rgba(244,63,94,0.3)]"
            >
              Hard (10m)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('good');
              }}
              className="py-2.5 px-3 rounded-2xl clay-btn bg-gradient-to-b from-blue-500 to-blue-600 text-white font-extrabold text-xs shadow-[0_8px_16px_rgba(59,130,246,0.3)]"
            >
              Good (1d)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('easy');
              }}
              className="py-2.5 px-3 rounded-2xl clay-btn bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-extrabold text-xs shadow-[0_8px_16px_rgba(16,185,129,0.3)]"
            >
              Easy (4d)
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/student/flashcards')}
            className="w-full py-3 rounded-2xl clay-btn bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
          >
            <span>Open Complete Flashcard Deck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </WidgetContainer>
  );
};
