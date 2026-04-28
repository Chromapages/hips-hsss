# H.I.P.S. AWS Infrastructure Specification
# OQ.1 Decision: AWS (April 23, 2026)
# Owner: Infra Lead
# Used for: Task 1C.1 (HIPAA cloud provisioning), Task 11.6 (production lockdown)

---

## AWS Services Required

### Core (Phase 1 — MVP)

| Service | Purpose | HIPAA BAA Required |
|---|---|---|
| **ECS Fargate** | NestJS containers: session, vault, safety services | Yes |
| **RDS PostgreSQL** | Session DB (separate instance from Railway commerce DB) | Yes |
| **RDS PostgreSQL (encrypted)** | Identity Vault DB — isolated VPC subnet | Yes |
| **AWS KMS** | Encryption keys for Identity Vault; key rotation schedule | Yes |
| **Secrets Manager** | All production secrets: vault API secret, session secret, KMS key IDs | Yes |
| **VPC + subnets** | Isolated private network; vault DB in separate subnet | Yes |
| **Security Groups** | Per-service firewall rules; vault accessible only from vault service | Yes |
| **ALB (App Load Balancer)** | Routes to ECS Fargate services; TLS termination | Yes |
| **ACM (Certificate Manager)** | TLS certificates for internal service-to-service communication | Yes |
| **CloudWatch Logs** | Centralized logging for all NestJS services | Yes |
| **CloudWatch Alarms** | Vault anomaly alerting (R1.3): >2 vault accesses in 10-min window | Yes |
| **S3** | Backup storage for DB snapshots (encrypted, versioned) | Yes |
| **IAM** | Service roles with least-privilege policies; no shared credentials | Yes |

### Phase 2 Additions

| Service | Purpose |
|---|---|
| **ElastiCache (Redis)** | Group session lobby state (Task 5.9) |
| **SQS** | Async AI summary job queue (Phase 2) |
| **SageMaker** | AI summary generation (Phase 2, opt-in only) |

---

## VPC Architecture

```
VPC: 10.0.0.0/16
├── Public Subnet (10.0.1.0/24)
│   └── ALB — receives traffic from Vercel / internet
│
├── Private Subnet A (10.0.2.0/24) — Application layer
│   ├── ECS Fargate: services/session
│   ├── ECS Fargate: services/safety
│   └── ECS Fargate: services/vault (API only — not DB)
│
└── Private Subnet B (10.0.3.0/24) — Data layer (ISOLATED)
    ├── RDS: vault-db (vault service only — no other service has route here)
    └── RDS: session-db
    ── NO internet gateway route from this subnet
    ── Security group allows inbound ONLY from vault service security group
```

**Network Policy (R2.3 — now unblocked by OQ.1):**
- Session service security group: outbound to session-db only
- Vault service security group: outbound to vault-db only
- Safety service security group: outbound to session-db (read) only
- Zero cross-service DB routes enforced at security group level — not just code
- Vault DB security group: inbound from vault service SG on port 5432 ONLY

---

## KMS Key Configuration (R1.5 — now unblocked by OQ.1)

```
Key: hips-vault-master
Type: Symmetric (AES-256-GCM)
Usage: ENCRYPT_DECRYPT
Rotation: Automatic — every 90 days
Key Policy:
  - vault-service-role: kms:Encrypt, kms:Decrypt, kms:GenerateDataKey
  - vault-rotation-role: kms:DescribeKey (no data access)
  - infra-admin-role: kms:CreateKey, kms:ScheduleKeyDeletion (break-glass only)
Aliases:
  - alias/hips-vault-prod
  - alias/hips-vault-staging
Deletion window: 30 days (prevents accidental loss)
CloudTrail: All KMS API calls logged — including Decrypt events
```

---

## CloudWatch Anomaly Alerting (R1.3 — now unblocked by OQ.1)

### Alarm 1: Vault Access Spike
```
Metric: Custom/VaultService/VaultAccessCount
Threshold: > 2 accesses in any 10-minute window OUTSIDE a logged crisis event
Action: SNS → PagerDuty + email security@hips.foundation
Evaluation: 1 period of 10 minutes
Treat missing data as: notBreaching
```

### Alarm 2: Vault API Auth Failures
```
Metric: Custom/VaultService/AuthFailureCount
Threshold: >= 5 failures in 5 minutes
Action: SNS → PagerDuty (P1) — immediate response required
Evaluation: 1 period of 5 minutes
```

### Alarm 3: KMS Decrypt Volume Spike
```
Metric: AWS/KMS/DecryptRequests (from CloudTrail)
Threshold: > 50 decrypt calls in 5 minutes (baseline: ~5/min during sessions)
Action: SNS → PagerDuty + Slack #security-alerts
```

---

## IAM Roles (Least Privilege — R1.4 extended to IAM)

| Role | Services | Permissions |
|---|---|---|
| `hips-vault-service-role` | ECS vault task | KMS Encrypt/Decrypt, Secrets Manager GetSecretValue (vault secrets only), RDS Connect (vault-db only) |
| `hips-session-service-role` | ECS session task | Secrets Manager GetSecretValue (session secrets only), RDS Connect (session-db only) |
| `hips-safety-service-role` | ECS safety task | RDS Connect (session-db read only), SNS Publish (crisis alerts) |
| `hips-infra-role` | CI/CD + deploys | ECS UpdateService, ECR Push, Secrets Manager (no read of prod secrets) |

**Hard rule:** No role has `*` on any resource. No cross-service DB access in any policy.

---

## HIPAA BAA Activation Checklist

- [ ] Sign AWS HIPAA BAA in AWS Console (Account Settings → Agreements)
- [ ] Enable CloudTrail in all regions used (us-east-1 minimum)
- [ ] Enable AWS Config for compliance monitoring
- [ ] Enable GuardDuty for threat detection
- [ ] Enable Security Hub with HIPAA standard
- [ ] Verify all services used are on the HIPAA-eligible services list
- [ ] Document BAA activation date in compliance log

---

## Cal.com Self-Hosted (OQ.4 — Deployment)

Cal.com runs as an additional ECS Fargate service in Private Subnet A.

```
Service: hips-calcom
Image: calcom/cal.com (self-hosted Docker image)
Subnet: Private Subnet A (same as session/vault/safety)
Outbound: PostgreSQL (own DB instance — NOT session or vault DB)
Inbound: ALB on /cal/* path prefix (facilitator-facing only)
Auth: Integrated with Clerk via Cal.com OAuth provider
Data: Facilitator availability, booked slots — NO participant PII
```

**Why this satisfies OQ.4:** Schedule metadata stays inside the VPC.
Cal.com's own DB is a 4th PostgreSQL instance — separate from commerce, session, and vault.

---

## Terraform / CDK Note

All infrastructure above should be defined as Infrastructure-as-Code.
Recommendation: **AWS CDK (TypeScript)** — consistent with the platform's
TypeScript stack; type-safe; generates CloudFormation.

Location: `infra/` directory at monorepo root.
Key stacks:
- `VpcStack` — VPC, subnets, security groups, NAT gateway
- `DatabaseStack` — RDS instances (session-db, vault-db, calcom-db)
- `VaultStack` — KMS key, vault service ECS task, IAM role
- `SessionStack` — Session + safety ECS tasks, LiveKit ECS task
- `MonitoringStack` — CloudWatch alarms, SNS topics, PagerDuty integration