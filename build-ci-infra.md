# Build & CI Infrastructure Repair Plan

## Context

The Next.js 14.2.0 deprecation drives 46 audit vulnerabilities; the `packages/email/` directory is missing from copycheck.js; `services/session` and `services/safety` don't extend the shared `packages/tsconfig/base.json`.

## Scope

All issues (recommended).

---

## Phase 1 — Next.js Upgrade & Audit

### 1.1 — Upgrade Next.js and Resolve Audit Vulnerabilities

**Action:** Upgrade Next.js to the latest stable version and resolve audit findings.

```bash
cd /tmp/build-context
# Check current Next.js version
cat apps/web/package.json | grep '"next"'

# Upgrade Next.js to latest
cd apps/web
pnpm add next@latest

# Run full audit to see what's resolved
pnpm audit --audit-level=high
```

**Verify:** `pnpm --filter web build` succeeds without warnings about deprecated next.

---

## Phase 2 — copycheck.js Fixes

### 2.1 — Read copycheck.js and Identify Bugs

**Action:** Read the copycheck.js script to identify the path resolution bugs and confirm the missing `packages/email/` directory issue.

```bash
cd /tmp/build-context
cat scripts/copycheck.js
```

### 2.2 — Fix Path Resolution in copycheck.js

**Action:** Fix path resolution bugs so `src/` files are correctly detected relative to the project root.

```bash
cd /tmp/build-context
# Edit copycheck.js to fix path resolution
# Key fixes:
# - Resolve paths relative to project root (scripts/ → project root)
# - Ensure packages/email/ directory is included in checks
# - Fix any glob patterns that miss valid src/ directories
```

**Verify:** `node scripts/copycheck.js` runs without silent failures and correctly detects the missing `packages/email/src/lib/` directory.

---

## Phase 3 — TypeScript Strict Mode Parity

### 3.1 — Verify services/session tsconfig

```bash
cd /tmp/build-context
cat services/session/tsconfig.json
```

### 3.2 — Verify services/safety tsconfig

```bash
cd /tmp/build-context
cat services/safety/tsconfig.json
```

### 3.3 — Optionally Extend base.json in services/session and services/safety

**Action:** If `strictNullChecks: false` or `noImplicitAny: false` is found in either service's tsconfig, update them to extend `packages/tsconfig/base.json`.

```bash
cd /tmp/build-context
# If strictNullChecks or noImplicitAny is false, update tsconfig:
# Change "extends": "../../packages/tsconfig/base.json"
# and remove direct strict settings (base.json already has them)
```

**Verify:** `pnpm --filter session typecheck` and `pnpm --filter safety typecheck` both pass cleanly.

---

## Phase 4 — Verification

### Run full verification suite

```bash
cd /tmp/build-context

# Verify web build
pnpm --filter web build

# Verify TypeScript strict mode in all services
pnpm --filter web typecheck
pnpm --filter session typecheck
pnpm --filter safety typecheck

# Verify audit is clean (no critical/high)
pnpm audit --audit-level=high

# Verify copycheck runs without silent failures
node scripts/copycheck.js
```

**Success:** All checks pass cleanly.

---

## Rollback

If any phase breaks the build, revert with:
```bash
cd /tmp/build-context
git checkout .
pnpm install
```