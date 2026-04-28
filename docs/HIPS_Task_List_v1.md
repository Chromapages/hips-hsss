# [TASK] H.I.P.S. Platform — Sprint-Ready Dev Task List
**Foundation:** Hiding in Plain Sight Foundation (H.I.P.S.)
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind | PostgreSQL + Prisma | Stripe | Clerk | NestJS (session services) | Supabase Storage | Vercel + Railway + HIPAA-capable cloud
**Depends on:** HIPS_Ultimate_Architecture_v2.md | HIPS_Pricing_Spec_v1.md
**Last Updated:** April 23, 2026

---

## Effort Key
| Size | Estimate | Description |
|---|---|---|
| **S** | 1–2 hrs | Single file, minimal logic, no cross-service dependency |
| **M** | 3–8 hrs | Multi-file, moderate logic, one external service |
| **L** | 1–3 days | Complex logic, multiple services, testing required |
| **XL** | 3–7 days | System-level concern, cross-service, security-critical |

## Layer Key
`FE` = Frontend | `BE` = Backend/API | `DB` = Database | `Infra` = Infrastructure | `Full` = Full stack

## Status Key
`🔲 Not Started` | `🔄 In Progress` | `✅ Done` | `⏸ Blocked`

---

## PHASE 0 — Project Foundation & Repo Setup

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 0.1 | Initialize monorepo with pnpm workspaces | Infra | S | None | Packages: `apps/web`, `services/session`, `services/safety`, `packages/db`, `packages/types` |
| 0.2 | Configure TypeScript strict mode across all packages | Infra | S | 0.1 | `strict: true`, no implicit `any`, path aliases |
| 0.3 | Set up ESLint + Prettier + lint-staged | Infra | S | 0.1 | Shared config in `packages/eslint-config` |
| 0.4 | Configure GitHub Actions CI pipeline | Infra | M | 0.1–0.3 | Steps: install → typecheck → lint → test → build |
| 0.5 | Set up Vercel project + environment variables | Infra | S | 0.1 | Preview per PR, production on main |
| 0.6 | Set up Railway PostgreSQL (commerce DB) | Infra | S | None | Dev, staging, production instances |
| 0.7 | Set up Railway PostgreSQL (session DB — separate instance) | Infra | S | None | Physically separate from commerce DB |
| 0.8 | Configure `.env.local` template + `.gitignore` rules | Infra | S | 0.5–0.7 | No secrets ever committed |
| 0.9 | Set up Clerk application + configure publishable/secret keys | Infra | S | None | Configure allowed redirect URLs |
| 0.10 | Set up Stripe account + webhook endpoint registration | Infra | S | None | Test mode first; live keys in production env only |
| 0.11 | Set up Supabase project + storage bucket | Infra | S | None | Bucket: `hips-digital-products`; private, no public access |
| 0.12 | Set up Resend account + from-email domain verification | Infra | S | None | Domain verification required before any transactional email |
| 0.13 | Write branch naming + commit convention docs | Infra | S | None | `feature/`, `fix/`, `chore/`; Conventional Commits |

---

## PHASE 1A — Database & Schema (Commerce DB)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 1A.1 | Initialize Prisma in `packages/db` | DB | S | 0.6 | `prisma init`; set `DATABASE_URL` |
| 1A.2 | Write User model + Role enum migration | DB | S | 1A.1 | UUID PK, clerkId unique, role, soft delete |
| 1A.3 | Write Service model + ServiceCategory enum migration | DB | S | 1A.1 | slug unique, standardPrice, scholarshipMin/Max |
| 1A.4 | Write Session model + SessionStatus enum migration | DB | M | 1A.2–1A.3 | FK to User, Service, Package; sessionTokenRef (no PII) |
| 1A.5 | Write Package model migration | DB | S | 1A.2–1A.3 | totalSessions, usedSessions, expiresAt |
| 1A.6 | Write Scholarship model + ScholarshipStatus enum migration | DB | S | 1A.2 | discountCode unique, reviewedBy, expiresAt |
| 1A.7 | Write Donation model + DonationTier enum migration | DB | S | 1A.2 | stripePaymentId unique, receiptSent flag |
| 1A.8 | Write OrgInquiry model + InquiryStatus enum migration | DB | S | None | Standalone; not linked to User until confirmed |
| 1A.9 | Add all required indexes | DB | M | 1A.2–1A.8 | FK indexes + frequent filter columns per Architecture doc |
| 1A.10 | Write down migrations for all tables | DB | M | 1A.2–1A.9 | Every migration must be reversible |
| 1A.11 | Seed script: services catalog with all 6 categories | DB | M | 1A.3 | All services from pricing spec with slugs, prices, scholarship ranges |

