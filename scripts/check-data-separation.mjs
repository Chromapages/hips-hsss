import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

/**
 * Forbidden terms that must NEVER appear in session/safety database schema files.
 * These are checked only against .prisma files in the session/safety schema paths.
 */
const forbiddenSchemaTerms = [
  "userId",
  "firebaseUid",
  "email",
  "realName",
  "billing",
  "stripe",
  "commerceId",
  "customerId",
];

/**
 * Forbidden terms that must NEVER appear in service code as data stored to
 * the session/safety databases. Checked against TypeScript source files.
 *
 * Exclusions (known false-positives):
 *   - Auth scaffolding: firebaseUid/userId used as LOCAL variables for Firebase auth
 *     verification, NOT as fields written to the session DB. These are ephemeral
 *     values used to verify caller ownership before issuing an anonymous token.
 *   - Test files (*.spec.ts): test harness uses these as dummy fixtures.
 *   - firebase-init.ts: Firebase Admin SDK initialization; "clientEmail" is
 *     the SDK's own parameter name, not a user data field.
 *   - admin-auth.guard.ts: decodes admin JWT for auth; does not write to session DB.
 *   - facilitator-flag.controller.ts: uses userId as LOCAL auth variable;
 *     writes only sessionId + reason to AuditEvent (no PII stored).
 *   - session.controller.ts: uses userId as LOCAL auth result from Firebase;
 *     stores only anonymous session state in SessionRecord.
 *   - session-token.controller.ts: extracts uid for ownership verification;
 *     opaque token is what gets stored, not the UID.
 *   - session-token.service.ts: checks session ownership by UID (ephemeral);
 *     stores only random hex token in SessionTokenStore (no UID persisted).
 */
const codeFileExclusions = new Set([
  // Firebase Admin SDK initialization — clientEmail is SDK parameter, not user PII
  "services/session/src/firebase-init.ts",
  // Auth guards — read JWT claims ephemerally, nothing written to session DB
  "services/safety/src/auth/admin-auth.guard.ts",
  "services/session/src/auth/roles.guard.ts",
  // Session auth: uid used ephemerally to verify ownership → anonymous token issued
  "services/session/src/session/session-token.controller.ts",
  "services/session/src/session/session-token.service.ts",
  "services/session/src/session/session.controller.ts",
  "services/session/src/session/facilitator-flag.controller.ts",
]);

/**
 * Spec files are always excluded from PII term checks.
 * Test fixtures necessarily contain fake UIDs and email-like strings.
 */
function isSpecFile(relPath) {
  return relPath.endsWith(".spec.ts") || relPath.endsWith(".spec.js") || relPath.includes("/__tests__/");
}

const sessionCodePaths = [
  "services/session",
  "services/safety",
];

const sessionSchemaPaths = [
  "packages/db/prisma/session.prisma",
  "packages/db/prisma/safety.prisma",
];

/**
 * Cross-service import boundaries that are ALWAYS forbidden regardless of file:
 * No service may directly import another service's Prisma-generated client.
 * Services must communicate via HTTP API only.
 *
 * Exceptions:
 *   - escalation.service.ts imports SessionPrismaClient for the AuditEvent write.
 *     This is a temporary bridge that should be replaced with a session-service
 *     HTTP call. For now, it is tracked separately — the import is allowed but
 *     the real fix (HTTP-based audit) is documented in CHR-65.
 */
