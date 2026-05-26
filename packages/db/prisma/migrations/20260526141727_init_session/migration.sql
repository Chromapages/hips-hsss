/*
  Warnings:

  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrgInquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scholarship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LiveSessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('TOKEN_ISSUED', 'TOKEN_VALIDATED', 'ROOM_JOINED', 'ROOM_LEFT', 'SAFETY_FLAGGED', 'SAFETY_MITIGATION', 'SESSION_ENDED');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";

-- DropForeignKey
ALTER TABLE "Scholarship" DROP CONSTRAINT "Scholarship_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_packageId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Donation";

-- DropTable
DROP TABLE "OrgInquiry";

-- DropTable
DROP TABLE "Package";

-- DropTable
DROP TABLE "Scholarship";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "DonationTier";

-- DropEnum
DROP TYPE "InquiryStatus";

-- DropEnum
DROP TYPE "ScholarshipStatus";

-- DropEnum
DROP TYPE "ServiceCategory";

-- DropEnum
DROP TYPE "SessionStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "SessionRecord" (
    "id" UUID NOT NULL,
    "sessionId" TEXT NOT NULL,
    "anonymousParticipantId" TEXT NOT NULL,
    "status" "LiveSessionStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupSessionRecord" (
    "id" UUID NOT NULL,
    "roomId" TEXT NOT NULL,
    "moderatorAnonId" TEXT NOT NULL,
    "status" "LiveSessionStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSessionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" UUID NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionRecord_sessionId_key" ON "SessionRecord"("sessionId");

-- CreateIndex
CREATE INDEX "SessionRecord_anonymousParticipantId_idx" ON "SessionRecord"("anonymousParticipantId");

-- CreateIndex
CREATE INDEX "SessionRecord_status_idx" ON "SessionRecord"("status");

-- CreateIndex
CREATE INDEX "SessionRecord_startsAt_idx" ON "SessionRecord"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "GroupSessionRecord_roomId_key" ON "GroupSessionRecord"("roomId");

-- CreateIndex
CREATE INDEX "GroupSessionRecord_moderatorAnonId_idx" ON "GroupSessionRecord"("moderatorAnonId");

-- CreateIndex
CREATE INDEX "GroupSessionRecord_status_idx" ON "GroupSessionRecord"("status");

-- CreateIndex
CREATE INDEX "AuditEvent_eventType_idx" ON "AuditEvent"("eventType");

-- CreateIndex
CREATE INDEX "AuditEvent_subjectId_idx" ON "AuditEvent"("subjectId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");
