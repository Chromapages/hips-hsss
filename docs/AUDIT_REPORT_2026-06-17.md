# H.I.P.S. Full Project Audit Report

**Date:** 2026-06-17
**Auditors:** 7 parallel agents (Frontend, Backend Services, Documentation, Error Diagnostics, Performance, Security, Git/DevOps)
**Branch:** `main` / `continue-phase-3`

---

## Executive Summary

The H.I.P.S. platform is a monorepo with a Next.js frontend (`apps/web`), shared packages (`db`, `types`, `ui`), and 4 backend services (`commerce`, `safety`, `vault`, `session`). The codebase is large (~378 files changed in the last commit), feature-rich, and actively developed — but carries significant technical debt, security vulnerabilities, and documentation drift.

**Overall Assessment: ⚠️ Production-Ready with Critical Fixes Required**

The platform has solid foundations (Stripe webhook verification, MFA, timing-safe comparisons, role-based access), but has accumulated ~150+ findings across 7 audit dimensions. Approximately **25 are critical severity** requiring immediate attention before any production deployment.

---

## 🔴 CRITICAL Severity — Fix Immediately

### CR-S1: Light Mode Text Nearly Invisible
**File:** `apps/web/src/app/globals.css:103`

```css
/* WRONG — near-white text on white background */
--color-text: oklch(0.97 0 0);  /* L:97%, C:0 — virtually invisible on #FFFFFF */
```

**Expected:** Dark value like `oklch(0.13 0.01 260)` for navy text on white.
**Impact:** All light-mode text is unreadable.
**Fix:** Swap `--color-text` values between `:root` and `[data-theme="dark"]`.

---

### CR-S2: Firebase Admin Private Key Path in .env
**File:** `.env:4`

```bash
FIREBASE_ADMIN_SDK_KEY=/Users/mimac/WORK/ChromaWork/hips-hsss/firebase-admin.json
```

**Issue:** The private key file is gitignored, but its local path is hardcoded in `.env`. If `.gitignore` is ever modified or the file staged, the GCP service account key is exposed.
**Fix:** Use a secrets manager (GCP Secret Manager, AWS Secrets Manager, or Vercel Env Vars). Never reference local filesystem paths for secrets in production.

---

### CR-S3: Database Credentials in Plain-Text .env
**File:** `.env:15-18`

```bash
DATABASE_URL=postgresql://king_lewie:hips123@127.0.0.1:5432/commerce_db
SESSION_DATABASE_URL=postgresql://king_lewie:hips123@127.0.0.1:5432/session_db
SAFETY_DATABASE_URL=postgresql://king_lewie:hips123@127.0.0.1:5432/safety_db
VAULT_DATABASE_URL=postgresql://vault:hips123@127.0.0.1:5432/vault_db
```

**Issue:** Plain-text credentials for all 4 databases. If `.env` is committed or accessed by unauthorized parties, all DB credentials are compromised.
**Fix:** Move to `.env.local` (never committed). Use `process.env` in code — no file paths. Rotate credentials immediately.

---

### CR-S4: Hardcoded Identical Service Secrets
**File:** `.env:24-28`

```bash
SESSION_SERVICE_SECRET=653e1635a91ba4c4dd36ba2936e90e1d3f015ffde16e03cd8dd642f570dbf0a2
SESSION_ANONYMISATION_KEY=653e1635a91ba4c4dd36ba2936e90e1d3f015ffde16e03cd8dd642f570dbf0a2
SUDO_TOKEN_SECRET=653e1635a91ba4c4dd36ba2936e90e1d3f015ffde16e03cd8dd642f570dbf0ab
HANDLE_DERIVATION_KEY=653e1635a91ba4c4dd36ba2936e90e1d3f015ffde16e03cd8dd642f570dbf0ac
SAFETY_SERVICE_SECRET=f98d6350ad23419bb6e289bf656a8d7d3f015ffde16e03cd8dd642f570dbf0a4
```

**Issue:** Secret reuse across services. If one is compromised, all are compromised. The anonymisation key and session service secret are identical.
**Fix:** Unique secrets per service. Use a secrets manager.

---

### CR-S5: LiveKit API Secret as NEXT_PUBLIC_ Variable
**File:** `.env:30-34`

```bash
NEXT_PUBLIC_LIVEKIT_API_KEY=APIVtA5bMUkwUZo
NEXT_PUBLIC_LIVEKIT_API_SECRET=C6tkcQ3PEZLthXmzH53LgArn6qG9uWMCHhfbMyqEHHJ  # ← NEVER PUBLIC
```

**Issue:** `NEXT_PUBLIC_LIVEKIT_API_SECRET` is exposed to the browser. While the token generation route correctly uses server-only vars, the `NEXT_PUBLIC_` prefix is dangerous — it signals to developers that the value is safe to expose when it is not.
**Fix:** Remove `NEXT_PUBLIC_LIVEKIT_API_SECRET` from `.env`. Token generation should only read `LIVEKIT_API_SECRET` (server-only).

