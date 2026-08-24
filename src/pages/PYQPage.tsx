import React, { useState } from 'react';
import { BookOpen, Search, CheckCircle2, Sparkles, Filter, ChevronRight, HelpCircle } from 'lucide-react';

interface PYQQuestion {
  id: string;
  year: number;
  subject: string;
  board: string;
  question: string;
  marks: number;
  officialAnswer: string;
  aiBreakdown: string;
}

export default function PYQPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>('1');

  const [pyqList] = useState<PYQQuestion[]>([
    {
      id: '1',
      year: 2024,
      subject: 'Physics',
      board: 'CBSE Board',
      marks: 3,
      question: 'Derive an expression for the magnetic field at a point on the axis of a current-carrying circular loop.',
      officialAnswer: 'Using Biot-Savart Law dB = (μ₀/4π) * (I dl / r²). Integrating over circular circumference gives B = (μ₀ I R²) / 2(R² + x²)^(3/2).',
      aiBreakdown: 'High yield derivation! Remember to draw the vector diagram showing dB sin θ and dB cos θ components canceling out perpendicular to the axis.'
    },
    {
      id: '2',
      year: 2023,
      subject: 'Physics',
      board: 'CBSE Board',
      marks: 2,
      question: 'State two factors on which the self-inductance of a long solenoid depends.',
      officialAnswer: '1. Number of turns per unit length (N/L).\n2. Core material magnetic permeability (μ).',
      aiBreakdown: 'Formula: L = μ₀ * n² * A * l. Directly proportional to the square of number of turns!'
    }
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Lumora Board Exam Repository</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Previous Year Papers (PYQ)
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Select Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
          >
            <option>2025 (Sample Papers)</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2020</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
          >
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Mathematics</option>
            <option>Biology</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Board</label>
          <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white">
            <option>CBSE Board</option>
            <option>ICSE / ISC</option>
            <option>State Board</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {pyqList.map(item => (
          <div key={item.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">{item.board} ({item.year})</span>
                <span className="text-slate-400">{item.subject}</span>
              </div>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">{item.marks} Marks</span>
            </div>

            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white leading-relaxed">
              {item.question}
            </h3>

            <button 
              onClick={() => setExpandedAnswerId(expandedAnswerId === item.id ? null : item.id)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{expandedAnswerId === item.id ? 'Hide Solution' : 'View Model Answer & AI Analysis'}</span>
            </button>

            {expandedAnswerId === item.id && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3 animate-fade-in text-xs">
                <div>
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">OFFICIAL MODEL SOLUTION</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans mt-1 whitespace-pre-wrap">{item.officialAnswer}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200">
                  <span className="font-bold text-[10px] text-blue-600 uppercase flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> Lumora AI Exam Tip
                  </span>
                  <p className="leading-relaxed font-medium">{item.aiBreakdown}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
