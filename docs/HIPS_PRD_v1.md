# H.I.P.S. Platform — Product Requirements Document

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** [PRD] Master Product Requirements
**Version:** 1.0
**Status:** Living Document — supersedes all partial PRD references in prior architecture docs
**Date:** April 23, 2026
**Depends on:** `HIPS_Ultimate_Architecture_v2.md` · `HIPS_Pricing_Spec_v1.md` · `HIPS_Task_List_v1.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Core Principles](#3-core-principles-non-negotiable)
4. [Users & Personas](#4-users--personas)
5. [Service Catalog & Pricing](#5-service-catalog--pricing)
6. [Feature Requirements](#6-feature-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [UI States](#8-ui-states-required-for-every-interactive-component)
9. [Technical Stack](#9-technical-stack)
10. [Data Separation Enforcement](#10-data-separation-enforcement)
11. [Deployment Phases & Timeline](#11-deployment-phases--timeline)
12. [Risk Register](#12-risk-register)
13. [Out of Scope](#13-out-of-scope-v1v3)
14. [Success Metrics & Launch Criteria](#14-success-metrics--launch-criteria)
15. [Open Decisions & Blockers](#15-open-decisions--blockers)
16. [Approved Language Reference](#16-approved-language-reference)

---

## 1. Executive Summary

The H.I.P.S. (Hiding in Plain Sight) platform is the digital infrastructure for the Hiding in Plain Sight Foundation — a 501(c)(3) nonprofit that delivers peer support, coaching, and care navigation to individuals in crisis, leaders facing burnout, and organizations seeking confidential access to restoration services.

The platform's defining competitive position is **hard anonymity by design**: a participant can book, pay, and attend a live voice session — and their billing identity is never linkable to their session attendance, even by staff. This is not a privacy setting; it is a structural guarantee enforced at the database and infrastructure level.

---

## 2. Problem Statement

Millions of individuals experiencing emotional distress, burnout, or crisis avoid seeking support due to the fear of exposure — fear their identity will be logged, linked to records, discovered by employers, family, or insurers. Existing platforms either require full identity disclosure or offer only "soft" privacy controls that staff can override.

H.I.P.S. fills this gap by operating an anonymous-by-default peer support environment where:

- Real identity is never accessible during or after a session without a human-initiated, fully logged crisis justification
- Voice replaces video (eliminating face recognition risk)
- Avatars in a virtual office replace the participant's physical presence
- The platform explicitly never uses clinical language and is not subject to HIPAA as a covered entity

Without a structured platform to manage booking, payments, scholarship distribution, real-time sessions, and safety escalation, the foundation cannot scale, ensure service quality, or protect participants.

---

## 3. Core Principles (Non-Negotiable)

Every feature, shortcut, or optimization that conflicts with these principles must be rejected or deferred until explicitly overridden by the Founder with documented rationale.

1. **Anonymous by default, accountable by design** — identity and session data are physically separated; staff cannot access identity without a logged, justified request
2. **Security before features** — no feature ships if it creates a data linkage between identity and session data
3. **Voice over video** — video introduces face recognition risk; voice with avatar is the primary session modality
4. **Web-first; laptop required for sessions** — mobile browsing and booking is permitted; session initiation is blocked on mobile in v1
5. **Three separated data stores** — identity, session, and commerce data live in physically separate databases with no shared DB users
6. **No AI in the decision seat** — AI is assistive only; no diagnosis, no crisis decisions, no spiritual authority
7. **Nonprofit integrity over revenue optimization** — scholarship participants receive identical service quality to paying participants
8. **Peer support, not clinical care** — no licensed clinicians, no therapy, no clinical language in v1–v3

---

## 4. Users & Personas

| Role | Description | Auth Layer |
|---|---|---|
| **Guest** | Browses services, reads content, submits org inquiry | None |
| **Participant** | Books sessions, purchases packages, applies for scholarship | Firebase Auth |
| **Leader/Client** | Books coaching, accesses leadership track | Firebase Auth |
| **Org Buyer** | Purchases workshops, retreats, cohort seats in bulk | Firebase Auth |
| **Sponsor/Donor** | Makes donations, sponsors sessions for others | Optional Firebase |
| **Facilitator** | Views schedule, marks sessions complete, flags safety concerns | Firebase Auth (staff) |
| **Admin** | Manages all records, approves scholarships, views reports, initiates crisis | Firebase Auth (staff) |

All participants enter the **session layer** using a short-lived anonymous token that is linked only to a `session_id` — never to a permanent account, real name, or email. This two-layer authentication model is the mechanism that decouples billing identity from session attendance.

---

## 5. Service Catalog & Pricing

### 5.1 Care Access Sessions

| Service | Standard Price | Scholarship Range |
|---|---|---|
| 30-Min Intro Session | Free | — |
| 60-Min Support Session | $75 | $0–$50 |
| 4-Session Package | $250 | $0–$150 |
| 8-Session Package | $475 | $0–$250 |

**Rules:**
- Packages expire 90 days from purchase; non-refundable after first session consumed
- Intro session requires account creation for follow-up

### 5.2 Leadership Restoration Coaching

| Service | Price |
|---|---|
| 60-Min Private Session | $125 |
| Monthly Coaching (2 sessions) | $225 |
| 3-Month Intensive | $600 |
| Executive Priority Package | $1,200 |

**Rules:**
- Monthly retainers auto-bill via Stripe; cancellation requires 7-day notice
- Executive Priority Package includes priority scheduling + async message access

### 5.3 Group Support Cohorts

| Program | Price/Person |
|---|---|
| 6-Week Group Cohort | $149 |
| 8-Week Leader Cohort | $249 |
| Couples / Family Group | $199 |

**Rules:**
- Minimum cohort: 4 participants; maximum: 12 (enforced in app code and LiveKit room config)
- Org buyers purchasing ≥5 seats receive a 10% discount
- Cancelled by H.I.P.S. → full refund; cancelled by participant after Week 1 → 50% refund

### 5.4 Workshops & Speaking

| Type | Nonprofit/Church | Corporate/Private |
|---|---|---|
| 1-Hour Workshop | $500 | $1,500 |
| Half-Day Training | $1,250 | $3,500 |
| Full-Day Event | $2,500 | $5,000+ |

**Rules:**
- 50% deposit to confirm; remainder due 7 days before event
- 501(c)(3) EIN verification required at checkout for nonprofit pricing
- Full-Day Corporate minimum $5,000; final price based on headcount and travel

### 5.5 Retreats / Restoration Days

| Event | Price/Person |
|---|---|
| 1-Day Retreat | $199 |
| Weekend Retreat | $499 |
| VIP Private Retreat | $1,500+ |

**Rules:**
- Capacity: 20 max; registration closes 7 days before event or at capacity
- Refund: full >14 days out; 50% at 7–14 days; none <7 days

### 5.6 Digital Products

| Product | Price | Delivery |
|---|---|---|
| Workbook (PDF) | $19 | Signed URL, instant |
| Course | $79 | Gated portal |
| Leadership Toolkit | $99 | Signed URL, instant |
| Membership Library | $15/mo | Stripe subscription |

**Rules:**
- Non-refundable after download/access
- All assets served via Firebase Storage signed URLs (24-hour expiry by default)
- Membership cancels at end of billing cycle; no prorating

---

## 6. Feature Requirements

### 6.1 Commerce & Booking

#### Individual Session Booking Flow

```
Guest browses /services
→ Selects service
→ Create account or login (Firebase Auth)
→ Scholarship? → Scholarship flow
→ Select date/time from facilitator availability
→ Checkout (Stripe Elements + optional donation add-on)
→ Confirmation email + calendar invite (Resend)
→ 24-hour reminder email (cron-triggered)
→ Session takes place
→ Facilitator marks complete
→ Follow-up survey sent (48 hours later)
```

#### Package Purchase Flow

```
Login
→ Select package (4 or 8 sessions)
→ Checkout (Stripe one-time payment)
→ Package credited to account (balance shown in dashboard)
→ Book sessions individually from balance
→ Expiry warning email at 75% of expiry window
```

#### Org/Workshop Booking Flow

```
Org buyer visits /organizations
→ Fills intake form (org name, EIN, event type, date range, headcount)
→ Admin reviews → generates Stripe payment link (50% deposit)
→ Deposit paid → booking confirmed
→ Remainder invoiced 7 days before event
→ Pre-event logistics email 48 hours before
→ Post-event impact report within 7 days
```

#### Scholarship Logic

- Available for Care Access Sessions and Group Cohorts only
- Monthly budget cap: $500 (admin-configurable); enforced server-side before code issuance
- Admin alert at 80% cap usage; auto-waitlist at cap; donor CTA shown to waitlisted participants
- Discount codes valid 30 days; participants must reapply if expired
- Scholarship sessions are identical in experience to paid sessions — no visible difference

#### Donation Integration

- Tiers: $50 (Sponsor a Session) · $100 (Restore a Session) · $500 (Restore a Leader) · Custom
- Service purchases and donations are **always** separate Stripe PaymentIntents — never bundled
- Donations >$250 trigger automatic IRS-compliant receipt email
- Receipt must include: org name, EIN, amount, date, "no goods/services received" statement

---

### 6.2 Identity & Session Layer

#### Anonymous Session Token Issuance

- On session start, Auth Service issues a short-lived token linked to `session_id` only
- Token never references Firebase UID, email, or real name
- Token expires at session end; not stored beyond the session window

#### Voice Sessions (WebRTC via LiveKit)

- LiveKit self-hosted inside the HIPAA VPC (Private Subnet A — ECS Fargate)
- No recording by default; consent-based recording requires explicit pre-session opt-in
- Voice smoothing enabled; full gender morphing is out of scope for v1–v2
- DTLS-SRTP enforced for all media transport
- Max participants per room: 12 (enforced in LiveKit room config and application code)

#### Avatars & Virtual Office

- Three.js/WebGL virtual office rendered in browser (laptop/desktop only)
- Avatar parameters lock on session start — prevents identity probing via appearance changes
- Gesture presets only; no free-form animation
- Avatar selection tied to session token, not identity

#### Session Teardown

- Automatic teardown after 10-minute idle window with no activity
- Voice buffers destroyed on teardown unless recording consent was given
- Facilitator and participant notified; follow-up survey email triggered

#### Mobile Block

- Device-type detection at session token issuance; mobile returns 403 with friendly message
- Mobile users can browse, donate, and book — session initiation blocked

---

### 6.3 Identity Vault

The Identity Vault is the legal and ethical cornerstone of the platform. It is a physically separate service, on a physically separate encrypted database, in an isolated VPC subnet with no network route from any other service.

**Stored fields:**
- `realName` (encrypted)
- `emergencyContact` (encrypted)
- `region` / `state` / `country` (encrypted)
- `gender` (locked post-verification)
- `disclosureAccepted` + `consentTimestamp`
- `ipAddress` (30-day auto-expiry TTL)
- `deviceFingerprint` (90-day auto-expiry TTL)

**Access rules:**
- Zero direct access from session or commerce services — no shared DB users, no API calls across service boundaries
- Every access requires: requester identity, justification, timestamp — all written to an immutable `VaultAccessLog`
- `VaultAccessLog` has no `UPDATE` or `DELETE` permission granted to any service — insert-only
- The only automated pathway into the vault is the crisis protocol, which is human-initiated and minimum-necessary fields only (`emergencyContact`, `region`, `country`)

**Encryption:**
- At rest: AWS KMS (AES-256-GCM), 90-day automatic rotation
- In transit: TLS 1.3 minimum
- All KMS API calls (including Decrypt) logged to CloudTrail

---

### 6.4 Safety & Compliance Engine

Runs in parallel to all sessions. No AI makes any final decision.

#### Response Tiers

| Tier | Trigger | Action |
|---|---|---|
| **Soft Alert** | Keyword match or counselor flag | Counselor receives real-time indicator; no automatic action |
| **Escalation Review** | Repeated distress signals or counselor escalation | Added to human review queue; admin notified |
| **Crisis Protocol** | Human (FACILITATOR/ADMIN) initiates only | Vault access for 3 fields; 988 + local resources displayed; `CRISIS_ACTIVE` status set |

#### Crisis Protocol Detail

- **SLA:** 15 minutes from flag to human review during session hours (Mon–Sat, 8am–9pm)
- **Alerts:** SMS to primary reviewer + SMS to backup reviewer + Slack `#crisis-alerts` — all three fire simultaneously
- **Auto-promote:** If SLA breaches, escalation promotes to all ADMIN users
- **Out-of-hours:** Resources displayed immediately to participant; session NOT terminated; vault access deferred; `PENDING_REVIEW` status set
- **Vault fields accessible during crisis:** `emergencyContact`, `region`, `country` — no others
- **Reviewer cannot:** access `realName`, `email`, `ipAddress`, or dismiss `CRISIS_ACTIVE` without a logged resolution note

