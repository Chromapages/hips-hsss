import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

const forbiddenSessionTerms = [
  "userId",
  "firebaseUid",
  "email",
  "realName",
  "billing",
  "stripe",
  "commerceId",
  "customerId",
];

const sessionPaths = [
  "packages/db/prisma/session.prisma",
  "services/session",
  "services/safety",
];

const crossServiceImportPatterns = [
  /from\s+["'].*services\/vault/i,
  /from\s+["'].*services\/session/i,
  /from\s+["'].*services\/safety/i,
  /from\s+["'].*packages\/db\/generated\/vault/i,
  /from\s+["'].*packages\/db\/generated\/session/i,
  /from\s+["'].*packages\/db\/generated\/commerce/i,
];

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
        entry === "coverage"
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

for (const file of sessionPaths.flatMap(listFiles).filter((name) =>
  /\.(ts|tsx|mts|mjs|js|prisma)$/.test(name),
)) {
  const content = readFileSync(file, "utf8");
  for (const term of forbiddenSessionTerms) {
    if (content.includes(term)) {
      failures.push(
        `${relative(root, file)} contains forbidden session term "${term}"`,
      );
    }
  }
}

for (const base of ["apps", "packages", "services"]) {
  for (const file of listFiles(base).filter((name) => /\.(ts|tsx|mts|mjs|js)$/.test(name))) {
    const rel = relative(root, file).replaceAll("\\", "/");
    const content = readFileSync(file, "utf8");

    if (rel.startsWith("apps/web/") && /VAULT_DATABASE_URL|SESSION_DATABASE_URL/.test(content)) {
      failures.push(`${rel} references a non-commerce database URL`);
    }

    if (rel.startsWith("services/session/") && /DATABASE_URL|VAULT_DATABASE_URL/.test(content)) {
      failures.push(`${rel} references a forbidden database URL`);
    }

    if (rel.startsWith("services/vault/") && /DATABASE_URL|SESSION_DATABASE_URL/.test(content)) {
      failures.push(`${rel} references a forbidden database URL`);
    }

    if (crossServiceImportPatterns.some((pattern) => pattern.test(content))) {
      failures.push(`${rel} imports across service/database ownership boundaries`);
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
