# H.I.P.S. Ultimate Technical Architecture
## Hiding in Plain Sight Foundation — Platform v2.0

**Document Type:** [ARCH] Master Architecture Reference
**Status:** Canonical — supersedes all prior architecture drafts
**Last Updated:** April 22, 2026
**Depends on:** HIPS_Pricing_Spec_v1.md | HIPS_Architecture_v1.md | HIPS PRD (Tech Architecture)

---

## Executive Summary

This document merges two architecture sources — the **HIPS Pricing & Service Spec** (commerce-first, nonprofit compliance focused) and the **HIPS PRD Tech Architecture** (anonymity-first, real-time voice and avatar focused) — into one canonical system design. Where the two documents agreed, the shared decision is preserved. Where they diverged, the stronger, more production-defensible choice is selected with rationale documented. The result is a unified architecture that is: anonymous by design, compliant by structure, commerce-capable, and extensible from MVP to enterprise cohorts.

---

## 1. Core Principles (Non-Negotiable)

These principles govern every architectural decision in this document. Any proposed feature, shortcut, or optimization that conflicts with these principles must be rejected or deferred.

1. **Anonymous by default, accountable by design** — identity and session data are physically separated; counselors and staff cannot access identity without a logged, justified request.
2. **Security before features** — no feature ships if it creates a data linkage between identity and session data.
3. **Voice over video** — video introduces face recognition risk; voice with avatar is the primary modality.
4. **Web-first, laptop required for sessions** — mobile disables session capabilities; no exceptions in v1.
5. **Separation of identity, session, and analytics** — three logically and physically separate data stores.
6. **No AI in the decision seat** — AI is assistive only; no diagnosis, no crisis decisions, no spiritual authority.
7. **Scalable, modular services** — each major domain (auth, identity vault, sessions, safety, AI, payments) is independently deployable.
8. **Nonprofit integrity over revenue optimization** — scholarship users receive equal service quality; pricing logic never degrades access for those in need.

---

## 2. Architecture Comparison — Spec vs. PRD

The following table documents every significant dimension where the two source documents diverged. The **Selected Approach** column represents the resolved decision for this canonical document.

| Dimension | Pricing Spec (v1) | PRD Tech Architecture | Selected Approach | Rationale |
|---|---|---|---|---|
| **Frontend Stack** | Next.js + TypeScript + Tailwind | React + Next.js + Three.js + WebGL + Tailwind | **PRD wins** — add Three.js + WebGL | Avatar and virtual office are core to the anonymous session experience |
| **Backend Style** | Next.js API Routes (monolith) | NestJS or FastAPI microservices | **Hybrid** — Next.js for commerce routes; NestJS microservices for session, identity vault, safety | Monolith for booking/payments reduces ops overhead; microservices required for identity separation |
| **Auth** | Firebase Auth (Custom Claims) | Anonymous public IDs + secure tokens | **Both** — Firebase Auth for commerce layer; custom anonymous session tokens for voice/avatar sessions | Firebase handles scheduling, billing, and admin; session layer uses non-linked tokens |
| **Identity** | User table with role column | Encrypted Identity Vault, separate DB, KMS | **PRD wins** — Identity Vault required | This is the legal and ethical foundation of the platform; no compromise |
| **Voice/Video** | Zoom OAuth (external) | WebRTC (native, real-time) | **PRD wins** — WebRTC native | Zoom retains metadata and recording capability; WebRTC allows full control over data lifecycle |
| **Avatars** | Not in v1 | Three.js virtual office + locked avatar + gesture presets | **PRD wins** — included from Phase 1 | Core to anonymous session identity; required before public launch |
| **Real-Time Protocol** | HTTPS only | HTTPS + WSS (WebSocket) | **PRD wins** — HTTPS + WSS + WebRTC | Commerce routes stay HTTPS; session services require WSS and WebRTC |
| **Database** | PostgreSQL + Prisma (single) | PostgreSQL + Encrypted Identity DB + Object Storage | **PRD wins** — three physically separated stores | Data separation is the platform's primary compliance defense |
| **Payments** | Stripe (full integration) | Not specified | **Spec wins** — Stripe retained | Nonprofit must generate revenue; Stripe handles 501(c)(3) receipt compliance |
| **Safety Engine** | Crisis check in intake form only | Parallel Safety Engine with keyword monitoring, escalation queue | **PRD wins** — full Safety Engine | Keyword monitoring and escalation queue are mission-critical; intake form alone is insufficient |
| **Compliance Posture** | 501(c)(3) service revenue rules | HIPAA-capable hosting | **Both** — HIPAA-capable infrastructure + nonprofit fee-for-service rules | Even without clinical care, HIPAA-capable hosting signals intent and protects against future clinical expansion |
| **Mobile** | Web-responsive, mobile allowed | Mobile disabled for sessions | **PRD wins, nuanced** — mobile browsing allowed; mobile session initiation blocked | Users can browse, donate, and book on mobile; sessions require laptop |
| **AI Services** | Not in v1 | Post-session async: summaries, homework, reflection | **PRD wins** — Phase 2 AI | Opt-in only; no raw voice storage; no diagnostic capability |
| **Anonymity Model** | Soft (user-controlled) | Hard (anonymous by default, Identity Vault) | **PRD wins** — hard anonymity | Platform's primary differentiator and legal protection |
| **Audit Logging** | Stripe webhook log, basic admin | Immutable audit logs, identity vault access logged | **PRD wins** — immutable logs required | Identity vault access must be logged and unmodifiable for legal defensibility |
| **Group Sessions** | Cohort booking via packages | Lobby + scheduled rooms + moderator + voice turn-taking | **PRD wins** — full group engine | Package booking handles commerce; PRD handles the actual session experience |
| **Rate Limiting** | Per-endpoint (Firebase) | Implied at API Gateway | **Spec wins + extended** — explicit per-endpoint limits with API gateway enforcement | |
| **Crisis Escalation** | 988 referral shown; intake flag | Parallel Safety Engine; counselor flag; limited identity access | **PRD wins** — Safety Engine with human review | No AI decision; human counselor in the loop for every escalation |

