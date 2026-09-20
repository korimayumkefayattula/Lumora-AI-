import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let adminApp: App | null = null;
let adminAuthInstance: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!adminAuthInstance) {
    try {
      if (!getApps().length) {
        adminApp = initializeApp({
          projectId: firebaseConfig.projectId,
        });
      } else {
        adminApp = getApps()[0];
      }
      adminAuthInstance = getAuth(adminApp);
    } catch (err) {
      console.warn('Firebase Admin Auth lazy initialization warning:', err);
      // Fallback
      adminAuthInstance = getAuth();
    }
  }
  return adminAuthInstance;
}

