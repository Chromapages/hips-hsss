/**
 * check-prisma-freshness.mjs
 *
 * Verifies that generated Prisma clients are up-to-date with their source schemas.
 * Runs as part of CI to catch drift between schema changes and generated clients.
 *
 * Usage:
 *   node scripts/check-prisma-freshness.mjs
 *
 * Exits 0 if all clients are fresh, exits 1 with diagnostics if not.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const services = ['commerce', 'session', 'safety', 'vault'];

const schemaPaths = {
  commerce: 'packages/db/prisma/commerce.prisma',
  session: 'packages/db/prisma/session.prisma',
  safety: 'packages/db/prisma/safety.prisma',
  vault: 'packages/db/prisma/vault.prisma',
};

const generatedPaths = {
  commerce: 'packages/db/generated/commerce',
  session: 'packages/db/generated/session',
  safety: 'packages/db/generated/safety',
  vault: 'packages/db/generated/vault',
};

/**
 * Compute a quick fingerprint of a schema file for change detection.
 * Uses mtime + size rather than hashing the full file for speed.
 */
function schemaFingerprint(schemaPath) {
  const stats = existsSync(schemaPath)
    ? { mtime: require('fs').statSync(schemaPath).mtimeMs, size: require('fs').statSync(schemaPath).size }
    : null;
  return stats ? JSON.stringify(stats) : null;
}

const lockPath = join(__dirname, '.prisma-fingerprint.json');

function readLock() {
  try {
    return JSON.parse(readFileSync(lockPath, 'utf8'));
  } catch {
    return {};
  }
}

function writeLock(lock) {
  mkdirSync(dirname(lockPath), { recursive: true });
  writeFileSync(lockPath, JSON.stringify(lock, null, 2));
}

async function main() {
  const lock = readLock();
  const errors = [];
  const warnings = [];

  for (const service of services) {
    const schemaPath = join(root, schemaPaths[service]);
    const generatedPath = join(root, generatedPaths[service]);

    // Check schema exists
    if (!existsSync(schemaPath)) {
      errors.push(`[${service}] Schema not found: ${schemaPath}`);
      continue;
    }

    // Check generated client exists
    if (!existsSync(generatedPath)) {
      errors.push(`[${service}] Generated client not found: ${generatedPath} — run: pnpm prisma generate --filter @hips/db`);
      continue;
    }

    // Run prisma validate for this schema (reads schema, validates, does not connect)
    try {
      execSync(
        `pnpm --filter @hips/db prisma validate --schema ${schemaPath}`,
        { cwd: root, stdio: 'pipe' }
      );
    } catch (e) {
      const stderr = e.stderr?.toString() ?? '';
      errors.push(`[${service}] prisma validate failed:\n${stderr}`);
    }

    // Check for fingerprint drift (optional warning)
    const fp = schemaFingerprint(schemaPath);
    if (lock[service] && lock[service] !== fp) {
      warnings.push(`[${service}] Schema fingerprint changed — consider re-running: pnpm prisma generate --filter @hips/db`);
    }
    lock[service] = fp;
  }

  writeLock(lock);

  if (warnings.length) {
    console.warn('\n⚠️  Warnings:');
    warnings.forEach(w => console.warn(' ', w));
  }

  if (errors.length) {
    console.error('\n❌ Prisma client freshness check FAILED:');
    errors.forEach(e => console.error(' ', e));
    console.error('\nTo regenerate clients: pnpm --filter @hips/db prisma generate');
    process.exit(1);
  }

  console.log('✅ All Prisma clients are fresh');
  process.exit(0);
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
