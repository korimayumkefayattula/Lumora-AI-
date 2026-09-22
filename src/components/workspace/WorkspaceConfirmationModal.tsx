import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface WorkspaceConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  details?: { label: string; value: string }[];
}

export const WorkspaceConfirmationModal: React.FC<WorkspaceConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm & Proceed',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  details,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isDestructive 
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' 
                : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirmation-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Google Workspace Authorization Confirmation
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {description}
        </p>

        {details && details.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{item.label}:</span>
                <span className="text-slate-800 dark:text-slate-200 text-right truncate font-medium max-w-[220px]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500/50'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
