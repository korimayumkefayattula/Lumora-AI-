import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  StickyNote, 
  Pin, 
  X, 
  Check, 
  Sparkles, 
  Volume2, 
  AlertCircle, 
  Save, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { KeepNoteItem, saveKeepNote, openInGoogleKeep, storeKeepNotesLocally, getStoredKeepNotes } from '../../services/firestoreWorkspace';

interface SpeechToKeepNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onNoteCreated?: (note: KeepNoteItem) => void;
  initialPinned?: boolean;
}

const KEEP_COLORS = [
  { id: 'yellow', name: 'Yellow', bg: 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100' },
  { id: 'blue', name: 'Blue', bg: 'bg-sky-100/90 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-100' },
  { id: 'green', name: 'Green', bg: 'bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-100/90 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100' },
  { id: 'coral', name: 'Coral', bg: 'bg-rose-100/90 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100' },
  { id: 'default', name: 'Neutral', bg: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white' },
];

export const SpeechToKeepNoteModal: React.FC<SpeechToKeepNoteModalProps> = ({
  isOpen,
  onClose,
  userId,
  onNoteCreated,
  initialPinned = true,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [tag, setTag] = useState('Voice Note');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    isSupported,
    isListening,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: (latestTranscript) => {
      // Append or replace with transcribed voice
      setContent(latestTranscript);
    },
  });

  // When modal opens, auto-generate default title with timestamp if empty
  useEffect(() => {
    if (isOpen) {
      if (!title) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTitle(`Voice Thought • ${now.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`);
      }
      setSaveSuccess(false);
    } else {
      stopListening();
    }
  }, [isOpen, stopListening, title]);

  if (!isOpen) return null;

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSaveNote = async () => {
    if (!content.trim() && !interimTranscript.trim() && !title.trim()) return;

    setIsSaving(true);
    stopListening();

    const finalContent = (content || interimTranscript || '').trim();
    const finalTitle = title.trim() || 'Untitled Voice Note';

    const newNote: KeepNoteItem = {
      id: `keep_${Date.now()}`,
      title: finalTitle,
      content: finalContent,
      color,
      pinned: isPinned,
      tags: tag ? [tag.trim()] : ['Voice Note'],
      userId: userId || 'local_student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local cache
    const currentNotes = getStoredKeepNotes();
    const updatedNotes = [newNote, ...currentNotes];
    storeKeepNotesLocally(updatedNotes);

    // Persist to Firebase Firestore if online
    try {
      if (userId) {
        await saveKeepNote(newNote);
      }
    } catch (err) {
      console.warn('Note saved to local cache; failed to persist to Firestore:', err);
    }

    if (onNoteCreated) {
      onNoteCreated(newNote);
    }

    setSaveSuccess(true);
    setIsSaving(false);

    setTimeout(() => {
      onClose();
      // Reset for next note
      setTitle('');
      setContent('');
      resetTranscript();
    }, 900);
  };

  const currentColorDef = KEEP_COLORS.find((c) => c.id === color) || KEEP_COLORS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                Dictate to Google Keep
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                  Voice Recognition
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Speak your thoughts, formulas, or reminders directly into a sticky note
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Body Area with Keep Theme */}
        <div className="p-6 space-y-4">
          {/* Note Card Preview */}
          <div className={`p-4 rounded-2xl border transition-all ${currentColorDef.bg} shadow-sm space-y-3`}>
            {/* Title & Pin Toggle */}
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title (e.g. Quantum Physics Optics Note)"
                className="w-full bg-transparent border-0 font-black text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isPinned
                    ? 'text-amber-600 bg-amber-200/60 dark:bg-amber-900/60'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title={isPinned ? 'Pinned to top' : 'Click to pin'}
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>

            {/* Note Content (Live Dictation Area) */}
            <div className="relative">
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Press the microphone and start speaking, or type directly here..."
                className="w-full bg-transparent border-0 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none leading-relaxed"
              />

              {/* Interim voice ghost text when speaking */}
              {interimTranscript && isListening && (
                <div className="text-xs text-slate-500 italic mt-1 animate-pulse">
                  Listening: &quot;{interimTranscript}&quot;...
                </div>
              )}
            </div>

            {/* Active Voice Bar */}
            {isListening && (
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-rose-600 font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Speech Recognition Active • Dictating...</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Audio capturing</span>
              </div>
            )}
          </div>

          {/* Speech Error Warning */}
          {speechError && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{speechError}</span>
            </div>
          )}

          {!isSupported && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
              <Volume2 className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Your current browser does not have the SpeechRecognition API. You can still type notes manually.</span>
            </div>
          )}

          {/* Controls: Color, Tag, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Color:</span>
              <div className="flex items-center gap-1">
                {KEEP_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`w-5 h-5 rounded-full border ${c.bg} transition-all ${
                      color === c.id ? 'ring-2 ring-amber-500 scale-110' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Tag input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag (e.g. Revision)"
                className="w-24 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  resetTranscript();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Clear transcript"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          {/* Microphone Action Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            disabled={!isSupported}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Dictating</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Speaking</span>
              </>
            )}
          </button>

          {/* Save / Export buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openInGoogleKeep(title, content)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
              title="Open Google Keep Web with this text"
            >
              <span>Keep Web</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleSaveNote}
              disabled={isSaving || (!content.trim() && !title.trim())}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 active:scale-95 disabled:opacity-50'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Keep!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Keep Note'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
