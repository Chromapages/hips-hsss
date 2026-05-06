import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  JoinLobbySchema,
  ModeratorActionSchema,
  ApiResponse,
  JoinLobbyInput,
  ModeratorActionInput,
} from '../common/dto/session.dto';
import { SessionSecretGuard, SessionToken, SessionTokenPayload } from '../common/guards';

@Controller('group/v1')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('lobby/:id/join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async joinLobby(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() input: JoinLobbyInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{
    lobbyId: string;
    participantAnonId: string;
    participantAnonHandle: string;
    isModerator: boolean;
    participants: Array<{ anonId: string; anonHandle: string }>;
  }>> {
    const result = await this.groupService.joinLobby(
      groupId,
      input,
      token?.anonSessionToken || 'unknown',
    );

    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }

  @Post('lobby/:id/leave')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async leaveLobby(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() body: { participantAnonId: string },
  ): Promise<ApiResponse<{ left: boolean }>> {
    const result = await this.groupService.leaveLobby(groupId, body.participantAnonId);

    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }

  @Post('lobby/:id/start')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async startLobby(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() body: { moderatorAnonId: string },
  ): Promise<ApiResponse<{ started: boolean; roomId: string }>> {
    const result = await this.groupService.startLobby(groupId, body.moderatorAnonId);

    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }

  @Post('lobby/:id/moderator-action')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async moderatorAction(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() input: ModeratorActionInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{ action: string; success: boolean }>> {
    const result = await this.groupService.moderatorAction(
      groupId,
      token?.anonSessionToken || 'unknown',
      input,
    );

    return {
      data: result,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }

  @Get('lobby/:id/participants')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async getLobbyParticipants(
    @Param('id', ParseUUIDPipe) groupId: string,
  ): Promise<ApiResponse<Array<{ anonId: string; anonHandle: string; isModerator: boolean }>>> {
    const participants = await this.groupService.getLobbyParticipants(groupId);

    return {
      data: participants,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }
}