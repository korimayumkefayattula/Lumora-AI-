import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, ChevronRight, ArrowLeft, 
  Target, BookOpen, Clock, Brain, Compass, Check, X
} from 'lucide-react';
import LumoraLogo from '../LumoraLogo';
import { useStudentProfile } from '../../context/StudentProfileContext';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  initialName?: string;
}

const ACHIEVE_OPTIONS = [
  { id: 'Improve grades', title: 'Improve grades', desc: 'Score higher on tests & class assignments', icon: '📈' },
  { id: 'Prepare for exams', title: 'Prepare for exams', desc: 'Targeted preparation for finals or boards', icon: '🎯' },
  { id: 'Understand difficult topics', title: 'Understand difficult topics', desc: 'Break down complex derivations & concepts', icon: '💡' },
  { id: 'Build better study habits', title: 'Build better study habits', desc: 'Consistent daily routines with active recall', icon: '⏰' },
  { id: 'Complete homework', title: 'Complete homework', desc: 'Step-by-step guidance without just copying', icon: '📚' },
  { id: 'General learning', title: 'General learning', desc: 'Curiosity-driven self-paced exploration', icon: '🌱' }
];

const GRADE_OPTIONS = [
  { id: 'Middle School (Class 6-8)', title: 'Middle School', sub: 'Class 6 - 8' },
  { id: 'High School (Class 9-10)', title: 'High School', sub: 'Class 9 - 10' },
  { id: 'Senior Secondary (Class 11-12)', title: 'Senior Secondary', sub: 'Class 11 - 12' },
  { id: 'College / University', title: 'Higher Education', sub: 'College / Undergraduate' },
  { id: 'Competitive Exam Prep', title: 'Competitive Exam Prep', sub: 'SAT, JEE, NEET, AP Exams' }
];

const SUBJECT_OPTIONS = [
  { id: 'Mathematics', name: 'Mathematics', icon: '📐' },
  { id: 'Physics', name: 'Physics', icon: '⚡' },
  { id: 'Chemistry', name: 'Chemistry', icon: '🧪' },
  { id: 'Biology', name: 'Biology', icon: '🧬' },
  { id: 'Computer Science', name: 'Computer Science', icon: '💻' },
  { id: 'English / Literature', name: 'English & Literature', icon: '📖' },
  { id: 'History / Social Studies', name: 'Social Studies & History', icon: '🌍' },
  { id: 'Economics', name: 'Economics & Commerce', icon: '📊' }
];

const TIME_OPTIONS = [
  { id: '15 minutes', title: '15 minutes / day', desc: 'Bite-sized active recall' },
  { id: '30 minutes', title: '30 minutes / day', desc: 'Focused concept review' },
  { id: '45 minutes', title: '45 minutes / day', desc: 'Balanced lesson & quiz' },
  { id: '60 minutes', title: '60 minutes / day', desc: 'Comprehensive daily study' },
  { id: '90+ minutes', title: '90+ minutes / day', desc: 'Intensive exam preparation' }
];

const GOAL_OPTIONS = [
  'Ace upcoming finals & board examinations',
  'Master difficult formulas, numericals & derivations',
  'Build a consistent 7-day study streak',
  'Score in the top 90th percentile of my class',
  'Clear backlogs and master fundamental concepts'
];

export const PersonalizedOnboardingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialName = ''
}) => {
  const navigate = useNavigate();
  const { completeOnboarding, profile } = useStudentProfile();

  const [step, setStep] = useState(1); // 1: Achieve, 2: Grade, 3: Subjects, 4: Time, 5: Goals, 6: Ready
  const [studentName, setStudentName] = useState(initialName || profile.name || 'Alex');
  const [selectedAchieve, setSelectedAchieve] = useState<string[]>(['Understand difficult topics', 'Prepare for exams']);
  const [selectedGrade, setSelectedGrade] = useState<string>('Senior Secondary (Class 11-12)');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics', 'Chemistry']);
  const [selectedTime, setSelectedTime] = useState<string>('60 minutes');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Ace upcoming finals & board examinations']);
  const [targetExamText, setTargetExamText] = useState<string>('Final Exams 2026');

  if (!isOpen) return null;

  const toggleAchieve = (id: string) => {
    setSelectedAchieve(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else if (step === 5) {
      // Save and go to final confirmation
      completeOnboarding({
        name: studentName,
        classGrade: selectedGrade,
        subjects: selectedSubjects,
        learningGoals: selectedGoals,
        dailyStudyTime: selectedTime,
        targetExam: targetExamText || 'Finals 2026'
      });
      setStep(6);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    if (onClose) onClose();
    navigate('/student');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header & Progress */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LumoraLogo size="sm" />
            <span className="text-xs font-semibold text-slate-400">
              Personalized Setup
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  step === s
                    ? 'w-6 bg-blue-600'
                    : step > s
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">

          {/* SCREEN 1: Welcome & Achievement */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 1 of 5
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome to LumoraAI 👋
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  What would you like to achieve in your study workspace?
                </p>
              </div>

              <div className="pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {ACHIEVE_OPTIONS.map((opt) => {
                  const isChecked = selectedAchieve.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleAchieve(opt.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 text-left ${
                        isChecked
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{opt.title}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 2: Grade / Class */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 2 of 5
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  What class or grade are you in?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  LumoraAI adapts explanations, formulas, and quiz depth to your curriculum level.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {GRADE_OPTIONS.map((g) => {
                  const isSelected = selectedGrade === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGrade(g.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {g.title}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {g.sub}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 3: Subjects */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 3 of 5
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  What subjects do you study?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Select all that apply. You can add or modify subjects anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {SUBJECT_OPTIONS.map((s) => {
                  const isSelected = selectedSubjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSubject(s.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-100 ring-1 ring-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-xs font-bold flex-1 truncate">{s.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 4: Daily Available Study Time */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 4 of 5
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  How much time can you study each day?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  We'll generate a realistic, non-overloaded daily schedule tailored to your pace.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {TIME_OPTIONS.map((t) => {
                  const isSelected = selectedTime === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTime(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {t.title}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {t.desc}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCREEN 5: Goals & Target Exam */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step 5 of 5
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  What are your key goals?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Tell us what milestone you are working toward.
                </p>
              </div>

              <div className="space-y-2">
                {GOAL_OPTIONS.map((g) => {
                  const isChecked = selectedGoals.includes(g);
                  return (
                    <div
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white pr-2">
                        {g}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upcoming Exam / Target Milestone (Optional)
                </label>
                <input
                  type="text"
                  value={targetExamText}
                  onChange={(e) => setTargetExamText(e.target.value)}
                  placeholder="e.g. CBSE Class 12 Boards / Finals in March"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* SCREEN 6: Final Ready Screen */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Setup Complete
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Your personalized learning workspace is ready.
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We've configured your daily study plan, calibrated the AI Tutor to your grade level, and prepared targeted revision modules for {selectedSubjects.join(', ')}.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Curriculum:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Study Target:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrolled Subjects:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedSubjects.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          {step > 1 && step < 6 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>{step === 5 ? 'Create My Workspace' : 'Continue'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
