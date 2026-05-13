import { z } from 'zod'

const schema = z.object({
  SESSION_HOURS_START: z.string().default('08:00'),
  SESSION_HOURS_END: z.string().default('21:00'),
  SESSION_HOURS_TIMEZONE: z
    .enum([
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Denver',
      'America/Phoenix',
      'America/Anchorage',
      'Pacific/Honolulu',
    ])
    .default('America/New_York'),
  SCHOLARSHIP_MONTHLY_BUDGET_CAP: z.coerce.number().default(50000),
  CRISIS_ESCALATION_SLA_MINUTES: z.coerce.number().default(15),
  SIGNED_URL_EXPIRY_SECONDS: z.coerce.number().default(86400),
})

export const config = schema.parse(process.env)

export type Config = z.infer<typeof schema>

export const SESSION_HOURS_START = config.SESSION_HOURS_START
export const SESSION_HOURS_END = config.SESSION_HOURS_END
export const SESSION_HOURS_TIMEZONE = config.SESSION_HOURS_TIMEZONE
export const SCHOLARSHIP_MONTHLY_BUDGET_CAP = config.SCHOLARSHIP_MONTHLY_BUDGET_CAP
export const CRISIS_ESCALATION_SLA_MINUTES = config.CRISIS_ESCALATION_SLA_MINUTES
export const SIGNED_URL_EXPIRY_SECONDS = config.SIGNED_URL_EXPIRY_SECONDS
