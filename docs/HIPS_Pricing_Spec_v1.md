# [SPEC] H.I.P.S. Pricing & Revenue System
**Foundation:** Hiding in Plain Sight Foundation (H.I.P.S.)
**Type:** 501(c)(3) Nonprofit — Fee-for-Service + Donations
**Stack (assumed):** Next.js (App Router) + TypeScript + Tailwind | PostgreSQL + Prisma | Stripe | Firebase | Vercel + Railway
**Status:** Draft v1.0 — Phase 3 Implementation Ready
**Last Updated:** April 22, 2026

---

## 1. Problem Statement

H.I.P.S. serves individuals in crisis, leaders facing burnout, and organizations seeking confidential care access. The mission requires sustainable income while preserving access for those who cannot pay. Without a structured pricing and booking system, the foundation cannot scale, track scholarship usage, issue compliant donation receipts, or manage multi-service fulfillment.

**This spec covers:** service catalog, 3-tier pricing model, booking flows, scholarship logic, donation integration, Stripe payment handling, admin ops, DB schema, and API contracts.

**Out of scope:** licensed therapy delivery, telehealth compliance (HIPAA-regulated clinical care), CRM integration, grant management.

---

## 2. User Roles

| Role | Description | Auth Required |
|---|---|---|
| Guest | Browses services, reads about tiers | No |
| Participant | Books sessions, purchases packages, applies for scholarship | Yes |
| Leader/Client | Books coaching, accesses leadership track | Yes |
| Org Buyer | Purchases workshops, retreats, cohort seats for a group | Yes |
| Sponsor/Donor | Makes donations, sponsors sessions for others | Optional |
| Facilitator | Views their schedule, marks sessions complete | Yes (staff) |
| Admin | Manages all records, approves scholarships, views reports | Yes (staff) |

---

## 3. Offer Catalog & Pricing Matrix

### 3.1 Care Access Sessions
| Service | Standard Price | Scholarship Range |
|---|---|---|
| 30-Min Intro Session | Free | — |
| 60-Min Support Session | $75 | $0–$50 |
| 4-Session Package | $250 | $0–$150 |
| 8-Session Package | $475 | $0–$250 |

**Rules:**
- Intro session requires account creation (email capture for follow-up)
- Packages expire 90 days from purchase; non-refundable after first session is used
- Scholarship applicants complete a brief eligibility form; approval within 48 hours
- Language must never describe this as therapy; use "Peer Support" / "Care Navigation"

### 3.2 Leadership Restoration Coaching
| Service | Price |
|---|---|
| 60-Min Private Session | $125 |
| Monthly Coaching (2 sessions) | $225 |
| 3-Month Intensive | $600 |
| Executive Priority Package | $1,200 |

**Rules:**
- Monthly retainer billed automatically via Stripe on the same date each month
- Retainer cancellation requires 7-day notice; no refund on current period
- Executive Priority Package includes priority scheduling + async message access
- Facilitator assignment is made by admin within 24 hours of purchase

### 3.3 Group Support Cohorts
| Program | Price per Person |
|---|---|
| 6-Week Group Cohort | $149 |
| 8-Week Leader Cohort | $249 |
| Couples / Family Group | $199 |

**Rules:**
- Minimum cohort size: 4 participants; maximum: 12
- Org buyers may purchase bulk seats (≥5) at a 10% discount
- If cohort is cancelled by H.I.P.S., full refund issued; if by participant after Week 1, 50% refund
- Cohort schedule set at launch; participants notified by email 72 hours before each session

### 3.4 Workshops & Speaking
| Type | Nonprofit/Church | Corporate/Private |
|---|---|---|
| 1-Hour Workshop | $500 | $1,500 |
| Half-Day Training | $1,250 | $3,500 |
| Full-Day Event | $2,500 | $5,000+ |

**Rules:**
- Org buyers request via intake form; admin generates quote/invoice within 48 hours
- 50% deposit required to confirm booking; remainder due 7 days before event
- Deposit non-refundable if cancelled within 14 days of event
- Full-Day Corporate is minimum $5,000; final price based on headcount and travel
- "Nonprofit" tier requires 501(c)(3) EIN verification at checkout

