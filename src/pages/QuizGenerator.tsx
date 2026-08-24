import React, { useState } from 'react';
import { TestTube, Play, Sparkles, Loader2, CheckCircle2, XCircle, ArrowRight, RefreshCw, Award } from 'lucide-react';
import confetti from "canvas-confetti";

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<{ title: string, questions: QuizQuestion[] } | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const generateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    
    setLoading(true);
    setQuizData(null);
    setShowResult(false);
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numberOfQuestions: numQuestions })
      });
      const data = await res.json();
      if (data.questions) {
        setQuizData(data);
      } else {
        alert(data.error || "Failed to generate quiz");
      }
    } catch(err) {
      alert("Error reaching server");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    setIsAnswerRevealed(true);
    
    if (idx === quizData!.questions[currentQuestionIdx].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < quizData!.questions.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setShowResult(true);
      if (score + (selectedOption === quizData!.questions[currentQuestionIdx].correctAnswerIndex ? 1 : 0) > quizData!.questions.length * 0.7) {
         confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#60a5fa', '#34d399', '#a78bfa'] });
      }
    }
  };

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
             <TestTube className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">AI Quiz Generator</h1>
        </div>

        {!quizData && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
             <div className="text-center mb-8">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Generate a custom quiz</h2>
               <p className="text-slate-500 text-sm mt-1">Test your knowledge on any topic with AI-generated questions</p>
             </div>
             
             <form onSubmit={generateQuiz} className="space-y-6 max-w-xl mx-auto">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic or Chapter</label>
                 <input 
                   type="text" 
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                   placeholder="e.g. Newton's Laws of Motion, World War II"
                   className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                   <select 
                     value={difficulty} 
                     onChange={e => setDifficulty(e.target.value)}
                     className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                   >
                     <option value="beginner">Beginner</option>
                     <option value="intermediate">Intermediate</option>
                     <option value="advanced">Advanced (Board Level)</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Questions</label>
                   <select 
                     value={numQuestions} 
                     onChange={e => setNumQuestions(parseInt(e.target.value))}
                     className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors"
                   >
                     <option value={5}>5 Questions</option>
                     <option value={10}>10 Questions</option>
                     <option value={15}>15 Questions</option>
                   </select>
                 </div>
               </div>
               
               <button 
                 type="submit" 
                 disabled={!topic.trim()}
                 className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
               >
                 <Sparkles className="w-5 h-5" />
                 Generate Quiz
               </button>
             </form>
          </div>
        )}
        
        {loading && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center shadow-sm">
             <div className="relative mb-6">
               <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
               </div>
               <div className="absolute top-0 right-0 -mt-1 -mr-1">
                 <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
               </div>
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display mb-1">Crafting your questions...</h3>
             <p className="text-slate-500 text-sm">Our AI is analyzing the topic to create a challenging quiz.</p>
          </div>
        )}
        
        {quizData && !showResult && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in relative overflow-hidden">
             
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display truncate max-w-[70%]">{quizData.title}</h2>
               <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 font-bold px-4 py-1.5 rounded-full text-sm">
                 Question {currentQuestionIdx + 1} / {quizData.questions.length}
               </div>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
               <div 
                 className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                 style={{ width: `\${((currentQuestionIdx) / quizData.questions.length) * 100}%` }}
               />
             </div>
             
             <div className="mb-8">
               <h3 className="text-lg md:text-xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                 {quizData.questions[currentQuestionIdx].questionText}
               </h3>
             </div>
             
             <div className="space-y-3">
               {quizData.questions[currentQuestionIdx].options.map((opt, idx) => {
                 let bgClass = "bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700";
                 let textClass = "text-slate-700 dark:text-slate-300";
                 let Icon = null;
                 
                 if (isAnswerRevealed) {
                   if (idx === quizData.questions[currentQuestionIdx].correctAnswerIndex) {
                     bgClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-500";
                     textClass = "text-emerald-700 dark:text-emerald-400 font-medium";
                     Icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
                   } else if (idx === selectedOption) {
                     bgClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700";
                     textClass = "text-rose-700 dark:text-rose-400";
                     Icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
                   } else {
                     bgClass = "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-50";
                   }
                 }
                 
                 return (
                   <button 
                     key={idx}
                     onClick={() => handleOptionSelect(idx)}
                     disabled={isAnswerRevealed}
                     className={`w-full text-left p-4 rounded-xl border \${bgClass} transition-all flex items-center justify-between gap-4`}
                   >
                     <span className={textClass}>{opt}</span>
                     {Icon}
                   </button>
                 );
               })}
             </div>
             
             {isAnswerRevealed && (
               <div className="mt-8 animate-fade-in">
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
                   <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                     <Sparkles className="w-4 h-4" /> AI Explanation
                   </h4>
                   <p className="text-sm text-blue-700 dark:text-blue-400/90 leading-relaxed">
                     {quizData.questions[currentQuestionIdx].explanation}
                   </p>
                 </div>
                 
                 <button 
                   onClick={handleNext}
                   className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                   {currentQuestionIdx < quizData.questions.length - 1 ? 'Next Question' : 'View Results'}
                   <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        )}
        
        {showResult && quizData && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700 shadow-sm text-center animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <Award className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-bold font-display text-slate-800 dark:text-white mb-2">Quiz Completed!</h2>
              <p className="text-slate-500 mb-8 max-w-sm">You've finished the "{quizData.title}" assessment.</p>
              
              <div className="flex items-center justify-center gap-8 mb-10 bg-slate-50 dark:bg-slate-900/50 px-8 py-6 rounded-3xl border border-slate-100 dark:border-slate-700 w-full max-w-md mx-auto">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                  <p className="text-4xl font-display font-black text-emerald-500">{score}<span className="text-xl text-slate-300 dark:text-slate-600">/{quizData.questions.length}</span></p>
                </div>
                <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                  <p className="text-4xl font-display font-black text-blue-500">{Math.round((score / quizData.questions.length) * 100)}%</p>
                </div>
              </div>
              
              <button 
                onClick={() => setQuizData(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Another Quiz
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
