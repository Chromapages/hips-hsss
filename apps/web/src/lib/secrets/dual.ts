/**
 * Dual-secret support — Layer 6 (rotation without downtime).
 *
 * For every signing secret, we maintain two values during the rotation
 * window:
 *
 *   <NAME>          — primary (signs new tokens, verifies new tokens)
 *   <NAME>_PRIOR    — secondary (verifies tokens signed with the
 *                     previous primary, expires naturally as old tokens
 *                     are replaced)
 *
 * The rotation lifecycle is:
 *
 *   1. Generate a new secret value. Set <NAME> = new. Set <NAME>_PRIOR
 *      = old. Both are active for the rotation window.
 *   2. Deploy. New tokens are signed with the new primary. Old tokens
 *      signed with the old primary are still verified via <NAME>_PRIOR.
 *   3. Wait for the longest token TTL to pass. After that, no live
 *      tokens were signed with the old primary.
 *   4. Remove <NAME>_PRIOR. Rotation complete.
 *
 * TTLs for the categories we support:
 *   - SESSION_SERVICE_SECRET  → session tokens, 2h
 *   - SERVICE_JWT_SECRET      → service tokens, 5 min
 *   - SAFETY_SERVICE_SECRET   → service tokens, 5 min
 *   - MFA_ENCRYPTION_KEY      → TOTP secret, indefinite (must decrypt
 *                               historical rows forever — so MFA uses
 *                               an *append-only* re-encryption strategy
 *                               rather than dual-decrypt)
 *
 * The dual-decrypt path is implemented in lib/mfa/index.ts. JWT
 * signing/verification uses the helpers in this file.
 *
 * In dev, only the primary is required. The secondary is optional.
 * In production, the absence of the secondary is allowed (no
 * rotation in progress) but its presence is also allowed (mid-
 * rotation).
 */

import 'server-only';
import { SignJWT, jwtVerify, errors as joseErrors, type JWTPayload } from 'jose';
import { requireSecret, tryGetSecret } from '@/lib/secrets';
import { recordSecretBirth, getSecretAgeDays } from './age';

const STALE_THRESHOLD_DAYS = 90;

/**
 * Configuration for a dual-secret. The `priorEnv` is the name of the
 * env var that holds the previous primary during rotation. Tokens
 * signed with the previous primary will still verify during the
 * rotation window.
 */
export type DualSecretConfig = {
  /** Name of the primary env var (e.g. SESSION_SERVICE_SECRET). */
  primary: string;
  /** Name of the prior env var (e.g. SESSION_SERVICE_SECRET_PRIOR). */
  priorEnv: string;
  /** Human-readable description for error messages. */
  description: string;
  /** Min length. Default 32. */
  minLength?: number;
};

/**
 * Read both the primary and prior secret from the environment. Returns
 * Uint8Array encoding of each (suitable for jose's verify).
 */
export function getActiveSigningKeys(config: DualSecretConfig): {
  primary: Uint8Array;
  prior: Uint8Array | null;
} {
  const primary = requireSecret(config.primary, {
    minLength: config.minLength ?? 32,
    description: config.description,
    trackAge: true,
  });
  const prior = tryGetSecret(config.priorEnv, { minLength: config.minLength ?? 32 });
  return {
    primary: new TextEncoder().encode(primary),
    prior: prior ? new TextEncoder().encode(prior) : null,
  };
}

/**
 * Sign a JWT with the primary key only. The returned token is
 * verifiable by both primary and prior (during rotation) keys.
 */
export async function signWithDual(
  config: DualSecretConfig,
  payload: JWTPayload,
  header: { alg?: 'HS256' | 'HS384' | 'HS512'; typ?: 'JWT' },
  setClaims: (jwt: SignJWT) => SignJWT,
): Promise<string> {
  const { primary } = getActiveSigningKeys(config);
  let jwt = new SignJWT(payload).setProtectedHeader({
    alg: header.alg ?? 'HS256',
    typ: header.typ ?? 'JWT',
  });
  jwt = setClaims(jwt);
  return jwt.sign(primary);
}

