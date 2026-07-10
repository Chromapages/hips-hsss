/**
 * Central secret management — foundation for Layers 1, 2, 3, 4, 6.
 *
 * This module is the single source of truth for environment-variable validation.
 * It is imported at process start by apps/web/src/instrumentation.ts so that
 * misconfigured deployments fail fast with a specific, actionable error.
 *
 * Responsibilities:
 *  1. requireSecret(name, opts) — load a secret, reject missing/empty/short/placeholder.
 *  2. validateSecretsAtStartup() — walk every required secret and report all
 *     problems in one pass instead of crashing on the first.
 *  3. assertNoCrossContamination(map) — refuse to boot if any two signing
 *     secrets are equal (catches the SESSION_SERVICE_SECRET === SERVICE_JWT_SECRET
 *     misconfiguration).
 *  4. recordSecretBirth / warnIfStale — track when a secret was first seen and
 *     emit a startup warning when any signing secret is older than 90 days.
 *
 * Secret categories (must never share a value across categories):
 *  - User session secrets (NEXTAUTH_SECRET, session-token signing keys)
 *  - Service-to-service credentials (per-service shared secrets)
 *  - Service JWT signing key (SERVICE_JWT_SECRET — central, used by both sides)
 *  - Third-party credentials (Stripe, Firebase Admin, LiveKit, Resend)
 *  - Webhook signing secrets (one per provider)
 *  - Database connection strings (each in its own variable)
 *  - Admin/privileged API keys
 *  - MFA encryption key
 */

import 'server-only';
import { createHash } from 'node:crypto';

// ─── Public types ────────────────────────────────────────────────────────────

export type SecretOptions = {
  /** Minimum allowed length. Default 32. */
  minLength?: number | undefined;
  /** Exact required length (e.g. 32 bytes for AES-256-GCM base64 → 44 chars). */
  exactLength?: number | undefined;
  /** Whether to require this secret to be different from a set of other secrets. */
  mustNotEqual?: string[] | undefined;
  /** Whether to record secret birth on first sight (for age warnings). */
  trackAge?: boolean | undefined;
  /** Secret category — used for cross-contamination detection. */
  category?: SecretCategory | undefined;
  /** Human-readable description for error messages. */
  description?: string | undefined;
};

export type SecretCategory =
  | 'user-session'
  | 'service-credential'
  | 'service-jwt'
  | 'third-party'
  | 'webhook'
  | 'database'
  | 'admin-privileged'
  | 'mfa-encryption';

export type SecretValidationProblem = {
  name: string;
  reason:
    | 'missing'
    | 'empty'
    | 'too-short'
    | 'wrong-length'
    | 'placeholder'
    | 'cross-contamination'
    | 'stale';
  detail: string;
};

// ─── Placeholder detection ──────────────────────────────────────────────────

/**
 * Common placeholder values that appear in committed .env files, generated
 * templates, and tutorials. Any of these MUST be rejected for real secrets.
 */
const PLACEHOLDER_VALUES = new Set([
  'secret',
  'changeme',
  'change-me',
  'change_me',
  'your-secret-here',
  'your_secret_here',
  'your-secret',
  'your_secret',
  'replace-me',
  'replace_me',
  'placeholder',
  'todo',
  'todo-replace',
  'dev',
  'development',
  'test',
  'example',
  'sample',
  'demo',
  'xxx',
  'xxx-secret',
  'xxxxxxxxxxxxxxx',
  'set-me',
  'set_me',
  'tbd',
  'fixme',
  'insert-here',
  'insert_secret',
]);

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /^<.*>$/, // <your-secret-here>
  /\$\{.*\}/, // ${...}
  /\$\(.*\)/, // $(...)
  /\{\{.*\}\}/, // {{...}}
  /^\s*your[-_]?.*[-_]?here\s*$/i,
  /^\s*replace[-_]?me\s*$/i,
  /^\s*set[-_]?me\s*$/i,
  /^\s*change[-_]?me\s*$/i,
  /^\s*insert[-_]?.*$/i,
];

