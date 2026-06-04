-- AlterEnum
CREATE TYPE "OrgInquiryEventType" AS ENUM ('WORKSHOP', 'RECURRING', 'CONSULTANCY');

-- DropIndex
DROP INDEX IF EXISTS "OrgInquiry_email_key";

-- AlterTable
ALTER TABLE "OrgInquiry" ADD COLUMN     "eventType" "OrgInquiryEventType" NOT NULL DEFAULT 'WORKSHOP',
ADD COLUMN     "headcount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isNonprofit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredEnd" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "preferredStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ein" TEXT;

-- CreateIndex
CREATE INDEX "OrgInquiry_email_idx" ON "OrgInquiry"("email");

-- CreateIndex
CREATE INDEX "OrgInquiry_eventType_idx" ON "OrgInquiry"("eventType");
