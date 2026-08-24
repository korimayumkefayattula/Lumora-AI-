/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, Calendar, MoreVertical, Edit2, Search, AlertCircle, Clock, ChevronLeft, ChevronRight, Bell, Flag } from "lucide-react";
import { Subject, StudyTask } from "../types";

interface TaskTrackerProps {
  subjects: Subject[];
  tasks: StudyTask[];
  onAddSubject: (name: string, targetHours: number, color: string) => void;
  onDeleteSubject: (id: string) => void;
  onAddTask: (title: string, duration: number, priority: 'low' | 'medium' | 'high', subjectId: string, category?: 'Exam Prep' | 'Assignment' | 'Research' | 'Reading' | 'Writing' | 'Coding' | 'Other', dueDate?: string, notes?: string) => void;
  onToggleTaskComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const PRESET_COLORS = [
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // violet
];

export default function TaskTracker({
  subjects,
  tasks,
  onAddSubject,
  onDeleteSubject,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask,
}: TaskTrackerProps) {

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "received">("my");
  
  // Add Subject Form
  const [newSubName, setNewSubName] = useState("");
  
  // Add Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskSubId, setNewTaskSubId] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"Exam Prep" | "Assignment" | "Research" | "Reading" | "Writing" | "Coding" | "Other" | "">("");
  
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "matrix">("list");
  
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    onAddSubject(newSubName.trim(), 4, PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setNewSubName("");
    setShowAddSubject(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskSubId) return;
    onAddTask(newTaskTitle.trim(), newTaskDuration, "medium", newTaskSubId, newTaskCategory || undefined, undefined, newTaskNotes.trim());
    setNewTaskTitle("");
    setNewTaskDuration(45);
    setNewTaskNotes("");
    setNewTaskCategory("");
    setShowAddTask(false);
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.date === todayDate);
  
  const priorityValues = { high: 3, medium: 2, low: 1 };
  let sortedTasks = [...todayTasks].sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
  
  if (priorityFilter !== "all") {
    sortedTasks = sortedTasks.filter(t => t.priority === priorityFilter);
  }


  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Exam Prep': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300';
      case 'Assignment': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'Research': return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300';
      case 'Reading': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300';
      case 'Writing': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300';
      case 'Coding': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300';
    }
  };

  const formatTime = (dateStr: string, minutes: number) => {
    // mock time formatting
    return `${minutes} mins`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
      
      {/* Projects Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Projects</h2>
          <select className="bg-white dark:bg-slate-800 border border-slate-200 text-xs rounded-xl py-1.5 px-3 text-slate-600 outline-none hover:bg-slate-50 dark:bg-slate-800/50 transition-all font-medium">
            <option>All time</option>
            <option>This Week</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab("my")}
            className={`py-2 px-5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "my" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            My Project ({subjects.length})
          </button>
          <button 
            onClick={() => setActiveTab("received")}
            className={`py-2 px-5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "received" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Received (2)
          </button>
        </div>

        <div className="flex flex-col gap-4 relative pb-20">
          {subjects.map((sub) => {
            const subTasks = tasks.filter(t => t.subjectId === sub.id);
            const activeCount = subTasks.filter(t => !t.isCompleted).length;
            const subCount = subTasks.length;
            
            return (
              <div key={sub.id} className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-blue-50/50 py-1 px-2.5 rounded-lg text-blue-600">
                    <Calendar className="w-3.5 h-3.5" />
                    10 Dec 2021
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => onDeleteSubject(sub.id)}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">{sub.name}</h3>
                
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }}></span>
                    <span className="text-xs font-bold text-slate-700">Task: {activeCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-slate-700">Sub-Task: {subCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {subjects.length === 0 && (
             <div className="bg-white dark:bg-slate-800 rounded-[24px] p-8 shadow-sm border border-slate-100 dark:border-slate-700 text-center text-slate-400">
               No projects yet.
             </div>
          )}

          {/* Add Project Button */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            {!showAddSubject ? (
              <button 
                onClick={() => setShowAddSubject(true)}
                className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform"
              >
                <Plus className="w-6 h-6" />
              </button>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 z-10 flex flex-col gap-2">
                 <input 
                   autoFocus
                   type="text" 
                   value={newSubName}
                   onChange={e => setNewSubName(e.target.value)}
                   placeholder="Project Name" 
                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"
                 />
                 <div className="flex gap-2">
                   <button onClick={handleCreateSubject} className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg">Add</button>
                   <button onClick={() => setShowAddSubject(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded-lg">Cancel</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar & Tasks Section */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-6">
        
        {/* Simple Calendar View */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">
               {new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" })},{" "}
               <span className="text-slate-400 font-medium">{new Date().toLocaleDateString("en-US", { year: "2-digit", weekday: "long" })}</span>
             </h3>
             <div className="flex items-center gap-1">
               <button className="p-1 text-slate-400 hover:text-slate-800 dark:text-slate-100"><ChevronLeft className="w-5 h-5" /></button>
               <button className="p-1 text-slate-400 hover:text-slate-800 dark:text-slate-100"><ChevronRight className="w-5 h-5" /></button>
             </div>
           </div>
           
           <div className="grid grid-cols-7 gap-1 text-center mb-2">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
               <div key={d} className="text-[11px] font-semibold text-slate-400">{d}</div>
             ))}
             
             {/* Dynamic calendar dates */}
             {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
               <div key={`empty-${i}`} className="py-2 text-sm font-semibold text-slate-400 opacity-0">.</div>
             ))}
             
             {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
               const day = i + 1;
               const isToday = day === new Date().getDate();
               const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
               const dayTasks = tasks.filter(t => t.date === dateStr);
               const hasTasks = dayTasks.length > 0;
               const color = hasTasks ? subjects.find(s => s.id === dayTasks[0].subjectId)?.color || '#3b82f6' : undefined;

               if (isToday) {
                 return (
                   <div key={day} className="w-10 h-10 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold relative">
                     {day}
                   </div>
                 );
               }
               
               return (
                 <div key={day} className="py-2 text-sm font-semibold text-slate-700 relative">
                   {day}
                   {hasTasks && (
                     <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: color }}></div>
                   )}
                 </div>
               );
             })}
           </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">Today's Task</h2>
            <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="ml-2 text-xs font-semibold px-2 py-1 rounded border bg-white border-slate-200 text-slate-600 hover:text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'matrix' : 'list')}
              className="ml-2 text-xs font-semibold px-2 py-1 rounded border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              {viewMode === 'list' ? 'Matrix View' : 'List View'}
            </button>
          </div>
          
          <div className="relative">
             <button 
                onClick={() => setShowAddTask(!showAddTask)}
                className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-200 hover:scale-105 transition-transform"
             >
               <Plus className="w-5 h-5" />
             </button>
             
             {showAddTask && (
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 absolute top-12 right-0 w-64 z-10 flex flex-col gap-2">
                 <input 
                   autoFocus
                   type="text" 
                   value={newTaskTitle}
                   onChange={e => setNewTaskTitle(e.target.value)}
                   placeholder="Task Title" 
                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"
                 />
                 <input 
                   type="text" 
                   value={newTaskNotes}
                   onChange={e => setNewTaskNotes(e.target.value)}
                   placeholder="Study notes or link (optional)" 
                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"
                 />
                 <select 
                   value={newTaskSubId} 
                   onChange={e => setNewTaskSubId(e.target.value)}
                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"
                 >
                   <option value="">Select Project...</option>
                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
                 <select
                   value={newTaskCategory}
                   onChange={e => setNewTaskCategory(e.target.value as any)}
                   className="text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg outline-none"
                 >
                   <option value="">Select Category (Optional)...</option>
                   <option value="Exam Prep">Exam Prep</option>
                   <option value="Assignment">Assignment</option>
                   <option value="Research">Research</option>
                   <option value="Reading">Reading</option>
                   <option value="Writing">Writing</option>
                   <option value="Coding">Coding</option>
                   <option value="Other">Other</option>
                 </select>
                 <div className="flex gap-2">
                   <button onClick={handleCreateTask} className="flex-1 bg-blue-500 text-white text-xs font-bold py-2 rounded-lg">Add</button>
                   <button onClick={() => setShowAddTask(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded-lg">Cancel</button>
                 </div>
              </div>
             )}
          </div>
        </div>

        <div className={`overflow-y-auto pr-2 pb-6 max-h-[400px] ${viewMode === 'matrix' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-6'}`}>
          {sortedTasks.length === 0 && (
             <div className="text-center py-6 text-slate-400 text-sm col-span-2">
               No tasks scheduled for today.
             </div>
          )}
          
          {viewMode === 'list' ? (
            sortedTasks.map((task, idx) => {
              const sub = subjects.find(s => s.id === task.subjectId);
              
              // Alternate visual styles based on index to mimic screenshot
              const type = idx % 4 === 0 ? 'todo' : idx % 4 === 1 ? 'event' : idx % 4 === 2 ? 'reminder' : 'milestone';
              
              return (
                <div key={task.id} className="flex gap-4 group">
                  <div className="pt-1">
                    <button 
                      onClick={() => onToggleTaskComplete(task.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.isCompleted ? 'bg-blue-500 border-blue-500' : 'border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {task.isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 border-b border-slate-50 dark:border-slate-700/50 pb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      {type === 'todo' && <span className="text-slate-400">To Do</span>}
                      {type === 'event' && <><Calendar className="w-3.5 h-3.5 text-blue-500" /> <span className="text-slate-400">Event</span></>}
                      {type === 'reminder' && <><Bell className="w-3.5 h-3.5 text-sky-500" /> <span className="text-slate-400">Reminder</span></>}
                      {type === 'milestone' && <><Flag className="w-3.5 h-3.5 text-blue-500" /> <span className="text-slate-400">Milestone</span></>}
                    </p>
                    <h4 className={`text-sm font-bold text-slate-800 dark:text-slate-100 ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                      {task.priority === 'high' && <span className="ml-2 text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded uppercase">High</span>}
                      {task.priority === 'medium' && <span className="ml-2 text-[10px] bg-amber-50 text-amber-500 px-1.5 py-0.5 rounded uppercase">Med</span>}
                      {task.category && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}
                    </h4>
                    {task.notes && <p className="text-xs text-slate-500 mt-0.5">{task.notes}</p>}
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      {formatTime(task.date, task.durationMinutes)} 
                      {sub && <span className="px-1.5 py-0.5 ml-2 rounded bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-300 truncate max-w-[100px]">{sub.name}</span>}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })
          ) : (
            <>
              {/* Q1: Urgent & Important */}
              <div className="bg-rose-50 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-100 dark:border-rose-500/20">
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-3 border-b border-rose-200 dark:border-rose-500/30 pb-1">Urgent & Important (High)</h4>
                <div className="space-y-2">
                  {sortedTasks.filter(t => t.priority === 'high' && !t.isCompleted).map(task => (
                    <div key={task.id} className="flex gap-2 items-start bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-rose-100 dark:border-rose-500/20">
                      <button onClick={() => onToggleTaskComplete(task.id)} className="w-4 h-4 rounded-full border border-slate-300 mt-0.5 shrink-0"></button>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{task.title}{task.category && <span className={`ml-2 inline-block text-[9px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Q2: Not Urgent & Important */}
              <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/20">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-3 border-b border-amber-200 dark:border-amber-500/30 pb-1">Important (Medium)</h4>
                <div className="space-y-2">
                  {sortedTasks.filter(t => t.priority === 'medium' && !t.isCompleted).map(task => (
                    <div key={task.id} className="flex gap-2 items-start bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-amber-100 dark:border-amber-500/20">
                      <button onClick={() => onToggleTaskComplete(task.id)} className="w-4 h-4 rounded-full border border-slate-300 mt-0.5 shrink-0"></button>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{task.title}{task.category && <span className={`ml-2 inline-block text-[9px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q3: Urgent & Not Important */}
              <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-3 border-b border-blue-200 dark:border-blue-500/30 pb-1">Not Important (Low)</h4>
                <div className="space-y-2">
                  {sortedTasks.filter(t => t.priority === 'low' && !t.isCompleted).map(task => (
                    <div key={task.id} className="flex gap-2 items-start bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-blue-100 dark:border-blue-500/20">
                      <button onClick={() => onToggleTaskComplete(task.id)} className="w-4 h-4 rounded-full border border-slate-300 mt-0.5 shrink-0"></button>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{task.title}{task.category && <span className={`ml-2 inline-block text-[9px] px-1.5 py-0.5 rounded font-bold ${getCategoryColor(task.category)}`}>{task.category}</span>}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4: Done */}
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-3 border-b border-emerald-200 dark:border-emerald-500/30 pb-1">Completed</h4>
                <div className="space-y-2">
                  {sortedTasks.filter(t => t.isCompleted).map(task => (
                    <div key={task.id} className="flex gap-2 items-start bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-500/20 opacity-50">
                      <button onClick={() => onToggleTaskComplete(task.id)} className="w-4 h-4 rounded-full bg-emerald-500 border-emerald-500 flex items-center justify-center mt-0.5 shrink-0"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></button>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight line-through">{task.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
