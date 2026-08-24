import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Bookmark, RefreshCw, Trophy, Target, BarChart2, ShieldAlert } from 'lucide-react';
import { QuizQuestion, QuizAttempt } from '../types';

export default function MockTestsPage() {
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Exam Ready'>('Exam Ready');
  const [examStarted, setExamStarted] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'A particle moves along a straight line with velocity v = 3t^2 - 6t. What is the acceleration at t = 2s?',
      type: 'mcq',
      options: ['0 m/s²', '6 m/s²', '12 m/s²', '18 m/s²'],
      correctAnswer: '6 m/s²',
      explanation: 'Acceleration a = dv/dt = d(3t^2 - 6t)/dt = 6t - 6. At t = 2s, a = 6(2) - 6 = 6 m/s².'
    },
    {
      id: 'q2',
      question: 'Which law states that the induced electromotive force in any closed circuit is equal to the negative rate of change of magnetic flux?',
      type: 'mcq',
      options: ['Ampere Law', 'Faraday Law of Induction', 'Gauss Law', 'Coulomb Law'],
      correctAnswer: 'Faraday Law of Induction',
      explanation: 'Faraday Law states e = -dΦ/dt.'
    },
    {
      id: 'q3',
      question: 'What is the SI unit of Magnetic Permeability μ₀?',
      type: 'mcq',
      options: ['Tesla / meter', 'Henry / meter', 'Weber / meter²', 'Farad / meter'],
      correctAnswer: 'Henry / meter',
      explanation: 'The SI unit of magnetic permeability is Henry per meter (H/m).'
    },
    {
      id: 'q4',
      question: 'Assertion (A): Two electric field lines never cross each other.\nReason (R): At the point of intersection, there would be two directions of electric field, which is impossible.',
      type: 'assertion_reason',
      options: [
        'Both A and R are true, and R is the correct explanation of A',
        'Both A and R are true, but R is NOT the correct explanation of A',
        'A is true but R is false',
        'A is false but R is true'
      ],
      correctAnswer: 'Both A and R are true, and R is the correct explanation of A',
      explanation: 'Electric field vector at any point is unique.'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examSubmitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, secondsRemaining]);

  const handleStartExam = () => {
    setSecondsRemaining(timeLimitMinutes * 60);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setExamSubmitted(false);
    setExamResult(null);
    setExamStarted(true);
  };

  const handleSelectOption = (qId: string, option: string) => {
    setUserAnswers({ ...userAnswers, [qId]: option });
  };

  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview({ ...markedForReview, [qId]: !markedForReview[qId] });
  };

  const handleSubmitExam = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const timeTaken = timeLimitMinutes * 60 - secondsRemaining;

    const result: QuizAttempt = {
      id: Date.now().toString(),
      title: `${selectedSubject} Board Pattern Mock Exam`,
      subject: selectedSubject,
      totalQuestions: questions.length,
      score,
      percentage,
      timeTakenSeconds: timeTaken,
      weakTopics: percentage < 75 ? ['Kinematics Numericals', 'Units & Dimensions'] : [],
      strongTopics: ['Electromagnetism', 'Faraday Laws'],
      date: new Date().toISOString().split('T')[0]
    };

    setExamResult(result);
    setExamSubmitted(true);
    setExamStarted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Lumora Exam Simulator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Full-Length Mock Test Engine
          </h1>
        </div>
      </div>

      {!examStarted && !examSubmitted && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Configure Mock Test Parameters</h2>
            <p className="text-xs text-slate-500">Simulate real CBSE / Board examination conditions with automated timing and scoring.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
              >
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Biology</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Limit</label>
                <select 
                  value={timeLimitMinutes} 
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                >
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Exam Ready</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleStartExam}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>Start Full-Screen Mock Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ACTIVE EXAM INTERFACE */}
      {examStarted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question View */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {questions[currentIndex].question}
              </h2>

              <div className="space-y-2 pt-2">
                {questions[currentIndex].options?.map((opt, idx) => {
                  const isSelected = userAnswers[questions[currentIndex].id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(questions[currentIndex].id, opt)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-700/40 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => toggleMarkForReview(questions[currentIndex].id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1 ${
                  markedForReview[questions[currentIndex].id]
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview[questions[currentIndex].id] ? 'Marked' : 'Mark for Review'}</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Question Matrix Sidebar */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white">Question Navigator</h3>
            
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isMarked = !!markedForReview[q.id];
                const isCurrent = currentIndex === idx;

                let btnBg = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
                if (isAnswered) btnBg = 'bg-emerald-600 text-white font-bold';
                if (isMarked) btnBg = 'bg-amber-500 text-white font-bold';
                if (isCurrent) btnBg += ' ring-2 ring-blue-500 ring-offset-2';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs flex items-center justify-center ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmitExam}
              className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
            >
              Finish & Submit Test Now
            </button>
          </div>
        </div>
      )}

      {/* EXAM RESULT REPORT */}
      {examSubmitted && examResult && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{examResult.title} Results</h2>
            <p className="text-xs text-slate-500">Evaluated instantly by Lumora AI Exam Analytics</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">SCORE</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">{examResult.score} / {examResult.totalQuestions}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">ACCURACY</span>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{examResult.percentage}%</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">TIME TAKEN</span>
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">{formatTime(examResult.timeTakenSeconds)}</p>
            </div>
          </div>

          <button
            onClick={() => { setExamSubmitted(false); setExamStarted(false); }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs"
          >
            Take Another Mock Test
          </button>
        </div>
      )}
    </div>
  );
}
