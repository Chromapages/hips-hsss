// Validation schemas for Safety Engine — Zod

import { z } from 'zod'

// ─── Flag Input ──────────────────────────────────────────────────────────────

export const FlagInputSchema = z.object({
  sessionId: z.string().min(1),
  flagType: z.enum(['KEYWORD_MATCH', 'COUNSELOR_FLAG', 'REPEATED_DISTRESS']),
  timestamp: z.string().datetime(),
  counselorId: z.string().min(1),
  notes: z.string().max(2000).optional(),
  transcriptSnippet: z.string().max(5000).optional(), // only for KEYWORD_MATCH with consent
})

export type FlagInput = z.infer<typeof FlagInputSchema>

// ─── Crisis Trigger Input ────────────────────────────────────────────────────

export const CrisisTriggerInputSchema = z.object({
  sessionId: z.string().min(1),
  requesterId: z.string().min(1),
  requesterRole: z.enum(['FACILITATOR', 'ADMIN']),
  justification: z.string().min(10),
})

export type CrisisTriggerInput = z.infer<typeof CrisisTriggerInputSchema>

// ─── Resolve Escalation Input ────────────────────────────────────────────────

export const ResolveEscalationInputSchema = z.object({
  resolutionNote: z.string().min(10),
})

export type ResolveEscalationInput = z.infer<typeof ResolveEscalationInputSchema>

// ─── Queue Filter ─────────────────────────────────────────────────────────────

export const QueueFilterSchema = z.object({
  status: z.enum(['SOFT_ALERT', 'ESCALATION_REVIEW', 'CRISIS_ACTIVE', 'RESOLVED']).optional(),
  flagType: z.enum(['KEYWORD_MATCH', 'COUNSELOR_FLAG', 'REPEATED_DISTRESS']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
})

export type QueueFilter = z.infer<typeof QueueFilterSchema>

// ─── Error Codes ─────────────────────────────────────────────────────────────

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  ESCALATION_NOT_FOUND: 'ESCALATION_NOT_FOUND',
  ALREADY_RESOLVED: 'ALREADY_RESOLVED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const