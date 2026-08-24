import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Plus, Sparkles, RefreshCw, Trash2, Edit3, Target, BookOpen } from 'lucide-react';
import { useAIProvider } from '../context/AIProviderContext';
import { StudyTask } from '../types';

export default function StudyPlannerPage() {
  const { provider, omniRouteUrl, omniRouteModel } = useAIProvider();
  const [examDate, setExamDate] = useState('2026-03-15');
  const [dailyHours, setDailyHours] = useState(5);
  const [weakSubjects, setWeakSubjects] = useState('Physics Numerical, Organic Reactions');
  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState<StudyTask[]>([
    {
      id: '1',
      title: 'Physics - Electromagnetic Induction Formula Revision',
      subjectId: 'Physics',
      durationMinutes: 90,
      isCompleted: true,
      priority: 'high',
      date: '2026-02-01'
    },
    {
      id: '2',
      title: 'Chemistry - Solved PYQ Questions (2020-2024)',
      subjectId: 'Chemistry',
      durationMinutes: 90,
      isCompleted: false,
      priority: 'high',
      date: '2026-02-01'
    },
    {
      id: '3',
      title: 'Mathematics - Integration & Area Under Curves Practice',
      subjectId: 'Mathematics',
      durationMinutes: 90,
      isCompleted: false,
      priority: 'medium',
      date: '2026-02-01'
    },
    {
      id: '4',
      title: 'Biology - Diagram Practice: Human Brain & Heart',
      subjectId: 'Biology',
      durationMinutes: 60,
      isCompleted: false,
      priority: 'low',
      date: '2026-02-01'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Physics');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item: StudyTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      subjectId: newTaskSubject,
      durationMinutes: 60,
      isCompleted: false,
      priority: 'medium',
      date: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, item]);
    setNewTaskTitle('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: weakSubjects || "General STEM",
          timeAvailable: dailyHours,
          topicKeywords: weakSubjects,
          difficulty: "intermediate",
          notes: `Target Exam Date: ${examDate}`,
          provider,
          omniRouteUrl,
          omniRouteModel
        })
      });

      const data = await res.json();
      if (data?.tasks && Array.isArray(data.tasks)) {
        const generatedTasks: StudyTask[] = data.tasks.map((t: any, index: number) => ({
          id: Date.now().toString() + index,
          title: t.title || 'Targeted Revision Session',
          subjectId: weakSubjects.includes('Physics') ? 'Physics' : weakSubjects.includes('Math') ? 'Mathematics' : 'Chemistry',
          durationMinutes: t.durationMinutes || 60,
          isCompleted: false,
          priority: t.priority || 'high',
          date: new Date().toISOString().split('T')[0]
        }));
        setTasks(generatedTasks);
      }
    } catch (err) {
      console.warn("Generate plan fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Lumora AI Adaptive Study Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Study Timetable & Planner
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Card: AI Schedule Generator */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Generate AI Custom Schedule</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Target Exam Date</label>
              <input 
                type="date" 
                value={examDate} 
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Daily Study Target (Hours)</label>
              <input 
                type="number" 
                min={1} 
                max={16} 
                value={dailyHours} 
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Weak Topics / Priority Focus</label>
              <input 
                type="text" 
                value={weakSubjects} 
                onChange={(e) => setWeakSubjects(e.target.value)}
                placeholder="e.g. Organic Reactions, Kinematics"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
              />
            </div>

            <button 
              onClick={handleGeneratePlan} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Optimizing Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Adaptive Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Timetable View */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Progress Header */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Today's Progress</span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{completedCount} of {tasks.length} Completed</h3>
            </div>
            <div className="w-24 bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Quick Task Add Form */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input 
              type="text"
              placeholder="Add quick study task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
            />
            <select
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white"
            >
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Mathematics</option>
              <option>Biology</option>
            </select>
            <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Task Cards */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.isCompleted 
                    ? 'bg-slate-50 dark:bg-slate-700/20 border-slate-200 dark:border-slate-700 opacity-70' 
                    : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(task.id)} className="text-blue-600 dark:text-blue-400">
                    {task.isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        {task.subjectId}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.durationMinutes} mins
                      </span>
                    </div>
                    <h3 className={`font-bold text-xs mt-1 ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                      {task.title}
                    </h3>
                  </div>
                </div>

                <button onClick={() => handleDeleteTask(task.id)} className="text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