---

## 3. Unified System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser — Laptop/Desktop Only)               │
│                                                                              │
│   Next.js App Router (TypeScript + Tailwind)                                 │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│   │  Commerce Layer  │  │  Session Layer   │  │  Admin / Staff Layer     │  │
│   │  Booking, Checkout│  │  Avatar, Voice,  │  │  Scholarship queue,      │  │
│   │  Donations, Dash- │  │  Virtual Office, │  │  Revenue reports, Org    │  │
│   │  board, Packages │  │  Three.js/WebGL  │  │  inquiry, Facilitator    │  │
│   └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────────┘  │
└────────────│────────────────────│───────────────────────│───────────────────┘
             │ HTTPS              │ HTTPS + WSS + WebRTC  │ HTTPS
             ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│   Rate limiting | TLS termination | Route dispatch | Request validation      │
└───────────┬──────────────────┬──────────────────┬──────────────────┬─────────┘
            │                  │                  │                  │
            ▼                  ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  COMMERCE     │  │  AUTH & SESSION   │  │  SAFETY &    │  │  AI SERVICES     │
│  SERVICE      │  │  SERVICES         │  │  COMPLIANCE  │  │  (Async, Phase 2)│
│               │  │                   │  │  ENGINE      │  │                  │
│  Next.js API  │  │  A. Auth Service  │  │              │  │  Session summaries│
│  Routes       │  │  (Firebase + anon   │  │  Keyword     │  │  Homework gen    │
│               │  │  session tokens)  │  │  monitoring  │  │  Reflection      │
│  Booking      │  │                   │  │              │  │  prompts         │
│  Packages     │  │  B. Identity Vault│  │  Counselor   │  │  Aggregate trends│
│  Scholarships │  │  (SEPARATE DB)    │  │  flag intake │  │                  │
│  Donations    │  │  KMS encrypted    │  │              │  │  No diagnosis    │
│  Org quotes   │  │  Zero cross-access│  │  Escalation  │  │  No raw voice    │
│  Stripe       │  │                   │  │  queue       │  │  storage         │
│  integration  │  │  C. Session Engine│  │              │  │  Opt-in only     │
│               │  │  WebRTC voice     │  │  Crisis      │  │                  │
└───────┬───────┘  │  Avatar/Three.js  │  │  protocol    │  └──────────────────┘
        │          │  Group lobby      │  │  trigger     │
        │          │  Facilitator match│  │              │
        │          └────────┬──────────┘  └──────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (PHYSICALLY SEPARATED)                  │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  COMMERCE DB     │  │  IDENTITY VAULT  │  │  SESSION DB              │   │
