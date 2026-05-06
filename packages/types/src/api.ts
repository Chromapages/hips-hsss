import { z } from 'zod'

// ─── Enums ─────────────────────────────────────────────────────────────────

export const UserRole = z.enum([
  'PARTICIPANT',
  'LEADER',
  'ORGBUYER',
  'FACILITATOR',
  'ADMIN',
])
export type UserRole = z.infer<typeof UserRole>

export const ServiceCategory = z.enum([
  'CARE_SESSION',
  'COACHING',
  'COHORT',
  'WORKSHOP',
  'RETREAT',
  'DIGITAL_PRODUCT',
  'MEMBERSHIP',
])
export type ServiceCategory = z.infer<typeof ServiceCategory>

export const SessionStatus = z.enum([
  'PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
])
export type SessionStatus = z.infer<typeof SessionStatus>

export const ScholarshipStatus = z.enum([
  'PENDING',
  'APPROVED',
  'DENIED',
  'EXPIRED',
])
export type ScholarshipStatus = z.infer<typeof ScholarshipStatus>

export const DonationTier = z.enum([
  'SPONSOR_SESSION',
  'RESTORE_SESSION',
  'RESTORE_LEADER',
  'CUSTOM',
])
export type DonationTier = z.infer<typeof DonationTier>

// ─── Standard Response ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: {
    code: string
    message: string
  } | null
  meta: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  error: null
  meta: {
    timestamp: string
    requestId: string
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

function makeResponse<T>(data: T, requestId: string): ApiResponse<T> {
  return {
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}

function makeError(code: string, message: string, requestId: string): ApiResponse<null> {
  return {
    data: null,
    error: { code, message },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}

export { makeResponse, makeError }

// ─── Session Schemas ─────────────────────────────────────────────────────────

export const BookSessionSchema = z.object({
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime({ offset: true }),
  facilitatorId: z.string().uuid().optional(),
  packageId: z.string().uuid().optional(),
  discountCode: z.string().max(50).optional(),
})

export type BookSessionInput = z.infer<typeof BookSessionSchema>

export const SessionAvailabilitySchema = z.object({
  serviceId: z.string().uuid(),
  startDate: z.string().datetime().transform(d => d.split('T')[0]),
  endDate: z.string().datetime().transform(d => d.split('T')[0]),
  facilitatorId: z.string().uuid().optional(),
})

export type SessionAvailabilityInput = z.infer<typeof SessionAvailabilitySchema>

export const CompleteSessionSchema = z.object({
  notes: z.string().max(5000).optional(),
})

export type CompleteSessionInput = z.infer<typeof CompleteSessionSchema>

// ─── Package Schemas ─────────────────────────────────────────────────────────

export const PurchasePackageSchema = z.object({
  serviceId: z.string().uuid(),
  stripePaymentId: z.string(),
  isScholarship: z.boolean().default(false),
  discountCode: z.string().max(50).optional(),
})

export type PurchasePackageInput = z.infer<typeof PurchasePackageSchema>

// ─── Scholarship Schemas ──────────────────────────────────────────────────────

export const ApplyScholarshipSchema = z.object({
  serviceId: z.string().uuid(),
  requestedAmount: z.number().int().positive(),
  reason: z.string().max(1000),
})

export type ApplyScholarshipInput = z.infer<typeof ApplyScholarshipSchema>

export const ReviewScholarshipSchema = z.object({
  status: z.enum(['APPROVED', 'DENIED']),
  approvedAmount: z.number().int().positive().optional(),
  reviewNote: z.string().max(2000).optional(),
})

export type ReviewScholarshipInput = z.infer<typeof ReviewScholarshipSchema>

// ─── Checkout Schemas ────────────────────────────────────────────────────────

export const CheckoutSessionSchema = z.object({
  serviceId: z.string().uuid(),
  discountCode: z.string().max(50).optional(),
  packageTier: z.enum(['4_SESSION', '8_SESSION']).optional(),
})

export type CheckoutSessionInput = z.infer<typeof CheckoutSessionSchema>

export const CheckoutDonationSchema = z.object({
  amount: z.number().int().min(100), // min $1.00 in cents
  tier: DonationTier,
  email: z.string().email(),
  userId: z.string().optional(),
})

export type CheckoutDonationInput = z.infer<typeof CheckoutDonationSchema>

// ─── Org Inquiry Schema ──────────────────────────────────────────────────────

export const OrgInquirySchema = z.object({
  orgName: z.string().max(200),
  contactEmail: z.string().email(),
  ein: z.string().max(20).optional(),
  isNonprofit: z.boolean(),
  eventType: z.enum(['WORKSHOP', 'HALF_DAY', 'FULL_DAY', 'RETREAT', 'SPEAKING']),
  preferredDate: z.string().datetime().optional(),
  headcount: z.number().int().min(1).max(1000).optional(),
  notes: z.string().max(2000).optional(),
})

export type OrgInquiryInput = z.infer<typeof OrgInquirySchema>

// ─── Error Codes ─────────────────────────────────────────────────────────────

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SLOT_UNAVAILABLE: 'SLOT_UNAVAILABLE',
  PACKAGE_EXPIRED: 'PACKAGE_EXPIRED',
  PACKAGE_EXHAUSTED: 'PACKAGE_EXHAUSTED',
  DISCOUNT_CODE_INVALID: 'DISCOUNT_CODE_INVALID',
  DISCOUNT_CODE_WRONG_SERVICE: 'DISCOUNT_CODE_WRONG_SERVICE',
  SCHOLARSHIP_CAP_REACHED: 'SCHOLARSHIP_CAP_REACHED',
  AMOUNT_OUT_OF_RANGE: 'AMOUNT_OUT_OF_RANGE',
  INVALID_SERVICE_CATEGORY: 'INVALID_SERVICE_CATEGORY',
  DUPLICATE_PAYMENT: 'DUPLICATE_PAYMENT',
  DUPLICATE_APPLICATION: 'DUPLICATE_APPLICATION',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
  SERVICE_INACTIVE: 'SERVICE_INACTIVE',
  SCHOLARSHIP_NOT_FOUND: 'SCHOLARSHIP_NOT_FOUND',
  ALREADY_REVIEWED: 'ALREADY_REVIEWED',
  APPROVED_AMOUNT_REQUIRED: 'APPROVED_AMOUNT_REQUIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_ALREADY_COMPLETED: 'SESSION_ALREADY_COMPLETED',
  SESSION_CANCELLED: 'SESSION_CANCELLED',
  SESSION_HOURS_BLOCKED: 'SESSION_HOURS_BLOCKED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]
