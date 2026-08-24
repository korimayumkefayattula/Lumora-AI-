import React, { useState } from 'react';
import { Brain, Sparkles, RefreshCw, Download, Bookmark, Plus, Minus, Share2 } from 'lucide-react';

interface MindNode {
  id: string;
  label: string;
  details?: string;
  children?: MindNode[];
}

export default function MindMapPage() {
  const [topic, setTopic] = useState('Photosynthesis & Light Reactions');
  const [loading, setLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root': true,
    'n1': true,
    'n2': true
  });

  const [mindTree, setMindTree] = useState<MindNode>({
    id: 'root',
    label: 'Photosynthesis',
    details: 'Process by which plants convert light energy into chemical energy.',
    children: [
      {
        id: 'n1',
        label: 'Light-Dependent Reactions',
        details: 'Occurs in thylakoid membrane. Uses H2O and photon energy.',
        children: [
          { id: 'n1-1', label: 'Photosystem II (P680)', details: 'Photolysis of water releasing O2 & electrons.' },
          { id: 'n1-2', label: 'Photosystem I (P700)', details: 'NADPH synthesis via ferredoxin electron chain.' }
        ]
      },
      {
        id: 'n2',
        label: 'Calvin Cycle (Dark Reaction)',
        details: 'Occurs in stroma. Fixes CO2 into Glucose.',
        children: [
          { id: 'n2-1', label: 'Carbon Fixation (RuBisCO)', details: 'CO2 attaches to RuBP forming 3-PGA.' },
          { id: 'n2-2', label: 'Reduction & Regeneration', details: 'Uses ATP + NADPH to yield G3P and regenerate RuBP.' }
        ]
      }
    ]
  });

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMindTree({
        id: 'root',
        label: topic,
        details: `Core concepts and relational hierarchy for ${topic}.`,
        children: [
          {
            id: 'n1',
            label: '1. Theoretical Framework',
            details: 'Primary definitions, postulates, and foundational axioms.',
            children: [
              { id: 'n1-1', label: 'Key Principle A', details: 'In-depth explanation of core mechanics.' },
              { id: 'n1-2', label: 'Key Principle B', details: 'Sub-topic relationships and derivations.' }
            ]
          },
          {
            id: 'n2',
            label: '2. Practical Applications',
            details: 'Standard numerical formulas and laboratory experiments.',
            children: [
              { id: 'n2-1', label: 'Formula A', details: 'Variables, units, and constants.' }
            ]
          }
        ]
      });
      setExpandedNodes({ 'root': true, 'n1': true, 'n2': true });
    }, 1200);
  };

  const renderNode = (node: MindNode, level = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center space-y-3 relative my-2">
        <div 
          onClick={() => hasChildren && toggleExpand(node.id)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all max-w-xs text-center shadow-sm hover:shadow-md ${
            level === 0 
              ? 'bg-blue-600 text-white border-blue-600 font-black text-sm scale-105'
              : level === 1
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-blue-200 dark:border-blue-800 font-bold text-xs'
              : 'bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 text-[11px]'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span>{node.label}</span>
            {hasChildren && (
              <span className="p-0.5 bg-blue-500/20 rounded-md">
                {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </span>
            )}
          </div>
          {node.details && (
            <p className={`text-[10px] leading-tight font-normal ${level === 0 ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
              {node.details}
            </p>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-wrap justify-center gap-6 pt-2 border-t border-slate-200 dark:border-slate-700/60 w-full">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Lumora Visual Concept Generator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Interactive Mind Maps
          </h1>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic e.g. Photosynthesis, Newton Laws..."
          className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Building Tree...' : 'Generate Mind Map'}</span>
        </button>
      </div>

      {/* Mind Map Canvas */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[500px] flex flex-col items-center justify-center overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Extracting concept hierarchy...</p>
          </div>
        ) : (
          renderNode(mindTree)
        )}
      </div>
    </div>
  );
}