---

## PHASE 1B — Database & Schema (Session DB)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 1B.1 | Initialize Prisma for session DB (separate schema) | DB | S | 0.7 | Separate `DATABASE_URL` env var |
| 1B.2 | Write SessionRecord model + LiveSessionStatus enum | DB | S | 1B.1 | anonSessionToken — never linked to commerce User ID |
| 1B.3 | Write GroupSessionRecord model | DB | S | 1B.1 | roomId, moderatorAnonId, participantCount |
| 1B.4 | Write AuditEvent model (insert-only) | DB | M | 1B.1 | DB user must have NO UPDATE or DELETE permission on this table; enforce at DB level |
| 1B.5 | Configure DB user permissions — session DB | DB | M | 1B.1–1B.4 | Read/insert only for AuditEvent; read/write for SessionRecord |

---

## PHASE 1C — Identity Vault Service

> ⚠️ This is the most security-critical component. Do not ship any session feature until the Identity Vault is complete and reviewed.

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 1C.1 | Provision HIPAA-capable cloud environment (isolated VPC) | Infra | L | 0.1 | AWS or GCP; Identity Vault and Session services live here |
| 1C.2 | Provision KMS key for Identity Vault encryption | Infra | M | 1C.1 | AWS KMS or GCP Cloud KMS; key rotation schedule configured |
| 1C.3 | Create Identity Vault DB (separate encrypted instance) | Infra | M | 1C.1–1C.2 | Separate VPC subnet from session services; no shared DB user with any other service |
| 1C.4 | Define IdentityRecord schema (application-level encryption) | DB | L | 1C.2–1C.3 | All PII fields encrypted via KMS before write; no plaintext PII at rest |
| 1C.5 | Define VaultAccessLog schema (insert-only) | DB | M | 1C.3 | Requester, justification, timestamp, vaultRecordId; NO update/delete permission |
| 1C.6 | Build Identity Vault API service (NestJS) | BE | XL | 1C.4–1C.5 | POST /vault/record, GET /vault/record/:token (requires justification field), POST /vault/access-log |
| 1C.7 | Implement KMS encrypt/decrypt wrappers | BE | L | 1C.2, 1C.6 | All PII through KMS wrapper; never raw string in DB |
| 1C.8 | Implement IP auto-expiry job | BE | M | 1C.6 | Cron: delete IP addresses older than 30 days; log deletion event |
| 1C.9 | Implement device fingerprint expiry job | BE | M | 1C.6 | Cron: expire fingerprints after 90 days |
| 1C.10 | Write Vault API authentication (internal secret + allowlist) | BE | M | 1C.6 | Vault API not exposed to public internet; internal service-to-service only |
| 1C.11 | Write Identity Vault access audit review (admin endpoint) | BE | M | 1C.6 | Admin can query VaultAccessLog; results paginated; no raw PII returned |
| 1C.12 | Security review: Identity Vault service | Infra | L | 1C.1–1C.11 | Penetration test scope; review by senior engineer before any session feature goes live |

---

## PHASE 2 — Auth Layer

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 2.1 | Configure Clerk middleware for commerce routes | BE | M | 0.9, 1A.2 | Protect all `/app/*` and `/api/v1/*` routes except public ones |
| 2.2 | Clerk webhook: on sign-up → create User record in commerce DB | BE | M | 2.1, 1A.2 | `user.created` webhook event; idempotent |
| 2.3 | Implement role-based route guards (server-side) | BE | M | 2.1 | Middleware checks `User.role` in DB; never trust JWT claim alone for admin |
| 2.4 | Build anonymous session token service (NestJS) | BE | L | 1C.1, 1B.2 | `POST /session/v1/token` — issues short-lived token linked to session_id only; no commerce User ID |
| 2.5 | Implement session token validation middleware | BE | M | 2.4 | Used by all `/session/v1/*` WebSocket and REST routes |
| 2.6 | Write sign-in page (Clerk-hosted or custom) | FE | S | 2.1 | `/sign-in` — Clerk `<SignIn />` component |
| 2.7 | Write sign-up page | FE | S | 2.1 | `/sign-up` — Clerk `<SignUp />` component |
| 2.8 | Implement rate limiting — auth endpoints (10 req/min) | BE | M | 2.1 | Use `@upstash/ratelimit` or custom middleware |