#### Crisis Reviewer Assignments

Designated reviewers must:
- Hold the FACILITATOR or ADMIN role on the platform
- Be reachable within 15 minutes during all scheduled session hours
- Have completed crisis referral protocol training
- Understand that every vault access they initiate is permanently logged

> ⚠️ **Pending:** Primary and Backup reviewer names, phone numbers, and timezone must be confirmed by Program Lead and entered into AWS Secrets Manager before Phase 5 go-live.

#### Content Guard

All session content, service pages, and AI output are validated against the `copy-policy.ts` banned-language list via automated CI linter. Banned terms include: therapy, treatment, diagnosis, clinical, counseling (unless licensed). The `REQUIRED_DISCLAIMER` must appear on every service page with no exceptions.

---

### 6.5 Admin Panel

| Route | Function |
|---|---|
| `/admin/bookings` | Paginated bookings; filter by status/date/facilitator; assign facilitator |
| `/admin/scholarships` | Approve/deny queue; discount code generation on approve |
| `/admin/organizations` | Inquiry queue; Stripe payment link generator; EIN verification status |
| `/admin/revenue` | KPI cards + bar chart; revenue by category; donation vs. service split; date range filter |
| `/admin/safety` | Escalation queue; resolve action; crisis log viewer |
| `/admin/facilitators` | Schedule management; availability windows; upcoming sessions |

