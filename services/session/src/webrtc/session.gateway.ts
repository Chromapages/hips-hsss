import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenService } from '../token';
import { SessionPrismaService } from '../common/prisma';
import { GroupService } from '../group';

interface JoinRoomPayload {
  token: string;
  sessionRecordId: string;
  avatarStyle?: string;
  avatarColor?: string;
}

interface SignalPayload {
  targetAnonId?: string;
  signal: any;
}

interface ModeratorActionPayload {
  action: string;
  targetAnonId?: string;
  reason?: string;
}

interface AuthPayload {
  type?: string;
  token?: string;
}

@WebSocketGateway({
  namespace: '/session/v1/connect',
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SessionGateway.name);
  private connectedParticipants: Map<string, {
    socketId: string;
    sessionRecordId: string;
    anonId: string;
    isModerator: boolean;
    roomId: string;
  }> = new Map();
  private pendingAuthTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(
    private tokenService: TokenService,
    private groupService: GroupService,
    private prisma: SessionPrismaService,
  ) {}

  async handleConnection(client: Socket) {
    client.emit('AUTH_REQUIRED');
    this.pendingAuthTimers.set(client.id, setTimeout(() => {
      if (!this.connectedParticipants.has(client.id)) {
        this.logger.warn(`Client ${client.id} did not authenticate in time`);
        client.emit('AUTH_ERROR', { code: 'AUTH_TIMEOUT' });
        client.disconnect();
      }
    }, 10000));
  }

  @SubscribeMessage('AUTH')
  async handleAuthUpper(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AuthPayload | string,
  ) {
    await this.authenticateClient(client, data);
  }

  @SubscribeMessage('auth')
  async handleAuthLower(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AuthPayload | string,
  ) {
    await this.authenticateClient(client, data);
  }

  async handleDisconnect(client: Socket) {
    const pendingTimer = this.pendingAuthTimers.get(client.id);
    if (pendingTimer) clearTimeout(pendingTimer);
    this.pendingAuthTimers.delete(client.id);

    const participant = this.connectedParticipants.get(client.id);

    if (participant) {
      // Log disconnection
      await this.prisma.auditEvent.create({
        data: {
          sessionRecordId: participant.sessionRecordId,
          eventType: 'VOICE_DISCONNECTED',
          severity: 'INFO',
          actorAnonId: participant.anonId,
          actorRole: participant.isModerator ? 'moderator' : 'participant',
        },
      });

      // Notify others
      this.server.to(participant.roomId).emit('participant:left', {
        anonId: participant.anonId,
        timestamp: new Date().toISOString(),
      });

      this.connectedParticipants.delete(client.id);
      this.logger.log(`Client ${client.id} disconnected from session ${participant.sessionRecordId}`);
    }
  }

  @SubscribeMessage('avatar:update')
  async handleAvatarUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { avatarStyle: string; avatarColor: string },
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant) return;

    // Broadcast avatar change to room
    client.to(participant.sessionRecordId).emit('avatar:changed', {
      anonId: participant.anonId,
      avatarStyle: data.avatarStyle,
      avatarColor: data.avatarColor,
    });
  }

  @SubscribeMessage('voice:signal')
  async handleVoiceSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SignalPayload,
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant) return;

    if (data.targetAnonId) {
      // Send to specific participant
      const targetClient = this.findClientByAnonId(data.targetAnonId, participant.sessionRecordId);
      if (targetClient) {
        targetClient.emit('voice:signal', {
          fromAnonId: participant.anonId,
          signal: data.signal,
        });
      }
    } else {
      // Broadcast to room
      client.to(participant.sessionRecordId).emit('voice:signal', {
        fromAnonId: participant.anonId,
        signal: data.signal,
      });
    }
  }

  @SubscribeMessage('voice:mute')
  async handleMute(
    @ConnectedSocket() client: Socket,
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant) return;

    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId: participant.sessionRecordId,
        eventType: 'VOICE_MUTED',
        severity: 'INFO',
        actorAnonId: participant.anonId,
        actorRole: participant.isModerator ? 'moderator' : 'participant',
      },
    });

    client.to(participant.sessionRecordId).emit('participant:muted', {
      anonId: participant.anonId,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('voice:unmute')
  async handleUnmute(
    @ConnectedSocket() client: Socket,
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant) return;

    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId: participant.sessionRecordId,
        eventType: 'VOICE_UNMUTED',
        severity: 'INFO',
        actorAnonId: participant.anonId,
        actorRole: participant.isModerator ? 'moderator' : 'participant',
      },
    });

    client.to(participant.sessionRecordId).emit('participant:unmuted', {
      anonId: participant.anonId,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('moderator:action')
  async handleModeratorAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ModeratorActionPayload,
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant || !participant.isModerator) {
      throw new WsException('Moderator actions require moderator privileges');
    }

    // Broadcast moderator action to room
    client.to(participant.sessionRecordId).emit('moderator:action', {
      action: data.action,
      targetAnonId: data.targetAnonId,
      reason: data.reason,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('flag:report')
  async handleFlagReport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { flagType: string; description?: string },
  ) {
    const participant = this.connectedParticipants.get(client.id);
    if (!participant) return;

    const flagEvent = await this.prisma.auditEvent.create({
      data: {
        sessionRecordId: participant.sessionRecordId,
        eventType: 'FLAG_RAISED',
        severity: data.flagType === 'crisis' ? 'CRITICAL' : 'WARNING',
        actorAnonId: participant.anonId,
        actorRole: participant.isModerator ? 'moderator' : 'participant',
        eventData: {
          flagType: data.flagType,
          description: data.description,
        },
      },
    });

    // Notify Safety Engine
    // In production, this would be an HTTP call to the Safety Engine

    // Confirm to the client
    client.emit('flag:confirmed', {
      flagId: flagEvent.id,
      escalated: data.flagType === 'crisis',
    });
  }

  private findClientByAnonId(anonId: string, roomId: string): Socket | null {
    const room = this.server.sockets.adapter.rooms.get(roomId);
    if (!room) return null;

    for (const socketId of room) {
      const participant = this.connectedParticipants.get(socketId);
      if (participant?.anonId === anonId) {
        return this.server.sockets.sockets.get(socketId) ?? null;
      }
    }
    return null;
  }

  private async authenticateClient(client: Socket, data: AuthPayload | string) {
    const token = typeof data === 'string' ? data : data?.token;
    if (!token) {
      client.emit('AUTH_ERROR', { code: 'AUTH_TOKEN_REQUIRED' });
      client.disconnect();
      return;
    }

    try {
      const payload = await this.tokenService.validateSessionToken(token);
      const timer = this.pendingAuthTimers.get(client.id);
      if (timer) clearTimeout(timer);
      this.pendingAuthTimers.delete(client.id);

      this.connectedParticipants.set(client.id, {
        socketId: client.id,
        sessionRecordId: payload.sessionRecordId,
        anonId: payload.anonSessionToken,
        isModerator: false,
        roomId: payload.roomId,
      });
      (client as Socket & { sessionToken?: typeof payload }).sessionToken = payload;

      await client.join(payload.roomId);

      await this.prisma.auditEvent.create({
        data: {
          sessionRecordId: payload.sessionRecordId,
          eventType: 'VOICE_CONNECTED',
          severity: 'INFO',
          actorAnonId: payload.anonSessionToken,
          actorRole: 'participant',
          eventData: { clientId: client.id },
        },
      });

      client.emit('AUTH_SUCCESS');
      this.logger.log(`Client ${client.id} authenticated to session ${payload.sessionRecordId}`);
      client.to(payload.roomId).emit('participant:joined', {
        anonId: payload.anonSessionToken,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Client ${client.id} authentication failed: ${message}`);
      client.emit('AUTH_ERROR', { code: 'TOKEN_INVALID' });
      client.disconnect();
    }
  }
}
