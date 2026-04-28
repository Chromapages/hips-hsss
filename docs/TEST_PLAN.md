# H.I.P.S. Test Plan

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Test Plan
**Version:** 1.0
**Status:** Canonical
**Date:** April 24, 2026
**Authority:** Tech Lead
**Companion Documents:** `API_REFERENCE.md` · `HIPS_Ultimate_Architecture_v2.md` · `SECURITY_POLICY.md`

---

## Table of Contents

1. [Philosophy & Tooling](#1-philosophy--tooling)
2. [Unit Tests — Business Logic](#2-unit-tests--business-logic)
3. [Unit Tests — Utilities & Validators](#3-unit-tests--utilities--validators)
4. [Integration Tests — Commerce API](#4-integration-tests--commerce-api)
5. [Integration Tests — Session & Safety API](#5-integration-tests--session--safety-api)
6. [Integration Tests — Stripe Webhooks](#6-integration-tests--stripe-webhooks)
7. [E2E Tests — Critical Flows](#7-e2e-tests--critical-flows)
8. [Security Tests](#8-security-tests)
9. [Accessibility Tests](#9-accessibility-tests)
10. [Copy & Compliance Tests](#10-copy--compliance-tests)
11. [Performance Targets](#11-performance-targets)
12. [Pre-Launch Test Gates](#12-pre-launch-test-gates)

---

## 1. Philosophy & Tooling

### What This Platform Tests Differently

Standard platforms prioritize happy-path coverage and business logic. H.I.P.S. has two test priorities that override normal coverage heuristics:

1. **The anonymity boundary is an absolute.** Any code path that could link identity data to session data is a P0 failure — not a bug, not a regression, a platform-integrity failure. Tests that verify this boundary are the highest-value tests on the entire codebase. They run on every PR and must pass before any merge to `main`.

2. **The crisis flow is a human safety system.** A failure in the crisis detection, escalation, or resource display flow is not a software failure — it is a potential harm to a real person in distress. The crisis E2E test must pass in every environment before any session goes live. It is a pre-launch gate, not a nice-to-have.

Every other test priority is subordinate to these two.

### Test Stack

| Tool | Purpose | Location |
|---|---|---|
| **Vitest** | Unit tests, integration tests | `apps/web/**/*.test.ts`, `services/**/*.test.ts` |
| **Playwright** | E2E tests — critical user flows | `e2e/**/*.spec.ts` |
| **MSW (Mock Service Worker)** | Mock Stripe, Resend, external APIs in integration tests | `tests/mocks/` |
| **Prisma test client** | Isolated test DB transactions (rollback after each test) | `packages/db/src/test-client.ts` |
| **axe-core + @axe-core/playwright** | Accessibility assertions in E2E | `e2e/accessibility/` |

### Test Database Strategy

Integration and E2E tests use **real database instances** in test/staging environments — not mocks. This is required because the anonymity boundary tests must verify actual DB isolation, not mocked behavior.

- Commerce DB: Railway staging instance — each test wraps in a Prisma transaction, rolled back after test
- Session DB: Separate staging instance — same transaction-wrapping strategy
- Identity Vault DB: Staging instance in HIPAA-capable cloud — test suite uses a designated `TEST_VAULT_TOKEN` that does not correspond to any real person
- Stripe: Test mode keys (`STRIPE_SECRET_KEY` = `sk_test_...`) — use Stripe test event fixtures

**Never run integration tests against production databases.**

### CI Gates

These checks run on every PR and must all pass before merge to `main`:

```yaml
# .github/workflows/ci.yml
jobs:
  ci:
    steps:
      - pnpm install
      - pnpm typecheck          # TypeScript strict — zero errors
      - pnpm lint               # ESLint — zero errors
      - pnpm test:unit          # Vitest unit tests
      - pnpm test:integration   # Vitest integration tests (staging DB)
      - pnpm build              # next build + NestJS build
      - pnpm check:copy         # Banned term scanner
```

E2E tests (`pnpm test:e2e`) run on preview deployments (Vercel preview URL), not in the PR CI pipeline — they require a live environment.

### Coverage Requirements

| Layer | Minimum Coverage | Rationale |
|---|---|---|
| Business logic utilities | 90% | Core rules that drive money and safety |
| Commerce API routes | 85% | All happy paths + key error paths |
| Session/Safety services | 90% | Human safety system — high bar |
| Frontend components | 70% | UI states, not unit logic |
| Stripe webhook handler | 100% | Every event + idempotency + signature failure |

---

## 2. Unit Tests — Business Logic

File: `packages/db/src/__tests__/business-logic.test.ts`
File: `services/session/src/__tests__/token.test.ts`

---

### BL-01 · Scholarship budget cap enforcement

```typescript
describe('scholarshipBudgetCap', () => {
  it('allows application when cap has remaining budget')
  it('rejects application when cap is exactly reached')
  it('rejects application when cap is exceeded')
  it('uses atomic check — concurrent applications cannot both succeed when only 1 spot remains')
  it('resets cap on first day of new calendar month')
  it('returns SCHOLARSHIP_CAP_REACHED error code (not a generic error)')
  it('opens waitlist when cap is reached')
  it('admin can increase cap via env var SCHOLARSHIP_MONTHLY_BUDGET_CAP')
})
```

**Why this matters:** The budget cap is enforced server-side only. A race condition here could over-commit the scholarship fund. The concurrent applications test must use actual DB transactions, not mocks.

---

### BL-02 · Discount code validation

```typescript
describe('discountCodeValidation', () => {
  it('accepts a valid, unexpired code for the correct service')
  it('rejects an expired code (expiresAt < now)')
  it('rejects a code with status !== APPROVED')
  it('rejects a code for a different serviceId than requested')
  it('rejects a code that does not exist in DB')
  it('is case-insensitive in lookup')
  it('does not reveal whether a code exists for wrong-service rejection')
  // Same error shape for "not found" and "wrong service" — no enumeration
})
```

---

### BL-03 · Package lifecycle

```typescript
describe('packageLifecycle', () => {
  it('creates package with expiresAt = now + 90 days')
  it('increments usedSessions atomically on session booking')
  it('rejects booking when usedSessions >= totalSessions')
  it('rejects booking when expiresAt < now')
  it('sets isExpiringSoon = true when usedSessions/totalSessions >= 0.75')
  it('does not decrement usedSessions on NO_SHOW (participant no-show)')
  it('does decrement usedSessions on facilitator cancellation')
  it('marks package EXHAUSTED, not deleted, when fully used')
})
```

---

### BL-04 · Session status state machine

```typescript
describe('sessionStatusTransitions', () => {
  it('allows PENDING → CONFIRMED')
  it('allows CONFIRMED → COMPLETED')
  it('allows CONFIRMED → CANCELLED')
  it('allows CONFIRMED → NO_SHOW')
  it('rejects COMPLETED → CANCELLED (already complete)')
  it('rejects CANCELLED → COMPLETED')
  it('rejects any transition on a COMPLETED session')
  it('returns SESSION_ALREADY_COMPLETED error on invalid transition')
})
```

---

### BL-05 · Donation and service PaymentIntent separation

```typescript
describe('paymentIntentSeparation', () => {
  it('creates service PaymentIntent with metadata.type = SERVICE_PURCHASE')
  it('creates donation PaymentIntent with metadata.type = DONATION')
  it('never creates a single PaymentIntent containing both service and donation amounts')
  it('rolls back donation PaymentIntent if service payment fails')
  it('rolls back service PaymentIntent if donation payment fails')
  // Edge case from Pricing Spec §12: "Donation added at checkout, service payment fails"
  it('captures donation only if service payment succeeds independently')
})
```

---

### BL-06 · Session token lifecycle

```typescript
describe('sessionTokenLifecycle', () => {
  it('issues token linked to sessionId only — no userId stored in Session DB')
  it('rejects issuance for session not in CONFIRMED status')
  it('rejects issuance from mobile user-agent (403 MOBILE_DEVICE_BLOCKED)')
  it('rejects issuance when token already exists for sessionId')
  it('expires token on session END event — not time-based expiry')
  it('invalidates token immediately on POST /session/v1/:id/end')
  it('rejects reconnect attempt after token invalidation')
  it('allows reconnect within 2-minute window after facilitator disconnect')
  it('sets session status ABANDONED after 2-minute reconnect window expires')
})
```

---

### BL-07 · Session hours enforcement

```typescript
describe('sessionHoursEnforcement', () => {
  it('allows booking on Monday at 8:00am in configured timezone')
  it('allows booking on Saturday at 8:59pm in configured timezone')
  it('rejects booking on Sunday')
  it('rejects booking before 8:00am any day')
  it('rejects booking at or after 9:00pm any day')
  it('uses SESSION_HOURS_TIMEZONE env var for all comparisons')
  it('returns SESSION_HOURS_BLOCKED error code')
})
```

---

### BL-08 · Org inquiry status machine

```typescript
describe('orgInquiryStatus', () => {
  it('creates inquiry with status NEW')
  it('transitions NEW → QUOTED when admin sends quote')
  it('transitions QUOTED → DEPOSIT_PAID on deposit payment_intent.succeeded')
  it('transitions DEPOSIT_PAID → CONFIRMED when admin confirms')
  it('transitions CONFIRMED → COMPLETED after event')
  it('allows CANCELLED from any non-COMPLETED status')
  it('rejects CANCELLED on COMPLETED inquiry')
})
```

---

## 3. Unit Tests — Utilities & Validators

File: `packages/types/src/__tests__/validators.test.ts`
File: `packages/types/src/__tests__/api-response.test.ts`

---

### UV-01 · Zod request body schemas

One describe block per endpoint — only failure cases listed (happy paths covered by integration tests):

```typescript
describe('POST /api/v1/sessions/book schema', () => {
  it('rejects missing serviceId')
  it('rejects invalid ISO 8601 scheduledAt')
  it('rejects scheduledAt in the past')
  it('accepts optional facilitatorId as UUID or undefined')
  it('accepts optional discountCode as string or undefined')
})

describe('POST /api/v1/scholarships/apply schema', () => {
  it('rejects missing reason')
  it('rejects reason over 1000 chars')
  it('rejects requestedAmount of 0')
  it('rejects negative requestedAmount')
})

describe('POST /api/v1/checkout/donation schema', () => {
  it('rejects amount under 100 cents')
  it('rejects invalid email')
  it('rejects invalid tier value')
  it('accepts anonymous donation (no userId)')
})

describe('POST /api/v1/organizations/inquiry schema', () => {
  it('requires ein when isNonprofit = true')
  it('does not require ein when isNonprofit = false')
  it('rejects headcount over 1000')
  it('rejects notes over 2000 chars')
})

describe('POST /safety/v1/crisis/:id schema', () => {
  it('rejects justification under 20 chars')
  it('rejects empty justification')
  it('rejects missing justification — must not proceed without it')
})

describe('PATCH /safety/v1/:id/resolve schema', () => {
  it('rejects resolutionNote under 20 chars')
  it('rejects invalid outcome value')
})
```

---

### UV-02 · API response shape builder

```typescript
describe('apiResponse', () => {
  it('success(data) returns { data, error: null, meta: { timestamp, requestId } }')
  it('error(code, message) returns { data: null, error: { code, message }, meta }')
  it('meta.timestamp is valid ISO 8601')
  it('meta.requestId is a valid UUID v4')
  it('data and error are never both non-null')
  it('data and error are never both null (degenerate case)')
})
```

---

### UV-03 · KMS encrypt/decrypt wrappers

```typescript
describe('kmsWrappers', () => {
  it('encrypt() returns base64-encoded ciphertext — not plaintext')
  it('decrypt(encrypt(value)) returns original value')
  it('two calls to encrypt(sameValue) return different ciphertext (IV rotation)')
  it('decrypt with wrong key throws — does not return partial data')
  it('never logs plaintext to console or error output')
})
```

---

### UV-04 · Signed URL generator

```typescript
describe('signedUrlGenerator', () => {
  it('generates URL with expiry = SIGNED_URL_EXPIRY_SECONDS from now')
  it('generates different URL on each call for same object key (not cached)')
  it('URL is not publicly accessible without valid signature')
  it('throws if SUPABASE_SERVICE_ROLE_KEY is not set')
  it('never returns a permanent/public URL for digital products')
})
```

---

### UV-05 · Copy policy banned term detector

```typescript
describe('bannedTermDetector', () => {
  it('flags "therapy" in any case variation (Therapy, THERAPY, therapy)')
  it('flags "therapist", "counseling", "counselor", "treatment", "diagnosis"')
  it('flags "clinical services", "mental health treatment"')
  it('does not flag "peer support", "coaching", "care navigation"')
  it('does not flag "988" or crisis resource copy')
  it('returns line number and context for each violation')
  it('exits with code 1 when violations found (CI gate)')
  it('exits with code 0 when no violations found')
})
```

---

## 4. Integration Tests — Commerce API

File: `apps/web/src/app/api/__tests__/`

Each endpoint has its own test file. All tests use Prisma test transaction rollback. MSW mocks Stripe and Resend.

---

### INT-COM-01 · `POST /api/v1/sessions/book`

```typescript
describe('POST /api/v1/sessions/book', () => {
  // Happy paths
  it('201: books session with valid serviceId, scheduledAt, and Clerk JWT')
  it('201: books from package balance — increments usedSessions')
  it('201: applies valid discount code — sets isScholarship = true')
  it('201: sends BOOKING_CONFIRMATION email via Resend mock')

  // Auth
  it('401: missing Authorization header')
  it('401: expired JWT')
  it('403: ORGBUYER role cannot book care access sessions')

  // Validation
  it('400: missing serviceId')
  it('400: scheduledAt in the past')
  it('400: scheduledAt outside session hours window')
  it('400: slot already booked by another user')

  // Business rules
  it('400: PACKAGE_EXPIRED — package.expiresAt is in the past')
  it('400: PACKAGE_EXHAUSTED — usedSessions >= totalSessions')
  it('400: DISCOUNT_CODE_INVALID — code expired')
  it('400: DISCOUNT_CODE_WRONG_SERVICE — valid code, wrong service')
  it('422: SERVICE_INACTIVE — service.isActive = false')

  // Edge cases (from Pricing Spec §12)
  it('400: booking a session when scholarship cap is reached and no package')
})
```

---

### INT-COM-02 · `POST /api/v1/scholarships/apply`

```typescript
describe('POST /api/v1/scholarships/apply', () => {
  it('201: creates PENDING scholarship record')
  it('201: notifies admin via internal email mock')
  it('400: AMOUNT_OUT_OF_RANGE — below scholarshipMin')
  it('400: AMOUNT_OUT_OF_RANGE — above scholarshipMax')
  it('400: SCHOLARSHIP_CAP_REACHED — monthly budget exhausted')
  it('409: DUPLICATE_APPLICATION — active PENDING application exists')
  it('401: unauthenticated request')
  // Edge: cap at $499 of $500, applicant requests $10 — should succeed
  it('201: partial cap — application succeeds when budget remains')
  // Edge: cap at $500 of $500 — should fail and waitlist
  it('400: exact cap — application fails and adds to waitlist')
})
```

---

### INT-COM-03 · `PATCH /api/v1/scholarships/:id`

```typescript
describe('PATCH /api/v1/scholarships/:id', () => {
  it('200: ADMIN approves — creates unique discountCode, sets expiresAt 30 days out')
  it('200: ADMIN denies — status DENIED, no discountCode generated')
  it('200: sends SCHOLARSHIP_APPROVED email on approval')
  it('200: sends SCHOLARSHIP_DENIED email on denial')
  it('400: APPROVED_AMOUNT_REQUIRED — status=APPROVED but no approvedAmount')
  it('403: PARTICIPANT role cannot approve/deny')
  it('403: FACILITATOR (non-admin) cannot approve/deny')
  it('404: scholarship ID does not exist')
  it('409: ALREADY_REVIEWED — scholarship not in PENDING status')
})
```

---

### INT-COM-04 · `POST /api/v1/checkout/session`

```typescript
describe('POST /api/v1/checkout/session', () => {
  it('201: returns clientSecret from Stripe mock')
  it('201: amount reflects discount when valid discountCode provided')
  it('201: standard amount when no discountCode')
  it('400: DISCOUNT_CODE_INVALID — expired code')
  it('400: service does not exist')
  // Critical: verify PaymentIntent metadata
  it('201: PaymentIntent metadata.type = SERVICE_PURCHASE (not DONATION)')
  it('401: unauthenticated request')
})
```

---

### INT-COM-05 · `POST /api/v1/checkout/donation`

```typescript
describe('POST /api/v1/checkout/donation', () => {
  it('201: authenticated donor — creates PaymentIntent')
  it('201: anonymous donor — creates PaymentIntent without userId')
  it('400: amount below $1.00 (100 cents)')
  it('400: invalid email')
  it('400: invalid tier')
  // Critical separation test
  it('201: PaymentIntent metadata.type = DONATION (not SERVICE_PURCHASE)')
  it('rate limit: 21st request in 1 minute returns 429')
})
```

---

### INT-COM-06 · `POST /api/v1/organizations/inquiry`

```typescript
describe('POST /api/v1/organizations/inquiry', () => {
  it('201: unauthenticated request accepted (public endpoint)')
  it('201: sends ORG_INQUIRY_RECEIVED email to contactEmail')
  it('400: isNonprofit=true but no EIN provided')
  it('400: headcount over 1000')
  it('400: notes over 2000 chars')
  // Verify EIN handling
  it('201: EIN stored in DB but not returned in response')
  it('201: EIN not logged to console or error output')
})
```

---

### INT-COM-07 · Admin endpoints

```typescript
describe('GET /api/v1/admin/bookings', () => {
  it('200: ADMIN returns paginated bookings')
  it('200: filter by status returns only matching records')
  it('200: response never includes participant real name or email')
  it('403: FACILITATOR role cannot access admin bookings')
  it('403: PARTICIPANT role cannot access admin bookings')
  it('200: pagination — page 2 returns correct offset')
  it('200: limit=100 is max — limit=101 clamped to 100')
})

describe('GET /api/v1/admin/revenue', () => {
  it('200: ADMIN returns revenue summary')
  it('200: serviceRevenue + donationRevenue = totalRevenue')
  it('200: byCategory includes all ServiceCategory values')
  it('403: non-ADMIN role returns 403')
  it('400: startDate after endDate returns 400')
})
```

---

## 5. Integration Tests — Session & Safety API

File: `services/session/src/__tests__/`
File: `services/safety/src/__tests__/`

---

### INT-SES-01 · Session token issuance

```typescript
describe('POST /session/v1/token', () => {
  it('201: issues token for CONFIRMED session with valid Clerk JWT')
  it('201: token record in Session DB has NO userId field — only sessionId')
  it('201: Commerce DB session record is NOT updated with token (token lives only in Session DB)')
  it('400: SESSION_NOT_CONFIRMED — session in PENDING status')
  it('403: MOBILE_DEVICE_BLOCKED — mobile user-agent')
  it('403: SESSION_NOT_OWNED — sessionId belongs to different userId')
  it('409: TOKEN_ALREADY_ISSUED — active token already exists')
  // The critical anonymity test:
  it('ANONYMITY: no query exists that can join Session DB token to Commerce DB userId')
})
```

The last test (`ANONYMITY`) executes a raw SQL query against both test DBs attempting a join via any shared key. It must return 0 rows.

---

### INT-SES-02 · Safety flag and escalation

```typescript
describe('POST /session/v1/:id/flag → Safety Engine', () => {
  it('201: CRISIS flagType → Safety Engine Tier 3, added to queue')
  it('201: counselor DISTRESS flag → Safety Engine Tier 2')
  it('201: keyword SAFETY_CONCERN → Safety Engine Tier 1 (soft alert only)')
  it('201: AuditEvent record created — insert only, no update permission')
  it('201: SMS + Slack alerts fire for Tier 3 (mocked)')
  it('201: flag does not terminate session — session remains ACTIVE')
  it('403: non-facilitator session token cannot initiate flag')
})

describe('GET /safety/v1/queue', () => {
  it('200: ADMIN sees all PENDING escalations')
  it('200: sorted by tier descending, then timestamp ascending')
  it('200: Tier 3 escalations show slaDue = flaggedAt + 15 minutes')
  it('403: PARTICIPANT role cannot access safety queue')
  it('403: FACILITATOR (non-reviewer) cannot access safety queue')
})

describe('PATCH /safety/v1/:id/resolve', () => {
  it('200: ADMIN resolves with valid resolutionNote and outcome')
  it('200: AuditEvent logged with resolver ID and timestamp')
  it('400: resolutionNote under 20 chars')
  it('409: ALREADY_RESOLVED — escalation already closed')
})
```

---

### INT-SES-03 · Crisis protocol

This is the highest-priority integration test block. Run in isolation with dedicated test fixtures.

```typescript
describe('POST /safety/v1/crisis/:id', () => {
  // Happy path
  it('200: ADMIN initiates crisis with valid justification')
  it('200: returns ONLY emergencyContact, region, country from vault')
  it('200: does NOT return realName, email, ipAddress, or any other vault field')
  it('200: VaultAccessLog entry created — immutable, insert-only')
  it('200: VaultAccessLog contains requestorId, justification, timestamp, vaultRecordId')
  it('200: CrisisEscalation WebSocket event fires to participant session')
  it('200: 988 resources present in response resourcesDisplayed')
  it('200: local emergency resource derived from region/country')

  // Auth
  it('403: FACILITATOR who is NOT a designated reviewer returns 403')
  it('403: PARTICIPANT role returns 403')
  it('403: ORGBUYER role returns 403')

  // Validation
  it('400: missing justification field')
  it('400: justification under 20 chars')
  it('409: CRISIS_ALREADY_ACTIVE — crisis protocol already running')
  it('404: escalation ID does not exist')

  // Vault isolation — the most critical tests on the platform
  it('VAULT ISOLATION: vault API called with sessionId only — no userId passed')
  it('VAULT ISOLATION: vault response fields realName, email, ipAddress are absent from API response')
  it('VAULT ISOLATION: no Commerce DB query executed during vault access')
  it('VAULT ISOLATION: VaultAccessLog cannot be updated or deleted — DB-level enforcement')

  // Out-of-hours
  it('200: out-of-hours crisis — 988 displayed, SMS fires, vault NOT auto-accessed')
})
```

---

### INT-SES-04 · Session teardown

```typescript
describe('POST /session/v1/:id/end', () => {
  it('200: session status → ENDED in Session DB')
  it('200: voiceBuffersDestroyed = true when no recording consent')
  it('200: tokenInvalidated = true')
  it('200: subsequent WebSocket connection with same token returns 401')
  it('200: follow-up survey cron registered (fires 48h later)')
  it('200: consent-based recording → voice encrypted to object storage, not destroyed')
  it('200: SessionRecord.durationMins calculated correctly')
  it('404: session ID does not exist')
})
```

---

## 6. Integration Tests — Stripe Webhooks

File: `apps/web/src/app/api/webhooks/__tests__/stripe.test.ts`

This file must achieve **100% coverage** — every event, every branch.

---

### INT-WH-01 · Signature verification

```typescript
describe('Stripe webhook signature', () => {
  it('200: valid signature passes and event is processed')
  it('400: invalid signature returns 400 immediately — no processing')
  it('400: missing Stripe-Signature header returns 400')
  it('400: raw body modification after signing returns 400')
  it('200: duplicate event (same event.id) is a no-op — idempotency')
})
```

---

### INT-WH-02 · `payment_intent.succeeded` — service purchase

```typescript
describe('payment_intent.succeeded — SERVICE_PURCHASE', () => {
  it('sets Session.status = CONFIRMED')
  it('sends BOOKING_CONFIRMATION email via Resend')
  it('increments Package.usedSessions when packageId present')
  it('does NOT send email on duplicate event (idempotency)')
  it('does NOT create Donation record for service payment')
  it('handles missing Session record gracefully — logs error, returns 200')
})
```

---

### INT-WH-03 · `payment_intent.succeeded` — donation

```typescript
describe('payment_intent.succeeded — DONATION', () => {
  it('creates Donation record with correct tier and amount')
  it('sends DONATION_RECEIPT email via Resend')
  it('sets receiptSent = true after email sent')
  it('receipt email contains org EIN')
  it('receipt email contains "no goods or services" statement')
  it('does NOT create Session or Package record for donation payment')
  it('idempotency: second event with same stripePaymentId is a no-op')
})
```

---

### INT-WH-04 · `payment_intent.succeeded` — digital product

```typescript
describe('payment_intent.succeeded — DIGITAL_PRODUCT', () => {
  it('generates Supabase signed URL with 24-hour expiry')
  it('sends DIGITAL_PRODUCT_DELIVERY email with signed URL')
  it('signed URL is different on each generation (not cached)')
  it('does NOT send a permanent/public URL')
})
```

---

### INT-WH-05 · `payment_intent.payment_failed`

```typescript
describe('payment_intent.payment_failed', () => {
  it('logs failure to AuditEvent')
  it('Session remains in PENDING status (not cancelled)')
  it('sends payment failure notification to participant')
  it('does NOT decrement Package.usedSessions')
  it('no receipt email sent')
})
```

---

### INT-WH-06 · `customer.subscription.deleted`

```typescript
describe('customer.subscription.deleted', () => {
  it('sets membership accessEndsAt to current period end (does not revoke immediately)')
  it('sends MEMBERSHIP_CANCELLATION email with accessEndsAt date')
  it('participant can still access library until accessEndsAt')
  it('idempotency: second event with same subscriptionId is a no-op')
})
```

---

### INT-WH-07 · `invoice.paid`

```typescript
describe('invoice.paid', () => {
  it('extends membership accessEndsAt by one billing period')
  it('does NOT send email (silent renewal)')
  it('does NOT create a new Subscription record (updates existing)')
})
```

---

## 7. E2E Tests — Critical Flows

File: `e2e/critical-flows/`
Tool: Playwright

These five flows must pass on every preview deployment and before every production deploy.

---

### E2E-01 · Full individual session booking flow

**File:** `e2e/critical-flows/session-booking.spec.ts`

```typescript
test('complete session booking flow', async ({ page }) => {
  // 1. Sign up / sign in via Clerk
  await page.goto('/sign-up')
  // ... Clerk sign-up steps

  // 2. Browse service catalog
  await page.goto('/services')
  await page.click('[data-testid="service-care-access"]')
  // Assert: disclaimer visible on service detail page
  await expect(page.locator('[data-testid="required-disclaimer"]')).toBeVisible()
  // Assert: "therapy" not present anywhere on page (copy policy)
  await expect(page.locator('body')).not.toContainText('therapy')

  // 3. Select availability slot
  await page.click('[data-testid="book-cta"]')
  await page.click('[data-testid="available-slot-first"]')

  // 4. Checkout — service payment only
  await expect(page.locator('[data-testid="donation-addon"]')).toBeVisible()
  // Do NOT add donation — verify separate PaymentIntent logic
  await page.fill('[data-testid="stripe-card-number"]', '4242424242424242')
  // ... Stripe test card completion
  await page.click('[data-testid="confirm-payment"]')

  // 5. Confirmation
  await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible()
  await expect(page.locator('[data-testid="session-date"]')).toBeVisible()

  // 6. Dashboard — session balance visible
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="upcoming-sessions"]')).toContainText('1')
})
```

**Assertions include:**
- Disclaimer visible on service page before booking CTA
- "therapy" / "counseling" not present on any page in the flow
- Confirmation email received (via Resend test mode)
- Dashboard reflects booking

---

### E2E-02 · Scholarship apply → approve → redeem flow

**File:** `e2e/critical-flows/scholarship-flow.spec.ts`

```typescript
test('scholarship apply, admin approve, participant redeems', async ({ browser }) => {
  const participantContext = await browser.newContext()
  const adminContext = await browser.newContext()
  const participant = await participantContext.newPage()
  const admin = await adminContext.newPage()

  // Participant applies
  await participant.goto('/scholarship')
  // ... fill form, submit
  await expect(participant.locator('[data-testid="scholarship-pending"]')).toBeVisible()

  // Admin approves
  await admin.goto('/admin/scholarships')
  await admin.click('[data-testid="approve-scholarship-first"]')
  // ... enter approvedAmount, confirm
  await expect(admin.locator('[data-testid="scholarship-approved"]')).toBeVisible()

  // Participant sees approval (check email mock or dashboard status)
  await participant.goto('/dashboard')
  await expect(participant.locator('[data-testid="scholarship-status"]')).toContainText('APPROVED')

  // Participant redeems at checkout
  await participant.goto('/book/care-access-session')
  await participant.fill('[data-testid="discount-code-input"]', discountCode)
  // Assert: ScholarshipBadge shown — does not reveal underlying rate
  await expect(participant.locator('[data-testid="scholarship-badge"]')).toBeVisible()
  await expect(participant.locator('[data-testid="scholarship-badge"]')).not.toContainText('%')
  // Complete checkout
  // Assert: session booked with isScholarship = true
})
```

---

### E2E-03 · Donation at checkout — two separate PaymentIntents

**File:** `e2e/critical-flows/donation-separation.spec.ts`

```typescript
test('donation at checkout creates two separate PaymentIntents', async ({ page }) => {
  // Navigate to checkout with a service
  await page.goto('/checkout?serviceId=...')

  // Add optional donation
  await page.click('[data-testid="donation-addon-sponsor-session"]')
  await expect(page.locator('[data-testid="donation-amount"]')).toBeVisible()

  // Complete checkout
  // ... Stripe test card

  // Verify via API: two PaymentIntents created — one SERVICE_PURCHASE, one DONATION
  // (via Stripe test mode API — assert metadata.type for each)
  const paymentIntents = await stripe.paymentIntents.list({ limit: 2 })
  expect(paymentIntents.data[0].metadata.type).toBe('SERVICE_PURCHASE')
  expect(paymentIntents.data[1].metadata.type).toBe('DONATION')
  expect(paymentIntents.data[0].id).not.toBe(paymentIntents.data[1].id)

  // Verify donation receipt email sent (Resend test mode)
  // Verify booking confirmation email sent
  // Verify they are separate emails, not combined
})
```

---

### E2E-04 · Crisis flag → reviewer → resolve flow

**File:** `e2e/critical-flows/crisis-flow.spec.ts`

This test requires a live session environment (staging). It is the most important test on the platform.

```typescript
test('crisis flag flow — facilitator flags, reviewer acts, participant sees resources', async ({ browser }) => {
  const facilitatorContext = await browser.newContext()
  const participantContext = await browser.newContext()
  const reviewerContext = await browser.newContext()

  // Set up: facilitator and participant in active session (staging)
  // ...

  // Facilitator flags session
  const facilitator = await facilitatorContext.newPage()
  await facilitator.click('[data-testid="flag-session-button"]')
  await facilitator.selectOption('[data-testid="flag-type"]', 'CRISIS')
  await facilitator.click('[data-testid="submit-flag"]')

  // Participant sees CrisisEscalation overlay
  const participant = await participantContext.newPage()
  await expect(participant.locator('[data-testid="crisis-overlay"]')).toBeVisible()
  await expect(participant.locator('[data-testid="crisis-988-link"]')).toBeVisible()
  await expect(participant.locator('[data-testid="crisis-text-line"]')).toBeVisible()
  // Session NOT terminated
  await expect(participant.locator('[data-testid="virtual-office"]')).toBeVisible()

  // Reviewer opens safety queue
  const reviewer = await reviewerContext.newPage()
  await reviewer.goto('/admin/safety')
  await expect(reviewer.locator('[data-testid="escalation-tier-3"]')).toBeVisible()
  await expect(reviewer.locator('[data-testid="sla-countdown"]')).toBeVisible()

  // Reviewer initiates crisis protocol
  await reviewer.click('[data-testid="initiate-crisis-protocol"]')
  await reviewer.fill('[data-testid="justification-input"]', 'Participant expressed active suicidal ideation during session')
  await reviewer.click('[data-testid="confirm-crisis-protocol"]')

  // Verify: only emergencyContact, region, country returned
  // Verify: realName NOT shown
  await expect(reviewer.locator('[data-testid="vault-real-name"]')).not.toBeVisible()
  await expect(reviewer.locator('[data-testid="vault-email"]')).not.toBeVisible()
  await expect(reviewer.locator('[data-testid="vault-emergency-contact"]')).toBeVisible()
  await expect(reviewer.locator('[data-testid="vault-region"]')).toBeVisible()

  // Reviewer resolves
  await reviewer.fill('[data-testid="resolution-note"]', 'Provided 988 resources. Participant confirmed they are safe and have support.')
  await reviewer.selectOption('[data-testid="resolution-outcome"]', 'RESOLVED_SAFE')
  await reviewer.click('[data-testid="resolve-escalation"]')
  await expect(reviewer.locator('[data-testid="escalation-resolved"]')).toBeVisible()

  // Verify VaultAccessLog entry exists (via admin audit API)
  // Verify entry is immutable (attempt UPDATE — must fail)
})
```

**This test must pass before any session feature goes live.** No exceptions.

---

### E2E-05 · Mobile session block

**File:** `e2e/critical-flows/mobile-block.spec.ts`

```typescript
test('mobile device cannot initiate a session', async ({ browser }) => {
  const mobileContext = await browser.newContext({
    ...devices['iPhone 14']
  })
  const page = await mobileContext.newPage()

  // Sign in
  await page.goto('/sign-in')
  // ... auth

  // Dashboard accessible on mobile
  await page.goto('/dashboard')
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()

  // Browsing accessible on mobile
  await page.goto('/services')
  await expect(page.locator('[data-testid="service-catalog"]')).toBeVisible()

  // Attempt to join session
  await page.goto('/session/test-session-id')
  // Must show mobile block message — not join the session
  await expect(page.locator('[data-testid="mobile-block-message"]')).toBeVisible()
  await expect(page.locator('[data-testid="virtual-office"]')).not.toBeVisible()
  // Session token issuance must return 403 MOBILE_DEVICE_BLOCKED
})
```

---

## 8. Security Tests

File: `tests/security/`
These tests run as part of pre-launch hardening (Phase 6) and before every production deploy.

---

### SEC-01 · Auth bypass — role verification

```typescript
describe('role verification — DB check, not JWT-only', () => {
  it('FACILITATOR with tampered JWT claim ADMIN cannot access /admin/revenue')
  it('PARTICIPANT with tampered JWT claim ADMIN cannot access /admin/scholarships')
  it('valid Clerk JWT with no corresponding User in Commerce DB returns 401')
  it('valid Clerk JWT where User.role !== JWT.role uses DB role (not JWT role)')
  // The JWT claim is a hint — the DB is the source of truth
})
```

---

### SEC-02 · Identity / session DB cross-access

This is the most critical security test. It must run against actual test DB instances, not mocks.

```typescript
describe('DB isolation — identity cannot be linked to session', () => {
  // Given: a session token in Session DB and a userId in Commerce DB
  // Attempt every plausible join:

  it('Session DB sessionId cannot be used to query Commerce DB userId')
  it('Commerce DB userId cannot be used to query Session DB sessionToken')
  it('Session DB anonSessionToken has no matching column in Commerce DB')
  it('No shared table, foreign key, or index between Session DB and Commerce DB')
  it('sessionTokenRef in Commerce DB Session model is a label only — not a FK to Session DB')
  it('VaultAccessLog vaultRecordId cannot be joined to Commerce DB userId')

  // Structural test: analyze DB schemas for any shared unique identifier
  it('zero shared unique identifiers between Commerce DB and Session DB (structural scan)')
})
```

---

### SEC-03 · Vault access without justification

```typescript
describe('crisis protocol justification enforcement', () => {
  it('POST /safety/v1/crisis/:id with missing justification returns 400 before vault is contacted')
  it('POST /safety/v1/crisis/:id with 19-char justification returns 400')
  it('vault API is not called when justification validation fails')
  it('no VaultAccessLog entry is created when justification is missing')
  it('CRISIS_ALREADY_ACTIVE prevents double vault access for same escalation')
})
```

---

### SEC-04 · Raw error exposure

```typescript
describe('raw error exposure prevention', () => {
  it('Prisma error does not appear in any 500 response body')
  it('SQL error text does not appear in any response body')
  it('stack trace does not appear in any response body')
  it('internal service URL does not appear in any response body')
  it('VAULT_API_SECRET does not appear in any response or log')
  it('500 responses always return { code: "INTERNAL_ERROR", message: "..." }')
})
```

---

### SEC-05 · Stripe signature verification

```typescript
describe('Stripe webhook security', () => {
  it('webhook with invalid signature returns 400 — no processing occurs')
  it('webhook with expired timestamp (>5 min) returns 400')
  it('webhook handler does not parse JSON before signature verification')
  it('Stripe IP outside allowlist returns 400 at network layer (verify in staging)')
})
```

---

### SEC-06 · Signed URL integrity

```typescript
describe('Supabase signed URL security', () => {
  it('expired signed URL (>24h) returns 400 from Supabase')
  it('signed URL for product A cannot be used to access product B')
  it('unauthenticated request to private bucket returns 403')
  it('same object generates different URLs on each call (no caching)')
})
```

---

## 9. Accessibility Tests

File: `e2e/accessibility/`
Tool: axe-core + @axe-core/playwright, Playwright

---

### A11Y-01 · Crisis overlay

```typescript
test('CrisisEscalation overlay meets WCAG AA', async ({ page }) => {
  // Trigger crisis overlay in test environment
  await triggerCrisisOverlay(page)

  // Screen reader accessibility
  await expect(page.locator('[data-testid="crisis-overlay"]')).toHaveAttribute('role', 'dialog')
  await expect(page.locator('[data-testid="crisis-overlay"]')).toHaveAttribute('aria-modal', 'true')
  await expect(page.locator('[data-testid="crisis-overlay"]')).toHaveAttribute('aria-label')

  // Focus trap
  await page.keyboard.press('Tab')
  const focusedElement = page.locator(':focus')
  await expect(focusedElement).toBeVisible()
  // Tab through all focusable elements — must stay within overlay
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.closest('[data-testid="crisis-overlay"]'))
    expect(focused).toBeTruthy()
  }

  // 988 link keyboard accessible
  await expect(page.locator('[data-testid="crisis-988-link"]')).toBeFocusable()
  await expect(page.locator('[data-testid="crisis-text-line"]')).toBeFocusable()

  // axe scan — zero violations
  const violations = await runAxe(page, '#crisis-overlay')
  expect(violations).toHaveLength(0)
})
```

---

### A11Y-02 · All forms

```typescript
describe('form accessibility', () => {
  const forms = [
    '/scholarship',
    '/organizations',
    '/book/care-access-session',
    '/checkout',
    '/donate'
  ]

  for (const path of forms) {
    test(`form at ${path} meets WCAG AA`, async ({ page }) => {
      await page.goto(path)
      // All labels associated with inputs
      const inputs = page.locator('input, select, textarea')
      for (const input of await inputs.all()) {
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        expect(id || ariaLabel || ariaLabelledBy).toBeTruthy()
      }
      // Error messages announced to screen readers
      // Submit form with empty required fields, check aria-live regions
      await page.click('[type="submit"]')
      const errorMessages = page.locator('[role="alert"], [aria-live]')
      await expect(errorMessages.first()).toBeVisible()
      // axe scan
      const violations = await runAxe(page)
      expect(violations).toHaveLength(0)
    })
  }
})
```

---

### A11Y-03 · WCAG AA contrast and targets

```typescript
test('session controls meet minimum touch target and contrast requirements', async ({ page }) => {
  await page.goto('/session/test-session-id')
  // Minimum 44px touch targets
  const controls = ['mute-button', 'end-session-button', 'flag-button']
  for (const control of controls) {
    const box = await page.locator(`[data-testid="${control}"]`).boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
  // axe scan for contrast
  const violations = await runAxe(page, { runOnly: ['color-contrast'] })
  expect(violations).toHaveLength(0)
})
```

---

## 10. Copy & Compliance Tests

These run as a CI step (`pnpm check:copy`) on every PR. A single violation blocks merge.

---

### CP-01 · Banned term scanner

**Scans:** `apps/web/**/*.tsx`, `apps/web/**/*.ts`, `apps/web/emails/**/*`, `apps/web/public/**/*.html`

**Banned terms (case-insensitive):**
`therapy`, `therapist`, `counseling`, `counselor`, `treatment`, `diagnosis`, `clinical`, `clinical services`, `mental health treatment`, `group therapy`, `intake assessment`

```typescript
describe('banned term scan', () => {
  it('exits 0 on clean codebase')
  it('exits 1 and reports line/file when banned term found in component')
  it('exits 1 when banned term found in email template')
  it('exits 1 when banned term found in static HTML')
  it('is case-insensitive — catches Therapy, THERAPY, therapy')
  it('does not false-positive on "988" or approved crisis resource copy')
  it('does not false-positive on comments that explain WHY a term is banned')
  // Allow-list: comments starting with `// copy-policy-exempt:`
})
```

---

### CP-02 · Disclaimer presence

```typescript
describe('disclaimer presence', () => {
  const servicePages = ['/services', '/services/care-access-session', '/services/coaching', '/checkout']
  for (const path of servicePages) {
    it(`disclaimer visible on ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('[data-testid="required-disclaimer"]')).toBeVisible()
    })
  }
  it('donation receipt email contains org EIN')
  it('donation receipt email contains "no goods or services received" statement')
  it('REQUIRED_DISCLAIMER constant imported from packages/types — not retyped')
})
```

---

### CP-03 · Crisis resource format

```typescript
describe('crisis resource format', () => {
  it('988 rendered as <a href="tel:988"> — not plain text')
  it('Crisis Text Line rendered as <a href="sms:741741">')
  it('crisis resources present on booking confirmation email')
  it('crisis resources present on 24h reminder email')
  it('crisis resources present on follow-up survey email')
  it('crisis resources present on welcome email')
  it('CrisisEscalation overlay always shows 988 regardless of vault access status')
})
```

---

## 11. Performance Targets

Measured via Lighthouse CI in GitHub Actions on every PR preview deployment.

| Metric | Target | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Homepage, service catalog, dashboard |
| INP (Interaction to Next Paint) | < 200ms | Booking calendar, checkout form, session controls |
| CLS (Cumulative Layout Shift) | < 0.1 | All pages with async data loading |
| TTFB (Time to First Byte) | < 800ms | Server Component pages |
| Bundle size (initial JS) | < 200KB gzipped | Homepage |

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      ${{ env.PREVIEW_URL }}
      ${{ env.PREVIEW_URL }}/services
      ${{ env.PREVIEW_URL }}/dashboard
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

**`lighthouse-budget.json`:**
```json
[{
  "path": "/*",
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "cumulative-layout-shift", "budget": 0.1 },
    { "metric": "total-blocking-time", "budget": 200 }
  ],
  "resourceSizes": [
    { "resourceType": "script", "budget": 200 }
  ]
}]
```

---

## 12. Pre-Launch Test Gates

All items must be checked by the Tech Lead **and** Program Lead before any session goes live. This list is not aspirational — it is a hard gate.

### Identity Vault

- [ ] `INT-SES-01` ANONYMITY test passes against staging Session DB and Commerce DB
- [ ] `INT-SES-03` VAULT ISOLATION tests pass — all four assertions green
- [ ] `SEC-02` DB isolation structural scan passes — zero shared unique identifiers
- [ ] Identity Vault penetration test completed by designated senior engineer (see `SECURITY_POLICY.md` §9)
- [ ] VaultAccessLog insert-only enforcement verified at DB permission level (not just application code)
- [ ] `POST /safety/v1/crisis/:id` with missing justification confirmed to reject before vault contact

### Crisis Flow

- [ ] `E2E-04` crisis flow E2E passes on staging environment
- [ ] `CP-03` crisis resource format tests pass (988 link format correct)
- [ ] SMS alerts confirmed deliverable to both designated reviewers (live test, not mock)
- [ ] Slack crisis-alerts webhook confirmed active
- [ ] CrisisEscalation overlay confirmed screen-reader accessible (`A11Y-01` passes)
- [ ] Out-of-hours crisis protocol tested manually — 988 displays, session not terminated, SMS fires

### Sessions

- [ ] `E2E-05` mobile block E2E passes
- [ ] WebRTC teardown verified — voice buffers destroyed on session end, confirmed by Session DB `voiceBuffersDestroyed` flag
- [ ] Session token invalidation verified — token unusable after `POST /session/v1/:id/end`
- [ ] Facilitator no-show alert confirmed to fire at scheduled start + 10 minutes

### Payments

- [ ] `INT-WH-01` through `INT-WH-07` all pass (100% webhook coverage)
- [ ] `E2E-03` two separate PaymentIntents confirmed in Stripe test mode
- [ ] Live Stripe key smoke test: one real $1.00 donation processed end-to-end in production before public launch
- [ ] Stripe webhook signature verification confirmed active on production endpoint

### Copy & Compliance

- [ ] `pnpm check:copy` passes on `main` branch with zero violations
- [ ] `CP-02` disclaimer presence passes on all service pages
- [ ] IRS-compliant donation receipt verified by Program Lead (EIN present, no-goods statement present)
- [ ] `REQUIRED_DISCLAIMER` text reviewed and approved by Program Lead

### Performance

- [ ] Lighthouse CI passes all budgets on production URL
- [ ] LCP < 2.5s on homepage (production, not preview)
- [ ] CLS < 0.1 on dashboard with real session data loaded

### Security

- [ ] `SEC-01` through `SEC-06` all pass
- [ ] No secrets committed to version control (git-secrets scan on `main`)
- [ ] All production environment variables verified in Vercel and AWS Secrets Manager
- [ ] Rate limits confirmed active on auth, booking, and session token endpoints

---

*Document maintained by: Tech Lead*
*Review cycle: Before each launch phase; when new endpoints or flows are added*
*Change process: PR to `docs/TEST_PLAN.md` · requires Tech Lead review · CI must pass*
*Pre-launch checklist must be signed off in writing by Tech Lead and Program Lead.*