---

## PHASE 3 — Commerce API (Backend)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 3.1 | POST /api/v1/sessions/book | BE | L | 2.1–2.3, 1A.4 | Validates service, slot availability, scholarship code, creates Session record |
| 3.2 | GET /api/v1/sessions/availability | BE | M | 1A.4 | Query facilitator schedule; return available slots by serviceId and date range |
| 3.3 | PATCH /api/v1/sessions/:id/complete | BE | M | 2.3, 1A.4 | Facilitator/admin only; update SessionStatus to COMPLETED; trigger follow-up email |
| 3.4 | POST /api/v1/packages/purchase | BE | M | 1A.5, 3.11 | Creates Package after Stripe payment confirmed via webhook |
| 3.5 | GET /api/v1/packages/balance | BE | S | 1A.5, 2.1 | Returns usedSessions, totalSessions, expiresAt for authenticated user |
| 3.6 | POST /api/v1/scholarships/apply | BE | M | 1A.6, 2.1 | Validates scholarship budget cap; creates Scholarship record; notifies admin |
| 3.7 | PATCH /api/v1/scholarships/:id | BE | M | 2.3, 1A.6 | Admin/facilitator only; approve generates discount code; deny sends notification |
| 3.8 | POST /api/v1/checkout/session | BE | L | 3.11, 2.1 | Creates Stripe PaymentIntent for service purchase; validates discount code if present |
| 3.9 | POST /api/v1/checkout/donation | BE | M | 3.11 | Creates separate Stripe PaymentIntent for donation; no goods/services attached |
| 3.10 | POST /api/v1/organizations/inquiry | BE | M | 1A.8 | Public endpoint; creates OrgInquiry record; notifies admin; no auth required |
| 3.11 | POST /api/v1/webhooks/stripe | BE | XL | 0.10, 1A.4–1A.7 | Verify Stripe signature; handle: payment_intent.succeeded, payment_failed, subscription.deleted, invoice.paid; idempotency keys required |
| 3.12 | GET /api/v1/admin/bookings | BE | M | 2.3 | Admin only; paginated; filter by status, date, facilitator |
| 3.13 | GET /api/v1/admin/scholarships | BE | M | 2.3 | Admin only; paginated; filter by status |
| 3.14 | GET /api/v1/admin/revenue | BE | M | 2.3, 1A.7 | Admin only; revenue by category, date range, donation vs. service split |
| 3.15 | Implement rate limiting — booking (30/min), donation (20/min) | BE | M | 2.8 | Per-endpoint; separate from auth rate limit |
| 3.16 | Write Zod schemas for all request bodies | BE | M | 3.1–3.14 | All inputs validated before hitting DB; no raw user input in queries |
| 3.17 | Implement standard API response shape | BE | S | None | `{ data, error, meta: { timestamp, requestId } }` — applied to all endpoints |

---

