# QUALITY_BAR.md

Project: H.I.P.S. Platform (Hiding in Plain Sight Foundation)
Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Three.js/WebGL · NestJS microservices · pnpm monorepo
Deployment: Vercel (frontend + commerce API) · AWS ECS Fargate (session/vault/safety services) · Railway (PostgreSQL commerce + session DB) · AWS RDS (encrypted vault DB, isolated VPC)
Owner: Tech Lead + Infrastructure Lead
Last Updated: 2026-05-05

---

## 1. Project Overview

The H.I.P.S. platform delivers anonymous-by-default peer support, leadership coaching, and care navigation for individuals in crisis and leaders facing burnout. The defining architectural guarantee is that a participant's billing identity is never linkable to their session attendance — enforced at the database and infrastructure level through three physically separated data stores.

This quality bar applies to all shippable work across the monorepo:
`apps/web` · `services/session` · `services/vault` · `services/safety` · `packages/db` · `packages/types`

---

## 2. Commands Table

All commands run from repo root (`pnpm` workspace).

| Command | Exact Flags | What It Does |
|---|---|---|
| `pnpm dev` | — | Starts all services: `apps/web` (`:3000`) + session (`:3001`) + vault (`:3002`) + safety (`:3003`) |
| `pnpm build` | — | Full production build: typecheck → lint → test → build all packages |
| `pnpm test` | `pnpm --filter @hips/web vitest run --coverage` | Unit + integration tests with coverage report |
| `pnpm test:e2e` | `pnpm --filter @hips/web playwright test` | E2E tests via Playwright (requires all services up) |
| `pnpm lint` | `eslint . --max-warnings=0` | Lint all packages; zero warnings blocks merge |
| `pnpm lint:fix` | `eslint . --fix` | Auto-fix lint errors (review diff before committing) |
| `pnpm typecheck` | `tsc --noEmit` | TypeScript strict mode check across all packages |
| `pnpm format` | `prettier --write .` | Format all files; check-only in CI |
| `pnpm db:migrate:commerce` | `--filter @hips/db prisma migrate dev --schema=./prisma/commerce.prisma` | Run commerce DB migrations |
| `pnpm db:migrate:session` | `--filter @hips/db prisma migrate dev --schema=./prisma/session.prisma` | Run session DB migrations |
| `pnpm db:studio:commerce` | `--filter @hips/db prisma studio --schema=./prisma/commerce.prisma` | Open Prisma Studio for commerce DB |
| `pnpm db:studio:session` | `--filter @hips/db prisma studio --schema=./prisma/session.prisma` | Open Prisma Studio for session DB |
| `pnpm db:seed` | `--filter @hips/db ts-node prisma/seed.ts` | Seed the service catalog |
| `pnpm audit` | `pnpm audit --audit-level=high` | CVE audit; blocks merge on `high` or `critical` |
| `pnpm copycheck` | (custom script) | Scan all surfaces for banned-language violations |

### CI Pipeline Order
```
install → typecheck → lint → test → build
```
Every stage must pass before the next runs. A failure at any stage halts the pipeline.

---

## 3. Code Style Rules

### Typing Policy
- `strict: true` in all `tsconfig.json` files — no exceptions
- No `any` type without a `// SAFETY: [reason]` comment directly above the line
- All API request/response shapes defined as explicit interfaces or Zod schemas — no `Record<string, unknown>`
- Generic types must have all type parameters specified

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `session-token.ts`, `vault-access-log.ts` |
| Components (React) | `PascalCase.tsx` | `AvatarSelector.tsx`, `CrisisOverlay.tsx` |
| Hooks | `usePascalCase` | `useSessionToken.ts`, `useAvailability.ts` |
| Variables / functions | `camelCase` | `createSessionToken`, `validateScholarship` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`, `CRISIS_SLA_MINUTES` |
| Database tables | `snake_case` (Prisma default) | `session_record`, `vault_access_log` |
| Environment variables | `SCREAMING_SNAKE_CASE` | `STRIPE_SECRET_KEY`, `VAULT_API_SECRET` |
| Zod schemas | `PascalCaseSchema` suffix | `CheckoutSchema`, `ScholarshipApplySchema` |

### Max File / Function Length
- Max file length: **350 lines** (excluding types/interfaces in separate `.types.ts` files)
- Max function length: **40 lines** — extract sub-functions for anything beyond this
- Max component prop spread: **5 props** — prefer composition over prop drilling

### Export Conventions
- One primary export per file (class, function, or React component)
- Utility exports grouped at bottom of file
- Re-exports from `packages/types/src/index.ts` only — no deep imports across package boundaries
- No barrel (`index.ts`) files in `apps/` directories — only in `packages/`

### Import Ordering (top to bottom)
```typescript
// 1. Node built-ins
import fs from 'fs';