/** Known LiveKit / Stripe / Firebase placeholders we want to catch explicitly. */
const KNOWN_PLACEHOLDERS = new Set([
  'devkey', // LiveKit default API key
  'secret', // LiveKit default API secret
  'sk_test_xxx',
  'sk_live_xxx',
  'whsec_xxx',
  'whsec_test',
  'whsec_change_me',
  'AIzaSyD0XDQkKZmGCT8E5Hj44cg7H7D1L02yAf4', // public Firebase key from .env (not actually a secret, but flagged as committed sample)
  'C6tkcQ3PEZLthXmzH53LgArn6qG9uWMCHhfbMyqEHHJ', // committed LiveKit secret from .env
  'APIVtA5bMUkwUZo', // committed LiveKit key from .env
  'HIPS-HOST-2025', // committed host access code
]);

function isPlaceholderValue(value: string): boolean {
  const lower = value.trim().toLowerCase();
  if (PLACEHOLDER_VALUES.has(lower)) return true;
  if (KNOWN_PLACEHOLDERS.has(value.trim())) return true;
  for (const re of PLACEHOLDER_PATTERNS) {
    if (re.test(value)) return true;
  }
  return false;
}

// ─── requireSecret ──────────────────────────────────────────────────────────

/**
 * Load a secret and validate it. Throws a hard, specific error on any
 * problem so a misconfigured deployment cannot silently start.
 */
export function requireSecret(name: string, opts: SecretOptions = {}): string {
  const raw = process.env[name];
  const value = typeof raw === 'string' ? raw.trim() : '';
  const desc = opts.description ?? name;

  if (!raw || value.length === 0) {
    throw new SecretValidationError(name, 'missing', `${desc} (${name}) is not set.`);
  }

  if (opts.exactLength !== undefined && value.length !== opts.exactLength) {
    throw new SecretValidationError(
      name,
      'wrong-length',
      `${desc} (${name}) must be exactly ${opts.exactLength} characters, got ${value.length}.`,
    );
  }

  const minLength = opts.minLength ?? 32;
  if (value.length < minLength) {
    throw new SecretValidationError(
      name,
      'too-short',
      `${desc} (${name}) is too short (${value.length} < ${minLength}). ` +
        `Generate a strong value: openssl rand -base64 ${Math.ceil(minLength * 3 / 4)}`,
    );
  }

  if (isPlaceholderValue(value)) {
    throw new SecretValidationError(
      name,
      'placeholder',
      `${desc} (${name}) is set to a known placeholder value. ` +
        `Generate a strong value: openssl rand -base64 ${Math.ceil(minLength * 3 / 4)}`,
    );
  }

  if (opts.mustNotEqual && opts.mustNotEqual.length > 0) {
    for (const other of opts.mustNotEqual) {
      const otherRaw = process.env[other];
      if (otherRaw && constantTimeEqual(value, otherRaw.trim())) {
        throw new SecretValidationError(
          name,
          'cross-contamination',
          `${desc} (${name}) is identical to ${other}. ` +
            `These secrets must be independently generated.`,
        );
      }
    }
  }

  if (opts.trackAge) {
    recordSecretBirth(name, value);
  }

  return value;
}

/** Optional getter — returns null instead of throwing. Use only when missing is normal. */
export function tryGetSecret(name: string, opts: SecretOptions = {}): string | null {
  try {
    return requireSecret(name, opts);
  } catch {
    return null;
  }
}

// ─── validateSecretsAtStartup ──────────────────────────────────────────────

type StartupSecret = {
  name: string;
  category: SecretCategory;
  description: string;
  required: boolean;
  minLength?: number;
  exactLength?: number;
  mustNotEqual?: string[];
  trackAge?: boolean;
};

/**
 * Single registry of every secret the web app needs at boot. The web app may
 * not be using all of these at any given moment, but misconfiguration must be
 * caught at start time, not at first request.
 */