---

### CR-S6: SAFETY_ENGINE_URL SSRF Vector — No Production Guard
**Files:**
- `apps/web/src/app/api/safety/ingest/route.ts:9`
- `apps/web/src/app/api/safety/flag/route.ts:9`
- `apps/web/src/app/api/admin/crisis-access/route.ts:6`

```typescript
const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';
```

**Issue:** If `SAFETY_ENGINE_URL` is not set in production, all session transcripts and safety reports are proxied to `localhost:3003` on the app server — a critical SSRF vector, especially if behind a corporate firewall or containerized where localhost is not trustworthy.
**Fix:** Make `SAFETY_ENGINE_URL` a **required** env var with no fallback. Fail fast if missing:

```typescript
const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL;
if (!SAFETY_ENGINE_URL && process.env.NODE_ENV === 'production') {
  throw new Error('SAFETY_ENGINE_URL is required in production');
}
```

---

### CR-S7: Donations Bypass Authentication
**File:** `apps/web/src/app/api/checkout/demo-confirm/route.ts:54-57`

```typescript
// DONATION type skips authentication check entirely
if (type !== 'DONATION' && !firebaseUid) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Issue:** An attacker can flood the donations collection with fake entries in demo mode without any authentication.
**Fix:** Require authentication for all types, or implement IP-based rate limiting + captcha for unauthenticated donations.

---

### CR-S8: Build Error Suppression Masks Type Problems
**File:** `apps/web/next.config.ts:129-134`

```typescript
typescript: { ignoreBuildErrors: true, },
eslint: { ignoreDuringBuilds: true, },
```

**Issue:** All TypeScript errors and ESLint violations are silently ignored during builds. `any` type abuse and type mismatches accumulate undetected.
**Fix:** Set `ignoreBuildErrors: false`. Fix type errors systematically. Use `// @ts-expect-error` as an opt-in exception per-file.

---

### CR-A1: No Logout UI — Users Stuck Logged In
**Files:** Entire `(auth)` route group

**Issue:** `POST /api/auth/session` DELETE (at `route.ts:85`) clears the session cookie, but no page or component ever calls it. No logout button exists in the auth UI. Users must manually clear browser storage to sign out.
**Fix:** Add a logout button to the navbar or settings that calls `POST /api/auth/session` with `action: 'logout'`.

---

### CR-A2: MFA Session Failure Silently Swallows Errors
**File:** `apps/web/src/app/(auth)/login/page.tsx:132-135`

```typescript
const mfaRes = await fetch('/api/auth/mfa/session', { ... });
if (!mfaRes.ok) {
  setLoading(false);  // ← User sees spinner disappear, no error message
  return;
}
```

**Issue:** When `mfaRes.ok` is false, the login form just stops loading with no error feedback to the user. The user is left at the login form with no indication what went wrong.
**Fix:** Show a descriptive error message (e.g., "Authentication failed. Please try again.") before `setLoading(false)`.

---

### CR-A3: Admin Sessions Not Revocable
**File:** `apps/web/src/app/api/auth/session/route.ts:51-52`

```typescript
const isAdmin = (ADMIN_ROLES as readonly Role[]).includes(userRole as Role);
const maxAge = isAdmin ? 60 * 60 * 4 : 60 * 60 * 24 * 7;  // Admin: 4h, User: 7 days
```

**Issue:** If an admin account is compromised, the attacker has up to 4 hours of access. There is no session revocation list (Redis blacklist) to immediately invalidate sessions.
**Fix:** Implement Redis-backed session revocation. On admin action (role change, suspected compromise), add the session ID to a blacklist with TTL matching the session max age.

---

### CR-A4: HMAC-Based LiveKit Identity Is Reversible
**File:** `apps/web/src/app/api/livekit/token/route.ts:192`

```typescript
const uidToHash = principal.kind === 'firebase' ? principal.uid : principal.ref;
const anonymousIdentity = crypto.createHmac('sha256', apiSecret).update(uidToHash).digest('hex');
```

**Issue:** The "anonymous" identity is a deterministic HMAC of the Firebase UID. Anyone who knows (or can guess) the Firebase UID and the `apiSecret` can reverse-engineer the anonymous identity — a correlation attack violating the anonymous session guarantee.
**Spec Violation:** `HIPS_Implementation_Plan_Part1.md` says "opaque random token (32 bytes, hex-encoded)" — not a deterministic hash.
**Fix:** Generate a cryptographically random 64-char hex token on session join, store `(sessionId, firebaseUid) → randomToken` in Firestore, use only the random token as the LiveKit identity.

---

