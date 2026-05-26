import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import { getAdminAuth } from '../firebase-init.js';
import { SessionTokenService } from './session-token.service.js';

interface IssueTokenBody {
  sessionId: string;
}

interface IssueTokenResponse {
  token: string;
}

@Controller('sessions')
export class SessionTokenController {
  constructor(private readonly sessionTokenService: SessionTokenService) {}

  @Post('token')
  @HttpCode(200)
  async issueToken(
    @Body() body: IssueTokenBody,
    @Req() req: Request,
  ): Promise<IssueTokenResponse> {
    const authHeader = (req.headers as Record<string, string | undefined>)['authorization'];
    const idToken = authHeader?.replace(/^Bearer\s+/i, '');

    if (!idToken) {
      throw new UnauthorizedException('Missing Firebase ID token');
    }

    let decodedIdToken: { uid: string };
    try {
      decodedIdToken = await getAdminAuth().verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }

    return this.sessionTokenService.issueToken({
      sessionId: body.sessionId,
      firebaseUid: decodedIdToken.uid,
      now: new Date(),
    });
  }
}