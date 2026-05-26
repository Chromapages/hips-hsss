import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

// Firebase Admin SDK initialization
let firebaseApp: admin.app.App | null = null;

function getFirebaseApp(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase configuration missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, 'commerce-service');

  return firebaseApp;
}

@Injectable()
export class FirebaseAuthService {
  /**
   * Verify a Firebase ID token and return the decoded claims.
   * 
   * Production-ready implementation using Firebase Admin SDK.
   * 
   * @param idToken - The Firebase ID token to verify
   * @returns The decoded token claims including 'sub' (user ID)
   * @throws Error if token is invalid or expired
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    const app = getFirebaseApp();
    return admin.auth(app).verifyIdToken(idToken);
  }

  /**
   * Extract Firebase UID from a verified token.
   * 
   * @param idToken - The Firebase ID token to verify
   * @returns The Firebase UID (sub claim)
   */
  async getUidFromToken(idToken: string): Promise<string> {
    const claims = await this.verifyIdToken(idToken);
    return claims.sub;
  }
}