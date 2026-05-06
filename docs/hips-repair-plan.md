# HIPS Platform — Repair Implementation Plan

> **Goal:** Take the repo from "partially broken across 10 sprints" to "fully buildable, tested, and compliant" using Firebase Auth + Storage as the single auth/storage stack.

---

## Repair Priority Map

![Repair priority order](C:\Users\ericb\.gemini\antigravity\brain\41ff3e24-e3e4-4807-8e32-713117cb6d17\hips_repair_priority_1777980382907.png)

---

## 6-Week Gantt

![Sprint Gantt](C:\Users\ericb\.gemini\antigravity\brain\41ff3e24-e3e4-4807-8e32-713117cb6d17\hips_sprint_gantt_1777980435309.png)

---

## Phase 1 — Make the Repo Buildable 🔴 CRITICAL
**Week 1 · Blocks everything else**

### 1.1 Fix `tsconfig/base.json` (blocks `pnpm lint` + `pnpm build`)

**Root cause:** `apps/web/tsconfig.json:2` extends `tsconfig/base.json` but no such package exists in the workspace.

```bash
# Create the shared tsconfig package
mkdir -p packages/tsconfig
```

- [ ] Create `packages/tsconfig/package.json` → `{ "name": "tsconfig", "version": "0.0.0", "files": ["*.json"] }`
- [ ] Create `packages/tsconfig/base.json` — strict TS, no `noEmit`, no broken flags
- [ ] Add `"tsconfig": "workspace:*"` to `apps/web/package.json` devDependencies
- [ ] Run `pnpm install` → `pnpm lint` must exit 0
→ **Verify:** `pnpm typecheck` passes for `@hips/web`

### 1.2 Fix Safety service missing deps/imports (blocks `pnpm build`)

- [ ] Audit `services/safety/src` — find all unresolved imports (run `tsc --noEmit`)
- [ ] Add missing `@hips/copy-policy` package **or** inline the `CRISIS_VAULT_FIELDS` constant
- [ ] Ensure `@prisma/client` is in `services/safety/package.json` dependencies (not devDeps)
→ **Verify:** `pnpm --filter @hips/safety build` exits 0

### 1.3 Fix Prisma/schema drift (blocks runtime + `pnpm build`)

Fields written by routes but **missing from schema:**

| Route | Field written | Schema status |
|---|---|---|
| `stripe route:85` | `confirmationEmailSent` | ❌ Missing from Session model |
| `stripe route:85` | `balanceDueDate` | ❌ Missing from Session model |
| `commerce schema:126` | `Package.isScholarship` | ❌ Not in Package model |
| `commerce schema:126` | `Package.discountCode` | ❌ Not in Package model |
| Scholarship model | `reviewNote` | ❌ Not in Scholarship model |

- [ ] Add the 5 missing fields to `packages/db/prisma/commerce.prisma`
- [ ] Run `pnpm db:migrate:commerce` — verify migration file created
- [ ] Remove migrations from `.gitignore` (line 39) — migrations MUST be committed
→ **Verify:** `pnpm build` for all packages exits 0

### 1.4 Fix `@hips/vault` — add at least one test file (blocks `pnpm test`)

- [ ] Create `services/vault/src/vault/vault.service.spec.ts` with basic unit tests
- [ ] Wire `jest` config in `services/vault/package.json`
→ **Verify:** `pnpm --filter @hips/vault test` exits 0

---

## Phase 2 — Repair Data Boundary 🔴 CRITICAL
**Week 2 · HIPAA/compliance risk**

![Data Boundary Architecture](C:\Users\ericb\.gemini\antigravity\brain\41ff3e24-e3e4-4807-8e32-713117cb6d17\hips_data_boundary_1777980395597.png)

### 2.1 Remove PII from Commerce DB

**Violation:** `commerce.prisma` header says "no email" but three models store email:
- Line 83: `User.email String @unique`
- Line 211: `Donation.email String`
- Line 233: `OrgInquiry.contactEmail String`

**Fix strategy:**
- `User.email` → Remove. Use `firebaseUid` as the sole identifier. Email lives in Firebase Auth only.
- `Donation.email` → Replace with `donorVaultRef String?` (opaque vault token for receipt lookup)
- `OrgInquiry.contactEmail` → Acceptable for B2B intake forms (not participant PII). Document as intentional exception in `docs/DATA_RETENTION_POLICY.md`.