│  │  (PostgreSQL /   │  │  (Encrypted DB,  │  │  (PostgreSQL,            │   │
│  │   Railway)       │  │   KMS-encrypted, │  │   separate instance)     │   │
│  │                  │  │   isolated VPC)  │  │                          │   │
│  │  Users (commerce)│  │                  │  │  Sessions                │   │
│  │  Sessions (sched)│  │  Real name       │  │  Voice events (ephemeral)│   │
│  │  Packages        │  │  Emergency contact│  │  Avatar state            │   │
│  │  Scholarships    │  │  Region/state    │  │  Session notes           │   │
│  │  Donations       │  │  Gender lock     │  │  Facilitator assignments  │   │
│  │  OrgInquiries    │  │  Disclosure      │  │  Audit events            │   │
│  │  Stripe refs     │  │  acceptance      │  │  Group session state     │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘   │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────────────────────────┐  │
│  │  OBJECT STORAGE  │  │  ANALYTICS DB (Aggregate only, no PII)           │  │
│  │  (Firebase       │  │                                                  │  │
│  │   Storage)       │  │  Revenue trends, Session counts, Cohort fill     │  │
│  │                  │  │  rates, Scholarship usage, Donation conversion   │  │
│  │  Workbooks       │  │  No identity, no session content                 │  │
│  │  Courses         │  │                                                  │  │
│  │  Session summaries│  └──────────────────────────────────────────────────┘  │
│  │  Org resources   │                                                      │
│  └──────────────────┘                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Service Breakdown

### 4A. Commerce Service (Next.js API Routes)
Handles everything money-related. Runs on Vercel alongside the frontend.

**Responsibilities:**
- Booking creation, package management, session balance tracking
- Scholarship application, approval workflow, discount code issuance
- Stripe PaymentIntents (service purchases and donations — always separate charges)
- Org inquiry intake, admin quote generation, deposit + remainder collection
- Digital product delivery via Firebase Storage signed URLs
- Membership subscription lifecycle (create, renew, cancel)
- Nonprofit donor receipt generation (IRS-compliant, includes EIN and "no goods/services" statement)

**Key rules:**
- All Stripe webhook payloads verified with `stripe.webhooks.constructEvent`
- Donations and service purchases are never bundled into a single PaymentIntent
- Scholarship budget cap enforced server-side before discount code issuance

### 4B. Auth Service (Firebase Auth + Anonymous Session Tokens)
Two-layer authentication model.

**Commerce layer (Firebase Auth):**
- Manages accounts for booking, payment, dashboard, admin
- Custom Claims: `PARTICIPANT`, `LEADER`, `ORG_BUYER`, `FACILITATOR`, `ADMIN`
- Role verified against DB on every admin/facilitator operation

**Session layer (custom anonymous tokens):**
- On session start, Auth Service generates a short-lived anonymous session token
- Token is linked to a `session_id` only — never to a real user ID or permanent account
- Token expires at session end; not stored beyond the session window
- This is the mechanism that allows someone to attend a session without that attendance being linkable to their billing identity

### 4C. Identity Vault (Critical — Separate Service + Separate DB)
The legal and ethical cornerstone of the platform.

**Stores:**
- Real name
- Emergency contact
- Region / state / country
- Gender (locked post-verification)
- Disclosure and consent acceptance
- IP address (auto-expires per retention policy)
- Device fingerprint (lightweight)

**Access rules:**
- Zero direct access from session services — no join, no API call, no shared DB
- Identity Vault is only accessible via a dedicated, audited API endpoint
- Every access request must include: requester identity, justification, timestamp
- Every access is logged to an immutable audit log
- Crisis escalation can trigger a limited identity disclosure to emergency protocol — this is the only automated pathway, and it is logged and human-reviewed

