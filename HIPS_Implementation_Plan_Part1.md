# H.I.P.S. Implementation Plan — Part 1

**Project:** Hiding in Plain Sight Foundation Platform
**Type:** 501(c)(3) Nonprofit Anonymous Peer Support
**Stack:** Next.js 14 + NestJS + PostgreSQL + Firebase Auth + AWS + Three.js
**Date:** April 26, 2026

---

## 1. Project Vision

H.I.P.S. delivers **anonymous peer support, coaching, and care navigation** via a "Hard Anonymity" model where a participant's billing identity is **never linkable** to their session attendance — enforced at the infrastructure level, not by policy.

### System Architecture Overview

![H.I.P.S. System Architecture](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\system_architecture_1777228393643.png)

### Anonymous Identity Data Flow

![Data Flow - Anonymous Identity](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\data_flow_diagram_1777228439316.png)

---

## 2. Hard Anonymity Model

> **The Rule:** Any code change that creates a path — direct or indirect — from session data to identity data is a **critical security violation** and must not be merged.

### Three Physically Separated Databases

| Database | Host | Contains | Never Contains |
|---|---|---|---|
| **Commerce DB** | Railway PostgreSQL | Users, Sessions (scheduling), Packages, Scholarships, Donations, Stripe refs | Session audio, anonymous tokens, real names |
| **Session DB** | AWS RDS (Private VPC) | SessionRecord, AuditEvent, GroupSession, voice events | User IDs, emails, billing data, real names |
| **Identity Vault** | AWS RDS (Isolated VPC, KMS-encrypted) | Real name, emergency contact, region, disclosure | Session data, billing data, commerce IDs |

### Service Access Matrix

| Service | Commerce DB | Session DB | Vault DB | Vault API |
|---|---|---|---|---|
| Commerce (Next.js) | ✅ Read/Write | ❌ Never | ❌ Never | ❌ Never |
| Session Engine (NestJS) | ❌ Never | ✅ Read/Write | ❌ Never | ❌ Never |
| Safety Engine (NestJS) | ❌ Never | ✅ Read (flags) | ❌ Never | ⚠️ Crisis only |
| Identity Vault API (NestJS) | ❌ Never | ❌ Never | ✅ Read/Write | N/A |

### Enforcement Layers

| Layer | Mechanism |
|---|---|
| Code | ESLint `no-cross-service-import` rule |
| CI | `data-separation.yml` scans for PII field names |
| PR Review | Cross-service linkage checklist |
| Infra | VPC security groups — no cross-DB routes |
| DB | Separate DB users per service; vault = INSERT + SELECT only |
| Test | Integration test: attempt cross-DB query → assert refused |

---

## 3. Firebase Auth Integration Strategy

![Firebase Authentication Flow](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\firebase_auth_flow_1777228490354.png)

### Two-Layer Auth Model

**Layer 1 — Commerce (Firebase Auth)**
- Manages booking, payment, dashboard, admin, facilitator access
- Firebase ID Token with Custom Claims: `PARTICIPANT | LEADER | ORGBUYER | FACILITATOR | ADMIN`
- Verified server-side via Firebase Admin SDK on every protected route
- Role confirmed in DB (not only JWT claim) for `FACILITATOR` and `ADMIN` ops

**Layer 2 — Session (Anonymous Tokens)**
- Issued by Auth Service on session start
- Linked to `session_id` only — **never** to Firebase UID, email, or real name
- Short-lived: expires at session end + 5-minute buffer
- Single-use: cannot be reused after teardown
- Stored in-memory only (NestJS) — never written to any database

### Firebase Custom Claims Setup

```typescript
// Commerce API: Set role on user creation/update
import { getAuth } from 'firebase-admin/auth';

const setUserRole = async (uid: string, role: UserRole) => {
  await getAuth().setCustomUserClaims(uid, { role });
};

// Middleware: Verify token + extract claims
const verifyFirebaseToken = async (idToken: string) => {
  const decoded = await getAuth().verifyIdToken(idToken);
  return { uid: decoded.uid, role: decoded.role };
};
```

### Session Token Issuance

```
Rate limit:     5 requests/minute per Firebase UID
Validation:     Firebase ID Token must be valid before token is issued
Output:         Opaque random token (32 bytes, hex-encoded)
Storage:        In-memory only (NestJS session service)
Expiry:         Session duration + 5 minutes
After expiry:   Token invalid; any request returns 401
```

