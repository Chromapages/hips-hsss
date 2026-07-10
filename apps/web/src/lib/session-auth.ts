/**
 * Session and service-token signing/verification — central helper.
 *
 * Layer 2 + Layer 3 changes:
 *  - All tokens now carry a jti claim (UUIDv4) so they can be revoked.
 *  - User session tokens are registered in the per-user active-jti set
 *    so revokeAllTokensForUser works.
 *  - The legacy SAFETY_SERVICE_SECRET is preserved as a fallback during
 *    the rotation window (Layer 6).
 *
 * This module is imported by:
 *  - /api/safety/flag
 *  - /api/safety/ingest
 *  - /api/safety/mitigate (via lib/safety-mitigation.ts)
 *  - /api/auth/session (long-lived user session cookie)
 */

import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import crypto from 'node:crypto';
import { signWithRevocableJwt } from '@/lib/auth/revocation-jti';
import { SESSION_DUAL, getActiveSigningKeys, verifyWithDual } from '@/lib/secrets/dual';

// ─── User session token ─────────────────────────────────────────────────────
//
// Layer 6: SESSION_DUAL reads the primary from SESSION_SERVICE_SECRET and
// the prior (rotation window) from SESSION_SERVICE_SECRET_PRIOR. We
// sign with primary and verify against both, so a rotation does not
// invalidate live session tokens.

/**
 * Signs an opaque session token. The token carries only the sessionRef
 * (no PII, no role). Layer 3: jti is set so the token is revocable.
 * Layer 6: signed with the current primary; verified against primary + prior.
 */
export async function signSessionToken(sessionRef: string, userId: string) {
  if (!sessionRef) throw new Error('signSessionToken requires sessionRef');
  if (!userId) throw new Error('signSessionToken requires userId (for revocation tracking)');

  const { primary } = getActiveSigningKeys(SESSION_DUAL);
  const jti = crypto.randomUUID();
  return await signWithRevocableJwt({
    secret: primary,
    claims: { ref: sessionRef },
    revocable: {
      userId,
      jti,
      subject: userId,
      expiresInSeconds: 2 * 60 * 60, // 2 hours
    },
  });
}

/**
 * Verify a session token. Layer 3: also checks the jti against the
 * revocation registry. Layer 6: tries primary first, then prior.
 */
export async function verifySessionToken(token: string) {
  if (!token) return null;
  const result = await verifyWithDual(SESSION_DUAL, token, { clockTolerance: 5 });
  if (!result.ok) return null;
  const jti = result.payload.jti;
  if (jti) {
    const { isTokenRevoked } = await import('@/lib/auth/revocation');
    const revoked = await isTokenRevoked(jti);
    if (revoked) return null;
  }
  return result.payload as { ref: string; jti?: string; exp?: number };
}
