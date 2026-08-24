import React, { useState } from 'react';
import { ConceptComparison } from '../../types/conceptExplorer';
import { ConceptExplorerService } from '../../services/conceptExplorerService';
import { X, Sparkles, BookOpen, Check, ArrowRight, Lightbulb } from 'lucide-react';

interface ConceptCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ConceptCompareModal: React.FC<ConceptCompareModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Photosynthesis'
}) => {
  const [conceptA, setConceptA] = useState(defaultTopic);
  const [conceptB, setConceptB] = useState('Cellular Respiration');
  const [subject, setSubject] = useState('Biology');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConceptComparison | null>(null);

  if (!isOpen) return null;

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptA.trim() || !conceptB.trim()) return;

    setIsLoading(true);
    const data = await ConceptExplorerService.compareConcepts(conceptA, conceptB, subject);
    setResult(data);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Compare Concepts Side-by-Side</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {/* Input Form */}
          <form onSubmit={handleCompare} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Concept 1
                </label>
                <input
                  type="text"
                  value={conceptA}
                  onChange={(e) => setConceptA(e.target.value)}
                  placeholder="e.g. AC Current"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Concept 2
                </label>
                <input
                  type="text"
                  value={conceptB}
                  onChange={(e) => setConceptB(e.target.value)}
                  placeholder="e.g. DC Current"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !conceptA || !conceptB}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Comparing Concepts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Comparison Matrix</span>
                </>
              )}
            </button>
          </form>

          {/* Comparison Result Display */}
          {result && (
            <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-700">
              
              {/* Summary */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <strong className="block text-sm font-bold mb-1">Summary Overview</strong>
                {result.summaryComparison}
              </div>

              {/* Similarities */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400">
                  Key Similarities
                </h3>
                <ul className="space-y-1.5">
                  {result.similarities.map((sim, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{sim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matrix Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                  Key Differences
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                      <tr>
                        <th className="p-3">Aspect</th>
                        <th className="p-3 text-indigo-600 dark:text-indigo-400">{result.conceptA}</th>
                        <th className="p-3 text-blue-600 dark:text-blue-400">{result.conceptB}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                      {result.keyDifferences.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-3 font-bold bg-slate-50/50 dark:bg-slate-800/50">{row.aspect}</td>
                          <td className="p-3">{row.conceptAValue}</td>
                          <td className="p-3">{row.conceptBValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Common Confusion Tip */}
              {result.commonConfusions && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Common Exam Trap / Mnemonic</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{result.commonConfusions}</p>
                  {result.mnemonicOrTip && (
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 pt-1">{result.mnemonicOrTip}</p>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