**Encryption:**
- At rest: KMS-managed keys (AWS KMS or GCP Cloud KMS)
- In transit: TLS 1.3 minimum
- Keys rotated on a defined schedule; rotation events logged

### 4D. Session Engine
Handles real-time session lifecycle.

**Voice:**
- WebRTC (not Zoom) — full control over data lifecycle
- No recording by default
- Consent-based recording with explicit opt-in before session starts
- Voice smoothing enabled (not gender morphing)
- No raw audio stored unless consent given; even then, encrypted object storage with defined retention

**Avatars:**
- Three.js virtual office environment
- Avatar parameters locked post-selection (prevents identity probing via appearance changes)
- Gesture presets only — no free-form animation
- Avatar selection tied to session token, not identity

**Session Orchestration:**
- Facilitator ↔ participant matching (admin-assigned in v1; algorithm in v2)
- Session timing with automatic teardown
- Crisis flag triggers routed to Safety Engine
- Group session lobby: scheduled rooms, moderator controls, voice turn-taking, teaching mode

### 4E. Safety & Compliance Engine
Runs in parallel to all sessions. No AI makes final decisions here.

**Monitoring:**
- Keyword and phrase flagging (self-harm, violence, crisis language)
- Counselor-initiated flags
- Repeated distress pattern detection across sessions (aggregate signal, not individual surveillance)

**Response tiers:**
1. **Soft alert** — counselor receives a real-time flag indicator; no automatic action
2. **Escalation review** — session flagged for human review post-session; added to escalation queue
3. **Crisis protocol** — counselor or admin initiates; limited identity vault access triggered and logged; emergency services referral flow activated

**Hard rules:**
- No AI decision in the crisis pathway
- Identity vault access during crisis is logged with requester, timestamp, and justification
- 988 and local emergency resource display is mandatory at every crisis trigger point

### 4F. AI Services (Phase 2, Assistive Only)
Runs as post-session async jobs. Never touches live sessions.

**Permitted capabilities:**
- Session summary generation (opt-in, generated from counselor notes — not raw audio)
- Homework and reflection prompt generation
- Aggregate trend insights (population-level, no individual attribution)

**Hard restrictions:**
- No diagnosis
- No crisis decisioning
- No spiritual authority language
- No raw voice storage unless explicitly consented
- All AI output reviewed by facilitator before delivery to participant

---

## 5. Frontend Architecture

### Route Groups
```
├── (public)/              — No auth: homepage, service catalog, donate, org inquiry
├── (auth)/                — Firebase sign-in/up flows
├── (app)/                 — Firebase-authenticated routes
│   ├── dashboard/         — Session balance, bookings, downloads, packages
│   ├── book/[serviceId]/  — Availability calendar + slot selection
│   ├── checkout/          — Stripe Elements + optional donation add-on
│   └── scholarship/       — Eligibility form + status tracking
├── (session)/             — Session-token-authenticated routes (anonymous layer)
│   ├── session/[id]/      — Live voice session: avatar, controls, notes
│   └── lobby/[groupId]/   — Group session waiting room
└── (admin)/               — Admin and facilitator routes
    ├── bookings/          — All bookings, facilitator assignment
    ├── scholarships/      — Approval queue
    ├── organizations/     — Inquiry queue, quote builder
    ├── safety/            — Escalation queue, crisis log
    └── revenue/           — KPI dashboard, revenue report
```

### Key Client-Side Components
- **AvatarSelector** — Three.js avatar picker, locks on session start
- **VirtualOffice** — Three.js/WebGL room renderer, responsive to session state
- **VoiceControls** — WebRTC mute/unmute, end session, report flag
- **StripeElements** — Embedded payment form (Client Component only)
- **AvailabilityCalendar** — Facilitator slot picker (Client Component)
- **DonationAddon** — Optional donation widget shown at checkout
- **ScholarshipBadge** — Displays applied discount without exposing underlying rate
- **CrisisEscalation** — Full-screen overlay triggered by Safety Engine; shows 988 and local resources

### UI States (Required for Every Component)
All interactive components must implement all five states:

