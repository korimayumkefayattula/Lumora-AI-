import React, { useState } from 'react';
import { 
  Sparkles, Lightbulb, Footprints, FileText, CheckSquare, 
  HelpCircle, Copy, Check, Bookmark, Share2, Download, 
  RefreshCw, MessageSquare, Send, ArrowRight, Brain, Eye,
  BookOpen, PlusCircle, Award, CheckCircle2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DetectedQuestion, HomeworkSolution, SolvingMode, 
  HomeworkHelperService, PracticeQuestion 
} from '../../services/homeworkHelperService';

interface SolutionWorkspaceProps {
  question: DetectedQuestion;
  initialSolution: HomeworkSolution;
  onResetSession: () => void;
}

export const SolutionWorkspace: React.FC<SolutionWorkspaceProps> = ({
  question,
  initialSolution,
  onResetSession
}) => {
  const [currentMode, setCurrentMode] = useState<SolvingMode>(initialSolution.mode || 'step-by-step');
  const [solution, setSolution] = useState<HomeworkSolution>(initialSolution);
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);

  // Hint mode state
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);

  // Check answer state
  const [studentAttempt, setStudentAttempt] = useState<string>('');

  // Source-aware grounding toggle
  const [useStudyMaterial, setUseStudyMaterial] = useState<boolean>(false);

  // Inline "Explain This Step" state
  const [explainingStepIndex, setExplainingStepIndex] = useState<number | null>(null);
  const [stepExplanationText, setStepExplanationText] = useState<string | null>(null);
  const [isLoadingStepExp, setIsLoadingStepExp] = useState<boolean>(false);

  // Visual concept view
  const [showVisualDiagram, setShowVisualDiagram] = useState<boolean>(false);

  // Follow-up chat
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: `Hi! I'm Lumora. Ask me anything about this problem or request another solving method!` }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Practice Mode state
  const [practiceData, setPracticeData] = useState<PracticeQuestion | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState<boolean>(false);

  // Utility copy & bookmark
  const [copied, setCopied] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  // Handle Mode Change
  const handleSwitchMode = async (mode: SolvingMode) => {
    if (mode === currentMode) return;
    setCurrentMode(mode);
    setIsLoadingMode(true);

    const newSol = await HomeworkHelperService.solveQuestion({
      question: question.text,
      subject: question.subject,
      topic: question.topic,
      questionType: question.questionType,
      mode: mode,
      useStudyMaterial
    });

    setSolution(newSol);
    setIsLoadingMode(false);
  };

  // Handle Check My Answer Submit
  const handleEvaluateStudentAnswer = async () => {
    if (!studentAttempt.trim()) return;
    setIsLoadingMode(true);

    const checkedSol = await HomeworkHelperService.solveQuestion({
      question: question.text,
      subject: question.subject,
      topic: question.topic,
      questionType: question.questionType,
      mode: 'check-answer',
      studentAnswer: studentAttempt,
      useStudyMaterial
    });

    setSolution(checkedSol);
    setIsLoadingMode(false);
  };

  // Handle "Explain This Step"
  const handleExplainStep = async (stepIdx: number, stepTitle: string, stepContent: string) => {
    if (explainingStepIndex === stepIdx) {
      setExplainingStepIndex(null);
      return;
    }
    setExplainingStepIndex(stepIdx);
    setIsLoadingStepExp(true);
    setStepExplanationText(null);

    const explanation = await HomeworkHelperService.explainStep(question.text, stepTitle, stepContent);
    setStepExplanationText(explanation);
    setIsLoadingStepExp(false);
  };

  // Handle Follow-Up Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsSendingChat(true);

    // Dynamic response based on prompt
    setTimeout(() => {
      let reply = `Great question! In ${question.topic}, we apply this formula because it enforces conservation of energy and balances given units.`;
      if (userMsg.toLowerCase().includes('another method') || userMsg.toLowerCase().includes('way')) {
        reply = `An alternative method is using graphical analysis or energy ratios. Would you like me to map out the visual steps?`;
      } else if (userMsg.toLowerCase().includes('formula')) {
        reply = `The key formula used is ${solution.keyFormula || 'F = m × a'}. It directly connects the known parameters to what we need to calculate.`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setIsSendingChat(false);
    }, 1000);
  };

  // Handle Practice Question Generation
  const handleGeneratePractice = async (level: 'similar' | 'easier' | 'harder') => {
    setIsGeneratingPractice(true);
    setPracticeFeedback(null);
    setPracticeAnswer('');

    const newPractice = await HomeworkHelperService.generatePractice(question.text, question.subject, question.topic, level);
    setPracticeData(newPractice);
    setIsGeneratingPractice(false);
  };

  // Submit Practice Answer
  const handleSubmitPractice = async () => {
    if (!practiceAnswer.trim() || !practiceData) return;
    const fb = await HomeworkHelperService.evaluatePractice(practiceData.question, practiceAnswer, practiceData.expectedAnswer);
    setPracticeFeedback(fb);
  };

  // Copy Action
  const handleCopySolution = () => {
    navigator.clipboard.writeText(`Question: ${question.text}\nFinal Answer: ${solution.finalAnswer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Question Context Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              {question.subject}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold">
              {question.topic}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {question.difficulty}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-2 leading-relaxed">
            "{question.text}"
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setUseStudyMaterial(!useStudyMaterial)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              useStudyMaterial
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {useStudyMaterial ? "Grounding in My Notes: ON" : "Use My Study Material"}
          </button>

          <button
            onClick={onResetSession}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
          >
            New Question
          </button>
        </div>
      </div>

      {/* Solving Mode Tabs Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 backdrop-blur-md overflow-x-auto">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => handleSwitchMode('hint')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentMode === 'hint'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lightbulb className="w-4 h-4" /> Hint Mode
          </button>

          <button
            onClick={() => handleSwitchMode('step-by-step')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentMode === 'step-by-step'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Footprints className="w-4 h-4" /> Step-by-Step
          </button>

          <button
            onClick={() => handleSwitchMode('full')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentMode === 'full'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" /> Full Explanation
          </button>

          <button
            onClick={() => handleSwitchMode('check-answer')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentMode === 'check-answer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Check My Answer
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 pr-2">
          <button
            onClick={() => setShowVisualDiagram(!showVisualDiagram)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
              showVisualDiagram
                ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Show Me Visually
          </button>
        </div>
      </div>

      {/* Main Solution Area */}
      {isLoadingMode ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-spin mb-3" />
          <p className="text-base font-semibold text-slate-200">Preparing {currentMode.toUpperCase()} Mode Solution...</p>
          <p className="text-xs text-slate-400 mt-1">Applying step-by-step mathematical reasoning</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Center Main Solution Panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* Visual Concept Diagram if Toggled */}
            {showVisualDiagram && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Visual Concept & Flowchart
                  </span>
                  <button onClick={() => setShowVisualDiagram(false)} className="text-slate-400 text-xs hover:text-slate-200">
                    Close Visual
                  </button>
                </div>
                
                <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 flex flex-col items-center text-center">
                  <div className="flex items-center gap-3 max-w-lg w-full justify-between">
                    <div className="p-3 bg-indigo-950 border border-indigo-500/40 rounded-xl text-xs font-semibold text-indigo-200">
                      Given Force (F = 50 N)
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                    <div className="p-3 bg-violet-950 border border-violet-500/40 rounded-xl text-xs font-semibold text-violet-200">
                      Mass Object (m = 10 kg)
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                    <div className="p-3 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200">
                      Acceleration (a = 5 m/s²)
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    Vector illustration showing net force vector aligned in the direction of acceleration according to Newton's 2nd Law.
                  </p>
                </div>
              </motion.div>
            )}

            {/* MODE 1: HINT MODE */}
            {currentMode === 'hint' && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-slate-100">Guided Progressive Hints</h3>
                      <p className="text-xs text-slate-400">Try thinking through the problem before checking the answer!</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                    Hint {activeHintIndex + 1} of {solution.hints?.length || 3}
                  </span>
                </div>

                {solution.hints && solution.hints[activeHintIndex] && (
                  <motion.div 
                    key={activeHintIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-950 border border-amber-500/20 rounded-xl p-5 space-y-3"
                  >
                    {(() => {
                      const currentHint: any = solution.hints[activeHintIndex];
                      const hintText = typeof currentHint === 'string' ? currentHint : (currentHint?.text || '');
                      const concept = (typeof currentHint === 'object' && currentHint?.conceptPoint) ? currentHint.conceptPoint : 'Guided Concept Hint';
                      return (
                        <>
                          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                            {concept}
                          </span>
                          <p className="text-base font-medium text-slate-200 leading-relaxed">
                            "{hintText}"
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveHintIndex((prev) => Math.min(prev + 1, (solution.hints?.length || 1) - 1))}
                    disabled={activeHintIndex >= (solution.hints?.length || 1) - 1}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow disabled:opacity-40"
                  >
                    <Lightbulb className="w-4 h-4" /> Give Another Hint
                  </button>

                  <button
                    onClick={() => handleSwitchMode('step-by-step')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    Show Step-by-Step Solution <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: STEP-BY-STEP MODE (PHOTOMATH INSPIRED) */}
            {currentMode === 'step-by-step' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-900 border border-indigo-500/30 p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Target Final Answer</span>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{solution.finalAnswer}</p>
                  </div>
                  {solution.keyFormula && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Formula</span>
                      <p className="text-sm font-mono text-indigo-300 font-semibold">{solution.keyFormula}</p>
                    </div>
                  )}
                </div>

                {/* Steps Accordion Cards */}
                {solution.steps?.map((step, idx) => (
                  <motion.div
                    key={step.stepNumber || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-3 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                          {step.stepNumber || idx + 1}
                        </span>
                        <h4 className="font-semibold text-slate-200 text-sm">{step.title}</h4>
                      </div>

                      <button
                        onClick={() => handleExplainStep(idx, step.title, step.explanation)}
                        className="px-2.5 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Explain This Step
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      {step.explanation}
                    </p>

                    {step.expression && (
                      <div className="ml-9 p-3 bg-slate-950 border border-indigo-500/20 rounded-xl font-mono text-sm text-indigo-300 font-semibold">
                        {step.expression}
                      </div>
                    )}

                    {/* Inline AI Explanation if opened */}
                    <AnimatePresence>
                      {explainingStepIndex === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-9 bg-indigo-950/50 border border-indigo-500/40 rounded-xl p-3 text-xs space-y-1 text-indigo-200"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Inline AI Tutor Explanation:
                          </div>
                          {isLoadingStepExp ? (
                            <p className="text-slate-400 italic">Thinking...</p>
                          ) : (
                            <p className="leading-relaxed">{stepExplanationText}</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {/* Alternative Method Option */}
                {solution.alternativeMethod && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Alternative Method: {solution.alternativeMethod.methodName}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{solution.alternativeMethod.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* MODE 3: FULL EXPLANATION MODE */}
            {currentMode === 'full' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <h3 className="font-semibold text-base text-slate-100">Comprehensive Deep-Dive Solution</h3>
                </div>

                <div className="prose prose-invert prose-sm max-w-none space-y-3 text-slate-300 leading-relaxed">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono whitespace-pre-wrap">
                    {solution.fullExplanationMarkdown || `### Solution Analysis\n\nGiven: ${question.givenValues}\nGoal: ${question.goal}\n\nKey Concept: Apply fundamental formulas to isolate the target variable.\n\nFinal Answer: ${solution.finalAnswer}`}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 4: CHECK MY ANSWER MODE */}
            {currentMode === 'check-answer' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-base text-slate-100">Submit & Verify Your Solution</h3>
                    <p className="text-xs text-slate-400">Lumora compares your steps and pinpoints where mistakes happen</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    value={studentAttempt}
                    onChange={(e) => setStudentAttempt(e.target.value)}
                    placeholder="Type or paste your step-by-step attempt here (e.g. Step 1: F = 50 N, Step 2: a = 50 * 10 = 500 m/s²)..."
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    onClick={handleEvaluateStudentAnswer}
                    disabled={!studentAttempt.trim() || isLoadingMode}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Evaluate My Attempt
                  </button>
                </div>

                {solution.checkResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border ${
                      solution.checkResult.isCorrect 
                        ? 'bg-emerald-950/40 border-emerald-500/40' 
                        : 'bg-amber-950/40 border-amber-500/40'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold flex items-center gap-2 ${
                        solution.checkResult.isCorrect ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {solution.checkResult.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {solution.checkResult.isCorrect ? "Solution Verified Correct!" : "Identified Step to Correct"}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        Score: {solution.checkResult.scorePercentage}%
                      </span>
                    </div>

                    {solution.checkResult.correctParts && solution.checkResult.correctParts.length > 0 && (
                      <div className="text-xs text-slate-300 space-y-1">
                        <span className="font-semibold text-emerald-300">What You Got Right:</span>
                        <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-400">
                          {solution.checkResult.correctParts.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!solution.checkResult.isCorrect && solution.checkResult.mistakeExplanation && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-xs space-y-1">
                        <span className="font-bold text-amber-400">First Mistake Found:</span>
                        <p className="text-slate-200">{solution.checkResult.mistakeExplanation}</p>
                        <p className="text-amber-300 font-medium mt-1">Hint: {solution.checkResult.constructiveHint}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Practice Mode Section ("Want to practice?") */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-base text-slate-100">Want To Practice This Concept?</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGeneratePractice('similar')}
                    disabled={isGeneratingPractice}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                  >
                    Similar Question
                  </button>
                  <button
                    onClick={() => handleGeneratePractice('easier')}
                    disabled={isGeneratingPractice}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Easier Warmup
                  </button>
                  <button
                    onClick={() => handleGeneratePractice('harder')}
                    disabled={isGeneratingPractice}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Harder Challenge
                  </button>
                </div>
              </div>

              {isGeneratingPractice ? (
                <div className="text-center py-6 text-xs text-indigo-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Generating Concept-Testing Practice Problem...
                </div>
              ) : (
                practiceData && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-3 text-xs"
                  >
                    <span className="font-bold text-indigo-400 uppercase tracking-wider">
                      Practice Problem ({practiceData.level.toUpperCase()})
                    </span>
                    <p className="text-sm font-medium text-slate-200">{practiceData.question}</p>
                    <p className="text-slate-400 italic">Hint: {practiceData.hint}</p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                      <button
                        onClick={handleSubmitPractice}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                      >
                        Submit
                      </button>
                    </div>

                    {practiceFeedback && (
                      <div className="bg-indigo-950/60 p-3 rounded-lg border border-indigo-500/30 text-indigo-200 font-medium">
                        {practiceFeedback}
                      </div>
                    )}
                  </motion.div>
                )
              )}
            </div>

          </div>

          {/* Right Column: AI Tutor Follow-up Chat & Actions Bar */}
          <div className="space-y-6">

            {/* Quick Actions Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopySolution}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    bookmarked ? 'text-amber-400 border-amber-500/30' : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </div>

            {/* Claude-style AI Follow-up Chat */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[500px]">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3 shrink-0">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h4 className="font-semibold text-sm text-slate-200">Ask Lumora About This Question</h4>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white ml-auto'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 mr-auto'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-slate-800 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isSendingChat}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
