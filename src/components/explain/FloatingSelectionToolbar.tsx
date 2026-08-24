import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Layers, Award, Bookmark, Languages, Brain, X } from 'lucide-react';

interface FloatingSelectionToolbarProps {
  onExplainSimply: (selectedText: string, action?: string) => void;
}

export function FloatingSelectionToolbar({ onExplainSimply }: FloatingSelectionToolbarProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null);
        setSelectedText('');
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 3) return; // ignore tiny selections

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) return;

        // Position toolbar centered above selection
        const top = Math.max(10, rect.top + window.scrollY - 48);
        const left = Math.max(10, rect.left + window.scrollX + (rect.width / 2) - 160);

        setPosition({ top, left });
        setSelectedText(text);
      } catch (e) {
        setPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  if (!position || !selectedText) return null;

  return (
    <div
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-50 bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 animate-fade-in backdrop-blur-md"
    >
      {/* Primary Action */}
      <button
        onClick={() => {
          onExplainSimply(selectedText, 'explain');
          setPosition(null);
        }}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span>Explain Simply</span>
      </button>

      <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

      {/* Secondary Actions */}
      <button
        onClick={() => {
          onExplainSimply(selectedText, 'summarize');
          setPosition(null);
        }}
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        title="Summarize text"
      >
        <FileText className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => {
          onExplainSimply(selectedText, 'flashcards');
          setPosition(null);
        }}
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        title="Create Flashcards"
      >
        <Layers className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => {
          onExplainSimply(selectedText, 'quiz');
          setPosition(null);
        }}
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        title="Test Me (Quiz)"
      >
        <Award className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => {
          onExplainSimply(selectedText, 'translate');
          setPosition(null);
        }}
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
        title="Translate"
      >
        <Languages className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => {
          setPosition(null);
        }}
        className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300 transition-colors ml-1"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
