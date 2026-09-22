// Firestore persistence service for Student Keep Notes & Academic Workspace
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface KeepNoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  tags: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreCalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  subject: string;
  googleEventId?: string;
  userId: string;
  createdAt?: string;
}

// Subscribe to real-time Keep notes for the current student
export function subscribeToKeepNotes(
  userId: string,
  onNotesUpdate: (notes: KeepNoteItem[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const q = query(
      collection(db, 'keep_notes'),
      where('userId', '==', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const notes: KeepNoteItem[] = [];
        snapshot.forEach((docSnap) => {
          notes.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        // Sort pinned first, then by updatedAt descending
        notes.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return (b.updatedAt || '').localeCompare(a.updatedAt || '');
        });
        onNotesUpdate(notes);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'keep_notes');
        } catch (e: any) {
          if (onError) onError(e);
        }
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'keep_notes');
    return () => {};
  }
}

// Save or Update a Keep Note
export async function saveKeepNote(note: Omit<KeepNoteItem, 'updatedAt'>): Promise<void> {
  const noteId = note.id || `note_${Date.now()}`;
  const docRef = doc(db, 'keep_notes', noteId);
  try {
    await setDoc(
      docRef,
      {
        ...note,
        id: noteId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `keep_notes/${noteId}`);
  }
}

// Delete a Keep Note (User confirmation must precede this call)
export async function deleteKeepNote(noteId: string): Promise<void> {
  const docRef = doc(db, 'keep_notes', noteId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `keep_notes/${noteId}`);
  }
}

export const DEFAULT_PINNED_KEEP_NOTES: KeepNoteItem[] = [
  {
    id: 'demo-keep-1',
    title: 'CBSE Physics Key Formulas (Optics)',
    content: '1. Lens Maker Formula: 1/f = (μ - 1)(1/R1 - 1/R2)\n2. Snell\'s Law: n1 sinθ1 = n2 sinθ2\n3. Critical angle for total internal reflection: sin(ic) = 1/μ',
    color: 'yellow',
    pinned: true,
    tags: ['Physics', 'Formula Sheet'],
    userId: 'guest',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-keep-2',
    title: 'Chemistry Exam Day Checklist',
    content: '• Admit card printout & school ID\n• Transparent water bottle\n• 2 Blue ballpoint pens & eraser\n• Periodic table mnemonic recap at 8 AM',
    color: 'green',
    pinned: true,
    tags: ['Checklist', 'Exam Prep'],
    userId: 'guest',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-keep-3',
    title: 'Maths Calculus Derivations to Review',
    content: '• Chain rule & product rule proofs\n• Integration by parts standard substitution\n• Maxima & Minima second derivative test criteria',
    color: 'blue',
    pinned: true,
    tags: ['Calculus', 'Revision'],
    userId: 'guest',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

export function getStoredKeepNotes(): KeepNoteItem[] {
  try {
    const raw = localStorage.getItem('lumora_keep_notes_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load local keep notes:', err);
  }
  return DEFAULT_PINNED_KEEP_NOTES;
}

export function storeKeepNotesLocally(notes: KeepNoteItem[]): void {
  try {
    localStorage.setItem('lumora_keep_notes_cache', JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent('lumora_keep_notes_updated', { detail: notes }));
  } catch (err) {
    console.warn('Failed to cache keep notes locally:', err);
  }
}

// Generate Google Keep Web Deep Link for quick export
export function openInGoogleKeep(title: string, content: string) {
  const text = `${title}\n\n${content}`;
  // Deep link or web interface opening Google Keep
  const url = `https://keep.google.com/u/0/#create?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
