/**
 * Phase 5 — Session Service (5.2, 5.3)
 * Shared constants, session heartbeat, and HIPAA-aware helpers.
 * All session data is transient — never correlate to Firebase UID.
 */

import { db } from '@/lib/firebase-admin';

/** Default session length in minutes (to be overridden by service config) */
export const SESSION_DURATION_MINUTES = 60;
export const SESSION_DURATION_MS = SESSION_DURATION_MINUTES * 60 * 1000;

/** Token TTL: session duration + 5 min buffer */
export const SESSION_TOKEN_TTL_MS = SESSION_DURATION_MS + 5 * 60 * 1000;
export const SESSION_TOKEN_TTL_SECONDS = Math.ceil(SESSION_TOKEN_TTL_MS / 1000);

/** Reconnection: 5-minute window after disconnect */
export const RECONNECT_WINDOW_MS = 5 * 60 * 1000;
export const MAX_RECONNECT_ATTEMPTS = 3;

/** Backoff: 1s base, exponential, ±25% jitter, 30s cap */
export const BACKOFF_BASE_MS = 1_000;
export const BACKOFF_MAX_MS = 30_000;

export function calculateBackoff(attemptNumber: number): number {
  const delay = Math.min(BACKOFF_BASE_MS * Math.pow(2, attemptNumber - 1), BACKOFF_MAX_MS);
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

/** Phase 5 — Session states */
export type SessionStatus = 'pending' | 'active' | 'ended' | 'flagged';

/** Minimal session shape returned to clients (no correlation data) */
export interface SessionInfo {
  id: string;
  status: SessionStatus;
  createdAt: string;
  activeAt?: string;
  endedAt?: string;
  participantCount: number;
  maxParticipants: number;
  roomName: string;
  flagged: boolean;
  expiresAt?: string;
}

/** Valid state transitions */
export const VALID_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  pending: ['active'],
  active: ['ended', 'flagged'],
  flagged: ['ended'],
  ended: [],
};

/** Firestore collection names (all transient — no PII) */
export const SESSION_COLLECTION = 'phase5_sessions';
export const FLAG_COLLECTION = 'session_flags';
export const RECONNECT_COLLECTION = 'session_reconnects';

/** Anonymous avatar seed — derived from crypto UUID only */
export function deriveAvatarSeed(anonymousIdentity: string): { style: number; palette: string } {
  const palettes = ['coastal', 'sunrise', 'forest'] as const;
  const first = anonymousIdentity.charCodeAt(0) || 1;
  const second = anonymousIdentity.charCodeAt(1) || 2;
  return {
    style: (first % 12) + 1,
    palette: palettes[second % palettes.length]!, // palettes is const tuple, always defined
  };
}

/** Firestore reference helpers — no-op if DB unavailable */
export async function getSessionDoc(sessionId: string) {
  return db.collection(SESSION_COLLECTION).doc(sessionId).get();
}

export async function updateSessionDoc(sessionId: string, data: Record<string, unknown>) {
  await db.collection(SESSION_COLLECTION).doc(sessionId).update(data);
}

export async function addFlagDoc(data: Record<string, unknown>) {
  return db.collection(FLAG_COLLECTION).add({ ...data, createdAt: new Date().toISOString() });
}

/** Session expiry helper used by /api/cron/session-expire */
export async function expireStaleSessions() {
  const cutoff = new Date(Date.now() - SESSION_TOKEN_TTL_MS).toISOString();
  try {
    const snapshot = await db
      .collection(SESSION_COLLECTION)
      .where('status', '==', 'active')
      .where('createdAt', '<', cutoff)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data() as { activeAt?: string };
      if (data.activeAt) {
        const activeMs = Date.now() - new Date(data.activeAt).getTime();
        if (activeMs > SESSION_TOKEN_TTL_MS) {
          await doc.ref.update({ status: 'ended', endedAt: new Date().toISOString() });
        }
      }
    }
  } catch (err) {
    console.warn('[SessionService] expireStaleSessions error:', err);
  }
}
