import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  BookMarked, 
  Star, 
  Copy, 
  Check, 
  Plus, 
  StickyNote, 
  Brain, 
  Download, 
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  VaultFormula, 
  getAllVaultFormulas, 
  toggleVaultFormulaFavorite, 
  addCustomVaultFormula, 
  exportVaultToKeep 
} from '../../services/formulaVaultService';
import { useAuth } from '../../context/AuthContext';

interface FormulaVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaVaultModal: React.FC<FormulaVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [formulas, setFormulas] = useState<VaultFormula[]>(() => getAllVaultFormulas());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedToKeep, setSavedToKeep] = useState(false);

  // Daily 10-Minute Flashcard Revision Mode state
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Add formula modal state
  const [isAddingFormula, setIsAddingFormula] = useState(false);
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaSymbol, setNewFormulaSymbol] = useState('');
  const [newFormulaSubject, setNewFormulaSubject] = useState<'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'Computer Science'>('Physics');
  const [newFormulaTopic, setNewFormulaTopic] = useState('');
  const [newFormulaDef, setNewFormulaDef] = useState('');
  const [newFormulaTip, setNewFormulaTip] = useState('');

  if (!isOpen) return null;

  const handleToggleFav = (id: string) => {
    toggleVaultFormulaFavorite(id);
    setFormulas(getAllVaultFormulas());
  };

  const handleCopyLatex = async (formula: VaultFormula) => {
    try {
      await navigator.clipboard.writeText(formula.latex || formula.symbol);
      setCopiedId(formula.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleExportKeep = async () => {
    try {
      await exportVaultToKeep(filteredFormulas, user?.uid || null);
      setSavedToKeep(true);
      setTimeout(() => setSavedToKeep(false), 3000);
    } catch {}
  };

  const handleDownloadSheet = () => {
    const text = `# Lumora STEM Formula & Definition Vault\nGenerated: ${new Date().toLocaleDateString()}\nTotal Formulas: ${filteredFormulas.length}\n\n` +
      filteredFormulas.map((f, i) => `### ${i + 1}. ${f.name} [${f.subject} • ${f.topic}]\n**Formula**: \`${f.symbol}\`\n**Latex**: \`${f.latex}\`\n**Definition**: ${f.definition}\n**Variables**:\n${f.variables.map(v => `- ${v.symbol}: ${v.meaning} ${v.units ? `(${v.units})` : ''}`).join('\n')}\n**Exam Tip**: ${f.examTip}\n`).join('\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumora_formula_sheet_${selectedSubject.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveCustomFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormulaName.trim() || !newFormulaSymbol.trim()) return;

    addCustomVaultFormula({
      name: newFormulaName,
      symbol: newFormulaSymbol,
      latex: newFormulaSymbol,
      subject: newFormulaSubject,
      topic: newFormulaTopic || 'General',
      definition: newFormulaDef || 'Key fundamental formula',
      variables: [],
      examTip: newFormulaTip || 'Practice solving for each variable under timed conditions.'
    });

    setFormulas(getAllVaultFormulas());
    setIsAddingFormula(false);
    setNewFormulaName('');
    setNewFormulaSymbol('');
    setNewFormulaTopic('');
    setNewFormulaDef('');
    setNewFormulaTip('');
  };

  const filteredFormulas = formulas.filter((f) => {
    if (selectedSubject === 'Favorites') {
      if (!f.favorite) return false;
    } else if (selectedSubject !== 'All') {
      if (f.subject !== selectedSubject) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.symbol.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q) ||
      f.definition.toLowerCase().includes(q)
    );
  });

  const activeFlashcard = filteredFormulas[flashcardIndex] || filteredFormulas[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <BookMarked className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Formula & Definition Vault</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  Lumora Feature #11
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Searchable master formula index with variable definitions, LaTeX, and 10-Min Flash Revision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setFlashcardIndex(0);
                setIsRevealed(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isFlashcardMode
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{isFlashcardMode ? 'Exit Drill' : '10-Min Revision Mode'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        {!isFlashcardMode && (
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search formulas, variables, symbols (e.g. Δt, Nernst, attention)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingFormula(true)}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Formula</span>
              </button>

              <button
                onClick={handleExportKeep}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition shrink-0 ${
                  savedToKeep
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Export vault to Google Keep"
              >
                {savedToKeep ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <StickyNote className="w-3.5 h-3.5 text-amber-400" />}
                <span>{savedToKeep ? 'Saved!' : 'To Keep'}</span>
              </button>

              <button
                onClick={handleDownloadSheet}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition border border-slate-700 shrink-0"
                title="Download formatted formula cheat sheet"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        )}

        {/* Subject Pills */}
        {!isFlashcardMode && (
          <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-950/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Favorites'].map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedSubject === subj
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {subj === 'Computer Science' ? 'CompSci' : subj}
              </button>
            ))}
            <span className="text-[11px] text-slate-500 ml-auto pl-2 font-mono">
              {filteredFormulas.length} formulas
            </span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* Flashcard 10-Minute Drill Mode */}
          {isFlashcardMode ? (
            activeFlashcard ? (
              <div className="max-w-xl mx-auto space-y-5 py-4 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Card {flashcardIndex + 1} of {filteredFormulas.length}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                    {activeFlashcard.subject} • {activeFlashcard.topic}
                  </span>
                </div>

                {/* Flip Card Stage */}
                <div 
                  onClick={() => setIsRevealed(!isRevealed)}
                  className="p-8 rounded-3xl bg-slate-950 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition shadow-2xl min-h-[300px] flex flex-col justify-between text-center relative group"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                      Formula & Definition Recall Challenge
                    </span>
                    <h3 className="text-xl font-black text-white">{activeFlashcard.name}</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-2">
                      {activeFlashcard.definition}
                    </p>
                  </div>

                  {/* Formula Reveal Box */}
                  <div className="py-6">
                    {isRevealed ? (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-2 animate-fade-in">
                        <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-wide">
                          {activeFlashcard.symbol}
                        </div>
                        <p className="text-[11px] font-mono text-amber-300">
                          LaTeX: {activeFlashcard.latex}
                        </p>
                      </div>
                    ) : (
                      <div className="py-8 text-slate-500 flex flex-col items-center gap-2 group-hover:text-amber-300 transition">
                        <EyeOff className="w-8 h-8 opacity-60" />
                        <span className="text-xs font-bold">Click card or button below to reveal governing equation</span>
                      </div>
                    )}
                  </div>

                  {/* Exam Tip Footer */}
                  {isRevealed && (
                    <div className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 animate-fade-in">
                      <strong className="text-rose-400">Exam Reminder: </strong>
                      {activeFlashcard.examTip}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono pt-2">
                    {isRevealed ? 'Tap to hide formula' : 'Tap to reveal formula'}
                  </div>
                </div>

                {/* Drill Navigation Buttons */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredFormulas.length - 1));
                      setIsRevealed(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setIsRevealed(!isRevealed)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition flex items-center gap-1.5"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide Formula' : 'Reveal Formula'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setFlashcardIndex((prev) => (prev < filteredFormulas.length - 1 ? prev + 1 : 0));
                      setIsRevealed(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No formulas match the current category.
              </div>
            )
          ) : (
            /* Standard Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFormulas.map((formula) => {
                const isCopied = copiedId === formula.id;

                return (
                  <div
                    key={formula.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                          {formula.subject} • {formula.topic}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyLatex(formula)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Copy Formula / LaTeX"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleToggleFav(formula.id)}
                            className={`p-1.5 rounded-lg transition ${
                              formula.favorite
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Favorite Formula"
                          >
                            <Star className={`w-3.5 h-3.5 ${formula.favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-white">{formula.name}</h4>

                      {/* Formula Banner */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono font-bold text-amber-300 text-sm tracking-wide">
                        {formula.symbol}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {formula.definition}
                      </p>

                      {/* Variable breakdown */}
                      {formula.variables && formula.variables.length > 0 && (
                        <div className="pt-1 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                            Variables & Units:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300 font-mono">
                            {formula.variables.map((v, vIdx) => (
                              <div key={vIdx} className="truncate">
                                <span className="text-rose-400 font-bold">{v.symbol}</span>: {v.meaning} {v.units ? `(${v.units})` : ''}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/30 text-[11px] text-rose-200">
                      <strong className="text-rose-400">Exam Tip: </strong>
                      {formula.examTip}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Add Formula Dialog */}
        {isAddingFormula && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">Add Formula to Vault</h4>
                <button
                  onClick={() => setIsAddingFormula(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomFormula} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Formula Name</label>
                  <input
                    type="text"
                    required
                    value={newFormulaName}
                    onChange={(e) => setNewFormulaName(e.target.value)}
                    placeholder="e.g. Lens Maker's Formula"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Equation / Expression</label>
                  <input
                    type="text"
                    required
                    value={newFormulaSymbol}
                    onChange={(e) => setNewFormulaSymbol(e.target.value)}
                    placeholder="e.g. 1/f = (μ - 1)(1/R1 - 1/R2)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Subject</label>
                    <select
                      value={newFormulaSubject}
                      onChange={(e) => setNewFormulaSubject(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Topic / Unit</label>
                    <input
                      type="text"
                      value={newFormulaTopic}
                      onChange={(e) => setNewFormulaTopic(e.target.value)}
                      placeholder="e.g. Ray Optics"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Definition / Meaning</label>
                  <textarea
                    rows={2}
                    value={newFormulaDef}
                    onChange={(e) => setNewFormulaDef(e.target.value)}
                    placeholder="Brief explanation of when to apply this equation..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Exam Tip / Sign Convention</label>
                  <input
                    type="text"
                    value={newFormulaTip}
                    onChange={(e) => setNewFormulaTip(e.target.value)}
                    placeholder="e.g. Watch sign of R2 for biconvex lenses (always negative)!"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFormula(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black"
                  >
                    Save to Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Personal STEM formula index with Google Keep sync</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
