import React, { useState, useEffect } from 'react';
import { 
  StickyNote, 
  Plus, 
  Pin, 
  Trash2, 
  ExternalLink, 
  Tag, 
  CheckSquare, 
  Square, 
  Palette,
  AlertCircle,
  Sparkles,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { 
  KeepNoteItem, 
  subscribeToKeepNotes, 
  saveKeepNote, 
  deleteKeepNote, 
  openInGoogleKeep,
  getStoredKeepNotes,
  storeKeepNotesLocally 
} from '../../services/firestoreWorkspace';
import { WorkspaceConfirmationModal } from './WorkspaceConfirmationModal';
import { SpeechToKeepNoteModal } from './SpeechToKeepNoteModal';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface GoogleKeepNotesPanelProps {
  userId: string | null;
  onRequestAuth: () => void;
}

const KEEP_COLORS = [
  { id: 'yellow', name: 'Yellow', bg: 'bg-amber-100/90 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' },
  { id: 'blue', name: 'Blue', bg: 'bg-sky-100/90 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800' },
  { id: 'green', name: 'Green', bg: 'bg-emerald-100/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-100/90 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800' },
  { id: 'coral', name: 'Coral', bg: 'bg-rose-100/90 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' },
  { id: 'default', name: 'Neutral', bg: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
];

export const GoogleKeepNotesPanel: React.FC<GoogleKeepNotesPanelProps> = ({ userId, onRequestAuth }) => {
  const [notes, setNotes] = useState<KeepNoteItem[]>(() => getStoredKeepNotes());

  const [isAdding, setIsAdding] = useState(false);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newColor, setNewColor] = useState('yellow');
  const [newTag, setNewTag] = useState('Study Note');

  // Confirmation Modal for Deletion
  const [deleteTarget, setDeleteTarget] = useState<KeepNoteItem | null>(null);

  // Inline Speech Recognition for "Take a Note" form
  const {
    isSupported: isInlineSpeechSupported,
    isListening: isInlineListening,
    interimTranscript: inlineInterim,
    startListening: startInlineListening,
    stopListening: stopInlineListening,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: (transcript) => {
      setNewContent(transcript);
    },
  });

  // Real-time Firestore subscription when logged in
  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToKeepNotes(userId, (liveNotes) => {
      if (liveNotes.length > 0) {
        setNotes(liveNotes);
        storeKeepNotesLocally(liveNotes);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  // Listen to cross-component note updates
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setNotes(e.detail);
      }
    };
    window.addEventListener('lumora_keep_notes_updated', handleUpdate);
    return () => window.removeEventListener('lumora_keep_notes_updated', handleUpdate);
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInlineListening) {
      stopInlineListening();
    }
    if (!newTitle.trim() && !newContent.trim()) return;

    const item: KeepNoteItem = {
      id: `keep_${Date.now()}`,
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      color: newColor,
      pinned: false,
      tags: newTag ? [newTag.trim()] : ['General'],
      userId: userId || 'local_student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local state immediately
    const updated = [item, ...notes];
    setNotes(updated);
    storeKeepNotesLocally(updated);

    // Persist to Firebase Firestore if logged in
    if (userId) {
      await saveKeepNote(item);
    }

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleTogglePin = async (note: KeepNoteItem) => {
    const updated = { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() };
    setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    if (userId) {
      await saveKeepNote(updated);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setNotes((prev) => prev.filter((n) => n.id !== targetId));
    setDeleteTarget(null);

    if (userId) {
      await deleteKeepNote(targetId);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Google Keep Quick Study Notes
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700">
                Firestore Synced
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Color-coded sticky revision notes with instant export to Google Keep
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSpeechModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            title="Dictate thoughts using SpeechRecognition API"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Dictate Note</span>
          </button>
          <a
            href="https://keep.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span>Open Google Keep Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Close' : 'Take a Note'}</span>
          </button>
        </div>
      </div>

      {/* Note Creation Card */}
      {isAdding && (
        <form onSubmit={handleCreateNote} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Title (e.g. Organic Chemistry Reaction Rules)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            {isInlineSpeechSupported && (
              <button
                type="button"
                onClick={() => {
                  if (isInlineListening) {
                    stopInlineListening();
                  } else {
                    startInlineListening();
                  }
                }}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                  isInlineListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                }`}
                title={isInlineListening ? 'Stop recording voice' : 'Dictate note content with mic'}
              >
                {isInlineListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isInlineListening ? 'Listening...' : 'Dictate'}</span>
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Take a note, formula list, or exam checklist... (or click Dictate to speak)"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            {isInlineListening && inlineInterim && (
              <div className="absolute bottom-2 left-3 right-3 text-[11px] text-amber-600 italic bg-amber-50/80 dark:bg-slate-900/80 px-2 py-0.5 rounded pointer-events-none">
                Listening: &quot;{inlineInterim}&quot;
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-400">Color:</span>
              <div className="flex items-center gap-1.5">
                {KEEP_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setNewColor(c.id)}
                    className={`w-5 h-5 rounded-full border ${c.bg} ${
                      newColor === c.id ? 'ring-2 ring-amber-500 ring-offset-1' : ''
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tag (e.g. Physics)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-28 px-2 py-1 rounded text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
              >
                Save Note
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Keep Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const colorDef = KEEP_COLORS.find((c) => c.id === note.color) || KEEP_COLORS[0];

          return (
            <div
              key={note.id}
              className={`p-4 rounded-2xl border shadow-xs transition-all flex flex-col justify-between space-y-3 ${colorDef.bg}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 leading-snug">
                    {note.title}
                  </h4>
                  <button
                    onClick={() => handleTogglePin(note)}
                    className={`p-1 rounded-lg transition-colors ${
                      note.pinned
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/40'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {(note.tags || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openInGoogleKeep(note.title, note.content)}
                    className="p-1 rounded text-slate-500 hover:text-amber-600"
                    title="Export & Open in Google Keep"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(note)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal Before Deleting Keep Note */}
      <WorkspaceConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Google Keep Note"
        description="Are you sure you want to permanently delete this study note from your Firestore database?"
        confirmLabel="Delete Note"
        isDestructive={true}
        details={
          deleteTarget
            ? [
                { label: 'Note Title', value: deleteTarget.title },
                { label: 'Tags', value: (deleteTarget.tags || []).join(', ') },
              ]
            : []
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Speech Recognition Keep Note Dictation Modal */}
      <SpeechToKeepNoteModal
        isOpen={isSpeechModalOpen}
        onClose={() => setIsSpeechModalOpen(false)}
        userId={userId}
        initialPinned={true}
        onNoteCreated={(newNote) => {
          setNotes((prev) => [newNote, ...prev]);
        }}
      />
    </div>
  );
};
