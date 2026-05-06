# H.I.P.S. Security Policy

**Foundation:** Hiding in Plain Sight Foundation
**Document Type:** Security Policy
**Version:** 1.0
**Status:** Canonical — all engineering, infrastructure, and operational decisions must conform
**Date:** April 24, 2026
**Authority:** Tech Lead + Infrastructure Lead
**Depends on:** `HIPS_Ultimate_Architecture_v2.md` · `DEPLOY_RUNBOOK.md` · `aws-infrastructure-21.md` · `data-separation-12.md`

---

## Table of Contents

1. [Security Principles](#1-security-principles)
2. [Secret Management](#2-secret-management)
3. [Encryption Standards](#3-encryption-standards)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Input Validation & Code Standards](#5-input-validation--code-standards)
6. [Network & Infrastructure Security](#6-network--infrastructure-security)
7. [Audit & Immutability](#7-audit--immutability)
8. [Monitoring & Alerting](#8-monitoring--alerting)
9. [Penetration Testing Schedule](#9-penetration-testing-schedule)
10. [Incident Response](#10-incident-response)
11. [Responsible Disclosure](#11-responsible-disclosure)
12. [Security Review Gates](#12-security-review-gates)
13. [Engineer Offboarding](#13-engineer-offboarding)

---

## 1. Security Principles

These principles are downstream of the platform's core architectural principles. They are not guidelines — they are constraints. Any feature, shortcut, or dependency that violates them must be rejected.

1. **Security before features** — no feature ships if it creates a data linkage between identity and session data. This is the highest-priority constraint in the entire system.
2. **Least privilege everywhere** — every service, DB user, IAM role, and human operator has exactly the permissions required for their function and nothing more. No wildcards (`*`) on any resource.
3. **No secrets in code** — all secrets live in AWS Secrets Manager (production) and Vercel project settings (frontend). No secret is ever committed to version control. `.env.local` is `.gitignore`'d and for local development only.
4. **Defense in depth** — no single layer is trusted to enforce security alone. Identity separation is enforced at the code layer (ESLint), CI layer (data-separation scan), infrastructure layer (VPC security groups), and DB permission layer (separate DB users, insert-only constraints).
5. **Immutable audit trail** — every access to the Identity Vault is permanently logged. The `VaultAccessLog` and `AuditEvent` tables have no `UPDATE` or `DELETE` permission granted to any application role. These records cannot be erased.
6. **Human in the loop for high-stakes actions** — no automated process can trigger Identity Vault access, initiate crisis protocol, or approve a vault deploy without a human-initiated, logged action.
7. **Encryption at rest and in transit everywhere** — no sensitive data is stored unencrypted. No sensitive data traverses the network without TLS 1.3 minimum.

---

## 2. Secret Management

### Storage Rules

| Environment | Secret Store | Rule |
|---|---|---|
| Production (backend services) | AWS Secrets Manager | All vault, session, safety, and KMS secrets |
| Production (frontend / API routes) | Vercel Project Settings (encrypted env vars) | Firebase, Stripe, Resend, Supabase keys |
| Local development | `.env.local` only | `.gitignore`'d — never committed |
| CI/CD (GitHub Actions) | GitHub Actions Secrets | Only secrets required for CI — no production DB URLs |

### Hard Rules

- **No secret is ever committed to version control.** This includes `.env` files, hardcoded strings, base64-encoded values, or comments containing keys.
- **No secret is ever logged.** No `console.log`, no Sentry breadcrumb, no CloudWatch log line may contain a secret value.
- **No secret is shared between services.** Each service has its own secret. The Vault API Secret is not the same as the Session Service Secret.
- **Secrets are referenced by name, not value.** Application code calls `SecretsManager.getSecretValue({ SecretId: 'hips/vault/api-secret' })` — the value is never hardcoded.

### Secret Inventory

| Secret Name | Used By | Store | Rotation |
|---|---|---|---|
| `VAULT_API_SECRET` | Vault NestJS service ↔ Safety Engine | AWS Secrets Manager | Monthly |
| `SESSION_SERVICE_SECRET` | Session NestJS service ↔ Commerce API | AWS Secrets Manager | Monthly |
| `VAULT_KMS_KEY_ID` | Vault service for KMS calls | AWS Secrets Manager | N/A (key rotates via KMS) |
| `Firebase_SECRET_KEY` | Commerce Next.js API routes | Vercel Project Settings | Per Firebase recommendation |
| `STRIPE_SECRET_KEY` | Commerce Next.js API routes | Vercel Project Settings | As needed / on breach |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook handler | Vercel Project Settings | On endpoint change |
| `SUPABASE_SERVICE_ROLE_KEY` | Digital product delivery | Vercel Project Settings | Quarterly |
| `RESEND_API_KEY` | Email service | Vercel Project Settings | Quarterly |
| `LIVEKIT_API_SECRET` | LiveKit room token issuance | AWS Secrets Manager | Quarterly |
| `DATABASE_URL` (commerce) | Commerce Prisma client | Vercel Project Settings | On credential rotation |
| `SESSION_DATABASE_URL` | Session NestJS service | AWS Secrets Manager | On credential rotation |
| `VAULT_DATABASE_URL` | Vault NestJS service only | AWS Secrets Manager | On credential rotation |

### Rotation Schedule

| Cadence | Secrets |
|---|---|
| **Monthly** | `VAULT_API_SECRET`, `SESSION_SERVICE_SECRET` |
| **Quarterly** | `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LIVEKIT_API_SECRET` |
| **90 days (automated)** | KMS key (`hips-vault-master`) — AWS KMS automatic rotation |
| **On breach or suspicion** | Any secret, immediately — follow Section 10 incident response |
| **On engineer offboarding** | `VAULT_API_SECRET`, `SESSION_SERVICE_SECRET` — see Section 13 |

### Rotation Procedure

1. Generate new secret value (cryptographically random, minimum 32 bytes)
2. Update in AWS Secrets Manager or Vercel — **never in code**
3. Rolling restart of affected services (zero-downtime for NestJS ECS services)
4. Verify health checks pass after restart
5. Log rotation event in the monthly maintenance record
6. Do not delete the old secret version in Secrets Manager for 24 hours (supports zero-downtime rotation)

---

## 3. Encryption Standards

### Encryption at Rest

| Layer | Method | Key Management | Notes |
|---|---|---|---|
| **Identity Vault DB** | AES-256-GCM (KMS-managed) | AWS KMS `hips-vault-master`, 90-day auto-rotation | Every field individually encrypted via application-layer KMS calls before write |
| **Session DB** | AES-256 database-level encryption | AWS RDS managed | Column-level encryption for sensitive fields |
| **Commerce DB** | TLS in transit; Railway managed encryption at rest | Railway managed | Standard PostgreSQL encryption |
| **Object Storage (Supabase)** | Server-side encryption | Supabase managed | All objects encrypted at rest by default |
| **Voice recordings (if consented)** | Server-side encryption | Supabase managed | Signed URL access only; defined retention (see `DATA_RETENTION_POLICY.md`) |
| **Backups (S3)** | SSE-KMS | `hips-vault-master` for vault backups; AWS managed for others | `--sse aws:kms` flag on all `aws s3 cp` backup commands |

### Encryption in Transit

| Layer | Method | Minimum Version | Notes |
|---|---|---|---|
| All HTTP traffic | TLS | 1.3 | Enforced at ALB; Vercel handles frontend |
| WebRTC voice | DTLS-SRTP | Standard WebRTC | Mandatory — cannot be disabled |
| WebSocket (session) | WSS (TLS) | 1.3 | All `ws://` connections refused |
| Service-to-service (internal VPC) | TLS | 1.3 | ACM certificates via ALB |
| DB connections | TLS | 1.2 minimum | `sslmode=require` on all Prisma / pg connection strings |

### KMS Key Configuration

```
Key alias:    alias/hips-vault-prod
Key alias:    alias/hips-vault-staging
Type:         Symmetric, AES-256-GCM
Usage:        ENCRYPT_DECRYPT
Rotation:     Automatic every 90 days
Deletion:     30-day window (prevents accidental loss)

Key Policy:
  hips-vault-service-role:  kms:Encrypt, kms:Decrypt, kms:GenerateDataKey
  hips-rotation-role:       kms:DescribeKey  (no data access)
  infra-admin-role:         kms:CreateKey, kms:ScheduleKeyDeletion  (break-glass only)

CloudTrail:   All KMS API calls logged, including Decrypt events
```

> **Hard rule:** The `infra-admin-role` KMS permissions are break-glass only. No deployment, no routine operation, and no automated process uses this role. Its use triggers an immediate security review.

---

## 4. Authentication & Authorization

### Two-Layer Auth Model

The platform operates two completely separate authentication layers. These layers must never be bridged.

**Layer 1 — Commerce (Firebase)**
- Manages booking, payment, dashboard, admin, and facilitator access
- JWT with role claim: `PARTICIPANT` | `LEADER` | `ORGBUYER` | `FACILITATOR` | `ADMIN`
- JWT verified server-side on every protected API route — never trusted from frontend alone
- Role confirmed in DB (not only JWT claim) for every `FACILITATOR` and `ADMIN` operation
- Firebase JWT is short-lived; rotation handled by Firebase

**Layer 2 — Session (Anonymous Tokens)**
- Issued by Auth Service on session start
- Linked to `session_id` only — never to a Firebase user ID, email, or real name
- Short-lived: expires at session end (maximum session duration + 5-minute buffer)
- Single-use: token cannot be reused after session teardown
- Not stored in commerce DB — the `sessionTokenRef` column in the commerce `Session` table is a reference hash only, not the token itself

### Rules

- All `/api/v1/` endpoints require a valid Firebase JWT unless explicitly listed as public
- Public endpoints: `POST /api/v1/organizations/inquiry`, `POST /api/v1/checkout/donation`, `GET /api/v1/services`
- Role enforcement happens in the route handler server-side — the frontend never enforces authorization
- Admin routes double-check `User.role === 'ADMIN'` in DB — JWT claim alone is insufficient
- Identity Vault access tokens are a third, separate token type — they require an explicit `justification` field and are issued only by the Vault API

### Session Token Issuance Security

```
Rate limit:     5 requests/minute per commerce user ID
Validation:     Firebase JWT must be valid before token is issued
Output:         Opaque random token (32 bytes, hex-encoded)
Storage:        In-memory only (NestJS session service) — not written to any DB
Expiry:         Session duration + 5 minutes
After expiry:   Token is invalid; any request using it returns 401
```

---

## 5. Input Validation & Code Standards

### Validation Rules

- **All inputs validated with Zod** before touching any database — no raw request body is ever passed directly to Prisma or SQL
- **Prisma parameterized queries exclusively** — no raw string interpolation in any DB query
- **File uploads:** type (allowlist only), size (max 10MB), and destination (Supabase only) validated server-side before acceptance
- **Crisis intake forms:** sanitized before logging — no PII stored without explicit disclosure acceptance

### TypeScript Standards

- `strict: true` in all `tsconfig.json` files — no `any` without documented justification in a code comment
- All API request and response shapes typed with explicit interfaces — no `Record<string, unknown>` shortcuts
- All async functions have explicit error handling — no unhandled promise rejections
- All API responses follow the standard shape: `{ data, error, meta }` — no ad-hoc response structures

### Dependency Security

- `pnpm audit` runs in CI on every PR — any `high` or `critical` severity finding blocks merge
- No new direct dependency added without Tech Lead review
- No dependency with a known active CVE is merged to `main`
- `package.json` lockfile (`pnpm-lock.yaml`) is committed and enforced — `--frozen-lockfile` in CI

### Code Review Security Checklist (required on every PR)

- [ ] No secrets, tokens, or credentials in any diff
- [ ] No cross-service DB import (vault ↔ session ↔ commerce) — checked by ESLint rule
- [ ] All new API endpoints require auth unless explicitly justified
- [ ] All new inputs have Zod validation
- [ ] No raw SQL string interpolation
- [ ] No `console.log` statements containing user data or request bodies
- [ ] If touching auth, payments, or vault: senior engineer review required

---

## 6. Network & Infrastructure Security

### VPC Architecture

```
VPC: 10.0.0.0/16

Public Subnet (10.0.1.0/24)
  └── ALB — receives traffic from Vercel + internet

Private Subnet A — Application Layer (10.0.2.0/24)
  ├── ECS Fargate: hips-vault (Vault NestJS service)
  ├── ECS Fargate: hips-session (Session NestJS service)
  ├── ECS Fargate: hips-safety (Safety Engine NestJS service)
  └── ECS Fargate: hips-calcom (Cal.com self-hosted)

Private Subnet B — Data Layer (10.0.3.0/24)
  ├── RDS: vault-db     ← inbound ONLY from vault service SG on port 5432
  └── RDS: session-db   ← inbound ONLY from session + safety service SGs on port 5432
```

**Hard rules:**
- No internet gateway route from Private Subnet B — data layer has no public internet access
- Vault DB security group: inbound on port 5432 from vault service security group ONLY
- Session DB security group: inbound from session and safety service security groups ONLY — no vault service, no commerce service
- Zero cross-service DB routes enforced at security group level — not just at the code level

### IAM Roles (Least Privilege)

| Role | Services | Permissions |
|---|---|---|
| `hips-vault-service-role` | ECS vault task | `kms:Encrypt`, `kms:Decrypt`, `kms:GenerateDataKey`; `secretsmanager:GetSecretValue` (vault secrets only); `rds-db:connect` (vault-db only) |
| `hips-session-service-role` | ECS session task | `secretsmanager:GetSecretValue` (session secrets only); `rds-db:connect` (session-db only) |
| `hips-safety-service-role` | ECS safety task | `rds-db:connect` (session-db, read-only); `sns:Publish` (crisis alerts topic only) |
| `hips-infra-role` | CI/CD deploys | `ecs:UpdateService`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`; no read of production secrets |

> **Hard rule:** No IAM role has `*` on any resource. No cross-service DB access in any policy. Any policy change requires Infrastructure Lead review and is logged in the change record.

### DB Permission Model

Three separate database users exist for the Identity Vault. No user has `UPDATE` or `DELETE` on any vault table.

| DB Role | Table Access | Permissions |
|---|---|---|
| `vault_api_user` | `IdentityRecord` | `SELECT`, `INSERT` only — no `UPDATE`, `DELETE` |
| `vault_api_user` | `VaultAccessLog` | `INSERT` only — cannot read back |
| `vault_audit_user` | `VaultAccessLog` | `INSERT` only |
| `vault_rotation_user` | None | Schema-level `USAGE` only — no data access |

Row-level security is enabled on `IdentityRecord`. No `DROP`, `ALTER`, or `TRUNCATE` granted to any application role.

### Rate Limits (API Gateway)

| Endpoint Category | Limit | Rationale |
|---|---|---|
| Auth endpoints | 10 req/min | Brute-force protection |
| Session token issuance | 5 req/min | Prevents anonymous token farming |
| Booking / checkout | 30 req/min | Prevents booking abuse |
| Donation | 20 req/min | Prevents card testing |
| Safety flag | 30 req/min | Operational limit |
| Admin endpoints | 60 req/min | Staff operational needs |
| Stripe webhook | No rate limit | Stripe IP allowlist enforced instead |

---

## 7. Audit & Immutability

Every sensitive action on the platform is permanently logged. These logs cannot be modified or deleted by any application role.

### AuditEvent Table (Session DB)

```sql
-- DB user has INSERT + SELECT only. No UPDATE. No DELETE.
model AuditEvent {
  id          String   @id @default(uuid())
  eventType   String   -- e.g. SESSION_STARTED, CRISIS_FLAGGED, VAULT_ACCESSED
  actorId     String   -- Firebase user ID (hashed for non-admin actors)
  targetId    String?  -- Session ID or vault record reference
  justification String? -- Required for vault access events
  ipRef       String?  -- Hashed IP only — never raw
  createdAt   DateTime @default(now())
  -- No updatedAt. No deletedAt. Immutable.
}
```

### VaultAccessLog (Identity Vault DB)

```sql
-- DB user: INSERT only. No SELECT, no UPDATE, no DELETE for application roles.
-- Admin audit review uses a separate read-only reporting role.
VaultAccessLog {
  id           UUID     PRIMARY KEY
  requestorId  STRING   -- Staff member who initiated vault access
  vaultRecordId UUID    -- Which identity record was accessed
  justification STRING  -- Required — what justified this access
  grantedAt    TIMESTAMP -- When access was granted
  -- Insert-only. No amendments. No deletions.
}
```

### What Must Be Logged

| Event | Log Target | Required Fields |
|---|---|---|
| Identity Vault access | `VaultAccessLog` | `requestorId`, `vaultRecordId`, `justification`, `grantedAt` |
| Session start / end | `AuditEvent` | `eventType`, `actorId` (anon), `targetId` (session ID) |
| Crisis flag initiated | `AuditEvent` + Safety DB | `eventType: CRISIS_FLAGGED`, `actorId`, `targetId`, `justification` |
| Admin action (scholarship approve/deny, org quote) | `AuditEvent` | `eventType`, `actorId`, `targetId` |
| Stripe webhook received | Webhook log table | `eventType`, `stripeEventId`, `timestamp`, `status` |
| KMS Decrypt call | AWS CloudTrail (automatic) | Full CloudTrail event |
| Engineer vault deploy | Deploy log + Slack `#deployments` | Engineer, timestamp, pre/post health check status |

### Audit Immutability Verification

Run after every vault deploy and monthly:

```sql
-- Expected: 0 rows. Any row returned is a critical security finding.
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'vaultaccesslog'
  AND privilege_type IN ('UPDATE', 'DELETE');
```

---

## 8. Monitoring & Alerting

All alarms route to: **SNS → PagerDuty** (P0/P1) and **SNS → Slack `#security-alerts`** (all severities).

### CloudWatch Alarms

**Alarm 1 — Vault Access Spike**
```
Metric:     Custom/VaultService/VaultAccessCount
Threshold:  ≥ 2 accesses in any 10-minute window OUTSIDE a logged crisis event
Action:     SNS → PagerDuty + email security@hips.foundation
Response:   P0 — immediate. See Section 10.
```

**Alarm 2 — Vault API Auth Failures**
```
Metric:     Custom/VaultService/AuthFailureCount
Threshold:  ≥ 5 failures in 5 minutes
Action:     SNS → PagerDuty P1
Response:   Possible credential stuffing or service misconfiguration. Investigate immediately.
```

**Alarm 3 — KMS Decrypt Volume Spike**
```
Metric:     AWS/KMS/DecryptRequests (from CloudTrail)
Threshold:  ≥ 50 decrypt calls in 5 minutes (baseline: ~5/min during active sessions)
Action:     SNS → PagerDuty + Slack #security-alerts
Response:   Could indicate bulk data exfiltration attempt. Investigate and consider taking vault offline.
```

**Alarm 4 — Auth Failure Spike (Commerce)**
```
Metric:     Firebase webhook auth failure events
Threshold:  ≥ 20 failures in 5 minutes
Action:     SNS → Slack #security-alerts
Response:   P1 — possible credential stuffing on commerce auth. Review Firebase dashboard.
```

**Alarm 5 — 5xx Error Spike**
```
Metric:     ALB HTTPCode_Target_5XX_Count
Threshold:  ≥ 10 in 2 minutes
Action:     SNS → PagerDuty P1
Response:   Service degradation. Check ECS task health, recent deploys.
```

### AWS Services Required (Active at All Times)

| Service | Purpose | Status Requirement |
|---|---|---|
| **CloudTrail** | All API calls logged (all regions) | Must be active before any production traffic |
| **GuardDuty** | Threat detection — unusual API calls, unauthorized access | Must be active before any production traffic |
| **Security Hub** | HIPAA standard compliance monitoring | Must be active before any production traffic |
| **AWS Config** | Infrastructure compliance drift detection | Enabled at account level |

> **Hard rule:** CloudTrail, GuardDuty, and Security Hub must be active and confirmed before the first production session goes live. This is a Phase 11 launch gate item.

### Weekly Security Review

Every week, the Tech Lead or Infrastructure Lead reviews:
- Sentry error trends — no unexplained spikes
- Uptime monitor — all services green
- Stripe webhook delivery success rate — no failures unreplayed
- `VaultAccessLog` — any access outside logged crisis events = immediate investigation
- CloudWatch alarm history — any triggered alarms reviewed and resolved

---

## 9. Penetration Testing Schedule

Penetration testing is a launch gate requirement and a recurring operational commitment.

### Pre-Launch (Required before Phase 11 go-live)

| Test | Scope | Conducted By | Required Before |
|---|---|---|---|
| Identity Vault pen test | Vault API, vault DB access controls, VPC isolation, KMS key access | External security firm | Phase 11 go-live |
| Session ↔ Commerce separation test | Attempt to link session data to identity data via any API, DB, or service | External or senior internal engineer | Phase 11 go-live |
| Auth bypass test | Attempt to access protected routes without valid JWT; attempt role escalation | External or senior internal engineer | Phase 11 go-live |
| Stripe payment security test | Attempt to manipulate PaymentIntent amounts, bypass webhook verification | Senior internal engineer | Phase 11 go-live |

All findings must be triaged and resolved before launch. No `high` or `critical` findings may be deferred to post-launch.

### Recurring Schedule

| Cadence | Scope |
|---|---|
| **Quarterly** | Full platform pen test — Identity Vault, session separation, auth, payments, data layer |
| **Quarterly** | Disaster recovery drill — restore production DB from backup to staging; verify restore integrity |
| **Annually** | Full third-party security audit — all infrastructure, IAM roles, DB permissions, encryption configuration |
| **On every major architectural change** | Targeted pen test for the changed component before merge to `main` |

### Pen Test Scope Document

Every pen test engagement must define:
1. In-scope systems (list specific services, endpoints, DB instances)
2. Out-of-scope systems (e.g., Firebase infrastructure — managed by Firebase)
3. Rules of engagement (no destructive testing in production; staging environment preferred)
4. Required deliverables: executive summary + technical findings + reproduction steps + severity ratings
5. Remediation SLA: P0/Critical = 48 hours; P1/High = 1 week; P2/Medium = next sprint; P3/Low = backlog

---

## 10. Incident Response

### Severity Levels

| Level | Description | Response Time | Examples |
|---|---|---|---|
| **P0 — Critical** | Identity Vault breach or confirmed data linkage between session and identity | Immediate | Vault DB exposed; session-identity join discovered; KMS key compromised |
| **P1 — High** | Payments down; auth completely broken; crisis protocol fails; vault anomaly alarm | 15 minutes | Stripe webhooks not processing; Firebase outage; vault access spike alarm |
| **P2 — Medium** | Feature degraded but platform operational | 1 hour | Scholarship emails failing; group sessions degraded |
| **P3 — Low** | Minor UI bug; non-critical email failure | Next business day | Wrong price display; email formatting broken |

### P0 — Identity Vault Breach Response

> **This is the highest-severity event on the platform. Follow these steps in order. Do not skip steps.**

1. **Immediately** take the vault service offline:
   ```bash
   aws ecs update-service --cluster hips-prod --service hips-vault --desired-count 0
   ```
2. **Immediately** notify: Founder · Legal counsel · Senior engineer on call
3. **Preserve all logs** — do not delete, rotate, or modify any logs, CloudTrail events, or VaultAccessLog entries
4. **Identify scope** — review `VaultAccessLog` for unauthorized access patterns; review CloudTrail for unexpected KMS Decrypt calls
5. **Engage** HIPAA-capable cloud provider incident response team
6. **Do not communicate externally** until legal counsel advises
7. **Document everything** with timestamps from this point forward
8. **Do not restore service** until: scope is fully understood + root cause identified + remediation deployed + legal counsel approves

### P1 — Vault Anomaly Alarm (non-breach)

1. Review `VaultAccessLog` — identify all accesses in the alarm window
2. Confirm each access has a corresponding logged crisis event with justification
3. If any access lacks a justification entry: escalate to P0 immediately
4. If all accesses are justified: document in the weekly security review; investigate alarm threshold calibration

### P1 — Payments Down

1. Check Stripe status: `https://status.stripe.com`
2. If Stripe incident: communicate ETA to ops; no action required on platform side
3. If Stripe healthy: check `STRIPE_WEBHOOK_SECRET` in Vercel matches current Stripe signing secret
4. Check Sentry for webhook handler errors
5. Replay failed webhook events from Stripe Dashboard if confirmed missed

### P1 — Auth Broken

1. Check Firebase status: `https://status.Firebase.com`
2. If Firebase incident: communicate ETA; no action
3. Verify `NEXT_PUBLIC_Firebase_PUBLISHABLE_KEY` and `Firebase_SECRET_KEY` in Vercel
4. If env vars correct and Firebase healthy: review `middleware.ts` for recent changes
5. Roll back if needed — see `DEPLOY_RUNBOOK.md` Section 8

### Post-Incident Requirements

- **All P0/P1 incidents:** written incident report within 24 hours
- **All P0 incidents:** blameless retro within 1 week; architecture review if vault-related
- **Report must include:** timeline, root cause, impact scope, remediation steps, process changes
- **P0 vault incidents:** legal counsel and Founder must approve all external communications

---

## 11. Responsible Disclosure

H.I.P.S. takes security research seriously. If you discover a security vulnerability in the platform, please report it responsibly.

### Reporting

**Email:** `security@hips.foundation`
**Subject line:** `[Security Disclosure] Brief description`
**Encryption:** PGP key available at `https://hips.foundation/.well-known/pgp-key.txt` *(to be provisioned before launch)*

### What to Include

- Description of the vulnerability and affected component
- Steps to reproduce
- Potential impact assessment
- Any proof-of-concept (non-destructive only)

### Our Commitments

- Acknowledge receipt within **48 hours**
- Provide a status update within **5 business days**
- Not pursue legal action against researchers acting in good faith
- Credit researchers in our security acknowledgements (if desired)

### Scope

**In scope:** All H.I.P.S. platform services (`hips.foundation` and subdomains), APIs, mobile web, Identity Vault API
**Out of scope:** Firebase infrastructure, Stripe infrastructure, Railway infrastructure, social engineering attacks, physical attacks

### Safe Harbor

Researchers who follow this policy and act in good faith will not be subject to legal action. Testing must be conducted against your own accounts or staging environments — never against production participant data.

---

## 12. Security Review Gates

These gates are non-negotiable. No code merges to `main` that bypasses them.

### Every PR

- [ ] `pnpm audit` — no `high` or `critical` severity findings
- [ ] ESLint `no-cross-service-import` rule passes — no vault/session/commerce cross-imports
- [ ] `pnpm check:copy` passes — no banned clinical language
- [ ] TypeScript strict mode — no new `any` without justification
- [ ] No secrets in diff (automated secret scanning via `gitleaks` in CI)
- [ ] Code review: minimum 1 approval

### PRs Touching Auth, Payments, or Identity Vault

- [ ] Senior engineer review required (in addition to standard review)
- [ ] Cross-service linkage question answered: *"Does this create any path from session data to identity data?"*
- [ ] If yes → rejected. No exceptions.
- [ ] Auth changes: role enforcement verified server-side, not frontend-only
- [ ] Payment changes: separate PaymentIntents for donations vs. services verified

### Before Every Vault Deploy

- [ ] Senior engineer has reviewed all vault code changes
- [ ] No new `IdentityRecord` fields without KMS encryption coverage
- [ ] `VaultAccessLog` insert-only constraint verified in staging:
  ```sql
  SELECT grantee, privilege_type
  FROM information_schema.role_table_grants
  WHERE table_name = 'vaultaccesslog'
    AND privilege_type IN ('UPDATE', 'DELETE');
  -- Expected: 0 rows
  ```
- [ ] KMS key version matches staging configuration
- [ ] Maintenance window communicated to all stakeholders 24 hours in advance
- [ ] Vault DB backup taken before deploy

### Phase 11 Launch Security Gates

- [ ] Identity Vault pen test complete — all findings resolved
- [ ] Session ↔ Commerce separation integration test passes
- [ ] CloudTrail, GuardDuty, Security Hub confirmed active
- [ ] All production secrets confirmed in AWS Secrets Manager / Vercel — zero in version control
- [ ] CloudWatch alarms verified firing (test each alarm)
- [ ] AWS HIPAA BAA signed and activated
- [ ] `gitleaks` pre-commit hook installed for all engineers

---

## 13. Engineer Offboarding

When an engineer leaves the team, complete this checklist within 24 hours of their last day. The Tech Lead is responsible for completion.

### Access Revocation

- [ ] Remove from GitHub organization
- [ ] Revoke Vercel access (remove from team)
- [ ] Revoke Railway access
- [ ] Revoke AWS console access (delete IAM user or deactivate SSO)
- [ ] Remove from Sentry organization
- [ ] Revoke Stripe Dashboard access (if applicable)
- [ ] Remove from Firebase Dashboard (if applicable)
- [ ] Remove from PagerDuty on-call schedule
- [ ] Remove from Slack `#security-alerts` and `#crisis-alerts` channels

### Secret Rotation (required within 24 hours)

- [ ] Rotate `VAULT_API_SECRET` in AWS Secrets Manager + update all services
- [ ] Rotate `SESSION_SERVICE_SECRET` in AWS Secrets Manager + update all services
- [ ] If engineer had Vercel access: rotate any secrets they could have read
- [ ] Update `VAULT_DATABASE_URL` credentials if engineer had DB access

### Audit Review

- [ ] Review `VaultAccessLog` for any vault accesses by departing engineer in last 90 days
- [ ] Review `AuditEvent` for any anomalous admin actions in last 30 days
- [ ] Review CloudTrail for any unusual API calls in last 30 days
- [ ] Document review findings (even if clean) in offboarding record

---

*Document maintained by: Tech Lead + Infrastructure Lead*
*Review cycle: Quarterly; after every P0/P1 incident; before every pen test engagement*
*Change process: PR to `docs/SECURITY_POLICY.md` · requires Tech Lead + Infrastructure Lead review*
*Companion documents: `DEPLOY_RUNBOOK.md` · `DATA_RETENTION_POLICY.md` · `aws-infrastructure-21.md`*
