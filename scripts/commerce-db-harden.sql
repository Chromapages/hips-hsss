-- Commerce DB Permission Hardening
-- Execute AFTER prisma migrate deploy against commerce database

-- Role notes:
-- commerce_api_user = the user the NestJS commerce API connects as
-- commerce_audit_user = system/ops role for read-only audit access

-- AuditEvent (if added to commerce DB in future): INSERT-only enforcement
-- REVOKE UPDATE, DELETE ON TABLE "AuditEvent" FROM commerce_api_user;

-- User soft-delete: no hard delete ever
-- All models use @default(db.Uuid()) and soft delete (@@index([deletedAt])) -- no action needed

-- OrgInquiry: public-facing insert-only, admin read/update
-- GRANT SELECT, UPDATE ON TABLE "OrgInquiry" TO commerce_api_user;