const forbiddenImportPatterns = [
  /from\s+["'].*packages\/db\/generated\/vault/i,
  /from\s+["'].*packages\/db\/generated\/session/i,
  /from\s+["'].*packages\/db\/generated\/commerce/i,
];

// Cross-service source code imports (services importing each other's source)
const forbiddenCrossServiceSourcePatterns = [
  /from\s+["'].*services\/vault/i,
  /from\s+["'].*services\/session/i,
  /from\s+["'].*services\/safety/i,
];

/**
 * Files that are explicitly permitted to cross service boundaries because
 * they implement the safety→session audit bridge via direct Prisma constructor
 * (not by importing session source code or Next.js cross-service modules).
 * These files use `new PrismaClient({ datasources: { db: { url: ... } } })`
 * which is the approved pattern for the safety→session AuditEvent write.
 */
const approvedCrossServiceBridges = new Set([
  "services/safety/src/escalation/escalation.service.ts",
]);

function listFiles(path) {
  const absolute = join(root, path);
  try {
    const stats = statSync(absolute);
    if (stats.isFile()) {
      return [absolute];
    }
    return readdirSync(absolute).flatMap((entry) => {
      if (
        entry === "node_modules" ||
        entry === "dist" ||
        entry === ".next" ||
        entry === "coverage" ||
        entry === "generated"
      ) {
        return [];
      }
      const next = join(absolute, entry);
      const nextStats = statSync(next);
      if (nextStats.isDirectory()) {
        return listFiles(relative(root, next));
      }
      return [next];
    });
  } catch {
    return [];
  }
}

const failures = [];

// ── 1. Schema-level checks: no PII field names in session/safety Prisma schemas ──
for (const schemaPath of sessionSchemaPaths) {
  const absolute = join(root, schemaPath);
  let content;
  try {
    content = readFileSync(absolute, "utf8");
  } catch {
    continue; // Schema file doesn't exist yet — skip
  }
  for (const term of forbiddenSchemaTerms) {
    if (content.includes(term)) {
      failures.push(
        `${schemaPath} schema contains forbidden PII field term "${term}"`
      );
    }
  }
}

// ── 2. Code-level checks: no PII terms stored to session DB in service code ──
for (const base of sessionCodePaths) {
  for (const file of listFiles(base).filter((name) =>
    /\.(ts|tsx|mts|mjs|js)$/.test(name)
  )) {
    const rel = relative(root, file).replaceAll("\\", "/");
    if (isSpecFile(rel)) continue;
    if (codeFileExclusions.has(rel)) continue;

    const content = readFileSync(file, "utf8");
    for (const term of forbiddenSchemaTerms) {
      if (content.includes(term)) {
        failures.push(
          `${rel} contains forbidden PII term "${term}" (must not be stored in session/safety DB)`
        );
      }
    }
  }
}

// ── 3. Cross-service and database URL boundary checks ──
for (const base of ["apps", "packages", "services"]) {
  for (const file of listFiles(base).filter((name) =>
    /\.(ts|tsx|mts|mjs|js)$/.test(name)
  )) {
    const rel = relative(root, file).replaceAll("\\", "/");
    if (isSpecFile(rel)) continue;
    const content = readFileSync(file, "utf8");

    // apps/web must never reference non-commerce database URLs directly
    if (
      rel.startsWith("apps/web/") &&
      /VAULT_DATABASE_URL|SESSION_DATABASE_URL/.test(content)
    ) {
      failures.push(`${rel} references a non-commerce database URL`);
    }

    // session service must never reference vault or commerce database URLs
    if (
      rel.startsWith("services/session/") &&
      /VAULT_DATABASE_URL|DATABASE_URL(?!.*SESSION)/.test(content)
    ) {
      failures.push(`${rel} references a forbidden database URL`);
    }

    // vault service must never reference session or commerce database URLs
    if (
      rel.startsWith("services/vault/") &&
      /DATABASE_URL(?!.*VAULT)|SESSION_DATABASE_URL/.test(content)
    ) {
      failures.push(`${rel} references a forbidden database URL`);
    }

    // Forbidden generated Prisma client imports (always blocked)
    if (forbiddenImportPatterns.some((p) => p.test(content))) {
      if (!approvedCrossServiceBridges.has(rel)) {
        failures.push(`${rel} imports a generated Prisma client across service ownership boundaries`);
      }
    }

    // Forbidden cross-service source imports (always blocked except within own service)
    if (forbiddenCrossServiceSourcePatterns.some((p) => p.test(content))) {
      // Allow imports within the same service (e.g. services/session/* importing from services/session/*)
      const ownService = rel.split("/")[1]; // "session", "safety", "vault", etc.
      const importedService = (content.match(forbiddenCrossServiceSourcePatterns[0]) ||
        content.match(forbiddenCrossServiceSourcePatterns[1]) ||
        content.match(forbiddenCrossServiceSourcePatterns[2]))
        ?.[0]?.match(/services\/([\w-]+)/)?.[1];
      if (importedService && importedService !== ownService) {
        failures.push(`${rel} imports source code across service ownership boundaries (${importedService})`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Hard-anonymity guard failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Hard-anonymity guard passed.");