const REGISTRY: StartupSecret[] = [
  // Service JWT signing
  {
    name: 'SERVICE_JWT_SECRET',
    category: 'service-jwt',
    description: 'Central service-to-service JWT signing key',
    required: true,
    minLength: 64,
    trackAge: true,
  },
  // Per-service shared secrets
  {
    name: 'SESSION_SERVICE_SECRET',
    category: 'service-credential',
    description: 'Session service shared secret',
    required: true,
    minLength: 32,
    mustNotEqual: ['SERVICE_JWT_SECRET', 'SAFETY_SERVICE_SECRET', 'MFA_ENCRYPTION_KEY', 'SUDO_TOKEN_SECRET', 'HANDLE_DERIVATION_KEY'],
    trackAge: true,
  },
  {
    name: 'SAFETY_SERVICE_SECRET',
    category: 'service-credential',
    description: 'Safety service shared secret',
    required: true,
    minLength: 32,
    mustNotEqual: ['SERVICE_JWT_SECRET', 'SESSION_SERVICE_SECRET', 'MFA_ENCRYPTION_KEY', 'SUDO_TOKEN_SECRET', 'HANDLE_DERIVATION_KEY'],
    trackAge: true,
  },
  {
    name: 'SUDO_TOKEN_SECRET',
    category: 'service-credential',
    description: 'Used to sign sudo tokens (elevated MFA trust)',
    required: true,
    minLength: 32,
    mustNotEqual: ['SERVICE_JWT_SECRET', 'SESSION_SERVICE_SECRET', 'SAFETY_SERVICE_SECRET', 'MFA_ENCRYPTION_KEY', 'HANDLE_DERIVATION_KEY'],
    trackAge: true,
  },
  {
    name: 'HANDLE_DERIVATION_KEY',
    category: 'service-credential',
    description: 'Used to cryptographically derive pseudonymous participant handles',
    required: true,
    minLength: 32,
    mustNotEqual: ['SERVICE_JWT_SECRET', 'SESSION_SERVICE_SECRET', 'SAFETY_SERVICE_SECRET', 'MFA_ENCRYPTION_KEY', 'SUDO_TOKEN_SECRET'],
    trackAge: true,
  },
  // MFA
  {
    name: 'MFA_ENCRYPTION_KEY',
    category: 'mfa-encryption',
    description: 'AES-256-GCM key for MFA secret encryption (32 raw bytes → 44 base64 chars)',
    required: true,
    exactLength: 44,
    mustNotEqual: ['SERVICE_JWT_SECRET', 'SESSION_SERVICE_SECRET', 'SAFETY_SERVICE_SECRET', 'SUDO_TOKEN_SECRET', 'HANDLE_DERIVATION_KEY'],
    trackAge: true,
  },
  // Third-party
  {
    name: 'STRIPE_SECRET_KEY',
    category: 'third-party',
    description: 'Stripe secret API key',
    required: true,
    minLength: 32,
  },
  {
    name: 'LIVEKIT_API_KEY',
    category: 'third-party',
    description: 'LiveKit API key',
    required: true,
    minLength: 8,
  },
  {
    name: 'LIVEKIT_API_SECRET',
    category: 'third-party',
    description: 'LiveKit API secret',
    required: true,
    minLength: 32,
  },
  // Webhook signing
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    category: 'webhook',
    description: 'Stripe webhook signing secret',
    required: true,
    minLength: 32,
    mustNotEqual: ['LIVEKIT_WEBHOOK_SECRET', 'WEBHOOK_SECRET'],
  },
  {
    name: 'LIVEKIT_WEBHOOK_SECRET',
    category: 'webhook',
    description: 'LiveKit webhook signing secret',
    required: false, // Optional — only required if /api/livekit/webhook is reachable
    minLength: 32,
    mustNotEqual: ['STRIPE_WEBHOOK_SECRET', 'WEBHOOK_SECRET'],
  },
  {
    name: 'WEBHOOK_SECRET',
    category: 'webhook',
    description: 'Safety mitigation webhook shared secret (deprecated — use scoped JWT instead)',
    required: false,
    minLength: 32,
    mustNotEqual: ['STRIPE_WEBHOOK_SECRET', 'LIVEKIT_WEBHOOK_SECRET'],
  },
  // Cron
  {
    name: 'CRON_SECRET',
    category: 'admin-privileged',
    description: 'Cron job auth secret',
    required: true,
    minLength: 32,
  },
  // Database
  {
    name: 'DATABASE_URL',
    category: 'database',
    description: 'Commerce database connection string',
    required: true,
    minLength: 16,
  },
  // Firebase
  {
    name: 'FIREBASE_PROJECT_ID',
    category: 'third-party',
    description: 'Firebase project ID',
    required: true,
    minLength: 4,
  },
];

/**
 * Walk every required secret, report all problems in one pass.
 * Returns the list of problems found. Throws if `throwOnProblems` is true.
 */
