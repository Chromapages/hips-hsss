# Migration Notes

Prisma migration files should be generated from the three schema files with
separate database URLs:

```bash
DATABASE_URL=... pnpm prisma migrate dev --schema packages/db/prisma/commerce.prisma
SESSION_DATABASE_URL=... pnpm prisma migrate dev --schema packages/db/prisma/session.prisma
VAULT_DATABASE_URL=... pnpm prisma migrate dev --schema packages/db/prisma/vault.prisma
```

Down migrations must drop objects in dependency order:

1. Commerce: `Session`, `Package`, `Scholarship`, `Donation`, `OrgInquiry`,
   `Service`, then `User`, followed by enums.
2. Session: `AuditEvent`, `GroupSessionRecord`, `SessionRecord`, followed by
   enums.
3. Vault: `VaultAccessLog`, `IdentityRecord`, followed by enums.

Permission hardening required after deploy:

```sql
REVOKE UPDATE, DELETE ON TABLE "AuditEvent" FROM session_api_user;
REVOKE UPDATE, DELETE ON TABLE "VaultAccessLog" FROM vault_api_user;
GRANT INSERT ON TABLE "VaultAccessLog" TO vault_audit_user;
```
