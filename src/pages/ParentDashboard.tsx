import React from 'react';
import { Users, TrendingUp, Target, Clock, ShieldCheck, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const dummyData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4.2 },
  { name: 'Fri', hours: 2.0 },
  { name: 'Sat', hours: 5.5 },
  { name: 'Sun', hours: 1.0 },
];

export default function ParentDashboard() {
  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-wide uppercase text-xs mb-2">
              <ShieldCheck className="w-4 h-4" /> Guardian Portal
            </div>
            <h1 className="text-3xl font-bold font-display text-slate-800 dark:text-white">Welcome, Sarah</h1>
            <p className="text-slate-500 mt-1">Here's how Alex is progressing this week.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Student avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Alex Johnson</p>
              <p className="text-xs text-emerald-500 font-bold">Grade 11 • Science Stream</p>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
             <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
               <Clock className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Study Time</p>
               <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-white">20.5 <span className="text-base text-slate-500 font-sans font-medium">hrs</span></h3>
               <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% from last week</p>
             </div>
           </div>
           
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
             <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
               <Target className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Quiz Accuracy</p>
               <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-white">84<span className="text-base text-slate-500 font-sans font-medium">%</span></h3>
               <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5% from last week</p>
             </div>
           </div>
           
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
             <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4">
               <PieChart className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Modules Finished</p>
               <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-white">12</h3>
               <p className="text-xs text-slate-500 mt-2 font-medium">Out of 15 planned</p>
             </div>
           </div>
           
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
               <Users className="w-5 h-5" />
             </div>
             <div className="relative z-10">
               <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">Tutor Feedback</p>
               <p className="text-sm font-medium leading-relaxed">"Alex is showing great improvement in Calculus, but needs more focus on Organic Chemistry."</p>
               <button className="mt-3 text-xs bg-white text-indigo-600 font-bold px-3 py-1.5 rounded-lg">View Full Report</button>
             </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-6">Study Hours This Week</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dummyData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 6, 6]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
             <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-4">Upcoming Deadlines</h3>
             
             <div className="flex-1 space-y-4">
               <div className="flex gap-4 items-start">
                 <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center font-bold flex-col shadow-sm shrink-0">
                   <span className="text-xs uppercase">Oct</span>
                   <span className="text-sm">24</span>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Physics Mock Test</h4>
                   <p className="text-xs text-slate-500 mt-0.5">Chapters 1-4</p>
                 </div>
               </div>
               
               <div className="flex gap-4 items-start">
                 <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center font-bold flex-col shadow-sm shrink-0">
                   <span className="text-xs uppercase">Oct</span>
                   <span className="text-sm">27</span>
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Math Assignment</h4>
                   <p className="text-xs text-slate-500 mt-0.5">Integration</p>
                 </div>
               </div>
             </div>
             
             <button className="w-full mt-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
               View Full Calendar
             </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
