import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SessionService } from './session.service';
import {
  FlagSessionSchema,
  EndSessionSchema,
  UpdateFacilitatorNotesSchema,
  RecordingConsentSchema,
  ApiResponse,
  FlagSessionInput,
  EndSessionInput,
  UpdateFacilitatorNotesInput,
  RecordingConsentInput,
} from '../common/dto/session.dto';
import { SessionSecretGuard, SessionToken, SessionTokenPayload } from '../common/guards';

@Controller('session/v1')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post(':id/flag')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async flagSession(
    @Param('id', ParseUUIDPipe) sessionRecordId: string,
    @Body() input: FlagSessionInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{ escalated: boolean; flagId: string }>> {
    const result = await this.sessionService.flagSession(
      sessionRecordId,
      input,
      token?.anonSessionToken || 'unknown',
      'participant',
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

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async endSession(
    @Param('id', ParseUUIDPipe) sessionRecordId: string,
    @Body() input: EndSessionInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{ ended: boolean; endedAt: string }>> {
    const result = await this.sessionService.endSession(
      sessionRecordId,
      input,
      token?.anonSessionToken || 'unknown',
      token?.role || 'participant',
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

  @Get(':id/notes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async getNotes(
    @Param('id', ParseUUIDPipe) sessionRecordId: string,
  ): Promise<ApiResponse<{ notes: string | null }>> {
    const notes = await this.sessionService.getFacilitatorNotes(sessionRecordId);

    return {
      data: { notes },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
  }

  @Patch(':id/notes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async updateNotes(
    @Param('id', ParseUUIDPipe) sessionRecordId: string,
    @Body() input: UpdateFacilitatorNotesInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{ updated: boolean }>> {
    const result = await this.sessionService.updateFacilitatorNotes(
      sessionRecordId,
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

  @Post('recording-consent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionSecretGuard)
  async updateRecordingConsent(
    @Body() input: RecordingConsentInput,
    @SessionToken() token: SessionTokenPayload,
  ): Promise<ApiResponse<{ updated: boolean }>> {
    const result = await this.sessionService.updateRecordingConsent(
      input.sessionId,
      input.consent,
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
}