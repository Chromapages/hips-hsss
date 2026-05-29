import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EscalationQueueService } from './escalation.service.js';
import { AdminAuthGuard, Roles, AdminRole } from '../auth/admin-auth.guard.js';
import {
  EscalationQueueQuerySchema,
  EscalateAlertSchema,
  ResolveAlertSchema,
} from './escalation.schemas.js';

interface AuthenticatedRequest extends Request {
  userUid?: string;
  userRole?: AdminRole;
  adminEmail?: string;
}

@Controller('admin/escalation')
@UseGuards(AdminAuthGuard)
export class EscalationQueueController {
  constructor(private escalationQueueService: EscalationQueueService) {}

  /**
   * GET /admin/escalation/queue
   * Get escalation queue with hidden identities.
   * Admin only endpoint.
   */
  @Get('queue')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async getEscalationQueue(@Query() query: unknown) {
    const result = EscalationQueueQuerySchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    return this.escalationQueueService.getEscalationQueue(result.data);
  }

  /**
   * GET /admin/escalation/alerts/:id
   * Get single alert details for admin review.
   * Identity remains hidden.
   */
  @Get('alerts/:id')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async getAlertDetails(@Param('id') id: string) {
    return this.escalationQueueService.getAlertDetails(id);
  }

  /**
   * POST /admin/escalation/alerts/:id/escalate
   * Escalate alert to crisis protocol.
   * Creates AuditEvent in session database.
   */
  @Post('alerts/:id/escalate')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async escalateAlert(
    @Param('id') alertId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const parsedBody = EscalateAlertSchema.safeParse({ ...(body as object), alertId });
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.errors);
    }

    return this.escalationQueueService.escalateAlert(
      parsedBody.data,
      req.userUid || 'unknown',
      req.adminEmail || 'unknown',
    );
  }

  /**
   * PATCH /admin/escalation/alerts/:id/resolve
   * Resolve an alert with admin notes.
   */
  @Patch('alerts/:id/resolve')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async resolveAlert(
    @Param('id') alertId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    const parsedBody = ResolveAlertSchema.safeParse({ ...(body as object), alertId });
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.errors);
    }

    return this.escalationQueueService.resolveAlert(
      parsedBody.data,
      req.userUid || 'unknown',
    );
  }

  /**
   * GET /admin/escalation/audit-logs
   * Get audit logs for admin review.
   */
  @Get('audit-logs')
  @Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
  async getAuditLogs(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    return this.escalationQueueService.getAuditLogs(parsedLimit);
  }
}
