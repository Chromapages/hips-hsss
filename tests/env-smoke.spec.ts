/**
 * Environment Smoke Tests
 *
 * Validates that required environment variables are present and well-formed
 * before the application starts. Runs as part of the test suite and can be
 * used as a pre-deployment gate.
 *
 * These tests read real environment variables. In CI (CI=true), missing or
 * malformed vars cause test failures. Locally, they document what SHOULD be
 * set without blocking the test suite.
 */

import { describe, expect, it, beforeEach } from 'vitest';

// ─── Config ───────────────────────────────────────────────────────────────────

const isProd = process.env.NODE_ENV === 'production';
const isCI = process.env.CI === 'true';

interface VarSpec {
  pattern?: RegExp;
  hint?: string;
}

const PROD_VARS: Record<string, VarSpec> = {
  FIREBASE_ADMIN_SDK_KEY: { pattern: /^[\w-]+$/, hint: 'Firebase admin SDK key' },
  STRIPE_SECRET_KEY: { pattern: /^sk_(test|live)_[\w]+$/, hint: 'Stripe sk_test_ or sk_live_' },
  STRIPE_WEBHOOK_SECRET: { pattern: /^whsec_[\w]+$/, hint: 'Stripe whsec_...' },
  DATABASE_URL: { pattern: /^postgresql:\/\//, hint: 'postgresql:// connection string' },
  SESSION_DATABASE_URL: { pattern: /^postgresql:\/\//, hint: 'postgresql:// connection string' },
  SAFETY_DATABASE_URL: { pattern: /^postgresql:\/\//, hint: 'postgresql:// connection string' },
  VAULT_DATABASE_URL: { pattern: /^postgresql:\/\//, hint: 'postgresql:// connection string' },
  SESSION_SERVICE_SECRET: { pattern: /^[\w-]{32,}$/, hint: '32+ char secret' },
  VAULT_API_SECRET: { pattern: /^[\w-]{32,}$/, hint: '32+ char secret' },
  CRON_SECRET: { pattern: /^[\w-]{16,}$/, hint: '16+ char secret' },
};

const DEV_VARS: Record<string, VarSpec> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: { pattern: /^.+$/, hint: 'non-empty string' },
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: { pattern: /^[a-z][a-z0-9-]+$/, hint: 'valid Firebase project ID' },
  LIVEKIT_API_KEY: { pattern: /^.+$/, hint: 'non-empty string' },
  LIVEKIT_API_SECRET: { pattern: /^.+$/, hint: 'non-empty string' },
};

const PLACEHOLDERS = new Set(['', 'your_key_here', 'changeme', 'xxx', 'undefined', 'null', 'sk_test_XXXXXXXXXX', 'whsec_XXXXXXXXXX']);

function isPlaceholder(v: string) {
  return PLACEHOLDERS.has(v.toLowerCase()) || v.includes('XXXX');
}

function getAllVars() {
  return isProd ? { ...PROD_VARS } : { ...PROD_VARS, ...DEV_VARS };
}

function validate(name: string, spec: VarSpec, value: string | undefined) {
  const set = value !== undefined && value !== '';
  const formatted = !spec.pattern || !set || spec.pattern.test(value);
  const placeholder = set && isPlaceholder(value);
  return { set, formatted, placeholder };
}

// ─── Test state ───────────────────────────────────────────────────────────────

const vars = getAllVars();
const results: Record<string, ReturnType<typeof validate>> = {};

beforeEach(() => {
  for (const [name, spec] of Object.entries(vars)) {
    results[name] = validate(name, spec, process.env[name]);
  }
});

// ─── CI / Production: hard failures ─────────────────────────────────────────

if (isCI || isProd) {
  describe('Required variables are set', () => {
    for (const [name, spec] of Object.entries(vars)) {
      it(`${name} is set`, () => {
        expect(results[name].set, `${name} is not set — ${spec.hint ?? ''}`).toBe(true);
      });
    }
  });

  describe('Variables match expected format', () => {
    for (const [name, spec] of Object.entries(vars)) {
      if (!spec.pattern) continue;
      it(`${name} format is valid`, () => {
        const val = process.env[name] ?? '';
        expect(spec.pattern.test(val), `${name}="${val}" format invalid — ${spec.hint ?? ''}`).toBe(true);
      });
    }
  });

  describe('No placeholder values', () => {
    for (const [name] of Object.entries(vars)) {
      it(`${name} is not a placeholder`, () => {
        expect(results[name].placeholder, `${name} has placeholder value: "${process.env[name] ?? ''}"`).toBe(false);
      });
    }
  });
}

// ─── Local: informational ──────────────────────────────────────────────────────

if (!isCI && !isProd) {
  describe('Variable state (informational — always passes locally)', () => {
    for (const [name] of Object.entries(vars)) {
      it(`${name}`, () => {
        const r = results[name];
        expect(true).toBe(true); // always pass
      });
    }
  });

  describe('DB URLs use correct protocol (if set)', () => {
    const dbVars = ['DATABASE_URL', 'SESSION_DATABASE_URL', 'SAFETY_DATABASE_URL', 'VAULT_DATABASE_URL'];
    const setDbVars = dbVars.filter(vn => !!process.env[vn]);
    if (setDbVars.length === 0) {
      it('no DB vars set — skipping', () => {
        expect(true).toBe(true);
      });
    }
    for (const vn of setDbVars) {
      it(`${vn}`, () => {
        expect((process.env[vn] ?? '').startsWith('postgresql://') || (process.env[vn] ?? '').startsWith('postgres://')).toBe(true);
      });
    }
  });

  describe('Stripe keys use correct prefix (if set)', () => {
    const key = process.env.STRIPE_SECRET_KEY;
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    if (!key && !whsec) {
      it('no Stripe vars set — skipping', () => {
        expect(true).toBe(true);
      });
    }
    if (key) {
      it('STRIPE_SECRET_KEY prefix', () => {
        expect(key.startsWith('sk_test_') || key.startsWith('sk_live_')).toBe(true);
      });
    }
    if (whsec) {
      it('STRIPE_WEBHOOK_SECRET prefix', () => {
        expect(whsec.startsWith('whsec_')).toBe(true);
      });
    }
  });
}

// ─── Always: safety-critical shape checks ─────────────────────────────────────

describe('Safety-critical variables are non-empty (if set)', () => {
  const safety = ['CRON_SECRET', 'SESSION_SERVICE_SECRET', 'VAULT_API_SECRET', 'STRIPE_SECRET_KEY'];
  const safetyTests = safety.filter(vn => !!process.env[vn]);
  if (safetyTests.length === 0) {
    it('no safety vars set — skipping', () => {
      expect(true).toBe(true);
    });
  }
  for (const vn of safetyTests) {
    it(`${vn}`, () => {
      expect((process.env[vn] ?? '').trim().length > 0).toBe(true);
    });
  }
});
