# Phase 1C Delegation — Identity Vault Service

**Owner:** Engineering Team  
**Critical Gate:** No session features ship until this phase is complete and security-reviewed.  
**Last Updated:** May 26, 2026

---

## Overview

Phase 1C is split into two independent workstreams. Workstream B can begin immediately with mocked KMS. Workstream A is the AWS infrastructure blocker.

---

## Workstream A: AWS Infrastructure
**Owner:** Cloud/infrastructure engineer with AWS credentials  
**Blocking:** Workstream B cannot use real KMS until 1C.2 is done

### Tasks

| # | Task | Effort | Notes |
|---|---|---|---|
| 1C.1 | Provision HIPAA-capable isolated VPC | L | AWS or GCP; isolated subnet for vault + session services |
| 1C.2 | Provision KMS key `hips-vault-master`, AES-256-GCM, 90-day rotation | M | AWS KMS or GCP Cloud KMS; key rotation must be configured |
| 1C.3 | Create RDS instance (encrypted, isolated subnet) | M | Separate VPC subnet; no shared DB user with any other service |

### 1C.1 — VPC Requirements
- Isolated VPC with no public internet access
- Private subnets for: vault service, session service, RDS
- NAT gateway for outbound-only access (optional)
- Security groups: vault service → RDS (5432, SELECT/INSERT only), session service → vault (internal REST)
- No ingress from public internet to vault service under any circumstance

### 1C.2 — KMS Requirements
- Key alias: `hips-vault-master`
- Spec: AES-256-GCM (symmetric)
- Rotation: 90-day schedule
- Key policy: vault service role ONLY; no root access
- Region: choose based on HIPAA compliance boundary

### 1C.3 — RDS Requirements
- PostgreSQL (same version as session/commerce for tooling consistency)
- Storage encryption: AES-256 (KMS key above)
- Instance class: db.t3.medium minimum for dev; db.r6g.large for prod
- Backup: automated daily snapshots, 30-day retention
- No publicly accessible — VPC-only
- Separate DB user for vault with: `SELECT + INSERT` on `IdentityRecord`, `INSERT`-only on `VaultAccessLog`

### Dependencies
- **Blocks:** Workstream B (real KMS), Phase 2 (auth layer), Phase 5 (session services)
- **Unblocks after security review (1C.12):** `POST /session/v1/token` can ship

---

## Workstream B: Vault API Build
**Owner:** Backend engineers  
**Can start:** Immediately with mock KMS

### Tasks

| # | Task | Effort | Dependencies | Notes |
|---|---|---|---|---|
| 1C.6 | NestJS API: `POST /vault/records`, `GET /vault/records/:ref`, `POST /vault/access-log` | XL | 1C.4–1C.5 | Main API endpoints |
| 1C.7 | KMS encrypt/decrypt wrappers (envelope encryption) | L | 1C.2 (can mock) | TDD: RED test → GREEN; swap mock → real when 1C.2 provisioned |
| 1C.8 | IP auto-expiry cron (> 30 days → delete) | M | 1C.6 | Cron job |
| 1C.9 | Device fingerprint expiry cron (> 90 days → expire) | M | 1C.6 | Cron job |
| 1C.10 | API auth: `VAULT_API_SECRET` + IP allowlist | M | 1C.6 | Internal service only; never public internet |
| 1C.11 | Admin audit review endpoint (paginated, no raw PII) | M | 1C.6 | Admin-only; paginated VaultAccessLog |
| 1C.12 | **Security review + penetration test** | L | All above | Gate: nothing session-related ships before this |

---

### 1C.6 — API Endpoints

#### `POST /vault/records`
- **Auth:** `VAULT_API_SECRET` header + IP allowlist
- **Body:** `{ pii: { email?, phone?, ipAddress?, deviceFingerprint? }, serviceId, sessionTokenRef }`
- **Behavior:**
  1. Validate request
  2. Generate DEK (Data Encryption Key)
  3. Encrypt each PII field with DEK (AES-256-GCM)
  4. Encrypt DEK with KMS master key (envelope encryption)
  5. Store: `{ encryptedPii, encryptedDek, kmsKeyId, serviceId, sessionTokenRef }` in `IdentityRecord`
  6. Log access in `VaultAccessLog`
- **Response:** `{ data: { recordRef: "uuid" }, meta: { timestamp, requestId } }`

#### `GET /vault/records/:ref`
- **Auth:** `VAULT_API_SECRET` header + IP allowlist
- **Query:** `?justification=<string>` (required, logged)
- **Behavior:**
  1. Fetch encrypted record
  2. Decrypt DEK with KMS
  3. Decrypt PII fields
  4. Log access in `VaultAccessLog`
  5. **Never return raw PII to non-vault services** — return structured object only
- **Response:** `{ data: { pii: { decrypted fields } }, meta: { timestamp, requestId } }`

#### `POST /vault/access-log`
- **Auth:** `VAULT_API_SECRET` header + IP allowlist
- **Body:** `{ recordRef, action, justification, requesterServiceId }`
- **Behavior:** INSERT into `VaultAccessLog` only; no update/delete
- **Response:** `{ data: { logId }, meta: { timestamp, requestId } }`