---

### 6.6 AI Services (Phase 2 Only — Opt-In)

All AI features are opt-in, run post-session asynchronously, and are never permitted to touch live sessions.

**Permitted capabilities:**
- Session summary generation — from counselor notes only, not raw audio
- Homework and reflection prompt generation
- Aggregate trend insights — population-level, no individual attribution
- All AI output reviewed by facilitator before delivery to participant

**Hard restrictions:**
- No diagnosis
- No crisis decisioning
- No spiritual authority language
- No raw voice storage without explicit consent
- No individual-level attribution in analytics

---

## 7. Non-Functional Requirements

### Performance

- LCP < 2.5s · INP < 200ms · CLS < 0.1
- Paginate all lists over 50 records
- WebRTC target: < 200ms round-trip latency for voice
- Must handle 50 concurrent WebRTC sessions without session data leakage (load test required before launch)

### Security

- No secrets in code or version control — all secrets in AWS Secrets Manager (prod) and Vercel project settings
- All inputs validated server-side with Zod schemas before hitting any database
- Role enforced at API layer on every request; never frontend-only
- Parameterized queries or ORM only — no raw string interpolation
- Rate limits: auth endpoints (10 req/min) · booking (30 req/min) · donation (20 req/min)

### Compliance & Legal

- HIPAA-capable AWS infrastructure with signed BAA (even without clinical care delivery)
- IRS-compliant donation receipts for all donations
- No clinicians, no clinical language, no therapy delivery through v3 — founder-locked binding decision
- All UI copy reviewed against `copy-policy.ts` before every release; automated copy linter in CI
- CloudTrail, GuardDuty, and Security Hub (HIPAA standard) enabled on AWS account

