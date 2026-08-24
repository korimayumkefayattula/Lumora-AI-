import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  Copy, 
  Download, 
  Share2, 
  Bookmark, 
  Trash2, 
  Check, 
  RefreshCw, 
  Filter, 
  BookOpen, 
  FileText, 
  Upload, 
  Volume2, 
  VolumeX, 
  Clock, 
  Layers, 
  GraduationCap, 
  CheckCircle2, 
  X,
  AlertCircle,
  FileCode,
  ListOrdered
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { SummaryItem } from '../types';

const SYLLABUS_PRESETS = [
  { label: 'Physics - Laws of Motion & Momentum (Class 11/JEE)', value: 'Newton\'s Laws of Motion, Linear Momentum, Conservation of Momentum, Friction coefficients, and Free Body Diagrams in Classical Mechanics' },
  { label: 'Physics - Current Electricity & Kirchhoff\'s Laws (Class 12)', value: 'Electric Current, Drift Velocity, Ohm\'s Law, Kirchhoff\'s Current & Voltage Laws, Wheatstone Bridge, and Potentiometer' },
  { label: 'Chemistry - Chemical Bonding & Hybridization (Class 11)', value: 'VSEPR Theory, Valence Bond Theory, Hybridization (sp, sp2, sp3, sp3d), Molecular Orbital Theory, and Hydrogen Bonding' },
  { label: 'Chemistry - Organic Aldehydes, Ketones & Carboxylic Acids (Class 12)', value: 'Nucleophilic addition reactions, Aldol Condensation, Cannizzaro reaction, Grignard reagents, and Carboxylic acid acidity' },
  { label: 'Biology - Cell Cycle, Mitosis & Meiosis (Class 11)', value: 'Phases of Cell Cycle (G1, S, G2, M phase), Mitosis stages, Meiosis I and II, Synapsis, Crossing Over, and Significance in Genetics' },
  { label: 'Biology - Molecular Basis of Inheritance & DNA Replication (Class 12)', value: 'Structure of DNA & RNA, Semi-conservative DNA replication, Transcription, Genetic Code, Translation, and Lac Operon' },
  { label: 'Mathematics - Differential Calculus & Applications of Derivatives', value: 'Limits, Continuity, Differentiation rules, Maxima and Minima, Tangents & Normals, Rate of change, and Mean Value Theorems' },
  { label: 'Mathematics - Probability & Bayes\' Theorem (Class 12/JEE)', value: 'Conditional Probability, Multiplication theorem, Total probability theorem, Bayes\' Theorem, and Random variables' },
  { label: 'Computer Science - Data Structures & Binary Trees', value: 'Arrays, Linked Lists, Stacks, Queues, Binary Search Trees, Tree Traversals (Inorder, Preorder, Postorder), and Big-O Time Complexity' },
  { label: 'History - Indian National Movement & Independence Struggle', value: '1857 Revolt, Formation of INC, Swadeshi Movement, Non-Cooperation, Civil Disobedience, Quit India Movement, and 1947 Partition' }
];

type InputMode = 'preset' | 'text' | 'file';
type SummaryFormat = 'Quick Summary' | 'Detailed Summary' | 'Exam Revision' | 'Key Points' | 'Formula Sheet';
type GradeLevel = 'Class 9-10' | 'Class 11-12' | 'JEE / NEET' | 'College / University' | 'General Learning';

