import React, { useState } from 'react';
import { 
  Camera, Upload, FileText, Edit3, Mic, Sparkles, 
  History, BookOpen, HelpCircle, ArrowRight, ShieldCheck, 
  Layers, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ScanQuestionCamera } from '../components/homework-helper/ScanQuestionCamera';
import { ImageQuestionUploader } from '../components/homework-helper/ImageQuestionUploader';
import { PdfHomeworkAnalyzer } from '../components/homework-helper/PdfHomeworkAnalyzer';
import { TextInputEditor } from '../components/homework-helper/TextInputEditor';
import { QuestionConfirmationModal } from '../components/homework-helper/QuestionConfirmationModal';
import { SolutionWorkspace } from '../components/homework-helper/SolutionWorkspace';
import { HomeworkHistoryDrawer } from '../components/homework-helper/HomeworkHistoryDrawer';

import { 
  DetectedQuestion, HomeworkSolution, HomeworkHelperService, HomeworkHistoryItem 
} from '../services/homeworkHelperService';

export const HomeworkHelperPage: React.FC = () => {
  // Input modal states
  const [activeInputMethod, setActiveInputMethod] = useState<'scan' | 'image' | 'pdf' | 'text' | 'voice' | null>(null);
  
  // Pending Question Confirmation State
  const [pendingQuestion, setPendingQuestion] = useState<DetectedQuestion | null>(null);

  // Active Solution Workspace State
  const [activeQuestion, setActiveQuestion] = useState<DetectedQuestion | null>(null);
  const [activeSolution, setActiveSolution] = useState<HomeworkSolution | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);

  // History Drawer State
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);

  // Voice Modal State
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');

  // Step 1: Input method captures text or image
  const handleExtractedQuestion = async (text: string, imageBase64?: string, detectedObj?: DetectedQuestion) => {
    setActiveInputMethod(null);

    if (detectedObj) {
      setPendingQuestion(detectedObj);
      return;
    }

    // Call analyze API
    const analysis = await HomeworkHelperService.analyzeQuestion({ text, image: imageBase64 });
    if (analysis.questions && analysis.questions[0]) {
      setPendingQuestion(analysis.questions[0]);
    } else {
      setPendingQuestion({
        id: "q_" + Date.now(),
        text,
        subject: "Mathematics",
        topic: "Core Concept",
        questionType: "Numerical Problem",
        givenValues: "Given values extracted from question",
        goal: "Calculate final numerical or logical answer",
        difficulty: "Medium"
      });
    }
  };

  // Step 2: Confirmation Modal confirms
  const handleConfirmQuestion = async (confirmed: DetectedQuestion) => {
    setPendingQuestion(null);
    setActiveQuestion(confirmed);
    setIsSolving(true);

    const solution = await HomeworkHelperService.solveQuestion({
      question: confirmed.text,
      subject: confirmed.subject,
      topic: confirmed.topic,
      questionType: confirmed.questionType,
      mode: 'step-by-step'
    });

    setActiveSolution(solution);
    setIsSolving(false);

    // Save to local history
    HomeworkHelperService.saveToHistory(solution, confirmed);
  };

  // Select History Session
  const handleSelectHistoryItem = (item: HomeworkHistoryItem) => {
    setShowHistoryDrawer(false);
    setActiveQuestion({
      id: item.id,
      text: item.question,
      subject: item.subject,
      topic: item.topic,
      questionType: "Numerical Problem",
      givenValues: "Saved session parameters",
      goal: "Calculated answer",
      difficulty: "Medium"
    });
    setActiveSolution(item.solution);
  };

  // Reset Session
  const handleResetSession = () => {
    setActiveQuestion(null);
    setActiveSolution(null);
    setPendingQuestion(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-6xl mx-auto border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">AI Homework Helper</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                Lumora flagship
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Google Lens Vision + Photomath Steps + ChatGPT Multimodal + Claude Thoughtfulness
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistoryDrawer(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 shadow transition-all"
          >
            <History className="w-4 h-4 text-indigo-400" /> Session History
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* If Active Solution Workspace */}
        {activeQuestion && activeSolution ? (
          <SolutionWorkspace
            question={activeQuestion}
            initialSolution={activeSolution}
            onResetSession={handleResetSession}
          />
        ) : isSolving ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto animate-spin" />
            <h3 className="text-xl font-bold text-slate-100">Understanding & Solving Homework...</h3>
            <p className="text-xs text-slate-400">
              Applying multimodal AI reasoning, step-by-step mathematical breakdown, and sanity checks.
            </p>
          </div>
        ) : (
          /* Main Input Landing View */
          <div className="space-y-10">
            {/* Hero Heading */}
            <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                How can I help with your homework?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose an input method below. Lumora will understand the core question, structure a step-by-step solution, explain the reasoning behind every step, and offer practice problems.
              </p>
            </div>

            {/* 4 Primary Input Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Option 1: Scan Question */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setActiveInputMethod('scan')}
                className="bg-slate-900 hover:bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                    📷 Scan Question
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Google Lens camera scanner. Snap a picture of printed or handwritten homework.
                  </p>
                </div>
              </motion.div>

              {/* Option 2: Upload Image */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setActiveInputMethod('image')}
                className="bg-slate-900 hover:bg-slate-900/90 border border-violet-500/30 hover:border-violet-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-violet-300 transition-colors">
                    📁 Upload Image
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload JPG/PNG diagrams, equations, or sheets. Supports multi-question selection.
                  </p>
                </div>
              </motion.div>

              {/* Option 3: Upload PDF */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setActiveInputMethod('pdf')}
                className="bg-slate-900 hover:bg-slate-900/90 border border-rose-500/30 hover:border-rose-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-rose-300 transition-colors">
                    📄 Upload PDF
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload PDF homework assignments. Automatically organizes and catalogs questions.
                  </p>
                </div>
              </motion.div>

              {/* Option 4: Type Question */}
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setActiveInputMethod('text')}
                className="bg-slate-900 hover:bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 p-6 rounded-2xl cursor-pointer transition-all shadow-xl space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition-colors">
                    ✍️ Type Question
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Claude-style clean text editor with math symbols, LaTeX, code, and Markdown.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Voice Quick Action Banner */}
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">🎙️ Ask Homework Question by Voice</h4>
                  <p className="text-xs text-slate-400">Speak naturally and let Lumora transcribe and solve your question live.</p>
                </div>
              </div>

              <button
                onClick={() => setShowVoiceModal(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-transform active:scale-95 shrink-0"
              >
                <Mic className="w-4 h-4" /> Start Voice Input
              </button>
            </div>

            {/* Core Philosophy Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Learning-First Philosophy
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">SEE THE QUESTION</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">UNDERSTAND</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">PLAN SOLUTION</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">SOLVE STEP-BY-STEP</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">EXPLAIN WHY</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-indigo-300 border-indigo-500/40">PRACTICE</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Modals */}
      {activeInputMethod === 'scan' && (
        <ScanQuestionCamera
          onConfirmQuestion={handleExtractedQuestion}
          onClose={() => setActiveInputMethod(null)}
        />
      )}

      {activeInputMethod === 'image' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <ImageQuestionUploader
              onQuestionSelected={(qText, img, obj) => handleExtractedQuestion(qText, img, obj)}
              onClose={() => setActiveInputMethod(null)}
            />
          </div>
        </div>
      )}

      {activeInputMethod === 'pdf' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <PdfHomeworkAnalyzer
              onSelectPdfQuestion={(qText, obj) => handleExtractedQuestion(qText, undefined, obj)}
              onClose={() => setActiveInputMethod(null)}
            />
          </div>
        </div>
      )}

      {activeInputMethod === 'text' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <TextInputEditor
              onSubmitText={(text) => handleExtractedQuestion(text)}
            />
            <div className="text-center mt-3">
              <button onClick={() => setActiveInputMethod(null)} className="text-xs text-slate-400 hover:text-slate-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Input Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 max-w-md w-full text-slate-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">Speak Your Homework Question</h3>
            <p className="text-xs text-slate-400">Speak clearly. Lumora will transcribe and process your question.</p>

            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="e.g. Solve 3x + 15 = 45 for x"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
            />

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowVoiceModal(false);
                  if (voiceText.trim()) handleExtractedQuestion(voiceText.trim());
                }}
                className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs"
              >
                Submit Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Step Modal ("Here's what I understand") */}
      {pendingQuestion && (
        <QuestionConfirmationModal
          question={pendingQuestion}
          onConfirm={handleConfirmQuestion}
          onEdit={() => {}}
          onScanAgain={() => {
            setPendingQuestion(null);
            setActiveInputMethod('scan');
          }}
        />
      )}

      {/* History Drawer */}
      {showHistoryDrawer && (
        <HomeworkHistoryDrawer
          onSelectHistoryItem={handleSelectHistoryItem}
          onClose={() => setShowHistoryDrawer(false)}
        />
      )}
    </div>
  );
};
export default HomeworkHelperPage;
