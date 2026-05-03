'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { setAuthCookie, removeAuthCookie } from '@/lib/auth-cookies';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  getToken: async () => null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Force refresh token to get latest custom claims
        const idTokenResult = await user.getIdTokenResult(true);
        setRole((idTokenResult.claims.role as string) || 'PARTICIPANT');
        setUser(user);
        
        // Synchronize cookie for middleware
        setAuthCookie(idTokenResult.token);

        // Sync user with Commerce DB if needed
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
      } else {
        setUser(null);
        setRole(null);
        removeAuthCookie();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const logout = async () => {
    await auth.signOut();
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
    <AuthContext.Provider value={{ user, role, loading, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
