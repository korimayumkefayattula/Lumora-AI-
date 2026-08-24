import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Award, Bookmark, ArrowRight, Languages, Copy, Check, RefreshCw, Zap, Lightbulb, FileText } from 'lucide-react';
import { ExplainSimplyModal } from '../components/explain/ExplainSimplyModal';
import { ExplainSimplyService, SavedExplanationNote } from '../services/explainSimplyService';

const SAMPLE_CONCEPTS = [
  {
    title: "Photosynthesis (Class 10 Biology)",
    text: "Photosynthesis is a complex endothermic biochemical process occurring within chloroplasts, wherein light energy absorbed by chlorophyll photolyzes water molecules to synthesize glucose and release oxygen."
  },
  {
    title: "Mitochondria & ATP (Cell Biology)",
    text: "Mitochondria undergo oxidative phosphorylation along the inner cristae membrane, utilizing the electron transport chain to generate a proton gradient that powers ATP synthase."
  },
  {
    title: "Newton's Second Law of Motion (Physics)",
    text: "The net force applied on a body is directly proportional to the rate of change of momentum and takes place in the direction of the applied force, expressed mathematically as F = m × a."
  }
];

export default function ExplainSimplyWorkspace() {
  const [inputText, setInputText] = useState(SAMPLE_CONCEPTS[0].text);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState<SavedExplanationNote[]>(ExplainSimplyService.getSavedNotes());

  const handleExplain = () => {
    if (!inputText.trim()) return;
    setIsModalOpen(true);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
  };

  const handleDeleteSaved = (id: string) => {
    ExplainSimplyService.deleteSavedNote(id);
    setSavedNotes(ExplainSimplyService.getSavedNotes());
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HERO BANNER */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-3xl border border-blue-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ✨ NotebookLM Source Grounded + Notion AI Inline
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight">
              Lumora Explain Simply AI
            </h1>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-medium">
              Transform difficult textbook paragraphs, complex definitions, AI notes, or uploaded study materials into crystal-clear explanations tailored to your exact learning level.
            </p>
          </div>

          <button
            onClick={handleExplain}
            disabled={!inputText.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-slate-950" /> Explain Simply Now
          </button>
        </div>
      </div>

      {/* INPUT WORKSPACE AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Input Text Box */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-slate-900 dark:text-white font-display text-base">
                Paste or Select Text to Explain
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {inputText.length} chars
            </span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste any difficult textbook paragraph, question, note, or concept here..."
            className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 leading-relaxed font-medium transition-colors"
          />

          <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Quick Samples:</span>
              <div className="flex gap-2 flex-wrap">
                {SAMPLE_CONCEPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(sample.text)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {sample.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExplain}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" /> Explain Simply
            </button>
          </div>
        </div>

        {/* Right: Feature Highlights & Saved Quick Notes */}
        <div className="space-y-6">
          {/* Levels Info Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> 4 Adaptive Explanation Levels
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900">
                <span className="font-extrabold text-blue-700 dark:text-blue-300">🐣 Very Simple:</span> Everyday analogies & zero jargon.
              </div>
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300">🎒 School Level:</span> Syllabus-connected & clear.
              </div>
              <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900">
                <span className="font-extrabold text-purple-700 dark:text-purple-300">📚 Detailed:</span> Cause-and-effect & deep breakdown.
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900">
                <span className="font-extrabold text-amber-700 dark:text-amber-300">🎯 Exam Level:</span> Keyword lists & "Remember This" tips.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SAVED EXPLANATIONS LIBRARY */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-bold text-slate-900 dark:text-white font-display text-base">
              Saved "Explain Simply" Library ({savedNotes.length})
            </h2>
          </div>
        </div>

        {savedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedNotes.map((note) => (
              <div key={note.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3 relative group">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  <span>Level: {note.level}</span>
                  <button 
                    onClick={() => handleDeleteSaved(note.id)}
                    className="text-slate-400 hover:text-red-500 font-bold"
                  >
                    Delete
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 font-display">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                  {note.keyIdea}
                </p>

                <button
                  onClick={() => {
                    setInputText(note.originalText);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                >
                  Re-Open Explanation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No saved explanations yet. Click "Save to Notes" in any explanation to keep it here!
          </div>
        )}
      </div>

      {/* EXPLAIN SIMPLY MODAL */}
      <ExplainSimplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedText={inputText}
        sourceContext={{
          sourceName: "Lumora Study Library",
          chapter: "General Concepts",
          pageNumber: "1"
        }}
      />
    </div>
  );
}