| State | Implementation |
|---|---|
| **Loading** | Shimmer skeleton matching component shape |
| **Empty** | Friendly message + primary action CTA |
| **Error** | User-facing message + retry; never raw error |
| **Success** | Confirmation with next step |
| **Disabled** | Visually distinct; buttons non-clickable during submission |

### Accessibility
- WCAG AA minimum across all surfaces
- Crisis escalation overlay: screen-reader accessible, keyboard-navigable, focus-trapped
- All avatar/virtual office interactions have keyboard and accessible alternatives
- Session controls: high-contrast, large touch targets (44px min)

---

## 6. API Design

### Commerce API (Next.js API Routes, v1)
```
POST   /api/v1/sessions/book
GET    /api/v1/sessions/availability
PATCH  /api/v1/sessions/:id/complete
POST   /api/v1/packages/purchase
GET    /api/v1/packages/balance
POST   /api/v1/scholarships/apply
PATCH  /api/v1/scholarships/:id          (admin/facilitator only)
POST   /api/v1/checkout/session
POST   /api/v1/checkout/donation
POST   /api/v1/webhooks/stripe
POST   /api/v1/organizations/inquiry
GET    /api/v1/admin/bookings
GET    /api/v1/admin/scholarships
GET    /api/v1/admin/revenue
```

### Session API (NestJS, WebSocket + REST)
```
POST   /session/v1/token               — Issue anonymous session token
WS     /session/v1/connect/:id         — WebSocket connection for session
POST   /session/v1/:id/flag            — Counselor initiates flag
POST   /session/v1/:id/end             — Terminate session + teardown
GET    /session/v1/:id/notes           — Retrieve session notes (facilitator)
POST   /group/v1/lobby/:id/join        — Join group session lobby
POST   /group/v1/lobby/:id/start       — Moderator starts group session
```

### Safety API (Internal only — not client-facing)
```
POST   /safety/v1/flag                 — Receives flag from Session Engine
GET    /safety/v1/queue                — Admin escalation queue
PATCH  /safety/v1/:id/resolve          — Admin resolves escalation
POST   /safety/v1/crisis/:id           — Initiate crisis protocol (logs identity vault access)
```

### Response Shape (All APIs)
```json
{
  "data": {},
  "error": null,
  "meta": {
    "timestamp": "2026-04-22T21:00:00Z",
    "requestId": "uuid"
  }
}
```

### Rate Limits
| Endpoint Category | Limit |
|---|---|
| Auth endpoints | 10 req/min |
| Booking + checkout | 30 req/min |
| Donation | 20 req/min |
| Session token issuance | 5 req/min |
| Admin endpoints | 60 req/min |
| Safety flag | 30 req/min |
| Stripe webhook | No limit (Stripe IP allowlist only) |

---

## 7. Database Schema

### Commerce DB (PostgreSQL — Railway)

```prisma
model User {
  id            String    @id @default(uuid())
  FirebaseId       String    @unique
  email         String    @unique
  role          Role      @default(PARTICIPANT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  sessions      Session[]
  packages      Package[]
  scholarships  Scholarship[]
  donations     Donation[]
}

enum Role { PARTICIPANT LEADER ORG_BUYER FACILITATOR ADMIN }

model Service {
  id              String          @id @default(uuid())
  slug            String          @unique
  name            String
  category        ServiceCategory
  standardPrice   Decimal
  scholarshipMin  Decimal         @default(0)
  scholarshipMax  Decimal         @default(0)
  durationMins    Int?
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

enum ServiceCategory {
  CARE_SESSION COACHING COHORT WORKSHOP RETREAT DIGITAL MEMBERSHIP
}

model Session {
  id              String        @id @default(uuid())
  userId          String
  serviceId       String
  facilitatorId   String?
  scheduledAt     DateTime
  status          SessionStatus @default(PENDING)
  pricePaid       Decimal
  isScholarship   Boolean       @default(false)
  stripePaymentId String?
  packageId       String?
  sessionTokenRef String?       -- Reference to anonymous session token (not the token itself)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum SessionStatus { PENDING CONFIRMED COMPLETED CANCELLED NO_SHOW }

model Package {
  id              String   @id @default(uuid())
  userId          String
  serviceId       String
  totalSessions   Int
  usedSessions    Int      @default(0)
  pricePaid       Decimal
  expiresAt       DateTime
  stripePaymentId String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Scholarship {
  id              String            @id @default(uuid())
  userId          String
  serviceId       String
  requestedAmount Decimal
  approvedAmount  Decimal?
  reason          String
  status          ScholarshipStatus @default(PENDING)
  discountCode    String?           @unique
  expiresAt       DateTime?
  reviewedBy      String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

enum ScholarshipStatus { PENDING APPROVED DENIED EXPIRED }

model Donation {
  id              String       @id @default(uuid())
  userId          String?
  email           String
  amount          Decimal
  tier            DonationTier
  stripePaymentId String       @unique
  receiptSent     Boolean      @default(false)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

enum DonationTier { SPONSOR_SESSION RESTORE_SESSION RESTORE_LEADER CUSTOM }

model OrgInquiry {
  id            String        @id @default(uuid())
  orgName       String
  contactEmail  String
  ein           String?
  isNonprofit   Boolean       @default(false)
  eventType     String
  preferredDate DateTime?
  headcount     Int?
  quoteAmount   Decimal?
  status        InquiryStatus @default(NEW)
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum InquiryStatus { NEW QUOTED DEPOSIT_PAID CONFIRMED COMPLETED CANCELLED }
```

