import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  StickyNote, 
  Pin, 
  Plus, 
  Mic, 
  MicOff, 
  ExternalLink, 
  ChevronRight, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  KeepNoteItem, 
  getStoredKeepNotes, 
  storeKeepNotesLocally, 
  saveKeepNote, 
  subscribeToKeepNotes, 
  openInGoogleKeep,
  DEFAULT_PINNED_KEEP_NOTES 
} from '../../services/firestoreWorkspace';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { SpeechToKeepNoteModal } from '../workspace/SpeechToKeepNoteModal';

interface QuickCaptureKeepWidgetProps {
  userId?: string | null;
}

const KEEP_COLORS_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  yellow: { 
    bg: 'bg-amber-50/90 dark:bg-amber-950/40', 
    border: 'border-amber-200 dark:border-amber-800/60', 
    text: 'text-amber-950 dark:text-amber-100',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
  },
  blue: { 
    bg: 'bg-sky-50/90 dark:bg-sky-950/40', 
    border: 'border-sky-200 dark:border-sky-800/60', 
    text: 'text-sky-950 dark:text-sky-100',
    badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200'
  },
  green: { 
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40', 
    border: 'border-emerald-200 dark:border-emerald-800/60', 
    text: 'text-emerald-950 dark:text-emerald-100',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
  },
  purple: { 
    bg: 'bg-purple-50/90 dark:bg-purple-950/40', 
    border: 'border-purple-200 dark:border-purple-800/60', 
    text: 'text-purple-950 dark:text-purple-100',
    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200'
  },
  coral: { 
    bg: 'bg-rose-50/90 dark:bg-rose-950/40', 
    border: 'border-rose-200 dark:border-rose-800/60', 
    text: 'text-rose-950 dark:text-rose-100',
    badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
  },
  default: { 
    bg: 'bg-white dark:bg-slate-800/90', 
    border: 'border-slate-200 dark:border-slate-700', 
    text: 'text-slate-900 dark:text-white',
    badge: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
  },
};

export const QuickCaptureKeepWidget: React.FC<QuickCaptureKeepWidgetProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<KeepNoteItem[]>(() => getStoredKeepNotes());
  const [quickText, setQuickText] = useState('');
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Inline Quick Voice Dictation for the capture input
  const {
    isSupported: isSpeechSupported,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    onResult: (transcript, isFinal) => {
      setQuickText(transcript);
      if (isFinal && transcript.trim()) {
        // Auto-save on speech finalization
        handleSaveQuickThought(transcript.trim());
      }
    },
  });

  // Subscribe to real-time Firestore updates if user logged in
  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToKeepNotes(userId, (liveNotes) => {
      if (liveNotes.length > 0) {
        setNotes(liveNotes);
        storeKeepNotesLocally(liveNotes);
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, [userId]);

  // Listen for local updates across tabs and modals
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setNotes(e.detail);
      }
    };
    window.addEventListener('lumora_keep_notes_updated', handleUpdate);
    return () => window.removeEventListener('lumora_keep_notes_updated', handleUpdate);
  }, []);

  // Filter top 3 pinned notes, sorted by recency
  const pinnedNotes = notes
    .filter((n) => n.pinned)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .slice(0, 3);

  // If fewer than 3 pinned notes, fill with recent notes so widget always looks great
  const displayNotes = pinnedNotes.length >= 3 
    ? pinnedNotes 
    : [
        ...pinnedNotes,
        ...notes
          .filter((n) => !n.pinned)
          .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
          .slice(0, 3 - pinnedNotes.length)
      ].slice(0, 3);

  const handleSaveQuickThought = async (textToSave?: string) => {
    const content = (textToSave || quickText).trim();
    if (!content) return;

    setIsCapturing(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Derive a smart title from first 5-6 words
    const words = content.split(' ');
    const title = words.length > 6 ? words.slice(0, 6).join(' ') + '...' : content;

    const newNote: KeepNoteItem = {
      id: `keep_${Date.now()}`,
      title: title || `Quick Note • ${timeStr}`,
      content: content,
      color: 'yellow',
      pinned: true, // Always pin quick captures to the top 3
      tags: ['Quick Capture'],
      userId: userId || 'local_student',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    storeKeepNotesLocally(updated);
    setJustAddedId(newNote.id);

    if (userId) {
      try {
        await saveKeepNote(newNote);
      } catch (err) {
        console.warn('Failed to save to Firestore:', err);
      }
    }

    setQuickText('');
    setIsCapturing(false);
    setTimeout(() => setJustAddedId(null), 2500);
  };

  const handleTogglePin = async (note: KeepNoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNote = { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() };
    const updatedList = notes.map((n) => (n.id === note.id ? updatedNote : n));
    setNotes(updatedList);
    storeKeepNotesLocally(updatedList);

    if (userId) {
      await saveKeepNote(updatedNote);
    }
  };

  return (
    <div className="bg-white dark:bg-[#12121a] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Google Keep
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[10px] font-semibold text-slate-400">Top 3 Pinned</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Quick Capture</span>
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSpeechModalOpen(true)}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 transition-colors"
            title="Dictate voice note with Speech Recognition"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/student/workspace')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-0.5 group px-2 py-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick Input Bar with Speech Dictation */}
      <div className="relative flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 focus-within:border-amber-400 dark:focus-within:border-amber-500 transition-colors">
        <input
          type="text"
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveQuickThought();
            }
          }}
          placeholder="Capture quick thought, formula or reminder..."
          className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />

        {isSpeechSupported && (
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`p-1.5 rounded-xl text-xs transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Dictate with microphone'}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSaveQuickThought()}
          disabled={!quickText.trim() || isCapturing}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-3 h-3 stroke-[3]" />
          <span>Pin</span>
        </button>
      </div>

      {/* Top 3 Pinned Notes Cards */}
      <div className="space-y-2">
        {displayNotes.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No pinned notes yet. Capture your first thought above!
          </div>
        ) : (
          displayNotes.map((note) => {
            const colorDef = KEEP_COLORS_MAP[note.color] || KEEP_COLORS_MAP.yellow;
            const isJustAdded = justAddedId === note.id;

            return (
              <div
                key={note.id}
                onClick={() => navigate('/student/workspace')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between gap-1.5 ${
                  colorDef.bg
                } ${colorDef.border} ${
                  isJustAdded ? 'ring-2 ring-amber-500 scale-[1.01]' : 'hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-black truncate ${colorDef.text}`}>
                        {note.title}
                      </h4>
                      {note.pinned && (
                        <span className="shrink-0 p-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(note, e)}
                      className={`p-1 rounded-lg transition-colors ${
                        note.pinned
                          ? 'text-amber-600 hover:text-amber-700 bg-amber-100/80 dark:bg-amber-900/40'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInGoogleKeep(note.title, note.content);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                      title="Open in Google Keep Web"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Footer Tag & Timestamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1 truncate">
                    {(note.tags || []).slice(0, 2).map((t, idx) => (
                      <span key={idx} className={`px-1.5 py-0.2 rounded-md font-semibold text-[9px] ${colorDef.badge}`}>
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] font-medium text-slate-400 shrink-0">
                    {note.updatedAt
                      ? new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : 'Pinned'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Speech Dictation Modal */}
      <SpeechToKeepNoteModal
        isOpen={isSpeechModalOpen}
        onClose={() => setIsSpeechModalOpen(false)}
        userId={userId || null}
        initialPinned={true}
        onNoteCreated={(newNote) => {
          setNotes((prev) => [newNote, ...prev]);
          setJustAddedId(newNote.id);
          setTimeout(() => setJustAddedId(null), 2500);
        }}
      />
    </div>
  );
};