- [ ] Update `User` model: remove `email`, rename `FirebaseId` → `firebaseUid`, update all relations
- [ ] Update `Donation` model: replace `email` + `donorName` with `donorVaultRef String?`
- [ ] Document `OrgInquiry.contactEmail` as accepted B2B exception
- [ ] Create migration: `pnpm db:migrate:commerce -- --name remove-pii-from-commerce`
→ **Verify:** `grep -r '"email"' packages/db/prisma/commerce.prisma` returns 0 hits (except OrgInquiry)

### 2.2 Fix session token boundary leak

**Violation:** `token.service.ts:40` stores a `commerce sessionId` in the session DB, directly linking anonymous session attendance to commerce identity.

- [ ] In `token.service.ts` — replace `commerceSessionId` storage with an opaque `bookingRef` (HMAC of sessionId, never reversible)
- [ ] Update session DB schema to store `bookingRef String?` instead of `sessionId`
- [ ] Add integration test asserting `bookingRef` cannot be reverse-mapped to a commerce session
→ **Verify:** No field named `sessionId` or `commerceSessionId` from commerce appears in session DB records

### 2.3 Define Vault → Commerce identity mapping safely

- [ ] `VaultService.createRecord()` must persist to DB via injected `PrismaService` (currently returns placeholder)
- [ ] Vault returns a `vaultRef` UUID — this UUID is what commerce stores
- [ ] Create `VaultRepository` class injected into `VaultService` using `services/vault`'s own Prisma client
→ **Verify:** POST to vault creates a real DB row; returned `vaultRef` is a UUID

---

## Phase 3 — Choose and Implement One Auth Stack
**Week 2–3**

![Firebase Auth Flow](C:\Users\ericb\.gemini\antigravity\brain\41ff3e24-e3e4-4807-8e32-713117cb6d17\hips_firebase_auth_1777980421778.png)

**Decision: Firebase Auth** (per the plan docs). Firebase is removed entirely.

### 3.1 Remove Firebase, install Firebase

- [ ] `pnpm remove @Firebase/nextjs --filter @hips/web` (and any other packages)
- [ ] Delete `services/auth/src/auth.ts` (Firebase implementation)
- [ ] Install Firebase SDK: `pnpm add firebase firebase-admin --filter @hips/web`
- [ ] Install server-side: `pnpm add firebase-admin --filter @hips/vault --filter @hips/session --filter @hips/safety`
→ **Verify:** `grep -r "Firebase" . --include="*.ts"` returns 0 hits

### 3.2 Implement Firebase Auth in Next.js

- [ ] Create `apps/web/src/lib/firebase/client.ts` — `initializeApp`, `getAuth` export
- [ ] Create `apps/web/src/lib/firebase/admin.ts` — `initializeApp` with service account, `getAuth` for `verifyIdToken`
- [ ] Create `apps/web/src/middleware.ts` — intercept protected routes, call `admin.auth().verifyIdToken()`
- [ ] Protected route groups: `(admin)`, `(app)`, `(session)`, all API routes under `/api/admin/*` and `/api/booking/*`
- [ ] Remove `demo-user` fallback from `book route:143` — throw 401 if no valid token
→ **Verify:** Hitting `/api/booking` without a token returns `401`; with a valid Firebase token returns `200`

### 3.3 Implement `requireRole` guard consistently

- [ ] Create `packages/types/src/auth.ts` — `FirebaseUser` type with `role` custom claim
- [ ] Create `apps/web/src/lib/auth/require-role.ts` — server-side helper that reads custom claims
- [ ] Apply to **every** admin API route: `/api/admin/*`
- [ ] Apply to mutation routes: `/api/booking`, `/api/scholarship`, `/api/stripe/webhook` (verify Stripe signature, not role)
- [ ] Add rate limiting to all org inquiry routes (already on one; extend to all)
→ **Verify:** Admin route without ADMIN claim returns `403`

### 3.4 Firebase Storage setup

- [ ] Initialize Firebase Storage bucket in `apps/web/src/lib/firebase/storage.ts`
- [ ] Storage rules: authenticated users can only read/write their own `uid/` prefix
- [ ] Use Storage for: facilitator profile images, session recording consent forms
→ **Verify:** Upload a test file, verify it's scoped to `uid/` in Firebase console

---

