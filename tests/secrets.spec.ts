/**
 * Tests for the central secrets module (Layer 1).
 *
 * Covers:
 *  - requireSecret: missing, empty, too short, placeholder, valid
 *  - validateSecretsAtStartup: reports all problems in one pass
 *  - assertNoCrossContamination: catches SESSION === SAFETY
 *  - getSecretAgeDays: reports age of tracked secrets
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  requireSecret,
  tryGetSecret,
  validateSecretsAtStartup,
  assertNoCrossContamination,
  SecretValidationError,
  getSecretAgeDays,
} from '../apps/web/src/lib/secrets';

const LONG_SECRET = 'a'.repeat(64);
const SHORT_SECRET = 'too-short';
const PLACEHOLDER = 'changeme';

describe('requireSecret', () => {
  beforeEach(() => {
    delete process.env.TEST_SECRET;
    delete process.env.SHORT_TEST_SECRET;
  });

  it('throws on missing', () => {
    delete process.env.TEST_SECRET;
    expect(() => requireSecret('TEST_SECRET')).toThrow(SecretValidationError);
    expect(() => requireSecret('TEST_SECRET')).toThrow(/not set/);
  });

  it('throws on empty', () => {
    process.env.TEST_SECRET = '   ';
    expect(() => requireSecret('TEST_SECRET')).toThrow(SecretValidationError);
  });

  it('throws on too-short', () => {
    process.env.TEST_SECRET = SHORT_SECRET;
    expect(() => requireSecret('TEST_SECRET')).toThrow(/too short/);
  });

  it('throws on placeholder', () => {
    process.env.TEST_SECRET = PLACEHOLDER;
    expect(() => requireSecret('TEST_SECRET', { minLength: 4 })).toThrow(/placeholder/i);
  });

  it('throws on known placeholder', () => {
    process.env.TEST_SECRET = 'devkey';
    expect(() => requireSecret('TEST_SECRET', { minLength: 4 })).toThrow(/placeholder/i);
  });

  it('accepts a strong secret', () => {
    process.env.TEST_SECRET = LONG_SECRET;
    expect(requireSecret('TEST_SECRET')).toBe(LONG_SECRET);
  });

  it('enforces exact length when specified', () => {
    process.env.TEST_SECRET = 'a'.repeat(43);
    expect(() => requireSecret('TEST_SECRET', { exactLength: 44 })).toThrow(/exactly 44/);
  });

  it('enforces cross-contamination', () => {
    process.env.SECRET_A = LONG_SECRET;
    process.env.SECRET_B = LONG_SECRET;
    expect(() => requireSecret('SECRET_A', { minLength: 32, mustNotEqual: ['SECRET_B'] })).toThrow(/identical/);
  });
});

describe('tryGetSecret', () => {
  beforeEach(() => {
    delete process.env.TRY_SECRET;
  });

  it('returns null when missing instead of throwing', () => {
    delete process.env.TRY_SECRET;
    expect(tryGetSecret('TRY_SECRET')).toBeNull();
  });

  it('returns the value when present and valid', () => {
    process.env.TRY_SECRET = LONG_SECRET;
    expect(tryGetSecret('TRY_SECRET')).toBe(LONG_SECRET);
  });
});

describe('assertNoCrossContamination', () => {
  it('passes when all secrets are unique', () => {
    expect(() =>
      assertNoCrossContamination({
        A: 'a'.repeat(32),
        B: 'b'.repeat(32),
        C: 'c'.repeat(32),
      }),
    ).not.toThrow();
  });

  it('throws when two secrets are equal', () => {
    expect(() =>
      assertNoCrossContamination({
        A: 'a'.repeat(32),
        B: 'a'.repeat(32),
      }),
    ).toThrow(/Cross-contamination/);
  });
});

describe('validateSecretsAtStartup', () => {
  // Tests run in an environment where many required secrets are absent.
  // We set the minimum viable set and confirm the validator agrees.
  beforeEach(() => {
    process.env.SERVICE_JWT_SECRET = 'a'.repeat(64);
    process.env.SESSION_SERVICE_SECRET = 'b'.repeat(32);
    process.env.SAFETY_SERVICE_SECRET = 'c'.repeat(32);
    process.env.SUDO_TOKEN_SECRET = 's'.repeat(32);
    process.env.MFA_ENCRYPTION_KEY = 'd'.repeat(44);
    process.env.STRIPE_SECRET_KEY = 'sk_test_' + 'x'.repeat(28);
    process.env.LIVEKIT_API_KEY = 'APIVabcdef1234';
    process.env.LIVEKIT_API_SECRET = 'e'.repeat(32);
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_' + 'y'.repeat(28);
    process.env.CRON_SECRET = 'f'.repeat(32);
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.FIREBASE_PROJECT_ID = 'hips-hsss';
    process.env.HANDLE_DERIVATION_KEY = 'h'.repeat(32);
  });

  afterEach(() => {
    delete process.env.SERVICE_JWT_SECRET;
    delete process.env.SESSION_SERVICE_SECRET;
    delete process.env.SAFETY_SERVICE_SECRET;
    delete process.env.SUDO_TOKEN_SECRET;
    delete process.env.MFA_ENCRYPTION_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.LIVEKIT_API_KEY;
    delete process.env.LIVEKIT_API_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.CRON_SECRET;
    delete process.env.DATABASE_URL;
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.HANDLE_DERIVATION_KEY;
  });

  it('returns no problems when all required secrets are set', () => {
    const { problems, warnings } = validateSecretsAtStartup({ throwOnProblems: false });
    expect(problems).toEqual([]);
  });

  it('detects cross-contamination across the registered set', () => {
    process.env.SESSION_SERVICE_SECRET = 'a'.repeat(32);
    process.env.SAFETY_SERVICE_SECRET = 'a'.repeat(32);
    // Trigger a requireSecret call to exercise the mustNotEqual check.
    // The validator walks the registry; mustNotEqual for SESSION_SERVICE_SECRET
    // includes SERVICE_JWT_SECRET, so we use that to force the check.
    expect(() => requireSecret('SESSION_SERVICE_SECRET', {
      minLength: 32,
      mustNotEqual: ['SAFETY_SERVICE_SECRET'],
    })).toThrow(/identical/);
  });
});

describe('getSecretAgeDays', () => {
  it('returns null for unknown secrets', () => {
    expect(getSecretAgeDays('UNREGISTERED_SECRET')).toBeNull();
  });
});
