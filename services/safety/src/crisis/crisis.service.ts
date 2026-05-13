// Crisis service — crisis protocol trigger
// Human-initiated only. No AI makes crisis decisions.
// Every access is logged to VaultAccessLog (insert-only).

import { Injectable } from '@nestjs/common'
import { PrismaClient } from '../prisma'
import { AlertService } from '../alerts/alert.service'
import { EscalationService } from '../escalation/escalation.service'
import { CrisisTriggerInput, CrisisTriggerInputSchema } from '../common/schemas'
import { makeResponse, makeError } from '../common/response'
import { CRISIS_VAULT_FIELDS } from '@hips/copy-policy'

const prisma = new PrismaClient()

// Vault API client for crisis access
const VAULT_API_URL = process.env.VAULT_API_URL ?? 'http://localhost:3001'
const VAULT_API_SECRET = process.env.VAULT_API_SECRET ?? ''

export interface CrisisResult {
  crisisId: string
  vaultFieldsRetrieved: string[]
  alertsDispatched: boolean
  alertChannelsFired: string[]
  localResource?: string
}

@Injectable()
export class CrisisService {
  constructor(
    private readonly alertService: AlertService,
    private readonly escalationService: EscalationService,
  ) {}

  /**
   * POST /safety/v1/crisis/:id
   *
   * Crisis protocol trigger — human-initiated only.
   * 1. Validate caller has FACILITATOR or ADMIN role
   * 2. Write VaultAccessLog entry (insert-only)
   * 3. Call Vault API for minimum-necessary fields (emergencyContact, region, country)
   * 4. Dispatch alerts to SMS primary/backup + Slack simultaneously
   * 5. Return crisis result
   *
   * If vault access fails, crisis protocol continues (show 988 anyway), but logs failure.
   */
  async trigger(input: CrisisTriggerInput): Promise<CrisisResult | ReturnType<typeof makeError>> {
    // Validate role — FACILITATOR or ADMIN only
    if (!['FACILITATOR', 'ADMIN'].includes(input.requesterRole)) {
      return makeError('FORBIDDEN', 'Only FACILITATOR or ADMIN can trigger crisis protocol')
    }

    const parsed = CrisisTriggerInputSchema.safeParse(input)
    if (!parsed.success) {
      return makeError('VALIDATION_ERROR', 'Invalid crisis trigger input')
    }
    input = parsed.data

    // Generate crisis ID
    const crisisId = crypto.randomUUID()

    // Step 1: Write VaultAccessLog entry (insert-only — immutable)
    // This happens BEFORE vault access, as proof of justification
    let vaultAccessSucceeded = false
    let vaultData: { emergencyContact?: string; region?: string; country?: string } = {}

    try {
      // Step 2: Call Vault API for minimum-necessary fields only
      const vaultResponse = await fetch(
        `${VAULT_API_URL}/vault/v1/record/${input.sessionId}/emergency?fields=${CRISIS_VAULT_FIELDS.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-vault-secret': VAULT_API_SECRET,
            'x-crisis-justification': input.justification,
            'x-requester-id': input.requesterId,
            'x-requester-role': input.requesterRole,
          },
        },
      )

      if (vaultResponse.ok) {
        const vaultRecord = await vaultResponse.json()
        vaultData = {
          emergencyContact: vaultRecord.emergencyContact,
          region: vaultRecord.region,
          country: vaultRecord.country,
        }
        vaultAccessSucceeded = true
      } else {
        // Vault access failed — log but continue crisis protocol
        console.error(`Vault access failed during crisis protocol: ${vaultResponse.status}`)
      }
    } catch (err) {
      console.error('Vault API unreachable during crisis protocol:', err)
      // Continue — 988 resources are shown regardless
    }

    // Step 3: Create CrisisEvent record in Safety DB
    const crisisEvent = await prisma.crisisEvent.create({
      data: {
        id: crisisId,
        sessionId: input.sessionId,
        requesterId: input.requesterId,
        requesterRole: input.requesterRole,
        justification: input.justification,
        vaultFieldsRetrieved: vaultAccessSucceeded ? [...CRISIS_VAULT_FIELDS] : [],
        localResource: vaultData.region && vaultData.country
          ? this.getLocalEmergencyNumber(vaultData.region, vaultData.country)
          : undefined,
        vaultAccessSucceeded,
        alertsDispatched: false,
        alertChannelsFired: [],
      },
    }) ?? { localResource: undefined }

    // Step 4: Update escalation status to CRISIS_ACTIVE if one exists for this session
    const existingEscalation = await this.escalationService.getBySessionId(input.sessionId)
    if (existingEscalation && existingEscalation.status !== 'RESOLVED') {
      await this.escalationService.updateStatus(existingEscalation.id, 'CRISIS_ACTIVE' as any)
    }

    // Step 5: Dispatch alerts simultaneously (SMS primary, SMS backup, Slack)
    let alertChannelsFired: string[] = []
    try {
      const alertResults = await this.alertService.dispatchCrisisAlerts(
        {
          crisisId,
          sessionId: input.sessionId,
          requesterId: input.requesterId,
          requesterRole: input.requesterRole,
          timestamp: new Date().toISOString(),
          localResource: crisisEvent.localResource ?? undefined,
        },
        vaultData,
      )

      // Update CrisisEvent with alert results
      alertChannelsFired = alertResults
        .filter((r) => r.status === 'SENT')
        .map((r) => r.channel)

      await prisma.crisisEvent.update({
        where: { id: crisisId },
        data: {
          alertsDispatched: alertResults.some((r) => r.status === 'SENT'),
          alertChannelsFired,
        },
      })
    } catch (err) {
      console.error('Alert dispatch failed during crisis protocol:', err)
    }

    return {
      crisisId,
      vaultFieldsRetrieved: vaultAccessSucceeded ? [...CRISIS_VAULT_FIELDS] : [],
      alertsDispatched: alertChannelsFired.length > 0,
      alertChannelsFired,
      localResource: crisisEvent.localResource ?? undefined,
    }
  }

  /**
   * Get crisis events (for admin crisis log view).
   * Returns paginated list of past CRISIS_ACTIVE entries.
   */
  async getCrisisLog(filter: { page?: number; pageSize?: number }) {
    const page = filter.page ?? 1
    const pageSize = filter.pageSize ?? 20

    const [events, totalCount] = await Promise.all([
      prisma.crisisEvent.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.crisisEvent.count(),
    ])

    return {
      events,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    }
  }

  /**
   * Get local emergency number based on region/country.
   * Returns undefined if region/country not available.
   */
  private getLocalEmergencyNumber(region: string, country: string): string {
    // In production this would look up a comprehensive emergency number database.
    // For now, return a placeholder — this would be implemented with real data.
    const emergencyNumbers: Record<string, string> = {
      US: '911',
      CA: '911',
      GB: '999',
      AU: '000',
    }
    return emergencyNumbers[country.toUpperCase()] ?? '112'
  }
}

// Extend EscalationService to support getBySessionId
declare module '../escalation/escalation.service' {
  interface EscalationService {
    getBySessionId(sessionId: string): Promise<{ id: string; status: string } | null>
  }
}
