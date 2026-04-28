# H.I.P.S. Platform

> **Hiding in Plain Sight Foundation** — Confidential peer support, leadership coaching, and care navigation services.

[![CI](https://github.com/hips-foundation/hips-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/hips-foundation/hips-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)

---

## ⚠️ Important Notices

> **This platform provides peer support, coaching, and care navigation services only.**
> These services are **not** a substitute for licensed mental health treatment, medical care, or crisis intervention.
> If you are in crisis, contact the **988 Suicide & Crisis Lifeline** or your local emergency services.

> **Identity Vault:** The Identity Vault is a physically isolated service. No session data, commerce data, or analytics data is ever linked to identity records. Any code change that creates a bridge between identity and session data is a critical security violation and must be rejected.

---

## Table of Contents

1. [What This Is](#what-this-is)
2. [Architecture Overview](#architecture-overview)
3. [Monorepo Structure](#monorepo-structure)
4. [Prerequisites](#prerequisites)
5. [Local Development Setup](#local-development-setup)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Running Services](#running-services)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [Deployment](#deployment)
12. [Security Policy](#security-policy)

---

## What This Is

H.I.P.S. is a full-stack web platform that enables:

- **Confidential care sessions** — anonymous peer support with voice + avatar
- **Leadership restoration coaching** — private sessions for pastors, executives, and caregivers
- **Group cohorts** — scheduled anonymous group support rooms
- **Workshops & retreats** — for nonprofits, churches, and corporate clients
- **Digital resources** — workbooks, courses, toolkits, and membership library
- **Scholarship access** — sliding-scale and full-scholarship tiers for those in need
- **Donation integration** — sponsor sessions for others directly at checkout

The platform is designed for a **501(c)(3) nonprofit**. All service language is coaching/peer support — never therapy or clinical treatment.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      apps/web (Vercel)                      │
│          Next.js 14 App Router + TypeScript + Tailwind      │
│          Commerce API routes + Admin panel + Frontend       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS + WSS + WebRTC
┌──────────────────────────────▼──────────────────────────────┐
│               services/session (HIPAA Cloud)                │
│           NestJS — Voice, Avatars, Group Sessions           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Internal API only
┌──────────────────────────────▼──────────────────────────────┐
│            services/vault (HIPAA Cloud — Isolated VPC)      │
│     NestJS — Identity Vault, KMS Encryption, Audit Log      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Parallel
┌──────────────────────────────▼──────────────────────────────┐
│              services/safety (HIPAA Cloud)                  │
│        NestJS — Keyword Monitoring, Escalation, Crisis      │
└─────────────────────────────────────────────────────────────┘

External Services:
  Firebase   → Commerce authentication & Object storage
  Stripe     → Payments, subscriptions, donor receipts
  Resend     → Transactional email
  Railway    → PostgreSQL (commerce DB + session DB)
```

**Three physically separated databases:**
- `commerce-db` (Railway) — bookings, packages, scholarships, donations, org inquiries
- `session-db` (Railway) — session records, group rooms, audit events; no PII
- `vault-db` (Isolated VPC) — encrypted identity records; KMS-managed; access logged

---

## Monorepo Structure

```
hips-platform/
├── apps/
│   └── web/                        # Next.js 14 App Router (Vercel)
│       ├── app/
│       │   ├── (public)/           # No auth: homepage, services, donate
│       │   ├── (auth)/             # Clerk sign-in/up
│       │   ├── (app)/              # Participant dashboard, booking, checkout
│       │   ├── (session)/          # Anonymous session layer (avatar, voice)
│       │   └── (admin)/            # Admin panel (ADMIN role only)
│       ├── components/
│       │   ├── ui/                 # Atoms: Button, Input, Badge, Modal, Toast
│       │   ├── forms/              # React Hook Form + Zod wrappers
│       │   ├── booking/            # Calendar, TimeSlot, ServiceCard
│       │   ├── checkout/           # StripeElements, DonationAddon
│       │   ├── session/            # AvatarSelector, VirtualOffice, VoiceControls
│       │   └── admin/              # ScholarshipQueue, QuoteBuilder, RevenueChart
│       └── api/v1/                 # Commerce API route handlers
│
├── services/
│   ├── session/                    # NestJS — real-time voice + avatar
│   ├── vault/                      # NestJS — Identity Vault (KMS encrypted)
│   └── safety/                     # NestJS — Safety & Compliance Engine
│
├── packages/
│   ├── db/                         # Prisma schemas (commerce + session)
│   ├── types/                      # Shared TypeScript types + Zod schemas
│   └── eslint-config/              # Shared ESLint config
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI: typecheck → lint → test → build
│
├── .env.example                    # Template — never commit .env.local
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20.x LTS | Required |
| pnpm | 9.x | `npm install -g pnpm` |
| Docker | Latest | Required for local session/vault/safety services |
| PostgreSQL | 15+ | Via Railway or local Docker |
| Git | 2.40+ | |

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/hips-foundation/hips-platform.git
cd hips-platform
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your local credentials
# See Environment Variables section below
```

### 4. Start local infrastructure (Docker)

```bash
docker compose up -d
# Starts: commerce-db (port 5432), session-db (port 5433), vault-db (port 5434)
```

### 5. Run database migrations

```bash
# Commerce DB
pnpm --filter @hips/db exec prisma migrate dev --schema=./prisma/commerce.prisma

# Session DB
pnpm --filter @hips/db exec prisma migrate dev --schema=./prisma/session.prisma
```

### 6. Seed the service catalog

```bash
pnpm --filter @hips/db exec ts-node prisma/seed.ts
```

### 7. Start all services

```bash
pnpm dev
# Starts: apps/web (localhost:3000), services/session (localhost:3001),
#         services/vault (localhost:3002), services/safety (localhost:3003)
```

---

## Environment Variables

Copy `.env.example` to `apps/web/.env.local`. **Never commit `.env.local` or any file containing real secrets.**

```env
# ── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ── Firebase (Commerce Auth) ─────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_FIREBASE_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_FIREBASE_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_FIREBASE_AFTER_SIGN_UP_URL=/dashboard

# ── Commerce DB (Railway) ────────────────────────────────────
DATABASE_URL=postgresql://user:pass@localhost:5432/hips_commerce

# ── Session DB (Railway — separate instance) ─────────────────
SESSION_DATABASE_URL=postgresql://user:pass@localhost:5433/hips_sessions

# ── Identity Vault ────────────────────────────────────────────
VAULT_API_URL=http://localhost:3002
VAULT_API_SECRET=dev_vault_secret_replace_in_production
VAULT_KMS_KEY_ID=local-dev-mock        # Use AWS/GCP KMS key ID in production

# ── Stripe ───────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...        # Get from Stripe Dashboard > Webhooks

# ── Firebase Storage ─────────────────────────────────────────
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# ── Email (Resend) ────────────────────────────────────────────
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@hips.foundation

# ── Session Services ─────────────────────────────────────────
SESSION_SERVICE_URL=http://localhost:3001
SESSION_SERVICE_SECRET=dev_session_secret

# ── Safety Engine ─────────────────────────────────────────────
SAFETY_ENGINE_URL=http://localhost:3003
SAFETY_ENGINE_SECRET=dev_safety_secret

# ── AI Services (Phase 2 only) ────────────────────────────────
# OPENAI_API_KEY=sk-...

# ── Operations ────────────────────────────────────────────────
SCHOLARSHIP_MONTHLY_BUDGET_CAP=500
SIGNED_URL_EXPIRY_SECONDS=86400
IP_RETENTION_DAYS=30
DEVICE_FINGERPRINT_RETENTION_DAYS=90
```

> **Production:** All production secrets live in Vercel project settings and your HIPAA cloud secret manager. Test keys (`pk_test_`, `sk_test_`) must never reach the production environment.

---

## Database Setup

### Commerce DB — Adding a Migration

```bash
# Create a new migration
pnpm --filter @hips/db exec prisma migrate dev \
  --name your_migration_name \
  --schema=./prisma/commerce.prisma

# Every migration MUST include a down migration file
# Located at: packages/db/prisma/migrations/<timestamp>_<name>/migration.sql
```

### Session DB — Adding a Migration

```bash
pnpm --filter @hips/db exec prisma migrate dev \
  --name your_migration_name \
  --schema=./prisma/session.prisma
```

### Prisma Studio (Local DB GUI)

```bash
# Commerce DB
pnpm --filter @hips/db exec prisma studio --schema=./prisma/commerce.prisma

# Session DB
pnpm --filter @hips/db exec prisma studio --schema=./prisma/session.prisma
```

---

## Running Services

### All services (development)

```bash
pnpm dev
```

### Individual services

```bash
pnpm --filter @hips/web dev          # Next.js app — localhost:3000
pnpm --filter @hips/session dev      # Session service — localhost:3001
pnpm --filter @hips/vault dev        # Identity Vault — localhost:3002
pnpm --filter @hips/safety dev       # Safety Engine — localhost:3003
```

### Stripe webhook forwarding (local)

```bash
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
# Copy the webhook signing secret into STRIPE_WEBHOOK_SECRET in .env.local
```

---

## Testing

### Run all tests

```bash
pnpm test
```

### Unit tests only

```bash
pnpm --filter @hips/web test:unit
```

### Integration tests

```bash
pnpm --filter @hips/web test:integration
# Requires test DB running (docker compose up -d)
```

### E2E tests (Playwright)

```bash
pnpm --filter @hips/web test:e2e
# Runs against localhost:3000; all services must be running
```

### Type checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

---

## Contributing

1. **Branch naming:** `feature/`, `fix/`, `chore/`, `refactor/`
2. **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `chore:`
3. **PRs:** Require passing CI + one reviewer approval before merging to `main`
4. **`main` is always deployable.** Never merge a broken build.
5. **Security-critical changes** (Identity Vault, session separation, auth) require senior engineer review.
6. **Content changes** (service page copy, email templates) require review against the approved language list before merging. Never use "therapy", "treatment", "diagnosis", or "clinical" without legal approval.

---

## Deployment

See [DEPLOY_RUNBOOK.md](./DEPLOY_RUNBOOK.md) for the complete deployment guide.

---

## Security Policy

- **Report vulnerabilities** to security@hips.foundation — do not open public issues.
- **Identity Vault** is the highest-priority asset. Any suspected breach triggers the incident response plan immediately.
- **No secrets in code.** If you find a committed secret, rotate it immediately and file an internal security report.
- All engineers must review the Security Checklist in `HIPS_Ultimate_Architecture_v2.md` before their first commit.
