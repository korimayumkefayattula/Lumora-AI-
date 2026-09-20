import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Award, Flame, Save, Check, RefreshCw, Database, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, dbUser, signInWithGoogle, syncUserProfile } = useAuth();

  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@student.com');
  const [grade, setGrade] = useState('Class 12');
  const [board, setBoard] = useState('CBSE Board');
  const [targetExam, setTargetExam] = useState('Board Exams 2026 (Score 95%+)');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
    if (dbUser) {
      if (dbUser.displayName) setName(dbUser.displayName);
      if (dbUser.classGrade) setGrade(dbUser.classGrade);
      if (dbUser.board) setBoard(dbUser.board);
      if (dbUser.targetExam) setTargetExam(dbUser.targetExam);
    }
  }, [user, dbUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user) {
        await syncUserProfile({
          displayName: name,
          classGrade: grade,
          board,
          targetExam,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Lumora Student Identity</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Student Profile
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black border-4 border-blue-500 shadow-md">
                {(name || "U")[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{name}</h2>
                {user && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-300/40">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold">{grade}</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-bold">{board}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-[11px]">
              <Database className="w-4 h-4 text-emerald-500" />
              <div className="text-left sm:text-right">
                <p className="font-bold text-slate-800 dark:text-white">Cloud SQL PostgreSQL</p>
                <p className="text-[10px] text-slate-400">Region: asia-southeast1 (Active)</p>
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Link Google Account</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grade / Class</label>
              <select 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
                <option>College / Undergraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Board</label>
              <select 
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option>CBSE Board</option>
                <option>ICSE / ISC</option>
                <option>State Board</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Target Goal</label>
            <input 
              type="text" 
              value={targetExam} 
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Saving to Cloud SQL...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Profile Updated & Synced with Database!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes & Sync</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
