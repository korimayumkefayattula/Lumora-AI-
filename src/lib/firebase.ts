import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider with all requested Google Workspace scopes
export const googleAuthProvider = new GoogleAuthProvider();
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

WORKSPACE_SCOPES.forEach((scope) => {
  googleAuthProvider.addScope(scope);
});

// In-memory access token cache (per Workspace integration guidelines: strictly in-memory, never in localStorage)
let cachedWorkspaceAccessToken: string | null = null;

export const setCachedWorkspaceToken = (token: string | null) => {
  cachedWorkspaceAccessToken = token;
};

export const getCachedWorkspaceToken = (): string | null => {
  return cachedWorkspaceAccessToken;
};

// Firestore Error Handling & Logging
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase configuration notice: client is offline or initial connection pending.');
    }
  }
}
testConnection();

// Realtime Database instance
const rtdbUrl = (firebaseConfig as any).databaseURL || `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`;
let rtdbInstance: ReturnType<typeof getDatabase> | null = null;
try {
  rtdbInstance = getDatabase(app, rtdbUrl);
} catch (e) {
  console.warn('Firebase Realtime Database init note:', e);
}
export const rtdb = rtdbInstance;
export { firebaseConfig };
