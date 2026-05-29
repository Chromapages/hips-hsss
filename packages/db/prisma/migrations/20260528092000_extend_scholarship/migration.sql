/*
  Warnings:

  - You are about to drop the column `note` on the `Scholarship` table. All the data in the column will be lost.
  - You are about to drop the `AuditEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EscalationQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupSessionRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdentityRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafetyAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafetyAuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafetyMitigation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafetyStrike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VaultAccessLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keyword_rule` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('employed', 'unemployed', 'student', 'disabled');

-- DropForeignKey
ALTER TABLE "EscalationQueue" DROP CONSTRAINT "EscalationQueue_alertId_fkey";

-- DropForeignKey
ALTER TABLE "SafetyMitigation" DROP CONSTRAINT "SafetyMitigation_alertId_fkey";

-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "note",
ADD COLUMN     "consentAcknowledged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "employmentStatus" "EmploymentStatus",
ADD COLUMN     "incomeRange" TEXT,
ADD COLUMN     "personalStatement" TEXT,
ADD COLUMN     "referralSource" TEXT,
ADD COLUMN     "serviceType" TEXT;

-- DropTable
DROP TABLE "AuditEvent";

-- DropTable
DROP TABLE "EscalationQueue";

-- DropTable
DROP TABLE "GroupSessionRecord";

-- DropTable
DROP TABLE "IdentityRecord";

-- DropTable
DROP TABLE "SafetyAlert";

-- DropTable
DROP TABLE "SafetyAuditLog";

-- DropTable
DROP TABLE "SafetyMitigation";

-- DropTable
DROP TABLE "SafetyStrike";

-- DropTable
DROP TABLE "SessionRecord";

-- DropTable
DROP TABLE "VaultAccessLog";

-- DropTable
DROP TABLE "keyword_rule";

-- DropEnum
DROP TYPE "AuditEventType";

-- DropEnum
DROP TYPE "EscalationLevel";

-- DropEnum
DROP TYPE "EscalationSource";

-- DropEnum
DROP TYPE "EscalationStatus";

-- DropEnum
DROP TYPE "LiveSessionStatus";

-- DropEnum
DROP TYPE "MitigationAction";

-- DropEnum
DROP TYPE "SafetyCategory";

-- DropEnum
DROP TYPE "SafetySeverity";

-- DropEnum
DROP TYPE "VaultAccessPurpose";
