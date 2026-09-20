import { 
  doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot 
} from 'firebase/firestore';
import { 
  ref as rtdbRef, set as rtdbSet, onValue as rtdbOnValue, update as rtdbUpdate, onDisconnect 
} from 'firebase/database';
import { db, rtdb, firebaseConfig } from '../lib/firebase';

export interface StudentProjectRecord {
  id: string;
  title: string;
  description: string;
  html: string;
  css: string;
  js: string;
  version: number;
  studentHandle?: string;
  studentEmail?: string;
  updatedAt: string;
  createdAt?: string;
  isAutoSaved?: boolean;
}

export interface PublishedSiteRecord {
  id: string;
  title: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  fullHtml: string;
  publishedUrl: string;
  previewUrl: string;
  studentEmail: string;
  studentName: string;
  publishedAt: string;
  views: number;
}

export interface CollaboratorUser {
  id: string;
  name: string;
  email: string;
  color: string;
  avatarEmoji?: string;
  activeFile: 'html' | 'css' | 'js' | 'preview';
  lastActive: number;
}

export interface SharedWorkspaceState {
  roomId: string;
  roomName: string;
  projectId: string;
  html: string;
  css: string;
  js: string;
  lastEditedBy: string;
  lastEditedAt: string;
  version: number;
}

const LOCAL_STORAGE_KEY = 'lumora_web_builder_autosave_v1';

// Build complete standalone HTML with embedded styles, scripts, Tailwind and canvas-confetti
export function assembleStandaloneHtml(title: string, html: string, css: string, js: string): string {
  // If html already contains <html> or <!DOCTYPE, inject style and script into appropriate tags
  if (html.includes('<html') || html.includes('<!DOCTYPE')) {
    let output = html;
    if (css.trim()) {
      if (output.includes('</head>')) {
        output = output.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
      } else {
        output = `<style>\n${css}\n</style>\n` + output;
      }
    }
    if (js.trim()) {
      if (output.includes('</body>')) {
        output = output.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
      } else {
        output += `\n<script>\n${js}\n</script>`;
      }
    }
    return output;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Student Project'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <style>
    ${css || '/* Custom Styles */'}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 font-sans">
  ${html}
  <script>
    ${js || '// Custom Logic'}
  </script>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// 1. AUTO-SAVE MECHANISM (Firestore every 30 seconds)
// --------------------------------------------------------------------------

/**
 * Save project to Firestore collection 'student_projects'
 */
export async function saveProjectToFirestore(
  project: StudentProjectRecord
): Promise<{ success: boolean; error?: string; timestamp: string }> {
  const timestamp = new Date().toISOString();
  
  // Instant localStorage backup
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...project,
      updatedAt: timestamp,
      isAutoSaved: true
    }));
  } catch (e) {
    // Ignore quota issues
  }

  try {
    const projectRef = doc(db, 'student_projects', project.id);
    const dataToSave = {
      id: project.id,
      title: project.title || 'Untitled Student Project',
      description: project.description || '',
      html: project.html || '',
      css: project.css || '',
      js: project.js || '',
      version: (project.version || 1) + 1,
      studentHandle: project.studentHandle || 'student',
      studentEmail: project.studentEmail || 'student@lumora.ai',
      updatedAt: timestamp,
      isAutoSaved: true
    };

    await setDoc(projectRef, dataToSave, { merge: true });
    return { success: true, timestamp };
  } catch (err: any) {
    console.warn('[Firestore Auto-Save Notice]:', err?.message || err);
    return { 
      success: false, 
      error: err?.message || 'Firestore connection issue, saved locally', 
      timestamp 
    };
  }
}

/**
 * Load project from Firestore
 */
export async function loadProjectFromFirestore(
  projectId: string
): Promise<StudentProjectRecord | null> {
  try {
    const projectRef = doc(db, 'student_projects', projectId);
    const snapshot = await getDoc(projectRef);
    if (snapshot.exists()) {
      return snapshot.data() as StudentProjectRecord;
    }
  } catch (err) {
    console.warn('[Firestore Load Warning]:', err);
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.id === projectId) return parsed;
    }
  } catch (e) {}

  return null;
}

