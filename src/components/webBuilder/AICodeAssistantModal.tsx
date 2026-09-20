import React, { useState } from 'react';
import { 
  Sparkles, Bug, Wrench, BookOpen, Zap, HelpCircle, Check, Copy, 
  ArrowRight, X, Loader2, Code, ShieldCheck, ChevronRight, RefreshCw,
  FileCode, Layers, AlertCircle
} from 'lucide-react';
import { analyzeCodeWithGemini, AnalyzeCodeResponse, CodeSuggestion } from '../../services/geminiCodeAssistantService';

interface AICodeAssistantModalProps {
  html: string;
  css: string;
  js: string;
  activeFile?: 'html' | 'css' | 'js' | 'all';
  onApplyCode: (updated: { html?: string; css?: string; js?: string }) => void;
  onClose: () => void;
}

export const AICodeAssistantModal: React.FC<AICodeAssistantModalProps> = ({
  html,
  css,
  js,
  activeFile = 'all',
  onApplyCode,
  onClose
}) => {
  const [mode, setMode] = useState<'fix-bugs' | 'refactor' | 'explain' | 'optimize' | 'custom'>('fix-bugs');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCodeResponse | null>(null);
  const [previewTab, setPreviewTab] = useState<'html' | 'css' | 'js'>('js');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await analyzeCodeWithGemini({
      html,
      css,
      js,
      mode,
      instruction: customPrompt.trim(),
      activeFile
    });

    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleApplyAll = () => {
    if (!analysisResult) return;
    onApplyCode({
      html: analysisResult.improvedHtml,
      css: analysisResult.improvedCss,
      js: analysisResult.improvedJs
    });
    setAppliedNotice('All fixes and improvements applied directly to your workspace!');
    setTimeout(() => {
      setAppliedNotice(null);
      onClose();
    }, 1500);
  };

  const handleApplySingle = (target: 'html' | 'css' | 'js') => {
    if (!analysisResult) return;
    if (target === 'html') onApplyCode({ html: analysisResult.improvedHtml });
    if (target === 'css') onApplyCode({ css: analysisResult.improvedCss });
    if (target === 'js') onApplyCode({ js: analysisResult.improvedJs });

    setAppliedNotice(`Applied improved ${target.toUpperCase()} to workspace!`);
    setTimeout(() => setAppliedNotice(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">AI Code Assistant</h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Senior Code Mentor & Pair Programmer: Automatic bug fixes, refactoring, and explanations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Mode Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Analysis Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('fix-bugs')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                  mode === 'fix-bugs'
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md shadow-rose-900/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Bug className="w-4 h-4 text-rose-400" />
                  {mode === 'fix-bugs' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                </div>
                <span className="font-bold text-xs text-white">Fix Bugs & Errors</span>
                <span className="text-[10px] text-slate-400 leading-tight">Runtime and syntax repairs</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('refactor')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                  mode === 'refactor'
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-900/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Wrench className="w-4 h-4 text-indigo-400" />
                  {mode === 'refactor' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </div>
                <span className="font-bold text-xs text-white">Refactor Code</span>
                <span className="text-[10px] text-slate-400 leading-tight">Modern ES6+ and clean styling</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('explain')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                  mode === 'explain'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md shadow-amber-900/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {mode === 'explain' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </div>
                <span className="font-bold text-xs text-white">Explain Step-by-Step</span>
                <span className="text-[10px] text-slate-400 leading-tight">Learn concepts and logic</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('optimize')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition ${
                  mode === 'optimize'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  {mode === 'optimize' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <span className="font-bold text-xs text-white">Optimize & Polish</span>
                <span className="text-[10px] text-slate-400 leading-tight">Accessibility & responsive flow</span>
              </button>
            </div>
          </div>

          {/* Optional Prompt Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Specific Question or Instruction (Optional)</span>
              <span className="text-[10px] text-slate-500">e.g. "Add a restart button to the score counter"</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask Gemini anything about your workspace code or describe the behavior you want..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
              />
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition active:scale-95 shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notification banner when applied */}
          {appliedNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{appliedNotice}</span>
            </div>
          )}

          {/* Analysis Results View */}
          {analysisResult && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Summary Banner */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">Analysis Summary</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100">{analysisResult.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleApplyAll}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply All Improvements</span>
                  </button>
                </div>
              </div>

              {/* Suggestions Breakdown */}
              {analysisResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recommendations ({analysisResult.suggestions.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisResult.suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              {s.type === 'bug' ? (
                                <Bug className="w-3.5 h-3.5 text-rose-400" />
                              ) : s.type === 'performance' ? (
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                              ) : (
                                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                              )}
                              <span>{s.title}</span>
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                              {s.file}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Preview & Differential View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setPreviewTab('html')}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                        previewTab === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      index.html
                    </button>
                    <button
                      onClick={() => setPreviewTab('css')}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                        previewTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      style.css
                    </button>
                    <button
                      onClick={() => setPreviewTab('js')}
                      className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                        previewTab === 'js' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      app.js
                    </button>
                  </div>

                  <button
                    onClick={() => handleApplySingle(previewTab)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Apply {previewTab.toUpperCase()} Only</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
                  <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Improved Code Preview ({previewTab})</span>
                    <span className="text-[10px] text-slate-500">Ready to replace current workspace file</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-slate-200 max-h-64 leading-relaxed whitespace-pre-wrap select-all">
                    {previewTab === 'html'
                      ? analysisResult.improvedHtml
                      : previewTab === 'css'
                      ? analysisResult.improvedCss
                      : analysisResult.improvedJs}
                  </pre>
                </div>
              </div>

              {/* Educational Explanation */}
              {analysisResult.explanation && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Educational Takeaway</span>
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {analysisResult.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Current Workspace: HTML ({html.length} chars), CSS ({css.length} chars), JS ({js.length} chars)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
            >
              Close
            </button>
            {analysisResult && (
              <button
                onClick={handleApplyAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Update Workspace</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
