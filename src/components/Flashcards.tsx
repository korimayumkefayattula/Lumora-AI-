import React, { useState } from "react";
import { Layers, Loader2, Download, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Subject } from "../types";
import { jsPDF } from "jspdf";

interface FlashcardsProps {
  subjects: Subject[];
}

export default function Flashcards({ subjects }: FlashcardsProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError("");
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          numberOfCards: 5
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to generate flashcards");
      }

      setFlashcards(data.flashcards || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const downloadPDF = () => {
    if (flashcards.length === 0) return;
    const doc = new jsPDF();
    let y = 20;
    
    doc.setFontSize(16);
    doc.text(`Flashcards: ${topic}`, 15, y);
    y += 10;
    
    doc.setFontSize(12);
    flashcards.forEach((card, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      const qText = doc.splitTextToSize(`Q${index + 1}: ${card.front}`, 180);
      doc.text(qText, 15, y);
      y += qText.length * 7;
      
      doc.setFont("helvetica", "normal");
      const aText = doc.splitTextToSize(`A: ${card.back}`, 180);
      doc.text(aText, 15, y);
      y += (aText.length * 7) + 10;
    });
    
    doc.save(`flashcards-${topic.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 shrink-0 flex items-center justify-between">
        <h2 className="text-white font-bold font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-100" />
          AI Flashcards
        </h2>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {!flashcards.length && !isLoading && (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Topic for Flashcards
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Mitosis, Spanish Verbs, React Context"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2.5 px-3.5 text-slate-700 outline-none focus:border-emerald-500 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 text-sm rounded-xl py-2.5 px-3 text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!topic.trim()}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-200"
            >
              Generate Cards
            </button>
          </form>
        )}

        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <RefreshCcw className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500 animate-pulse">Crafting flashcards...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {flashcards.length > 0 && !isLoading && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={downloadPDF}
                  className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                >
                  <Download className="w-3 h-3" /> Export PDF
                </button>
                <button 
                  onClick={() => { setFlashcards([]); setTopic(""); }}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                >
                  New Deck
                </button>
              </div>
            </div>

            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full aspect-video perspective-1000 cursor-pointer group"
            >
              <div className={`w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                {/* Front */}
                <div className="absolute w-full h-full bg-white rounded-xl shadow-md border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center p-6 text-center backface-hidden group-hover:border-emerald-200 transition-colors">
                  <p className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">{flashcards[currentIndex].front}</p>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-emerald-50 rounded-xl shadow-md border-2 border-emerald-200 flex items-center justify-center p-6 text-center backface-hidden rotate-y-180">
                  <p className="text-base font-medium text-emerald-900">{flashcards[currentIndex].back}</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400">Click card to flip</p>

            <div className="flex justify-between items-center pt-2">
              <button onClick={prevCard} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextCard} className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
