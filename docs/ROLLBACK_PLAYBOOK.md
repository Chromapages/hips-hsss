# Rollback Playbook

This document covers rollback procedures for high-risk changes: database migrations, auth/payment flows, and service configuration.

---

## Database Migrations

### Before Any Migration

1. **Backup the target database** before applying any migration:
   ```bash
   # Commerce DB
   pg_dump $DATABASE_URL > backup_commerce_$(date +%Y%m%d_%H%M%S).sql

   # Session DB
   pg_dump $SESSION_DATABASE_URL > backup_session_$(date +%Y%m%d_%H%M%S).sql

   # Safety DB
   pg_dump $SAFETY_DATABASE_URL > backup_safety_$(date +%Y%m%d_%H%M%S).sql

   # Vault DB
   pg_dump $VAULT_DATABASE_URL > backup_vault_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Document the previous migration ID**:
   ```bash
   prisma migrate status --schema packages/db/prisma/commerce.prisma
   ```

### Rolling Back a Bad Migration

**Prisma migrate** does not support automatic rollback. Use the following procedure:

1. **Identify the last known-good migration**:
   ```bash
   ls packages/db/prisma/migrations/
   ```

2. **Reset to the previous migration** (destructive — only for development/staging):
   ```bash
   # For the affected service DB only
   prisma migrate reset --schema packages/db/prisma/<service>.prisma
   ```

3. **For production**: restore from the backup taken before the migration:
   ```bash
   psql $DATABASE_URL < backup_commerce_<timestamp>.sql
   ```

4. **Re-deploy the previous version** of the service to match the old schema:
   ```bash
   git log --oneline -10  # find previous stable commit
   git checkout <known-good-commit-hash>
   pnpm build && pnpm --filter @hips/<service> deploy
   ```

### Cross-Domain Migration Incident

If a migration for one domain accidentally drops tables from another domain (e.g., session migration drops commerce tables):

1. **Immediately restore from backup** for the affected database(s).
2. **Quarantine the bad migration file**:
   ```bash
   mv packages/db/prisma/migrations/<bad_migration> \
      packages/db/prisma/migrations/quarantine_<bad_migration>_CROSS_DOMAIN_DROP
   ```
3. **Do not delete** the bad migration — move it to quarantine so it is not reapplied.
4. **Run domain-specific migration plan** to create clean migrations for each service.
5. **Verify data separation**:
   ```bash
   pnpm separation
   pnpm test:phase9
   ```

---

## Auth / Custom Claims Changes

### If Auth Sync Breaks User Login

**Symptom**: Users cannot log in after `auth/sync` route change.

1. **Identify the breaking change** — check if the issue is in `apps/web/src/app/api/auth/sync/route.ts`:
   ```bash
   git diff HEAD~1 apps/web/src/app/api/auth/sync/route.ts
   ```

2. **Roll back the route**:
   ```bash
   git checkout HEAD~1 -- apps/web/src/app/api/auth/sync/route.ts
   git commit -m "revert: rollback auth sync route"
   ```

3. **Redeploy**:
   ```bash
   pnpm --filter @hips/web build
   # Vercel deploy or pm2 restart
   ```

4. **If Firebase custom claims are corrupted**, manually reset user claims:
   ```bash
   # Using Firebase Admin SDK — requires Firebase project access
   admin.auth().setCustomUserClaims(uid, { role: 'PARTICIPANT' })
   ```

### If Firestore Role Rules Break Writes

**Symptom**: Users cannot update their profile or other fields after `firestore.rules` change.

1. **Restore the previous rules**:
   ```bash
   git checkout HEAD~1 -- apps/web/firestore.rules
   firebase deploy --only firestore:rules
   ```

2. **Verify access is restored** before continuing.

---

## Payment / Stripe Changes

### If Package Purchase Flow Breaks

**Symptom**: Users are charged but not receiving package credits, or packages are granted without payment.

1. **Check Stripe Dashboard** for the affected payment intents — note the `payment_intent_id` and `status`.

2. **Review the webhook handler** at `apps/web/src/app/api/stripe/webhook/route.ts`:
   ```bash
   git diff HEAD~1 apps/web/src/app/api/stripe/webhook/route.ts
   ```

3. **Revert the webhook handler** if payment verification was removed:
   ```bash
   git checkout HEAD~1 -- apps/web/src/app/api/stripe/webhook/route.ts
   ```

4. **Manually fulfill** any affected packages:
   ```sql
   -- Find unfulfilled purchases from Stripe
   -- Cross-reference with Stripe payment intent status
   -- Manually insert Package records for paid-but-unfulfilled purchases
   ```

5. **Redeploy and notify** affected users.

### Stripe Webhook Raw Body Issue

If `request.text()` has already been called and breaks Stripe signature verification:

1. **Revert the webhook route** to the last known working version.
2. **Ensure raw body is captured before parsing**:
   ```typescript
   // Webhook must use: req.text() for raw body, BEFORE any JSON parsing
   const rawBody = await req.text();
   ```

---

## LiveKit / Session Token Issues

### If Users Cannot Join Sessions

**Symptom**: Valid users get 403 from `/api/livekit/token`.

1. **Check room naming normalization** — ensure room names follow `session-{id}` format:
   ```bash
   git diff HEAD~1 services/session/src/livekit-token-service.ts
   ```

2. **Check session membership logic** — ensure `isSessionMember` check is not rejecting valid members:
   ```bash
   git diff HEAD~1 apps/web/src/app/api/livekit/token/route.ts
   ```

3. **Roll back token service** if room naming changed:
   ```bash
   git checkout HEAD~1 -- services/session/src/livekit-token-service.ts
   ```

4. **Redeploy session service**:
   ```bash
   pm2 restart hips-session
   ```

---

## Prisma Client Drift

**Symptom**: Build fails with `Property 'xxx' does not exist on type ...` after schema change.

1. **Regenerate Prisma clients**:
   ```bash
   pnpm --filter @hips/db prisma generate
   ```

2. **If clients are stale in CI**, add to CI pipeline:
   ```bash
   pnpm prisma:freshness  # check if stale
   ```

3. **Verify freshness**:
   ```bash
   pnpm prisma:freshness
   ```

---

## Quick Rollback Checklist

For any production incident after a deployment:

- [ ] Identify the changed file(s) via `git log`
- [ ] Take a DB backup before rolling back (if DB was changed)
- [ ] `git checkout HEAD~1 -- <file>` for each changed file
- [ ] Rebuild: `pnpm build`
- [ ] Redeploy affected service(s)
- [ ] Verify access/payment/session is restored
- [ ] Notify affected users if data was corrupted
- [ ] Document the incident and root cause

---

## Emergency Contacts

| Service | Escalation |
|---------|-----------|
| Stripe payment issues | Stripe Support + dashboard |
| Firebase auth issues | Firebase Support |
| Database corruption | DBA on-call |
| Security incident | security@hips-support.org |