export type DualVerifyOk = { ok: true; payload: JWTPayload; verifiedBy: 'primary' | 'prior' };
export type DualVerifyFail = {
  ok: false;
  reason: 'missing_token' | 'malformed' | 'invalid_signature' | 'expired' | 'misconfigured';
  detail?: string;
};
export type DualVerifyResult = DualVerifyOk | DualVerifyFail;

/**
 * Verify a JWT against both primary and prior keys. The first
 * successful verify wins. Tries primary first (the more common case
 * in steady state), then prior (the rotation window).
 */
export async function verifyWithDual(
  config: DualSecretConfig,
  token: string,
  verifyOpts: Parameters<typeof jwtVerify>[2] = {},
): Promise<DualVerifyResult> {
  if (!token) return { ok: false, reason: 'missing_token' };
  const { primary, prior } = getActiveSigningKeys(config);

  // Primary first.
  try {
    const { payload } = await jwtVerify(token, primary, { clockTolerance: 5, ...verifyOpts });
    return { ok: true, payload: payload as JWTPayload, verifiedBy: 'primary' };
  } catch (primaryErr) {
    if (!prior) {
      return mapJoseError(primaryErr);
    }
    // Try prior.
    try {
      const { payload } = await jwtVerify(token, prior, { clockTolerance: 5, ...verifyOpts });
      return { ok: true, payload: payload as JWTPayload, verifiedBy: 'prior' };
    } catch (priorErr) {
      return mapJoseError(priorErr);
    }
  }
}

function mapJoseError(err: unknown): DualVerifyFail {
  if (err instanceof joseErrors.JWTExpired) return { ok: false, reason: 'expired' };
  if (err instanceof joseErrors.JWSSignatureVerificationFailed) return { ok: false, reason: 'invalid_signature' };
  if (err instanceof joseErrors.JWTInvalid) return { ok: false, reason: 'malformed' };
  return { ok: false, reason: 'misconfigured', detail: (err as Error).message };
}

// ─── Standard configs for the categories we use ────────────────────────────

export const SESSION_DUAL: DualSecretConfig = {
  primary: 'SESSION_SERVICE_SECRET',
  priorEnv: 'SESSION_SERVICE_SECRET_PRIOR',
  description: 'Session token signing key (primary + prior)',
  minLength: 32,
};

export const SERVICE_JWT_DUAL: DualSecretConfig = {
  primary: 'SERVICE_JWT_SECRET',
  priorEnv: 'SERVICE_JWT_SECRET_PRIOR',
  description: 'Service-to-service JWT signing key (primary + prior)',
  minLength: 64,
};

export const SAFETY_SERVICE_DUAL: DualSecretConfig = {
  primary: 'SAFETY_SERVICE_SECRET',
  priorEnv: 'SAFETY_SERVICE_SECRET_PRIOR',
  description: 'Safety service shared secret (primary + prior)',
  minLength: 32,
};

// ─── Stale-secret warning ──────────────────────────────────────────────────

/**
 * Returns the list of tracked secrets that are older than the
 * 90-day threshold. Used by instrumentation.ts on startup.
 */
export async function findStaleSigningSecrets(): Promise<Array<{ name: string; ageDays: number }>> {
  const names = [
    SESSION_DUAL.primary,
    SERVICE_JWT_DUAL.primary,
    SAFETY_SERVICE_DUAL.primary,
  ];
  const result: Array<{ name: string; ageDays: number }> = [];
  for (const name of names) {
    const age = await getSecretAgeDays(name);
    if (age !== null && age > STALE_THRESHOLD_DAYS) {
      result.push({ name, ageDays: age });
    }
  }
  return result;
}

/** Test helper: record a fake birth for a secret. */
export async function _forceRecordBirth(name: string, value: string): Promise<void> {
  await recordSecretBirth(name, value);
}
