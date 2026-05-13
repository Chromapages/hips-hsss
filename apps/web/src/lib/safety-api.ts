// Safety Engine API client (Next.js server-side + client-side)
const SAFETY_API_URL = process.env.SAFETY_ENGINE_URL ?? 'http://localhost:3002'
const SAFETY_ENGINE_SECRET = process.env.SAFETY_ENGINE_SECRET ?? ''

// Timeout for fetch requests (10 seconds)
const REQUEST_TIMEOUT_MS = 10_000

function getTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS)
}

function validateSecret(): void {
  if (!SAFETY_ENGINE_SECRET) {
    throw new Error('SAFETY_ENGINE_SECRET environment variable is not set. Safety engine API calls are disabled.')
  }
}

function safetyHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-safety-engine-secret': SAFETY_ENGINE_SECRET,
  }
}

function makeRequestId() {
  return crypto.randomUUID()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type EscalationStatus = 'SOFT_ALERT' | 'ESCALATION_REVIEW' | 'CRISIS_ACTIVE' | 'RESOLVED'
export type FlagType = 'KEYWORD_MATCH' | 'COUNSELOR_FLAG' | 'REPEATED_DISTRESS'

export interface EscalationItem {
  id: string
  sessionId: string
  flagType: FlagType
  status: EscalationStatus
  severity: number
  notes: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  resolvedBy: string | null
  resolutionNote: string | null
}

export interface CrisisEventItem {
  id: string
  sessionId: string
  requesterId: string
  requesterRole: string
  justification: string
  vaultFieldsRetrieved: string[]
  localResource: string | null
  vaultAccessSucceeded: boolean
  alertsDispatched: boolean
  alertChannelsFired: string[]
  createdAt: string
}

export interface QueueFilter {
  status?: EscalationStatus
  flagType?: FlagType
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface QueueResponse {
  items: EscalationItem[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export interface CrisisLogResponse {
  events: CrisisEventItem[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getEscalationQueue(filter: QueueFilter = {}): Promise<QueueResponse> {
  validateSecret()
  const params = new URLSearchParams()
  if (filter.status) params.set('status', filter.status)
  if (filter.flagType) params.set('flagType', filter.flagType)
  if (filter.dateFrom) params.set('dateFrom', filter.dateFrom)
  if (filter.dateTo) params.set('dateTo', filter.dateTo)
  params.set('page', String(filter.page ?? 1))
  params.set('pageSize', String(filter.pageSize ?? 20))

  const res = await fetch(
    `${SAFETY_API_URL}/safety/v1/queue?${params.toString()}`,
    { headers: safetyHeaders(), cache: 'no-store', signal: getTimeoutSignal() }
  )

  if (!res.ok) throw new Error(`Failed to fetch escalation queue: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function getEscalationById(id: string): Promise<EscalationItem> {
  validateSecret()
  const res = await fetch(
    `${SAFETY_API_URL}/safety/v1/${id}`,
    { headers: safetyHeaders(), cache: 'no-store', signal: getTimeoutSignal() }
  )
  if (!res.ok) throw new Error(`Failed to fetch escalation ${id}: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function resolveEscalation(
  id: string,
  resolutionNote: string,
  requesterId: string
): Promise<{ escalationId: string; resolvedAt: string }> {
  validateSecret()
  const res = await fetch(
    `${SAFETY_API_URL}/safety/v1/${id}/resolve`,
    {
      method: 'PATCH',
      headers: {
        ...safetyHeaders(),
        'x-requester-id': requesterId,
      },
      body: JSON.stringify({ resolutionNote }),
      signal: getTimeoutSignal(),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(err.error?.message ?? `Failed to resolve escalation: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function getCrisisLog(filter: { page?: number; pageSize?: number } = {}): Promise<CrisisLogResponse> {
  validateSecret()
  const params = new URLSearchParams()
  params.set('page', String(filter.page ?? 1))
  params.set('pageSize', String(filter.pageSize ?? 20))

  const res = await fetch(
    `${SAFETY_API_URL}/safety/v1/crisis-log?${params.toString()}`,
    { headers: safetyHeaders(), cache: 'no-store', signal: getTimeoutSignal() }
  )
  if (!res.ok) throw new Error(`Failed to fetch crisis log: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function triggerCrisisProtocol(
  sessionId: string,
  requesterId: string,
  requesterRole: 'FACILITATOR' | 'ADMIN',
  justification: string
): Promise<{ crisisId: string; vaultFieldsRetrieved: string[]; alertsDispatched: boolean }> {
  validateSecret()
  const res = await fetch(
    `${SAFETY_API_URL}/safety/v1/crisis/${sessionId}`,
    {
      method: 'POST',
      headers: safetyHeaders(),
      body: JSON.stringify({ requesterId, requesterRole, justification }),
      signal: getTimeoutSignal(),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(err.error?.message ?? `Failed to trigger crisis protocol: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}