---

## 4. Monorepo Structure

![Monorepo Structure](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\monorepo_structure_1777228479259.png)

```
hips-platform/
├── apps/
│   └── web/                    # Next.js 14 — Commerce + Admin UI
│       ├── app/                # App Router pages
│       ├── middleware.ts       # Firebase Auth middleware
│       └── components/         # React components
├── services/
│   ├── session/                # NestJS — WebRTC + Voice Engine
│   ├── safety/                 # NestJS — Crisis/Safety Engine
│   └── vault/                  # NestJS — Identity Vault API
├── packages/
│   ├── db/                     # Prisma schemas (commerce + session)
│   ├── types/                  # Shared TypeScript types
│   ├── ui/                     # Design system components
│   └── eslint-config/          # Shared ESLint (no-cross-service-import)
├── infra/
│   └── cdk/                    # AWS CDK stacks (VPC, RDS, ECS, KMS)
└── docker-compose.yml          # Local dev: 3 DBs + services
```

### Local Development Ports

| Service | Port |
|---|---|
| Next.js (web) | 3000 |
| Session service | 3001 |
| Identity Vault | 3002 |
| Safety Engine | 3003 |
| Commerce DB | 5432 |
| Session DB | 5433 |
| Vault DB | 5434 |

---

## 5. Phase Breakdown

### PHASE 0 — Project Foundation (Week 1)

| # | Task | Layer | Effort | Status |
|---|---|---|---|---|
| 0.1 | Initialize pnpm monorepo workspace | Infra | S | 🔲 |
| 0.2 | Configure `strict: true` TypeScript across packages | Infra | S | 🔲 |
| 0.3 | Set up ESLint + Prettier + lint-staged + `no-cross-service-import` | Infra | S | 🔲 |
| 0.4 | Configure GitHub Actions CI (install → typecheck → lint → test → build) | Infra | M | 🔲 |
| 0.5 | Set up Vercel project + env vars (preview per PR, prod on main) | Infra | S | 🔲 |
| 0.6 | Set up Railway PostgreSQL — Commerce DB (dev/staging/prod) | Infra | S | 🔲 |
| 0.7 | Set up Railway PostgreSQL — Session DB (separate instance) | Infra | S | 🔲 |
| 0.8 | Configure `.env.local` template + `.gitignore` rules | Infra | S | 🔲 |
| 0.9 | Set up Firebase project + configure auth providers | Infra | S | 🔲 |
| 0.10 | Set up Stripe account + webhook endpoint registration | Infra | S | 🔲 |
| 0.11 | Set up Firebase Cloud Storage bucket (`hips-digital-products`) | Infra | S | 🔲 |
| 0.12 | Set up Resend + from-email domain verification | Infra | S | 🔲 |
| 0.13 | Write branch naming + commit convention docs | Infra | S | 🔲 |

**Phase 0 Gate:** CI pipeline green, all external services provisioned, zero secrets in version control.

---

### PHASE 0.5 — Rapid Client Demo (Week 1.5)

> **Goal:** An interactive, frontend-only prototype to demonstrate the "Proof of Anonymity" and the virtual office experience to the client.

| # | Task | Layer | Effort | Status |
|---|---|---|---|---|
| 0.5.1 | Scaffold standalone `/demo` route with static export config | FE | S | 🔲 |
| 0.5.2 | Build **"Anonymity Simulator"**: Split-screen showing PII → Token conversion | FE | M | 🔲 |
| 0.5.3 | Build **Mock Dashboard**: Interactive session booking and package view | FE | M | 🔲 |
| 0.5.4 | Build **Virtual Office Mock**: A 3D (Three.js) or high-fidelity CSS room view | FE | L | 🔲 |
| 0.5.5 | Build **Crisis Toggle**: Button to trigger the red safety overlay for demo | FE | S | 🔲 |
| 0.5.6 | Implement Framer Motion for premium "Wow" transitions | FE | M | 🔲 |
| 0.5.7 | Deploy demo to a temporary URL (Vercel Preview) | Infra | S | 🔲 |

**Phase 0.5 Gate:** Client approves the visual direction and confirms the anonymity visualization effectively communicates the "Hard Anonymity" promise.

