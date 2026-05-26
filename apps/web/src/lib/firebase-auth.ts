import { adminAuth } from './firebase-admin';

export interface FirebaseTokenPayload {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  iss: string;
  aud: string;
  auth_time: number;
  sub: string;
  iat: number;
  exp: number;
}

/**
 * Verifies a Firebase ID token from an Authorization header value.
 * Accepts the raw header value (e.g. "Bearer <token>") or just the token.
 * Returns the decoded payload or throws.
 */
export async function verifyFirebaseIdToken(
  authorizationHeader: string | null | undefined
): Promise<FirebaseTokenPayload> {
  if (!authorizationHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authorizationHeader.trim().replace(/^Bearer\s+/i, '');

  if (!token) {
    throw new Error('Bearer token is missing from Authorization header');
  }

  return adminAuth.verifyIdToken(token) as Promise<FirebaseTokenPayload>;
}