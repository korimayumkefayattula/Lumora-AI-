import React, { useState, useEffect } from 'react';
import { 
  Trophy, Clock, Users, Award, Play, CheckCircle2, 
  XCircle, AlertCircle, ArrowRight, RotateCcw, Flame, 
  Sparkles, ShieldCheck, ChevronRight, Zap, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPETITIONS_DATA, CompetitionEvent, CompetitionQuestion } from '../data/competitionsData';
import { useStudentProfile } from '../context/StudentProfileContext';

export default function CompetitionsPage() {
  const navigate = useNavigate();
  const { profile } = useStudentProfile();
  
  const [activeCompetition, setActiveCompetition] = useState<CompetitionEvent | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Timer loop for active competition
  useEffect(() => {
    let interval: any = null;
    if (activeCompetition && !isFinished && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            handleFinishCompetition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCompetition, isFinished, timeRemainingSeconds]);

  const handleStartCompetition = (comp: CompetitionEvent) => {
    setActiveCompetition(comp);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeRemainingSeconds(comp.durationMinutes * 60);
    setIsFinished(false);
    setFinalScore(0);
  };

  const handleSelectOption = (optIndex: number) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleFinishCompetition = () => {
    if (!activeCompetition) return;
    let score = 0;
    activeCompetition.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += q.points;
      }
    });

    // Speed bonus
    if (timeRemainingSeconds > 180 && score > 0) {
      score += 50; // Speed blitz bonus
    }

    setFinalScore(score);
    setIsFinished(true);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>National Student League • Academic Arena</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Subject Competitions & Olympiad Showdowns
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Compete in real-time against top students nationwide in Physics, Calculus, Organic Chemistry, and Biology. Earn national ranks, XP badges, and verified mastery certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student/leaderboard')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-rose-500 transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-rose-500" />
            <span>All-India Leaderboard</span>
          </button>
        </div>
      </div>

      {!activeCompetition ? (
        <>
          {/* Featured Competition Hero Card */}
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-950 text-white shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider">
                  Live National Event
                </span>
              </div>
              <span className="text-xs text-blue-200 font-bold">
                Closes in 3 hours 45 mins
              </span>
            </div>

            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                National Physics Mechanics Speed Derby 2026
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
                Multi-concept challenge testing rotational inertia, celestial gravitational mechanics, and harmonic motion. Fast solvers earn an extra 50 Speed Blitz points!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[10px] uppercase font-bold text-blue-200">Competitors</div>
                <div className="text-lg sm:text-xl font-black">3,420+ Joined</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[10px] uppercase font-bold text-blue-200">Time Limit</div>
                <div className="text-lg sm:text-xl font-black">10 Minutes</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[10px] uppercase font-bold text-blue-200">Prize Pool</div>
                <div className="text-lg sm:text-xl font-black">2,500 XP</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-[10px] uppercase font-bold text-blue-200">Winner Badge</div>
                <div className="text-sm sm:text-base font-bold text-amber-300 truncate">Newtonian Gold</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartCompetition(COMPETITIONS_DATA[0])}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm shadow-xl shadow-rose-600/40 flex items-center gap-2.5 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Enter Live Competition Now</span>
              </button>
            </div>
          </div>

          {/* List of All Subject Competitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Upcoming & Active Subject Arenas
              </h2>
              <span className="text-xs text-slate-400">
                {COMPETITIONS_DATA.length} Tournaments Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMPETITIONS_DATA.map((comp) => (
                <div
                  key={comp.id}
                  className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/60 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {comp.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        comp.status === 'LIVE NOW'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : comp.status === 'STARTING SOON'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {comp.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                        {comp.iconEmoji}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                          {comp.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {comp.startTimeText}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {comp.description}
                    </p>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400 font-bold">Questions</div>
                        <div className="font-black text-slate-900 dark:text-white">{comp.totalQuestions} Questions</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400 font-bold">Duration</div>
                        <div className="font-black text-slate-900 dark:text-white">{comp.durationMinutes} Mins</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400 font-bold">XP Bounty</div>
                        <div className="font-black text-rose-500">+{comp.prizePoolXP} XP</div>
                      </div>
                    </div>

                    {/* Leaderboard preview */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Current Leaderboard Top 3:</div>
                      {comp.leaderboardPreview.slice(0, 3).map(lead => (
                        <div key={lead.rank} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                          <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <span className="text-[10px] text-amber-500 font-black">#{lead.rank}</span>
                            <span>{lead.name}</span>
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-500">{lead.score} pts ({lead.timeTakenSec}s)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {comp.totalParticipants.toLocaleString()} enrolled
                    </span>
                    <button
                      onClick={() => handleStartCompetition(comp)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Challenge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* LIVE ARENA EXAM RUNNER */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Timer Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{activeCompetition.iconEmoji}</div>
              <div>
                <h3 className="font-extrabold text-sm text-white">{activeCompetition.title}</h3>
                <span className="text-[11px] text-slate-400">Question {currentQIndex + 1} of {activeCompetition.questions.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 font-mono font-black text-sm border border-rose-500/40">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to abandon the competition? Your current score will be recorded.")) {
                    setActiveCompetition(null);
                  }
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Exit
              </button>
            </div>
          </div>

          {!isFinished ? (
            /* Question Box */
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>QUESTION {currentQIndex + 1}</span>
                <span className="text-rose-500">+{activeCompetition.questions[currentQIndex].points} Points</span>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {activeCompetition.questions[currentQIndex].question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {activeCompetition.questions[currentQIndex].options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30"
                >
                  Previous Question
                </button>

                {currentQIndex < activeCompetition.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all active:scale-95"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleFinishCompetition}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/40 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Submit & Calculate Rank</span>
                    <Trophy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* FINISHED RESULT SCREEN */
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 animate-fade-in text-center">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-4xl shadow-xl">
                🏆
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase">
                  Competition Completed!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Score: {finalScore} / {activeCompetition.questions.length * 100 + 50} Points
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Estimated National Percentile: <span className="font-extrabold text-emerald-500">96.4th Percentile</span>
                </p>
              </div>

              {/* Reward Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Rank Awarded</div>
                  <div className="text-lg font-black text-amber-500">AIR #42</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">XP Credited</div>
                  <div className="text-lg font-black text-rose-500">+{finalScore * 2} XP</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Badge Unlocked</div>
                  <div className="text-sm font-bold text-blue-500 truncate">{activeCompetition.topBadge}</div>
                </div>
              </div>

              {/* Solutions & Explanations Review */}
              <div className="space-y-4 text-left pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Questions & Rigorous Derivation Review:
                </h3>

                {activeCompetition.questions.map((q, idx) => {
                  const studentAns = selectedAnswers[idx];
                  const isCorrect = studentAns === q.correctIndex;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Question {idx + 1}</span>
                        {isCorrect ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.points})
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.question}</div>
                      
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Correct Answer: {q.options[q.correctIndex]}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveCompetition(null)}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-700 transition-all"
                >
                  Return to Arenas
                </button>
                <button
                  onClick={() => navigate('/student/leaderboard')}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all"
                >
                  View Global Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
