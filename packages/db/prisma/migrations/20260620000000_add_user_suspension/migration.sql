-- Migration: Add user suspension fields (Layer 3 / admin actions repair)
--
-- This migration is additive. Existing users will have NULL suspension
-- fields, which the application treats as "not suspended" (ACTIVE).
-- Admins can suspend/unsuspend via /api/admin/users/[id]/{suspend,unsuspend}.
--
-- The application enforces the following invariants (NOT in SQL):
--  - suspendedAt is set → status badge = SUSPENDED
--  - suspendedBy is the actor's firebaseUid (audit trail)
--  - suspensionReason is required (5-1000 chars) and is sent to the user
--    unless notifyUser=false in the API call
--  - Suspended users cannot have their role changed (the API returns 409)
--  - Suspending revokes all Firebase refresh tokens; the user is signed
--    out on their next API call

-- 1. Add suspension fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "suspendedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "suspendedBy" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "suspensionReason" TEXT;

-- 2. Index for the admin user list query (filter by suspended state)
CREATE INDEX IF NOT EXISTS "User_suspendedAt_idx" ON "User"("suspendedAt");
