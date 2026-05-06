import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { FlagService } from './flag.service'
import { FlagInputSchema } from '../common/schemas'
import { makeResponse } from '../common/response'

@Controller('v1')
export class FlagController {
  constructor(private readonly flagService: FlagService) {}

  /**
   * POST /safety/v1/flag
   * Receives a flag from the Session Engine (counselor-initiated or keyword match).
   * Authenticates via SAFETY_ENGINE_SECRET header.
   */
  @Post('flag')
  @HttpCode(HttpStatus.CREATED)
  async handleFlag(
    @Body() body: unknown,
    @Headers('x-safety-engine-secret') secret: string,
  ) {
    if (secret !== process.env.SAFETY_ENGINE_SECRET) {
      throw new UnauthorizedException('Invalid safety engine secret')
    }

    const parsed = FlagInputSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message)
    }

    const result = await this.flagService.handleFlag(parsed.data)

    return makeResponse({
      flagId: result.flagId,
      queuePosition: result.queuePosition,
    })
  }
}