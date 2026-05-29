import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Singleton guard for app initialization
let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _initialized = false;

function getFirebaseApp() {
  if (!_initialized) {
    if (!firebaseConfig.apiKey) {
      console.warn("Firebase API Key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in .env.local");
    }
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    _initialized = true;
  }
  return _app;
}

function getFirebaseAuth() {
  if (!_auth) {
    const app = getFirebaseApp();
    if (!app) {
      throw new Error("Firebase app not initialized");
    }
    _auth = getAuth(app);
  }
  return _auth;
}

// Auth instance - lazy initialization with null guard
export const auth: ReturnType<typeof getAuth> | null = (() => {
  try {
    if (!firebaseConfig.apiKey) {
      console.warn("Firebase API Key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in .env.local");
      return null;
    }
    return getFirebaseAuth();
  } catch (e) {
    console.error("Firebase auth initialization failed:", e);
    return null;
  }
})();

// Analytics instance (conditional for SSR/Browser compatibility)
export const analytics = typeof window !== 'undefined' && firebaseConfig.apiKey
  ? isSupported().then(yes => yes ? getAnalytics(getFirebaseApp()) : null)
  : null;

export const isFirebaseClientReady = () => _initialized && _app !== null && _auth !== null;

export default getFirebaseApp;