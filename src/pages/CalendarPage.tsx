import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Bookmark, Filter, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleCalendarPanel } from '../components/workspace/GoogleCalendarPanel';
import { useNavigate } from 'react-router-dom';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Exam' | 'Homework' | 'Revision' | 'Mock Test';
  subject: string;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const { workspaceToken, requestWorkspaceAccess } = useAuth();
  const [showGoogleCalendar, setShowGoogleCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('March 2026');
  const [selectedDate, setSelectedDate] = useState('2026-03-15');
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'CBSE Physics Board Exam', date: '2026-03-15', time: '10:30 AM', type: 'Exam', subject: 'Physics' },
    { id: '2', title: 'Chemistry Mock Test 3', date: '2026-03-10', time: '02:00 PM', type: 'Mock Test', subject: 'Chemistry' },
    { id: '3', title: 'Maths Integration Revision', date: '2026-03-08', time: '09:00 AM', type: 'Revision', subject: 'Mathematics' }
  ]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSubject, setNewEventSubject] = useState('Physics');
  const [newEventType, setNewEventType] = useState<'Exam' | 'Homework' | 'Revision' | 'Mock Test'>('Revision');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const item: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: selectedDate,
      time: '10:00 AM',
      type: newEventType,
      subject: newEventSubject
    };
    setEvents([...events, item]);
    setNewEventTitle('');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Lumora Exam & Study Schedule</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Interactive Academic Calendar
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGoogleCalendar(!showGoogleCalendar)}
            className="px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{showGoogleCalendar ? 'Hide Google Calendar' : 'Show Google Calendar'}</span>
          </button>
          <button
            onClick={() => navigate('/student/workspace')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Workspace Suite</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Grid View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[64px] p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 font-bold' 
                      : 'bg-slate-50 dark:bg-slate-700/20 border-slate-200/80 dark:border-slate-600/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md truncate font-bold">
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Selected Date</span>
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">{selectedDate}</h2>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-3">
            <input 
              type="text" 
              placeholder="Add event / exam title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:outline-none dark:text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={newEventSubject} 
                onChange={(e) => setNewEventSubject(e.target.value)}
                className="p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
              >
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Mathematics</option>
                <option>Biology</option>
              </select>

              <select 
                value={newEventType} 
                onChange={(e) => setNewEventType(e.target.value as any)}
                className="p-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
              >
                <option>Exam</option>
                <option>Mock Test</option>
                <option>Revision</option>
                <option>Homework</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </form>

          {/* Schedule for Day */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Events for this day</h3>
            {events.filter(e => e.date === selectedDate).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No events scheduled for {selectedDate}.</p>
            ) : (
              events.filter(e => e.date === selectedDate).map(ev => (
                <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-blue-600">{ev.type}</span>
                    <span className="text-slate-400">{ev.time}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">{ev.title}</h4>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Google Calendar Bi-Directional Synchronization Panel */}
      {showGoogleCalendar && (
        <div className="pt-2">
          <GoogleCalendarPanel
            token={workspaceToken}
            onRequestAuth={requestWorkspaceAccess}
          />
        </div>
      )}
    </div>
  );
}
