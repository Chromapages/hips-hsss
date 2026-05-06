import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { VaultService } from "./vault.service";
import { VaultAccessGuard } from "./vault-access.guard";

@Controller("vault/v1")
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  /**
   * Crisis emergency endpoint — returns minimum needed PII for crisis response.
   * Internal auth via VaultAccessGuard (x-vault-secret header).
   */
  @Get("record/:token/emergency")
  @UseGuards(VaultAccessGuard)
  async getEmergencyRecord(
    @Param("token") token: string,
    @Body() body: { justification: string },
  ) {
    return this.vaultService.getEmergencyRecord(token, body.justification);
  }

  /**
   * Create a new identity record (used during session entry).
   * Internal service calls only — protected by VaultAccessGuard.
   */
  @Post("record")
  @UseGuards(VaultAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRecord(
    @Body()
    body: {
      email?: string;
      name?: string;
      phone?: string;
      ipAddress: string;
      deviceFingerprint: string;
    },
  ) {
    return this.vaultService.createRecord({
      email: body.email,
      name: body.name,
      phone: body.phone,
      ipAddress: body.ipAddress,
      deviceFingerprint: body.deviceFingerprint,
    });
  }

  /**
   * Retrieve identity record — REQUIRES justification.
   * Used ONLY for crisis protocol by human reviewers.
   */
  @Get("record/:token")
  @UseGuards(VaultAccessGuard)
  async getRecord(
    @Param("token") token: string,
    @Body() body: { justification: string },
  ) {
    return this.vaultService.getRecord(token, body.justification);
  }

  /**
   * Log vault access (automatic on every getRecord call).
   */
  @Post("access-log")
  @UseGuards(VaultAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async logAccess(
    @Body()
    body: {
      requesterId: string;
      vaultRecordId: string;
      justification: string;
    },
  ) {
    return this.vaultService.logAccess({
      requesterId: body.requesterId,
      vaultRecordId: body.vaultRecordId,
      justification: body.justification,
    });
  }

  /**
   * Admin: query vault access log (paginated, no raw PII returned).
   */
  @Get("access-log")
  @UseGuards(VaultAccessGuard)
  async getAccessLog(
    @Headers("x-admin-id") adminId: string,
    @Body() body: { page?: number; pageSize?: number },
  ) {
    if (!adminId) throw new UnauthorizedException();
    return this.vaultService.getAccessLog({
      page: body.page ?? 1,
      pageSize: body.pageSize ?? 20,
    });
  }
}