### Session DB (PostgreSQL — Separate Instance)

```prisma
model SessionRecord {
  id              String         @id @default(uuid())
  anonSessionToken String        -- No link to commerce User ID
  facilitatorAnonId String
  startedAt       DateTime
  endedAt         DateTime?
  durationMins    Int?
  status          LiveSessionStatus
  flagCount       Int            @default(0)
  notes           String?
  summaryRef      String?        -- Object storage key, if AI summary opted in
  createdAt       DateTime       @default(now())
}

enum LiveSessionStatus { ACTIVE ENDED CRISIS_FLAGGED ABANDONED }

model GroupSessionRecord {
  id              String   @id @default(uuid())
  roomId          String   @unique
  moderatorAnonId String
  scheduledAt     DateTime
  participantCount Int     @default(0)
  status          String
  createdAt       DateTime @default(now())
}

model AuditEvent {
  id           String   @id @default(uuid())
  eventType    String
  actorId      String
  targetId     String?
  justification String?
  ipRef        String?  -- Hashed; not raw IP
  createdAt    DateTime @default(now())
  -- Immutable: no update, no delete permissions on this table
}
```

### Identity Vault DB (Separate Encrypted DB — Isolated VPC)

```
IdentityRecord {
  id                 UUID (primary)
  vaultToken         String (unique, maps to commerce session if crisis triggered)
  realName           Encrypted(String)
  email              Encrypted(String)
  emergencyContact   Encrypted(String)
  region             Encrypted(String)
  country            Encrypted(String)
  genderLock         Encrypted(String)
  disclosureAccepted Boolean
  disclosureDate     DateTime
  ipAddress          Encrypted(String, TTL: 30 days)
  deviceFingerprint  Encrypted(String, TTL: 90 days)
  createdAt          DateTime
  -- No updatedAt or deletedAt — immutable record; new record on amendment
}

VaultAccessLog {
  id            UUID
  requestorId   String
  vaultRecordId UUID
  justification String
  grantedAt     DateTime
  -- Insert-only. No update, no delete.
}
```

---

## 8. Security Architecture

### Encryption
| Layer | Method |
|---|---|
| Identity Vault at rest | KMS-managed keys (AWS KMS / GCP Cloud KMS) |
| Identity Vault in transit | TLS 1.3 |
| Session DB at rest | AES-256 (database-level encryption) |
| WebRTC voice | DTLS-SRTP (standard WebRTC encryption) |
| Object storage (summaries) | Server-side encryption, signed URL access |
| Commerce DB | TLS in transit; Railway managed encryption at rest |

### Auth Security
- Firebase JWT verified server-side on every commerce API route
- Role confirmed in DB (not only JWT claim) for admin/facilitator operations
- Anonymous session tokens: short-lived (session duration + 5 min), single-use, not stored in commerce DB
- Identity vault access tokens: separate from session tokens, require explicit justification field

