import React, { useState } from 'react';
import { 
  CheckCircle2, Edit, Sparkles, BookOpen, Target, 
  HelpCircle, ArrowRight, X, AlertTriangle, Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { DetectedQuestion } from '../../services/homeworkHelperService';

interface QuestionConfirmationModalProps {
  question: DetectedQuestion;
  onConfirm: (confirmedQuestion: DetectedQuestion) => void;
  onEdit: () => void;
  onScanAgain: () => void;
}

export const QuestionConfirmationModal: React.FC<QuestionConfirmationModalProps> = ({
  question,
  onConfirm,
  onEdit,
  onScanAgain
}) => {
  const [edited, setEdited] = useState<DetectedQuestion>(question);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 max-w-xl w-full shadow-2xl text-slate-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Here's What Lumora Understands</h3>
              <p className="text-xs text-slate-400">Verifying problem intent before starting step-by-step solving</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-medium text-indigo-300 hover:underline flex items-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" /> {isEditing ? "Done Editing" : "Edit Details"}
          </button>
        </div>

        {/* Extracted Text */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Extracted Homework Question
          </span>
          {isEditing ? (
            <textarea
              value={edited.text}
              onChange={(e) => setEdited({ ...edited, text: e.target.value })}
              className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              "{edited.text}"
            </p>
          )}
        </div>

        {/* Categorization Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject & Topic</span>
            {isEditing ? (
              <input
                type="text"
                value={`${edited.subject} - ${edited.topic}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  setEdited({ ...edited, subject: parts[0]?.trim() || edited.subject, topic: parts[1]?.trim() || edited.topic });
                }}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              />
            ) : (
              <p className="text-xs font-semibold text-indigo-300 mt-1">
                {edited.subject} • {edited.topic}
              </p>
            )}
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Type</span>
            <p className="text-xs font-semibold text-violet-300 mt-1">{edited.questionType}</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 col-span-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> Key Given Information & Goal
            </span>
            <div className="mt-1 space-y-1 text-xs">
              <p className="text-slate-300"><strong className="text-slate-400">Given:</strong> {edited.givenValues}</p>
              <p className="text-emerald-300"><strong className="text-slate-400">Goal:</strong> {edited.goal}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-indigo-300">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Confirming details ensures higher precision and prevents misinterpreted formulas!</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onScanAgain}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
          >
            Scan / Input Again
          </button>

          <button
            onClick={() => onConfirm(edited)}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Yes, Continue To Solve <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