### Accessibility

- WCAG AA minimum across all surfaces
- Crisis escalation overlay: screen-reader accessible, keyboard-navigable, focus-trapped
- Session controls: high-contrast, 44px minimum touch targets
- All images: alt text required

---

## 8. UI States (Required for Every Interactive Component)

No component ships without all five states implemented.

| State | Implementation |
|---|---|
| **Loading** | Shimmer skeleton matching component shape |
| **Empty** | Friendly message + primary action CTA |
| **Error** | User-facing message + retry option; never expose raw errors |
| **Success** | Confirmation with clear next step |
| **Disabled** | Visually distinct; buttons non-interactive during submission |

---

## 9. Technical Stack

| Layer | Decision | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind + Three.js/WebGL | Avatar and virtual office require Three.js; App Router for server components |
| **Commerce Backend** | Next.js API Routes (Vercel) | Monolith for booking/payments reduces ops overhead |
| **Session / Safety / Vault** | NestJS microservices on AWS ECS Fargate | Physical isolation required for identity separation |
| **Real-time Voice** | LiveKit (self-hosted in HIPAA VPC) + WebRTC | Full data lifecycle control; Zoom retains metadata |
| **Commerce Auth** | Firebase Auth (Custom Claims) | Managed auth for scheduling, billing, admin |
| **Session Auth** | Custom anonymous session tokens | Short-lived; linked to session_id only; never linked to permanent identity |
| **Commerce DB** | PostgreSQL on Railway + Prisma ORM | Standard relational; Prisma type safety |
| **Session DB** | PostgreSQL on AWS RDS | Physically separate from commerce DB |
| **Identity Vault DB** | PostgreSQL on AWS RDS (KMS-encrypted, isolated VPC subnet) | No network route from any other service |
| **Scheduling** | Cal.com (self-hosted, ECS Fargate, own DB) | Schedule metadata stays inside VPC |
| **Payments** | Stripe | Nonprofit receipt compliance; 501(c)(3) support |
| **Object Storage** | Firebase Cloud Storage (signed URLs) | Digital product delivery |
| **Email** | Resend | Transactional emails; template system |
| **Infrastructure-as-Code** | AWS CDK (TypeScript) | Type-safe; generates CloudFormation; consistent with platform stack |
| **CI/CD** | GitHub Actions | install → typecheck → lint → test → build |
| **Monitoring** | CloudWatch + PagerDuty + Slack | Vault anomaly alarms; KMS decrypt spike detection |
| **Package Manager** | pnpm (monorepo workspaces) | `apps/web` · `services/session` · `services/safety` · `packages/db` · `packages/types` |

