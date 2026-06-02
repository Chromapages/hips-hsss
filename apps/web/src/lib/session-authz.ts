import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { verifySessionToken } from '@/lib/session-auth';

export type SessionPrincipal =
  | { kind: 'firebase'; uid: string }
  | { kind: 'session'; ref: string };

/**
 * Authorize a caller for a session and return the verified principal.
 *
 * The previous `participantIdentities.includes(firebaseUid)` check was a
 * category error — that field stores anonymous identities (UUIDs), not
 * Firebase UIDs, so it could never match and every legitimate participant
 * was rejected. See audit finding A2.
 *
 * Authorization rules:
 *   1. Firebase ID token: caller is the session's `userId`, `facilitatorId`,
 *      `createdBy`, or has been recorded as a participant via
 *      `session_participants`.
 *   2. Session token: the embedded `ref` must equal the sessionId.
 *
 * Returns `null` if the caller is not authorized. Callers should respond
 * with 401 to avoid leaking session existence.
 */
export async function authorizeSessionAccess(
  sessionId: string,
  authHeader: string | null,
): Promise<SessionPrincipal | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  // 1) Try Firebase ID token first (preferred).
  try {
    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = payload.sub;
    if (!firebaseUid) return null;

    const ok = await isAuthorizedForSession(sessionId, firebaseUid);
    if (ok) return { kind: 'firebase', uid: firebaseUid };
  } catch {
    // Fall through to session-token check.
  }

  // 2) Fallback: opaque session token (HS256).
  const sessionPayload = await verifySessionToken(token);
  if (sessionPayload && sessionPayload.ref === sessionId) {
    return { kind: 'session', ref: sessionPayload.ref };
  }

  return null;
}

async function isAuthorizedForSession(
  sessionId: string,
  firebaseUid: string,
): Promise<boolean> {
  const sessionRef = db.collection('phase5_sessions').doc(sessionId);
  const sessionDoc = await sessionRef.get();
  if (!sessionDoc.exists) return false;

  const data = sessionDoc.data() as {
    userId?: string;
    facilitatorId?: string;
    createdBy?: string;
  } | undefined;
  if (!data) return false;

  if (data.userId === firebaseUid) return true;
  if (data.facilitatorId === firebaseUid) return true;
  if (data.createdBy === firebaseUid) return true;

  // Recorded participant mapping: `${sessionId}_${firebaseUid}`
  const participantDoc = await db
    .collection('session_participants')
    .doc(`${sessionId}_${firebaseUid}`)
    .get();
  if (participantDoc.exists) return true;

  return false;
}
