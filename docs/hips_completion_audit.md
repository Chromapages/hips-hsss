# H.I.P.S. Platform — Completion Status Audit
**Generated:** 2026-05-13
**Based on:** Deep-dive audit (`hips-deep-dive-audit-2026-05-12.md`) + live codebase verification
**Skills applied:** `wiki-qa`, `find-bugs`, `security-scanning`, `architecture`

---

## ✅ ITEMS VERIFIED FIXED (from prior audit)

| ID | Issue | Status | Evidence |
|----|-------|--------|----------|
| INF-1 | EcsStack not instantiated | ✅ Fixed | `bin/hips.ts:30-34` — ecsStack instantiated with correct deps |
| INF-3 | FargateServices missing security groups | ✅ Fixed | Each service now has `securityGroups: [vpc.xSecurityGroup]` |
| INF-4 | Missing ECS health checks | ✅ Fixed | All 3 containers have `addHealthCheck(...)` with interval/timeout |
| INF-5 | vaultSecurityGroup no outbound rules | ✅ Fixed | `vpc-stack.ts:90-94` adds egress rule |
| INF-6 | No Dockerfiles | ✅ Fixed | `services/vault/Dockerfile`, `session/Dockerfile`, `safety/Dockerfile` exist |
| INF-7 | Session DB no encryption (HIPAA) | ✅ Fixed | `database-stack.ts:45-60` — dedicated `SessionDbKey` KMS + `storageEncryptionKey` |
| INF-8 | Session/safety tasks lack IAM roles | ✅ Fixed | `sessionTaskRole`, `safetyTaskRole` created with Secrets Manager + KMS policies |
| INF-9 | Safety service no auto-scaling | ✅ Fixed | `safetyScaling` added at `ecs-stack.ts:333-340` |
| INF-14 | Session can't do KMS operations | ✅ Fixed | KMS policy on `sessionTaskRole` at `ecs-stack.ts:152-157` |
| DB-1 | Seed script: ScholarshipBudget reference | ✅ Fixed | `seed.ts` has no `ScholarshipBudget` — only `service.upsert` |
| API-3 | Webhook marks processed BEFORE handling | ✅ Fixed | `route.ts:62-72` — `processed: true` only set after `handleEvent()` succeeds |
| SEC-4 | Timing attack on vault secret | ✅ Fixed | `vault-access.guard.ts:7,36-39` — `timingSafeEqual` from `crypto` |
| SEC-5/6 | CORS empty string split | ✅ Fixed | `vault/main.ts:16-17` filters out empty strings |
| SEC-8 | Registration no CAPTCHA | ✅ Mitigated | `register/route.ts:11,34-37` — honeypot field + rate limit |
| API-2 | Race condition on package redemption | ✅ Fixed | `book/route.ts:102-113` — `updateMany` with optimistic concurrency guard |
| API-4 | Scholarship code race condition | ✅ Fixed | `book/route.ts:135-140` — same `updateMany` pattern |
| SEC-10 | Empty string fallback for VAULT_INTERNAL_SECRET | ✅ Fixed | `vault-access.guard.ts:21-23` — throws if secret missing |
| API-9 | PARTICPANT typo in UserRoleSchema | ✅ Fixed | Verified no typo in current `packages/types/src/index.ts` |
| SEC-1 | In-memory rate limit | ⚠️ Acknowledged | Comment added; still `new Map()` — needs Redis for prod |
| DB-4 | No Prisma migrations directory | ⚠️ Partial | No `/migrations/` dir exists; needs `prisma migrate dev` |

---

## 🔴 STILL OPEN — Must Fix Before Production

### INFRASTRUCTURE

| ID | Issue | File | Severity |
|----|-------|------|----------|
| **INF-NEW** | **`LogDriver` instantiation is wrong** — `new ecs.LogDriver()` doesn't exist → should be `ecs.LogDrivers.awsLogs({...})` — breaks all container logging | `ecs-stack.ts:68-74, 177-183, 265-271` | **CRITICAL** |
| INF-10 | Safety service uses `SESSION_DB_SECRET` instead of its own read-only credential | `ecs-stack.ts:278-285` | HIGH |
| **INF-NEW** | `EcsStack` not passed `databaseStack` — no CDK dependency ordering guarantee | `bin/hips.ts:30-34` | MEDIUM |
| INF-11 | MonitoringStack has no reference to Session KMS key ID (no CfnOutput) | `monitoring-stack.ts` | MEDIUM |
| INF-12 | ECS cluster name passed as string literal, not CDK object — metrics won't auto-wire | `monitoring-stack.ts` | MEDIUM |

