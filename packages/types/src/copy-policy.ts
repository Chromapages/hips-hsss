import { z } from 'zod'

// ─── Banned Terms (used by copy linter in CI) ────────────────────────────────

export const BANNED_TERMS = [
  'therapy',
  'therapist',
  'treatment',
  'diagnosis',
  'diagnostic',
  'clinical',
  'counseling',
  'counselor',
  'psychiatric',
  'psychiatry',
  'prescription',
  'medication management',
] as const

export type BannedTerm = typeof BANNED_TERMS[number]

// ─── Approved Language ───────────────────────────────────────────────────────

export const APPROVED_TERMS: Record<string, string> = {
  therapy: 'peer support',
  therapist: 'peer support specialist',
  treatment: 'support plan',
  diagnosis: 'experience',
  clinical: 'support-based',
  counseling: 'coaching',
  counselor: 'facilitator',
}

// ─── Required Disclaimer (must appear on every service page) ────────────────

export const REQUIRED_DISCLAIMER =
  'H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed mental health treatment, medical care, or crisis intervention. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services.'

// ─── Crisis Resources ────────────────────────────────────────────────────────

export const CRISIS_RESOURCES = {
  national: {
    label: '988 Suicide & Crisis Lifeline',
    phone: '988',
    display: 'Call or text 988',
  },
  text: {
    label: 'Crisis Text Line',
    phone: '741741',
    display: 'Text HOME to 741741',
  },
} as const

// ─── Safety Engine — Keyword Detection ─────────────────────────────────────
//
// These keywords are used for counselor-initiated flagging ONLY.
// No surveillance by default — keyword match only runs when a counselor
// explicitly triggers a flag review.
//
// Keywords are lowercased before matching.

export const KEYWORD_CATEGORIES = {
  // Intentional self-harm language
  SELF_HARM: [
    'want to die',
    'kill myself',
    'end my life',
    'suicide',
    'suicidal',
    'cut myself',
    'self-harm',
    'hurt myself',
  ],

  // Violence or harm to others
  VIOLENCE: [
    'hurt someone',
    'harm someone',
    'kill them',
    'violent',
    'abuse',
    'attack',
  ],

  // Acute distress / crisis language
  DISTRESS: [
    'cannot cope',
    'overwhelming',
    'breakdown',
    'falling apart',
    'no way out',
    'hopeless',
    'worthless',
  ],

  // Child safety concerns
  CHILD_SAFETY: [
    'child abuse',
    'hurt a child',
    'minor',
  ],
} as const

export type KeywordCategory = keyof typeof KEYWORD_CATEGORIES

// Severity score per category (0-100)
export const KEYWORD_SEVERITY: Record<KeywordCategory, number> = {
  SELF_HARM: 90,
  VIOLENCE: 80,
  DISTRESS: 60,
  CHILD_SAFETY: 95,
}

// Keyword threshold for auto-escalation
export const AUTO_ESCALATION_SEVERITY_THRESHOLD = 70

// ─── Escalation Status Enum ─────────────────────────────────────────────────

export const EscalationStatus = z.enum([
  'SOFT_ALERT',
  'ESCALATION_REVIEW',
  'CRISIS_ACTIVE',
  'RESOLVED',
])
export type EscalationStatus = z.infer<typeof EscalationStatus>

// ─── Flag Type Enum ─────────────────────────────────────────────────────────

export const FlagType = z.enum([
  'KEYWORD_MATCH',
  'COUNSELOR_FLAG',
  'REPEATED_DISTRESS',
])
export type FlagType = z.infer<typeof FlagType>

// ─── Crisis Alert Channels ───────────────────────────────────────────────────

export const CRISIS_ALERT_CHANNELS = ['SMS_PRIMARY', 'SMS_BACKUP', 'SLACK'] as const
export type CrisisAlertChannel = typeof CRISIS_ALERT_CHANNELS[number]

// ─── Vault Access Fields (minimum-necessary for crisis) ─────────────────────

export const CRISIS_VAULT_FIELDS = ['emergencyContact', 'region', 'country'] as const
export type CrisisVaultField = typeof CRISIS_VAULT_FIELDS[number]

// ─── Zod Schemas for Safety Engine API ──────────────────────────────────────

export const FlagInputSchema = z.object({
  sessionId: z.string().min(1),
  flagType: FlagType,
  timestamp: z.string().datetime(),
  counselorId: z.string().min(1),
  notes: z.string().max(2000).optional(),
  transcriptSnippet: z.string().max(5000).optional(), // only used for KEYWORD_MATCH with consent
})

export type FlagInput = z.infer<typeof FlagInputSchema>

export const CrisisTriggerInputSchema = z.object({
  sessionId: z.string().min(1),
  requesterId: z.string().min(1),
  requesterRole: z.enum(['FACILITATOR', 'ADMIN']),
  justification: z.string().min(10, 'Justification must be at least 10 characters'),
})

export type CrisisTriggerInput = z.infer<typeof CrisisTriggerInputSchema>

export const ResolveEscalationInputSchema = z.object({
  resolutionNote: z.string().min(10, 'Resolution note must be at least 10 characters'),
})

export type ResolveEscalationInput = z.infer<typeof ResolveEscalationInputSchema>

export const QueueFilterSchema = z.object({
  status: EscalationStatus.optional(),
  flagType: FlagType.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
})

export type QueueFilter = z.infer<typeof QueueFilterSchema>

// ─── Helper: match keywords in text ─────────────────────────────────────────

export function matchKeywords(
  text: string,
  categories: readonly KeywordCategory[] = ['SELF_HARM', 'VIOLENCE', 'DISTRESS', 'CHILD_SAFETY'],
): { matched: KeywordCategory; keyword: string; severity: number }[] {
  const lower = text.toLowerCase()
  const results: { matched: KeywordCategory; keyword: string; severity: number }[] = []

  for (const category of categories) {
    const keywords = KEYWORD_CATEGORIES[category]
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        results.push({
          matched: category,
          keyword,
          severity: KEYWORD_SEVERITY[category],
        })
      }
    }
  }

  return results
}

// ─── Helper: check if text contains crisis-level language ───────────────────

export function isCrisisLevel(text: string): boolean {
  const matches = matchKeywords(text)
  return matches.some((m) => m.severity >= AUTO_ESCALATION_SEVERITY_THRESHOLD)
}