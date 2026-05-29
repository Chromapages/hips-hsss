'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
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
  const [loading, setLoading] = useState(() => !!auth);
  const firebaseReady = !!auth;

  useEffect(() => {
    if (!auth) {
      console.error("[AuthProvider] Auth instance is null");
      return;
    }

    let syncDebounce: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Force refresh token to get latest custom claims
          const idTokenResult = await user.getIdTokenResult(true);
          setRole((idTokenResult.claims.role as string) || 'PARTICIPANT');
          setUser(user);

          // Synchronize cookie for middleware (debounced to avoid rapid re-syncs)
          setAuthCookie(idTokenResult.token);

          // Sync user with Commerce DB if needed (debounced)
          if (syncDebounce) clearTimeout(syncDebounce);
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
      } catch (error) {
        console.error('Auth state initialization failed:', error);
        setUser(null);
        setRole(null);
        removeAuthCookie();
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (syncDebounce) clearTimeout(syncDebounce);
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

  return (
    <AuthContext.Provider value={{ user, role, loading, firebaseReady, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