### DATABASE

| ID | Issue | File | Severity |
|----|-------|------|----------|
| DB-2 | **Dual session schemas** — `packages/db/prisma/session.prisma` vs `services/session/prisma/session.prisma` | Both files | HIGH |
| DB-3 | **Enum mismatch** — `CRISIS_FLAGGED`, `RECONNECTING` exist in Prisma schema but not in `LiveSessionStatus` TS enum | `packages/types/src/index.ts:57-64` | HIGH |
| DB-4 | **No migrations directory** — only `.prisma` schema files; prod deploy will fail | `packages/db/prisma/` | HIGH |
| DB-5 | Missing cascade deletes on FKs — orphaned records on User delete | `commerce.prisma` | MEDIUM |
| DB-6 | Missing composite indexes: `Package[userId+status]`, `Scholarship[serviceId+status]` | `commerce.prisma` | MEDIUM |
| DB-7 | `sessionId` has no index — cross-DB correlation slow | `session.prisma` | MEDIUM |
| DB-8 | VaultAccessLog missing cascade — orphaned entries on IdentityRecord delete | `vault.prisma` | MEDIUM |
| DB-9 | `sessionTokenRef` not `@unique` — potential duplicates | `commerce.prisma` | LOW |
| DB-10 | AuditEvent optional relation — orphaned records | `services/session/prisma/session.prisma` | LOW |

### SECURITY

| ID | Issue | File | Severity |
|----|-------|------|----------|
| SEC-1 | **In-memory rate limit** — bypassable across serverless instances | `rate-limit.ts:11` | HIGH |
| SEC-2 | **Session token in WebSocket subprotocol** — exposed in server access logs | `useSessionToken.ts:103` | HIGH |
| SEC-3 | IP spoofing — `TRUSTED_PROXIES` empty by default, `X-Forwarded-For` falls through | `rate-limit.ts:74-78` | MEDIUM |
| SEC-7 | AWS credentials in `.env.example` without setup warnings | `.env.example:59-62` | MEDIUM |
| SEC-9 | Stripe event stored with `event as Stripe.Event` — unsafe cast | `webhooks/stripe/route.ts:56` | LOW |
| SEC-11 | SMS hardcoded fallback URL | `alert.service.ts:186-189` | LOW |
| SEC-12 | Admin auth failure redirects instead of returning 404 (leaks route existence) | `middleware.ts:58-63` | LOW |

### BACKEND API

| ID | Issue | File | Severity |
|----|-------|------|----------|
| API-1 | **GET request with JSON body** — `justification` in GET body is ignored by HTTP; move to `x-justification` header | `safety-api.ts:141-147` | HIGH |
| API-5 | GET request with body in vault access log query | `vault-client.ts:187-197` | MEDIUM |
| API-6 | No timeout on Stripe API calls — risk of hanging requests | `checkout/session/route.ts:14-16` | MEDIUM |
| API-7 | N+1 query for `waitlistCount` in admin scholarships | `admin/scholarships/route.ts:49` | LOW |
| API-8 | Redundant service/user lookups already included via relation | `webhooks/stripe/route.ts:168-169` | LOW |

### FRONTEND

