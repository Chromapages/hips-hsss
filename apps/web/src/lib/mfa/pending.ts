/**
 * MFA pending token store — Layer 4.
 *
 * Used for:
 *  - Login flow: after Firebase auth, if user.mfaEnabled, issue a
 *    'login' pending token and redirect to /mfa-verify.
 *  - Enrollment: when the user submits the first TOTP code at /mfa-setup,
 *    issue an 'enrollment' pending token that the verify route consumes
 *    to actually flip mfaEnabled=true.
 *  - Sudo mode: issuing a short-lived sudo cookie for destructive actions.
 *
 * Tokens are stored in the MfaPendingToken Prisma table. The token
 * value sent to the client is a random 32-byte URL-safe string; we
 * store only its SHA-256 hash. Plaintext is never persisted.
 *
 * TTL: 5 minutes for login/enrollment, 15 minutes for sudo.
 * Single-use: the row is marked consumedAt on first use.
 */

import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export type MfaPendingPurpose = 'login' | 'enrollment' | 'sudo';

export type IssueOptions = {
  userId: string;
  purpose: MfaPendingPurpose;
  destination?: string;
  ttlSeconds?: number;
};

export type IssuedPendingToken = {
  token: string;       // plaintext, sent to client
  expiresAt: Date;
  tokenId: string;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a new pending token. The plaintext is returned to the caller
 * (e.g. to set as a cookie or include in a redirect URL). The DB stores
 * only the hash.
 */
export async function issuePendingToken(opts: IssueOptions): Promise<IssuedPendingToken> {
  const ttl = opts.ttlSeconds ?? 5 * 60;
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttl * 1000);

  const record = await prisma.mfaPendingToken.create({
    data: {
      userId: opts.userId,
      tokenHash,
      purpose: opts.purpose,
      ...(opts.destination ? { destination: opts.destination } : {}),
      expiresAt,
    },
    select: { id: true, expiresAt: true },
  });

  return { token, expiresAt: record.expiresAt, tokenId: record.id };
}

export type ConsumeResult =
  | { ok: true; userId: string; purpose: MfaPendingPurpose; destination: string | null }
  | { ok: false; reason: 'not_found' | 'expired' | 'already_consumed' };

/**
 * Look up a pending token by its plaintext, check expiry, and mark it
 * consumed. Atomic via a single UPDATE WHERE consumedAt IS NULL — no
 * double-use.
 */
export async function consumePendingToken(token: string): Promise<ConsumeResult> {
  if (!token) return { ok: false, reason: 'not_found' };
  const tokenHash = hashToken(token);

  // Step 1: fetch the record to check expiry first.
  const record = await prisma.mfaPendingToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      purpose: true,
      destination: true,
      expiresAt: true,
      consumedAt: true,
    },
  });

  if (!record) return { ok: false, reason: 'not_found' };
  if (record.consumedAt) return { ok: false, reason: 'already_consumed' };
  if (record.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: 'expired' };
  }

  // Step 2: atomic claim. If another request already consumed it between
  // step 1 and now, this returns 0 rows updated and we treat as already
  // consumed.
  const claimed = await prisma.mfaPendingToken.updateMany({
    where: { id: record.id, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  if (claimed.count === 0) return { ok: false, reason: 'already_consumed' };

  return {
    ok: true,
    userId: record.userId,
    purpose: record.purpose as MfaPendingPurpose,
    destination: record.destination,
  };
}

/**
 * Best-effort cleanup of expired pending tokens. Run on a cron or on
 * demand. Keeps the table small.
 */
export async function purgeExpiredPendingTokens(): Promise<number> {
  const result = await prisma.mfaPendingToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
