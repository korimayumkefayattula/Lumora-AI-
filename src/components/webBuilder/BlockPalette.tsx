import React from 'react';
import { 
  Sparkles, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, 
  Gamepad2, User, Layers, MessageSquare, HelpCircle, 
  Volume2, Link, FileQuestion, GripVertical, Check
} from 'lucide-react';
import { WebBlock, WebBlockType } from '../../types/websiteBuilder';

interface BlockPaletteProps {
  blocks: WebBlock[];
  onAddBlock: (type: WebBlockType) => void;
  onToggleBlockVisibility: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onSelectBlockToEdit: (block: WebBlock) => void;
  activeEditingId?: string;
}

const AVAILABLE_BLOCKS: { type: WebBlockType; label: string; icon: any; desc: string }[] = [
  { type: 'hero', label: 'Hero Header', icon: Sparkles, desc: 'Eye-catching headline, avatar emoji, & action buttons' },
  { type: 'interactive-gadgets', label: 'Fun Gadgets & Clicker', icon: Gamepad2, desc: 'Celebration confetti cannon & tap clicker game' },
  { type: 'about', label: 'About & Superpowers', icon: User, desc: 'Bio, student superpower, skills, & fun facts' },
  { type: 'projects', label: 'Project Showcase', icon: Layers, desc: 'Inventions, science experiments, & demos with likes' },
  { type: 'sticky-notes', label: 'Sticky Note Wall', icon: MessageSquare, desc: 'Playful colorful notes where visitors can post' },
  { type: 'quotes-trivia', label: 'Trivia & Riddles', icon: HelpCircle, desc: 'Interactive flip questions with revealable answers' },
  { type: 'ambient-player', label: 'Cozy Rain Sound', icon: Volume2, desc: 'Synthesized peaceful ambient study audio' },
  { type: 'faq', label: 'FAQ Accordion', icon: FileQuestion, desc: 'Expandable Q&A section' },
  { type: 'links-contact', label: 'Social & Transmissions', icon: Link, desc: 'External resource links & footer' }
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  blocks,
  onAddBlock,
  onToggleBlockVisibility,
  onRemoveBlock,
  onMoveBlock,
  onSelectBlockToEdit,
  activeEditingId
}) => {
  return (
    <div className="space-y-6">
      {/* Current Page Blocks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Page Layout ({blocks.length} Blocks)
          </h3>
          <span className="text-[10px] text-slate-400">Click to edit details</span>
        </div>

        <div className="space-y-2">
          {blocks.map((block, idx) => {
            const isEditing = activeEditingId === block.id;
            return (
              <div
                key={block.id}
                onClick={() => onSelectBlockToEdit(block)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isEditing
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-md ring-2 ring-rose-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    block.visible ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-black truncate ${isEditing ? 'text-rose-600 dark:text-rose-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {block.title || block.type}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {block.type.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                {/* Block Controls */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  {/* Move Up */}
                  <button
                    disabled={idx === 0}
                    onClick={() => onMoveBlock(idx, 'up')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    disabled={idx === blocks.length - 1}
                    onClick={() => onMoveBlock(idx, 'down')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => onToggleBlockVisibility(block.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      block.visible ? 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200' : 'text-slate-300 dark:text-slate-600'
                    }`}
                    title={block.visible ? 'Hide from page' : 'Show on page'}
                  >
                    {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveBlock(block.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Blocks Section */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Add Interactive Elements
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {AVAILABLE_BLOCKS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => onAddBlock(item.type)}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-300 dark:hover:border-rose-900/60 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