### 3.5 Retreats / Restoration Days
| Event | Price per Person |
|---|---|
| 1-Day Retreat | $199 |
| Weekend Retreat | $499 |
| VIP Private Retreat | $1,500+ |

**Rules:**
- Retreat dates published on a rolling 90-day calendar
- Registration closes 7 days before event or when capacity (20 max) is reached
- VIP Private Retreat is custom-quoted via intake form; $500 deposit to confirm
- Retreat refund: full refund >14 days out; 50% refund 7–14 days; no refund <7 days

### 3.6 Digital Products
| Product | Price | Delivery |
|---|---|---|
| Workbook (PDF) | $19 | Instant download |
| Course | $79 | Gated portal access |
| Leadership Toolkit | $99 | Instant download |
| Membership Library | $15/mo | Recurring Stripe subscription |

**Rules:**
- Digital products are non-refundable after download/access
- Membership cancels at end of billing cycle; no prorating
- Membership includes: all workbooks, course replays, leadership resources
- All digital assets served from Supabase/S3 with signed URLs (time-limited)

---

## 4. Scholarship & Sliding-Scale Logic

### Eligibility
- Available for: Care Access Sessions and Group Cohorts only
- Applicant self-selects need level; no income verification required
- Sliding scale tiers: $0 (full scholarship), $25, $50

### Application Flow
1. Participant selects service → clicks "Apply for Scholarship"
2. Short eligibility form: reason for need, requested amount
3. Form submitted → admin notified → approved/denied within 48 hours
4. Approved: participant receives discount code valid for 30 days
5. Denied: participant offered next available sliding-scale tier

### Business Rules
- Scholarship fund tracked as a separate ledger entry (not revenue)
- Monthly scholarship budget cap: $500 (configurable by admin)
- If cap is reached, waitlist opens; admin can increase cap or seek donor funding
- Scholarship sessions are equal in experience to paid sessions (no visible difference)

---

## 5. Donation Integration

### Donation Tiers (Sponsor Someone Else)
| Tier | Label | Use |
|---|---|---|
| $50 | Sponsor a Session | Funds one support session for someone in need |
| $100 | Restore a Session | Funds a coaching session |
| $500 | Restore a Leader | Funds a full coaching package for a leader |
| Custom | Open Amount | Directed to general scholarship fund |

### Placement Rules
- Every paid service page includes a "Sponsor Someone Else" CTA below the checkout button
- Donation option appears in checkout sidebar as an optional add-on
- Standalone /donate page with all four tiers and impact language

### Compliance Rules
- Donations generate a separate receipt clearly labeled as a charitable contribution
- Receipts must include: org name, EIN, amount, date, statement that no goods/services were received
- Donations over $250 trigger automatic receipt email per IRS rules
- Service purchases and donations must be processed as separate Stripe charges (never bundled)
- If a participant donates during checkout, two separate Stripe PaymentIntents are created

---

## 6. Booking & Checkout Flows

### 6.1 Individual Session Booking
```
Guest browses /services
→ Selects service
→ Create account or login (Firebase)
→ Scholarship? → Scholarship flow (Section 4)
→ Select date/time from facilitator availability
→ Checkout (Stripe)
→ Confirmation email + calendar invite
→ 24-hour reminder email/SMS
→ Session takes place (Zoom link or in-person)
→ Facilitator marks complete
→ Follow-up survey sent (48 hours later)
```

### 6.2 Package Purchase
```
Login
→ Select package (4 or 8 sessions)
→ Checkout (Stripe one-time payment)
→ Package credited to account (session balance shown in dashboard)
→ Book sessions individually from balance
→ Balance visible at all times in user dashboard
→ Expiry warning email at 75% expiry window
```

### 6.3 Org/Workshop Booking
```
Org buyer visits /organizations
→ Fills intake form (org name, EIN if nonprofit, event type, date range, headcount)
→ Admin reviews → generates quote via admin panel
→ Quote emailed to buyer with Stripe payment link (50% deposit)
→ Deposit paid → booking confirmed
→ Remainder invoiced 7 days before event
→ Pre-event logistics email sent 48 hours before
→ Post-event impact report delivered within 7 days
```

