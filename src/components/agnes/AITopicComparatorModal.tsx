import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  GitCompare, 
  Flame, 
  BookOpen, 
  Check, 
  Copy, 
  StickyNote, 
  Video, 
  ArrowRight, 
  HelpCircle,
  Brain,
  Lightbulb,
  Layers
} from 'lucide-react';
import { 
  ConceptComparison, 
  PRESET_TOPIC_COMPARISONS, 
  compareConceptsWithAI, 
  exportComparisonToKeep 
} from '../../services/topicComparatorService';
import { useAuth } from '../../context/AuthContext';

interface AITopicComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateVideoOnTopic?: (topic: string, subject: string) => void;
}

export const AITopicComparatorModal: React.FC<AITopicComparatorModalProps> = ({
  isOpen,
  onClose,
  onGenerateVideoOnTopic,
}) => {
  const { user } = useAuth();
  const [activeComparison, setActiveComparison] = useState<ConceptComparison>(PRESET_TOPIC_COMPARISONS[0]);
  const [conceptAInput, setConceptAInput] = useState('');
  const [conceptBInput, setConceptBInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('Physics');
  const [isComparing, setIsComparing] = useState(false);
  const [savedToKeep, setSavedToKeep] = useState(false);
  const [showDrillAnswer, setShowDrillAnswer] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ConceptComparison) => {
    setActiveComparison(preset);
    setShowDrillAnswer(false);
  };

  const handleRunCustomCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptAInput.trim() || !conceptBInput.trim()) return;

    setIsComparing(true);
    setShowDrillAnswer(false);
    try {
      const result = await compareConceptsWithAI(conceptAInput, conceptBInput, subjectInput);
      setActiveComparison(result);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleExportKeep = async () => {
    try {
      await exportComparisonToKeep(activeComparison, user?.uid || null);
      setSavedToKeep(true);
      setTimeout(() => setSavedToKeep(false), 3000);
    } catch {}
  };

  const handleLaunchVideo = () => {
    if (onGenerateVideoOnTopic) {
      onClose();
      onGenerateVideoOnTopic(
        `${activeComparison.conceptA} vs ${activeComparison.conceptB}`,
        activeComparison.subject
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <GitCompare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">AI Topic Comparator</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                  Lumora Feature #10
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Demystify confusing twins, subtle differences, and classic examiner traps with Dr. Agnes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
              Popular Tough Concept Comparisons:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_TOPIC_COMPARISONS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeComparison.id === preset.id
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-mono">[{preset.subject}]</span>
                  <span>{preset.conceptA.split('(')[0].trim()} vs {preset.conceptB.split('(')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Compare Input Box */}
          <form onSubmit={handleRunCustomCompare} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Compare ANY Two Confusing Concepts:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5 items-center">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={conceptAInput}
                  onChange={(e) => setConceptAInput(e.target.value)}
                  placeholder="Concept A (e.g. Mitosis, Speed, AC)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-1 text-center font-bold text-xs text-rose-400">
                VS
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={conceptBInput}
                  onChange={(e) => setConceptBInput(e.target.value)}
                  placeholder="Concept B (e.g. Meiosis, Velocity, DC)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <select
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <button
                type="submit"
                disabled={isComparing || !conceptAInput.trim() || !conceptBInput.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              >
                {isComparing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Concepts...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Generate Comparison Matrix</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Active Comparison Matrix */}
          <div className="space-y-5 animate-fade-in">
            
            {/* Title & Subject Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase">
                  {activeComparison.subject}
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  {activeComparison.conceptA} <span className="text-rose-400">vs</span> {activeComparison.conceptB}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportKeep}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                    savedToKeep
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {savedToKeep ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <StickyNote className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{savedToKeep ? 'Saved to Keep!' : 'Save to Keep'}</span>
                </button>

                {onGenerateVideoOnTopic && (
                  <button
                    onClick={handleLaunchVideo}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Video Breakdown</span>
                  </button>
                )}
              </div>
            </div>

            {/* Side-by-Side Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono uppercase font-bold text-rose-400 block">
                  Concept A Definition:
                </span>
                <h5 className="text-xs font-black text-white">{activeComparison.conceptA}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{activeComparison.definitionA}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono uppercase font-bold text-indigo-400 block">
                  Concept B Definition:
                </span>
                <h5 className="text-xs font-black text-white">{activeComparison.conceptB}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{activeComparison.definitionB}</p>
              </div>
            </div>

            {/* Dr. Agnes's Golden Rule of Thumb */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/40 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Dr. Agnes&apos;s Golden Rule of Thumb (Never Mix Them Up):</span>
              </div>
              <p className="text-slate-200 font-medium italic leading-relaxed pl-6">
                &quot;{activeComparison.agnesRuleOfThumb}&quot;
              </p>
            </div>

            {/* Comparative Parameter Matrix Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" />
                <span>Head-to-Head Parameter Matrix</span>
              </span>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                      <th className="p-3">Distinguishing Aspect</th>
                      <th className="p-3 text-rose-300">{activeComparison.conceptA.split('(')[0]}</th>
                      <th className="p-3 text-indigo-300">{activeComparison.conceptB.split('(')[0]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {activeComparison.keyDifferences.map((diff, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-semibold text-slate-200 font-mono text-[11px] bg-slate-950/30">
                          {diff.aspect}
                        </td>
                        <td className="p-3 text-slate-300 leading-relaxed">
                          {diff.conceptAValue}
                        </td>
                        <td className="p-3 text-slate-300 leading-relaxed">
                          {diff.conceptBValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exam Traps & Shared Foundations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Similarities */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Crucial Overlapping Similarities</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {activeComparison.similarities.map((sim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{sim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Exam Traps */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Top Student Exam Pitfalls</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-rose-200/90">
                  {activeComparison.commonExamConfusions.map((trap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Practice Drill Check */}
            {activeComparison.exampleDrill && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono">
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quick Concept Identifier Drill:</span>
                  </span>
                  <button
                    onClick={() => setShowDrillAnswer(!showDrillAnswer)}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200"
                  >
                    {showDrillAnswer ? 'Hide Answer' : 'Show Agnes Verdict'}
                  </button>
                </div>

                <p className="text-xs text-slate-200 italic font-mono bg-black/40 p-2.5 rounded-xl border border-indigo-900/40">
                  Prompt: &quot;{activeComparison.exampleDrill.scenario}&quot;
                </p>

                {showDrillAnswer && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-1 animate-fade-in text-xs">
                    <span className="font-bold text-emerald-400 block">
                      Governing Concept: {activeComparison.exampleDrill.whichApplies}
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      {activeComparison.exampleDrill.why}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Built to resolve tough STEM ambiguities</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Close Comparator
          </button>
        </div>

      </div>
    </div>
  );
};
