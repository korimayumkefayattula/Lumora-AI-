import React, { useState } from 'react';
import { FolderOpen, FileText, ExternalLink, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { openGooglePicker } from '../../services/googleWorkspace';

interface PickedDriveFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  pickedAt: string;
}

interface GooglePickerPanelProps {
  token: string | null;
  onRequestAuth: () => void;
}

export const GooglePickerPanel: React.FC<GooglePickerPanelProps> = ({ token, onRequestAuth }) => {
  const [attachedFiles, setAttachedFiles] = useState<PickedDriveFile[]>([
    {
      id: 'demo-1',
      name: 'Physics Class Notes & Formulas (Google Drive).pdf',
      url: 'https://drive.google.com',
      mimeType: 'application/pdf',
      pickedAt: 'Recent',
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleLaunchPicker = () => {
    if (!token) {
      onRequestAuth();
      return;
    }
    setError(null);
    openGooglePicker(
      token,
      (file) => {
        const newItem: PickedDriveFile = {
          id: file.id,
          name: file.name,
          url: file.url,
          mimeType: file.mimeType,
          pickedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setAttachedFiles((prev) => [newItem, ...prev]);
      },
      (err) => {
        console.error('Picker error:', err);
        setError(err?.message || 'Could not launch Google Picker. Please ensure popups/cookies are allowed.');
      }
    );
  };

  const handleRemove = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Google Drive Picker
              {token && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  Ready
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select and import study PDFs, docs, and course materials directly from your Google Drive
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunchPicker}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Select from Google Drive</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Picked Files List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Attached Drive Study Materials ({attachedFiles.length})
        </div>

        {attachedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-amber-300/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-xs text-slate-900 dark:text-white hover:text-amber-600 flex items-center gap-1.5"
                >
                  <span className="truncate max-w-sm sm:max-w-md">{file.name}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                </a>
                <div className="text-[10px] text-slate-400">
                  Type: {file.mimeType} • Imported {file.pickedAt}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRemove(file.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Remove attachment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
