import React, { useState, useEffect } from 'react';
import { ConceptExplorerHeader } from '../components/concept-explorer/ConceptExplorerHeader';
import { InteractiveConceptGraph } from '../components/concept-explorer/InteractiveConceptGraph';
import { ConceptDeepDiveWorkspace } from '../components/concept-explorer/ConceptDeepDiveWorkspace';
import { ConceptCompareModal } from '../components/concept-explorer/ConceptCompareModal';
import { ConceptAskChat } from '../components/concept-explorer/ConceptAskChat';
import { ConceptPracticeQuiz } from '../components/concept-explorer/ConceptPracticeQuiz';
import { ConceptHistoryModal } from '../components/concept-explorer/ConceptHistoryModal';
import { ConceptExplorerService } from '../services/conceptExplorerService';
import { ConceptMapData } from '../types/conceptExplorer';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Lightbulb, 
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Brain
} from 'lucide-react';

const FEATURED_EXPLORATIONS = [
  {
    topic: 'Photosynthesis & Carbon Fixation',
    subject: 'Biology',
    description: 'Explore light reactions, Calvin cycle, RuBisCO enzyme, and real-world global carbon balance.',
    nodeCount: 8,
    category: 'Popular Board Exam Topic'
  },
  {
    topic: 'Quantum Entanglement & Superposition',
    subject: 'Physics',
    description: 'Understand Einstein spooky action at a distance, qubits, and quantum computing.',
    nodeCount: 7,
    category: 'Cutting Edge Science'
  },
  {
    topic: 'Neural Networks & Deep Learning',
    subject: 'Computer Science',
    description: 'Deconstruct perceptrons, backpropagation, gradient descent, and transformers.',
    nodeCount: 9,
    category: 'AI & Data Science'
  },
  {
    topic: 'Electrochemical Cells & Redox',
    subject: 'Chemistry',
    description: 'Master anode/cathode reactions, Nernst equation, and modern lithium battery tech.',
    nodeCount: 8,
    category: 'Class 12 Chemistry'
  },
  {
    topic: 'Fourier Transform & Frequency Spectrum',
    subject: 'Mathematics',
    description: 'Transform complex time signals into individual sine wave frequency components.',
    nodeCount: 6,
    category: 'Higher Math & Engineering'
  },
  {
    topic: 'Inflation & Central Bank Monetary Policy',
    subject: 'Economics',
    description: 'How interest rates, money supply, and consumer price index impact global markets.',
    nodeCount: 7,
    category: 'Economics & Society'
  }
];

export const ConceptExplorerPage: React.FC = () => {
  const [conceptData, setConceptData] = useState<ConceptMapData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Modals & Drawers state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [askInitialQuestion, setAskInitialQuestion] = useState<string | undefined>(undefined);
  const [historyTab, setHistoryTab] = useState<'history' | 'saved'>('history');

  // Load initial default topic on mount
  useEffect(() => {
    handleExplore('Photosynthesis & Carbon Fixation', 'Biology', 'Class 10 / High School');
  }, []);

  const handleExplore = async (topic: string, subject: string, gradeLevel: string) => {
    setIsLoading(true);
    try {
      const data = await ConceptExplorerService.exploreTopic(topic, subject, gradeLevel);
      setConceptData(data);
      const core = data.nodes.find(n => n.category === 'core') || data.nodes[0];
      setSelectedNodeId(core?.id || '');
      
      // Check if saved
      const saved = ConceptExplorerService.getSavedMaps();
      setIsSaved(saved.some(s => s.topic.toLowerCase() === data.topic.toLowerCase()));
    } catch (err) {
      console.error("Error exploring topic:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMap = () => {
    if (!conceptData) return;
    ConceptExplorerService.saveConceptMap(conceptData);
    setIsSaved(true);
  };

  const handleOpenAskWithQuestion = (q?: string) => {
    setAskInitialQuestion(q);
    setIsAskOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Search Header */}
      <ConceptExplorerHeader
        onExplore={handleExplore}
        onOpenHistory={() => { setHistoryTab('history'); setIsHistoryOpen(true); }}
        onOpenSaved={() => { setHistoryTab('saved'); setIsHistoryOpen(true); }}
        onOpenCompare={() => setIsCompareOpen(true)}
        isLoading={isLoading}
        activeTopic={conceptData?.topic}
      />

      {/* Main Content Area */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Brain className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Constructing AI Concept Knowledge Graph...
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Deconstructing topic into prerequisites, core mechanisms, real-world analogies, misconceptions, and self-check practice questions.
          </p>
        </div>
      ) : conceptData ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Visual Interactive Graph Network */}
          <InteractiveConceptGraph
            nodes={conceptData.nodes}
            relationships={conceptData.relationships}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            topicTitle={conceptData.topic}
          />

          {/* Deep Dive Workspace for Selected Concept */}
          <ConceptDeepDiveWorkspace
            conceptData={conceptData}
            activeNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onAskAI={handleOpenAskWithQuestion}
            onStartQuiz={() => setIsQuizOpen(true)}
            onSaveMap={handleSaveMap}
            isSaved={isSaved}
          />

        </div>
      ) : null}

      {/* Popular Curated Knowledge Maps Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Curated Concept Maps
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Click any topic to launch its interactive exploration map
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_EXPLORATIONS.map((feat, idx) => (
            <button
              key={idx}
              onClick={() => handleExplore(feat.topic, feat.subject, 'Class 10 / High School')}
              className="text-left p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    {feat.subject}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {feat.nodeCount} Connected Nodes
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feat.topic}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Explore Map</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Auxiliary Modals & Drawers */}
      <ConceptCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        defaultTopic={conceptData?.topic}
      />

      <ConceptAskChat
        isOpen={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        topic={conceptData?.topic || 'Science'}
        activeNodeLabel={conceptData?.nodes.find(n => n.id === selectedNodeId)?.label}
        initialQuestion={askInitialQuestion}
      />

      <ConceptPracticeQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        topic={conceptData?.topic || 'Science'}
        questions={conceptData?.quizQuestions || []}
      />

      <ConceptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTopic={handleExplore}
        initialTab={historyTab}
      />

    </div>
  );
};
