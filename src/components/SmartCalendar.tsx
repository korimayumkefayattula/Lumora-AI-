import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { StudyTask, Subject } from "../types";

interface SmartCalendarProps {
  tasks: StudyTask[];
  subjects: Subject[];
  onUpdateTaskDate: (taskId: string, newDate: string) => void;
}

export default function SmartCalendar({ tasks, subjects, onUpdateTaskDate }: SmartCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInWeek = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysInWeek(currentDate);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onUpdateTaskDate(taskId, dateStr);
    }
  };

  const formatDateStr = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const todayStr = formatDateStr(new Date());

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" /> Smart Weekly Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button onClick={nextWeek} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((day, idx) => {
          const dateStr = formatDateStr(day);
          const dayTasks = tasks.filter(t => t.date === dateStr || t.dueDate === dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div 
              key={dateStr}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
              className={`flex flex-col min-h-[150px] border rounded-xl p-2 transition-colors ${isToday ? 'border-blue-200 bg-blue-50/30 dark:border-blue-500/30 dark:bg-blue-500/10' : 'border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'}`}
            >
              <div className="text-center mb-2">
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {day.getDate()}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                {dayTasks.map(task => {
                  const sub = subjects.find(s => s.id === task.subjectId);
                  return (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`p-1.5 rounded-md text-xs font-medium cursor-grab active:cursor-grabbing border ${task.isCompleted ? 'opacity-50' : ''}`}
                      style={{ 
                        backgroundColor: sub ? `${sub.color}15` : '#f1f5f9',
                        borderColor: sub ? `${sub.color}30` : '#e2e8f0',
                        color: sub ? sub.color : '#475569'
                      }}
                      title={task.title}
                    >
                      <div className="truncate mb-0.5">{task.title}</div>
                      <div className="flex items-center gap-1 text-[9px] opacity-70">
                        <Clock className="w-3 h-3" /> {task.durationMinutes}m
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-center text-slate-400 italic">Drag and drop tasks between days to reschedule them.</div>
    </div>
  );
}
