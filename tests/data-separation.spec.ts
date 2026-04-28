import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

type ServiceName = "commerce" | "session" | "vault";

const root = process.cwd();
const schemaPaths: Record<ServiceName, string> = {
  commerce: "packages/db/prisma/commerce.prisma",
  session: "packages/db/prisma/session.prisma",
  vault: "packages/db/prisma/vault.prisma",
};

const dbEnvByService: Record<ServiceName, string> = {
  commerce: "DATABASE_URL",
  session: "SESSION_DATABASE_URL",
  vault: "VAULT_DATABASE_URL",
};

const forbiddenSessionColumns = [
  "email",
  "firebaseUid",
  "phone",
  "realName",
  "emergencyContact",
  "contactName",
  "ipAddress",
  "deviceFingerprint",
];

const allowedDbEnv: Record<ServiceName, Set<string>> = {
  commerce: new Set(["DATABASE_URL"]),
  session: new Set(["SESSION_DATABASE_URL"]),
  vault: new Set(["VAULT_DATABASE_URL"]),
};

function readWorkspaceFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function listFiles(path: string): string[] {
  const absolute = join(root, path);
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
    return statSync(next).isDirectory()
      ? listFiles(relative(root, next))
      : [next];
  });
}

function parseModels(schema: string) {
  return Array.from(schema.matchAll(/model\s+(\w+)\s+\{([\s\S]*?)\n\}/g)).map(
    ([, name, body]) => ({
      name,
      fields: Array.from(
        (body ?? "").matchAll(/^\s*(\w+)\s+[\w\[\]?]+/gm),
      ).map(([, field]) => field),
    }),
  );
}

function parseDatasourceEnv(schema: string) {
  return schema.match(/url\s*=\s*env\("([^"]+)"\)/)?.[1] ?? null;
}

describe("Phase 9 data separation", () => {
  it("binds each Prisma schema to exactly one service-owned database URL", () => {
    for (const [service, path] of Object.entries(schemaPaths) as [
      ServiceName,
      string,
    ][]) {
      const schema = readWorkspaceFile(path);

      expect(parseDatasourceEnv(schema)).toBe(dbEnvByService[service]);
    }
  });

  it("keeps PII and commerce identifiers out of the session schema", () => {
    const sessionSchema = readWorkspaceFile(schemaPaths.session);
    const models = parseModels(sessionSchema);
    const allFields = models.flatMap((model) => model.fields);

    expect(allFields).not.toEqual(
      expect.arrayContaining(forbiddenSessionColumns),
    );
  });

  it("keeps vault emergency-contact fields out of commerce and session schemas", () => {
    const commerceSchema = readWorkspaceFile(schemaPaths.commerce);
    const sessionSchema = readWorkspaceFile(schemaPaths.session);

    expect(`${commerceSchema}\n${sessionSchema}`).not.toMatch(
      /encryptedEmergencyContact|VaultAccessLog|IdentityRecord/,
    );
  });

  it("keeps service code from referencing another service database URL", () => {
    for (const service of ["session", "vault"] as const) {
      const files = listFiles(`services/${service}`).filter((file) =>
        /\.(ts|tsx|mts|mjs|js)$/.test(file),
      );

      for (const file of files) {
        const rel = relative(root, file).replaceAll("\\", "/");
        const content = readFileSync(file, "utf8");
        const referencedEnv = Object.values(dbEnvByService).filter((envName) =>
          content.includes(envName),
        );
        const disallowed = referencedEnv.filter(
          (envName) => !allowedDbEnv[service].has(envName),
        );

        expect(disallowed, `${rel} references ${disallowed.join(", ")}`).toEqual(
          [],
        );
      }
    }
  });

  it("blocks cross-service implementation imports", () => {
    const sourceFiles = ["apps", "packages", "services"]
      .flatMap(listFiles)
      .filter((file) => /\.(ts|tsx|mts|mjs|js)$/.test(file));
    const importPattern =
      /from\s+["'].*services\/(vault|session|safety)|from\s+["'].*packages\/db\/generated\/(vault|session|commerce)/i;

    for (const file of sourceFiles) {
      const rel = relative(root, file).replaceAll("\\", "/");
      const content = readFileSync(file, "utf8");

      expect(importPattern.test(content), `${rel} crosses service ownership`).toBe(
        false,
      );
    }
  });
});