### Input Validation
- All inputs validated with Zod before hitting any database
- Prisma parameterized queries exclusively — no raw string interpolation
- File uploads: type, size, and destination validated server-side before acceptance
- Crisis intake: sanitized before logging; no PII stored without explicit disclosure acceptance

### Audit & Immutability
- `AuditEvent` table: insert-only; DB user has no UPDATE or DELETE permission
- `VaultAccessLog`: insert-only; separate DB user
- Every identity vault access: requester, justification, timestamp, record accessed
- Stripe webhook log retained for 90 days minimum
- Admin actions logged with actor ID and timestamp

---

## 9. Location & Tracking Policy

| Data Point | Collected | Retention | Purpose |
|---|---|---|---|
| IP address | Yes | 30 days (auto-expire) | Safety compliance, legal jurisdiction |
| City / Region / State | Yes | Retained | Emergency response, jurisdiction |
| Country | Yes | Retained | Legal compliance |
| Device fingerprint | Yes (light) | 90 days | Fraud prevention |
| Precise GPS | No | Never | Not collected; IP region is sufficient |

**Hard rules:**
- IPs stored only in Identity Vault — never in session DB or commerce DB
- IP data never used for advertising or behavioral profiling
- Location data only accessible via Identity Vault access protocol (logged, justified)
- Full audit trail on all location data access

---

## 10. Deployment Architecture

```
GitHub (main — always deployable)
    │
    ├── GitHub Actions CI
    │   ├── pnpm install
    │   ├── TypeScript strict type check
    │   ├── ESLint
    │   ├── Vitest (unit + integration)
    │   ├── next build (commerce frontend)
    │   └── NestJS build check (session services)
    │
    ├── Vercel (Frontend + Commerce API)
    │   ├── Preview URL per PR
    │   └── Production on main merge
    │
    ├── Railway (Commerce DB — PostgreSQL)
    │   ├── Dev, staging, production instances
    │   └── prisma migrate deploy on each deploy
    │
    ├── HIPAA-capable cloud (Identity Vault + Session Services)
    │   ├── Isolated VPC — no public internet access
    │   ├── NestJS session services (containerized)
    │   ├── Encrypted Identity DB (separate instance, separate VPC subnet)
    │   ├── Session DB (separate instance)
    │   └── Automated daily backups; 30-day retention
    │
    └── Firebase Storage (Object Storage)
        └── Signed URLs; 24-hour expiry on digital product delivery
```

### Environments
| Environment | Frontend | Commerce DB | Session/Vault | Stripe |
|---|---|---|---|---|
| `development` | localhost | Railway dev | Local Docker | Test keys |
| `preview` | Vercel preview URL | Railway staging | Staging cloud | Test keys |
| `production` | Vercel production | Railway production | Production cloud | Live keys |

---

## 11. Phased Build Plan

### Phase 1 — MVP (Months 1–9)
**Commerce:** Booking, packages, scholarships, donations, digital products, org inquiry, admin panel
**Sessions:** WebRTC 1:1 voice sessions, basic Three.js avatar, virtual office room, session controls
**Safety:** Keyword flagging, counselor flag, basic escalation queue, crisis resource display
**Auth:** Firebase commerce layer + anonymous session token layer
**Identity Vault:** Full implementation — required before any session goes live

### Phase 2 — Groups & AI (Months 10–15)
**Sessions:** Group session lobby, scheduled rooms, moderator controls, voice turn-taking, teaching mode
**AI:** Opt-in post-session summaries, homework generation, reflection prompts
**Analytics:** Aggregate trend dashboard (no PII)
**Mobile:** Browse, donate, book on mobile; session initiation still blocked

### Phase 3 — Scale & Enterprise (Months 16–24)
**Orgs:** Organizational accounts, executive cohorts, org-level analytics
**AI:** Aggregate trend insights across cohorts, facilitator performance signals
**Sessions:** Enhanced virtual offices, expanded avatar library
**SMS:** Twilio booking reminders
**Matching:** Automated facilitator-participant matching algorithm
**AI matching:** Session summary-informed facilitator recommendations (opt-in, anonymized)

---

## 12. Senior Engineer Requirements

The platform requires engineering leads with specific, non-generic experience. Screening criteria:

**Required:**
- Built real-time systems using WebRTC or similar (not just Zoom/Agora wrappers)
- Designed data separation for sensitive use cases (healthcare, legal, financial)
- Has implemented KMS-based encryption at rest
- Understands WebSocket session lifecycle management at scale
- Can articulate the difference between logical and physical data separation
- Has reviewed a system for HIPAA readiness (even if not fully HIPAA-certified)
- Has said "no" to a feature request on security grounds and held the position

**Disqualifying signals:**
- "We can add security later" or "encryption is a Phase 3 thing"
- "IP address tracking identifies people precisely" (it does not)
- "Anonymity and identity management are the same problem"
- "We'll use Zoom, it's easier" (for a platform where call metadata is a privacy liability)
- "AI can handle the crisis decisions"
- "The frontend can enforce authorization"

---

## 13. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Identity Vault breached | 🔴 Critical | Low | KMS encryption, isolated VPC, insert-only audit log, penetration testing schedule |
| Session ↔ Identity data linked accidentally | 🔴 Critical | Medium | Physical DB separation, no shared DB user, code review gate on any cross-service call |
| Therapy-like language published to users | 🔴 High | Medium | Content review checklist pre-release; legal review of all UI copy; automated copy linter |
| WebRTC connection drop mid-session | 🟡 Medium | Medium | Session state preservation; reconnect within 2-min window; facilitator notified |
| Scholarship cap exhausted before month-end | 🟡 Medium | Medium | Admin alert at 80% usage; auto-waitlist; donor CTA shown to waitlisted users |
| Stripe webhook delivery failure | 🟡 Medium | Low | Idempotency keys; webhook event log; manual trigger in admin |
| Safety Engine false positive triggers crisis | 🟡 Medium | Medium | Human counselor review required before any identity vault access; no automated crisis action |
| AI summary contains identifying information | 🟡 Medium | Low | AI output gated behind facilitator review; generated from notes, not raw audio |
| Facilitator no-show | 🟢 Low | Medium | Admin notified immediately; participant rescheduled; no session consumed |
| Digital product hotlinked beyond purchaser | 🟢 Low | Low | Signed URLs expire in 24h; re-auth required per download; PDF watermarking in Phase 2 |

---

## 14. Out of Scope (v1–v2)

- HIPAA Business Associate Agreements or clinical data handling
- Licensed therapy delivery or clinical supervision workflows
- Insurance billing or superbill generation
- Native iOS/Android app (web-responsive only; sessions desktop-only)
- Multi-language / i18n support
- Grant management or government funding tracking
- AI-generated crisis response language
- Full gender voice morphing (voice smoothing only — not morphing)
- Biometric identity verification
- Peer-to-peer payment between participants

---

## 15. Environment Variables (Complete)

```env
# --- App ---
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# --- Firebase Auth ---
NEXT_PUBLIC_FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_FIREBASE_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_FIREBASE_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_FIREBASE_AFTER_SIGN_UP_URL=/dashboard

# --- Commerce DB ---
DATABASE_URL=

# --- Session DB ---
SESSION_DATABASE_URL=

# --- Identity Vault ---
VAULT_API_URL=
VAULT_API_SECRET=
VAULT_KMS_KEY_ID=

# --- Stripe ---
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# --- Firebase Storage ---
FIREBASE_STORAGE_BUCKET=

# --- Email (Resend) ---
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# --- Session Services ---
SESSION_SERVICE_URL=
SESSION_SERVICE_SECRET=

# --- Safety Engine ---
SAFETY_ENGINE_URL=
SAFETY_ENGINE_SECRET=

# --- AI Services (Phase 2) ---
OPENAI_API_KEY=
AI_SERVICE_URL=

# --- Operations ---
SCHOLARSHIP_MONTHLY_BUDGET_CAP=500
SIGNED_URL_EXPIRY_SECONDS=86400
IP_RETENTION_DAYS=30
DEVICE_FINGERPRINT_RETENTION_DAYS=90
```

**Hard rule:** No secret is ever committed to version control. All production secrets live in Vercel project settings, cloud secret manager, and `.env.local` (local only, `.gitignore`'d).

