import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth as getFirebaseAuth, signInWithCustomToken, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  return initializeApp(firebaseConfig);
}

function getProxyValue<T extends object>(target: T, prop: string | symbol) {
  const value = (target as Record<string | symbol, unknown>)[prop];
  return typeof value === 'function' ? value.bind(target) : value;
}

export function getAuth(): Auth {
  return getFirebaseAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getClientStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

export const app = new Proxy({} as FirebaseApp, {
  get(_target, prop) {
    return getProxyValue(getFirebaseApp(), prop);
  },
});

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return getProxyValue(getAuth(), prop);
  },
});

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    return getProxyValue(getDb(), prop);
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    return getProxyValue(getClientStorage(), prop);
  },
});

export { signInWithCustomToken };
