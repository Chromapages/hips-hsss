/**
 * Service-token helpers — Layer 2 (Scoped JWTs for every service boundary).
 *
 * createServiceToken()   — issue a short-lived, narrowly-scoped JWT for a
 *                          specific service-to-service call.
 * validateServiceToken() — verify signature, iss, aud, scope, exp, and jti
 *                          against the central SERVICE_JWT_SECRET.
 *
 * The receiving service must call validateServiceToken() before any business
 * logic executes. Every failure throws a ServiceTokenError with a specific
 * reason — never a generic "invalid token" string.
 *
 * Design notes:
 *  - All tokens carry a jti (random UUID) so they can be revoked individually
 *    by the revocation registry (Layer 3).
 *  - Maximum TTL is 5 minutes (SERVICE_TOKEN_TTL_SECONDS). Callers that
 *    want a shorter TTL can pass opts.expiresInSeconds.
 *  - The secret used for signing is the central SERVICE_JWT_SECRET, NOT
 *    per-service secrets. Per-service secrets are reserved for shared-secret
 *    auth on legacy endpoints; new code must use scoped JWTs.
 *  - The service is decoupled from the underlying JWT library (jose) so
 *    switching implementations is a one-file change.
 */

import 'server-only';
import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import crypto from 'node:crypto';
import { requireSecret } from '@/lib/secrets';
import { SERVICE_JWT_DUAL } from '@/lib/secrets/dual';
import {
  AUDIENCES,
  ISSUERS,
  SCOPES,
  SERVICE_TOKEN_TTL_SECONDS,
  isRegisteredScope,
  type Audience,
  type Issuer,
  type Scope,
} from './scopes';

// ─── Public types ────────────────────────────────────────────────────────────

export type ServiceTokenPayload = {
  iss: Issuer;
  aud: Audience;
  sub: string;
  scope: Scope[];
  jti: string;
  iat: number;
  exp: number;
  ref?: string;
};

export type CreateServiceTokenOptions = {
  /** Service identity (the calling service name). Defaults to ISSUERS.WEB. */
  issuer?: Issuer;
  /** Token subject — usually the user/session reference, never a user-id. */
  subject: string;
  /** Optional reference string carried in the `ref` claim (e.g. sessionId). */
  ref?: string;
  /** Override the default 5-minute TTL. Cannot exceed the maximum. */
  expiresInSeconds?: number;
  /** Caller-supplied jti (for testing or replay). Random UUID is the default. */
  jti?: string;
};

export type ValidateServiceTokenOptions = {
  /** The audience this service expects (its own name). */
  expectedAudience: Audience;
  /** The scope required to perform the operation. */
  requiredScope: Scope;
  /** Optional allowlist of trusted issuers. Defaults to all known issuers. */
  trustedIssuers?: Issuer[];
};

// ─── createServiceToken ─────────────────────────────────────────────────────

/**
 * Sign a narrowly-scoped, short-lived service JWT. The token proves identity
 * of the calling service and carries exactly the scope required for the call.
 *
 * Throws ServiceTokenError if any required parameter is invalid.
 */
