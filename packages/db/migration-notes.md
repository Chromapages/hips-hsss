# Migration Notes

Prisma migration files should be generated from the four schema files with
separate database URLs:

```bash
DATABASE_URL=...          pnpm prisma migrate dev --schema packages/db/prisma/commerce.prisma
SESSION_DATABASE_URL=...  pnpm prisma migrate dev --schema packages/db/prisma/session.prisma
VAULT_DATABASE_URL=...    pnpm prisma migrate dev --schema packages/db/prisma/vault.prisma
SAFETY_DATABASE_URL=...   pnpm prisma migrate dev --schema packages/db/prisma/safety.prisma
```

Applied migrations (per DB, oldest first):

- commerce: `20260526141715_init_commerce`, `20260528092000_extend_scholarship`
- session:  `20260526141727_init_session`
- vault:    `20260528000001_init_vault`
- safety:   `20260528000002_init_safety`

`extend_scholarship` is a hybrid: it adds columns to `Scholarship` in commerce
AND drops/recreates the session, vault, and safety schemas. Apply it with the
same care as an init when rolling back.

Down migrations must drop objects in dependency order:

1. Commerce: `Session`, `Package`, `Scholarship`, `Donation`, `OrgInquiry`,
   `Service`, then `User`, followed by enums (`UserRole`, `ServiceCategory`,
   `SessionStatus`, `ScholarshipStatus`, `DonationTier`, `InquiryStatus`).
2. Session: `AuditEvent`, `GroupSessionRecord`, `SessionRecord`, followed by
   enums (`LiveSessionStatus`, `AuditEventType`).
3. Vault: `VaultAccessLog`, `IdentityRecord`, followed by enums
   (`VaultAccessPurpose`).
4. Safety: `SafetyMitigation` and `EscalationQueue` (both FK to `SafetyAlert`),
   then `SafetyAlert`, `KeywordRule`, `SafetyStrike`, `SafetyAuditLog`,
   followed by enums (`SafetySeverity`, `SafetyCategory`, `MitigationAction`,
   `EscalationLevel`, `EscalationSource`, `EscalationStatus`).

Permission hardening required after deploy — run the canonical script at
`scripts/data-separation-harden.sql`. The script is idempotent and applies
six layers per database:

1. Cluster-level: SCRAM-SHA-256 password hashing + SSL (run once per cluster).
2. Role creation: distinct `<db>_api_user` and `<db>_audit_user` per database
   with bounded connection limits, wrapped in DO blocks so re-runs are safe.
3. Per-role settings: `statement_timeout`, `idle_in_transaction_session_timeout`,
   `lock_timeout`, locked `search_path = public, pg_catalog`, `row_security = on`.
4. Default privileges: revoke PUBLIC on future tables/sequences in the public
   schema so model drift can't reopen the door.
5. Per-DB grants: explicit least-privilege matching actual service usage
   (verified against `services/safety/src` and `services/session/src`):
   - Session: `AuditEvent` is INSERT-only for api, SELECT-only for audit.
     `SessionRecord` and `GroupSessionRecord` are full CRUD.
   - Vault: `VaultAccessLog` is INSERT-only for api, SELECT-only for audit.
     `IdentityRecord` is full CRUD for api, SELECT-only for audit
     (PII is encrypted at the application layer).
   - Safety: `SafetyAuditLog` is INSERT-only for api, SELECT-only for audit.
     `SafetyMitigation` is INSERT-only (immutable). `SafetyAlert`,
     `SafetyStrike`, `EscalationQueue`, and `KeywordRule` allow SELECT +
     INSERT + UPDATE; DELETE stays admin-only on every one of them.
6. Row-level security: commented out by default — ready to enable after
   verifying table ownership is held by a separate migrator role, not the
   service users.

Commerce DB is intentionally out of scope for this script; it holds orders
and receipts, not PII (auth lives in Firebase). If commerce hardening is
needed later, model it on the per-DB section pattern.