### CR-A5: isSessionMember Check Always Fails
**File:** `apps/web/src/app/api/safety/flag/route.ts:34-35`

```typescript
const isMember = participantIdentities.includes(firebaseUid);
// participantIdentities contains HMAC-hashed values, NOT Firebase UIDs
```

**Issue:** `participantIdentities` in Firestore stores HMAC-hashed anonymous identities. The check `includes(firebaseUid)` will never match. Safety reports from actual session participants are incorrectly rejected.
**Fix:** Look up the anonymous identity by `(sessionId, firebaseUid)` from `session_participants`, then compare against the stored hashed identity.

---

## 🟠 HIGH Severity

### HF-1: No .env.example — Zero Env Var Documentation
**File:** Project root (missing)

**Issue:** Developers onboarding have no reference for which environment variables are required. The `next.config.ts` `env` block also does not declare the `NEXT_PUBLIC_` vars used across the codebase.
**Missing vars** documented in code but not in any `.env.example`:
- `NEXT_PUBLIC_DEMO_MODE`, `NEXT_PUBLIC_LIVEKIT_URL`, `NEXT_PUBLIC_LIVEKIT_WS_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `FIREBASE_STORAGE_BUCKET`, `SAFETY_ENGINE_URL`, `LIVEKIT_URL`, `HOST_ACCESS_CODE`

**Fix:** Create `apps/web/.env.example` listing all vars with descriptions and placeholder values. Update `next.config.ts` `env` block to explicitly enumerate all `NEXT_PUBLIC_` vars.

---

### HF-2: 45+ macOS `._` Artifact Files Committed
**Locations:** Throughout `apps/web/src/` and `services/` directories

**Files:** `._CrisisEscalation.tsx`, `._PageShell.tsx`, `._SessionExperience.tsx`, `._AuthProvider.tsx`, `._AvailabilityCalendar.tsx`, `._CheckoutForm.tsx`, `._CheckoutShell.tsx`, `._DashboardLayout.tsx`, `._PackageBalanceCard.tsx`, `._SessionHistoryTable.tsx`, `._OrganizationIntakeForm.tsx`, `._ScholarshipForm.tsx`, `._LobbyClient.tsx`, `._GlobalDisclaimerBanner.tsx`, `._ImpactStats.tsx`, `._Navbar.tsx`, `._PricingSwitcher.tsx`, `._RouteChrome.tsx`, `._ToastProvider.tsx`, `._AvatarSelectorModal.tsx`, `._CrisisResourceOverlay.tsx`, `._VoiceControlsBar.tsx`, `._AbstractAvatar.tsx`, `._AvatarCanvas.tsx`, `._SafetyMonitor.tsx`, `._SanctuaryParticles.tsx`, `._SanctuaryScene.tsx`, `._SessionRoom.tsx`, `._button.tsx`, `._card.tsx`, `._empty-state.tsx`, `._error-state.tsx`, `._input.tsx`, `._skeleton.tsx`, `._textarea.tsx`, and API route variants.

**Issue:** These are macOS AppleDouble metadata files from `rsync -a` or Time Machine. They are ignored by Next.js but pollute the repo.
**Fix:** `find . -name '._*' -type f -delete` and add `.*` to `.gitignore` patterns if not already present.

---

### HF-3: Duplicate Component Trees — Two `session/` Directories
**Files:**
- `apps/web/src/components/session/SessionRoom.tsx`
- `apps/web/src/app/components/session/SessionRoom.tsx`
- Same pattern for: `VoiceControlsBar`, `SessionHeader`, `MobileBlockPage`, `WebGLFallback`

**Issue:** Two different files with identical names in different locations. The one in `app/components/session/` appears to be a legacy copy that may be unused. Creates confusion about which is loaded.
**Fix:** Identify which tree is actually used (check imports), delete the other copy.

---

### HF-4: Admin Sub-Routes Missing error.tsx / loading.tsx
**Files:**
- `(admin)/admin/safety/` — no `error.tsx`, no `loading.tsx`
- `(admin)/admin/scholarships/` — no `error.tsx`, no `loading.tsx`
- `(admin)/admin/bookings/` — no `error.tsx`, no `loading.tsx`
- `(admin)/admin/errors/` — no `loading.tsx`

**Issue:** Missing error boundaries and loading states for route segments. Errors in sub-routes bubble up to the nearest error boundary, which may be the admin layout — not ideal UX.
**Fix:** Add `error.tsx` and `loading.tsx` to each admin sub-segment.

---

### HF-5: Stripe PACKAGE_PURCHASE Doesn't Verify Paid Amount
**File:** `apps/web/src/app/api/stripe/webhook/route.ts:116-136`

```typescript
// Handler for metadata.type === 'PACKAGE_PURCHASE'
// Does NOT verify that the payment amount matches the expected package price
// Attacker could create a $0.01 PaymentIntent and receive full credits
```

**Issue:** Malicious actor creates a `PACKAGE_PURCHASE` payment intent for $0.01, Stripe sends `payment_intent.succeeded`, system credits their account with the full package value.
**Fix:** In the webhook handler, look up the package price server-side and verify `paymentIntent.amount === expectedPriceInCents`.

---

### HF-6: DemoModeContext Defaults isDemo=true — Demo Mode Always On
**File:** `apps/web/src/contexts/DemoModeContext.tsx:15`

```typescript
// No prop passed = isDemo hardcoded to true
const isDemo = props.isDemo ?? true;
```

**Issue:** If `DemoModeProvider` is rendered anywhere without passing `isDemo={false}`, demo mode is permanently on for that render tree. Likely culprit: `layout.tsx` rendering `<DemoModeProvider>` without the env var.
**Fix:** Default to `false`. Read `NEXT_PUBLIC_DEMO_MODE` from the environment as the default.

---

### HB-1: crisisLevel Missing from EscalateAlertSchema — Runtime Error
**Files:**
- `services/safety/src/escalation/escalation.service.ts:238`
- `services/safety/src/safety/safety.schemas.ts:20-25`

```typescript
// escalation.service.ts:238
if (alert.severity !== 'CRITICAL' && dto.crisisLevel !== 'STANDARD') {

// EscalateAlertSchema — only defines actorId and reason, NOT crisisLevel
```

**Issue:** `dto.crisisLevel` is accessed but never defined in the schema. For non-CRITICAL alerts, this will be `undefined`, causing unpredictable behavior.
**Fix:** Add `crisisLevel: z.enum(['STANDARD', 'URGENT', 'CRITICAL']).optional()` to `EscalateAlertSchema`.

---

### HB-2: Crisis Access Endpoint Is a Hardcoded 503 Stub
**File:** `services/safety/src/safety/safety.controller.ts:84-96`

```typescript
@Post('crisis-access')
async crisisAccess(@Body() body: unknown) {
  throw new HttpException({
    message: 'Crisis access service is currently unavailable. Vault integration is pending.',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  }, HttpStatus.SERVICE_UNAVAILABLE);
}
```

**Issue:** The crisis access endpoint always returns 503. It should either be implemented properly or marked `@Deprecated` so callers don't attempt to use it.
**Fix:** Either implement the vault-based crisis access or remove the endpoint and update callers.

---

### HB-3: Alert Status Has No Transition Validation
**File:** `services/safety/src/safety/safety.service.ts:419-469`

```typescript
const updated = await this.prisma.safetyAlert.update({
  where: { id: alertId },
  data: { isResolved: status === 'RESOLVED' },
});
// No check: if alert.isResolved already === true and status === 'RESOLVED'
```

**Issue:** An already-resolved alert can be "re-resolved" without going through a proper reopen-then-resolve flow. Also, `action` is always `'WARNING'` even when resolving (line 442).
**Fix:** Validate current state before transition. Add state machine: `OPEN → RESOLVED` allowed, `RESOLVED → OPEN` (reopen) allowed, `RESOLVED → RESOLVED` should be rejected.

---

### HB-4: Vault Crisis Protocol Throws on PII Failure — No Graceful Degradation
**File:** `services/safety/src/safety-engine/crisis-protocol.service.ts:108-114`

```typescript
if (!vaultSuccess) {
  throw new BadRequestException(
    'Crisis protocol activation failed: PII lookup failed after all retries.'
  );
}
```

**Issue:** If Vault is unavailable after retries, the entire crisis protocol fails and throws. In a genuine emergency, this could prevent crisis response. The caller should decide whether to proceed without PII.
**Fix:** Return partial success with `{ vaultAvailable: false, pii: null }` instead of throwing. Let the caller decide.

---

### HB-5: 20+ Instances of `any` Type Abuse
**Selected critical instances:**

| File | Line | Issue |
|------|------|-------|
| `apps/web/src/lib/redis.ts` | 10, 47 | Redis client typed as `any` |
| `apps/web/src/app/api/admin/audit-log/route.ts` | 18 | `where: any` in Prisma query |
| `apps/web/src/app/api/admin/exports/inquiries/route.ts` | 34 | `where: any` |
| `apps/web/src/app/api/admin/exports/scholarships/route.ts` | 32 | `where: any` |
| `apps/web/src/app/api/admin/stats/route.ts` | 33 | `recentAlerts: any[]` |
| `apps/web/src/components/demo/PitchShiftProcessor.ts` | 4, 5 | AudioWorkletProcessor `any` |
| `apps/web/src/components/checkout/CheckoutForm.tsx` | 19 | `event: any` |
| `services/session/src/escalation/escalation.service.ts` | 12 | `type SessionPrismaClient = any` |
| `services/commerce/src/commerce/commerce.controller.ts` | 223 | `metadata: body.metadata as any` |

**Fix:** Replace `any` with proper types. For Firestore documents, define Zod schemas and parse with `.transform()`.

---

### HB-6: In-Memory Rate Limiting — Fails in Serverless
**File:** `apps/web/src/lib/rate-limit.ts:13`

```typescript
const rateLimitStore = new Map<string, RateLimitEntry>();
```

**Issue:** In-memory `Map` is per-instance. In Vercel/AWS Lambda serverless, each cold-start creates a fresh instance, making rate limiting ineffective. Also resets on restart.
**Fix:** Use Redis with sliding window. Falls back to in-memory only in single-instance dev mode.

---

### HB-7: In-Memory Idempotency Store — Fails in Serverless
**File:** `apps/web/src/app/api/safety/flag/route.ts:11-22`

```typescript
const idempotencyStore = new Map<string, { response: unknown; timestamp: number }>();
setInterval(() => { ... }, 30_000);
```

**Issue:** Same as rate limiting — resets on cold-start. `setInterval` also may not run reliably in serverless.
**Fix:** Use Redis with `SET key value PX ttl NX` pattern.

---

### HD-1 through HD-7: Architecture/Documentation Conflicts

| # | Conflict | Doc Says | Implementation Does |
|---|----------|----------|---------------------|
| HD-1 | Auth provider | Clerk (`HIPS_PRD_v1.md`, `HIPS_Ultimate_Architecture_v2.md`) | Firebase only |
| HD-2 | Session database | PostgreSQL (Railway + AWS RDS) | Firebase Firestore (`phase5_sessions`) |
| HD-3 | Design system | `HIPS_FOUNDATION_DESIGN.md`: Navy/Gold | `HIPS_Frontend_Plan.md`: OLED dark/glassmorphism |
| HD-4 | Anonymous identity | Random 64-char hex token | HMAC-SHA256 of Firebase UID |
| HD-5 | Vault | Phase 1C prerequisite for sessions | Incomplete, delegated |
| HD-6 | Token store | Not documented | Redis (`redis-token-store.ts`) |
| HD-7 | Data separation | 3 isolated PostgreSQL DBs | PostgreSQL + Firestore mixed |

**Fix:** Audit team should decide which docs are canonical and update them. `HIPS_Implementation_Plan_Part1.md` is the most accurate — align all other docs to it.

---

## 🟡 MEDIUM Severity

### MP-1: LiveKit Token Generated on Every Request — No Caching
**File:** `apps/web/src/app/api/livekit/token/route.ts:247`

```typescript
const tokenJwt = await at.toJwt();  // New JWT on every call
```

**Issue:** Every page load or reconnection generates a fresh JWT. While TTL is 1 hour, repeated requests for the same session regenerate unnecessarily.
**Fix:** Cache tokens by `sessionId + identity` in Redis with TTL matching token expiry.

---

### MP-2: N+1 Query in Facilitator Hosts API
**File:** `apps/web/src/app/api/facilitator/hosts/route.ts:61-78`

```typescript
const hostsData = await Promise.all(hosts.map(async (host) => {
  const activeSessionsCount = await db.collection('sessions')
    .where('facilitatorId', '==', hostId)
    .where('status', '==', 'ACTIVE')
    .count()
    .get();
  // ... one query PER host
}));
```

**Issue:** If there are 50 hosts, this makes 50 Firestore queries sequentially/concurrently.
**Fix:** Batch query: `where('facilitatorId', 'in', allHostIds)`, then aggregate in memory.

---

### MP-3: Prisma Queries Missing `.select()` — Fetching All Fields
**File:** `apps/web/src/app/api/admin/users/route.ts:30-43`

```typescript
const users = await getPrisma().user.findMany({
  where: { deletedAt: null },
  take: 100,
  orderBy: { createdAt: 'desc' },
  // Missing .select({ id: true, email: true, role: true, ... })
});
```

**Issue:** `findMany` without `.select()` retrieves ALL fields including `hashedPassword`, `mfaSecret`, etc.
**Fix:** Add `.select()` with only the fields needed for the API response.

---

### MP-4: DemoRoomClient at 858 Lines — Unmaintainable
**File:** `apps/web/src/app/demo-room/DemoRoomClient.tsx`

**Issue:** Contains LiveKit connection logic, microphone selector, audio visualization, demo content, and session controls — all in one file. Affects bundle splitting and maintainability.
**Fix:** Extract into: `MicSelectorModal.tsx`, `AudioVisualizer.tsx`, `DemoControls.tsx`, `DemoRoomClient.tsx` (orchestrator).

---

### MP-5: Voice Processor Recreation Without Debouncing
**File:** `apps/web/src/app/session/[id]/page.tsx:645-650`

```typescript
useEffect(() => {
  if (localAudioTrack && micEnabled) {
    localAudioTrack.setProcessor(createVoiceMaskProcessor({ preset: activePreset, semitones }))
  }
  // No debounce — every slider drag triggers processor recreation
```

**Issue:** Dragging the semitone slider from -5 to +5 fires ~11 effect executions, each recreating the audio processor.
**Fix:** Debounce the semitone changes by 150-300ms, or skip recreation if only the `semitones` param changed and the processor supports parameter updates without recreation.

---

### MP-6: Session Timer Triggers Re-renders Every Second
**File:** `apps/web/src/app/session/[id]/SessionRoom.tsx:462-467`

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setSessionSeconds((s) => s + 1);  // Re-renders entire component tree every second
  }, 1000);
```

**Issue:** State update every second causes the entire session UI to re-render.
**Fix:** Extract the timer display into a `useInterval` hook with a `startTime` ref, rendering only the elapsed time in a memoized child.

---

### ME-1: 50+ Empty Catch Blocks — Silent Error Swallowing
**Files:** `contact/route.ts:95`, `donations/route.ts:27`, `mfa/verify/route.ts:53`, `mfa/setup/route.ts:46`, `mfa/challenge/route.ts:42`, `mfa/session/route.ts:49`, `sudo/route.ts:40`, `session/route.ts:134,152,225`, `session/[id]/route.ts:101,249,267,332,349`, and many more.

```typescript
// Common pattern:
try { ... } catch {}
// or
.catch(() => {})
```

**Impact:** Errors are silently consumed. The system can fail without any indication, leaving data in an inconsistent state.
**Fix:** At minimum, log the error: `catch (err) { console.error('[Route] Error:', err); throw err; }`. Ideally, return a proper error response.

---

### ME-2: 100+ console.log/error/warn in Production Code
**Selected instances:**
- `apps/web/src/app/api/demo/token/route.ts:139`
- `apps/web/src/app/api/donations/route.ts:47`
- `apps/web/src/app/api/checkout/demo-confirm/route.ts:86,106,116`
- `apps/web/src/lib/firebase-admin.ts:215-223` — exposes project details in logs

**Fix:** Replace `console.log` with a structured logger (e.g., `pino`). Remove all `console` calls from production paths or gate them behind `NODE_ENV !== 'production'`.

---

### ME-3: 15+ Math.random() Usages — Hydration Mismatch + Insecure IDs
**Key instances:**
- `apps/web/src/app/api/auth/sync/route.ts:25` — `Math.random()` for request ID (should be `crypto.randomUUID()`)
- `apps/web/src/app/demo/live/page.tsx:135` — `Math.random()` for color generation in SSR-rendered component

**Fix:** Replace `Math.random()` with `crypto.randomUUID()` or `crypto.getRandomValues()` everywhere. Add `useEffect` guards for any random values that must only render on the client.

---

### ME-4: 10+ localStorage/sessionStorage Without SSR Guard
**Files:** `layout.tsx:26`, `host/practice/page.tsx:14,17,22`, `host/avatar-setup/page.tsx:105,288,289`, `join/[sessionId]/DirectJoinClient.tsx:35,41,197`, `dashboard/page.tsx:197`

```typescript
// layout.tsx — direct localStorage access during module init
const stored = localStorage.getItem('theme');
```

**Issue:** `localStorage` is undefined during SSR. Causes hydration mismatches.
**Fix:** Wrap all localStorage access in `useEffect` or `typeof window !== 'undefined'` checks.

---

### ME-5: Inconsistent API Response Shapes Across Commerce Routes

| Route | Response Shape |
|-------|---------------|
| `POST /checkout/session-intent` | `{ clientSecret: string }` |
| `POST /checkout/package-intent` | `{ clientSecret, packageName, amount }` |
| `POST /packages/purchase` | `{ success: true, package: {...} }` |
| `POST /donations` | `{ clientSecret: string }` |
| `POST /org-inquiry` | `{ success: true, inquiryId, emailSent }` |

**Fix:** Standardize on `{ data: {...} } | { error: string }` pattern. Use a shared `ApiResponse<T>` type.

---

### ME-6: Admin AuditLog Uses Prisma `where: any`
**File:** `apps/web/src/app/api/admin/audit-log/route.ts:18`

```typescript
const where: any = {};
// Zod validates actorId and action, but where is passed directly to Prisma
// Potential injection if the where clause is extended carelessly
```

**Fix:** Define a typed Prisma `WhereClause` based on the `AdminAuditLog` model schema.

---

### MT-1: Tailwind borderRadius Mismatch
**File:** `tailwind.config.ts:96` vs `globals.css:193`

```typescript
// tailwind.config.ts
borderRadius: { sm: '4px', md: '8px', lg: '16px' }

// globals.css
--radius-sm: 0.375rem;  /* 6px — does NOT match 4px */
--radius-md: 0.5rem;     /* 8px — matches */
```

**Issue:** Classes like `rounded-sm` produce different visual radii depending on whether Tailwind or CSS variable is used.
**Fix:** Align `tailwind.config.ts` `borderRadius` values to match CSS tokens, or remove the override and let Tailwind use its defaults.

---

### MT-2: `rounded-pill` Token Not Defined
**File:** `apps/web/src/components/polish/PricingSwitcher.tsx`

**Issue:** Uses `rounded-pill` Tailwind class which is not defined in `tokens.css`.
**Fix:** Add `--radius-pill: 9999px` to `tokens.css` and `borderRadius: { pill: '9999px' }` to `tailwind.config.ts`.

---

### MG-1: Huge Commit bb2eb3e (378 files, +38K/-8K lines)
**File:** `.git` (commit `bb2eb3e`)

**Issue:** One commit combining simulated stripe bypass, board-demo guide, interactive donation flow, and UX fixes. Should be split into focused commits.
**Fix:** Future commits should be atomic. Consider an interactive `git rebase -i` to split this commit.

---

### MG-2: data-separation.yml Redundant with ci.yml
**Files:** `.github/workflows/ci.yml`, `.github/workflows/data-separation.yml`

**Issue:** Both workflows have identical triggers (`pull_request` + `push to main`). `data-separation.yml` duplicates `separation` and `test:phase9` steps already run in `ci.yml`, wasting CI minutes.
**Fix:** Remove `data-separation.yml` and move its unique steps (if any) into `ci.yml`.

---

### MG-3: @hips/db, @hips/ui, @hips/types Lack lint/typecheck Scripts
**Files:** Respective `package.json`

**Issue:** These packages have no `lint`, `typecheck`, or `test` scripts. Their source is never validated in CI.
**Fix:** Add at minimum `"typecheck": "tsc --noEmit"` to each.

---

### MG-4: start-prod-server.sh Hardcoded Paths
**File:** `start-prod-server.sh`

```bash
cd /home/deploy/hips-hsss/apps/web
export PATH=/home/deploy/.nvm/versions/node/v20.20.2/bin:$PATH
```

**Issue:** Hardcoded deploy path and Node version. Not portable across machines.
**Fix:** Use `$HOME`, `$APP_DIR`, and `$NODE_VERSION` env vars or a config file.

---

### MG-5: No hips-web in ecosystem.config.js
**File:** `ecosystem.config.js`

**Issue:** Only NestJS backend services are listed (`hips-session`, `hips-vault`, `hips-safety`, `hips-commerce`). The Next.js frontend is started via `start-prod-server.sh` separately.
**Fix:** Add a PM2 process for `hips-web` pointing to the Next.js build, or document the separate startup procedure clearly.

---

### MG-6: pnpm test:phase9 Only Runs data-separation.spec.ts
**File:** `package.json`

```json
"test:phase9": "vitest run tests/data-separation.spec.ts"
```

**Issue:** Other test files (`api-route-security.spec.ts`, `avatar.spec.ts`, `crisis-protocol-integration.spec.ts`, `mfa.spec.ts`, `revocation.spec.ts`, `secrets.spec.ts`, `service-token.spec.ts`, `webhooks.spec.ts`) are never run in CI.
**Fix:** Either run all tests in CI or create separate test categories (unit, integration, e2e).

---

### MG-7: No Test Coverage for UI, Pages, or NestJS Services
**Issue:** `tests/` directory has no UI component tests, no page integration tests, no NestJS service tests. Only `data-separation.spec.ts` runs in CI.
**Fix:** Add Playwright or Cypress for E2E. Add Vitest for component and service tests.

---

### MG-8: infra/cdk/ Is Placeholder Only
**File:** `infra/cdk/`

**Issue:** CDK code is not written. Contains only a `README.md`, `iam-safety-service-policy.json`, and `monitoring-stack.ts` planning artifact.
**Fix:** Write actual CDK infrastructure code for AWS deployment, or remove the directory.

---

## 🟢 LOW Severity

| # | Finding | File | Fix |
|---|---------|------|-----|
| L-1 | Admin re-auth after 4h hard-redirects to `/login` | `request-auth.ts:91` | Add "re-authenticate" modal before session expires |
| L-2 | `dynamic = "force-dynamic"` in `"use client"` file is meaningless | `dashboard/page.tsx:3` | Remove the export |
| L-3 | `HOST_ACCESS_CODE` hardcoded fallback `"HIPS-HOST-2025"` | `host-challenge/route.ts` | Fail if env var missing in production |
| L-4 | `DemoRoomClient` 858 lines | `DemoRoomClient.tsx` | Split into smaller components |
| L-5 | Duplicate AdminRole enum in safety service vs `roles.ts` | `admin-auth.guard.ts:7-10` | Import from `@hips/types` |
| L-6 | Resend client null when key missing — emails silently disabled | `commerce.service.ts:16` | Log warning when Resend is disabled |
| L-7 | Cron timing attack bug — `timingSafeEqual` throws on length mismatch | `security/cron.ts:30-33` | Add length check before calling |
| L-8 | Firebase only has Firestore configured — no Hosting/Functions/Auth/Storage | `firebase.json` | Add configs as needed |
| L-9 | Missing security headers (CSP, X-Frame-Options, etc.) | `middleware` | Add `securityHeaders` Next.js config |
| L-10 | `getRateLimitHeaders` imported but not exported | `safety/ingest/route.ts:5` | Verify export from `rate-limit.ts` |

---

## 📋 Unimplemented Features (Documented but Not Built)

| Feature | Reference | Notes |
|---------|-----------|-------|
| Identity Vault Phase 1C | `HIPS_Implementation_Plan_Part1.md` | Incomplete; `PHASE_1C_DELEGATION.md` exists |
| Clerk Auth | `HIPS_PRD_v1.md`, `HIPS_Ultimate_Architecture_v2.md` | Never implemented — Firebase used instead |
| OLED Dark Mode + Glassmorphism | `HIPS_Frontend_Plan.md` | Not implemented — navy/gold used |
| Envelope Encryption (KMS DEK) | `HIPS_Phase_Implementation_Plan.md` | Unverified against spec |
| Sanctuary Scene (T1-T7) | `virtual-sanctuary.md` | Not implemented |
| Granular Pitch Shifter | `virtual-sanctuary.md` T6 | Not implemented — 18Hz ring modulation used |
| Testcontainers + Vitest Suite | Phase 9 plan | Not implemented |
| Crisis Reviewer Assignment | PRD v1 Open Decisions | Still pending |
| AWS HIPAA BAA | PRD v1 Open Decisions | Still pending |
| Cal.com Scheduling | Architecture doc | Not found in codebase |

---

## ✅ Working Well

- ✅ Stripe/LiveKit webhook HMAC signature verification
- ✅ Timing-safe `timingSafeEqual` in VaultAuthGuard
- ✅ MFA with TOTP + AES-256-GCM encrypted secrets + bcrypt backup codes
- ✅ Role-based `requireRole()` / `requireAdmin()` enforced consistently
- ✅ LiveKit token generation uses server-only env vars
- ✅ Idempotency on Stripe/LiveKit webhooks (Redis-backed)
- ✅ HttpOnly + Secure + SameSite auth cookies
- ✅ Safety Engine keyword blocklist fast-path (instant alerts)
- ✅ Prisma schemas have appropriate indexes
- ✅ Firebase Admin JSON gitignored
- ✅ Constant-time secret comparison in cron validation (with length-check caveat)
- ✅ Input validation with Zod across commerce DTOs and safety schemas
- ✅ Admin audit logging for role changes and crisis access
- ✅ Service-to-service JWT auth with scopes

---

## Prioritized Fix Order

### Week 1 — Critical Security (Blockers)
1. Fix `--color-text` light mode bug (`globals.css:103`)
2. Move all secrets from `.env` to `.env.local` + secrets manager; rotate credentials
3. Remove `NEXT_PUBLIC_LIVEKIT_API_SECRET` from `.env`
4. Make `SAFETY_ENGINE_URL` required (no localhost fallback)
5. Add `.env.example` documenting all required vars
6. Fix HMAC anonymous identity → random token
7. Fix `isSessionMember` Firebase UID vs hashed identity bug

### Week 2 — Auth & UX Gaps
1. Add logout UI button
2. Fix MFA session failure error display
3. Add session revocation (Redis blacklist for admin sessions)
4. Add `error.tsx`/`loading.tsx` to admin sub-routes
5. Fix `DemoModeContext` default value

### Week 3 — Technical Debt
1. Remove all 45+ macOS `._` artifact files
2. Fix N+1 in facilitator hosts API
3. Add `.select()` to Prisma admin queries
4. Split `DemoRoomClient.tsx`
5. Replace all `Math.random()` with `crypto.randomUUID()`
6. Fix empty catch blocks (at minimum log errors)
7. Align Tailwind `borderRadius` values with CSS tokens

### Week 4 — Architecture & Documentation
1. Resolve auth provider conflict — update PRD/Architecture docs to reflect Firebase
2. Resolve design system conflict — decide on navy/gold vs OLED, update docs
3. Implement random token for LiveKit identity (per spec)
4. Write actual CDK infrastructure or remove `infra/cdk/`
5. Add Playwright/Cypress E2E tests
6. Run all test files in CI (not just `data-separation.spec.ts`)

---

*Report generated 2026-06-17 by Claude Code multi-agent audit (7 parallel agents)*