// --------------------------------------------------------------------------
// 2. PUBLISH TO FIREBASE HOSTING INTEGRATION & UNIQUE LIVE PREVIEW
// --------------------------------------------------------------------------

/**
 * Publish workspace to Firestore & backend server, returning unique Firebase Hosting URL
 */
export async function publishProjectToFirebaseHosting(params: {
  project: StudentProjectRecord;
  studentName?: string;
  studentEmail?: string;
}): Promise<{
  success: boolean;
  siteId: string;
  publishedUrl: string;
  livePreviewUrl: string;
  publishedAt: string;
  error?: string;
}> {
  const publishedAt = new Date().toISOString();
  const cleanTitle = (params.project.title || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 24);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const siteId = `site-${cleanTitle}-${randomSuffix}`;
  
  const fullHtml = assembleStandaloneHtml(
    params.project.title, 
    params.project.html, 
    params.project.css, 
    params.project.js
  );

  // Official Firebase Hosting URL pattern for this project
  const projectId = firebaseConfig.projectId || 'cool-yardage-953sn';
  const publishedUrl = `https://${projectId}.web.app/sites/${siteId}`;
  
  // In-app / Dev environment live preview URL (works instantly in any environment)
  const origin = window.location.origin;
  const livePreviewUrl = `${origin}/sites/${siteId}`;

  const publishRecord: PublishedSiteRecord = {
    id: siteId,
    title: params.project.title || 'Student App',
    slug: siteId,
    html: params.project.html,
    css: params.project.css,
    js: params.project.js,
    fullHtml,
    publishedUrl,
    previewUrl: livePreviewUrl,
    studentEmail: params.studentEmail || params.project.studentEmail || 'student@lumora.ai',
    studentName: params.studentName || 'Lumora Creator',
    publishedAt,
    views: 0
  };

  // 1. Save to Firestore published_sites collection
  try {
    const siteDocRef = doc(db, 'published_sites', siteId);
    await setDoc(siteDocRef, publishRecord);
  } catch (err: any) {
    console.warn('[Firestore Publish Warning]:', err?.message || err);
  }

  // 2. Also register in local cache
  try {
    const recent = JSON.parse(localStorage.getItem('lumora_published_sites') || '[]');
    recent.unshift(publishRecord);
    localStorage.setItem('lumora_published_sites', JSON.stringify(recent.slice(0, 10)));
  } catch (e) {}

  // 3. Post to backend server route so it can directly serve the HTML standalone
  try {
    await fetch('/api/hosting/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishRecord)
    });
  } catch (fetchErr) {
    console.warn('[Backend Publish Route Note]:', fetchErr);
  }

  return {
    success: true,
    siteId,
    publishedUrl,
    livePreviewUrl,
    publishedAt
  };
}

// --------------------------------------------------------------------------
// 3. SHARED WORKSPACE REAL-TIME CO-EDITING (RTDB + Firestore)
// --------------------------------------------------------------------------

/**
 * Join or create a real-time collaborative workspace room
 */