### 6.4 Digital Product Purchase
```
Visit /resources
→ Select product
→ Checkout (Stripe)
→ Instant access: download link or portal access granted
→ Receipt emailed
→ Membership: Stripe subscription created; portal access until cancellation
```

---

## 7. Content & Disclaimer Rules

### Approved Language
| ✅ Use | ❌ Never Use |
|---|---|
| Peer Support | Therapy |
| Care Navigation | Counseling (unless licensed) |
| Coaching | Treatment |
| Leadership Wellness | Diagnosis |
| Restoration Services | Mental health treatment |
| Support Sessions | Clinical services |

### Required Disclaimers (on all service pages)
> "H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed mental health treatment, medical care, or crisis intervention. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services."

### Crisis Escalation
- All intake forms include a crisis check question
- If participant indicates active crisis: auto-display crisis resources and pause booking flow
- Facilitators trained in safety referral protocol (documented in ops runbook)

---

## 8. Frontend Requirements

### Pages
| Page | Description |
|---|---|
| / | Hero, mission statement, service overview, donation CTA |
| /services | Full service catalog with tier selector |
| /services/[slug] | Individual service detail, booking CTA, disclaimer, Sponsor CTA |
| /book/[serviceId] | Availability calendar, time slot selection |
| /checkout | Stripe Elements, optional donation add-on, disclaimer acknowledgement |
| /dashboard | Session balance, upcoming bookings, cohort access, digital downloads |
| /scholarship | Eligibility form and status tracker |
| /organizations | Org intake form, workshop/cohort packages |
| /donate | Standalone donation page with impact messaging |
| /admin/* | Bookings, scholarship approvals, quotes, reports |

### UI States (required for every interactive component)
| State | Requirement |
|---|---|
| Loading | Skeleton screens or spinner on all async data |
| Empty | Friendly empty state with next action CTA |
| Error | User-facing error message + retry option; never expose raw errors |
| Success | Confirmation with next step (e.g., "Check your email") |
| Disabled | Buttons disabled and visually distinct during submission |

### Accessibility
- WCAG AA minimum
- All forms keyboard-navigable
- Focus states visible on all interactive elements
- All images have alt text
- Crisis escalation flow must be screen-reader accessible

---

## 9. Backend & API Requirements

### Auth
- Firebase handles authentication (JWT)
- All non-public API routes require valid session token
- Role-based access: participant, facilitator, org_buyer, admin
- Rate limiting: auth endpoints (10 req/min), booking endpoints (30 req/min), donation (20 req/min)

### API Contracts (REST, v1)
```
POST   /api/v1/sessions/book          — book a session (auth required)
GET    /api/v1/sessions/availability  — get available slots by facilitator
PATCH  /api/v1/sessions/:id/complete  — facilitator marks session complete
POST   /api/v1/packages/purchase      — purchase a session package
GET    /api/v1/packages/balance       — get user's session balance
POST   /api/v1/scholarships/apply     — submit scholarship application
PATCH  /api/v1/scholarships/:id       — admin approves/denies (admin only)
POST   /api/v1/checkout/session       — create Stripe PaymentIntent
POST   /api/v1/checkout/donation      — create separate Stripe PaymentIntent for donation
POST   /api/v1/webhooks/stripe        — Stripe webhook handler
POST   /api/v1/organizations/inquiry  — org intake form submission
GET    /api/v1/admin/bookings         — paginated bookings (admin only)
GET    /api/v1/admin/scholarships     — paginated scholarship queue (admin only)
GET    /api/v1/admin/revenue          — revenue summary report (admin only)
```

### Response Shape (all endpoints)
```json
{ "data": {}, "error": null, "meta": { "timestamp": "", "requestId": "" } }
```

### Stripe Integration
- Separate PaymentIntents for service purchases vs. donations
- Webhook events to handle: payment_intent.succeeded, payment_intent.payment_failed, customer.subscription.deleted, invoice.paid
- All webhook payloads verified with Stripe signature
- Subscription management: Stripe Customer Portal for self-service cancellation

---

## 10. Database Schema (Prisma)

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
  id            String    @id @default(uuid())
  slug          String    @unique
  name          String
  category      ServiceCategory
  standardPrice Decimal
  scholarshipMin Decimal  @default(0)
  scholarshipMax Decimal  @default(0)
  durationMins  Int?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
}

enum ServiceCategory {
  CARE_SESSION COACHING COHORT WORKSHOP RETREAT DIGITAL MEMBERSHIP
}

model Session {
  id            String    @id @default(uuid())
  userId        String
  serviceId     String
  facilitatorId String?
  scheduledAt   DateTime
  status        SessionStatus @default(PENDING)
  pricePaid     Decimal
  isScholarship Boolean   @default(false)
  stripePaymentId String?
  packageId     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
  service       Service   @relation(fields: [serviceId], references: [id])
  package       Package?  @relation(fields: [packageId], references: [id])
}

enum SessionStatus { PENDING CONFIRMED COMPLETED CANCELLED NO_SHOW }

model Package {
  id            String    @id @default(uuid())
  userId        String
  serviceId     String
  totalSessions Int
  usedSessions  Int       @default(0)
  pricePaid     Decimal
  expiresAt     DateTime
  stripePaymentId String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
  sessions      Session[]
}

model Scholarship {
  id            String    @id @default(uuid())
  userId        String
  serviceId     String
  requestedAmount Decimal
  approvedAmount  Decimal?
  reason        String
  status        ScholarshipStatus @default(PENDING)
  discountCode  String?   @unique
  expiresAt     DateTime?
  reviewedBy    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
}

enum ScholarshipStatus { PENDING APPROVED DENIED EXPIRED }

model Donation {
  id            String    @id @default(uuid())
  userId        String?
  email         String
  amount        Decimal
  tier          DonationTier
  stripePaymentId String  @unique
  receiptSent   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User?     @relation(fields: [userId], references: [id])
}

enum DonationTier { SPONSOR_SESSION RESTORE_SESSION RESTORE_LEADER CUSTOM }

model OrgInquiry {
  id            String    @id @default(uuid())
  orgName       String
  contactEmail  String
  ein           String?
  isNonprofit   Boolean   @default(false)
  eventType     String
  preferredDate DateTime?
  headcount     Int?
  quoteAmount   Decimal?
  status        InquiryStatus @default(NEW)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum InquiryStatus { NEW QUOTED DEPOSIT_PAID CONFIRMED COMPLETED CANCELLED }
```

---

## 11. Reporting & Admin KPIs

- Monthly revenue by service category
- Scholarship fund usage vs. cap
- Session completion rate by facilitator
- Package utilization rate (sessions used / sessions purchased)
- Cohort fill rate (enrolled / capacity)
- Donation conversion rate (paid checkout → donor add-on)
- Org inquiry → confirmed booking conversion

---

## 12. Edge Cases

| Scenario | Handling |
|---|---|
| Participant books but does not show | Session marked NO_SHOW; no refund; package session consumed |
| Scholarship approved but code unused after 30 days | Code expires; participant must reapply |
| Org EIN fails verification | Org pays corporate tier; admin can override manually |
| Stripe payment fails mid-checkout | User shown friendly error; no booking created; retry available |
| Facilitator cancels last-minute | Participant notified; session rescheduled; no session consumed |
| Scholarship monthly cap reached | Waitlist opens; admin notified; donor CTA shown to waitlisted participant |
| Membership cancelled mid-cycle | Access continues until period end; no refund |
| Donation added at checkout, service payment fails | Donation PaymentIntent not captured; both charges roll back |

---

## 13. Out of Scope

- HIPAA-regulated clinical care or licensed therapy delivery
- Insurance billing or superbill generation
- Embedded video/audio for sessions (third-party Zoom integration assumed)
- Native mobile app (web-responsive only in v1)
- Multi-language support
- Grant management or government funding tracking
- Automated facilitator matching algorithm (manual admin assignment in v1)
