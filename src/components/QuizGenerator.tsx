import React, { useState } from "react";
import { BrainCircuit, Play, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { Subject } from "../types";

interface QuizGeneratorProps {
  subjects: Subject[];
}

export default function QuizGenerator({ subjects }: QuizGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setQuizData(null);
    setShowResults(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numberOfQuestions: 5
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Unable to generate quiz.");
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Invalid quiz format received.");
      }
      setQuizData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while generating the quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: index
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qIndex) => {
    const q = quizData?.questions[parseInt(qIndex)];
    if (q && selectedAnswers[parseInt(qIndex)] === q.correctAnswerIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="bg-slate-800 p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display tracking-tight text-white">
              AI Quiz Generator
            </h2>
            <p className="text-[11px] text-slate-300">
              Test your knowledge instantly on any topic
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {!quizData && !loading && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Topic to master
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Action potentials, React Hooks, French Revolution"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2.5 px-3.5 text-slate-700 outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2.5 px-3 text-slate-700 outline-none focus:border-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!topic.trim()}
              className="w-full bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <Play className="w-4 h-4" />
              Generate Quiz
            </button>
          </form>
        )}

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <RefreshCcw className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500 animate-pulse">Compiling questions...</p>
          </div>
        )}

        {quizData && !showResults && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{quizData.title}</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 leading-relaxed">
                {quizData.questions[currentQuestionIndex].questionText}
              </p>
              
              <div className="space-y-2">
                {quizData.questions[currentQuestionIndex].options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${
                      selectedAnswers[currentQuestionIndex] === idx 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="inline-block w-6 font-bold text-slate-400 mr-1">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}

        {quizData && showResults && (
          <div className="space-y-6">
            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-1">Quiz Completed</h3>
              <p className="text-slate-500 text-sm">
                You scored <strong className="text-slate-800 dark:text-slate-100">{score}</strong> out of {quizData.questions.length}
              </p>
            </div>

            <div className="space-y-4">
              {quizData.questions.map((q: any, idx: number) => {
                const isCorrect = selectedAnswers[idx] === q.correctAnswerIndex;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                    <div className="flex gap-2 items-start mb-2">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{q.questionText}</p>
                    </div>
                    
                    <div className="pl-6 space-y-1 mt-3">
                      <p className="text-[11px] text-slate-600">
                        <span className="font-bold">Your answer:</span> {q.options[selectedAnswers[idx]]}
                      </p>
                      {!isCorrect && (
                        <p className="text-[11px] text-emerald-600 font-medium">
                          <span className="font-bold">Correct:</span> {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 italic mt-1 bg-white/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setQuizData(null);
                setTopic("");
              }}
              className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer border border-slate-200"
            >
              Generate Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