## Phase 4 — Align Session ↔ Safety ↔ Vault API Contracts
**Week 3–4**

### 4.1 Fix Safety → Vault contract mismatch

**Current bug:** `crisis.service.ts:16` calls `VAULT_API_URL` with header `x-vault-api-secret`, but Vault expects a different route/header.

- [ ] Audit `services/vault/src/vault/vault.controller.ts` — document the actual route + header name
- [ ] Update `crisis.service.ts` to call the correct endpoint and header
- [ ] Add `x-vault-api-key` header (or whatever vault expects) to `CrisisService`
- [ ] Write integration test: Safety triggers crisis → Vault returns `emergencyContact`
→ **Verify:** Crisis trigger e2e test passes with real vault call (test env)

### 4.2 Fix Session → Safety flag payload mismatch

- [ ] Document Session's flag payload shape in `packages/types/src/session.ts`
- [ ] Document Safety's expected payload shape in `packages/types/src/safety.ts`
- [ ] Create shared `SessionFlagPayload` type in `packages/types` used by both services
- [ ] Update both services to import from shared types
→ **Verify:** `tsc --noEmit` across all services exits 0

### 4.3 Vault controller — add the promised guard

- [ ] `vault.controller.ts:26` exposes `createRecord` — add Firebase token verification middleware
- [ ] Only `ADMIN` or `SYSTEM` role can call `createRecord`
- [ ] Add `VaultGuard` using `firebase-admin.verifyIdToken`
→ **Verify:** `POST /vault/v1/record` without token returns `401`

### 4.4 Align health endpoints to `/healthz` and `/readyz`

- [ ] `services/vault/src/main.ts` — add `/healthz` and `/readyz` routes
- [ ] `services/session/src/main.ts` — same
- [ ] `services/safety/src/main.ts` — same
- [ ] Confirm ports match documented dev contract (vault:3001, session:3002, safety:3003)
→ **Verify:** `curl localhost:3001/healthz` returns `{ status: "ok" }`

---

## Phase 5 — Replace Frontend Placeholders with Real Flows
**Week 4–5**

### 5.1 Checkout page — real Stripe integration

- [ ] Remove `// placeholder` comment from `checkout page:1`
- [ ] Wire `@hips/billing` package to call Stripe `createPaymentIntent`
- [ ] Render real package/service data from Commerce DB
- [ ] Add loading, error, and success states
→ **Verify:** Checkout flow completes with a Stripe test card

### 5.2 Session page — remove mock participants

- [ ] Remove hardcoded `"Dr. Rivera"` and mock participant list from `session page:16`
- [ ] Load real participant list from Session service (anonymized handles only)
- [ ] Wire LiveKit token to real session token from `token.service.ts`
→ **Verify:** Session page shows real token-based participant list

### 5.3 Revenue dashboard — remove mock data

- [ ] Remove hardcoded mock data from `revenue page:10`
- [ ] Create API route `/api/admin/revenue` that queries Commerce DB
- [ ] Protect with `requireRole('ADMIN')`
→ **Verify:** Revenue page loads real aggregated data

### 5.4 Add missing public pages

The issue report says these are missing. Confirmed from `apps/web/src/app/(public)/` — directories exist but need real content:

- [ ] `/services` — list all active services from Commerce DB
- [ ] `/services/[slug]` — single service detail page with booking CTA
- [ ] `/donate` — Stripe donation flow
- [ ] `/organizations` — org inquiry form wired to `OrgInquiry` model
→ **Verify:** All 4 pages render with real data and pass `pnpm build`

---

## Phase 6 — Fix CI Quality Gates
**Week 5–6**

### 6.1 Fix TypeScript strict mode

- [ ] `services/session/tsconfig.json` — enable `strict: true`, remove `strictNullChecks: false`, `noImplicitAny: false`
- [ ] `services/safety/tsconfig.json` — enable `noImplicitAny: true`
- [ ] Fix all type errors surfaced by enabling strict mode
→ **Verify:** `pnpm typecheck` across all services exits 0

### 6.2 Replace `process.env` with typed config accessor

- [ ] Create `packages/types/src/config.ts` — `getConfig()` function that reads and validates env vars with Zod
- [ ] Replace direct `process.env.X` access in: billing, email, safety/crisis, vault guard
- [ ] Update all services to import `getConfig()`
→ **Verify:** `grep -r "process.env\." services/ --include="*.ts"` returns 0 hits outside `config.ts`

