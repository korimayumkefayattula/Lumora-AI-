import React, { useState, useEffect } from "react";
import { PenTool, X, Save } from "lucide-react";

export default function QuickBrainDump() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (!note.trim()) return;
    const existing = localStorage.getItem("socrates_quick_notes") || "";
    const updated = existing ? existing + "\n\n---\n" + note : note;
    localStorage.setItem("socrates_quick_notes", updated);
    setNote("");
    setIsOpen(false);
    
    // Dispatch a custom event so QuickNotes component can reload if needed
    window.dispatchEvent(new Event("socrates_notes_updated"));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 z-40"
        title="Quick Brain Dump"
      >
        <PenTool className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          <div className="bg-emerald-500 text-white p-3 flex justify-between items-center">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <PenTool className="w-4 h-4" /> Brain Dump
            </h4>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-600 p-1 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dump a thought, link, or idea quickly..."
              className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none text-slate-700 dark:text-slate-300"
            />
            <button 
              onClick={handleSave}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save to Quick Notes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