### Frontend Route Groups

```
app/
├── (public)/              — No auth: homepage, services, donate, org inquiry
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
    ├── bookings/
    ├── scholarships/
    ├── organizations/
    ├── safety/
    └── revenue/
```

### Key Environment Variables

```env
# --- App ---
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# --- Firebase Auth ---
NEXT_PUBLIC_FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

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

# --- Email ---
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# --- Session Services ---
SESSION_SERVICE_URL=
SESSION_SERVICE_SECRET=

# --- Safety Engine ---
SAFETY_ENGINE_URL=
SAFETY_ENGINE_SECRET=

# --- LiveKit ---
LIVEKIT_URL=wss://livekit.internal.hips.foundation
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_MAX_PARTICIPANTS=12

# --- Crisis Protocol ---
CRISIS_ESCALATION_SLA_MINUTES=15
CRISIS_SMS_PRIMARY=
CRISIS_SMS_BACKUP=
CRISIS_SLACK_WEBHOOK_URL=
SESSION_HOURS_START=08:00
SESSION_HOURS_END=21:00
SESSION_HOURS_TIMEZONE=

# --- AI Services (Phase 2) ---
OPENAI_API_KEY=
AI_SERVICE_URL=

# --- Operations ---
SCHOLARSHIP_MONTHLY_BUDGET_CAP=500
SIGNED_URL_EXPIRY_SECONDS=86400
IP_RETENTION_DAYS=30
DEVICE_FINGERPRINT_RETENTION_DAYS=90
```