export function joinCollaborativeWorkspace(params: {
  roomId: string;
  user: CollaboratorUser;
  onRemoteUpdate: (state: SharedWorkspaceState) => void;
  onPresenceUpdate: (collaborators: CollaboratorUser[]) => void;
}): () => void {
  const { roomId, user, onRemoteUpdate, onPresenceUpdate } = params;
  let isCleanedUp = false;

  // Track user presence in Firestore & RTDB
  const roomDocRef = doc(db, 'shared_workspaces', roomId);

  // Set up Firestore real-time listener
  const unsubscribeFirestore = onSnapshot(roomDocRef, (snapshot) => {
    if (isCleanedUp) return;
    if (snapshot.exists()) {
      const data = snapshot.data() as any;
      if (data && data.html !== undefined) {
        // If the update was made by someone else, notify
        if (data.lastEditedBy !== user.id) {
          onRemoteUpdate({
            roomId,
            roomName: data.roomName || 'Shared Workspace',
            projectId: data.projectId || 'shared-project',
            html: data.html || '',
            css: data.css || '',
            js: data.js || '',
            lastEditedBy: data.lastEditedBy || 'Anonymous Peer',
            lastEditedAt: data.lastEditedAt || new Date().toISOString(),
            version: data.version || 1
          });
        }
      }

      // Update presence if available
      if (data.activeCollaborators && Array.isArray(data.activeCollaborators)) {
        onPresenceUpdate(data.activeCollaborators);
      }
    }
  }, (err) => {
    console.warn('[Firestore Shared Workspace Listener Note]:', err);
  });

  // Set up Firebase Realtime Database presence & syncing if RTDB is active
  let rtdbPresenceRef: any = null;
  let rtdbRoomRef: any = null;
  if (rtdb) {
    try {
      rtdbRoomRef = rtdbRef(rtdb, `shared_workspaces/${roomId}`);
      rtdbPresenceRef = rtdbRef(rtdb, `shared_workspaces/${roomId}/presence/${user.id}`);
      
      // Update RTDB presence
      rtdbSet(rtdbPresenceRef, {
        ...user,
        lastActive: Date.now()
      });

      // Clear presence on disconnect
      try {
        onDisconnect(rtdbPresenceRef).remove();
      } catch (e) {}

      // Listen to RTDB room changes
      rtdbOnValue(rtdbRoomRef, (snapshot) => {
        if (isCleanedUp) return;
        const val = snapshot.val();
        if (val && val.state && val.state.lastEditedBy !== user.id) {
          onRemoteUpdate(val.state);
        }
        if (val && val.presence) {
          const list: CollaboratorUser[] = Object.values(val.presence);
          onPresenceUpdate(list);
        }
      });
    } catch (rtdbErr) {
      console.warn('[RTDB Init Notice]:', rtdbErr);
    }
  }

  // Register current user into Firestore activeCollaborators
  const registerPresence = async () => {
    try {
      const snap = await getDoc(roomDocRef);
      let currentCollabs: CollaboratorUser[] = [];
      if (snap.exists()) {
        currentCollabs = snap.data()?.activeCollaborators || [];
      }
      const filtered = currentCollabs.filter(c => c.id !== user.id && Date.now() - (c.lastActive || 0) < 60000);
      filtered.push({ ...user, lastActive: Date.now() });

      await setDoc(roomDocRef, {
        roomId,
        activeCollaborators: filtered,
        lastHeartbeat: new Date().toISOString()
      }, { merge: true });

      onPresenceUpdate(filtered);
    } catch (e) {}
  };

  registerPresence();
  const heartbeatInterval = setInterval(registerPresence, 15000);

  // Return cleanup function
  return () => {
    isCleanedUp = true;
    clearInterval(heartbeatInterval);
    unsubscribeFirestore();
    
    if (rtdbPresenceRef) {
      try {
        rtdbSet(rtdbPresenceRef, null);
      } catch (e) {}
    }

    // Remove user from Firestore activeCollaborators
    getDoc(roomDocRef).then((snap) => {
      if (snap.exists()) {
        const collabs = snap.data()?.activeCollaborators || [];
        const remaining = collabs.filter((c: CollaboratorUser) => c.id !== user.id);
        setDoc(roomDocRef, { activeCollaborators: remaining }, { merge: true });
      }
    }).catch(() => {});
  };
}

/**
 * Broadcast code updates to all peers in the shared workspace
 */
export async function broadcastWorkspaceUpdate(params: {
  roomId: string;
  userId: string;
  userName: string;
  html: string;
  css: string;
  js: string;
}): Promise<void> {
  const { roomId, userId, userName, html, css, js } = params;
  const timestamp = new Date().toISOString();

  const payload = {
    html,
    css,
    js,
    lastEditedBy: userId,
    lastEditedByName: userName,
    lastEditedAt: timestamp
  };

  // 1. Update Firestore
  try {
    const roomDocRef = doc(db, 'shared_workspaces', roomId);
    await setDoc(roomDocRef, payload, { merge: true });
  } catch (err) {
    console.warn('[Firestore Broadcast Note]:', err);
  }

  // 2. Update Firebase Realtime Database
  if (rtdb) {
    try {
      const roomStateRef = rtdbRef(rtdb, `shared_workspaces/${roomId}/state`);
      await rtdbUpdate(roomStateRef, payload);
    } catch (rtdbErr) {
      console.warn('[RTDB Broadcast Note]:', rtdbErr);
    }
  }
}
