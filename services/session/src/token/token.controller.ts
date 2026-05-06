import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenService } from './token.service';
import {
  CreateSessionTokenSchema,
  ApiResponse,
  SessionTokenResponse,
  CreateSessionTokenInput,
} from '../common/dto/session.dto';
import { SessionSecretGuard } from '../common/guards';

@Controller('session/v1')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async createToken(
    @Body() input: CreateSessionTokenInput,
  ): Promise<ApiResponse<SessionTokenResponse>> {
    const result = await this.tokenService.createSessionToken(input);

    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }
}