> **Hard rule:** No secret is ever committed to version control. All production secrets live in AWS Secrets Manager and Vercel project settings. `.env.local` is for local development only and is `.gitignore`'d.

---

## 10. Data Separation Enforcement

Data separation is not a policy — it is enforced at every layer.

| Service | Commerce DB | Session DB | Vault DB | Vault API |
|---|---|---|---|---|
| Commerce Service (Next.js) | ✅ Read/Write | ❌ Never | ❌ Never | ❌ Never |
| Session Engine (NestJS) | ❌ Never | ✅ Read/Write | ❌ Never | ❌ Never |
| Safety Engine (NestJS) | ❌ Never | ✅ Read (flags) | ❌ Never | ⚠️ Crisis only (logged) |
| Identity Vault API (NestJS) | ❌ Never | ❌ Never | ✅ Read/Write | N/A (is the API) |
| Admin Panel (Next.js) | ✅ Read | ✅ Audit log read | ❌ Never | ⚠️ Crisis only (logged) |

### Enforcement Layers

| Layer | Mechanism |
|---|---|
| **Code** | ESLint `no-cross-service-import` rule — lint fails if session/vault imports commerce Prisma client |
| **CI** | `data-separation.yml` — scans session/vault schemas for PII field names on every PR |
| **PR Review** | Cross-service linkage checklist required before every merge |
| **Infra** | VPC security groups — session service has no outbound route to vault DB subnet |
| **DB Permissions** | Separate DB users per service; `VaultAccessLog`: INSERT + SELECT only; no UPDATE or DELETE |
| **Tests** | Integration test: attempt session→commerce DB query; assert connection refused |

> **Adding a new cross-service interaction:** Tag `SECURITY_CRITICAL` on GitHub, require Tech Lead + Senior Engineer sign-off, and answer: *"Does this create a path from session data to identity data?"* — If yes, it is rejected. There is no fast path.

---

## 11. Deployment Phases & Timeline

### Phase 1 — MVP (Months 1–8)

**Goal:** Public launch with individual sessions, packages, scholarships, donations, org intake, Identity Vault, and Safety Engine.

| Sprint Window | Work |
|---|---|
| Weeks 1–2 | Phase 0: Monorepo, CI/CD, all infra provisioned, secrets configured, branch conventions |
| Weeks 3–6 | Phase 1A/B: Commerce DB schema, Session DB schema + permissions |
| Weeks 4–7 | Phase 1C: Identity Vault service — **must be complete and security-reviewed before any session feature ships** |
| Weeks 5–7 | Phase 2: Firebase Auth integration, anonymous tokens, rate limiting |
| Weeks 6–10 | Phase 3: All Commerce API endpoints, Zod validation, standard response shape |
| Weeks 8–12 | Phase 4: Stripe integration (all flows), email system (Resend templates) |
| Weeks 9–14 | Phase 5: Session services (NestJS + LiveKit + WebRTC + WebSocket gateway) |
| Weeks 12–15 | Phase 6: Safety Engine, crisis protocol, escalation queue |
| Weeks 13–18 | Phase 7–8: All frontend pages, admin panel |
| Weeks 16–20 | Phase 9: Session frontend (avatar selector, virtual office, voice controls, lobby) |
| Weeks 19–22 | Phase 10: Full test suite — unit, integration, E2E, accessibility, security review, load test |
| Weeks 22–24 | Phase 11: Launch prep, production lockdown, monitoring verification |

