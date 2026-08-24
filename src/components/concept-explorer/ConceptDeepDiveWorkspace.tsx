import React, { useState } from 'react';
import { 
  ConceptMapData, 
  ConceptNode 
} from '../../types/conceptExplorer';
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Lightbulb, 
  Bookmark, 
  Layers, 
  Send, 
  Share2,
  ListChecks,
  Quote
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ConceptDeepDiveWorkspaceProps {
  conceptData: ConceptMapData;
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onAskAI: (question?: string) => void;
  onStartQuiz: () => void;
  onSaveMap: () => void;
  isSaved?: boolean;
}

type ExplanationLevel = 'simple' | 'school' | 'advanced' | 'exam';

export const ConceptDeepDiveWorkspace: React.FC<ConceptDeepDiveWorkspaceProps> = ({
  conceptData,
  activeNodeId,
  onSelectNode,
  onAskAI,
  onStartQuiz,
  onSaveMap,
  isSaved
}) => {
  const [activeLevel, setActiveLevel] = useState<ExplanationLevel>('school');
  const [activeTab, setActiveTab] = useState<'overview' | 'why_how' | 'examples' | 'misconceptions' | 'terms'>('overview');
  const [sourceModeEnabled, setSourceModeEnabled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const activeNode = conceptData.nodes.find(n => n.id === activeNodeId) || 
    conceptData.nodes.find(n => n.category === 'core') || 
    conceptData.nodes[0];

  const handleSpeech = (text: string, termId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio === termId) {
        setIsPlayingAudio(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(null);
      setIsPlayingAudio(termId);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-6">
      
      {/* Top Banner / Concept Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase">
                {conceptData.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                {conceptData.gradeLevel}
              </span>
              {conceptData.estimatedMasteryTime && (
                <span className="text-xs text-indigo-200/80 font-medium">
                  ⏱️ {conceptData.estimatedMasteryTime} estimated
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              {conceptData.topic}
            </h1>
            <p className="text-xs md:text-sm text-indigo-100/90 max-w-3xl leading-relaxed">
              {conceptData.oneSentenceOverview}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSaveMap}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSaved 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved in Library' : 'Save Map'}</span>
            </button>

            <button
              onClick={onStartQuiz}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
            >
              <ListChecks className="w-4 h-4" />
              <span>Check Understanding</span>
            </button>
          </div>
        </div>

        {/* Source Aware Toggle Pill (NotebookLM Mode) */}
        <div className="mt-4 pt-3 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSourceModeEnabled(!sourceModeEnabled)}
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
                sourceModeEnabled 
                  ? 'bg-amber-400 text-slate-900 shadow-sm' 
                  : 'bg-white/10 text-indigo-200 hover:bg-white/20'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>NotebookLM Source-Aware Mode</span>
            </button>
            <span className="text-[11px] text-indigo-300 hidden sm:inline">
              {sourceModeEnabled ? '✓ Cross-referencing AI Notebook & Study Files' : 'Showing standard AI synthesis'}
            </span>
          </div>

          <button
            onClick={() => onAskAI(`Explain how ${activeNode?.label || conceptData.topic} works in detail.`)}
            className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Lumora AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="px-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 overflow-x-auto pb-0 custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Explanation Levels</span>
          </button>

          <button
            onClick={() => setActiveTab('why_how')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'why_how'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Why & How Deconstruction</span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'examples'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Real-World Examples ({conceptData.realWorldExamples.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('misconceptions')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'misconceptions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Misconceptions ({conceptData.misconceptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Key Terms ({conceptData.keyTerms.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: EXPLANATION LEVELS */}
      {activeTab === 'overview' && (
        <div className="px-6 pb-6 space-y-6">
          
          {/* Level Switcher Selector */}
          <div className="bg-slate-100 dark:bg-slate-700/60 p-1.5 rounded-2xl flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveLevel('simple')}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeLevel === 'simple'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700'
              }`}
            >
              🌱 5-Year-Old Analogy
            </button>
            <button
              onClick={() => setActiveLevel('school')}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeLevel === 'school'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700'
              }`}
            >
              🏫 School / Syllabus
            </button>
            <button
              onClick={() => setActiveLevel('advanced')}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeLevel === 'advanced'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700'
              }`}
            >
              🔬 Advanced Deep Dive
            </button>
            <button
              onClick={() => setActiveLevel('exam')}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeLevel === 'exam'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700'
              }`}
            >
              🎯 Exam Checklist
            </button>
          </div>

          {/* Explanation Content Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            
            {activeLevel === 'simple' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <span className="text-xs font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    Everyday Analogy & Simple Mental Model
                  </span>
                  <button
                    onClick={() => handleSpeech(conceptData.explanations.simpleAnalogy, 'simple')}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{conceptData.explanations.simpleAnalogy}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeLevel === 'school' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                    Standard School Classroom Syllabus Level
                  </span>
                  <button
                    onClick={() => handleSpeech(conceptData.explanations.schoolLevel, 'school')}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{conceptData.explanations.schoolLevel}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeLevel === 'advanced' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                    Comprehensive Mechanics & Technical Deep Dive
                  </span>
                  <button
                    onClick={() => handleSpeech(conceptData.explanations.advancedDeepDive, 'adv')}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{conceptData.explanations.advancedDeepDive}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeLevel === 'exam' && (
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  Key Points to Remember for Scoring Top Exam Marks
                </span>
                <ul className="space-y-2.5">
                  {conceptData.explanations.examChecklist.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab 2: WHY & HOW DECONSTRUCTION */}
      {activeTab === 'why_how' && (
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Why it exists */}
            <div className="bg-amber-50/60 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Why Does This Concept Exist?
                </h3>
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {conceptData.whyAndHow.whyExists}
              </p>
            </div>

            {/* How it works */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-800/80 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  How It Works Step-by-Step
                </h3>
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {conceptData.whyAndHow.howItWorks}
              </p>
            </div>

          </div>

          {/* Key Principles */}
          {conceptData.whyAndHow.keyPrinciples && conceptData.whyAndHow.keyPrinciples.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Foundational Governing Laws / Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conceptData.whyAndHow.keyPrinciples.map((p, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: REAL-WORLD EXAMPLES */}
      {activeTab === 'examples' && (
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conceptData.realWorldExamples.map((ex, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    {ex.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  {ex.scenario}
                </p>

                {ex.visualDescription && (
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 italic">
                    💡 Visual Mind Prompt: {ex.visualDescription}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Practical Impact:</strong> {ex.practicalImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: MISCONCEPTIONS & PITFALLS */}
      {activeTab === 'misconceptions' && (
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-4">
            {conceptData.misconceptions.map((m, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Common Myth */}
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      ❌ Common Myth / Trap
                    </span>
                    <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      "{m.myth}"
                    </p>
                  </div>

                  {/* Scientific Fact */}
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      ✅ Actual Fact
                    </span>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      "{m.fact}"
                    </p>
                  </div>

                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <strong>Why students trip up:</strong> {m.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: KEY TERMS GLOSSARY */}
      {activeTab === 'terms' && (
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conceptData.keyTerms.map((kt, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {kt.term}
                    </span>
                    {kt.pronunciation && (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                        [{kt.pronunciation}]
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleSpeech(`${kt.term}. ${kt.definition}`, `kt_${idx}`)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    title="Audio pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {kt.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workspace Footer Action Prompt */}
      <div className="bg-slate-50 dark:bg-slate-900/90 px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Have a specific question about <strong>{activeNode?.label || conceptData.topic}</strong>?</span>
        </div>

        <button
          onClick={() => onAskAI(`Explain the connection between ${conceptData.topic} and real-world exam questions.`)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Lumora AI Tutor</span>
        </button>
      </div>

    </div>
  );
};