export default function AISummaryPage() {
  const [inputMode, setInputMode] = useState<InputMode>('preset');
  const [selectedPreset, setSelectedPreset] = useState(SYLLABUS_PRESETS[0].value);
  const [customText, setCustomText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  
  const [summaryType, setSummaryType] = useState<SummaryFormat>('Quick Summary');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('Class 11-12');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeSummary, setActiveSummary] = useState<string | null>(
    `## 🚀 Executive Summary
Newton's Laws of Motion form the cornerstone of classical Newtonian mechanics, explaining how forces govern the translational motion and acceleration of physical bodies in inertial reference frames.

---

### 📐 Fundamental Formulations
1. **First Law (Law of Inertia)**: A body remains at rest or in uniform velocity unless acted upon by a net external force:
   $$\\sum \\vec{F}_{ext} = 0 \\implies \\vec{a} = 0$$

2. **Second Law (Momentum & Force)**: The rate of change of linear momentum $\\vec{p} = m\\vec{v}$ is directly proportional to the applied net external force:
   $$\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\vec{a} \\quad \\text{(for constant mass)}$$

3. **Third Law (Action-Reaction Pairs)**: Forces always occur in matched collinear pairs acting on two distinct bodies:
   $$\\vec{F}_{AB} = -\\vec{F}_{BA}$$

---

### 🎯 High-Yield Exam Takeaways
- **Action & Reaction never cancel each other** because they act on **two different interacting objects**.
- **Friction is self-adjusting**: Static friction $f_s \\le \\mu_s N$ matches the applied tangential force until reaching the limiting threshold $f_{s,max} = \\mu_s N$.
- **Pseudo Force in Non-Inertial Frames**: When analyzing from an accelerating frame with acceleration $\\vec{a}_0$, apply an inertial correction force $\\vec{F}_{pseudo} = -m\\vec{a}_0$.`
  );

  const [metadata, setMetadata] = useState<{ wordCount: number; readingTimeMinutes: number }>({
    wordCount: 185,
    readingTimeMinutes: 1
  });

  const [savedSummaries, setSavedSummaries] = useState<SummaryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumora_saved_summaries');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: '1',
        title: 'Newton\'s Laws of Motion (Class 11)',
        type: 'Quick Summary',
        content: 'Newton\'s three laws, momentum conservation, friction mechanics, and inertial frames.',
        date: '2026-08-10',
        sourceDocName: 'Physics Ch4.pdf'
      },
      {
        id: '2',
        title: 'Cell Cycle & Mitosis (Class 11)',
        type: 'Exam Revision',
        content: 'Interphase G1-S-G2, Prophase, Metaphase plate alignment, Anaphase sister chromatid separation.',
        date: '2026-08-05',
        sourceDocName: 'Biology Ch10.pdf'
      }
    ];
  });

  const [copied, setCopied] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage when savedSummaries change
  useEffect(() => {
    try {
      localStorage.setItem('lumora_saved_summaries', JSON.stringify(savedSummaries));
    } catch (e) {}
  }, [savedSummaries]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUploadedFile({
        name: file.name,
        data: base64,
        mimeType: file.type || 'application/pdf'
      });
      setInputMode('file');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    // Stop active audio
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }

    try {
      let topicPayload = '';
      let contentPayload = '';
      let fileDataPayload = undefined;
      let mimeTypePayload = undefined;

      if (inputMode === 'preset') {
        const found = SYLLABUS_PRESETS.find(p => p.value === selectedPreset);
        topicPayload = found ? found.label : selectedPreset;
        contentPayload = selectedPreset;
      } else if (inputMode === 'text') {
        if (!customText.trim()) {
          throw new Error("Please enter or paste study text in the box.");
        }
        topicPayload = customText.slice(0, 60).replace(/\n/g, ' ') + '...';
        contentPayload = customText.trim();
      } else if (inputMode === 'file') {
        if (!uploadedFile) {
          throw new Error("Please select a document file to upload.");
        }
        topicPayload = uploadedFile.name;
        fileDataPayload = uploadedFile.data;
        mimeTypePayload = uploadedFile.mimeType;
      }

      const res = await fetch("/api/ai-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicPayload,
          content: contentPayload,
          fileData: fileDataPayload,
          mimeType: mimeTypePayload,
          summaryType,
          gradeLevel
        })
      });

      const data = await res.json();
      if (!res.ok || !data.summary) {
        throw new Error(data.details || data.error || "Failed to generate summary");
      }

      setActiveSummary(data.summary);
      setMetadata({
        wordCount: data.wordCount || data.summary.split(/\s+/).length,
        readingTimeMinutes: data.readingTimeMinutes || 1
      });
    } catch (err: any) {
      console.error("Summary error:", err);
      setError(err.message || "Failed to generate AI summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (activeSummary) {
      navigator.clipboard.writeText(activeSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!activeSummary) return;
    const blob = new Blob([activeSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lumora_${summaryType.replace(/\s+/g, '_')}_${Date.now()}.md`;
    a.click();
  };

  const handleSaveToLibrary = () => {
    if (!activeSummary) return;
    const title = inputMode === 'preset' 
      ? (SYLLABUS_PRESETS.find(p => p.value === selectedPreset)?.label.slice(0, 40) || selectedPreset.slice(0, 40))
      : inputMode === 'file'
      ? uploadedFile?.name || 'Uploaded Document'
      : customText.slice(0, 35) + '...';

    const newItem: SummaryItem = {
      id: Date.now().toString(),
      title: `${title} (${summaryType})`,
      type: summaryType,
      content: activeSummary,
      date: new Date().toISOString().split('T')[0],
      sourceDocName: inputMode === 'file' ? uploadedFile?.name : 'AI Knowledge Engine'
    };

    setSavedSummaries([newItem, ...savedSummaries.filter(s => s.id !== newItem.id)]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedSummaries(savedSummaries.filter(s => s.id !== id));
    setDeleteConfirmId(null);
  };

  // Text-to-speech voice playback
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    if (!activeSummary) return;

    // Strip markdown formatting for cleaner speech
    const cleanSpeech = activeSummary
      .replace(/#+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\$\$.*?\$\$/g, ' equation ')
      .replace(/\$.*?\$/g, ' formula ')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>Lumora AI Summary Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Document & Syllabus Summarizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Turn long chapters, lecture notes, or uploaded PDFs into structured revision sheets with formulas and key takeaways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInputMode('preset');
              setSelectedPreset(SYLLABUS_PRESETS[Math.floor(Math.random() * SYLLABUS_PRESETS.length)].value);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
            <span>Random Topic</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input Configuration (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          
          {/* 1. SOURCE SELECTION TABS */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              1. Choose Material Source
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMode('preset')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'preset'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Syllabus</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'text'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Notes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode('file');
                  if (!uploadedFile) fileInputRef.current?.click();
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'file'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
              </button>
            </div>
          </div>

          {/* Dynamic Input Body */}
          {inputMode === 'preset' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Core Concept / Chapter:
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 outline-none leading-relaxed"
              >
                {SYLLABUS_PRESETS.map((p, idx) => (
                  <option key={idx} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {inputMode === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paste Study Notes / Textbook Text:
                </label>
                {customText && (
                  <button onClick={() => setCustomText('')} className="text-[11px] text-red-500 hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste paragraph, chapter excerpt, or lecture transcript here..."
                rows={5}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-normal focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {inputMode === 'file' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf,text/plain,image/*"
                className="hidden"
              />
              {uploadedFile ? (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="truncate text-xs">
                      <p className="font-bold text-blue-900 dark:text-blue-300 truncate">{uploadedFile.name}</p>
                      <p className="text-[11px] text-blue-600/80 dark:text-blue-400">File attached & ready</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload study document</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Supports PDF, TXT, and textbook photo scans</span>
                </div>
              )}
            </div>
          )}

          {/* 2. SUMMARY FORMAT SELECTION */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              2. Summary Format & Depth
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: 'Quick Summary', label: '1-Min Overview', desc: 'Core idea & takeaways' },
                { id: 'Detailed Summary', label: 'In-Depth Analysis', desc: 'Theories & derivations' },
                { id: 'Exam Revision', label: '5-Min Exam Prep', desc: 'Formulas & high-risk traps' },
                { id: 'Formula Sheet', label: 'Formula Cheat Sheet', desc: 'Equations, units & values' },
              ] as const).map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSummaryType(fmt.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    summaryType === fmt.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{fmt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. TARGET GRADE LEVEL */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              3. Target Exam / Academic Level
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Class 9-10', 'Class 11-12', 'JEE / NEET', 'College / University', 'General Learning'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setGradeLevel(lvl)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    gradeLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Distilling Key Concepts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-Yield Summary</span>
              </>
            )}
          </button>

        </div>

        {/* RIGHT COLUMN: Interactive Summary Viewer (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[500px]">
          
          <div>
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {summaryType}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {metadata.wordCount} words • ~{metadata.readingTimeMinutes} min read
                </span>
              </div>

              {activeSummary && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleSpeech}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isReading
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={isReading ? "Stop Voice Playback" : "Read Aloud"}
                  >
                    {isReading ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-500" />}
                    <span>{isReading ? "Stop" : "Read Aloud"}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSaveToLibrary}
                    className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 rounded-xl text-xs font-semibold flex items-center gap-1 border border-amber-200 dark:border-amber-800 transition-colors"
                    title="Save to Library"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center gap-1 border border-blue-200 dark:border-blue-800 transition-colors"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 animate-pulse">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Synthesizing Pedagogical Summary...</h4>
                  <p className="text-xs text-slate-400 mt-1">Extracting formulas, core definitions, and exam checkpoints.</p>
                </div>
              </div>
            ) : activeSummary ? (
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans space-y-3">
                <ReactMarkdown>{activeSummary}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 text-xs">
                Select a topic and click "Generate High-Yield Summary" to begin.
              </div>
            )}
          </div>

          {/* Action Footer */}
          {activeSummary && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Syllabus Verified & LaTeX Formatted
              </span>
              <span>Generated with Gemini 2.5</span>
            </div>
          )}

        </div>

      </div>

      {/* SAVED SUMMARIES LIBRARY */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Summaries Library ({savedSummaries.length})</span>
          </h2>
        </div>

        {savedSummaries.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No saved summaries yet. Click "Save" on any generated summary to keep it here.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSummaries.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 relative group">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                    {item.type}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.content}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.sourceDocName}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setActiveSummary(item.content);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {deleteConfirmId === item.id && (
                  <div className="absolute inset-0 bg-slate-900/95 rounded-2xl p-3 flex flex-col justify-center items-center text-center z-10 animate-fade-in">
                    <p className="text-white text-xs font-bold mb-2">Delete this summary?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeleteSaved(item.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-xl text-xs font-bold"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(null)}
                        className="bg-slate-700 text-slate-200 px-3 py-1 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
