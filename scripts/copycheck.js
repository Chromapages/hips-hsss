/**
 * copycheck.js — Banned-language scanner
 * Scans source files for prohibited clinical/therapy language per the HIPS copy policy.
 * Fails CI if any banned term is found in UI, email template, or API response surfaces.
 *
 * Usage: node scripts/copycheck.js [--fix]
 */

const fs = require('fs');
const path = require('path');

const BANNED_TERMS = [
  'therapy', 'treatment', 'diagnosis', 'clinical',
  'counseling', 'psychiatrist', 'psychologist', 'prescription',
  'medication management', 'mental health treatment',
];

const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.html'];
const SCAN_DIRS = ['apps/web/src', 'packages/types/src', 'packages/email/src', 'services/session/src', 'services/safety/src'];
const IGNORE_FILES = ['node_modules', 'dist', '.next', 'coverage', 'prisma'];

let fixMode = process.argv.includes('--fix');
let foundCount = 0;
let fixCount = 0;

function shouldIgnore(filePath) {
  return IGNORE_FILES.some(ignored => filePath.includes(ignored));
}

function scanFile(filePath) {
  if (shouldIgnore(filePath)) return;
  const ext = path.extname(filePath);
  if (!SCAN_EXTENSIONS.includes(ext)) return;

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  let modified = false;
  const lines = content.split('\n');
  const results = [];

  lines.forEach((line, idx) => {
    const lowerLine = line.toLowerCase();
    for (const term of BANNED_TERMS) {
      if (lowerLine.includes(term)) {
        // Skip if in a comment explaining the term is banned
        if (line.trim().startsWith('//') && line.toLowerCase().includes('never use')) continue;
        results.push(`  ${filePath}:${idx + 1}: "${term}" found in: ${line.trim().slice(0, 80)}`);
        if (fixMode) {
          // Replace the banned term with a safe placeholder (for comments/code strings only)
          // This is a safety net; real fixes require human review
          line = line.replace(new RegExp(term, 'gi'), `[${term.toUpperCase()}_REVIEW_REQUIRED]`);
          modified = true;
        }
      }
    }
  });

  if (results.length > 0) {
    foundCount += results.length;
    console.log(`\n⚠️  ${filePath}:`);
    results.forEach(r => console.log(r));
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      fixCount++;
    }
  }
}

function walkDir(dir) {
  if (shouldIgnore(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else {
        scanFile(fullPath);
      }
    }
  } catch {
    // Directory may not exist yet in early sprint
  }
}

const repoRoot = path.resolve(__dirname, '..');
console.log('\n🔍 HIPS Copy Policy Check');
console.log('==========================');
console.log(`Mode: ${fixMode ? 'FIX' : 'CHECK'}\n`);

SCAN_DIRS.forEach(dir => {
  const resolved = path.join(repoRoot, dir);
  if (fs.existsSync(resolved)) {
    walkDir(resolved);
  }
});

console.log('\n--------------------------');
if (foundCount > 0) {
  console.log(`❌ Found ${foundCount} banned term(s)`);
  if (fixMode) console.log(`🔧 Fixed ${fixCount} file(s)`);
  process.exit(1);
} else {
  console.log('✅ No banned clinical language detected');
  process.exit(0);
}
