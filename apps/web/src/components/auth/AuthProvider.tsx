'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged, User } from 'firebase/auth';
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

type AuthSyncResponse = {
  user?: {
    role?: string | null;
  };
  authTime?: number;
  error?: string;
  code?: string;
  details?: string;
  message?: string;
  requestId?: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // Initialize to true unconditionally so the server-rendered HTML matches
  // the client hydration. The 3s setTimeout inside the effect (or the
  // listener firing) will resolve loading. Previously `!!auth` caused a
  // hydration mismatch when auth was null on the server and truthy on
  // the client, producing a brief "spinner → empty → spinner" flicker.
  const [loading, setLoading] = useState<boolean>(true);
  const firebaseReady = !!auth;

  useEffect(() => {
    if (!auth) {
      const unavailableTimeout = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(unavailableTimeout);
    }
    const firebaseAuth = auth;

    // Defensive hard timeout: if onAuthStateChanged never fires or its
    // internal network call to securetoken.googleapis.com hangs (CSP block,
    // network failure, broken session), the loading spinner would otherwise
    // persist forever. Force-resolve after 3s so the dashboard can render
    // the unauthenticated fallback path.
    const loadingTimeout = setTimeout(() => {
      setLoading((current) => {
        if (current) {
          console.warn(
            '[AuthProvider] Auth state did not resolve within 3s — forcing loading=false. ' +
            'This usually means securetoken.googleapis.com is unreachable or CSP-blocked.'
          );
        }
        return false;
      });
    }, 3000);

    let adminExpiryTimeout: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (user) => {
      try {
        if (user) {
          let idToken;
          try {
            idToken = await Promise.race([
              user.getIdToken(),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('getIdToken timed out after 3s')), 3000)
              ),
            ]);
          } catch (refreshError) {
            console.warn('[AuthProvider] Token retrieval failed:', refreshError);
            throw refreshError;
          }
          setUser(user);

          // Sync identity and hydrate role from the authoritative Commerce DB.
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });
          const data = (await response.json().catch(() => ({}))) as AuthSyncResponse;
          if (!response.ok) {
            const message = data.message || data.details || data.error;

            if (response.status === 401 || response.status === 403) {
              console.warn('[AuthProvider] Auth sync rejected credentials:', {
                status: response.status,
                code: data.code,
                message,
                requestId: data.requestId,
              });
              await firebaseAuth.signOut();
              return;
            }

            console.warn('[AuthProvider] Auth sync unavailable:', {
              status: response.status,
              code: data.code,
              message,
              requestId: data.requestId,
            });
            setRole(null);
            return;
          }
          const databaseRole = data.user?.role || null;
          if (databaseRole === 'ADMIN' || databaseRole === 'SUPER_ADMIN') {
            if (adminExpiryTimeout) clearTimeout(adminExpiryTimeout);
            const expiresAt = Number(data.authTime) * 1000 + 4 * 60 * 60 * 1000;
            const remainingMs = expiresAt - Date.now();
            if (remainingMs <= 0) {
              await firebaseAuth.signOut();
              return;
            }
            adminExpiryTimeout = setTimeout(() => {
              void firebaseAuth.signOut();
            }, remainingMs);
          }
          setRole(databaseRole);
          await setAuthCookie(idToken);
        } else {
          setUser(null);
          setRole(null);
          removeAuthCookie();
        }
      } catch (error) {
        console.error('Auth state initialization failed:', error);
        if (user) {
          setUser(user);
          setRole(null);
        } else {
          setUser(null);
          setRole(null);
          removeAuthCookie();
        }
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (adminExpiryTimeout) clearTimeout(adminExpiryTimeout);
      clearTimeout(loadingTimeout);
    };
  }, []);

  const getToken = async (): Promise<string | null> => {
    if (!auth?.currentUser) return null;
    // Bound token retrieval so a hung Firebase SDK call cannot deadlock
    // any consumer (e.g., dashboard SWR fetcher) waiting on this promise.
    try {
      return await Promise.race([
        auth.currentUser.getIdToken(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('getIdToken timed out after 5s')), 5000)
        ),
      ]);
    } catch (error) {
      console.error('[AuthProvider] getToken failed:', error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (err) {
      console.error('[AuthProvider] Failed to clear session cookie:', err);
    }
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
