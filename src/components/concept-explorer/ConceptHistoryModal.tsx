import React, { useState } from 'react';
import { ConceptHistoryItem, ConceptMapData } from '../../types/conceptExplorer';
import { ConceptExplorerService } from '../../services/conceptExplorerService';
import { X, History, Bookmark, Trash2, ArrowRight, Compass } from 'lucide-react';

interface ConceptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string, subject: string, gradeLevel: string) => void;
  initialTab?: 'history' | 'saved';
}

export const ConceptHistoryModal: React.FC<ConceptHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  initialTab = 'history'
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>(initialTab);
  const [historyItems, setHistoryItems] = useState<ConceptHistoryItem[]>(() => ConceptExplorerService.getHistory());
  const [savedMaps, setSavedMaps] = useState<ConceptMapData[]>(() => ConceptExplorerService.getSavedMaps());

  if (!isOpen) return null;

  const handleClearHistory = () => {
    ConceptExplorerService.clearHistory();
    setHistoryItems([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">Concept Library & History</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Recent Explorations ({historyItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Concept Maps ({savedMaps.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          
          {activeTab === 'history' && (
            <div className="space-y-3">
              {historyItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No exploration history yet. Start exploring any topic above!
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                    <span>Click any item to load its concept map</span>
                    <button
                      onClick={handleClearHistory}
                      className="text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear History</span>
                    </button>
                  </div>

                  {historyItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTopic(item.topic, item.subject, item.gradeLevel);
                        onClose();
                      }}
                      className="w-full text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/80 hover:border-indigo-500 transition-all group flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                            {item.subject}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.topic}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.overview}
                        </p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedMaps.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No saved maps yet. Click "Save Map" while viewing any topic map!
                </div>
              ) : (
                savedMaps.map((map, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectTopic(map.topic, map.subject, map.gradeLevel);
                      onClose();
                    }}
                    className="w-full text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/80 hover:border-indigo-500 transition-all group flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                          {map.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {map.nodes.length} nodes
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {map.topic}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {map.oneSentenceOverview}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