---

### 1C.7 — KMS Wrapper (Envelope Encryption)

```
encrypt(plaintext: string) → { ciphertext: string, encryptedDek: string, kmsKeyId: string }
decrypt(ciphertext: string, encryptedDek: string, kmsKeyId: string) → plaintext: string
```

**Implementation approach:**
- TDD: write failing test first (RED) → implement mock that passes (GREEN) → swap mock for real SDK
- Mock should produce same-shaped output; encryption can be identity function for dev
- Real implementation uses `@aws-sdk/client-kms` with envelope encryption pattern
- All PII fields go through this wrapper — no raw string ever stored in DB

**Envelope encryption flow:**
1. Generate random 256-bit DEK
2. Encrypt PII with DEK (AES-256-GCM via Node `crypto`)
3. Encrypt DEK with KMS master key (`Encrypt` API)
4. Store: `{ ciphertext, encryptedDek: base64(KMS.Encrypt output), kmsKeyId }`

---

### 1C.8 — IP Auto-Expiry Cron

- **Schedule:** Daily at 02:00 UTC (configure via `@nestjs/schedule`)
- **Logic:**
  1. Query `IdentityRecord` where `pii.ipAddress` is not null AND `createdAt < now() - 30 days`
  2. Delete IP address from encrypted PII (re-encrypt record with IP removed)
  3. Log deletion event in `VaultAccessLog`
- **Dry-run flag:** Support `DRY_RUN=true` for first execution
- **Output:** Log count of records cleaned

---

### 1C.9 — Device Fingerprint Expiry Cron

- **Schedule:** Daily at 03:00 UTC
- **Logic:**
  1. Query records where `pii.deviceFingerprint` is not null AND `createdAt < now() - 90 days`
  2. Re-encrypt record with fingerprint removed (do NOT delete record)
  3. Log expiry in `VaultAccessLog`
- **Output:** Log count of records expired

---

### 1C.10 — API Authentication

```
Header: X-Vault-Secret: <VAULT_API_SECRET>
IP Allowlist: <comma-separated CIDRs or IPs in env>
```

- Guard applied to all `/vault/*` routes
- IP allowlist checked against `req.ip` (use `x-forwarded-for` carefully — only trust proxy if configured)
- Reject with `401` if secret wrong, `403` if IP not in allowlist
- Log all auth failures to `VaultAccessLog` with action=`AUTH_FAILURE`

---

### 1C.11 — Admin Audit Review Endpoint

#### `GET /vault/admin/audit`
- **Auth:** Admin role (separate admin auth, not vault internal secret)
- **Query params:** `?page=1&limit=50&recordRef=&action=&startDate=&endDate=`
- **Response shape:** `{ data: [{ logId, recordRef, action, justification, requesterServiceId, timestamp }], meta: { page, limit, total, requestId } }`
- **Constraint:** Never return raw PII in response — only `recordRef` (UUID)
- **Sorting:** `timestamp DESC` (most recent first)

---

### 1C.12 — Security Review (Gate)

**Must complete before any session feature ships.**

- [ ] Penetration test: vault API endpoints
- [ ] Review: no raw PII at rest in any table
- [ ] Review: `VaultAccessLog` INSERT-only enforcement at DB level
- [ ] Review: IP allowlist correctly blocks non-allowlisted IPs
- [ ] Review: DEK never stored unencrypted
- [ ] Review: KMS key rotation schedule verified
- [ ] Sign-off: senior engineer + security reviewer

---

## Existing Code Reference

| Path | Status |
|---|---|
| `services/vault/` | NestJS project scaffolded with `@nestjs/core`, `@prisma/client`, `@aws-sdk/client-kms` |
| `services/vault/src/` | Empty — start here for 1C.6 |
| `docs/HIPS_Task_List_v1.md` | Full task reference (rows 79–92 for 1C) |
| `docs/HIPS_Ultimate_Architecture_v2.md` | Architecture reference |

---

## Immediate Next Steps

### Workstream A (AWS):
1. Decide: AWS or GCP? (see OQ.1 in task list)
2. Begin VPC design and KMS key provisioning in parallel
3. Coordinate with Workstream B on KMS key ARN once 1C.2 is complete

### Workstream B (API):
1. Scaffold `src/` with module structure: `RecordsModule`, `KmsModule`, `AuthModule`, `CronModule`, `AdminModule`
2. Write `KmsService` interface with mock implementation first
3. Write tests for `KmsService.encrypt()` / `.decrypt()` — RED until mock
4. Build `POST /vault/records` controller → service → repository flow
5. Wire up cron jobs once base endpoints are green

---

## Constraints (Non-Negotiable)

- Vault API is **never exposed to public internet**
- `VaultAccessLog` must remain INSERT-only at the DB role level
- All PII must be encrypted before any DB write
- Session token issuance (`POST /session/v1/token`) is **blocked** until 1C.12 is complete
- No cross-service DB linkage possible (vault DB completely isolated from session/commerce DBs)
