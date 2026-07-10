/**
 * MFA core library — Layer 4.
 *
 * Provides:
 *  - TOTP secret generation (RFC 6238, 160 bits, base32)
 *  - AES-256-GCM encryption / decryption of the TOTP secret at rest
 *  - TOTP code verification with a 1-step window (±30s tolerance)
 *  - Backup code generation, bcrypt hashing, and single-use verification
 *  - otpauth:// URI construction for QR codes
 *
 * Storage contract (set in the Prisma migration):
 *   User.mfaSecretEnc  — base64 ciphertext
 *   User.mfaSecretIv   — base64 12-byte IV
 *   User.mfaSecretTag  — base64 16-byte GCM auth tag
 *
 * The encryption key is MFA_ENCRYPTION_KEY (32 raw bytes, base64-encoded to
 * 44 chars). The key is required at startup and is asserted by lib/secrets.ts.
 */

import 'server-only';
import { authenticator } from 'otplib';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { requireSecret, tryGetSecret } from '@/lib/secrets';

// ─── TOTP configuration ────────────────────────────────────────────────────

/** 30-second time-step. Standard for TOTP (RFC 6238). */
authenticator.options = {
  step: 30,
  window: 1, // accept current step ±1 (30s either side)
};

// ─── Secret generation ─────────────────────────────────────────────────────

/**
 * Generate a fresh TOTP secret. The result is a base32 string (160 bits of
 * entropy) suitable for use with Google Authenticator, Authy, 1Password,
 * and any other RFC 6238 client.
 */
export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

// ─── Encryption (AES-256-GCM) ──────────────────────────────────────────────

export type EncryptedSecret = {
  ciphertext: string; // base64
  iv: string;         // base64
  tag: string;        // base64
};

/**
 * Encrypt a TOTP secret with AES-256-GCM. The output is base64-encoded
 * for safe storage in a TEXT column.
 */
export function encryptTotpSecret(plaintext: string): EncryptedSecret {
  const keyB64 = requireSecret('MFA_ENCRYPTION_KEY', {
    exactLength: 44,
    description: 'AES-256-GCM key for MFA secret encryption (32 raw bytes → 44 base64 chars)',
  });
  const key = Buffer.from(keyB64, 'base64');
  if (key.length !== 32) {
    throw new Error('MFA_ENCRYPTION_KEY must decode to 32 bytes (256 bits)');
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: enc.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

/**
 * Decrypt a TOTP secret. Throws on auth-tag mismatch (key wrong, or
 * ciphertext tampered).
 *
 * Layer 6: tries MFA_ENCRYPTION_KEY first, then MFA_ENCRYPTION_KEY_PRIOR
 * during the rotation window. This is critical because old TOTP
 * secrets are persisted under the prior key — if a user enrolled MFA
 * 6 months ago and we rotate the key today, that user's stored
 * secret must still be decryptable until they next log in (at which
 * point we re-encrypt under the new key on the next successful verify).
 */
export function decryptTotpSecret(enc: EncryptedSecret): string {
  const primaryB64 = tryGetSecret('MFA_ENCRYPTION_KEY', { exactLength: 44 });
  if (!primaryB64) {
    throw new Error('MFA_ENCRYPTION_KEY is not set');
  }
  const priorB64 = tryGetSecret('MFA_ENCRYPTION_KEY_PRIOR', { exactLength: 44 });

  const candidates: string[] = [primaryB64];
  if (priorB64 && priorB64 !== primaryB64) candidates.push(priorB64);

  let lastError: Error | null = null;
  for (const keyB64 of candidates) {
    const key = Buffer.from(keyB64, 'base64');
    if (key.length !== 32) {
      lastError = new Error('MFA_ENCRYPTION_KEY must decode to 32 bytes (256 bits)');
      continue;
    }
    try {
      const iv = Buffer.from(enc.iv, 'base64');
      const tag = Buffer.from(enc.tag, 'base64');
      const ciphertext = Buffer.from(enc.ciphertext, 'base64');
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(tag);
      const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      return dec.toString('utf8');
    } catch (err) {
      lastError = err as Error;
      // Try the next candidate.
    }
  }
  throw lastError ?? new Error('MFA_ENCRYPTION_KEY decryption failed');
}

// ─── TOTP verification ─────────────────────────────────────────────────────

/**
 * Verify a 6-digit TOTP code against the user's secret. Returns true only
 * if the code is valid for the current time-step (with ±1 step tolerance).
 *
 * Replay protection: callers should mark the code used by tracking
 * lastMfaVerifiedAt — the spec accepts a 1-step window but codes do not
 * need to be tracked individually (the time-step is short).
 */
export function verifyTotpCode(plaintextSecret: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  try {
    return authenticator.verify({ token: code, secret: plaintextSecret });
  } catch {
    return false;
  }
}

// ─── otpauth:// URI ─────────────────────────────────────────────────────────

/**
 * Construct the otpauth:// URI that QR codes encode. The label format
 * `HIPS:<email>` is the standard for Google Authenticator, Authy, and
 * 1Password.
 */
export function buildOtpAuthUri(opts: {
  secret: string;
  email: string;
  issuer?: string;
}): string {
  return authenticator.keyuri(
    opts.email,
    opts.issuer ?? 'HIPS',
    opts.secret,
  );
}

// ─── Backup codes ──────────────────────────────────────────────────────────

const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_LENGTH = 10; // 10 chars per code
const BCRYPT_ROUNDS = 10;

/**
 * Generate a set of fresh backup codes. Each is a 10-character alphanumeric
 * string (avoiding 0/O/1/I/l to keep them readable when transcribed).
 *
 * Returns plaintext codes — the caller must display them once to the user
 * AND immediately hash + store them. Plaintext is never persisted.
 */
export function generateBackupCodes(): string[] {
  const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0, O, 1, I, l
  const codes: string[] = [];
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    let code = '';
    const bytes = randomBytes(BACKUP_CODE_LENGTH);
    for (let j = 0; j < BACKUP_CODE_LENGTH; j++) {
      const b = bytes[j] ?? 0;
      code += ALPHABET[b % ALPHABET.length];
    }
    // Insert a dash every 5 chars for readability: "ABCDE-FGHJK"
    code = `${code.slice(0, 5)}-${code.slice(5)}`;
    codes.push(code);
  }
  return codes;
}

/**
 * Hash a backup code for storage. Bcrypt with cost 10 (~80ms) is fine —
 * codes are short and rate-limited, but the hash cost should still be
 * non-trivial so an attacker who reads the DB can't easily recover codes.
 */
export function hashBackupCode(code: string): Promise<string> {
  const normalized = code.trim().toUpperCase();
  return bcrypt.hash(normalized, BCRYPT_ROUNDS);
}

/**
 * Verify a backup code against one of the stored hashes. Returns the id
 * of the matching code record (so the caller can mark it used) or null.
 *
 * Important: codes are case-insensitive. Whitespace is stripped.
 */
export async function verifyBackupCode(
  candidates: Array<{ id: string; codeHash: string }>,
  code: string,
): Promise<{ id: string } | null> {
  const normalized = code.trim().toUpperCase();
  for (const candidate of candidates) {
    // bcrypt.compare is constant-time per candidate but the loop short-circuits.
    // Acceptable: the candidate list is at most 10 entries, and an attacker
    // who has the hashes can already bypass this code path by reading the DB.
    if (await bcrypt.compare(normalized, candidate.codeHash)) {
      return { id: candidate.id };
    }
  }
  return null;
}
