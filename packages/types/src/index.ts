// Shared TypeScript types for H.I.P.S. Platform

// ============================================================
// ENUMS
// ============================================================

export enum UserRole {
  PARTICIPANT = "PARTICIPANT",
  LEADER = "LEADER",
  ORG_BUYER = "ORG_BUYER",
  FACILITATOR = "FACILITATOR",
  ADMIN = "ADMIN",
}

export enum SessionStatus {
  PENDING = "PENDING",      // Prisma commerce schema
  CONFIRMED = "CONFIRMED",  // Prisma commerce schema
  COMPLETED = "COMPLETED",  // Prisma commerce schema
  CANCELLED = "CANCELLED",  // Prisma commerce schema
  NO_SHOW = "NO_SHOW",      // Prisma commerce schema
}

export enum ServiceCategory {
  CARE_SESSION = "CARE_SESSION",   // Prisma commerce schema
  COACHING = "COACHING",           // Prisma commerce schema
  COHORT = "COHORT",               // Prisma commerce schema
  WORKSHOP = "WORKSHOP",           // Prisma commerce schema
  RETREAT = "RETREAT",             // Prisma commerce schema
  DIGITAL = "DIGITAL",             // Prisma commerce schema
  MEMBERSHIP = "MEMBERSHIP",       // Prisma commerce schema
}

export enum ScholarshipStatus {
  PENDING = "PENDING",      // Prisma commerce schema
  APPROVED = "APPROVED",   // Prisma commerce schema
  DENIED = "DENIED",       // Prisma commerce schema
  EXPIRED = "EXPIRED",     // Prisma commerce schema
  WAITLISTED = "WAITLISTED", // Prisma commerce schema
}

export enum InquiryStatus {
  NEW = "NEW",             // Prisma commerce schema
  QUOTED = "QUOTED",       // Prisma commerce schema
  DEPOSIT_PAID = "DEPOSIT_PAID", // Prisma commerce schema
  CONFIRMED = "CONFIRMED",  // Prisma commerce schema
  COMPLETED = "COMPLETED",  // Prisma commerce schema
  CANCELLED = "CANCELLED", // Prisma commerce schema
}

export enum DonationTier {
  SPONSOR_SESSION = "SPONSOR_SESSION",   // Prisma commerce schema - $50 sponsor
  RESTORE_SESSION = "RESTORE_SESSION",  // Prisma commerce schema - $100 restore
  RESTORE_LEADER = "RESTORE_LEADER",     // Prisma commerce schema - $500 leader
  CUSTOM = "CUSTOM",                    // Prisma commerce schema
}

export enum LiveSessionStatus {
  LOBBY = "LOBBY",           // services/session/prisma/session.prisma
  ACTIVE = "ACTIVE",        // services/session/prisma/session.prisma
  ENDED = "ENDED",          // services/session/prisma/session.prisma
  ABANDONED = "ABANDONED",  // services/session/prisma/session.prisma
  // Note: packages/db/prisma/session.prisma has additional statuses:
  // CRISIS_FLAGGED, RECONNECTING — used by commerce session layer only
}

// ============================================================
// COMMERCE DB TYPES
// ============================================================

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  standardPrice: number;
  scholarshipMin: number;
  scholarshipMax: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  participantId: string;
  facilitatorId: string;
  serviceId: string;
  packageId: string | null;
  status: SessionStatus;
  scheduledAt: Date;
  sessionTokenRef: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Package {
  id: string;
  participantId: string;
  serviceId: string;
  totalSessions: number;
  usedSessions: number;
  purchasedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  applicantId: string;
  reviewedBy: string | null;
  status: ScholarshipStatus;
  discountCode: string | null;
  appliedAmount: number;
  approvedAmount: number | null;
  appliedAt: Date;
  reviewedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  tier: DonationTier;
  stripePaymentId: string;
  receiptSent: boolean;
  donatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgInquiry {
  id: string;
  contactName: string;
  contactEmail: string;
  organizationName: string;
  ein: string | null;
  isNonprofit: boolean;
  headcount: number | null;
  eventType: string | null;
  preferredDate: Date | null;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// SESSION DB TYPES
// ============================================================

export interface SessionRecord {
  id: string;
  anonSessionToken: string;
  serviceType: ServiceCategory;
  moderatorAnonId: string | null;
  status: LiveSessionStatus;
  scheduledAt: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  participantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupSessionRecord {
  id: string;
  roomId: string;
  moderatorAnonId: string | null;
  sessionToken: string;
  status: LiveSessionStatus;
  maxParticipants: number;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditEvent {
  id: string;
  eventType: string;
  sessionId: string;
  actorAnonId: string | null;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// ============================================================
// VAULT DB TYPES
// ============================================================

export interface IdentityRecord {
  id: string;
  encryptedEmail: string;
  encryptedName: string;
  encryptedPhone: string;
  encryptedIpAddress: string;
  encryptedDeviceFingerprint: string;
  ipExpiresAt: Date;
  fingerprintExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultAccessLog {
  id: string;
  requesterId: string;
  vaultRecordId: string;
  justification: string;
  accessedAt: Date;
}

// ============================================================
// API RESPONSE TYPES (from api.ts)
// ============================================================
export type { PaginatedResponse } from './api'

// ============================================================
// ZOD SCHEMAS (for validation)
// ============================================================

export const UserRoleSchema = {
  PARTICPANT: UserRole.PARTICIPANT,
  LEADER: UserRole.LEADER,
  ORG_BUYER: UserRole.ORG_BUYER,
  FACILITATOR: UserRole.FACILITATOR,
  ADMIN: UserRole.ADMIN,
} as const;

// Re-export from api.ts for convenience
export type { ApiResponse } from './api'
export type { CheckoutDonationInput } from './api'
export { makeResponse, makeError, ErrorCodes } from './api'
export {
  BookSessionSchema,
  SessionAvailabilitySchema,
  CompleteSessionSchema,
  PurchasePackageSchema,
  ApplyScholarshipSchema,
  ReviewScholarshipSchema,
  CheckoutSessionSchema,
  CheckoutDonationSchema,
  OrgInquirySchema,
} from './api'

// Re-export session types for cross-service use
export {
  SessionFlagPayloadSchema,
  SessionServiceFlagType,
  SafetyServiceFlagType,
  toSafetyFlagType,
} from './session'

// Re-export crisis alert channels from copy-policy
export type { CrisisAlertChannel } from './copy-policy'
export { CRISIS_ALERT_CHANNELS } from './copy-policy'
export const CRISIS_RESOURCES = {
  national: {
    label: '988 Suicide & Crisis Lifeline',
    display: '988',
  },
  text: {
    label: 'Crisis Text Line',
    display: 'Text HOME to 741741',
  },
} as const

// Re-export Firebase auth types
export type { FirebaseUser, AuthState, SignInFn, SignUpFn, SignOutFn } from './auth'