### 6.3 Fix copycheck.js

Two bugs:
- Line 19: omits `packages/email/src` from scan dirs
- Line 96: `path.resolve(cwd, '..', '..', dir)` resolves **outside** the repo root

```js
// BEFORE (line 96)
const resolved = path.resolve(process.cwd(), '..', '..', dir);

// AFTER
const resolved = path.resolve(process.cwd(), dir);
```

- [ ] Add `'packages/email/src'` to `SCAN_DIRS` array (line 19)
- [ ] Fix `path.resolve` to use `process.cwd()` directly (line 96)
- [ ] Re-run `pnpm copycheck` — fix any newly surfaced banned terms in email templates
→ **Verify:** `pnpm copycheck` exits 0 with correct path resolution

### 6.4 Fix security audit (46 vulnerabilities, 1 critical)

Priority CVEs to resolve:

| Package | Issue | Fix |
|---|---|---|
| `next@14.2.0` | Multiple CVEs | Upgrade to `next@15.x` |
| `glob` (vulnerable version) | ReDoS | Pin to patched version |
| `multer` | CVE | Upgrade or replace |
| `undici` | CVE | Upgrade |
| `picomatch` | CVE | Upgrade |

- [ ] Switch all `^` version ranges to exact pins in root `package.json` and `apps/web/package.json`
- [ ] `pnpm update next@latest` — handle breaking changes (App Router API surface is stable)
- [ ] `pnpm audit --audit-level=high` — fix remaining
→ **Verify:** `pnpm audit --audit-level=high` exits 0

### 6.5 Wire coverage thresholds

- [ ] Add `coverageThreshold` to root `jest.config.ts`: `{ global: { lines: 70, functions: 70 } }`
- [ ] Add `coverage` script to each service's `package.json`
- [ ] Wire `pnpm test:coverage` to turbo pipeline
→ **Verify:** `pnpm test` fails if coverage drops below 70%

### 6.6 Add E2E config (Playwright)

- [ ] Install `@playwright/test` in `apps/web`
- [ ] Create `apps/web/playwright.config.ts`
- [ ] Write 3 smoke tests: homepage loads, booking flow starts, donate page loads
- [ ] Wire `pnpm test:e2e` script
→ **Verify:** `pnpm test:e2e` runs and all 3 smoke tests pass

### 6.7 Add observability baseline

- [ ] Install `@opentelemetry/sdk-node` in each NestJS service
- [ ] Add `traceId` + `X-Request-ID` to every HTTP response header
- [ ] Replace all `console.log` with `pino` JSON logger
→ **Verify:** A request to `/healthz` returns `X-Request-ID` header

---

## Firebase Auth + Storage — Key Files to Create

```
apps/web/src/lib/firebase/
├── client.ts          # initializeApp, getAuth, getStorage
├── admin.ts           # firebase-admin, verifyIdToken
└── storage.ts         # getStorage, upload helpers

apps/web/src/middleware.ts   # Edge middleware: verify Firebase JWT
apps/web/src/lib/auth/
├── require-role.ts    # Server-side role guard
└── get-user.ts        # Extract FirebaseUser from request

packages/types/src/
├── auth.ts            # FirebaseUser, Role, custom claims
├── config.ts          # getConfig() Zod-validated env accessor
└── session.ts         # SessionFlagPayload (shared)
```

---

## Done When

- [ ] `pnpm lint` exits 0
- [ ] `pnpm build` exits 0
- [ ] `pnpm test` exits 0 (including vault)
- [ ] `pnpm typecheck` exits 0 with strict mode on all services
- [ ] `pnpm audit --audit-level=high` exits 0
- [ ] `pnpm copycheck` exits 0 with correct path resolution
- [ ] `pnpm test:e2e` exits 0
- [ ] No PII (email/name/phone) stored in Commerce DB (except OrgInquiry — documented)
- [ ] No Firebase references anywhere in codebase
- [ ] All admin/payment/session routes return 401/403 without valid Firebase token
- [ ] All services expose `/healthz` and `/readyz` on correct ports
- [ ] Vault `createRecord` persists to DB (not a placeholder return)

---

## Skills Applied
`plan-writing` · `architecture` · `Firebase-auth` (inverted — for removal) · `database-design` · `api-security-best-practices` · `frontend-patterns` · `coding-standards`