## PHASE 4 — Stripe & Email Integration

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 4.1 | Stripe PaymentIntent flow — service purchase | BE | L | 3.8, 3.11 | One-time and package purchases; receipt email on success |
| 4.2 | Stripe subscription flow — membership ($15/mo) | BE | L | 3.11 | Create subscription, handle renewal (invoice.paid), handle cancellation (subscription.deleted) |
| 4.3 | Stripe Customer Portal — self-service membership cancel | BE | M | 4.2 | Generate portal session URL; return to /dashboard |
| 4.4 | Stripe donation PaymentIntent — separate charge | BE | M | 3.9, 3.11 | Never bundled with service purchase; charitable receipt on success |
| 4.5 | IRS-compliant donation receipt email | BE | M | 4.4, 4.9 | Must include: org name, EIN, amount, date, "no goods/services received" statement |
| 4.6 | Stripe payment link generation for org quotes | BE | M | 3.10 | Admin generates Stripe payment link for 50% deposit + remainder invoice |
| 4.7 | Nonprofit EIN verification at checkout | BE | M | 3.8 | Required for nonprofit workshop pricing tier; admin override available |
| 4.8 | Resend: booking confirmation email | BE | M | 3.1, 4.9 | Includes service name, date/time, facilitator, Zoom/session link, disclaimer |
| 4.9 | Resend: email template system | BE | M | 0.12 | Templates: confirmation, scholarship approval/denial, retreat reminder, donation receipt, follow-up survey |
| 4.10 | Resend: 24-hour session reminder email | BE | M | 4.9 | Triggered by cron job; checks sessions scheduled in next 24h |
| 4.11 | Resend: package expiry warning email | BE | M | 4.9 | At 75% of expiry window; links to /dashboard/packages |

---

## PHASE 5 — Session Services (NestJS — HIPAA Cloud)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 5.1 | POST /session/v1/token | BE | L | 2.4, 1B.2 | Issues anonymous session token; linked to session_id only |
| 5.2 | WebSocket gateway: /session/v1/connect/:id | BE | XL | 5.1, 1B.2 | WSS connection; handles voice signaling, avatar state, session events |
| 5.3 | WebRTC signaling server (STUN/TURN config) | Infra | L | 5.2 | Configure STUN/TURN for NAT traversal; DTLS-SRTP enforced |
| 5.4 | Voice session — no-recording-by-default mode | BE | M | 5.2 | Default: no audio stored; session teardown deletes all voice buffers |
| 5.5 | Voice session — consent-based recording mode | BE | L | 5.4 | Explicit opt-in before session; encrypted object storage; defined retention |
| 5.6 | POST /session/v1/:id/flag — counselor flag | BE | M | 5.2, Safety Engine | Triggers Safety Engine; logs to AuditEvent |
| 5.7 | POST /session/v1/:id/end — session teardown | BE | M | 5.2, 1B.2 | Updates SessionRecord; destroys voice buffers (unless recording consented); sends follow-up email trigger |
| 5.8 | GET /session/v1/:id/notes — facilitator notes | BE | M | 2.5, 1B.2 | Facilitator-only; notes stored in Session DB (not Identity Vault) |
| 5.9 | Group session: POST /group/v1/lobby/:id/join | BE | L | 5.1, 1B.3 | Anonymous join; lobby state managed in-memory + Redis |
| 5.10 | Group session: POST /group/v1/lobby/:id/start | BE | M | 5.9 | Moderator only; opens voice WebRTC for all lobby participants |
| 5.11 | Group session: moderator controls (mute, remove, end) | BE | M | 5.10 | WebSocket events; moderator role verified server-side |
| 5.12 | Session automatic teardown (timeout) | BE | M | 5.2 | If session idle for 10 min with no activity, auto-teardown + notification |
| 5.13 | Laptop-only session enforcement | BE | M | 2.4 | Device type check at session token issuance; mobile returns 403 with friendly message |

---

## PHASE 6 — Safety & Compliance Engine

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 6.1 | Safety Engine service scaffold (NestJS) | BE | M | 1C.1 | Separate service; runs in parallel to session services |
| 6.2 | POST /safety/v1/flag — receive flag from session | BE | M | 6.1, 5.6 | Accepts: sessionId (anon), flagType, timestamp, counselorId (anon) |
| 6.3 | Keyword/phrase detection module | BE | L | 6.1 | Configurable keyword list; matches against session transcript snippets (if consent given) or counselor-initiated flags only; no surveillance by default |
| 6.4 | Escalation queue: GET /safety/v1/queue | BE | M | 6.1, 2.3 | Admin-only; paginated; sorted by severity and timestamp |
| 6.5 | PATCH /safety/v1/:id/resolve — admin resolves escalation | BE | M | 6.4, 2.3 | Marks escalation resolved; logs resolver ID and timestamp to AuditEvent |
| 6.6 | POST /safety/v1/crisis/:id — crisis protocol trigger | BE | XL | 6.1, 1C.6, 1C.5 | Human-initiated only (no automated AI trigger); requests limited Identity Vault access; logs to VaultAccessLog with justification; displays 988 + local emergency resources to participant |
| 6.7 | Crisis resource display component | FE | M | 6.6 | Full-screen overlay; screen-reader accessible; keyboard-navigable; focus-trapped; shows 988 + local resources |
| 6.8 | Admin: Safety escalation dashboard page | FE | M | 6.4 | `/admin/safety` — queue view, resolve action, crisis log |

