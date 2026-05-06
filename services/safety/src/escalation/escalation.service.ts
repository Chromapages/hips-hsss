import { Injectable } from '@nestjs/common'
import { PrismaClient, EscalationStatus } from '../prisma'
import { QueueFilter, ResolveEscalationInput } from '../common/schemas'
import { makeResponse, makeError } from '../common/response'
import { AUTO_ESCALATION_SEVERITY_THRESHOLD } from '@hips/copy-policy'

const prisma = new PrismaClient()

interface EscalationRecord {
  id: string
  sessionId: string
  flagType: string
  status: string
  severity: number
  notes: string | null
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
  resolvedBy: string | null
  resolutionNote: string | null
}

interface QueueResult {
  items: EscalationRecord[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

@Injectable()
export class EscalationService {
  /**
   * Get paginated escalation queue.
   * Sorted: CRISIS_ACTIVE first, then by createdAt descending.
   */
  async getQueue(filter: QueueFilter): Promise<QueueResult> {
    const where: Record<string, any> = {}

    if (filter.status) {
      where.status = filter.status as EscalationStatus
    }
    if (filter.flagType) {
      where.flagType = filter.flagType as any
    }
    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {}
      if (filter.dateFrom) where.createdAt.gte = new Date(filter.dateFrom)
      if (filter.dateTo) where.createdAt.lte = new Date(filter.dateTo)
    }

    const [items, totalCount] = await Promise.all([
      prisma.escalation.findMany({
        where,
        orderBy: [
          { status: 'asc' }, // CRISIS_ACTIVE = 2 comes before SOFT_ALERT = 0
          { createdAt: 'desc' },
        ],
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      prisma.escalation.count({ where }),
    ])

    return {
      items,
      totalCount,
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(totalCount / filter.pageSize),
    }
  }

  /**
   * Resolve an escalation (Admin only).
   */
  async resolve(id: string, input: ResolveEscalationInput, requesterId: string) {
    const existing = await prisma.escalation.findUnique({ where: { id } })

    if (!existing) {
      return makeError('ESCALATION_NOT_FOUND', `Escalation ${id} not found`)
    }

    if (existing.status === 'RESOLVED') {
      return makeError('ALREADY_RESOLVED', 'This escalation has already been resolved')
    }

    const updated = await prisma.escalation.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolvedBy: requesterId,
        resolutionNote: input.resolutionNote,
      },
    })

    return makeResponse({
      escalationId: updated.id,
      resolvedAt: updated.resolvedAt?.toISOString(),
    })
  }

  /**
   * Create a new escalation (called by flag module).
   */
  async createEscalation(data: {
    sessionId: string
    flagType: string
    severity?: number
    notes?: string
  }) {
    const status =
      (data.severity ?? 0) >= AUTO_ESCALATION_SEVERITY_THRESHOLD
        ? 'ESCALATION_REVIEW'
        : 'SOFT_ALERT'

    const escalation = await prisma.escalation.create({
      data: {
        sessionId: data.sessionId,
        flagType: data.flagType as any,
        status,
        severity: data.severity ?? 0,
        notes: data.notes,
      },
    })

    return escalation
  }

  /**
   * Update escalation status (e.g., promote to CRISIS_ACTIVE).
   */
  async updateStatus(id: string, status: EscalationStatus) {
    return prisma.escalation.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * Get a single escalation by ID.
   */
  async getById(id: string) {
    return prisma.escalation.findUnique({ where: { id } })
  }

  /**
   * Count unresolved escalations with severity higher than given threshold.
   * Used for queue position estimation.
   */
  async countHigherSeverity(minSeverity: number): Promise<number> {
    return prisma.escalation.count({
      where: {
        status: { not: 'RESOLVED' },
        severity: { gt: minSeverity },
      },
    })
  }

  /**
   * Get escalation by session ID (used by crisis service to promote to CRISIS_ACTIVE).
   */
  async getBySessionId(sessionId: string) {
    return prisma.escalation.findFirst({
      where: { sessionId, status: { not: 'RESOLVED' } },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Log an alert to AlertLog table.
   */
  async logAlert(data: {
    escalationId?: string
    crisisEventId?: string
    channel: string
    recipient: string
    payload: unknown
    status: string
  }) {
    return prisma.alertLog.create({ data: data as any })
  }
}