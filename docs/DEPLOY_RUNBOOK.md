# H.I.P.S. Platform — Deploy Runbook
**Version:** 1.0 | **Last Updated:** April 23, 2026
**Owner:** Infrastructure / Tech Lead
**Classification:** Internal — Do not share externally

> This runbook covers every deployment scenario: routine deploys, hotfixes, database migrations, environment promotions, and emergency rollbacks. Follow steps in order. Do not skip steps.

---

## Table of Contents

1. [Environment Overview](#1-environment-overview)
2. [Pre-Deploy Checklist](#2-pre-deploy-checklist)
3. [Routine Production Deploy](#3-routine-production-deploy)
4. [Database Migration Deploy](#4-database-migration-deploy)
5. [Identity Vault Deploy](#5-identity-vault-deploy)
6. [Session & Safety Services Deploy](#6-session--safety-services-deploy)
7. [Hotfix Deploy](#7-hotfix-deploy)
8. [Rollback Procedures](#8-rollback-procedures)
9. [Environment Promotion (Staging → Production)](#9-environment-promotion-staging--production)
10. [Stripe Configuration](#10-stripe-configuration)
11. [Post-Deploy Verification](#11-post-deploy-verification)
12. [Incident Response](#12-incident-response)
13. [Scheduled Maintenance](#13-scheduled-maintenance)
14. [Access & Credentials](#14-access--credentials)

---

## 1. Environment Overview

| Environment | Frontend URL | Commerce DB | Session/Vault | Stripe Keys | Auto-Deploy |
|---|---|---|---|---|---|
| `development` | localhost:3000 | Railway dev (port 5432) | Local Docker | Test keys | No |
| `preview` | Vercel PR preview URL | Railway staging | Staging cloud | Test keys | On PR open |
| `production` | https://hips.foundation | Railway production | HIPAA cloud (prod) | Live keys | On merge to `main` |

### Service Ports (Local Development)

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

## 2. Pre-Deploy Checklist

Run this checklist before **every production deploy**. Do not skip items.

### Code Quality
- [ ] All CI checks pass (typecheck, lint, tests, build) on the target branch
- [ ] PR has been reviewed and approved by at least one engineer
- [ ] No `TODO: security` or `FIXME: auth` comments in changed files
- [ ] TypeScript strict mode: no new `any` introduced without documented justification
- [ ] All new API routes have Zod validation and auth middleware

### Security
- [ ] No secrets committed to the branch (run `git log --all -p | grep -i "sk_live\|pk_live\|password\|secret"`)
- [ ] Identity Vault: no new cross-service data linkage introduced
- [ ] Session ↔ Commerce DB: no shared DB user or direct query across instances
- [ ] New environment variables added to Vercel project settings and cloud secret manager
- [ ] Stripe webhook secret is current and matches Stripe Dashboard registration

### Content (required for service page or email changes)
- [ ] No instances of "therapy", "treatment", "diagnosis", "clinical" in UI copy or emails without legal sign-off
- [ ] Disclaimer present on all service pages
- [ ] Crisis resource (988) referenced wherever crisis escalation is triggered

### Database
- [ ] All new migrations include a down migration
- [ ] Migrations tested against staging DB
- [ ] Seed data does not overwrite production records

### Notifications
- [ ] Notify #engineering Slack channel 15 minutes before production deploy
- [ ] If migration involved: notify #ops and get ops lead acknowledgement

---

## 3. Routine Production Deploy

The standard deploy path is: push to `main` → GitHub Actions CI → auto-deploy to Vercel.

### Step 1: Merge to main

```bash
# Ensure branch is up to date
git fetch origin
git rebase origin/main

# Merge via PR (never direct push to main)
# PR must be approved and CI must be green
```

### Step 2: Monitor CI

- Go to: https://github.com/hips-foundation/hips-platform/actions
- Confirm all steps pass: **Install → Typecheck → Lint → Test → Build**
- CI failure = deploy blocked. Fix and re-push. Never force-merge a failing CI.

### Step 3: Monitor Vercel deploy

- Go to: https://vercel.com/hips-foundation/hips-platform
- Watch the deployment progress to completion
- Estimated deploy time: 3–5 minutes
- Vercel will run `pnpm build` in production mode; if build fails, Vercel auto-aborts and keeps previous deployment live

### Step 4: Verify production

Run the [Post-Deploy Verification](#11-post-deploy-verification) checklist.

---

## 4. Database Migration Deploy

> ⚠️ Always run migrations **before** deploying application code that depends on them. Never the reverse.

### Step 1: Backup before migration

```bash
# Commerce DB backup (Railway)
railway run --environment production \
  pg_dump $DATABASE_URL > backups/commerce_$(date +%Y%m%d_%H%M%S).sql

# Session DB backup
railway run --environment production \
  pg_dump $SESSION_DATABASE_URL > backups/session_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Test migration on staging

```bash
# Run against staging DB first
DATABASE_URL=$STAGING_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate deploy \
  --schema=./prisma/commerce.prisma

# Verify staging app works after migration
# Run integration tests against staging
pnpm --filter @hips/web test:integration
```

### Step 3: Apply migration to production

```bash
# Commerce DB
DATABASE_URL=$PROD_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate deploy \
  --schema=./prisma/commerce.prisma

# Session DB
SESSION_DATABASE_URL=$PROD_SESSION_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate deploy \
  --schema=./prisma/session.prisma
```

### Step 4: Verify schema

```bash
# Confirm migration applied
DATABASE_URL=$PROD_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate status \
  --schema=./prisma/commerce.prisma
# Expected: "All migrations have been applied"
```

### Step 5: Deploy application code

Proceed with [Routine Production Deploy](#3-routine-production-deploy).

### Rollback a migration

```bash
# Apply down migration manually
DATABASE_URL=$PROD_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate resolve \
  --rolled-back <migration_name> \
  --schema=./prisma/commerce.prisma

# Then apply the down SQL manually via psql
psql $PROD_DATABASE_URL -f packages/db/prisma/migrations/<timestamp>_<name>/down.sql
```

---

## 5. Identity Vault Deploy

> 🔴 **Highest-risk deploy.** Vault deploys require senior engineer sign-off and must be done during a maintenance window. Notify ops lead at least 24 hours in advance.

### Step 1: Pre-vault-deploy checklist

- [ ] Senior engineer has reviewed all code changes to `services/vault/`
- [ ] No new fields added to `IdentityRecord` without migration + KMS encryption coverage
- [ ] `VaultAccessLog` insert-only constraint verified in staging
- [ ] KMS key version matches staging configuration
- [ ] Maintenance window communicated to all stakeholders

### Step 2: Take vault offline (briefly)

```bash
# Scale down vault service to 0 replicas
# (Use your HIPAA cloud provider's CLI — example: AWS ECS)
aws ecs update-service \
  --cluster hips-prod \
  --service hips-vault \
  --desired-count 0

# Confirm zero running tasks
aws ecs describe-services --cluster hips-prod --services hips-vault \
  | jq '.services[0].runningCount'
# Expected: 0
```

### Step 3: Backup vault DB

```bash
# Vault DB backup (HIPAA cloud — encrypted)
pg_dump $VAULT_DATABASE_URL | \
  aws s3 cp - s3://hips-backups/vault/vault_$(date +%Y%m%d_%H%M%S).sql.gz \
  --sse aws:kms --sse-kms-key-id $VAULT_KMS_KEY_ID
```

### Step 4: Deploy vault service

```bash
# Build and push Docker image
docker build -t hips-vault:$(git rev-parse --short HEAD) ./services/vault
docker push $ECR_REPO/hips-vault:$(git rev-parse --short HEAD)

# Update ECS task definition and deploy
aws ecs update-service \
  --cluster hips-prod \
  --service hips-vault \
  --force-new-deployment \
  --desired-count 2
```

### Step 5: Verify vault health

```bash
# Wait for service to stabilize (up to 3 minutes)
aws ecs wait services-stable --cluster hips-prod --services hips-vault

# Health check
curl -X GET https://vault.internal.hips.foundation/health \
  -H "Authorization: Bearer $VAULT_API_SECRET"
# Expected: {"status": "ok", "kms": "connected", "db": "connected"}
```

### Step 6: Verify audit log integrity

```bash
# Confirm VaultAccessLog still insert-only (no update/delete permissions)
psql $VAULT_DATABASE_URL -c "
  SELECT grantee, privilege_type
  FROM information_schema.role_table_grants
  WHERE table_name = 'vault_access_log'
    AND privilege_type IN ('UPDATE', 'DELETE');
"
# Expected: 0 rows returned
```

---

## 6. Session & Safety Services Deploy

### Session Service

```bash
# Build and push
docker build -t hips-session:$(git rev-parse --short HEAD) ./services/session
docker push $ECR_REPO/hips-session:$(git rev-parse --short HEAD)

# Rolling deploy (no downtime)
aws ecs update-service \
  --cluster hips-prod \
  --service hips-session \
  --force-new-deployment

# Verify WebSocket health
curl https://session.internal.hips.foundation/health
# Expected: {"status": "ok", "websocket": "ready", "webrtc": "ready"}
```

### Safety Engine

```bash
# Build and push
docker build -t hips-safety:$(git rev-parse --short HEAD) ./services/safety
docker push $ECR_REPO/hips-safety:$(git rev-parse --short HEAD)

# Rolling deploy
aws ecs update-service \
  --cluster hips-prod \
  --service hips-safety \
  --force-new-deployment

# Verify
curl https://safety.internal.hips.foundation/health
# Expected: {"status": "ok", "flagQueue": "connected"}
```

---

## 7. Hotfix Deploy

Use when a critical bug or security issue is found in production and cannot wait for the next sprint.

### Step 1: Create hotfix branch from main

```bash
git checkout main
git pull origin main
git checkout -b fix/describe-the-issue
```

### Step 2: Implement fix

- Scope: smallest possible change that resolves the issue
- Do not bundle unrelated changes into a hotfix
- Tests must pass

### Step 3: Expedited review

- Assign to on-call engineer for immediate review
- For security hotfixes: senior engineer must review regardless of time
- Minimum: one approval + passing CI

### Step 4: Merge and deploy

```bash
# Merge to main via PR (still required — no direct pushes)
# Vercel auto-deploys on merge
```

### Step 5: Post-hotfix

- Write a brief incident summary in #engineering within 24 hours
- Schedule a retro if the bug was related to auth, payments, identity vault, or session separation

---

## 8. Rollback Procedures

### Frontend Rollback (Vercel — fastest)

```bash
# Option A: Via Vercel Dashboard
# Go to: Vercel → Project → Deployments
# Find the last known-good deployment → click "..." → "Promote to Production"
# Takes ~30 seconds

# Option B: Via Vercel CLI
vercel rollback [deployment-url]
```

### API/Backend Rollback (via Git revert)

```bash
# Identify the last good commit
git log --oneline -10

# Revert the bad commit(s)
git revert <bad-commit-hash>
# This creates a new commit — CI runs, then Vercel deploys
```

### Database Rollback

```bash
# 1. Restore from backup (if data was corrupted)
psql $PROD_DATABASE_URL < backups/commerce_YYYYMMDD_HHMMSS.sql

# 2. Reverse migration (if schema was changed)
psql $PROD_DATABASE_URL -f packages/db/prisma/migrations/<name>/down.sql

# 3. Mark migration as rolled back in Prisma
DATABASE_URL=$PROD_DATABASE_URL \
  pnpm --filter @hips/db exec prisma migrate resolve \
  --rolled-back <migration_name> \
  --schema=./prisma/commerce.prisma
```

### Container Service Rollback (session/vault/safety)

```bash
# Roll back to previous task definition revision
aws ecs update-service \
  --cluster hips-prod \
  --service hips-session \
  --task-definition hips-session:<previous-revision-number>
```

---

## 9. Environment Promotion (Staging → Production)

Use when you want to promote a specific staging build to production without going through the normal PR/merge flow (rare — use only for pre-validated releases).

```bash
# Identify staging deployment URL from Vercel
# Promote via CLI
vercel promote [staging-deployment-url] --scope hips-foundation

# Then run DB migrations if needed (see Section 4)
# Then run post-deploy verification (see Section 11)
```

---

## 10. Stripe Configuration

### Webhook Registration

The Stripe webhook endpoint must be registered in the Stripe Dashboard for each environment:

| Environment | Endpoint URL | Events |
|---|---|---|
| Staging | https://staging.hips.foundation/api/v1/webhooks/stripe | All four events below |
| Production | https://hips.foundation/api/v1/webhooks/stripe | All four events below |

**Required events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.deleted`
- `invoice.paid`

### Rotating the Webhook Secret

```bash
# 1. Generate new signing secret in Stripe Dashboard
# 2. Update STRIPE_WEBHOOK_SECRET in Vercel project settings
# 3. Redeploy (Vercel picks up new env var on next deploy)
# 4. Verify: send a test webhook from Stripe Dashboard
#    Expected: 200 OK response
```

### Switching Test → Live Keys

Do this only once, during initial production go-live.

```bash
# 1. In Vercel production environment settings:
#    - Replace STRIPE_SECRET_KEY: sk_test_... → sk_live_...
#    - Replace NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_... → pk_live_...
#    - Replace STRIPE_WEBHOOK_SECRET with live webhook secret
# 2. Register new production webhook endpoint in Stripe Dashboard (live mode)
# 3. Redeploy
# 4. Process a $1 test transaction and verify receipt email is received
# 5. Refund the test transaction
```

---

## 11. Post-Deploy Verification

Run after every production deploy. All checks must pass before closing the deploy.

### Smoke Tests

```bash
# Health check — web app
curl -I https://hips.foundation
# Expected: HTTP/2 200

# API health
curl https://hips.foundation/api/v1/health
# Expected: {"status": "ok"}

# Session service health (internal)
curl https://session.internal.hips.foundation/health
# Expected: {"status": "ok", "websocket": "ready"}

# Vault service health (internal)
curl -H "Authorization: Bearer $VAULT_API_SECRET" \
  https://vault.internal.hips.foundation/health
# Expected: {"status": "ok", "kms": "connected"}
```

### Functional Checks

| Check | How | Expected |
|---|---|---|
| Homepage loads | Browser → https://hips.foundation | Loads in < 3s; disclaimer visible |
| Service catalog loads | Browser → /services | All service cards render |
| Sign-in works | Browser → /sign-in → test account | Redirects to /dashboard |
| Availability endpoint | GET /api/v1/sessions/availability | Returns available slots |
| Stripe checkout renders | Browser → /checkout (test account) | Stripe Elements load without errors |
| Donation page loads | Browser → /donate | All 4 donation tiers visible |
| Admin dashboard loads | Browser → /admin (admin account) | KPI cards render |
| Safety queue loads | Browser → /admin/safety | Escalation queue renders (empty is fine) |

### Monitoring

- Check Sentry: https://sentry.io — confirm no new error spike in last 10 minutes
- Check uptime monitor: Better Uptime dashboard — all services green
- Check Vercel function logs: no 5xx errors in last 5 minutes

---

## 12. Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|---|---|---|---|
| P0 — Critical | Identity Vault breach or data linkage between session and identity | Immediate | Vault DB exposed; session-identity join discovered |
| P1 — High | Payments down; auth completely broken; crisis protocol fails | 15 minutes | Stripe webhooks not processing; Firebase outage |
| P2 — Medium | Feature degraded but platform operational | 1 hour | Scholarship emails not sending; group sessions failing |
| P3 — Low | Minor UI bug; non-critical email failure | Next business day | Wrong price displayed; email formatting broken |

### P0 — Identity Vault Breach Response

```
1. IMMEDIATELY take vault service offline
   aws ecs update-service --cluster hips-prod --service hips-vault --desired-count 0

2. IMMEDIATELY notify:
   - Founder
   - Legal counsel
   - Senior engineer on call

3. Preserve all logs — do not delete, rotate, or modify any logs

4. Identify scope: review VaultAccessLog for unauthorized access patterns

5. Engage HIPAA-capable cloud provider incident response team

6. Do NOT communicate externally until legal counsel advises

7. Document everything with timestamps from this point forward
```

### P1 — Payments Down

```
1. Confirm Stripe status: https://status.stripe.com
   - If Stripe incident: communicate ETA to ops; no action needed on our end

2. If Stripe is healthy — check webhook endpoint:
   curl -X POST https://hips.foundation/api/v1/webhooks/stripe \
     -H "Content-Type: application/json" -d '{}'
   # Expected: 400 (signature failure) — confirms endpoint is reachable

3. Check STRIPE_WEBHOOK_SECRET in Vercel matches current Stripe webhook signing secret

4. Check Sentry for webhook handler errors

5. Replay failed webhook events from Stripe Dashboard if needed
```

### P1 — Auth Broken

```
1. Check Firebase status: https://status.Firebase.com
   - If Firebase incident: communicate ETA; no action

2. Check Firebase Dashboard for error logs

3. Verify NEXT_PUBLIC_Firebase_PUBLISHABLE_KEY and Firebase_SECRET_KEY in Vercel env

4. If env vars are correct and Firebase is healthy — check middleware.ts for recent changes
   git log --oneline apps/web/middleware.ts

5. Rollback if needed (see Section 8)
```

---

## 13. Scheduled Maintenance

### Daily (Automated)
- [ ] IP address expiry job runs (vault service) — removes IPs older than 30 days
- [ ] Session reminder emails sent (24-hour advance notice)
- [ ] Package expiry warning emails sent (at 75% expiry window)

### Weekly (Manual Check)
- [ ] Review Sentry error trends — file tickets for P2/P3 items
- [ ] Review uptime monitor report
- [ ] Review Stripe webhook delivery success rate in Stripe Dashboard
- [ ] Review scholarship budget usage vs. monthly cap (admin panel → /admin/revenue)

### Monthly
- [ ] Rotate VAULT_API_SECRET and SESSION_SERVICE_SECRET
- [ ] Review VaultAccessLog for any unexpected access patterns
- [ ] Confirm database backups are restorable (test restore to staging)
- [ ] Review device fingerprint expiry job ran correctly
- [ ] Confirm KMS key rotation schedule is on track
- [ ] Review Stripe payout schedule and reconcile with admin revenue report

### Quarterly
- [ ] Full penetration test — Identity Vault + session separation
- [ ] Review all service dependencies for security updates
- [ ] Legal review of UI copy for any therapy/clinical language drift
- [ ] Disaster recovery drill — restore production DB from backup to staging
- [ ] Review and update this runbook for accuracy

---

## 14. Access & Credentials

> **Store all credentials in your organization's password manager or secret manager. Never in email, Slack, or documents.**

| Resource | Access Method | Who Has Access |
|---|---|---|
| Vercel (frontend deploy) | Vercel Dashboard + CLI | Tech lead, senior engineers |
| Railway (commerce/session DB) | Railway Dashboard + CLI | Tech lead, DBA |
| HIPAA cloud console | Cloud provider console + MFA | Tech lead, infrastructure lead |
| Stripe Dashboard | stripe.com + MFA | Tech lead, ops lead, founder |
| Firebase Dashboard | Firebase.com + MFA | Tech lead |
| Supabase Dashboard | supabase.com + MFA | Tech lead |
| Resend Dashboard | resend.com + MFA | Tech lead |
| GitHub repository | github.com + MFA + SSO | All engineers |
| Sentry | sentry.io | All engineers |
| Identity Vault API | VAULT_API_SECRET (rotated monthly) | Session service only (internal) |

### Offboarding Checklist

When an engineer leaves the team:

- [ ] Remove from GitHub organization
- [ ] Revoke Vercel access
- [ ] Revoke Railway access
- [ ] Revoke HIPAA cloud console access
- [ ] Rotate VAULT_API_SECRET and SESSION_SERVICE_SECRET
- [ ] Remove from Sentry organization
- [ ] Revoke Stripe Dashboard access if applicable
- [ ] Audit VaultAccessLog for any access in last 90 days by departing engineer
