'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseClientReady } from '@/lib/firebase-client';
import { setAuthCookie, removeAuthCookie } from '@/lib/auth-cookies';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  firebaseReady: boolean;
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  firebaseReady: false,
  getToken: async () => null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Wait for Firebase to be ready before subscribing to auth state
    if (!isFirebaseClientReady()) {
      console.warn("[AuthProvider] Firebase client not ready yet");
      // Retry after a short delay
      const retryTimeout = setTimeout(() => {
        if (!isFirebaseClientReady()) {
          console.error("[AuthProvider] Firebase client initialization failed - auth may not work");
          setFirebaseReady(false);
          setLoading(false);
        }
      }, 3000);
      return () => clearTimeout(retryTimeout);
    }

    setFirebaseReady(true);

    if (!auth) {
      console.error("[AuthProvider] Auth instance is null");
      setLoading(false);
      return;
    }

    let syncDebounce: ReturnType<typeof setTimeout>;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Force refresh token to get latest custom claims
        const idTokenResult = await user.getIdTokenResult(true);
        setRole((idTokenResult.claims.role as string) || 'PARTICIPANT');
        setUser(user);

        // Synchronize cookie for middleware (debounced to avoid rapid re-syncs)
        setAuthCookie(idTokenResult.token);

        // Sync user with Commerce DB if needed (debounced)
        clearTimeout(syncDebounce);
        syncDebounce = setTimeout(async () => {
          try {
            await fetch('/api/auth/sync', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${idTokenResult.token}`,
              },
            });
          } catch (error) {
            console.error('Auth sync failed:', error);
          }
        }, 2000);
      } else {
        setUser(null);
        setRole(null);
        removeAuthCookie();
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(syncDebounce);
    };
  }, []);

  const getToken = async () => {
    if (!auth?.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const logout = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        {/* Ambient Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-purple-500 animate-spin duration-700" />
          </div>
          <div className="flex flex-col items-center gap-1">
            {!firebaseReady && (
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500 animate-pulse">
                Firebase Initializing...
              </p>
            )}
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 animate-pulse">
              Initializing Secure Session
            </p>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
              Hard Anonymity Protocol v1.0
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, firebaseReady, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);