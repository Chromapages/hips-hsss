import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { SafetyService } from "./safety.service";
import type { FlagInput, EscalationItem } from "./safety.service";
import { AdminGuard } from "./admin.guard";

@Controller("safety/v1")
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  /**
   * Receive a flag from a session service.
   * Called by the session service when a counselor triggers a safety flag.
   */
  @Post("flag")
  @HttpCode(HttpStatus.CREATED)
  async receiveFlag(@Body() body: FlagInput): Promise<{ id: string }> {
    return this.safetyService.receiveFlag(body);
  }

  /**
   * Get the escalation queue — admin only.
   */
  @Get("queue")
  @UseGuards(AdminGuard)
  async getQueue(
    @Query("page") page = 1,
    @Query("pageSize") pageSize = 20,
  ): Promise<{ items: EscalationItem[]; totalCount: number }> {
    return this.safetyService.getQueue({
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  /**
   * Resolve an escalation — admin only.
   */
  @Patch(":id/resolve")
  @UseGuards(AdminGuard)
  async resolveEscalation(
    @Param("id") id: string,
    @Body() body: { resolution: string; crisisResourcesShown: boolean },
  ) {
    return this.safetyService.resolveEscalation(id, {
      resolution: body.resolution,
      crisisResourcesShown: body.crisisResourcesShown ?? false,
    });
  }

  /**
   * Trigger crisis protocol — human-initiated only.
   * This requests limited Identity Vault access and displays crisis resources.
   */
  @Post("crisis/:sessionId")
  @UseGuards(AdminGuard)
  async triggerCrisisProtocol(
    @Param("sessionId") sessionId: string,
    @Body() body: { requesterId: string; justification: string },
  ) {
    return this.safetyService.triggerCrisisProtocol(sessionId, {
      requesterId: body.requesterId,
      justification: body.justification,
    });
  }

  /**
   * Get crisis log — admin only.
   */
  @Get("crisis-log")
  @UseGuards(AdminGuard)
  async getCrisisLog(
    @Query("page") page = 1,
    @Query("pageSize") pageSize = 50,
  ) {
    return this.safetyService.getCrisisLog({
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }
}