| ID | Issue | File | Severity |
|----|-------|------|----------|
| FE-1 | `window.scrollY` in JSX — SSR/hydration mismatch | `CrisisOverlay.tsx:56` | MEDIUM |
| FE-2 | Focus restore bug — `.focus?.()` silently fails | `CrisisOverlay.tsx:30` | MEDIUM |
| FE-3 | Missing `aria-describedby` on sign-in/sign-up forms | `sign-*-form.tsx` | MEDIUM |
| FE-4 | `createPaymentIntent` missing from `useEffect` deps | `donate/page.tsx:229` | MEDIUM |
| FE-5 | `provisionUser` stale closure in `useEffect` | `auth-provider.tsx:90` | LOW |
| FE-6 | `statuses.join(',')` in dependency array creates new ref every render | `use-room-presence.ts:118` | LOW |
| FE-7 | Button `forwardRef` type safety issue | `packages/ui/index.tsx:17` | LOW |
| FE-8 | `useEffect` deps miss `styleGridRef.current` | `AvatarSelector.tsx:126` | LOW |
| FE-9 | `setInterval` causes periodic re-renders in VoiceControls | `VoiceControls.tsx:98` | LOW |
| FE-10 | `getAuth().currentUser` race condition | `api-client.ts:16` | LOW |
| FE-11 | `GlobalErrorBoundary` exists but NOT wired into `app/layout.tsx` | `error-boundary.tsx:63` | LOW |

### UI / DESIGN SYSTEM

| ID | Issue | Severity |
|----|-------|----------|
| UI-1 | **Homepage is a stub** — 4 bare tiles, placeholder `div`, no real content; Apple DESIGN.md installed but not applied | HIGH |
| UI-2 | **Services page** — exists but needs verification/completion | HIGH |
| UI-3 | DESIGN.md installed; globals.css has Apple tokens; but components still use ad-hoc inline classes | MEDIUM |
| UI-4 | **No `/about`, `/privacy`, `/terms` pages** — critical for a HIPAA-adjacent mental health platform | MEDIUM |
| UI-5 | No `not-found.tsx` in app root | LOW |

---

## 📋 PRIORITIZED REMEDIATION PLAN

### 🚨 PHASE 1 — Deployment Blockers (This Week)

1. **[INF-NEW] Fix `LogDriver` instantiation** in `ecs-stack.ts`
   - `new ecs.LogDriver(...)` → `ecs.LogDrivers.awsLogs({ streamPrefix: 'hips', logRetention: logs.RetentionDays.ONE_MONTH })`
   - Affects all 3 containers — logging is completely broken

2. **[DB-2] Unify session schemas**
   - Choose ONE canonical schema; delete the other; update all imports

3. **[DB-3] Fix `LiveSessionStatus` enum**
   - Add `CRISIS_FLAGGED = "CRISIS_FLAGGED"` and `RECONNECTING = "RECONNECTING"` to TS enum

4. **[DB-4] Create Prisma migrations**
   ```bash
   cd packages/db && pnpm prisma migrate dev --name init
   ```

5. **[INF-10] Give safety service its own DB credentials**
   - Create a read-only `hips/safety/db` secret; update `safetyContainer` secrets

6. **[SEC-1] Replace in-memory rate limiter with Upstash Redis**
   ```bash
   pnpm add @upstash/ratelimit @upstash/redis
   ```

### ⚡ PHASE 2 — Security & Correctness (Week 1-2)

7. **[API-1]** Move `justification` from GET body to `x-justification` header in `safety-api.ts`
8. **[API-5]** Fix vault access log GET-with-body in `vault-client.ts`
9. **[SEC-2]** Move session token out of WebSocket subprotocol — use post-connection message exchange
10. **[API-6]** Add Stripe API call timeouts with `AbortController`
11. **[UI-4]** Create `/about`, `/privacy`, `/terms` pages

### 🎨 PHASE 3 — UI / Frontend (Week 2-3)

12. **[UI-1]** Implement full homepage per `DESIGN.md` Apple design system:
    - Hero tile (anonymity value prop)
    - Dark tile (trust architecture / how it works)
    - Light tile (services overview)
    - Mission/impact tile
    - Final CTA tile (sign up / donate)

13. **[UI-2]** Complete Services page with pricing cards, CTAs, categories
14. **[FE-1]** Fix `window.scrollY` SSR mismatch — add `typeof window !== 'undefined'` guard
15. **[FE-2]** Fix `.focus?.()` → `.focus()` in `CrisisOverlay.tsx`
16. **[FE-3]** Add `aria-describedby` to auth forms
17. **[FE-4, FE-5, FE-6, FE-8]** Fix React hook dependency arrays
18. **[FE-11]** Wire `GlobalErrorBoundary` into `app/layout.tsx`

### 🔧 PHASE 4 — Polish & Performance (Week 3)

