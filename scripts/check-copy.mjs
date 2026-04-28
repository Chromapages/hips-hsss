import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scannedRoots = ["apps/web/src", "packages/types/src"];
const banned = ["therapy", "treatment", "diagnosis", "clinical", "patient"];
const allowedFiles = new Set(["packages/types/src/copy-policy.ts"]);
const failures = [];

function listFiles(path) {
  const absolute = join(root, path);
  const stats = statSync(absolute);

  if (stats.isFile()) {
    return [absolute];
  }

  return readdirSync(absolute).flatMap((entry) => {
    const next = join(absolute, entry);
    return statSync(next).isDirectory()
      ? listFiles(relative(root, next))
      : [next];
  });
}

for (const file of scannedRoots.flatMap(listFiles)) {
  const rel = relative(root, file).replaceAll("\\", "/");

  if (!/\.(ts|tsx)$/.test(rel) || allowedFiles.has(rel)) {
    continue;
  }

  const content = readFileSync(file, "utf8").toLowerCase();
  for (const term of banned) {
    if (content.includes(term)) {
      failures.push(`${rel} contains blocked language "${term}"`);
    }
  }
}

if (failures.length > 0) {
  console.error("Copy guard failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Copy guard passed.");
