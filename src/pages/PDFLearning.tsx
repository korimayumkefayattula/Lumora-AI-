import React, { useState } from 'react';
import { FileText, Sparkles, Upload, BookOpen, Layers, Award, ArrowRight, Bookmark, Search } from 'lucide-react';
import { ExplainSimplyModal } from '../components/explain/ExplainSimplyModal';

const SAMPLE_PDFS = [
  {
    id: 'pdf1',
    title: 'Class 10 Science — Chapter 5: Life Processes.pdf',
    chapter: 'Chapter 5',
    page: 42,
    snippet: 'Photosynthesis is a biochemical process in which green plants synthesize organic compounds (glucose) from inorganic raw materials like carbon dioxide and water in the presence of sunlight and chlorophyll.'
  },
  {
    id: 'pdf2',
    title: 'Class 10 Physics — Chapter 10: Light Reflection & Refraction.pdf',
    chapter: 'Chapter 10',
    page: 112,
    snippet: 'Refraction of light is the phenomenon of bending of a ray of light when it passes obliquely from one transparent medium into another medium of different optical density.'
  }
];

export default function PDFLearning() {
  const [selectedPdf, setSelectedPdf] = useState(SAMPLE_PDFS[0]);
  const [highlightedText, setHighlightedText] = useState(SAMPLE_PDFS[0].snippet);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const handleExplainCurrentSnippet = () => {
    setIsExplainModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl border border-blue-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              NotebookLM Source Grounded
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-white">
            PDF Learning & Document Reader
          </h1>
          <p className="text-xs text-blue-200">
            Highlight any sentence in uploaded textbooks or notes to trigger Lumora Explain Simply AI.
          </p>
        </div>

        <button
          onClick={handleExplainCurrentSnippet}
          className="px-5 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" /> Explain Highlighted Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document Viewer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-slate-900 dark:text-white font-display text-sm">
                {selectedPdf.title}
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
              Page {selectedPdf.page}
            </span>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed space-y-4 font-medium">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Document Excerpt ({selectedPdf.chapter}):
            </p>

            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl text-slate-900 dark:text-slate-100 font-serif leading-relaxed">
              "{highlightedText}"
            </div>

            <p className="text-xs text-slate-500">
              💡 Tip: Highlight any words above or click the button below to transform this complex passage into simple, age-appropriate explanations.
            </p>

            <button
              onClick={handleExplainCurrentSnippet}
              className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" /> Explain Simply (Level 1 - 4)
            </button>
          </div>
        </div>

        {/* Right: Library Selector */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white font-display text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" /> Uploaded Textbooks
          </h3>

          <div className="space-y-3">
            {SAMPLE_PDFS.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => {
                  setSelectedPdf(pdf);
                  setHighlightedText(pdf.snippet);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedPdf.id === pdf.id
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-slate-900 dark:text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-600 uppercase">
                  <span>{pdf.chapter}</span>
                  <span>Page {pdf.page}</span>
                </div>
                <h4 className="text-xs font-bold mt-1 line-clamp-1">{pdf.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ExplainSimplyModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        selectedText={highlightedText}
        sourceContext={{
          sourceName: selectedPdf.title,
          chapter: selectedPdf.chapter,
          pageNumber: selectedPdf.page
        }}
      />
    </div>
  );
}
