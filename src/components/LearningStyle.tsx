import React, { useState, useEffect } from "react";
import { BrainCircuit, Check, ArrowRight } from "lucide-react";

export default function LearningStyle() {
  const [style, setStyle] = useState<string | null>(() => localStorage.getItem("socrates_learning_style"));
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      q: "When learning something new, you prefer to:",
      options: [
        { text: "Look at diagrams or pictures", type: "Visual" },
        { text: "Listen to an explanation", type: "Auditory" },
        { text: "Try it out yourself hands-on", type: "Kinesthetic" },
        { text: "Read about it in a textbook", type: "Reading/Writing" }
      ]
    },
    {
      q: "When remembering directions, you usually:",
      options: [
        { text: "Visualize the map or landmarks", type: "Visual" },
        { text: "Repeat the street names aloud", type: "Auditory" },
        { text: "Follow your gut feeling based on previous paths", type: "Kinesthetic" },
        { text: "Write them down step by step", type: "Reading/Writing" }
      ]
    },
    {
      q: "In a class, what keeps you most engaged?",
      options: [
        { text: "Slides with lots of graphs and charts", type: "Visual" },
        { text: "A passionate speaker or debate", type: "Auditory" },
        { text: "Interactive labs or group activities", type: "Kinesthetic" },
        { text: "Detailed handouts and note-taking", type: "Reading/Writing" }
      ]
    }
  ];

  const [scores, setScores] = useState<Record<string, number>>({
    Visual: 0,
    Auditory: 0,
    Kinesthetic: 0,
    "Reading/Writing": 0
  });

  const handleAnswer = (type: string) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Determine winner
      let winner = "Visual";
      let max = 0;
      for (const [key, val] of Object.entries(newScores) as [string, number][]) {
        if (val > max) {
          max = val;
          winner = key;
        }
      }
      setStyle(winner);
      localStorage.setItem("socrates_learning_style", winner);
      setIsTakingQuiz(false);
    }
  };

  if (style && !isTakingQuiz) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 mb-1">Your Learning Style</h3>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          {style}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          We'll customize AI coaching tips based on your preferred style.
        </p>
        <button 
          onClick={() => {
            setIsTakingQuiz(true);
            setCurrentQuestion(0);
            setScores({ Visual: 0, Auditory: 0, Kinesthetic: 0, "Reading/Writing": 0 });
          }}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Learning Style Assessment</h3>
      </div>
      
      {!isTakingQuiz ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Discover your unique learning style to receive personalized AI coaching and tailored study strategies.
          </p>
          <button 
            onClick={() => setIsTakingQuiz(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl flex items-center gap-2 mx-auto transition-colors"
          >
            Start Quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-4">
            {questions[currentQuestion].q}
          </p>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.type)}
                className="w-full text-left bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500 p-3 rounded-xl text-sm font-medium transition-colors"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
