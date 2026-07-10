import { createHmac } from 'node:crypto';

/**
 * Hashes a Firebase UID using HMAC-SHA256 and a secret key.
 * Used to ensure the session database never contains raw Firebase UIDs (PII).
 */
export function hashOwnerUid(uid: string): string {
  const key = process.env.SESSION_ANONYMISATION_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_ANONYMISATION_KEY environment variable is not defined');
    }
    // Development fallback to avoid breaking tests/local runs if env var is missing
    const devKey = 'dev-session-anonymisation-secret-key-do-not-use-in-prod';
    return createHmac('sha256', devKey).update(uid).digest('hex');
  }
  return createHmac('sha256', key).update(uid).digest('hex');
}
