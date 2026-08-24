import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, BookOpen, Layers, Check, Copy, Bookmark, Languages, 
  RefreshCw, Send, Mic, HelpCircle, FileText, ArrowRight, CheckCircle2,
  Columns, RotateCcw, Award, Zap, Brain, ChevronRight, ExternalLink,
  Plus, Play, AlertCircle, Share2, Lightbulb
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  ExplainSimplyService, 
  ExplainSimplyRequest, 
  ExplainSimplyResult, 
  ExplanationLevel, 
  GroundingMode, 
  LanguageChoice,
  DifficultTerm
} from '../../services/explainSimplyService';
import { useNavigate } from 'react-router-dom';

interface ExplainSimplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  sourceContext?: {
    sourceName?: string;
    pageNumber?: string | number;
    chapter?: string;
    section?: string;
    documentId?: string;
  };
  onReplaceText?: (newText: string) => void;
  onInsertBelowText?: (newText: string) => void;
  editableMode?: boolean;
}

export function ExplainSimplyModal({
  isOpen,
  onClose,
  selectedText,
  sourceContext,
  onReplaceText,
  onInsertBelowText,
  editableMode = false
}: ExplainSimplyModalProps) {
  const navigate = useNavigate();

  // State controls
  const [level, setLevel] = useState<ExplanationLevel>('very-simple');
  const [mode, setMode] = useState<GroundingMode>('combined');
  const [language, setLanguage] = useState<LanguageChoice>('en');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainSimplyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Advanced features state
  const [stillConfused, setStillConfused] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<DifficultTerm | null>(null);
  
  // Follow-up state
  const [followupInput, setFollowupInput] = useState('');
  const [history, setHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  
  // Interactive Flashcards & Quiz Modal states
  const [activeTab, setActiveTab] = useState<'explanation' | 'flashcards' | 'quiz' | 'save'>('explanation');
  const [flashcardsData, setFlashcardsData] = useState<{ title?: string; cards: Array<{ front: string; back: string }> } | null>(null);
  const [quizData, setQuizData] = useState<{ title?: string; questions: Array<{ id: string; question: string; options: string[]; correctAnswer: number; explanation: string }> } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Save Note state
  const [saveTitle, setSaveTitle] = useState('');
  const [saveTags, setSaveTags] = useState('Biology, Science, Notes');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Copy state
  const [copied, setCopied] = useState(false);

  const modalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && selectedText) {
      setHistory([]);
      setStillConfused(false);
      setSideBySide(false);
      setActiveTab('explanation');
      setSelectedTerm(null);
      setSavedSuccess(false);
      setSaveTitle(selectedText.slice(0, 40) + '... Explanation');
      fetchExplanation('very-simple', 'combined', 'en', false);
    }
  }, [isOpen, selectedText]);

  const fetchExplanation = async (
    targetLevel = level,
    targetMode = mode,
    targetLang = language,
    isConfused = false,
    customPrompt?: string
  ) => {
    if (!selectedText) return;
    setLoading(true);
    setError(null);

    const req: ExplainSimplyRequest = {
      text: selectedText,
      level: targetLevel,
      mode: targetMode,
      sourceContext,
      language: targetLang,
      stillConfused: isConfused,
      history,
      customPrompt
    };

    try {
      const data = await ExplainSimplyService.fetchExplanation(req);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to load explanation. Showing local backup.");
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (newLevel: ExplanationLevel) => {
    setLevel(newLevel);
    setStillConfused(false);
    fetchExplanation(newLevel, mode, language, false);
  };

  const handleModeChange = (newMode: GroundingMode) => {
    setMode(newMode);
    fetchExplanation(level, newMode, language, stillConfused);
  };

  const handleLangChange = (newLang: LanguageChoice) => {
    setLanguage(newLang);
    fetchExplanation(level, mode, newLang, stillConfused);
  };

  const handleStillConfused = () => {
    setStillConfused(true);
    fetchExplanation(level, mode, language, true, "Explain using a completely different real-world story, visual breakdown, or cartoon analogy!");
  };

  const handleSendFollowup = async (promptText?: string) => {
    const query = promptText || followupInput;
    if (!query.trim() || loading) return;

    const newHistory = [...history, { sender: 'user' as const, text: query }];
    setHistory(newHistory);
    setFollowupInput('');
    setLoading(true);

    try {
      const data = await ExplainSimplyService.fetchExplanation({
        text: selectedText,
        level,
        mode,
        sourceContext,
        language,
        stillConfused: false,
        history: newHistory,
        customPrompt: query
      });

      setResult(data);
      setHistory([...newHistory, { sender: 'ai' as const, text: data.explanation }]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => modalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!result) return;
    setLoading(true);
    setActiveTab('flashcards');
    const cards = await ExplainSimplyService.generateFlashcards(selectedText, result.explanation);
    setFlashcardsData(cards);
    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!result) return;
    setLoading(true);
    setActiveTab('quiz');
    setQuizAnswers({});
    setQuizSubmitted(false);
    const quiz = await ExplainSimplyService.generateQuiz(selectedText, result.explanation);
    setQuizData(quiz);
    setLoading(false);
  };

  const handleSaveToNotes = () => {
    if (!result) return;
    ExplainSimplyService.saveNote({
      originalText: selectedText,
      title: saveTitle || "Lumora AI Explanation",
      explanation: result.explanation,
      level: result.level,
      keyIdea: result.keyIdea,
      example: result.example,
      sourceName: sourceContext?.sourceName,
      chapter: sourceContext?.chapter,
      tags: saveTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('explanation');
    }, 1800);
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `📌 ${result.title}\n\nKey Idea: ${result.keyIdea}\n\nExplanation:\n${result.explanation}\n\nExample:\n${result.example}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden transition-all relative">
        
        {/* TOP HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-slate-900 dark:text-white font-display text-base tracking-tight">
                  Lumora Explain Simply
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  AI Context Transformation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                NotebookLM Source Grounded • Notion AI Style • Interactive Mentor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSideBySide(!sideBySide)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                sideBySide 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle side-by-side comparison mode"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUBHEADER CONTROL BAR (Levels, Language, Source Mode) */}
        <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap shrink-0">
          
          {/* LEVEL SELECTOR TABS */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto max-w-full">
            <button
              onClick={() => handleLevelChange('very-simple')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                level === 'very-simple'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>🐣</span> Very Simple
            </button>
            <button
              onClick={() => handleLevelChange('school')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                level === 'school'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>🎒</span> School Level
            </button>
            <button
              onClick={() => handleLevelChange('detailed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                level === 'detailed'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>📚</span> Detailed
            </button>
            <button
              onClick={() => handleLevelChange('exam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                level === 'exam'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>🎯</span> Exam Level
            </button>
          </div>

          {/* LANGUAGE & GROUNDING CONTROLS */}
          <div className="flex items-center gap-2">
            {/* Grounding Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              <button
                onClick={() => handleModeChange('source')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  mode === 'source' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Strict Source Mode (NotebookLM)"
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden md:inline">Source</span>
              </button>
              <button
                onClick={() => handleModeChange('combined')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  mode === 'combined' ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Combined Source + AI Mode"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden md:inline">Combined</span>
              </button>
              <button
                onClick={() => handleModeChange('general')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  mode === 'general' ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="General Knowledge Mode"
              >
                <Brain className="w-3 h-3" />
                <span className="hidden md:inline">General</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              <button
                onClick={() => handleLangChange('en')}
                className={`px-2 py-1 rounded-lg font-bold ${language === 'en' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange('hi')}
                className={`px-2 py-1 rounded-lg font-bold ${language === 'hi' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLangChange('bilingual')}
                className={`px-2 py-1 rounded-lg font-bold ${language === 'bilingual' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500'}`}
              >
                Hinglish
              </button>
            </div>
          </div>
        </div>

        {/* VIEW NAVIGATION TABS (Explanation | Flashcards | Quiz | Save) */}
        <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'explanation' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Explanation
          </button>

          <button
            onClick={handleGenerateFlashcards}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'flashcards' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Create Flashcards
          </button>

          <button
            onClick={handleGenerateQuiz}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Test Me (Quiz)
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'save' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save to Notes
          </button>
        </div>

        {/* MAIN BODY SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center animate-spin">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 dark:text-white font-display text-base">
                  Reading your selected content...
                </p>
                <p className="text-xs text-slate-500 animate-pulse">
                  Applying NotebookLM source grounding & level {level} translation...
                </p>
              </div>
            </div>
          ) : activeTab === 'flashcards' ? (
            /* FLASHCARDS GENERATED VIEW */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                    AI Flashcard Deck
                  </h3>
                  <p className="text-xs text-slate-500">Extracted from your selected concept for retention</p>
                </div>
                <button
                  onClick={() => navigate('/student/flashcards')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                >
                  Open Full Generator <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {flashcardsData?.cards?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flashcardsData.cards.map((card, i) => (
                    <div key={i} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-3 hover:border-blue-400 transition-all">
                      <div className="flex justify-between items-center text-[10px] uppercase font-extrabold text-blue-600 dark:text-blue-400">
                        <span>Card #{i + 1}</span>
                        <span>Question & Answer</span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        Q: {card.front}
                      </p>
                      <div className="p-3 bg-blue-50/50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-blue-700 dark:text-blue-300">Answer: </span>
                        {card.back}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Generating flashcards...</p>
              )}
            </div>
          ) : activeTab === 'quiz' ? (
            /* QUIZ GENERATED VIEW */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                    Test Your Knowledge Quiz
                  </h3>
                  <p className="text-xs text-slate-500">5 targeted multiple-choice questions based on this concept</p>
                </div>
              </div>

              {quizData?.questions?.length ? (
                <div className="space-y-5">
                  {quizData.questions.map((q, idx) => (
                    <div key={q.id} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const isCorrect = q.correctAnswer === optIdx;
                          let btnStyle = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                          
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold";
                            else if (isSelected) btnStyle = "bg-red-100 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-200";
                          } else if (isSelected) {
                            btnStyle = "bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200 font-bold";
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-blue-700 dark:text-blue-300">Explanation: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.01] transition-all"
                    >
                      Submit Quiz Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGenerateQuiz()}
                      className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Try Another Quiz
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ) : activeTab === 'save' ? (
            /* SAVE TO NOTES VIEW */
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm animate-fade-in">
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                Save Explanation to Lumora Notes Library
              </h3>
              <p className="text-xs text-slate-500">
                Preserve original text, AI explanation, source citations, and keywords for revision.
              </p>

              {savedSuccess ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-xs">Saved successfully to your Notes Library!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Note Title</label>
                    <input 
                      type="text"
                      value={saveTitle}
                      onChange={e => setSaveTitle(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                    <input 
                      type="text"
                      value={saveTags}
                      onChange={e => setSaveTags(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <button
                    onClick={handleSaveToNotes}
                    className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bookmark className="w-4 h-4" /> Save Note Now
                  </button>
                </div>
              )}
            </div>
          ) : result ? (
            /* MAIN EXPLANATION VIEW */
            <div className="space-y-6 animate-fade-in">

              {/* SOURCE CITATION BADGE (NotebookLM Style) */}
              {result.sourceCitation && (
                <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-extrabold text-blue-900 dark:text-blue-200">
                        Based on Source: {result.sourceCitation.sourceName || sourceContext?.sourceName || "Lumora Textbook"}
                      </span>
                      {result.sourceCitation.chapter && (
                        <span className="text-blue-700 dark:text-blue-300 font-medium ml-1">
                          • {result.sourceCitation.chapter}
                        </span>
                      )}
                      {result.sourceCitation.pageNumber && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold ml-1">
                          (Page {result.sourceCitation.pageNumber})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-200/60 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0">
                    Grounded Citation
                  </span>
                </div>
              )}

              {/* SIDE BY SIDE COMPARISON OR REGULAR VIEW */}
              {sideBySide ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Original Text */}
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Original Selected Content</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{selectedText}"
                    </p>
                  </div>

                  {/* Right: AI Simplified Explanation */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-slate-800 dark:to-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Lumora AI Simplified Explanation</span>
                    <div className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                      <ReactMarkdown>{result.explanation}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard View */
                <div className="space-y-6">
                  {/* Selected Text Collapsible Preview */}
                  <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-500 font-semibold shrink-0">Selected:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
                        "{selectedText}"
                      </p>
                    </div>
                  </div>

                  {/* KEY IDEA HIGHLIGHT BANNER */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-md space-y-1">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-300" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Key Idea in 1 Sentence</span>
                    </div>
                    <p className="font-bold text-sm text-white font-display">
                      {result.keyIdea}
                    </p>
                  </div>

                  {/* MAIN EXPLANATION CONTENT */}
                  <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                      <h3 className="font-extrabold text-slate-900 dark:text-white font-display text-base">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {result.strategyUsed && (
                          <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold rounded-lg border border-indigo-200 dark:border-indigo-800">
                            Strategy: {result.strategyUsed}
                          </span>
                        )}
                        <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-extrabold rounded-lg">
                          {result.level}
                        </span>
                      </div>
                    </div>

                    {/* Markdown Body */}
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium space-y-3">
                      <ReactMarkdown>{result.explanation}</ReactMarkdown>
                    </div>

                    {/* VISUAL CONCEPT / PROCESS FLOWCHART */}
                    {result.visualConcept && (
                      <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">
                          <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5" /> Visual Process Map</span>
                          <button 
                            onClick={() => navigate('/student/mindmap')}
                            className="text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            Open in Mind Map <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-cyan-200 border border-slate-800 overflow-x-auto">
                          {result.visualConcept}
                        </div>
                      </div>
                    )}

                    {/* REAL WORLD EXAMPLE BOX */}
                    {result.example && (
                      <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300 tracking-wider flex items-center gap-1">
                          <span>🌱</span> Everyday Real-World Example
                        </span>
                        <p className="text-xs text-emerald-950 dark:text-emerald-100 font-medium">
                          {result.example}
                        </p>
                      </div>
                    )}

                    {/* DIFFICULT TERMS INTERACTIVE CLICKABLE CARDS */}
                    {result.difficultTerms && result.difficultTerms.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Key Vocabulary Definitions (Click a term)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.difficultTerms.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedTerm(item)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 transition-all flex items-center gap-1.5"
                            >
                              <span>💡</span> {item.term}
                            </button>
                          ))}
                        </div>

                        {/* Selected Term Popover Card */}
                        {selectedTerm && (
                          <div className="mt-2 p-4 bg-amber-500 text-slate-950 rounded-2xl shadow-lg space-y-2 animate-fade-in relative">
                            <button
                              onClick={() => setSelectedTerm(null)}
                              className="absolute top-2 right-2 text-slate-950 hover:opacity-70"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <h4 className="font-extrabold text-sm font-display">{selectedTerm.term}</h4>
                            <p className="text-xs font-medium leading-relaxed">{selectedTerm.definition}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EXAM / REMEMBER THIS CHECKLIST */}
                    {result.rememberThis && result.rememberThis.length > 0 && (
                      <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 tracking-wider flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Exam Points — "Remember This"
                        </span>
                        <ul className="space-y-1">
                          {result.rememberThis.map((pt, i) => (
                            <li key={i} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* "I'M STILL CONFUSED" BUTTON MODE */}
              <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl border border-purple-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-xs text-white">Still feeling confused?</h4>
                  <p className="text-[11px] text-purple-200">Lumora will switch to a visual story or cartoon breakdown strategy.</p>
                </div>
                <button
                  onClick={handleStillConfused}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Explain Another Way!
                </button>
              </div>

              {/* NOTION-STYLE ACTION BAR */}
              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {editableMode && onReplaceText && (
                    <button
                      onClick={() => { onReplaceText(result.explanation); onClose(); }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                      Replace Original
                    </button>
                  )}

                  {editableMode && onInsertBelowText && (
                    <button
                      onClick={() => { onInsertBelowText(`\n\n> **AI Explanation:** ${result.explanation}`); onClose(); }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Insert Below
                    </button>
                  )}

                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('save')}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </div>

              {/* FOLLOW-UP CONVERSATION AREA */}
              <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white font-display">
                    Still confused? Ask Lumora a follow-up
                  </h4>
                </div>

                {/* SUGGESTED FOLLOW-UP CHIPS */}
                <div className="flex flex-wrap gap-2">
                  {(result.suggestedFollowups || [
                    "Explain with another example",
                    "Why does this happen?",
                    "Give a step-by-step breakdown",
                    "Explain in Hindi"
                  ]).map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendFollowup(chip)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full text-xs font-medium transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                {/* History Conversation List */}
                {history.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    {history.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white ml-auto max-w-[85%]'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 mr-auto max-w-[90%]'
                        }`}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ))}
                    <div ref={modalEndRef} />
                  </div>
                )}

                {/* Input form */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendFollowup(); }} 
                  className="flex items-center gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={followupInput}
                    onChange={e => setFollowupInput(e.target.value)}
                    placeholder="Type a follow-up question..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !followupInput.trim()}
                    className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