### Phase 2 — Growth (Months 9–15)

- AI post-session services (opt-in summaries, homework, reflection prompts via SQS + SageMaker)
- ElastiCache Redis for group session lobby state
- Twilio SMS booking reminders
- PDF watermarking for digital products
- Enhanced facilitator async messaging tools

### Phase 3 — Scale & Enterprise (Months 16–24)

- Organizational accounts with org-level analytics dashboards
- Automated facilitator-participant matching algorithm
- AI session summary-informed facilitator recommendations (opt-in, anonymized)
- Expanded avatar library and enhanced virtual offices
- Executive cohort programs with org billing

---

## 12. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Identity Vault breached | 🔴 Critical | Low | KMS encryption, isolated VPC, insert-only audit log, penetration test schedule, CloudWatch anomaly + KMS decrypt spike alarms |
| Session ↔ Identity data linked accidentally | 🔴 Critical | Medium | Physical DB separation, ESLint rule, CI data-separation scan, PR checklist, security review gate |
| Therapy-like language published to users | 🔴 High | Medium | `copy-policy.ts` linter in CI; legal review required before first public launch |
| WebRTC connection drop mid-session | 🟡 Medium | Medium | Session state preservation; 2-min reconnect window; facilitator notified |
| Scholarship cap exhausted before month-end | 🟡 Medium | Medium | Admin alert at 80%; auto-waitlist; donor CTA shown to waitlisted participants |
| Stripe webhook delivery failure | 🟡 Medium | Low | Idempotency keys; webhook event log; manual admin trigger |
| Safety Engine false positive triggers crisis | 🟡 Medium | Medium | Human review required before any vault access; no automated crisis action |
| AI summary contains identifying information | 🟡 Medium | Low | AI output gated behind facilitator review; generated from notes, not raw audio |
| Facilitator no-show | 🟢 Low | Medium | Admin notified immediately; participant rescheduled; session not consumed |
| Digital product hotlinked beyond purchaser | 🟢 Low | Low | Signed URLs expire in 24h; re-auth required per download; PDF watermarking in Phase 2 |
| Crisis reviewer unavailable within SLA | 🟡 Medium | Low | Auto-promote to all ADMINs after 15 min; out-of-hours resources displayed immediately |

---

## 13. Out of Scope (v1–v3)

- Licensed therapy delivery or clinical supervision workflows
- HIPAA Business Associate Agreements for clinical data handling
- Insurance billing or superbill generation
- Native iOS/Android app (web-responsive only; sessions desktop-only)
- Multi-language / i18n support
- Grant management or government funding tracking
- AI-generated crisis response language
- Full gender voice morphing (voice smoothing only — not morphing)
- Biometric identity verification
- Peer-to-peer payment between participants
- Automated facilitator-participant matching algorithm (manual admin assignment in v1)
- SMS booking reminders (email only in v1; Twilio in Phase 2)

> **If clinicians are ever considered (future):** This is not a feature addition. It requires a separate legal entity, full HIPAA covered entity re-scope, state licensure in every participant jurisdiction, clinical supervision architecture, malpractice insurance, and a complete rewrite of all platform copy. This is effectively a new platform.

---

## 14. Success Metrics & Launch Criteria

### Phase 11 Launch Gates (all must pass before production go-live)

