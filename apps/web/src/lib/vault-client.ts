/**
 * Vault Service Client
 *
 * Provides a typed client for communicating with the Vault microservice.
 * The Vault service stores encrypted PII that must only be accessed with
 * proper justification (required for audit logging).
 */

const VAULT_API_URL = process.env.VAULT_API_URL ?? 'http://localhost:3001'
const VAULT_API_SECRET = process.env.VAULT_API_SECRET ?? ''

const REQUEST_TIMEOUT_MS = 10_000

function getTimeoutSignal(): AbortSignal {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS)
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-vault-secret': VAULT_API_SECRET,
  }
}

async function vaultFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!VAULT_API_SECRET) {
    throw new Error('VAULT_API_SECRET environment variable is not set')
  }

  const response = await fetch(`${VAULT_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
    signal: getTimeoutSignal(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vault API error ${response.status}: ${error}`)
  }

  return response.json()
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VaultAccessLog {
  id: string
  requesterId: string
  vaultRecordId: string
  justification: string
  accessedAt: string
}

export interface CreateVaultRecordInput {
  email?: string
  name?: string
  phone?: string
  ipAddress: string
  deviceFingerprint: string
}

export interface CreateVaultRecordResponse {
  token: string
  createdAt: string
}

export interface VaultRecord {
  token: string
  email?: string
  name?: string
  phone?: string
  createdAt: string
}

export interface EmergencyVaultRecord {
  token: string
  // Minimal PII for crisis response - phone number only
  phone?: string
  crisisResources: CrisisResources
}

export interface CrisisResources {
  hotline: string
  hotlineLabel: string
  crisisTextLine: string
  crisisTextLineLabel: string
  emergencyServices: string
  emergencyServicesLabel: string
  additionalResources: Array<{
    name: string
    url: string
    description: string
  }>
}

export interface AccessLogQuery {
  page?: number
  pageSize?: number
}

export interface AccessLogResponse {
  logs: VaultAccessLog[]
  meta: {
    page: number
    pageSize: number
    totalCount: number
  }
}

// ─── Client Functions ─────────────────────────────────────────────────────────

/**
 * Create a new identity record in the vault.
 * Used during session entry to store encrypted PII.
 */
export async function createVaultRecord(
  input: CreateVaultRecordInput,
): Promise<CreateVaultRecordResponse> {
  return vaultFetch<CreateVaultRecordResponse>('/vault/v1/record', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/**
 * Retrieve identity record - REQUIRES justification.
 * Used ONLY for crisis protocol by human reviewers.
 * All access is logged for audit purposes.
 */
export async function getVaultRecord(
  token: string,
  justification: string,
  requesterId: string,
): Promise<VaultRecord> {
  return vaultFetch<VaultRecord>(`/vault/v1/record/${token}`, {
    method: 'GET',
    headers: {
      'x-requester-id': requesterId,
      'x-justification': justification,
    },
  })
}

/**
 * Crisis emergency endpoint - returns minimum needed PII for crisis response.
 * Phone number only, plus crisis resources.
 */
export async function getEmergencyRecord(
  token: string,
  justification: string,
  requesterId: string,
): Promise<EmergencyVaultRecord> {
  return vaultFetch<EmergencyVaultRecord>(`/vault/v1/record/${token}/emergency`, {
    method: 'GET',
    headers: {
      'x-crisis-justification': justification,
      'x-requester-id': requesterId,
    },
  })
}

/**
 * Log vault access for audit purposes.
 * Called automatically when accessing records, but can be logged manually.
 */
export async function logVaultAccess(input: {
  requesterId: string
  vaultRecordId: string
  justification: string
}): Promise<{ id: string; createdAt: string }> {
  return vaultFetch<{ id: string; createdAt: string }>('/vault/v1/access-log', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

/**
 * Query vault access log (admin only).
 * Returns paginated access logs without raw PII.
 */
export async function getVaultAccessLog(
  adminId: string,
  query: AccessLogQuery = {},
): Promise<AccessLogResponse> {
  const searchParams = new URLSearchParams({
    page: String(query.page ?? 1),
    pageSize: String(query.pageSize ?? 20),
  })
  return vaultFetch<AccessLogResponse>(`/vault/v1/access-log?${searchParams}`, {
    method: 'GET',
    headers: { 'x-admin-id': adminId },
  })
}