---

## PHASE 7 — Frontend (Public + Commerce)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 7.1 | Homepage (/) — hero, mission, service overview, donate CTA | FE | M | None | Server Component; no auth required; disclaimer visible |
| 7.2 | Service catalog (/services) — all tiers, filter by category | FE | M | 1A.3, 1A.11 | Server Component; tier filter (Free/Standard/Org) |
| 7.3 | Service detail page (/services/[slug]) | FE | M | 7.2 | Booking CTA, pricing, disclaimer, "Sponsor Someone Else" CTA |
| 7.4 | Availability calendar + slot picker (/book/[serviceId]) | FE | L | 3.2 | Client Component; date picker → time slot grid; skeleton loader |
| 7.5 | Checkout page — Stripe Elements + optional donation add-on | FE | L | 3.8, 3.9, 4.1 | Client Component; two PaymentIntents if donation added; disclaimer acknowledgement checkbox required |
| 7.6 | Scholarship eligibility form (/scholarship) | FE | M | 3.6 | React Hook Form + Zod; loading/success/error states |
| 7.7 | Org intake form (/organizations) | FE | M | 3.10 | EIN field with nonprofit checkbox; headcount, event type, preferred date |
| 7.8 | Donation page (/donate) | FE | M | 3.9 | Four donation tiers + custom amount; impact copy; standalone page |
| 7.9 | User dashboard (/dashboard) — session balance, bookings, cohort access | FE | L | 3.5, 3.1 | Server Component with Client islands; skeleton loaders on all data |
| 7.10 | Session history page (/dashboard/sessions) | FE | M | 3.12 | Paginated list; filter by status |
| 7.11 | Package balance page (/dashboard/packages) | FE | M | 3.5 | Shows used/total, expiry date, expiry warning |
| 7.12 | Digital downloads page (/dashboard/downloads) | FE | M | Supabase signed URLs | Lists purchased products; generates fresh signed URL on each click |
| 7.13 | Global disclaimer banner | FE | S | None | Shown on all service pages; required coaching-vs-therapy language |
| 7.14 | Global error boundary | FE | S | None | Catches unhandled errors; user-facing message; never exposes raw errors |
| 7.15 | Notification toast system | FE | S | None | Success, error, warning toasts; accessible (ARIA live region) |

---

## PHASE 8 — Frontend (Admin Panel)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 8.1 | Admin layout — sidebar nav, header, breadcrumbs | FE | M | 2.3 | Role-gated; ADMIN only; sidebar collapses to icons on narrow viewports |
| 8.2 | Admin bookings page (/admin/bookings) | FE | M | 3.12 | Paginated table; filter by status/date/facilitator; assign facilitator action |
| 8.3 | Admin scholarship queue (/admin/scholarships) | FE | M | 3.13 | Approve/deny with one click; generates discount code on approve |
| 8.4 | Admin org inquiries (/admin/organizations) | FE | L | 3.10, 4.6 | Inquiry list; generate Stripe payment link; EIN verification status |
| 8.5 | Admin revenue dashboard (/admin/revenue) | FE | L | 3.14 | KPI cards + bar chart: revenue by category; donation vs service split; date range filter |
| 8.6 | Admin facilitator schedule management | FE | M | 3.2 | Set availability windows; view upcoming sessions |
| 8.7 | Admin safety escalation dashboard (/admin/safety) | FE | M | 6.4, 6.5 | Escalation queue; resolve action; crisis log viewer |

---

