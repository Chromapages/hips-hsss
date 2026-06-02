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
  // Initialize to true unconditionally so the server-rendered HTML matches
  // the client hydration. The 3s setTimeout inside the effect (or the
  // listener firing) will resolve loading. Previously `!!auth` caused a
  // hydration mismatch when auth was null on the server and truthy on
  // the client, producing a brief "spinner → empty → spinner" flicker.
  const [loading, setLoading] = useState<boolean>(true);
  const firebaseReady = !!auth;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

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

    let syncDebounce: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Attempt to force refresh token for latest claims, but fallback to cached token
          // if it times out or fails (e.g. due to flaky network).
          let idTokenResult;
          try {
            idTokenResult = await Promise.race([
              user.getIdTokenResult(true),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('getIdTokenResult timed out after 3s')), 3000)
              ),
            ]);
          } catch (refreshError) {
            console.warn('[AuthProvider] Token force refresh failed, falling back to cached token:', refreshError);
            idTokenResult = await user.getIdTokenResult(false);
          }
          
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
        // Do not clear user here unless we are sure they are logged out.
        // If it's a completely fatal error, we might be in an inconsistent state,
        // but it's better to stay logged in with default role.
        if (user) {
          setUser(user);
          setRole('PARTICIPANT');
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
      if (syncDebounce) clearTimeout(syncDebounce);
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
