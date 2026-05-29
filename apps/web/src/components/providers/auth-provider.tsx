'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

type AppUser = User & { role?: string }

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const provisioningRef = useRef<Set<Promise<unknown>>>(new Set())

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const provisionUser = useCallback(async (user: User) => {
    const token = await user.getIdToken()
    const sessionPromise = fetch('/api/v1/auth/session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const promise = fetch('/api/v1/users/register', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email ?? undefined,
        displayName: user.displayName ?? undefined,
        provider: user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
      }),
    })
    provisioningRef.current.add(promise)
    provisioningRef.current.add(sessionPromise)
    try {
      await Promise.all([promise, sessionPromise])
    } catch (err) {
      console.error('User provisioning error:', err)
    } finally {
      provisioningRef.current.delete(promise)
      provisioningRef.current.delete(sessionPromise)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fire and forget, but track the promise
        void provisionUser(user)
      }
      if (mountedRef.current) {
        setUser(user)
        setLoading(false)
      }
    }, (err) => {
      console.error('Auth state change error:', err)
      if (mountedRef.current) {
        setError(err.message)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [provisionUser])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName })
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/v1/auth/session', { method: 'DELETE' }).catch(() => undefined)
      await firebaseSignOut(auth)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