- [ ] All Phase 0–9 tasks at `✅ Done`
- [ ] Identity Vault penetration test completed; all findings resolved
- [ ] Session ↔ Commerce DB separation integration test passes (connection refused assertion)
- [ ] 50-concurrent-session load test passes with no session data leakage
- [ ] Full E2E test suite green: booking flow, donation flow, scholarship flow, session entry
- [ ] WCAG AA accessibility audit complete; crisis overlay screen-reader verified
- [ ] Copy linter CI check passing — zero banned-language violations in any surface
- [ ] Crisis reviewer assignment document signed by Program Lead and Founder
- [ ] AWS HIPAA BAA signed and activated in account settings
- [ ] CloudTrail, GuardDuty, Security Hub (HIPAA standard), and AWS Config enabled
- [ ] All secrets confirmed in Firebase and Cloud Secret Manager — none in version control
- [ ] CloudWatch alarms for vault anomaly, auth failures, and KMS decrypt spike verified firing
- [ ] Resend domain verification confirmed; all email templates tested end-to-end
- [ ] Stripe live keys configured; webhook endpoint registered; all four events verified

### Operational KPIs (Post-Launch Tracking)

| KPI | Target | Notes |
|---|---|---|
| Monthly revenue by service category | Track by category | Commerce DB admin report |
| Scholarship fund usage vs. monthly cap | < 100% by month-end | Alert at 80% |
| Session completion rate by facilitator | > 90% | Facilitator performance signal |
| Package utilization rate | Track trend | sessions used / sessions purchased |
| Cohort fill rate | > 75% | enrolled / capacity |
| Donation conversion rate at checkout | Track trend | paid checkout → donor add-on |
| Vault access events per month | 0 outside crisis | Any non-crisis vault access = security review |
| Org inquiry → confirmed booking | Track trend | Inquiry → deposit paid |

---

## 15. Open Decisions & Blockers

| Item | Status | Owner | Required Before |
|---|---|---|---|
| Primary crisis reviewer: name, phone, timezone | ⏸ Pending Program Lead | Program Lead | Phase 5 go-live |
| Backup crisis reviewer: name, phone | ⏸ Pending Program Lead | Program Lead | Phase 5 go-live |
| Session hours timezone selection | ⏸ Pending Program Lead | Program Lead | Phase 5 go-live |
| `CRISIS_SLACK_WEBHOOK_URL` provisioned | ⏸ Pending | Infra Lead | Sprint 7 |
| Legal review of all service page copy and disclaimers | ⏸ Pending | Legal Reviewer | First public launch |
| Founder sign-off on No Clinicians Commitment | 🔄 In Progress | Founder | April 23, 2026 |
| AWS HIPAA BAA activation | ⏸ Pending | Infra Lead | Phase 1C start |

---

## 16. Approved Language Reference

### Approved vs. Banned Terms

| ✅ Use | ❌ Never Use |
|---|---|
| Peer Support | Therapy |
| Care Navigation | Counseling (unless licensed) |
| Coaching | Treatment |
| Leadership Wellness | Diagnosis |
| Restoration Services | Mental health treatment |
| Support Sessions | Clinical services |
| Care Access | Clinical intervention |

### Required Disclaimer (all service pages — no exceptions)

> *"H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed mental health treatment, medical care, or crisis intervention. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services."*

### Crisis Resources (displayed at every crisis trigger point)

- **988 Suicide & Crisis Lifeline** — call or text 988
- **Crisis Text Line** — text HOME to 741741
- Local emergency services (surface via `region` + `country` from Identity Vault, crisis pathway only)

> See `packages/types/src/copy-policy.ts` for the complete approved/banned language list, `REQUIRED_DISCLAIMER` constant, and `CRISIS_RESOURCES` constants used across all services.

---

*Document maintained by: Tech Lead + Program Lead*
*Review cycle: Before every phase milestone and any architectural change*
*Change process: PR to `docs/HIPS_PRD_v1.md` · requires Tech Lead review · Conventional Commit: `docs: update PRD`*
