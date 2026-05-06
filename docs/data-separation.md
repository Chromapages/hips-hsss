# H.I.P.S. Data Separation Boundary Map
**Wiki:** `hips-platform/wiki/data-separation`
**Owner:** Tech Lead
**Updated:** April 2026 — update this diagram on every architectural PR

---

## The Rule

> Any code change that creates a path — direct or indirect — from session data to identity data
> is a **critical security violation** and must not be merged.

There are **three physically separated databases**. No service has access to more than one.
No shared DB users. No joins across boundaries. No API calls that bridge them.

---

## Boundary Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                   │
│   Commerce Layer          Session Layer             Admin Layer             │
│   (Firebase auth)            (Anon token)              (Firebase auth)            │
└────────┬──────────────────────┬──────────────────────────┬──────────────────┘
         │ HTTPS                │ HTTPS + WSS + WebRTC      │ HTTPS
         ▼                      ▼                            ▼
┌─────────────────┐    ┌──────────────────────┐    ┌───────────────────┐
│  COMMERCE       │    │  SESSION ENGINE      │    │  SAFETY ENGINE    │
│  SERVICE        │    │  (NestJS)            │    │  (NestJS)         │
│  (Next.js)      │    │                      │    │                   │
│  Firebase JWT      │    │  Anon session token  │    │  Flag + escalate  │
│  Commerce DB    │    │  Session DB only     │    │  Session DB only  │
│  only           │    │                      │    │  (no vault)       │
└────────┬────────┘    └──────────┬───────────┘    └─────────┬─────────┘
         │                        │                           │
         │                        │         ┌─────────────────┘
         │                        │         │  (crisis trigger — human only)
         │                        │         ▼
         │                        │  ┌────────────────────────────────────┐
         │                        │  │  IDENTITY VAULT API (NestJS)       │
         │                        │  │  Internal only — no public routes  │
         │                        │  │  Every access: requester +         │
         │                        │  │  justification + timestamp logged  │
         │                        │  └──────────────┬─────────────────────┘
         │                        │                 │
         ▼                        ▼                 ▼
┌─────────────────┐    ┌──────────────────┐  ┌────────────────────────────────┐
│  COMMERCE DB    │    │  SESSION DB      │  │  IDENTITY VAULT DB             │
│  (Railway)      │    │  (Railway —      │  │  (HIPAA Cloud — Isolated VPC)  │
│                 │    │   separate       │  │                                │
│  Users          │    │   instance)      │  │  KMS-encrypted at rest         │
│  Sessions       │    │                  │  │  TLS 1.3 in transit            │
│  Packages       │    │  SessionRecord   │  │  Insert-only VaultAccessLog    │
│  Scholarships   │    │  AuditEvent      │  │  No UPDATE / DELETE ever       │
│  Donations      │    │  GroupSession    │  │                                │
│  OrgInquiries   │    │                  │  │  realName (encrypted)          │
│                 │    │  ⚠️ NO userId    │  │  email (encrypted)             │
│  sessionToken   │    │  ⚠️ NO email     │  │  emergencyContact (encrypted)  │
│  Ref = hash     │    │  ⚠️ NO FirebaseId   │  │  region (encrypted)            │
│  only           │    │  ⚠️ NO realName  │  │  ipAddress (30-day TTL)        │
└─────────────────┘    └──────────────────┘  └────────────────────────────────┘

    ▲ No joins             ▲ No joins             ▲ Access only via
    │ between              │ between              │ audited API endpoint.
    │ these DBs            │ these DBs            │ Never direct DB access
    └──────────────────────┴──────────────────────┘
         PHYSICAL SEPARATION — enforced at infra + code + CI level
```

---

## What Each Service Can Access

| Service | Commerce DB | Session DB | Vault DB | Vault API |
|---|---|---|---|---|
| Commerce Service (Next.js) | ✅ Read/Write | ❌ Never | ❌ Never | ❌ Never |
| Session Engine (NestJS) | ❌ Never | ✅ Read/Write | ❌ Never | ❌ Never |
| Safety Engine (NestJS) | ❌ Never | ✅ Read (flags) | ❌ Never | ⚠️ Crisis only (logged) |
| Identity Vault API (NestJS) | ❌ Never | ❌ Never | ✅ Read/Write | N/A (is the API) |
| Admin Panel (Next.js) | ✅ Read | ✅ Audit log read | ❌ Never | ⚠️ Crisis only (logged) |

---

## Enforcement Layers

| Layer | Mechanism |
|---|---|
| **Code** | ESLint `no-cross-service-import` rule — fails lint if session/vault imports commerce Prisma |
| **CI** | `data-separation.yml` — scans session/vault schemas for PII field names on every PR |
| **PR Review** | `PULL_REQUEST_TEMPLATE.md` — cross-service linkage checklist, required before merge |
| **Infra** | VPC network policy — session service has no outbound route to vault DB subnet |
| **DB permissions** | Separate DB users per service; vault DB user has INSERT + SELECT only |
| **Test** | Integration test: attempt session→commerce DB query, assert connection refused |

---

## Adding a New Cross-Service Interaction (How to Do It Safely)

If you believe a new interaction between services is required:

1. **Stop and open a discussion** — do not implement until approved
2. Tag `SECURITY_CRITICAL` on the GitHub discussion
3. Requires: Tech Lead + Senior Engineer sign-off
4. Must pass: "Does this create a path from session data to identity data?"
5. If yes → rejected. If no → proceed with full PR checklist.

There is no fast path for this. The separation model is non-negotiable.