## PHASE 9 — Frontend (Session Layer)

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 9.1 | Avatar selector component | FE | L | None | Three.js avatar picker; locks on session start; no free-form customization |
| 9.2 | Virtual office room renderer (Three.js/WebGL) | FE | XL | 9.1 | Loads room environment; renders participant and facilitator avatars; gesture preset support |
| 9.3 | Voice controls bar — mute, end, report | FE | M | 5.2 | Client Component; mute/unmute sends WebSocket event; end triggers session teardown flow |
| 9.4 | Session notes viewer (participant-facing) | FE | M | 5.8 | Read-only; homework + reflection prompts visible after session |
| 9.5 | Group session lobby (/lobby/[groupId]) | FE | L | 5.9, 5.10 | Waiting room UI; participant list (anonymous handles only); moderator start button |
| 9.6 | Session page (/session/[id]) | FE | XL | 9.1–9.5 | Assembles: VirtualOffice + VoiceControls + AvatarSelector + CrisisEscalation overlay |
| 9.7 | Mobile session block page | FE | S | 5.13 | Friendly message when mobile device detected; redirects to book on desktop |
| 9.8 | Session connection error + reconnect UI | FE | M | 5.2 | WebRTC drop → show reconnect prompt; 2-min window before teardown |

---

## PHASE 10 — Testing

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 10.1 | Unit tests: all business logic utilities | BE | L | Phase 3–6 | Scholarship cap enforcement, package expiry, discount code generation, Stripe event parsing |
| 10.2 | Unit tests: Zod schemas — valid + invalid inputs | BE | M | 3.16 | Cover boundary cases, missing required fields, malformed data |
| 10.3 | Integration tests: all Commerce API endpoints | BE | L | Phase 3 | Use test DB; cover happy path, auth failures, rate limit, edge cases |
| 10.4 | Integration tests: Stripe webhook handler | BE | L | 3.11 | Replay all four webhook events; test idempotency; test signature failure |
| 10.5 | Integration tests: Scholarship flow end-to-end | BE | M | 3.6–3.7 | Apply → admin approve → code generated → code applied at checkout |
| 10.6 | Integration tests: Identity Vault access + audit log | BE | L | 1C.6–1C.11 | Verify every access creates an immutable VaultAccessLog entry |
| 10.7 | E2E tests: booking flow (Playwright) | Full | L | Phase 7, 3.1 | Guest → sign up → book session → checkout → confirmation email |
| 10.8 | E2E tests: donation flow | Full | M | 7.8, 3.9 | Standalone donate → PaymentIntent → receipt email |
| 10.9 | E2E tests: scholarship application + approval | Full | M | 7.6, 8.3 | Apply → admin approves → code received → used at checkout |
| 10.10 | E2E tests: session entry (mock WebRTC) | Full | L | Phase 9 | Sign in → book → enter session → avatar loads → voice connects → end session |
| 10.11 | Accessibility audit — WCAG AA | FE | M | Phase 7–9 | Axe-core automated + manual keyboard nav test; crisis overlay screen-reader test |
| 10.12 | Security review: Identity Vault + session separation | Infra | XL | Phase 1C, 5 | Penetration test scope; verify no cross-service DB linkage possible |
| 10.13 | Load test: concurrent WebRTC sessions | Infra | L | Phase 5 | Simulate 50 concurrent sessions; verify no session data leakage |

---

## PHASE 11 — Launch Preparation

| # | Title | Layer | Effort | Dependencies | Notes |
|---|---|---|---|---|---|
| 11.1 | Legal review: all UI copy for therapy language | Full | M | Phase 7 | Every service page, email template, and disclaimer reviewed against approved language list |
| 11.2 | Legal review: donation receipt compliance | Full | M | 4.5 | IRS requirements for 501(c)(3) charitable contribution receipts |
| 11.3 | Verify nonprofit EIN + 501(c)(3) status in production config | Infra | S | None | EIN present in donation receipts and org pricing verification |
| 11.4 | Production Stripe: switch from test to live keys | Infra | S | 0.10 | Live keys in Vercel production env only; test keys in dev/staging |
| 11.5 | Configure Vercel production domain + SSL | Infra | S | 0.5 | Custom domain; SSL via Vercel; HSTS enabled |
| 11.6 | Configure HIPAA cloud production environment | Infra | L | 1C.1 | Final VPC lockdown; penetration test complete; backup schedule verified |
| 11.7 | Admin onboarding: seed facilitator accounts | Full | M | 2.3 | Set role, availability windows; send onboarding email |
| 11.8 | Seed initial service catalog in production | DB | S | 1A.11 | Run seed script against production DB |
| 11.9 | Write disaster recovery runbook | Infra | M | None | DB backup restore steps; Identity Vault recovery; Stripe recovery |
| 11.10 | Configure uptime monitoring (Better Uptime or similar) | Infra | S | 11.5 | Monitor: web app, commerce API, session service health endpoints |
| 11.11 | Configure error monitoring (Sentry) | Infra | S | 0.1 | Source maps for Next.js; alerts on error rate spike |
| 11.12 | Final pre-launch checklist review | Full | M | All | Security, compliance, copy, backups, monitoring, legal |

