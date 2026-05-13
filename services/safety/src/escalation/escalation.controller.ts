import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { EscalationService } from './escalation.service'
import { QueueFilterSchema, ResolveEscalationInputSchema } from '../common/schemas'
import { makeResponse, makeError } from '../common/response'

@Controller('v1')
export class EscalationController {
  constructor(private readonly escalationService: EscalationService) {}

  /**
   * GET /safety/v1/queue
   * Admin/Facilitator only — paginated escalation queue.
   * Sorted: CRISIS_ACTIVE first, then by createdAt descending.
   */
  @Get('queue')
  async getQueue(
    @Query() query: unknown,
    @Headers('x-safety-secret') secret: string,
  ) {
    if (!process.env.SAFETY_ENGINE_SECRET || secret !== process.env.SAFETY_ENGINE_SECRET) {
      throw new UnauthorizedException('Invalid safety engine secret')
    }

    const parsed = QueueFilterSchema.safeParse(query)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message)
    }

    const result = await this.escalationService.getQueue(parsed.data)

    return makeResponse({
      items: result.items.map((item) => ({
        id: item.id,
        sessionId: item.sessionId,
        flagType: item.flagType,
        status: item.status,
        severity: item.severity,
        notes: item.notes,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        resolvedAt: item.resolvedAt?.toISOString() ?? null,
        resolvedBy: item.resolvedBy,
        resolutionNote: item.resolutionNote,
      })),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
      },
    })
  }

  /**
   * PATCH /safety/v1/:id/resolve
   * Admin only — resolve an escalation with a note.
   */
  @Patch(':id/resolve')
  async resolve(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('x-safety-secret') secret: string,
    @Headers('x-requester-id') requesterId: string,
  ) {
    if (!process.env.SAFETY_ENGINE_SECRET || secret !== process.env.SAFETY_ENGINE_SECRET) {
      throw new UnauthorizedException('Invalid safety engine secret')
    }

    if (!requesterId) {
      throw new UnauthorizedException('Missing requester ID')
    }

    const parsed = ResolveEscalationInputSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message)
    }

    const result = await this.escalationService.resolve(id, parsed.data, requesterId)

    if (result.error) {
      return result // Returns error shape
    }

    return makeResponse(result.data)
  }

  /**
   * GET /safety/v1/:id
   * Get single escalation details (admin/facilitator).
   */
  @Get(':id')
  async getById(@Param('id') id: string, @Headers('x-safety-secret') secret: string) {
    if (!process.env.SAFETY_ENGINE_SECRET || secret !== process.env.SAFETY_ENGINE_SECRET) {
      throw new UnauthorizedException('Invalid safety engine secret')
    }

    const escalation = await this.escalationService.getById(id)
    if (!escalation) {
      return makeError('ESCALATION_NOT_FOUND', `Escalation ${id} not found`)
    }

    return makeResponse({
      id: escalation.id,
      sessionId: escalation.sessionId,
      flagType: escalation.flagType,
      status: escalation.status,
      severity: escalation.severity,
      notes: escalation.notes,
      createdAt: escalation.createdAt.toISOString(),
      updatedAt: escalation.updatedAt.toISOString(),
      resolvedAt: escalation.resolvedAt?.toISOString() ?? null,
      resolvedBy: escalation.resolvedBy,
      resolutionNote: escalation.resolutionNote,
    })
  }
}