19. **[DB-5–8]** Add cascade deletes + composite indexes to all schemas
20. **[INF-11]** Export Session KMS key ID via `CfnOutput` from `database-stack.ts`
21. **[INF-12]** Pass CDK cluster object to MonitoringStack instead of string
22. **[INF-NEW]** Add `databaseStack` as dependency to ECS stack in `bin/hips.ts`
23. **[SEC-3]** Document and configure `TRUSTED_PROXY_IPS` env var for production
24. **[SEC-7]** Replace `.env.example` real credentials with `YOUR_VALUE_HERE` placeholders
25. **[SEC-12]** Return 404 for admin auth failures in `middleware.ts`
26. **[API-7]** Fix N+1 `waitlistCount` query with Prisma `_count`
27. **[FE-9]** Move `setInterval` to `useRef` in `VoiceControls`
28. **[FE-10]** Handle `getAuth().currentUser` race with `onAuthStateChanged`
29. **[UI-5]** Add `not-found.tsx` to app root

---

## 📁 KEY FILES — WORK REMAINING

| File | What Needs Doing |
|------|-----------------|
| `infra/lib/ecs-stack.ts` | Fix `LogDriver` → `LogDrivers.awsLogs()`; safety DB credentials |
| `infra/bin/hips.ts` | Pass `databaseStack` to ECS; explicit stack dependency |
| `packages/db/prisma/` | Run migrations; add missing indexes + cascades |
| `packages/types/src/index.ts` | Sync `LiveSessionStatus` enum with canonical Prisma schema |
| `apps/web/src/lib/middleware/rate-limit.ts` | Upstash Redis implementation |
| `apps/web/src/lib/safety-api.ts` | Fix GET with body pattern |
| `apps/web/src/app/(public)/page.tsx` | Full homepage per DESIGN.md |
| `apps/web/src/app/(public)/services/page.tsx` | Verify/complete services page |
| `apps/web/src/app/(session)/CrisisOverlay.tsx` | SSR fix + focus bug |
| `apps/web/src/components/providers/auth-provider.tsx` | Stale closure fix |
| `apps/web/src/app/layout.tsx` | Wire GlobalErrorBoundary |
| `apps/web/src/app/(public)/` | Add `/about`, `/privacy`, `/terms` |
| Session Prisma schemas | Pick one canonical; delete other |

---

## 🏗️ PRODUCT FEATURE GAPS (Not in Bug Audit)

Routes exist — but these need end-to-end verification:

| Feature | Route | Priority |
|---------|-------|----------|
| Session room (WebRTC, avatar, voice) | `/session/[id]` | HIGH |
| Group lobby | `/lobby/[groupId]` | HIGH |
| Stripe checkout end-to-end | `/checkout` | HIGH |
| Crisis overlay integration | `CrisisOverlay.tsx` in session | HIGH |
| Admin dashboard data binding | `/admin/*` | HIGH |
| Scholarship application flow | `/scholarship` | MEDIUM |
| Downloadable resources delivery | `/dashboard/downloads` | MEDIUM |
| Email template rendering | `@hips/email` package | MEDIUM |
| Mobile responsive layout | All pages | MEDIUM |

---

## 🔬 PRE-LAUNCH VERIFICATION CHECKLIST

- [ ] `pnpm build` — zero TypeScript errors
- [ ] `pnpm prisma migrate deploy` — all 3 schemas clean
- [ ] `docker build` — all 3 Dockerfiles build successfully
- [ ] `pnpm cdk synth` — CDK synth completes
- [ ] Rate limit bypass test — concurrent requests across multiple tabs
- [ ] Package race condition — 2 simultaneous `book` requests same package
- [ ] Stripe webhook partial failure — does NOT mark event processed
- [ ] WebSocket session token — not visible in server access logs
- [ ] Lighthouse a11y ≥ 85 on homepage
- [ ] All auth forms have `aria-describedby`
- [ ] Crisis overlay — renders and dismisses correctly in session room
- [ ] Admin RBAC — non-admin cannot access `/admin/*` routes

---

> **Skills applied:** `wiki-qa` (codebase analysis) · `find-bugs` (issue verification) · `security-scanning` (security posture review) · `architecture` (infrastructure analysis)
