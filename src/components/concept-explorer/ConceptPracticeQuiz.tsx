import React, { useState } from 'react';
import { ConceptQuizQuestion } from '../../types/conceptExplorer';
import { X, CheckCircle2, XCircle, ArrowRight, Trophy, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConceptPracticeQuizProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  questions: ConceptQuizQuestion[];
}

export const ConceptPracticeQuiz: React.FC<ConceptPracticeQuizProps> = ({
  isOpen,
  onClose,
  topic,
  questions
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen || !questions || questions.length === 0) return null;

  const q = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === q.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === q.correctIndex ? 1 : 0) === questions.length) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider">
              Concept Practice Check
            </span>
            <h2 className="text-base font-bold text-white">{topic}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          
          {!quizFinished ? (
            <div className="space-y-4">
              
              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200";
                  
                  if (selectedOption === idx) {
                    btnStyle = "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold";
                  }

                  if (isSubmitted) {
                    if (idx === q.correctIndex) {
                      btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                    } else if (selectedOption === idx) {
                      btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {isSubmitted && selectedOption === idx && idx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isSubmitted && (
                <div className="p-3.5 bg-slate-100 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-fade-in">
                  <strong className="block text-indigo-600 dark:text-indigo-400 font-bold">Explanation:</strong>
                  <p>{q.explanation}</p>
                </div>
              )}

              {/* Submit / Next Controls */}
              <div className="pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Finished View */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Concept Check Complete!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You scored <strong className="text-indigo-600 dark:text-indigo-400 text-sm">{score} / {questions.length}</strong> on <span className="font-bold">{topic}</span>.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Return to Map
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
