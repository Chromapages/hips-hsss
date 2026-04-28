# H.I.P.S. API Reference

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** API Reference
**Version:** v1
**Status:** Canonical
**Date:** April 24, 2026
**Authority:** Tech Lead
**Companion Documents:** `HIPS_Ultimate_Architecture_v2.md` · `TEST_PLAN.md` · `DEPLOY_RUNBOOK.md`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Commerce API — `/api/v1/`](#3-commerce-api--apiv1)
4. [Session API — `/session/v1/`](#4-session-api--sessionv1)
5. [Group Session API — `/group/v1/`](#5-group-session-api--groupv1)
6. [Safety API — `/safety/v1/`](#6-safety-api--safetyv1)
7. [Stripe Webhooks](#7-stripe-webhooks)
8. [WebSocket Events](#8-websocket-events)
9. [Error Reference](#9-error-reference)

---

## 1. Overview

### Base URLs

| Service | Environment | Base URL |
|---|---|---|
| Commerce API | Production | `https://hips.foundation/api/v1` |
| Commerce API | Preview | `https://[branch].hips.foundation/api/v1` |
| Session API | Production | `https://session.hips.internal/session/v1` |
| Group API | Production | `https://session.hips.internal/group/v1` |
| Safety API | Production | `https://safety.hips.internal/safety/v1` |

Session, Group, and Safety APIs are **internal only** — not reachable from the public internet. They are accessible only from within the VPC private subnet. All requests from the Next.js commerce layer to these services use `SESSION_SERVICE_URL` and `SAFETY_ENGINE_URL` environment variables.

### API Versioning

All endpoints are versioned at the path level (`/v1/`). Breaking changes increment the version. Non-breaking additions (new optional fields, new endpoints) do not require a version bump.

### Standard Response Shape

Every endpoint returns this shape — no exceptions:

```typescript
{
  data: T | null,
  error: {
    code: string,       // machine-readable, e.g. "SCHOLARSHIP_CAP_REACHED"
    message: string     // human-readable, never a raw stack trace
  } | null,
  meta: {
    timestamp: string,  // ISO 8601
    requestId: string   // UUID v4
  }
}
```

**Rules:**
- `data` and `error` are mutually exclusive — one is always `null`
- `meta` is always present on every response
- Raw errors, stack traces, and database errors are **never** exposed in `message`
- On validation errors: `data` is `null`, `error.code` is `"VALIDATION_ERROR"`, `error.message` describes the first failing field

### Rate Limits

Rate limits are enforced at the API Gateway layer before requests reach route handlers.

| Endpoint Category | Limit | Window |
|---|---|---|
| Auth endpoints | 10 req | per minute |
| Booking & checkout | 30 req | per minute |
| Donation | 20 req | per minute |
| Session token issuance | 5 req | per minute |
| Admin endpoints | 60 req | per minute |
| Safety flag | 30 req | per minute |
| Stripe webhook | No limit | — (Stripe IP allowlist enforced instead) |

Rate limit exceeded returns `429 Too Many Requests` with `error.code: "RATE_LIMIT_EXCEEDED"` and a `Retry-After` header.

### Content Type

All requests and responses use `Content-Type: application/json`. The Stripe webhook endpoint (`POST /api/v1/webhooks/stripe`) uses `application/json` but requires the raw body for signature verification — do not parse before verification.

---

## 2. Authentication

### Commerce Layer — Clerk JWT

All Commerce API endpoints (except those marked **Public**) require a valid Clerk JWT.

**Header:**
```
Authorization: Bearer <clerk_jwt>
```

Clerk JWTs are issued by the Clerk SDK on sign-in. The JWT contains a `role` claim. **Important:** the `role` claim in the JWT is used for routing decisions only. For all `FACILITATOR` and `ADMIN` operations, the role is **re-verified against the Commerce DB** before the operation proceeds. A tampered JWT claim is rejected at the DB verification step.

**Role matrix:**

| Role | Capabilities |
|---|---|
| `PARTICIPANT` | Book sessions, purchase packages, apply for scholarship, checkout, donate, view own dashboard |
| `LEADER` | All PARTICIPANT capabilities + Leadership coaching booking |
| `ORGBUYER` | All PARTICIPANT capabilities + org inquiry submission |
| `FACILITATOR` | View assigned sessions, mark complete, write session notes, initiate safety flag, initiate crisis protocol (if designated) |
| `ADMIN` | All capabilities + scholarship approval, revenue reports, org quote generation, safety queue management |

### Session Layer — Anonymous Session Token

Session API endpoints (`/session/v1/`, `/group/v1/`) use **anonymous session tokens**, not Clerk JWTs.

**How to obtain:**
```
POST /session/v1/token
Authorization: Bearer <clerk_jwt>   ← Commerce JWT used to authenticate the request
Body: { "sessionId": "<commerce_session_id>" }
```

The returned token:
- Is linked to a `sessionId` only — **never** to a `userId` or Clerk account
- Expires at session end (not time-based — event-based)
- Is single-use — cannot be reused after session teardown
- Is not stored in the Commerce DB

**Header for session routes:**
```
X-Session-Token: <anonymous_session_token>
```

### Identity Vault — Internal Only

The Identity Vault API (`VAULT_API_URL`) is not a client-facing API. It is called only by the Vault service internally. It requires `VAULT_API_SECRET` in a service-to-service header. No client ever calls it directly.

---

## 3. Commerce API — `/api/v1/`

All Commerce API routes run on Next.js API Routes (Vercel). All require Clerk JWT unless marked **Public**.

---

### `POST /api/v1/sessions/book`

Book an individual session.

**Auth:** Required — `PARTICIPANT`, `LEADER`
**Rate limit:** 30 req/min

**Request body:**
```typescript
{
  serviceId: string,          // UUID — must be active service
  scheduledAt: string,        // ISO 8601 datetime
  facilitatorId?: string,     // UUID — optional in v1 (admin assigns if omitted)
  packageId?: string,         // UUID — if booking from existing package balance
  discountCode?: string       // Scholarship discount code if applying
}
```

**Success `201`:**
```typescript
{
  data: {
    sessionId: string,        // UUID
    serviceId: string,
    scheduledAt: string,
    status: "PENDING",
    pricePaid: number,
    isScholarship: boolean,
    packageId: string | null,
    confirmationEmailSent: boolean
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Missing required field or invalid datetime |
| `400` | `SLOT_UNAVAILABLE` | Requested slot already booked |
| `400` | `PACKAGE_EXPIRED` | Package `expiresAt` is in the past |
| `400` | `PACKAGE_EXHAUSTED` | Package `usedSessions >= totalSessions` |
| `400` | `DISCOUNT_CODE_INVALID` | Code does not exist or has expired |
| `400` | `DISCOUNT_CODE_WRONG_SERVICE` | Code valid but not for this service |
| `401` | `UNAUTHORIZED` | Missing or invalid Clerk JWT |
| `403` | `SESSION_HOURS_BLOCKED` | Requested time outside Mon–Sat 8am–9pm window |
| `422` | `SERVICE_INACTIVE` | Service `isActive` is false |

**Business rules:**
- If `discountCode` is present, validate against `Scholarship.discountCode`, confirm `status = APPROVED` and `expiresAt > now()` and `serviceId` matches
- If `packageId` is present, verify `usedSessions < totalSessions` and `expiresAt > now()` — increment `usedSessions` atomically
- Sessions may only be scheduled within the Mon–Sat 8am–9pm session window
- Booking triggers `BOOKING_CONFIRMATION` email via Resend

---

### `GET /api/v1/sessions/availability`

Get available session slots for a service within a date range.

**Auth:** Required — all roles
**Rate limit:** 30 req/min

**Query parameters:**
```
serviceId: string    (required) UUID
startDate: string    (required) ISO 8601 date
endDate: string      (required) ISO 8601 date — max 30-day range
facilitatorId?: string  UUID — filter to specific facilitator
```

**Success `200`:**
```typescript
{
  data: {
    slots: Array<{
      datetime: string,       // ISO 8601
      facilitatorId: string,  // anonymous facilitator ID — not real name
      available: boolean
    }>
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Notes:** `facilitatorId` in this response is the Clerk user ID — used for booking only. Participant cannot derive the facilitator's real identity from this ID.

---

### `PATCH /api/v1/sessions/:id/complete`

Mark a session as completed.

**Auth:** Required — `FACILITATOR` (own sessions only), `ADMIN`
**Rate limit:** 60 req/min

**Path parameter:** `id` — session UUID

**Request body:**
```typescript
{
  notes?: string    // Session notes — max 5000 chars
}
```

**Success `200`:**
```typescript
{
  data: {
    sessionId: string,
    status: "COMPLETED",
    completedAt: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `403` | `FORBIDDEN` | Facilitator attempting to complete another facilitator's session |
| `404` | `SESSION_NOT_FOUND` | Session ID does not exist |
| `409` | `SESSION_ALREADY_COMPLETED` | Session status is already `COMPLETED` |
| `409` | `SESSION_CANCELLED` | Cannot complete a cancelled session |

**Side effects:** Triggers 48-hour follow-up survey email cron registration.

---

### `POST /api/v1/packages/purchase`

Purchase a session package. Called after Stripe `payment_intent.succeeded` webhook — do not call directly from frontend before payment confirmation.

**Auth:** Required — `PARTICIPANT`, `LEADER`
**Rate limit:** 30 req/min

**Request body:**
```typescript
{
  serviceId: string,          // UUID — must be CARE_SESSION or COACHING category
  stripePaymentId: string,    // From confirmed PaymentIntent
  isScholarship?: boolean,    // defaults false
  discountCode?: string
}
```

**Success `201`:**
```typescript
{
  data: {
    packageId: string,
    totalSessions: number,
    usedSessions: 0,
    expiresAt: string,        // now + 90 days ISO 8601
    pricePaid: number
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `INVALID_SERVICE_CATEGORY` | Packages only available for CARE_SESSION or COACHING |
| `400` | `DUPLICATE_PAYMENT` | `stripePaymentId` already exists in DB (idempotency guard) |
| `404` | `SERVICE_NOT_FOUND` | serviceId does not exist |

---

### `GET /api/v1/packages/balance`

Get authenticated user's current package balance.

**Auth:** Required — all roles
**Rate limit:** 60 req/min

**Success `200`:**
```typescript
{
  data: {
    packages: Array<{
      packageId: string,
      serviceName: string,
      totalSessions: number,
      usedSessions: number,
      remaining: number,
      expiresAt: string,
      isExpiringSoon: boolean  // true if within 75% of expiry window
    }>
  },
  error: null,
  meta: { timestamp, requestId }
}
```

---

### `POST /api/v1/scholarships/apply`

Submit a scholarship application.

**Auth:** Required — `PARTICIPANT`, `LEADER`
**Rate limit:** 10 req/min

**Request body:**
```typescript
{
  serviceId: string,
  requestedAmount: number,    // Must be within service scholarshipMin–scholarshipMax
  reason: string              // Max 1000 chars — stored but never returned to participant
}
```

**Success `201`:**
```typescript
{
  data: {
    scholarshipId: string,
    status: "PENDING",
    serviceId: string,
    requestedAmount: number,
    submittedAt: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `AMOUNT_OUT_OF_RANGE` | requestedAmount outside service scholarshipMin/Max |
| `400` | `SCHOLARSHIP_CAP_REACHED` | Monthly budget cap (`SCHOLARSHIP_MONTHLY_BUDGET_CAP`) exhausted — waitlist opens |
| `409` | `DUPLICATE_APPLICATION` | Active PENDING application exists for this user + service |

**Business rules:**
- Scholarship budget checked server-side before record creation — cap enforced atomically
- If cap reached: `SCHOLARSHIP_CAP_REACHED` returned, participant added to waitlist, admin alerted
- Admin notified of new application via Resend `SCHOLARSHIP_PENDING` internal email

---

### `PATCH /api/v1/scholarships/:id`

Approve or deny a scholarship application.

**Auth:** Required — `ADMIN`, `FACILITATOR`
**Rate limit:** 60 req/min

**Path parameter:** `id` — scholarship UUID

**Request body:**
```typescript
{
  status: "APPROVED" | "DENIED",
  approvedAmount?: number,    // Required if status = APPROVED
  reviewNote?: string         // Internal note — never sent to participant
}
```

**Success `200`:**
```typescript
{
  data: {
    scholarshipId: string,
    status: "APPROVED" | "DENIED",
    discountCode: string | null,  // Generated on APPROVED, null on DENIED
    expiresAt: string | null,     // 30 days from approval, null on DENIED
    approvedAmount: number | null
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `APPROVED_AMOUNT_REQUIRED` | status = APPROVED but approvedAmount missing |
| `404` | `SCHOLARSHIP_NOT_FOUND` | ID does not exist |
| `409` | `ALREADY_REVIEWED` | Scholarship status is not PENDING |

**Side effects:** Triggers `SCHOLARSHIP_APPROVED` or `SCHOLARSHIP_DENIED` Resend email to participant.

---

### `POST /api/v1/checkout/session`

Create a Stripe PaymentIntent for a service purchase.

**Auth:** Required — all roles
**Rate limit:** 30 req/min

**Request body:**
```typescript
{
  serviceId: string,
  discountCode?: string,      // Validated server-side
  packageTier?: "4_SESSION" | "8_SESSION"  // If purchasing a package
}
```

**Success `201`:**
```typescript
{
  data: {
    clientSecret: string,     // Stripe PaymentIntent client_secret — passed to Stripe Elements
    amount: number,           // Final amount in cents after discount
    currency: "usd",
    paymentIntentId: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Rules:**
- This PaymentIntent is **exclusively** for service purchase — never bundled with donation
- `discountCode` validated and applied server-side — client never calculates final price
- If `discountCode` is provided and invalid: `400 DISCOUNT_CODE_INVALID` — PaymentIntent not created

---

### `POST /api/v1/checkout/donation`

Create a Stripe PaymentIntent for a donation. Separate from any service purchase.

**Auth:** Optional — anonymous donations accepted
**Rate limit:** 20 req/min

**Request body:**
```typescript
{
  amount: number,             // Cents — minimum 100 ($1.00)
  tier: "SPONSOR_SESSION" | "RESTORE_SESSION" | "RESTORE_LEADER" | "CUSTOM",
  email: string,              // Required for receipt — even for unauthenticated donors
  userId?: string             // Clerk user ID if authenticated
}
```

**Success `201`:**
```typescript
{
  data: {
    clientSecret: string,     // Stripe PaymentIntent client_secret
    amount: number,
    currency: "usd",
    paymentIntentId: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Hard rule:** This endpoint creates a PaymentIntent with `metadata.type = "DONATION"`. The Stripe webhook handler checks this metadata to route `payment_intent.succeeded` to the correct handler. Service and donation PaymentIntents are **never** merged.

---

### `POST /api/v1/webhooks/stripe`

Stripe webhook handler. Receives all Stripe events.

**Auth:** None — Stripe signature verification used instead
**Rate limit:** No limit — Stripe IP allowlist enforced at network level

**Headers required:**
```
Stripe-Signature: <stripe_signature>
```

**Verification (required before any processing):**
```typescript
const event = stripe.webhooks.constructEvent(
  rawBody,           // Must be raw buffer — not parsed JSON
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Handled events:**

| Event | Handler |
|---|---|
| `payment_intent.succeeded` | See §7 |
| `payment_intent.payment_failed` | Log failure, update session/package status, send failure notification |
| `customer.subscription.deleted` | Revoke membership portal access, send `MEMBERSHIP_CANCELLATION` email |
| `invoice.paid` | Renew membership access window, update `expiresAt` |

Returns `200` immediately on receipt. All processing is async. Returns `400` only if signature verification fails — Stripe will retry on `4xx/5xx`.

---

### `POST /api/v1/organizations/inquiry`

Submit an org inquiry (workshop, retreat, speaking).

**Auth:** None — **Public**
**Rate limit:** 10 req/min

**Request body:**
```typescript
{
  orgName: string,            // Max 200 chars
  contactEmail: string,       // Valid email
  ein?: string,               // Required if isNonprofit = true
  isNonprofit: boolean,
  eventType: string,          // "WORKSHOP" | "HALF_DAY" | "FULL_DAY" | "RETREAT" | "SPEAKING"
  preferredDate?: string,     // ISO 8601 date
  headcount?: number,         // 1–1000
  notes?: string              // Max 2000 chars
}
```

**Success `201`:**
```typescript
{
  data: {
    inquiryId: string,
    status: "NEW",
    submittedAt: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Notes:** EIN is stored but never returned in API responses. `ORG_INQUIRY_RECEIVED` email sent to `contactEmail`. Admin notified internally.

---

### `GET /api/v1/admin/bookings`

Paginated list of all bookings.

**Auth:** Required — `ADMIN`
**Rate limit:** 60 req/min

**Query parameters:**
```
page?: number         default 1
limit?: number        default 50, max 100
status?: string       SessionStatus enum
facilitatorId?: string
startDate?: string    ISO 8601
endDate?: string      ISO 8601
```

**Success `200`:**
```typescript
{
  data: {
    sessions: Array<{
      sessionId: string,
      serviceId: string,
      serviceName: string,
      userId: string,
      facilitatorId: string | null,
      scheduledAt: string,
      status: SessionStatus,
      pricePaid: number,
      isScholarship: boolean
    }>,
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Note:** `userId` is the Clerk user ID — not the participant's real name. Real names are never returned from Commerce API endpoints.

---

### `GET /api/v1/admin/scholarships`

Paginated scholarship queue.

**Auth:** Required — `ADMIN`
**Rate limit:** 60 req/min

**Query parameters:**
```
page?: number         default 1
limit?: number        default 50
status?: string       ScholarshipStatus enum — default PENDING
```

**Success `200`:**
```typescript
{
  data: {
    scholarships: Array<{
      scholarshipId: string,
      userId: string,
      serviceId: string,
      serviceName: string,
      requestedAmount: number,
      approvedAmount: number | null,
      reason: string,
      status: ScholarshipStatus,
      discountCode: string | null,
      expiresAt: string | null,
      createdAt: string
    }>,
    budgetStatus: {
      monthlyCapTotal: number,
      monthlyCapUsed: number,
      monthlyCapRemaining: number,
      waitlistCount: number
    },
    pagination: { page, limit, total, totalPages }
  },
  error: null,
  meta: { timestamp, requestId }
}
```

---

### `GET /api/v1/admin/revenue`

Revenue summary report.

**Auth:** Required — `ADMIN`
**Rate limit:** 60 req/min

**Query parameters:**
```
startDate: string     ISO 8601 date (required)
endDate: string       ISO 8601 date (required)
groupBy?: string      "day" | "week" | "month" — default "month"
```

**Success `200`:**
```typescript
{
  data: {
    summary: {
      totalRevenue: number,
      serviceRevenue: number,
      donationRevenue: number,
      scholarshipDiscount: number
    },
    byCategory: Array<{
      category: ServiceCategory,
      revenue: number,
      sessionCount: number
    }>,
    byPeriod: Array<{
      period: string,
      serviceRevenue: number,
      donationRevenue: number
    }>,
    kpis: {
      sessionCompletionRate: number,     // COMPLETED / (COMPLETED + NO_SHOW)
      packageUtilizationRate: number,    // avg usedSessions / totalSessions
      cohortFillRate: number,            // avg enrolled / capacity
      donationConversionRate: number,    // checkouts with donation / total checkouts
      scholarshipUsageRate: number       // scholarshipSessions / totalSessions
    }
  },
  error: null,
  meta: { timestamp, requestId }
}
```

---

## 4. Session API — `/session/v1/`

Session API runs on NestJS inside the VPC. Not publicly accessible. Called from the Next.js commerce layer via `SESSION_SERVICE_URL`. All routes require `X-Session-Token` (anonymous) except `POST /session/v1/token`.

---

### `POST /session/v1/token`

Issue an anonymous session token.

**Auth:** Clerk JWT (`Authorization: Bearer`) — used to verify the session belongs to this user
**Rate limit:** 5 req/min (strictest limit on the platform)

**Request body:**
```typescript
{
  sessionId: string    // Commerce DB session UUID — must be CONFIRMED status
}
```

**Success `201`:**
```typescript
{
  data: {
    sessionToken: string,     // Short-lived anonymous token
    sessionId: string,        // Echoed back — NOT linked in DB to userId
    expiresAt: string         // Session end time
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `SESSION_NOT_CONFIRMED` | Session status is not CONFIRMED |
| `403` | `MOBILE_DEVICE_BLOCKED` | Request originated from mobile user-agent — sessions require laptop/desktop |
| `403` | `SESSION_NOT_OWNED` | sessionId belongs to a different userId |
| `409` | `TOKEN_ALREADY_ISSUED` | Active token already exists for this sessionId |

**Critical:** The token issued here is stored in the **Session DB** linked to `sessionId` only. The `userId` is verified at issuance but **never stored** in the session token record. Once issued, no join between the token and a real identity is possible.

---

### `WS /session/v1/connect/:id`

WebSocket connection for a live session.

**Auth:** `X-Session-Token` passed as query parameter on upgrade: `?token=<session_token>`

**Connection:** WSS (WebSocket Secure). Upgrade from HTTPS. DTLS-SRTP enforced for all voice data.

**Behavior on connect:**
- Session status → `ACTIVE` in Session DB
- Voice smoothing enabled by default
- Recording disabled by default

**Behavior on disconnect:**
- If facilitator disconnects: 2-minute reconnect window before `ABANDONED` status
- If participant disconnects: session pauses, facilitator notified, 5-minute reconnect window
- On session end (`POST /session/v1/:id/end`): all voice buffers destroyed, token invalidated

See §8 for full WebSocket event schema.

---

### `POST /session/v1/:id/flag`

Facilitator initiates a safety flag.

**Auth:** `X-Session-Token` — facilitator token only
**Rate limit:** 30 req/min

**Path parameter:** `id` — anonymous session ID (from Session DB, not Commerce DB)

**Request body:**
```typescript
{
  flagType: "CRISIS" | "DISTRESS" | "SAFETY_CONCERN",
  note?: string    // Facilitator's note — max 500 chars
}
```

**Success `201`:**
```typescript
{
  data: {
    flagId: string,
    sessionId: string,
    flagType: string,
    tier: 1 | 2 | 3,          // Safety Engine determines tier
    escalationId: string | null // null for Tier 1 (soft alert only)
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Side effects:**
- Logs to `AuditEvent` (insert-only)
- Forwards to Safety Engine `POST /safety/v1/flag`
- For `CRISIS` flagType: Safety Engine auto-elevates to Tier 3 queue, SMS+Slack to designated reviewers

---

### `POST /session/v1/:id/end`

Terminate a session and trigger teardown.

**Auth:** `X-Session-Token` — facilitator or participant token
**Rate limit:** 60 req/min

**Request body:**
```typescript
{
  endedBy: "FACILITATOR" | "PARTICIPANT" | "TIMEOUT",
  durationMins?: number
}
```

**Success `200`:**
```typescript
{
  data: {
    sessionId: string,
    status: "ENDED",
    durationMins: number,
    voiceBuffersDestroyed: boolean,  // Always true unless consent-based recording
    tokenInvalidated: boolean        // Always true
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Teardown sequence (in order):**
1. WebSocket connection closed for all participants
2. Voice buffers destroyed (unless consent-based recording — then encrypted to object storage)
3. Session token invalidated
4. `SessionRecord.status` → `ENDED`, `endedAt` set, `durationMins` calculated
5. Follow-up survey cron registered (fires 48h later)

---

### `GET /session/v1/:id/notes`

Retrieve facilitator notes for a session.

**Auth:** `X-Session-Token` — facilitator token only

**Path parameter:** `id` — anonymous session ID

**Success `200`:**
```typescript
{
  data: {
    sessionId: string,
    notes: string | null,
    lastUpdated: string | null
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Note:** Notes are stored in the Session DB — not the Identity Vault. They must not contain any PII (see `ONBOARDING_FACILITATOR.md` §8 for the note anonymity rules enforced at review).

---

## 5. Group Session API — `/group/v1/`

Group API runs on the same NestJS service as the Session API. Requires anonymous session token.

---

### `POST /group/v1/lobby/:id/join`

Join a group session lobby (waiting room).

**Auth:** `X-Session-Token`
**Rate limit:** 30 req/min

**Path parameter:** `id` — group room ID (from Commerce DB cohort booking)

**Request body:**
```typescript
{
  avatarId: string    // Must match avatar selected at session token issuance
}
```

**Success `200`:**
```typescript
{
  data: {
    roomId: string,
    lobbyStatus: "WAITING" | "STARTING" | "ACTIVE",
    participantCount: number,  // Current count — not participant identities
    maxParticipants: 12,
    moderatorPresent: boolean
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `403` | `COHORT_AT_CAPACITY` | `participantCount >= 12` |
| `404` | `ROOM_NOT_FOUND` | Room ID does not exist or session not yet opened |

**Lobby state** is managed in Redis (ElastiCache) — not persisted to DB until session starts.

---

### `POST /group/v1/lobby/:id/start`

Moderator starts the group session — opens voice for all lobby participants.

**Auth:** `X-Session-Token` — moderator (facilitator) token only. Non-moderator tokens return `403`.

**Path parameter:** `id` — group room ID

**Request body:**
```typescript
{
  startMode: "FULL_GROUP" | "TEACHING_MODE"
  // FULL_GROUP: all participants can speak (turn-taking queue active)
  // TEACHING_MODE: moderator broadcast only, participants signal to speak
}
```

**Success `200`:**
```typescript
{
  data: {
    roomId: string,
    status: "ACTIVE",
    participantCount: number,
    startMode: string,
    startedAt: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Side effects:** Creates `GroupSessionRecord` in Session DB. Broadcasts `SESSION_STARTED` WebSocket event to all lobby participants.

---

## 6. Safety API — `/safety/v1/`

Safety API runs on a separate NestJS service inside the VPC. **Internal only — not client-facing.** Called from the Session service and from the Next.js admin layer via `SAFETY_ENGINE_URL`.

---

### `POST /safety/v1/flag`

Receive a flag from the Session Engine.

**Auth:** Internal service secret (`X-Safety-Secret`)
**Rate limit:** 30 req/min

**Request body:**
```typescript
{
  sessionId: string,     // Anonymous session ID
  flagType: string,
  flagSource: "COUNSELOR" | "KEYWORD" | "PATTERN",
  timestamp: string,
  note?: string
}
```

**Success `201`:**
```typescript
{
  data: {
    escalationId: string,
    tier: 1 | 2 | 3,
    addedToQueue: boolean
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Tier assignment logic:**
- `CRISIS` flagType → always Tier 3
- `COUNSELOR` source → Tier 2 (escalation queue)
- `KEYWORD` or `PATTERN` source → Tier 1 (soft alert only; counselor decides to escalate)

---

### `GET /safety/v1/queue`

Admin escalation queue — paginated, sorted by severity then timestamp.

**Auth:** Clerk JWT — `ADMIN` only
**Rate limit:** 60 req/min

**Query parameters:**
```
status?: "PENDING" | "REVIEWING" | "RESOLVED"   default PENDING
page?: number
limit?: number   max 50
```

**Success `200`:**
```typescript
{
  data: {
    escalations: Array<{
      escalationId: string,
      sessionId: string,       // Anonymous
      tier: 1 | 2 | 3,
      flagType: string,
      flagSource: string,
      status: string,
      flaggedAt: string,
      slaDue: string | null,   // flaggedAt + 15min for Tier 3
      resolvedAt: string | null
    }>,
    pagination: { page, limit, total, totalPages }
  },
  error: null,
  meta: { timestamp, requestId }
}
```

---

### `PATCH /safety/v1/:id/resolve`

Admin or designated reviewer resolves an escalation.

**Auth:** Clerk JWT — `ADMIN` or `FACILITATOR` (if designated crisis reviewer)
**Rate limit:** 60 req/min

**Request body:**
```typescript
{
  resolutionNote: string,    // Required — min 20 chars, max 2000
  outcome: "RESOLVED_SAFE" | "RESOLVED_CRISIS_PROTOCOL" | "RESOLVED_REFERRAL"
}
```

**Success `200`:**
```typescript
{
  data: {
    escalationId: string,
    status: "RESOLVED",
    resolvedAt: string,
    resolvedBy: string,    // Clerk user ID of resolver
    outcome: string
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `RESOLUTION_NOTE_REQUIRED` | `resolutionNote` missing or under 20 chars |
| `409` | `ALREADY_RESOLVED` | Escalation is already in RESOLVED status |

**Side effects:** Logs to `AuditEvent` with resolver ID, timestamp, and resolution note.

---

### `POST /safety/v1/crisis/:id`

Initiate the crisis protocol — triggers limited Identity Vault access.

**Auth:** Clerk JWT — `ADMIN` or designated `FACILITATOR` reviewer only
**Rate limit:** 5 req/min (strictest safety endpoint)

**Path parameter:** `id` — escalation ID (not session ID)

**Request body:**
```typescript
{
  justification: string    // Required — min 20 chars. Logged permanently.
}
```

**Success `200`:**
```typescript
{
  data: {
    escalationId: string,
    crisisActive: true,
    vaultDataRetrieved: {
      emergencyContact: string,   // Decrypted from Identity Vault
      region: string,
      country: string
      // ONLY these three fields — no other vault data returned
    },
    resourcesDisplayed: {
      national: "988 Suicide & Crisis Lifeline",
      crisisText: "Text HOME to 741741",
      localEmergency: string     // Derived from region/country
    },
    vaultAccessLogId: string     // Immutable log entry — cannot be deleted
  },
  error: null,
  meta: { timestamp, requestId }
}
```

**Error responses:**

| Status | `error.code` | Condition |
|---|---|---|
| `400` | `JUSTIFICATION_REQUIRED` | `justification` missing or under 20 chars |
| `403` | `NOT_DESIGNATED_REVIEWER` | Caller is FACILITATOR but not a designated crisis reviewer |
| `404` | `ESCALATION_NOT_FOUND` | Escalation ID does not exist |
| `409` | `CRISIS_ALREADY_ACTIVE` | Crisis protocol already initiated for this escalation |

**What this endpoint does (in order):**
1. Validates justification field — rejects if absent
2. Verifies caller is `ADMIN` or designated reviewer
3. Calls Identity Vault API — retrieves `emergencyContact`, `region`, `country` **only**
4. Writes immutable `VaultAccessLog` entry — requestorId, vaultRecordId, justification, timestamp
5. Marks escalation `CRISIS_ACTIVE`
6. Triggers `CrisisEscalation` overlay on participant's session UI (via WebSocket event)
7. Logs to `AuditEvent`

**Hard rules:**
- `realName`, `email`, `ipAddress` are **never** retrieved or returned
- The `VaultAccessLog` entry is insert-only — no UPDATE or DELETE permission on that table
- 988 resources are displayed to participant simultaneously — not contingent on vault access success

---

## 7. Stripe Webhooks

All Stripe events arrive at `POST /api/v1/webhooks/stripe`. Signature is verified with `stripe.webhooks.constructEvent` before any processing. Events are idempotent — processing a duplicate event (same `event.id`) is a no-op.

### `payment_intent.succeeded`

Routed by `event.data.object.metadata.type`:

**`metadata.type = "SERVICE_PURCHASE"`**
1. Look up `Session` by `stripePaymentId`
2. Set `Session.status = CONFIRMED`
3. Send `BOOKING_CONFIRMATION` email via Resend
4. If `packageId` present: increment `Package.usedSessions` atomically

**`metadata.type = "PACKAGE_PURCHASE"`**
1. Create `Package` record with `totalSessions`, 90-day `expiresAt`, `pricePaid`
2. Send `PACKAGE_PURCHASE` email via Resend

**`metadata.type = "DONATION"`**
1. Create `Donation` record
2. Set `receiptSent = false`
3. Send IRS-compliant `DONATION_RECEIPT` email via Resend
4. Set `receiptSent = true`

**`metadata.type = "ORG_DEPOSIT"`**
1. Update `OrgInquiry.status = DEPOSIT_PAID`
2. Calculate `balanceDueDate` (7 days before event)
3. Send `ORG_DEPOSIT_CONFIRMED` email via Resend

**`metadata.type = "DIGITAL_PRODUCT"`**
1. Generate Supabase signed URL (24-hour expiry via `SIGNED_URL_EXPIRY_SECONDS`)
2. Send `DIGITAL_PRODUCT_DELIVERY` email with signed URL

### `payment_intent.payment_failed`

1. Log failure to `AuditEvent`
2. If `metadata.type = "SERVICE_PURCHASE"`: Session remains `PENDING`, send payment failure notification to participant
3. Participant can retry — new PaymentIntent required

### `customer.subscription.deleted`

1. Find membership by `stripeCustomerId`
2. Update membership `accessEndsAt` to current period end
3. Send `MEMBERSHIP_CANCELLATION` email via Resend
4. Do not revoke access until `accessEndsAt` passes

### `invoice.paid`

1. Find membership by `stripeCustomerId`
2. Extend `accessEndsAt` by one billing period
3. No email sent (renewal is silent — no email noise for recurring subscribers)

---

## 8. WebSocket Events

The WebSocket connection at `WS /session/v1/connect/:id` carries all real-time session state. All messages are JSON.

### Message Shape

```typescript
{
  event: string,       // Event name
  sessionId: string,   // Anonymous session ID
  payload: object,     // Event-specific data
  timestamp: string    // ISO 8601
}
```

### Client → Server Events

| Event | Payload | Description |
|---|---|---|
| `VOICE_STATE` | `{ muted: boolean }` | Participant mute/unmute |
| `GESTURE` | `{ gestureId: string }` | Avatar gesture (preset IDs only) |
| `SPEAKING_REQUEST` | `{}` | Group session: participant requests speaking turn |
| `END_SESSION` | `{ endedBy: "PARTICIPANT" }` | Participant-initiated session end |
| `RECONNECT` | `{ sessionToken: string }` | Reconnect after disconnect — token revalidated |

### Server → Client Events

| Event | Payload | Description |
|---|---|---|
| `SESSION_STARTED` | `{ sessionId, facilitatorPresent: boolean }` | Session is now live |
| `FACILITATOR_JOINED` | `{ facilitatorAnonId: string }` | Facilitator connected |
| `FACILITATOR_DISCONNECTED` | `{ reconnectWindowSecs: 120 }` | Facilitator dropped — reconnect window open |
| `PARTICIPANT_DISCONNECTED` | `{}` | Participant dropped — facilitator notified |
| `VOICE_TURN` | `{ speakerId: string, queue: string[] }` | Group: whose turn it is |
| `SAFETY_SOFT_ALERT` | `{ tier: 1 }` | Soft safety flag — facilitator-visible only |
| `CRISIS_OVERLAY` | `{ resources: {...} }` | Triggers CrisisEscalation overlay on participant screen |
| `SESSION_ENDED` | `{ endedBy, durationMins }` | Session has ended — teardown complete |
| `ERROR` | `{ code: string, message: string }` | WebSocket-level error |

### Session State Machine

```
PENDING → CONFIRMED → [token issued] → ACTIVE → ENDED
                                              ↓
                                        CRISIS_FLAGGED (parallel state — session continues)
                                              ↓
                                        ENDED (after resolution)
```

`ABANDONED` is set when no reconnect occurs within the reconnect window.

---

## 9. Error Reference

### HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET, PATCH |
| `201` | Created | Successful POST that creates a resource |
| `400` | Bad Request | Validation error, business rule violation |
| `401` | Unauthorized | Missing or invalid auth token |
| `403` | Forbidden | Valid auth, insufficient role or ownership |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate resource or invalid state transition |
| `422` | Unprocessable Entity | Valid format but semantic failure (e.g., inactive service) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unhandled server error — never exposes internals |

### Platform Error Codes

| `error.code` | HTTP | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod validation failure — field-level message included |
| `SLOT_UNAVAILABLE` | 400 | Requested booking slot not available |
| `PACKAGE_EXPIRED` | 400 | Package past its 90-day expiry |
| `PACKAGE_EXHAUSTED` | 400 | No sessions remaining in package |
| `DISCOUNT_CODE_INVALID` | 400 | Code doesn't exist or has expired |
| `DISCOUNT_CODE_WRONG_SERVICE` | 400 | Code valid but for different service |
| `SCHOLARSHIP_CAP_REACHED` | 400 | Monthly scholarship budget exhausted |
| `AMOUNT_OUT_OF_RANGE` | 400 | Scholarship amount outside min/max range |
| `INVALID_SERVICE_CATEGORY` | 400 | Operation not supported for this service type |
| `DUPLICATE_PAYMENT` | 400 | stripePaymentId already exists (idempotency) |
| `DUPLICATE_APPLICATION` | 409 | Active scholarship application already exists |
| `SESSION_NOT_CONFIRMED` | 400 | Session not in CONFIRMED state for token issuance |
| `MOBILE_DEVICE_BLOCKED` | 403 | Session initiation attempted from mobile device |
| `SESSION_NOT_OWNED` | 403 | sessionId belongs to different user |
| `TOKEN_ALREADY_ISSUED` | 409 | Active session token already exists for session |
| `SESSION_NOT_FOUND` | 404 | Session ID does not exist |
| `SESSION_ALREADY_COMPLETED` | 409 | Cannot complete an already-completed session |
| `SESSION_CANCELLED` | 409 | Cannot act on a cancelled session |
| `SESSION_HOURS_BLOCKED` | 403 | Outside Mon–Sat 8am–9pm session window |
| `COHORT_AT_CAPACITY` | 403 | Group room at max 12 participants |
| `RESOLUTION_NOTE_REQUIRED` | 400 | Safety resolution missing required note |
| `ALREADY_RESOLVED` | 409 | Escalation already in RESOLVED state |
| `JUSTIFICATION_REQUIRED` | 400 | Crisis protocol missing justification field |
| `NOT_DESIGNATED_REVIEWER` | 403 | Caller not authorized for crisis protocol |
| `CRISIS_ALREADY_ACTIVE` | 409 | Crisis protocol already running for this escalation |
| `SERVICE_INACTIVE` | 422 | Service isActive = false |
| `SERVICE_NOT_FOUND` | 404 | Service ID does not exist |
| `SCHOLARSHIP_NOT_FOUND` | 404 | Scholarship ID does not exist |
| `ALREADY_REVIEWED` | 409 | Scholarship not in PENDING state |
| `APPROVED_AMOUNT_REQUIRED` | 400 | Approval missing amount field |
| `UNAUTHORIZED` | 401 | Missing or invalid Clerk JWT |
| `FORBIDDEN` | 403 | Valid auth but insufficient permissions |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit hit — includes Retry-After header |

### Never-Expose Rules

The following must **never** appear in any API response `error.message`:
- Raw database errors (`PrismaClientKnownRequestError`, SQL errors)
- Stack traces
- Internal service URLs or IP addresses
- Secret key fragments
- Participant names, emails, or any PII
- Vault record IDs or VaultAccessLog IDs

All unhandled errors must be caught, logged internally, and returned as:
```json
{
  "data": null,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again."
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

---

*Document maintained by: Tech Lead*
*Review cycle: When any endpoint changes signature, status codes, or business rules*
*Change process: PR to `docs/API_REFERENCE.md` · must be updated in same PR as the endpoint change*
*All response shapes are validated by TypeScript types in `packages/types/src/api.ts`*
