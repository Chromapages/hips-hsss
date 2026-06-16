/**
 * withRevocableJwt — convenience wrapper for issuing JWTs that the revocation
 * registry can track and revoke.
 *
 * Use this in place of calling jose's SignJWT directly whenever the token
 * represents a logged-in user, an active service session, or any other
 * principal that may need to be bulk-revoked later.
 *
 * For stateless ephemeral tokens (e.g. mfa-pending, sudo), use plain
 * jose signing and do NOT call trackActiveJti — the consuming route
 * should mark the token single-use via consumedAt.
 */

import 'server-only';
import { SignJWT } from 'jose';
import crypto from 'node:crypto';
import { trackActiveJti } from './revocation';

export type WithRevocableJwtOptions = {
  /** The principal this token is for. For user tokens, the userId. */
  userId: string;
  /** The jti to use. Random UUID is the default. */
  jti?: string;
  /** JWT subject claim (sub). Defaults to userId. */
  subject?: string;
  /** Token TTL in seconds. */
  expiresInSeconds: number;
};

export type SignWithRevocableJwtArgs = {
  /** The secret used to sign the token. */
  secret: Uint8Array;
  /** All standard claims except iat/exp/jti. */
  claims: Record<string, unknown>;
  /** Header overrides. */
  header?: { alg?: string; typ?: string };
  /** Revocation-tracking options. */
  revocable: WithRevocableJwtOptions;
};

/**
 * Sign a JWT and register the jti in the active-jti set so it can be
 * revoked later via revokeAllTokensForUser.
 */
export async function signWithRevocableJwt(args: SignWithRevocableJwtArgs): Promise<string> {
  const jti = args.revocable.jti ?? crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + args.revocable.expiresInSeconds;

  const jwt = await new SignJWT({ ...args.claims })
    .setProtectedHeader({
      alg: (args.header?.alg ?? 'HS256') as 'HS256',
      typ: (args.header?.typ ?? 'JWT') as 'JWT',
    })
    .setJti(jti)
    .setSubject(args.revocable.subject ?? args.revocable.userId)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(args.secret);

  // Best-effort tracking — don't fail the sign if Redis is down.
  try {
    await trackActiveJti({
      userId: args.revocable.userId,
      jti,
      expiresAt: exp,
    });
  } catch {
    // Already logged in trackActiveJti; never propagate.
  }

  return jwt;
}