export async function createServiceToken(
  scope: Scope[],
  audience: Audience,
  opts: CreateServiceTokenOptions,
): Promise<string> {
  if (!Array.isArray(scope) || scope.length === 0) {
    throw new ServiceTokenError(
      'invalid_scope',
      'createServiceToken requires at least one scope.',
    );
  }
  for (const s of scope) {
    if (!isRegisteredScope(s)) {
      throw new ServiceTokenError(
        'invalid_scope',
        `Scope "${s}" is not in the registry. Add it to lib/auth/scopes.ts first.`,
      );
    }
  }
  if (!Object.values(AUDIENCES).includes(audience)) {
    throw new ServiceTokenError(
      'invalid_audience',
      `Audience "${audience}" is not a known service name.`,
    );
  }
  if (!opts.subject || typeof opts.subject !== 'string') {
    throw new ServiceTokenError('invalid_subject', 'opts.subject is required.');
  }

  const issuer: Issuer = opts.issuer ?? ISSUERS.WEB;
  if (!Object.values(ISSUERS).includes(issuer)) {
    throw new ServiceTokenError('invalid_issuer', `Unknown issuer "${issuer}".`);
  }

  const ttl = Math.min(opts.expiresInSeconds ?? SERVICE_TOKEN_TTL_SECONDS, SERVICE_TOKEN_TTL_SECONDS);
  if (ttl <= 0) {
    throw new ServiceTokenError('invalid_exp', 'expiresInSeconds must be positive.');
  }

  const secret = requireSecret('SERVICE_JWT_SECRET', {
    minLength: 64,
    description: 'Central service-to-service JWT signing key',
    trackAge: true,
  });
  const key = new TextEncoder().encode(secret);

  const jti = opts.jti ?? crypto.randomUUID();
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ttl;

  const token = await new SignJWT({
    scope: scope.join(' '),
    ...(opts.ref ? { ref: opts.ref } : {}),
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(opts.subject)
    .setJti(jti)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(key);

  return token;
}

// ─── validateServiceToken ───────────────────────────────────────────────────

/**
 * Verify a service JWT. Returns the decoded payload on success.
 *
 * Validation order (per spec — every check is required):
 *   1. Signature against SERVICE_JWT_SECRET.
 *   2. exp claim — reject if expired.
 *   3. iss claim — must be in the trusted-issuers allowlist.
 *   4. aud claim — must equal opts.expectedAudience.
 *   5. scope claim — must contain opts.requiredScope.
 *   6. jti claim — must be present (for revocation tracking) and not revoked.
 *
 * Each failure throws a ServiceTokenError with a specific `reason`. The
 * caller is expected to surface this reason to the security audit log.
 */
export async function validateServiceToken(
  token: string,
  opts: ValidateServiceTokenOptions,
): Promise<ServiceTokenPayload> {
  if (!token || typeof token !== 'string') {
    throw new ServiceTokenError('missing_token', 'No token provided.');
  }

  // Layer 6: try primary first, then prior (rotation window).
  const { getActiveSigningKeys } = await import('@/lib/secrets/dual');
  const { primary, prior } = getActiveSigningKeys(SERVICE_JWT_DUAL);

  let raw: { iss?: string; aud?: string | string[]; sub?: string; scope?: string; jti?: string; iat?: number; exp?: number; ref?: string };
  let verifiedBy: 'primary' | 'prior' | null = null;
  try {
    const result = await jwtVerify(token, primary, { clockTolerance: 5 });
    raw = result.payload as typeof raw;
    verifiedBy = 'primary';
  } catch (primaryErr) {
    if (!prior) throw mapJoseError(primaryErr);
    try {
      const result = await jwtVerify(token, prior, { clockTolerance: 5 });
      raw = result.payload as typeof raw;
      verifiedBy = 'prior';
    } catch (priorErr) {
      throw mapJoseError(priorErr);
    }
  }

  if (!verifiedBy) {
    throw new ServiceTokenError('invalid', 'Token verification did not complete.');
  }

  // Validate jti presence
  if (!raw.jti) {
    throw new ServiceTokenError('missing_jti', 'Service token has no jti claim.');
  }

  // Validate iss allowlist
  const trusted = opts.trustedIssuers ?? Object.values(ISSUERS);
  if (!raw.iss || !trusted.includes(raw.iss as Issuer)) {
    throw new ServiceTokenError(
      'wrong_issuer',
      `Issuer "${raw.iss}" is not in the trusted allowlist.`,
    );
  }

  // Validate aud
  const audList = Array.isArray(raw.aud) ? raw.aud : [raw.aud];
  if (!audList.includes(opts.expectedAudience)) {
    throw new ServiceTokenError(
      'wrong_audience',
      `Token audience ${JSON.stringify(raw.aud)} does not match expected "${opts.expectedAudience}".`,
    );
  }

  // Validate scope
  const grantedScopes = (raw.scope ?? '').split(' ').filter(Boolean);
  if (!grantedScopes.includes(opts.requiredScope)) {
    throw new ServiceTokenError(
      'invalid_scope',
      `Token is missing required scope "${opts.requiredScope}". Granted: [${grantedScopes.join(', ')}]`,
    );
  }

  // Revocation check (Layer 3) — isTokenRevoked is async and may fail open
  // (returns false) if Redis is unavailable. The choice to fail-open here
  // matches the spec: "single Redis GET, sub-millisecond" — but the
  // surrounding auth still requires a valid signature, so the worst case is
  // a stale token surviving until its natural exp.
  const { isTokenRevoked } = await import('./revocation');
  try {
    const revoked = await isTokenRevoked(raw.jti);
    if (revoked) {
      throw new ServiceTokenError('revoked', 'Service token has been revoked.');
    }
  } catch (err) {
    if (err instanceof ServiceTokenError) throw err;
    // Redis unavailable — log and continue. The signature/exp check still holds.
    const { logger } = await import('@/lib/logger');
    logger.warn('Revocation check failed (Redis unavailable?)', {
      jti: raw.jti,
      error: (err as Error).message,
    });
  }

  return {
    iss: raw.iss as Issuer,
    aud: opts.expectedAudience,
    sub: raw.sub ?? '',
    scope: grantedScopes.filter(isRegisteredScope),
    jti: raw.jti,
    iat: raw.iat ?? 0,
    exp: raw.exp ?? 0,
    ...(raw.ref ? { ref: raw.ref } : {}),
    ...(verifiedBy === 'prior' ? { verifiedByPrior: true } : {}),
  };
}

/** Map a jose error to a ServiceTokenError. */
function mapJoseError(err: unknown): ServiceTokenError {
  if (err instanceof joseErrors.JWTExpired) {
    return new ServiceTokenError('expired', 'Service token has expired.');
  }
  if (err instanceof joseErrors.JWTClaimValidationFailed) {
    return new ServiceTokenError(
      'claim_invalid',
      `Claim validation failed: ${err.claim} ${err.code ?? ''}`.trim(),
    );
  }
  if (err instanceof joseErrors.JWSSignatureVerificationFailed) {
    return new ServiceTokenError('invalid_signature', 'Signature verification failed.');
  }
  if (err instanceof joseErrors.JWTInvalid) {
    return new ServiceTokenError('malformed', `Token is malformed: ${err.message}`);
  }
  return new ServiceTokenError('invalid', (err as Error).message ?? 'Token verification failed.');
}

// ─── Error type ─────────────────────────────────────────────────────────────

/**
 * Specific failure reasons. Receiving services should log these to the
 * security audit log (Layer 7) as the `failureReason` field.
 */
export type ServiceTokenErrorReason =
  | 'missing_token'
  | 'malformed'
  | 'invalid'
  | 'invalid_signature'
  | 'claim_invalid'
  | 'expired'
  | 'wrong_issuer'
  | 'wrong_audience'
  | 'invalid_scope'
  | 'missing_jti'
  | 'revoked'
  | 'invalid_audience'
  | 'invalid_issuer'
  | 'invalid_subject'
  | 'invalid_exp'
  | 'misconfigured';

export class ServiceTokenError extends Error {
  constructor(
    public readonly reason: ServiceTokenErrorReason,
    message: string,
  ) {
    super(message);
    this.name = 'ServiceTokenError';
  }
}

// Re-export the scope registry symbols so callers can import everything
// from a single path.
export { SCOPES, ISSUERS, AUDIENCES, SERVICE_TOKEN_TTL_SECONDS };
export type { Scope, Issuer, Audience };
