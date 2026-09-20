import React, { useState } from 'react';
import { 
  Brain, Sparkles, Lightbulb, Zap, BookOpen, Layers, 
  Search, ArrowRight, Copy, Check, Eye, HelpCircle, Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MEMORY_TRICKS, MemoryTrick, TRICK_SUBJECTS } from '../data/memoryTricksData';

export default function MemoryTricksPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom AI Mnemonic Generator State
  const [customConcept, setCustomConcept] = useState('');
  const [customSubject, setCustomSubject] = useState('Physics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState<{
    code: string;
    explanation: string;
    analogy: string;
    practiceTip: string;
  } | null>(null);

  const filteredTricks = MEMORY_TRICKS.filter(trick => {
    const matchesSubject = selectedSubject === 'All Subjects' || trick.subject === selectedSubject;
    const matchesSearch = 
      trick.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.mnemonicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.formulaOrFact.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCustomMnemonic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customConcept.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const concept = customConcept.trim();
      let code = `V.I.P. - Visual Insight Principle for ${concept}`;
      let explanation = `Break ${concept} into 3 anchor coordinates. Anchor 1 represents input cause, Anchor 2 is intermediate state, and Anchor 3 is observed output.`;
      let analogy = `Like a 3-stage rocket booster: each stage ignites only when the previous completes.`;
      let practiceTip = `Close your eyes and visualize this sequence across 3 points on your palm.`;

      if (concept.toLowerCase().includes('krebs') || concept.toLowerCase().includes('cycle') || concept.toLowerCase().includes('cellular')) {
        code = `"Can I Keep Selling Sex For Money, Officer?" (Citrate, Isocitrate, α-Ketoglutarate, Succinyl-CoA, Succinate, Fumarate, Malate, Oxaloacetate)`;
        explanation = `The classic 8-intermediate citric acid cycle mnemonic connecting every organic acid intermediate sequentially.`;
        analogy = `A 8-passenger revolving door inside the mitochondrial matrix that regenerates Oxaloacetate every full turn.`;
        practiceTip = `Draw an 8-sided octagon and write each initial letter at a vertex.`;
      } else if (concept.toLowerCase().includes('quadratic') || concept.toLowerCase().includes('formula')) {
        code = `"A Negative Boy was Undecided (±) to go to a Radical Party (√). Because he was Square (b²), he missed out on 4 Awesome Chicks (-4ac). And the whole party was Over at 2:00 AM (all over 2a)!"`;
        explanation = `x = (-b ± √(b² - 4ac)) / (2a). Every single mathematical symbol maps to a memorable comedic story.`;
        analogy = `A night-out story where each character is a component of the discriminant and divisor.`;
        practiceTip = `Say the story out loud twice while writing the quadratic formula. You will never forget the sign of -4ac again.`;
      } else if (concept.toLowerCase().includes('refraction') || concept.toLowerCase().includes('snell') || concept.toLowerCase().includes('lens')) {
        code = `"D.A.R.T. : Dense to Air, Refracts Towards normal (if coming from rarer) | R.A.W. : Rarer to Air, bends Wide."`;
        explanation = `n₁ sin(θ₁) = n₂ sin(θ₂). When light enters a denser medium, it slows down and hugs the normal line.`;
        analogy = `A car hitting a patch of deep mud with its right wheels first—the car pivots toward the mud (normal line).`;
        practiceTip = `Use the mud-wheel analogy every time you draw an optical ray diagram.`;
      }

      setGeneratedMnemonic({ code, explanation, analogy, practiceTip });
      setIsGenerating(false);
    }, 850);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Accelerated Cognitive Architecture • Memory Vault</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Subject Memory Tricks & Speed Mnemonics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 max-w-2xl">
            Retain complex scientific formulas, periodic hierarchies, calculus theorems, and physiological pathways with proven cognitive hooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/student/revision')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-rose-500 transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-rose-500" />
            <span>Go to Spaced Revision</span>
          </button>
        </div>
      </div>

      {/* Interactive AI Mnemonic Generator Tool */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-white shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">AI Instant Mnemonic Generator</h2>
              <p className="text-xs text-slate-400">Stuck on a tricky formula, enzyme sequence, or theorem? Let AI craft a memory hook.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerateCustomMnemonic} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customConcept}
            onChange={(e) => setCustomConcept(e.target.value)}
            placeholder="E.g., Krebs cycle intermediates, Quadratic formula, Snell's law, Mitosis phases..."
            className="flex-1 w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />

          <select
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none"
          >
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Biology">Biology</option>
          </select>

          <button
            type="submit"
            disabled={!customConcept.trim() || isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all shrink-0 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Mnemonic'}</span>
          </button>
        </form>

        {generatedMnemonic && (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-rose-400">
                Generated Mnemonic Hook for: "{customConcept}"
              </span>
              <button
                onClick={() => handleCopyCode('custom', generatedMnemonic.code)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedId === 'custom' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'custom' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-mono font-bold text-amber-300 bg-black/30 p-3 rounded-xl border border-white/5">
              {generatedMnemonic.code}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {generatedMnemonic.explanation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/20 text-xs text-slate-300">
                <span className="font-bold text-blue-400 block mb-1">Visual Mental Analogy:</span>
                {generatedMnemonic.analogy}
              </div>
              <div className="p-3 rounded-xl bg-black/20 text-xs text-slate-300">
                <span className="font-bold text-emerald-400 block mb-1">How to Solidify:</span>
                {generatedMnemonic.practiceTip}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {TRICK_SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-xl font-bold shrink-0 transition-all ${
                selectedSubject === subject
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory tricks..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Memory Tricks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTricks.map((trick) => (
          <div
            key={trick.id}
            className="p-6 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {trick.subject}
                </span>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  trick.difficulty === 'Quick Hack' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : trick.difficulty === 'Exam Lifesaver'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {trick.difficulty}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {trick.title}
              </h3>

              {/* Mnemonic Code Pill */}
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-2">
                <div className="font-mono font-black text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                  {trick.mnemonicCode}
                </div>
                <button
                  onClick={() => handleCopyCode(trick.id, trick.mnemonicCode)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors shrink-0 shadow-xs"
                  title="Copy Mnemonic"
                >
                  {copiedId === trick.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {trick.explanation}
              </p>

              {/* Formula & Analogy Box */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block">Scientific Fact / Formula:</span>
                  <code className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    {trick.formulaOrFact}
                  </code>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase block">Visual Mental Analogy:</span>
                  <span className="text-[11px] leading-relaxed">{trick.realWorldAnalogy}</span>
                </div>
              </div>
            </div>

            {/* Practice Tip Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold truncate mr-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Practice: </span>
                {trick.howToPractice}
              </span>
              <button
                onClick={() => navigate('/student/explain-simply')}
                className="text-rose-600 hover:text-rose-500 font-extrabold shrink-0 flex items-center gap-1"
              >
                <span>Explain Simply</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
