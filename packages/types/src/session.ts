import { z } from 'zod'

export const SessionServiceFlagType = z.enum(['concern', 'crisis', 'technical', 'other'])
export type SessionServiceFlagType = z.infer<typeof SessionServiceFlagType>

export const SafetyServiceFlagType = z.enum(['KEYWORD_MATCH', 'COUNSELOR_FLAG', 'REPEATED_DISTRESS'])
export type SafetyServiceFlagType = z.infer<typeof SafetyServiceFlagType>

export const SessionFlagPayloadSchema = z.object({
  flagEventId: z.string(),
  sessionId: z.string(),
  flagType: SessionServiceFlagType,
  description: z.string().optional(),
  actorAnonId: z.string(),
  actorRole: z.string(),
})
export type SessionFlagPayload = z.infer<typeof SessionFlagPayloadSchema>

export function toSafetyFlagType(sessionFlagType: SessionServiceFlagType): SafetyServiceFlagType {
  switch (sessionFlagType) {
    case 'concern':
      return 'COUNSELOR_FLAG'
    case 'crisis':
      return 'KEYWORD_MATCH'
    case 'technical':
    case 'other':
    default:
      return 'REPEATED_DISTRESS'
  }
}