---

### PHASE 1A — Commerce DB Schema (Week 2)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 1A.1 | Initialize Prisma in `packages/db` | DB | S | 0.6 |
| 1A.2 | User model + Role enum (UUID PK, firebaseUid unique, role, soft delete) | DB | S | 1A.1 |
| 1A.3 | Service model + ServiceCategory enum (slug, price, scholarship range) | DB | S | 1A.1 |
| 1A.4 | Session model + SessionStatus enum (FK User, Service, Package) | DB | M | 1A.2-3 |
| 1A.5 | Package model (totalSessions, usedSessions, expiresAt) | DB | S | 1A.2-3 |
| 1A.6 | Scholarship model + ScholarshipStatus enum | DB | S | 1A.2 |
| 1A.7 | Donation model + DonationTier enum (stripePaymentId unique) | DB | S | 1A.2 |
| 1A.8 | OrgInquiry model + InquiryStatus enum | DB | S | — |
| 1A.9 | Add all required indexes (FK + frequent filters) | DB | M | 1A.2-8 |
| 1A.10 | Write down migrations for all tables | DB | M | 1A.2-9 |
| 1A.11 | Seed script: all 6 service categories with prices | DB | M | 1A.3 |

**Key Schema Note:** The Commerce `Session` table contains a `sessionTokenRef` field — this is a **hash reference only**, never the actual anonymous token.

---

### PHASE 1B — Session DB Schema (Week 2-3)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 1B.1 | Initialize Prisma for session DB (separate schema file) | DB | S | 0.7 |
| 1B.2 | SessionRecord model + LiveSessionStatus enum | DB | S | 1B.1 |
| 1B.3 | GroupSessionRecord model (roomId, moderatorAnonId) | DB | S | 1B.1 |
| 1B.4 | AuditEvent model (**insert-only**, no UPDATE/DELETE) | DB | M | 1B.1 |
| 1B.5 | Configure DB user permissions (AuditEvent: INSERT only) | DB | M | 1B.1-4 |

> ⚠️ Session DB must **never** contain: userId, email, firebaseUid, realName, or any commerce identifiers.

---

### PHASE 1C — Identity Vault Service (Weeks 3-5) ⚠️ SECURITY CRITICAL

> **No session feature ships until the Identity Vault is complete and security-reviewed.**

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 1C.1 | Provision AWS VPC (isolated subnet for vault) | Infra | L | 0.1 |
| 1C.2 | Provision KMS key (`hips-vault-master`, AES-256-GCM, 90-day rotation) | Infra | M | 1C.1 |
| 1C.3 | Create Identity Vault RDS instance (encrypted, isolated subnet) | Infra | M | 1C.1-2 |
| 1C.4 | Define IdentityRecord schema (all PII KMS-encrypted before write) | DB | L | 1C.2-3 |
| 1C.5 | Define VaultAccessLog schema (**INSERT only**, no UPDATE/DELETE) | DB | M | 1C.3 |
| 1C.6 | Build Vault API (NestJS): POST/GET record, POST access-log | BE | XL | 1C.4-5 |
| 1C.7 | Implement KMS encrypt/decrypt wrappers | BE | L | 1C.2, 1C.6 |
| 1C.8 | IP auto-expiry cron (delete IPs > 30 days) | BE | M | 1C.6 |
| 1C.9 | Device fingerprint expiry cron (90 days) | BE | M | 1C.6 |
| 1C.10 | Vault API auth (internal secret + IP allowlist) | BE | M | 1C.6 |
| 1C.11 | Admin audit review endpoint (paginated, no raw PII) | BE | M | 1C.6 |
| 1C.12 | **Security review + penetration test** | Infra | L | ALL |

**Vault DB Permission Model:**

| DB Role | Table | Permissions |
|---|---|---|
| `vault_api_user` | IdentityRecord | `SELECT`, `INSERT` only |
| `vault_api_user` | VaultAccessLog | `INSERT` only |
| `vault_audit_user` | VaultAccessLog | `INSERT` only |
| `vault_rotation_user` | None | Schema `USAGE` only |

**Phase 1C Gate:** Pen test complete, all findings resolved, VaultAccessLog immutability verified:

```sql
-- Must return 0 rows
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'vaultaccesslog'
  AND privilege_type IN ('UPDATE', 'DELETE');
```

---

### PHASE 2 — Firebase Auth Layer (Week 5-6)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 2.1 | Configure Firebase Auth middleware for commerce routes | BE | M | 0.9, 1A.2 |
| 2.2 | Implement Firebase Admin SDK token verification | BE | M | 2.1 |
| 2.3 | Build Custom Claims management (role assignment) | BE | M | 2.2 |
| 2.4 | Build user sync webhook (Firebase → Commerce DB) | BE | M | 2.1 |
| 2.5 | Build anonymous session token issuance service | BE | L | 2.1, 1B.2 |
| 2.6 | Build session token validation middleware (NestJS) | BE | M | 2.5 |
| 2.7 | Build sign-up page (Firebase Auth UI) | FE | M | 2.1 |
| 2.8 | Build sign-in page | FE | M | 2.1 |
| 2.9 | Build role-based route guards | FE | M | 2.3 |
| 2.10 | Build auth context provider (React) | FE | M | 2.7-9 |
| 2.11 | Write auth integration tests | Full | L | 2.1-10 |

**Phase 2 Gate:** All auth flows verified, role escalation tested and blocked, anonymous token isolation confirmed.

---

### PHASE 3 — Commerce API + Stripe (Weeks 6-8)

| # | Task | Layer | Effort | Deps |
|---|---|---|---|---|
| 3.1 | Service catalog API: GET /services, GET /services/:slug | BE | M | 1A.3 |
| 3.2 | Booking API: POST /sessions/book | BE | L | 1A.4, 2.1 |
| 3.3 | Package purchase API: POST /packages/purchase | BE | L | 1A.5, 3.5 |
| 3.4 | Scholarship application API: POST /scholarships/apply | BE | M | 1A.6 |
| 3.5 | Stripe checkout integration (PaymentIntent creation) | BE | L | 0.10 |
| 3.6 | Stripe webhook handler (payment_intent.succeeded/failed) | BE | L | 3.5 |
| 3.7 | Donation API: POST /donations (4 tiers, separate PaymentIntent) | BE | M | 1A.7 |
| 3.8 | Org inquiry API: POST /organizations/inquiry (public) | BE | S | 1A.8 |
| 3.9 | Session availability API: GET /sessions/availability | BE | M | 3.2 |
| 3.10 | Admin scholarship queue API (approve/deny) | BE | M | 3.4 |
| 3.11 | Admin revenue reporting API | BE | M | 1A.7 |
| 3.12 | Stripe webhook replay + idempotency handling | BE | M | 3.6 |

**Phase 3 Gate:** End-to-end payment flow works in Stripe test mode, webhook delivery confirmed, donation receipts generated.

---

## 6. UI Wireframes & Visual Concepts

### Participant Dashboard

![Participant Dashboard](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\dashboard_wireframe_1777228415381.png)

### Virtual Office Session Room

![Session Room](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\session_room_wireframe_1777228403789.png)

### Admin Safety Dashboard

![Admin Safety Queue](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\admin_safety_wireframe_1777228468764.png)

### Crisis Overlay (Safety-Critical Component)

![Crisis Overlay](C:\Users\ericb\.gemini\antigravity\brain\f308e422-50dc-41cf-8cef-83b695ac3cea\crisis_overlay_wireframe_1777228426941.png)

---

## 7. Environment Variables (Firebase)

```bash
# Firebase (Commerce Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
FIREBASE_ADMIN_SDK_KEY=  # Server-only, via Vercel env

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Databases
DATABASE_URL=            # Commerce DB (Railway)
SESSION_DATABASE_URL=    # Session DB (AWS RDS)
VAULT_DATABASE_URL=      # Vault DB (AWS RDS, isolated)

# Internal Services
VAULT_API_SECRET=        # AWS Secrets Manager
SESSION_SERVICE_SECRET=  # AWS Secrets Manager
VAULT_KMS_KEY_ID=        # AWS Secrets Manager
LIVEKIT_API_SECRET=      # AWS Secrets Manager

# Email
RESEND_API_KEY=
```

---

> **Continued in Part 2** — Phases 4-11 (Email, Session Engine, Safety Engine, Frontend, Testing, Launch Gates)
