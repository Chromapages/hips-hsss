import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  NotFoundException,
  HttpCode,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Roles, UserRole, RolesGuard } from '../auth/roles.guard.js';
import { PrismaService } from '../prisma.service.js';
import { z } from 'zod';

const FacilitatorFlagSchema = z.object({
  sessionId: z.string().uuid({ message: 'sessionId must be a UUID' }),
  reason: z.string().min(1, 'reason is required').max(1000),
});

interface AuthRequest extends Request {
  userUid?: string;
  userRole?: UserRole;
}

@Controller('api/facilitator')
export class FacilitatorFlagController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * POST /api/facilitator/sessions/:id/flag
   *
   * Facilitator-only endpoint. Flags a session for review without exposing
   * participant identity. Creates a FACILITATOR_FLAG AuditEvent in the
   * session database (Phase 6.3 — Dep: 6.1 scaffold).
   */
  @Post('sessions/:id/flag')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async flagSession(
    @Param('id') sessionId: string,
    @Body() body: unknown,
    @Req() req: AuthRequest,
  ): Promise<{ flagged: boolean; auditEventId: string }> {
    // ── Auth check ───────────────────────────────────────────
    const userId = req.userUid;
    if (!userId) throw new Error('RolesGuard did not attach authenticated user');

    // ── Input validation ─────────────────────────────────────
    const parsed = FacilitatorFlagSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors);
    }

    const { reason } = parsed.data;

    // ── Session existence check ──────────────────────────────
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // ── AuditEvent — FACILITATOR_FLAG ─────────────────────
    // subjectId is session-only. No participant identity stored. This is
    // the core anonymity guarantee the architecture provides.
    const auditEventId = `fac_flag_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    await this.prisma.auditEvent.create({
      data: {
        id: auditEventId,
        eventType: 'SAFETY_FLAGGED',
        subjectId: sessionId,
        metadata: {
          reason,
          reporterUid: userId,
          flaggedAt: new Date().toISOString(),
        },
      },
    });

    return { flagged: true, auditEventId };
  }

}
