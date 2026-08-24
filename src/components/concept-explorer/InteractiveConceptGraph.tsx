import React, { useState } from 'react';
import { 
  ConceptNode, 
  ConceptRelationship, 
  NodeCategory 
} from '../../types/conceptExplorer';
import { 
  CheckCircle2, 
  HelpCircle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface InteractiveConceptGraphProps {
  nodes: ConceptNode[];
  relationships: ConceptRelationship[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  topicTitle: string;
}

const CATEGORY_COLORS: Record<NodeCategory, { bg: string; text: string; border: string; glow: string; badge: string }> = {
  core: { 
    bg: 'bg-blue-600 dark:bg-blue-600 text-white', 
    text: 'text-white', 
    border: 'border-blue-400 ring-4 ring-blue-500/20', 
    glow: 'shadow-xl shadow-blue-500/30',
    badge: 'bg-blue-500 text-white'
  },
  prerequisite: { 
    bg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100', 
    text: 'text-purple-800 dark:text-purple-200', 
    border: 'border-purple-300 dark:border-purple-700', 
    glow: 'shadow-md shadow-purple-500/10',
    badge: 'bg-purple-600 text-white'
  },
  subconcept: { 
    bg: 'bg-cyan-50 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-100', 
    text: 'text-cyan-800 dark:text-cyan-200', 
    border: 'border-cyan-300 dark:border-cyan-700', 
    glow: 'shadow-md shadow-cyan-500/10',
    badge: 'bg-cyan-600 text-white'
  },
  application: { 
    bg: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100', 
    text: 'text-emerald-800 dark:text-emerald-200', 
    border: 'border-emerald-300 dark:border-emerald-700', 
    glow: 'shadow-md shadow-emerald-500/10',
    badge: 'bg-emerald-600 text-white'
  },
  advanced: { 
    bg: 'bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100', 
    text: 'text-amber-800 dark:text-amber-200', 
    border: 'border-amber-300 dark:border-amber-700', 
    glow: 'shadow-md shadow-amber-500/10',
    badge: 'bg-amber-600 text-white'
  }
};

export const InteractiveConceptGraph: React.FC<InteractiveConceptGraphProps> = ({
  nodes,
  relationships,
  selectedNodeId,
  onSelectNode,
  topicTitle
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredNodes = nodes.filter(
    n => categoryFilter === 'all' || n.category === categoryFilter
  );

  // Group nodes by category to construct a clean structural layout
  const prereqNodes = filteredNodes.filter(n => n.category === 'prerequisite');
  const coreNodes = filteredNodes.filter(n => n.category === 'core');
  const subNodes = filteredNodes.filter(n => n.category === 'subconcept');
  const appNodes = filteredNodes.filter(n => n.category === 'application');
  const advNodes = filteredNodes.filter(n => n.category === 'advanced');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
      
      {/* Graph Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Concept Map Network: <span className="text-indigo-600 dark:text-indigo-400">{topicTitle}</span>
          </h2>
        </div>

        {/* Category Filters & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                categoryFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setCategoryFilter('prerequisite')}
              className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                categoryFilter === 'prerequisite' ? 'bg-purple-600 text-white font-bold' : 'text-purple-600 dark:text-purple-300'
              }`}
            >
              Prereqs
            </button>
            <button
              onClick={() => setCategoryFilter('subconcept')}
              className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                categoryFilter === 'subconcept' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-600 dark:text-cyan-300'
              }`}
            >
              Sub-concepts
            </button>
            <button
              onClick={() => setCategoryFilter('application')}
              className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                categoryFilter === 'application' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-600 dark:text-emerald-300'
              }`}
            >
              Apps
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 min-w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.3, zoomLevel + 0.1))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg ml-1"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 overflow-x-auto relative min-h-[380px] custom-scrollbar">
        
        <div 
          className="transition-transform duration-300 origin-top-left space-y-8"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          
          {/* Level 1: Prerequisites (Top Row) */}
          {prereqNodes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                1. Prerequisites Needed
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {prereqNodes.map(node => (
                  <NodeCard 
                    key={node.id} 
                    node={node} 
                    isSelected={selectedNodeId === node.id}
                    onSelect={() => onSelectNode(node.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Connection Indicator Arrow */}
          <div className="flex justify-center my-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs text-[11px] font-bold text-slate-500">
              <span>Leads into core mechanism</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          </div>

          {/* Level 2: Core Concept (Centerpiece) */}
          {coreNodes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                2. Core Concept Node
              </span>
              <div className="max-w-xl mx-auto">
                {coreNodes.map(node => (
                  <NodeCard 
                    key={node.id} 
                    node={node} 
                    isCore={true}
                    isSelected={selectedNodeId === node.id}
                    onSelect={() => onSelectNode(node.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Level 3: Key Subcomponents & Mechanisms */}
          {subNodes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                3. Sub-concepts & Internal Mechanisms
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subNodes.map(node => (
                  <NodeCard 
                    key={node.id} 
                    node={node} 
                    isSelected={selectedNodeId === node.id}
                    onSelect={() => onSelectNode(node.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Level 4: Real-World Applications & Advanced Pathways */}
          {(appNodes.length > 0 || advNodes.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
              
              {appNodes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    4. Real-World Applications
                  </span>
                  <div className="space-y-2">
                    {appNodes.map(node => (
                      <NodeCard 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNodeId === node.id}
                        onSelect={() => onSelectNode(node.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {advNodes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    5. Advanced / Downstream Topics
                  </span>
                  <div className="space-y-2">
                    {advNodes.map(node => (
                      <NodeCard 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNodeId === node.id}
                        onSelect={() => onSelectNode(node.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 dark:text-slate-300">Legend:</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Prerequisite</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Core Topic</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Sub-concept</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Application</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Advanced</span>
        </div>
        <span className="text-[11px] italic">💡 Click any node to open detailed workspace</span>
      </div>

    </div>
  );
};

// Internal Card Component for individual nodes
interface NodeCardProps {
  node: ConceptNode;
  isSelected: boolean;
  isCore?: boolean;
  onSelect: () => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, isSelected, isCore, onSelect }) => {
  const styles = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.subconcept;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative group ${
        isCore ? `${styles.bg} ${styles.border} ${styles.glow} p-5` : `${styles.bg} ${styles.border}`
      } ${
        isSelected ? 'ring-4 ring-indigo-500 scale-[1.02] shadow-xl' : 'hover:scale-[1.01] hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block ${
            isCore ? 'bg-white/20 text-white' : styles.badge
          }`}>
            {node.category}
          </span>
          <h3 className={`text-sm font-extrabold ${isCore ? 'text-white text-base' : 'text-slate-900 dark:text-white'}`}>
            {node.label}
          </h3>
        </div>

        {node.status === 'mastered' && (
          <span title="Mastered">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </span>
        )}
      </div>

      <p className={`text-xs mt-1.5 line-clamp-2 ${isCore ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>
        {node.shortDescription}
      </p>

      {node.difficulty && (
        <div className="mt-2 flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
          <span className={`font-semibold ${isCore ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
            Difficulty: {node.difficulty}
          </span>
          <span className={`font-bold flex items-center gap-1 ${isCore ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
            Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      )}
    </button>
  );
};
