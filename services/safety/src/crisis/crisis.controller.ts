import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CrisisService } from './crisis.service'
import { CrisisTriggerInputSchema } from '../common/schemas'
import { makeResponse, makeError } from '../common/response'

@Controller('v1')
export class CrisisController {
  constructor(private readonly crisisService: CrisisService) {}

  /**
   * POST /safety/v1/crisis/:id
   * Crisis protocol trigger — human-initiated only.
   * FACILITATOR or ADMIN role required.
   * All vault accesses are logged to CrisisEvent (immutable).
   */
  @Post('crisis/:id')
  @HttpCode(HttpStatus.CREATED)
  async trigger(
    @Param('id') sessionId: string,
    @Body() body: unknown,
    @Headers('x-safety-engine-secret') secret: string,
  ) {
    // Authenticate via safety engine secret
    if (!process.env.SAFETY_ENGINE_SECRET || secret !== process.env.SAFETY_ENGINE_SECRET) {
      throw new UnauthorizedException('Invalid safety engine secret')
    }

    // Validate input
    const parsed = CrisisTriggerInputSchema.safeParse(body)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message)
    }

    const input = { ...parsed.data, sessionId }

    // Check role (already validated in service, but double-check here for guard)
    if (!['FACILITATOR', 'ADMIN'].includes(input.requesterRole)) {
      throw new ForbiddenException('Only FACILITATOR or ADMIN can trigger crisis protocol')
    }

    const result = await this.crisisService.trigger(input)

    if (result && 'error' in result) {
      // Error response from service
      return result
    }

    return makeResponse(result)
  }
}
