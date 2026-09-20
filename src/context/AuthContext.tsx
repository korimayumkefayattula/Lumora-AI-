import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

export interface DbUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  classGrade: string | null;
  board: string | null;
  targetExam: string | null;
  studyStreak: number;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  syncUserProfile: (profileData?: Partial<DbUser>) => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize authenticated Firebase user with Cloud SQL PostgreSQL database
  const syncWithDatabase = async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);

      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          displayName: firebaseUser.displayName,
          photoUrl: firebaseUser.photoURL
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setDbUser(data.user);
        }
      }
    } catch (err) {
      console.error('Failed to synchronize user with PostgreSQL database:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncWithDatabase(currentUser);
      } else {
        setToken(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      setUser(cred.user);
      await syncWithDatabase(cred.user);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      setToken(null);
    } catch (error) {
      console.error('Sign Out failed:', error);
      throw error;
    }
  };

  const syncUserProfile = async (profileData?: Partial<DbUser>) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(profileData || {})
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setDbUser(data.user);
        }
      }
    } catch (err) {
      console.error('Failed to update user profile in database:', err);
    }
  };

  const getIdToken = async () => {
    if (!user) return null;
    try {
      const idToken = await user.getIdToken();
      setToken(idToken);
      return idToken;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        token,
        loading,
        signInWithGoogle,
        signOutUser,
        syncUserProfile,
        getIdToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
