import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

import { cert } from 'firebase-admin/app'
import type { App } from 'firebase-admin/app'
import type { Firestore } from 'firebase-admin/firestore'
import type { Storage } from 'firebase-admin/storage'

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  } else {
    credential = applicationDefault()
  }

  const config = {
    credential,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  }

  return initializeApp(config)
}

export const adminApp = new Proxy({} as App, {
  get(_target, prop) {
    return getAdminApp()[prop as keyof App]
  },
})

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    return getAuth(getAdminApp())[prop as keyof Auth]
  },
})

export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    return getFirestore(getAdminApp())[prop as keyof Firestore]
  },
})

export const adminStorage = new Proxy({} as Storage, {
  get(_target, prop) {
    return getStorage(getAdminApp())[prop as keyof Storage]
  },
})

export async function verifyFirebaseToken(idToken: string) {
  return getAuth(getAdminApp()).verifyIdToken(idToken)
}