---

## Sprint Planning Guidance

### Recommended Sprint Order

| Sprint | Phases | Focus |
|---|---|---|
| Sprint 1 | 0, 1A | Repo, CI, environments, commerce DB schema |
| Sprint 2 | 1B, 1C (partial) | Session DB, Identity Vault infrastructure + schema |
| Sprint 3 | 1C (complete), 2 | Identity Vault service + auth layer |
| Sprint 4 | 3 (3.1–3.9) | Core commerce API: booking, packages, scholarships |
| Sprint 5 | 3 (3.10–3.17), 4 | Org inquiry, webhooks, Stripe, email integration |
| Sprint 6 | 5 (5.1–5.8) | Session service: token, WebRTC, voice, notes |
| Sprint 7 | 6 | Safety Engine + crisis protocol |
| Sprint 8 | 7 (7.1–7.8) | Public frontend: homepage, catalog, booking, checkout |
| Sprint 9 | 7 (7.9–7.15), 8 | Dashboard + admin panel |
| Sprint 10 | 9 | Session frontend: avatars, virtual office, voice controls |
| Sprint 11 | 10 | Testing: unit, integration, E2E, accessibility, security |
| Sprint 12 | 11 | Launch prep: legal review, production config, monitoring |

### Critical Path (Cannot Be Parallelized)
```
Repo setup (0.1–0.13)
    → Commerce DB schema (1A)
    → Identity Vault infrastructure (1C.1–1C.3)
    → Identity Vault service (1C.4–1C.12)  ← Gate: nothing session-related ships before this
    → Auth layer (2)
    → Commerce API (3)
    → Session services (5)
    → Safety Engine (6)
    → Frontend (7–9)
    → Testing (10)
    → Launch (11)
```

### Parallelizable Work (Different Teams/Engineers)
- `1A` Commerce DB schema ↔ `1B` Session DB schema (after 0.6–0.7 done)
- `3` Commerce API ↔ `5` Session services (after 1C and 2 done)
- `7` Public frontend ↔ `8` Admin panel (after 3 done)
- `10.1–10.6` Unit + integration tests ↔ `9` Session frontend (after Phase 5–6 done)

---

## Open Questions (Decisions Needed Before Build)

| # | Question | Owner | Needed By |
|---|---|---|---|
| OQ.1 | Which HIPAA-capable cloud provider — AWS or GCP? | Founder / Infra lead | Sprint 2 |
| OQ.2 | Will clinicians ever be staffed? Determines scope of Safety Engine and legal disclaimers. | Founder / Legal | Sprint 1 |
| OQ.3 | Is facilitator-participant matching manual (admin assigns) or algorithm in v1? | Ops lead | Sprint 4 |
| OQ.4 | Which scheduling tool for facilitator availability — Cal.com, custom, or Calendly API? | Tech lead | Sprint 4 |
| OQ.5 | Scholarship budget cap ($500/mo) — who controls configuration in production? | Ops lead | Sprint 5 |
| OQ.6 | Is consent-based voice recording required in v1 or deferred to v2? | Founder / Legal | Sprint 6 |
| OQ.7 | What is the group session capacity limit (MVP assumes 12 max)? | Program lead | Sprint 6 |
| OQ.8 | Crisis protocol: who are the designated human reviewers? Role and availability? | Program lead | Sprint 7 |
