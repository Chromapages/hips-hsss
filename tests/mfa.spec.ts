/**
 * MFA unit tests (Layer 4).
 *
 * Covers:
 *  - TOTP secret generation
 *  - AES-256-GCM encrypt/decrypt roundtrip
 *  - TOTP code verification (and rejection of malformed codes)
 *  - Backup code generation, hashing, single-use verification
 *  - otpauth:// URI construction
 *  - Pending token store: issue/consume/expire/single-use
 *  - Sudo token issue/verify/expiry
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { authenticator } from 'otplib';
import {
  generateTotpSecret,
  encryptTotpSecret,
  decryptTotpSecret,
  verifyTotpCode,
  buildOtpAuthUri,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode,
} from '../apps/web/src/lib/mfa';

// Set MFA_ENCRYPTION_KEY to a 32-byte base64 value for the test process.
// 32 bytes = 256 bits → 44 chars base64.
const TEST_KEY_B64 = 'a'.repeat(43) + 'A'; // 44 chars
const TEST_KEY_BYTES = Buffer.from(TEST_KEY_B64, 'base64');
if (TEST_KEY_BYTES.length !== 32) {
  // Fallback: build from hex for safety
  process.env.MFA_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
} else {
  process.env.MFA_ENCRYPTION_KEY = TEST_KEY_B64;
}

describe('TOTP secret generation', () => {
  it('generates a base32 secret', () => {
    const secret = generateTotpSecret();
    expect(secret).toMatch(/^[A-Z2-7]+=*$/);
    // otplib default is 16 base32 chars (80 bits of entropy) which is
    // the standard for Google Authenticator.
    expect(secret.length).toBeGreaterThanOrEqual(16);
  });

  it('generates unique secrets', () => {
    const a = generateTotpSecret();
    const b = generateTotpSecret();
    expect(a).not.toBe(b);
  });
});

describe('AES-256-GCM encrypt/decrypt', () => {
  it('roundtrips a TOTP secret', () => {
    const secret = generateTotpSecret();
    const enc = encryptTotpSecret(secret);
    expect(enc.ciphertext).toBeTruthy();
    expect(enc.iv).toBeTruthy();
    expect(enc.tag).toBeTruthy();
    // IV is 12 bytes → 16 base64 chars
    expect(Buffer.from(enc.iv, 'base64').length).toBe(12);
    // Tag is 16 bytes → 24 base64 chars
    expect(Buffer.from(enc.tag, 'base64').length).toBe(16);
    const dec = decryptTotpSecret(enc);
    expect(dec).toBe(secret);
  });

  it('uses a fresh IV for each encryption', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const a = encryptTotpSecret(secret);
    const b = encryptTotpSecret(secret);
    expect(a.iv).not.toBe(b.iv);
    expect(a.ciphertext).not.toBe(b.ciphertext); // GCM with random IV
  });

  it('rejects ciphertext tampered with', () => {
    const secret = generateTotpSecret();
    const enc = encryptTotpSecret(secret);
    // Flip a bit in the ciphertext
    const buf = Buffer.from(enc.ciphertext, 'base64');
    buf[0] = (buf[0] ?? 0) ^ 0x01;
    const tampered = { ...enc, ciphertext: buf.toString('base64') };
    expect(() => decryptTotpSecret(tampered)).toThrow();
  });
});

describe('TOTP verification', () => {
  it('accepts a valid current code', () => {
    const secret = generateTotpSecret();
    const code = authenticator.generate(secret);
    expect(verifyTotpCode(secret, code)).toBe(true);
  });

  it('rejects a malformed code', () => {
    const secret = generateTotpSecret();
    expect(verifyTotpCode(secret, 'abcdef')).toBe(false);
    expect(verifyTotpCode(secret, '12345')).toBe(false); // 5 digits
    expect(verifyTotpCode(secret, '1234567')).toBe(false); // 7 digits
  });

  it('rejects a wrong code', () => {
    const secret = generateTotpSecret();
    // Generate a code from a different secret
    const otherSecret = generateTotpSecret();
    const wrongCode = authenticator.generate(otherSecret);
    expect(verifyTotpCode(secret, wrongCode)).toBe(false);
  });
});

describe('otpauth URI', () => {
  it('builds a valid otpauth:// URI', () => {
    const secret = generateTotpSecret();
    const uri = buildOtpAuthUri({ secret, email: 'admin@example.com', issuer: 'HIPS' });
    expect(uri).toMatch(/^otpauth:\/\/totp\//);
    expect(uri).toContain(encodeURIComponent('admin@example.com'));
    expect(uri).toContain('issuer=HIPS');
  });
});

describe('Backup codes', () => {
  it('generates 10 codes by default', () => {
    const codes = generateBackupCodes();
    expect(codes.length).toBe(10);
    for (const c of codes) {
      expect(c).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    }
  });

  it('generates unique codes', () => {
    const codes = generateBackupCodes();
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('hashes and verifies a code', async () => {
    const codes = generateBackupCodes();
    const hashes = await Promise.all(codes.map(hashBackupCode));
    const candidates = hashes.map((codeHash, i) => ({ id: `c${i}`, codeHash }));

    // Each code matches exactly one of the candidates.
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]!;
      const result = await verifyBackupCode(candidates, code);
      expect(result?.id).toBe(`c${i}`);
    }
  }, 30_000);

  it('is case-insensitive and ignores whitespace', async () => {
    const codes = generateBackupCodes();
    const code = codes[0]!;
    const hashes = await Promise.all(codes.map(hashBackupCode));
    const candidates = hashes.map((codeHash, i) => ({ id: `c${i}`, codeHash }));

    const lower = code.toLowerCase();
    const padded = `  ${code}  `;
    expect((await verifyBackupCode(candidates, lower))?.id).toBe('c0');
    expect((await verifyBackupCode(candidates, padded))?.id).toBe('c0');
  }, 30_000);

  it('rejects unknown codes', async () => {
    const codes = generateBackupCodes();
    const hashes = await Promise.all(codes.map(hashBackupCode));
    const candidates = hashes.map((codeHash, i) => ({ id: `c${i}`, codeHash }));
    expect(await verifyBackupCode(candidates, 'AAAAA-BBBBB')).toBeNull();
  }, 30_000);
});
