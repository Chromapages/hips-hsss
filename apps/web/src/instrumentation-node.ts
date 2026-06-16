/**
 * Node.js-specific instrumentation.
 *
 * This file is loaded ONLY when `process.env.NEXT_RUNTIME === 'nodejs'`.
 * It is split out of instrumentation.ts so webpack does not try to bundle
 * `lib/secrets` (which imports `node:crypto`) for the edge runtime.
 *
 * Without this split, the edge compilation of the dynamic import chain
 * hits `node:crypto` and fails with:
 *   UnhandledSchemeError: Reading from "node:crypto" is not handled
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

import { validateSecretsAtStartup, assertNoCrossContamination } from '@/lib/secrets';
import { findStaleSigningSecrets } from '@/lib/secrets/dual';

const isProd = process.env.NODE_ENV === 'production';

export function runNodeStartupChecks(): void {
  const { problems, warnings } = validateSecretsAtStartup({ throwOnProblems: false });

  for (const w of warnings) {
    // eslint-disable-next-line no-console
    console.warn(`[startup] ${w}`);
  }

  if (problems.length > 0) {
    const lines = problems.map((p) => `  - [${p.reason}] ${p.detail}`).join('\n');
    const msg = `[startup] Secret validation failed (${problems.length} problem${problems.length === 1 ? '' : 's'}):\n${lines}`;

    if (isProd) {
      // Hard fail in production.
      throw new Error(msg);
    } else {
      // Soft fail in development so the dev experience is not blocked.
      // eslint-disable-next-line no-console
      console.error(msg + '\n[startup] Continuing in development mode.');
    }
  }

  // Cross-contamination detection (separate pass, only when secrets exist).
  if (problems.length === 0) {
    const secretsByName: Record<string, string> = {};
    for (const name of [
      'SERVICE_JWT_SECRET',
      'SERVICE_JWT_SECRET_PRIOR',
      'SESSION_SERVICE_SECRET',
      'SESSION_SERVICE_SECRET_PRIOR',
      'SAFETY_SERVICE_SECRET',
      'SAFETY_SERVICE_SECRET_PRIOR',
      'MFA_ENCRYPTION_KEY',
      'MFA_ENCRYPTION_KEY_PRIOR',
      'STRIPE_WEBHOOK_SECRET',
      'LIVEKIT_WEBHOOK_SECRET',
      'WEBHOOK_SECRET',
    ]) {
      const v = process.env[name];
      if (v && v.trim().length > 0) secretsByName[name] = v;
    }
    try {
      assertNoCrossContamination(secretsByName);
    } catch (err) {
      const msg = `[startup] ${(err as Error).message}`;
      if (isProd) throw new Error(msg);
      // eslint-disable-next-line no-console
      console.error(msg);
    }
  }

  // Layer 6: 90-day age warning for tracked signing secrets.
  // (Non-blocking — emits warnings, never throws.)
  void (async () => {
    const stale = await findStaleSigningSecrets();
    for (const { name, ageDays } of stale) {
      // eslint-disable-next-line no-console
      console.warn(
        `[startup] ${name} has not been rotated in ${ageDays} days ` +
          `(recommended: < 90). See apps/web/scripts/rotate-secret.sh.`,
      );
    }
  })();
}