// 2. External packages
import { z } from 'zod';
import { clsx } from 'clsx';

// 3. Internal packages (workspace)
import { type SessionRecord } from '@hips/types';

// 4. Parent directory / sibling (same package)
import { validateSlot } from '../lib/slots';
import { CRisisOverlay } from '../components/CrisisOverlay'; // relative to file location

// 5. Types/interfaces (grouped, no side-effects)
import type { UserRole } from '@hips/types';
```

### Correct / Incorrect Code Examples

**Correct — Zod validation before DB write:**
```typescript
import { z } from 'zod';
import { db } from '@hips/db';

const BookSessionSchema = z.object({
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

const bookSession = async (input: unknown) => {
  const parsed = BookSessionSchema.parse(input); // throws on invalid
  return db.session.create({ data: parsed });
};
```

**Incorrect — raw request body to DB:**
```typescript
// NEVER DO THIS
const bookSession = async (req, res) => {
  return db.session.create({ data: req.body }); // no validation
};
```

**Correct — anonymous session token issuance:**
```typescript
const token = crypto.randomBytes(32).toString('hex');
// Token is issued in-memory; never written to commerce DB
// Reference stored only in session DB via anon ID
```

**Incorrect — session token linked to Firebase user:**
```typescript
// NEVER DO THIS
const token = signJwt({ userId: FirebaseUser.id, sessionId }); // breaks anonymity
```

---

## 4. Project Structure

```
hips-platform/
├── apps/
│   └── web/                        # Next.js 14 App Router
│       ├── app/
│       │   ├── (public)/           # homepage, services, donate, org inquiry
│       │   ├── (auth)/              # Firebase sign-in/up flows
│       │   ├── (app)/               # dashboard, book, checkout, scholarship
│       │   ├── (session)/           # anonymous session layer — avatar, voice
│       │   └── (admin)/             # admin panel (FACILITATOR/ADMIN only)
│       ├── components/
│       │   ├── ui/                 # Button, Input, Badge, Modal, Toast
│       │   ├── forms/               # React Hook Form + Zod wrappers
│       │   ├── booking/             # Calendar, ServiceCard
│       │   ├── checkout/            # StripeElements, DonationAddon
│       │   ├── session/             # AvatarSelector, VirtualOffice, VoiceControls
│       │   └── admin/               # ScholarshipQueue, RevenueChart
│       └── api/v1/                  # Commerce API route handlers
│
├── services/
│   ├── session/                    # NestJS — real-time voice + avatar
│   ├── vault/                      # NestJS — Identity Vault (KMS encrypted)
│   └── safety/                     # NestJS — Safety & Compliance Engine
│
├── packages/
│   ├── db/                         # Prisma schemas (commerce + session)
│   │   └── prisma/
│   │       ├── commerce.prisma
│   │       └── session.prisma
│   └── types/                      # Shared TS types + Zod schemas
│       └── src/
│           ├── index.ts             # public re-exports only
│           ├── copy-policy.ts       # banned-language list
│           ├── session.ts           # Session types + Zod schemas
│           ├── commerce.ts         # Commerce types + Zod schemas
│           └── vault.ts            # Vault types
│
├── .github/workflows/
│   └── ci.yml                      # install → typecheck → lint → test → build
├── .env.example
├── pnpm-workspace.yaml
└── turbo.json
```

### Where Key Logic Lives

| Concern | Location | Access Rule |
|---|---|---|
| Env vars | `apps/web/.env.local` (local); Vercel project settings (prod) | Never import directly; use `packages/types/src/config.ts` accessor |
| API calls (external) | `packages/types/src/client/` | Wrapped in typed client functions — no raw `fetch` in components |
| Zod schemas | `packages/types/src/` | Single source of truth; imported by API routes and services |
| Session auth tokens | `services/session` (in-memory only) | Never written to commerce DB |
| Identity Vault access | `services/vault` only | No route from session or commerce services |
| Types / interfaces | `packages/types/src/` | All other packages import from here — no copy-paste types |

### Config Layer (No Inline Secrets)
Environment variables are accessed via a typed config accessor in `packages/types/src/config.ts`. No service reads `process.env` directly.

```typescript
// packages/types/src/config.ts
export const config = {
  stripe: {
    secretKey: assertEnv('STRIPE_SECRET_KEY'),
    publishableKey: assertEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  },
  vault: {
    apiUrl: assertEnv('VAULT_API_URL'),
    apiSecret: assertEnv('VAULT_API_SECRET'), // never exposed to frontend
  },
} as const;
```

---

## 5. Three-Tier Boundary System

### Always Do (safe defaults — enforced on every task)
- Run `pnpm typecheck` and `pnpm lint` before opening a PR
- Add Zod validation to all new API endpoints before they reach a route handler
- Write unit tests for all new functions and hooks
- Write integration tests for all new API routes (auth + input validation covered)
- Use `assertEnv()` from `@hips/types` for all env var access
- Follow the import ordering rules in Section 3
- Keep files under 350 lines; functions under 40 lines
- Run `pnpm copycheck` before opening any PR touching UI copy, email templates, or service pages
- Add `@hips/types` re-export for any new shared type before using it across packages

### Ask First (high-impact gates — require approval before proceeding)
- Adding any new dependency to `package.json` (Tech Lead review required)
- Any change that touches authentication logic (senior engineer required)
- Any change that touches payment logic (senior engineer + security review)
- Any change that adds a field to an existing Prisma schema (DB migration plan required)
- Crossing a service boundary (does this create a path from session data to identity data?)
- Adding a new public API route (document rate limits + auth requirements before merging)
- Disabling or overriding a linter rule (document justification, Tech Lead sign-off required)
- Adding any `// @ts-ignore` or `any` type without documented safety comment

### Never Do (hard stops — zero tolerance)

| Rule | Why |
|---|---|
| Never commit a secret to version control | Breaks production security; triggers incident response |
| Never import across service boundaries (`apps/web` → `services/vault` or vice versa) | Breaks physical data separation |
| Never use `any` without a safety comment | Type safety is the first line of defense |
| Never write raw SQL or string interpolation in Prisma queries | Injection vector |
| Never disable `strict: true` in any `tsconfig.json` | Undermines type safety |
| Never bypass Zod validation on an API route | All inputs must be validated |
| Never allow `console.log` in production code (user data or request bodies) | PII in logs |
| Never add a dependency with an active `high` or `critical` CVE | Supply chain risk |
| Never add "therapy", "treatment", "diagnosis", or "clinical" to any surface without legal approval | Compliance violation; copy linter fail |
| Never allow mobile devices to initiate a session (enforced at token issuance) | Platform guarantee |
| Never allow a DB migration that is not backward-compatible | Zero-downtime deploy requirement |
| Never record a session without explicit pre-session opt-in consent | Platform guarantee |

---

## 6. Testing Standards

### Framework & File Colocation
- **Unit + Integration:** Vitest — co-located `*.test.ts` next to the file under test
- **E2E:** Playwright — `tests/e2e/` in `apps/web/`
- **Coverage tool:** Vitest built-in coverage (V8)

### Coverage Thresholds (block merge below these numbers)

| Package | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `apps/web` | 80% | 75% | 80% | 80% |
| `packages/types` | 90% | 85% | 90% | 90% |
| `packages/db` | 70% | 65% | 70% | 70% |
| `services/session` | 75% | 70% | 75% | 75% |
| `services/vault` | 85% | 80% | 85% | 85% |
| `services/safety` | 80% | 75% | 80% | 80% |

### Required Test Types
- **Unit** — every utility function, hook, and Zod schema
- **Integration** — every API route (happy path + auth failure + validation failure)
- **E2E** — critical flows: booking, checkout, donation, session entry, scholarship apply

### Command with Coverage
```bash
pnpm --filter @hips/web vitest run --coverage --coverage.provider=v8
```

Coverage reports are required for merge. PRs that drop coverage below threshold are blocked.

### When a New Test Is Mandatory
A new test (unit or integration) is required whenever:
- A new function is exported from any package
- A new API route is added
- A new Zod schema is created or modified
- A bug is fixed — regression test required alongside the fix
- A security-sensitive function is modified (auth, vault, payments)

---

## 7. Defect Definitions (Three-Tier Severity)

### Critical — Zero Tolerance (Blocks Deploy)

Examples — any of these found in a PR blocks merge immediately:

- Security vulnerability: exposed API key, missing auth on protected route, SQL injection vector, XSS in user input path
- Data loss risk: Prisma write without validation, cascade delete without soft-delete consideration
- Production crash: unhandled promise rejection, uncaught exception in API route, missing error boundary in React
- Broken core user flow: booking fails silently, checkout charges wrong amount, session token issuance broken
- Identity Vault breach or unauthorized access: any code that creates a path from session data to identity data
- Banned clinical language published to any surface

### Major — Blocks Merge

Examples — PR cannot merge until resolved:

- Feature doesn't match the approved spec (HIPS_PRD_v1.md)
- TypeScript type errors or unsafe `any` without safety comment
- Coverage drops below threshold
- Missing error handling on any API route (no `try/catch` + user-facing error response)
- Unauthorized dependency addition (new `package.json` entry without Tech Lead review)
- Performance regression: Lighthouse score drops >5 points on any category
- Rate limit not defined on new public endpoint
- Missing `required` Zod validation on any new API input field
- New cross-service import (vault ↔ commerce, session ↔ commerce)

### Minor — Non-blocking (Track and Fix)

Examples — tracked as issues, fixed in follow-up PRs:

- Naming convention violations (files, variables, constants)
- Missing JSDoc on exported functions in `packages/types`
- `console.log` in production code (not in hot path — remove)
- Style/formatting inconsistency (run `pnpm lint:fix` first)
- Max file length exceeded (refactor in follow-up PR)
- Missing `alt` text on images

---

## 8. Performance Budget

| Metric | Threshold | Warn At | Block Merge |
|---|---|---|---|
| Lighthouse Performance | ≥ 85 | < 85 | < 70 |
| Lighthouse Accessibility | ≥ 90 | < 90 | < 80 |
| Lighthouse Best Practices | ≥ 90 | < 90 | < 80 |
| Lighthouse SEO | ≥ 90 | < 90 | < 80 |
| First Contentful Paint (FCP) | < 1.8s | 1.8s–2.5s | > 2.5s |
| Largest Contentful Paint (LCP) | < 2.5s | 2.5s–3.5s | > 3.5s |
| Interaction to Next Paint (INP) | < 200ms | 200ms–400ms | > 400ms |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.1–0.25 | > 0.25 |
| JS Bundle (gzipped, initial) | < 180KB | 180KB–250KB | > 250KB |
| API response time p95 (commerce) | < 500ms | 500ms–800ms | > 800ms |
| WebRTC round-trip latency | < 200ms | 200ms–350ms | > 350ms |
| Build time (CI) | < 8 min | 8–12 min | > 12 min |

Lighthouse runs on every PR preview deployment via Vercel. Build time is tracked in GitHub Actions.

---

## 9. Reliability Targets (SLOs)

### Availability SLO
- **Target:** 99.5% uptime / 30 days (allowed downtime: ~3.6 hours/month)
- **Measurement:** Vercel uptime monitor + CloudWatch availability metric
- **Error budget:** If uptime drops below 99% in any 30-day window → feature freeze until retro

### Latency SLO
- **API p95 response:** < 500ms (commerce routes)
- **Session WebSocket connect:** < 2s (initial handshake)
- **Page LCP:** < 2.5s on laptop/desktop

### Error Rate SLO
- **5xx rate:** < 0.5% of total requests / hour
- **Stripe webhook failure rate:** < 0.1% / hour (replayed automatically)
- **Session disconnect rate:** < 1% of session attempts (reconnect logic handles this)

### Alert Thresholds
- Uptime < 99.9% in any 5-minute window → Slack `#platform-alerts` P1
- Uptime < 99% in any 30-minute window → PagerDuty P0
- 5xx rate > 1% / 5 minutes → PagerDuty P1
- Vault access outside crisis event → PagerDuty P0 immediate

---

## 10. Observability Requirements

### Structured Logging Format
All services must emit JSON logs with these required fields:
```json
{
  "timestamp": "2026-05-05T10:00:00.000Z",
  "level": "info|warn|error|debug",
  "service": "commerce|session|vault|safety",
  "traceId": "uuid",
  "userId": "Firebase-user-id or anon-session-id",
  "message": "string",
  "context": {}
}
```
Fields `traceId` and `service` are required on every log line. `userId` is required when a user context exists.

### Distributed Tracing
- OpenTelemetry instrumentation on all services
- `traceId` propagated via `X-Request-ID` header across all API calls
- Trace data exported to CloudWatch (AWS) or equivalent
- Vault KMS operations traced end-to-end via CloudTrail

### Required Metrics
- Request rate (requests/min per endpoint)
- Error rate (4xx, 5xx as % of total)
- Latency histograms (p50, p95, p99 per endpoint)
- Session token issuance rate
- Vault access count (per minute)
- Active WebRTC sessions (concurrent count)

### Required Health Endpoints
| Endpoint | Returns | Checks |
|---|---|---|
| `GET /healthz` | `200 OK` | Service process is alive |
| `GET /readyz` | `200 OK` | DB connection + dependent service health |

Commerce service `readyz` must verify: PostgreSQL (commerce DB) connectivity.
Session service `readyz` must verify: PostgreSQL (session DB) + LiveKit connectivity.
Vault service `readyz` must verify: PostgreSQL (vault DB) + KMS connectivity.

---

## 11. Incident Response

### SEV Levels

| SEV | Definition | Response SLA | Examples |
|---|---|---|---|
| **SEV-1** | Platform down or Identity Vault breach | Immediate (< 15 min), 24/7 | Vault DB exposed; session-identity join found; KMS key compromised; payments completely down |
| **SEV-2** | Major feature degraded, platform operational | 15 minutes, business hours | Stripe webhooks failing; auth broken; >25% of sessions dropping; vault access spike alarm |
| **SEV-3** | Minor feature degraded | 1 hour, business hours | Scholarship emails failing; group sessions degraded; non-critical email failures |

### Runbook Template (per critical path)

For each critical path, the runbook must document:
1. **Symptoms** — how to recognize the incident
2. **Blast radius** — who is affected and how much
3. **Diagnosis steps** — commands and logs to check
4. **Recovery / rollback steps** — step-by-step, copy-pasteable
5. **Escalation path** — who to call if steps 1–4 don't resolve within SLA

### Vault Breach (SEV-1) Response Order
1. Take vault service offline: `aws ecs update-service --cluster hips-prod --service hips-vault --desired-count 0`
2. Notify: Founder · Legal counsel · Senior engineer on call
3. Preserve all logs — do not delete, rotate, or modify
4. Identify scope: review `VaultAccessLog` + CloudTrail KMS calls
5. Engage HIPAA-capable cloud incident response team
6. Do not communicate externally until legal counsel advises
7. Document everything with timestamps
8. Do not restore service until: scope fully understood + root cause identified + remediation deployed + legal counsel approves

---

## 12. Deployment Standards

### Feature Flags
- All user-facing changes to commerce, booking, or session flows must ship behind a feature flag in Phase 1
- Flags managed via LaunchDarkly or environment-level flags in Vercel
- Flag must be documented in the PR description

### Canary / Staged Rollout
- Commerce frontend changes: Vercel preview URL per PR → promote to 5% production traffic → 25% → 100%
- Session service changes: deploy to staging first → full integration test pass → rolling deploy to production ECS tasks

### Rollback Time Objective (RTO)
- **Target:** < 5 minutes from detection to reverted state
- Vercel: instant rollback via deployment UI or `vercel rollback`
- ECS services: `aws ecs update-service --desired-count 0` (immediate) + redeploy previous task definition

### DB Migration Safety Rules
- All migrations must be **backward-compatible** — old code must run against new schema
- No `NOT NULL` columns without a default value added in the same deploy
- No column rename in a single migration — add new column + migrate data + drop old column across multiple deploys
- Migration files must have a corresponding down migration
- Test in staging before applying to production

### Zero-Downtime Deploy Requirement
- All ECS service deploys use rolling updates (`minimumHealthyPercent: 100%, maximumPercent: 200%`)
- Commerce frontend: Vercel handles zero-downtime automatically
- No maintenance window required for standard deploys; planned maintenance communicated 24 hours in advance

---

## 13. Data & Compliance

### PII Handling
- IP address: stored encrypted in Identity Vault only; 30-day TTL auto-expiry
- Device fingerprint: stored encrypted in Identity Vault only; 90-day TTL auto-expiry
- Real name + emergency contact: KMS-encrypted at rest in vault DB; TLS 1.3 in transit
- No PII in session DB — `AuditEvent.actorId` is hashed Firebase ID, not raw

### Audit Log Requirements
- All data access written to immutable log: actor + timestamp + action + target
- `VaultAccessLog`: INSERT + SELECT only for admin review role; no UPDATE or DELETE
- `AuditEvent`: INSERT + SELECT only for all application roles; no UPDATE or DELETE
- Audit logs retained: minimum 90 days; vault access logs retained indefinitely

### Data Deletion (GDPR/CCPA)
- Deletion request fulfilled within **30 days** of verified request
- Identity Vault record deleted (KMS key destruction) on verified participant request
- Session records anonymized (actor ID zeroed) but retained for safety compliance

### Backup & Restore
- Commerce DB: automated daily backups via Railway; 7-day retention; point-in-time restore verified quarterly
- Session DB: automated daily backups; 30-day retention; restore to staging verified quarterly
- Vault DB: automated daily backups; 30-day retention; restore to staging verified quarterly; KMS key restoration tested separately

### Secret Rotation Cadence
| Cadence | Secrets |
|---|---|
| Monthly | `VAULT_API_SECRET`, `SESSION_SERVICE_SECRET` |
| Quarterly | `RESEND_API_KEY`, `LIVEKIT_API_SECRET` |
| 90-day automated | KMS key (AWS automatic rotation) |
| On breach or engineer offboarding | Any secret, immediately |

---

## 14. Dependency & Supply Chain

### CVE Audit Command
```bash
pnpm audit --audit-level=high
```
- **Blocks merge** on any `high` or `critical` severity finding
- Run on every PR in CI; no exceptions
- Critical findings require immediate remediation or Tech Lead sign-off for tracking issue

### Lockfile Policy
- `pnpm-lock.yaml` is **committed** to version control
- CI runs with `--frozen-lockfile` — any lockfile change in a PR fails CI

### Version Pinning
- All Node.js dependencies pinned to exact version in `package.json`
- No ranges (`^`, `~`) for production dependencies
- Dev dependencies may use ranges but must be reviewed on update

### License Audit
- No new dependency added with a license incompatible with MIT/ISC + 501(c)(3) nonprofit operations
- GPL/AGPL licenses are **blocked** without Tech Lead + Legal review
- Run `pnpm licenses` (or equivalent) as part of the dependency review step

### Third-Party Service SLA Documentation
All external service dependencies must have a status page URL documented:
| Service | Status Page | SLA |
|---|---|---|
| Vercel | status.vercel.com | 99.9% |
| Stripe | status.stripe.com | 99.99% |
| Firebase Auth | status.firebase.google.com | GCP status |
| Railway | status.railway.app | Per plan |
| Resend | status.resend.com | Per plan |
| AWS (HIPAA VPC) | status.aws.amazon.com | Per plan |

---

## 15. Git Workflow

### Branch Naming
| Prefix | Use For | Example |
|---|---|---|
| `feature/` | New features | `feature/group-sessions` |
| `fix/` | Bug fixes | `fix/scholarship-cap-enforcement` |
| `chore/` | Tooling, deps, config | `chore/upgrade-pnpm-9` |
| `refactor/` | Code restructuring | `refactor/vault-api-client` |
| `docs/` | Documentation only | `docs/update-prd` |
| `security/` | Security changes | `security/vault-access-log` |

### Commit Message Format (Conventional Commits)
```
<type>(<scope>): <description>

types: feat | fix | docs | chore | refactor | security | test
scope: web | session | vault | safety | db | types | ci
examples:
  feat(web): add Stripe Elements checkout flow
  fix(session): prevent token reuse after session end
  security(vault): add vault access justification requirement
  docs(prd): update session capacity limits
```

### PR Requirements
- CI must be green (all stages passing)
- Minimum **1 reviewer approval** (2 for security-sensitive paths)
- Linked GitHub issue or PRD reference
- Description must include: what changed, why, and how to test
- Security-sensitive PRs (`vault`, `auth`, `payments`): senior engineer review required in addition to standard review
- `main` is always deployable — never merge a broken build

---

## 16. Definition of Done

A task is complete when **all** items pass:

1. Feature works per approved spec (HIPS_PRD_v1.md)
2. All tests pass: unit + integration + E2E
3. New tests written for all new logic (see Section 6)
4. `pnpm typecheck` — zero errors
5. `pnpm lint` — zero warnings, zero errors
6. `pnpm format --check` — zero formatting diffs
7. `pnpm audit` — zero high/critical CVEs
8. `pnpm copycheck` — zero banned-language violations
9. Performance budget not regressed (Lighthouse scores within threshold)
10. All new API routes documented with rate limits
11. Zod schemas for all new inputs added to `packages/types/src/`
12. Feature flag created (if user-facing commerce/session change)
13. PR reviewed and approved
14. QUALITY_BAR.md self-audit completed (Section 17)

---

## 17. Agent Self-Audit

After completing any task, run this checklist before handoff:

1. **Commands** — Do `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test` all pass?
2. **Defects** — Were any Critical or Major defects introduced? How resolved?
3. **Boundaries** — Were all Always Do / Ask First / Never Do rules respected?
4. **Tests** — Are new tests written for all new logic?
5. **Performance** — Are all budget thresholds still met?
6. **Observability** — Are new code paths logged and traced? (production)
7. **Security** — Are inputs validated? No secrets committed?
8. **Spec alignment** — Does the output match the feature spec exactly?

Report format:
- [item] — **passed**
- [item] — **deferred**, reason: [reason], ticket: [ref]
- [item] — **FAILED**, action taken: [description]

**Do not mark a task complete until all Critical items are resolved.**

---

## Lessons Learned

<!-- Add gotchas, footguns, and non-obvious decisions here as discovered -->

- **2026-05-05 Project**: Initial quality bar created. Key project-specific context: three physically separated DBs (commerce/session/vault) with strict cross-service import prohibition enforced by ESLint rule; Firebase Auth for commerce layer and custom anonymous session tokens for voice layer; NestJS microservices for session/vault/safety; all secrets in AWS Secrets Manager / Vercel; copy linter (`pnpm copycheck`) required on all UI and email surfaces.