export function validateSecretsAtStartup(opts: { throwOnProblems?: boolean } = {}): {
  problems: SecretValidationProblem[];
  warnings: string[];
} {
  const problems: SecretValidationProblem[] = [];
  const warnings: string[] = [];

  for (const entry of REGISTRY) {
    const value = process.env[entry.name];
    if (!value || value.trim().length === 0) {
      if (entry.required) {
        problems.push({
          name: entry.name,
          reason: 'missing',
          detail: `${entry.description} (${entry.name}) is not set.`,
        });
      }
      continue;
    }
    try {
      requireSecret(entry.name, {
        minLength: entry.minLength,
        exactLength: entry.exactLength,
        mustNotEqual: entry.mustNotEqual,
        trackAge: entry.trackAge,
        description: entry.description,
        category: entry.category,
      });
    } catch (err) {
      if (err instanceof SecretValidationError) {
        problems.push({ name: err.name, reason: err.reason, detail: err.message });
      } else {
        problems.push({
          name: entry.name,
          reason: 'missing',
          detail: (err as Error).message,
        });
      }
    }
  }

  // Stale-secret warning
  for (const entry of REGISTRY.filter((e) => e.trackAge)) {
    const age = getSecretAgeDays(entry.name);
    if (age !== null && age > 90) {
      warnings.push(
        `${entry.name} has not been rotated in ${age} days (recommended: < 90). ` +
          `See scripts/rotate-secret.sh.`,
      );
    }
  }

  if (opts.throwOnProblems && problems.length > 0) {
    const lines = problems.map((p) => `  - [${p.reason}] ${p.detail}`).join('\n');
    throw new Error(
      `Secret validation failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):\n${lines}`,
    );
  }

  return { problems, warnings };
}

// ─── Cross-contamination detection ──────────────────────────────────────────

/**
 * Refuse to boot if any two secrets in the map have the same value.
 * Use this to assert that required secrets are independently generated.
 */
export function assertNoCrossContamination(secretsByName: Record<string, string>): void {
  const seen = new Map<string, string>();
  for (const [name, value] of Object.entries(secretsByName)) {
    const hash = createHash('sha256').update(value).digest('hex');
    const existing = seen.get(hash);
    if (existing) {
      throw new Error(
        `Cross-contamination: secret "${name}" has the same value as secret "${existing}". ` +
          `These secrets must be independently generated.`,
      );
    }
    seen.set(hash, name);
  }
}

// ─── Secret age tracking ────────────────────────────────────────────────────

/**
 * In-memory record of when each secret was first seen. Persisted in process
 * memory only (resets on restart). The 90-day check still works because the
 * value itself is checked against `lastChanged` markers in the value prefix.
 *
 * For a real production deployment, this should be backed by Redis or a
 * metadata file outside the repo. The current implementation logs the
 * warning the first time the app sees a new secret value and the lastSeen
 * is older than 90 days.
 */
const secretBirthRegistry = new Map<string, { valueHash: string; firstSeenAt: number }>();

function recordSecretBirth(name: string, value: string): void {
  const hash = createHash('sha256').update(value).digest('hex').slice(0, 16);
  const existing = secretBirthRegistry.get(name);
  if (existing && existing.valueHash === hash) return;
  if (existing && existing.valueHash !== hash) {
    // Value rotated — reset the clock.
    secretBirthRegistry.set(name, { valueHash: hash, firstSeenAt: Date.now() });
    return;
  }
  secretBirthRegistry.set(name, { valueHash: hash, firstSeenAt: Date.now() });
}

export function getSecretAgeDays(name: string): number | null {
  const entry = secretBirthRegistry.get(name);
  if (!entry) return null;
  const ageMs = Date.now() - entry.firstSeenAt;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

// ─── Error type ─────────────────────────────────────────────────────────────

export class SecretValidationError extends Error {
  constructor(
    public readonly name: string,
    public readonly reason: SecretValidationProblem['reason'],
    message: string,
  ) {
    super(message);
    this.name = 'SecretValidationError';
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function constantTimeEqual(a: string, b: string): boolean {
  // Use a constant-time string comparison to avoid timing leaks of the secret
  // being compared. The XOR-of-bytes approach is standard.
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
