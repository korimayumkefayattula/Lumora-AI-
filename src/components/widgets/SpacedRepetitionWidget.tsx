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
        {/* Flashcard Frame */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[160px] p-5 rounded-2xl border cursor-pointer relative flex flex-col justify-between transition-all duration-300 transform perspective-1000 ${
            theme === 'focus'
              ? 'bg-[#201c18] border-[#382e25]'
              : isFlipped
              ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-700'
              : 'bg-gradient-to-br from-cyan-50/60 to-blue-50/40 dark:bg-slate-800/60 border-cyan-100 dark:border-slate-700'
          }`}
        >
          {/* Top Label */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 theme-focus:text-amber-400">
              {currentCard.subject} • Card {currentIndex + 1}/{cards.length}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <RotateCw className="w-3 h-3" />
              <span>{isFlipped ? 'Answer' : 'Tap to reveal'}</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="my-2">
            <p className={`font-bold text-xs sm:text-sm leading-relaxed ${
              isFlipped
                ? 'text-cyan-100'
                : 'text-slate-900 dark:text-white theme-focus:text-amber-100'
            }`}>
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
          </div>

          {/* Bottom Prompt */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-400 theme-focus:text-amber-300/60">
              {currentCard.dueIn}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`w-1.5 h-1.5 rounded-full ${
                    lvl <= currentCard.masteryLevel
                      ? 'bg-cyan-500 theme-focus:bg-amber-400'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating Buttons (Shown when flipped) */}
        {isFlipped ? (
          <div className="grid grid-cols-3 gap-2 animate-fade-in">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('hard');
              }}
              className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors"
            >
              Hard (10m)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('good');
              }}
              className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
            >
              Good (1d)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRate('easy');
              }}
              className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
            >
              Easy (4d)
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/student/flashcards')}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 theme-focus:bg-amber-600 theme-focus:hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>Open Complete Flashcard Deck</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </WidgetContainer>
  );
};
