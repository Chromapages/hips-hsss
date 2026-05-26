-- Session DB Permission Hardening
-- Per migration-notes.md: restrict modification on AuditEvent after deploy

-- Ensure session_api_user exists (adjust role name as needed for your deployment)
-- CREATE ROLE IF NOT EXISTS session_api_user;

-- Revoke UPDATE and DELETE on AuditEvent from session_api_user (read-only access)
REVOKE UPDATE, DELETE ON TABLE "AuditEvent" FROM session_api_user;

-- Grant SELECT only (if not already granted separately)
GRANT SELECT ON TABLE "AuditEvent" TO session_api_user;
