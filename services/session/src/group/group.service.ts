import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SessionPrismaService } from '../common/prisma'
import { JoinLobbyInput, ModeratorActionInput } from '../common/dto/session.dto'
import { FirestoreService } from '../firestore/firestore.service'

@Injectable()
export class GroupService {
  constructor(
    private prisma: SessionPrismaService,
    private configService: ConfigService,
    private firestore: FirestoreService,
  ) {}

  async joinLobby(
    groupId: string,
    _input: JoinLobbyInput,
    actorAnonId: string,
  ): Promise<{
    lobbyId: string
    participantAnonId: string
    participantAnonHandle: string
    isModerator: boolean
    participants: Array<{ anonId: string; anonHandle: string }>
  }> {
    const groupSession = await this.getGroupSession(groupId)
    if (!groupSession.lobbyActive) {
      throw new BadRequestException('Lobby is not active')
    }

    const maxParticipants = this.configService.get<number>('LIVEKIT_MAX_PARTICIPANTS', 12)
    const activeParticipants = await this.firestore.getActiveParticipants(groupId)
    if (activeParticipants.length >= maxParticipants) {
      throw new BadRequestException('Lobby is at full capacity')
    }

    const moderatorAnonId = groupSession.sessionRecord?.moderatorAnonId ?? ''
    const existingRoom = await this.firestore.getRoom(groupId)
    if (!existingRoom) {
      await this.firestore.createRoom({
        roomId: groupId,
        status: 'LOBBY',
        moderatorAnonId,
        scheduledAt: groupSession.lobbyStartedAt ?? groupSession.createdAt,
        startedAt: null,
        endedAt: null,
        maxParticipants,
        participantCount: activeParticipants.length,
        groupSessionRecordId: groupId,
        serviceId: null,
        serviceName: null,
        crisisActive: false,
        crisisFlagId: null,
      })
    }

    const participantAnonId = actorAnonId
    const participantCount = activeParticipants.length + 1
    const participantAnonHandle = `Participant #${participantCount}`
    const isModerator = moderatorAnonId === actorAnonId

    await this.firestore.upsertParticipant(groupId, {
      anonId: participantAnonId,
      displayName: participantAnonHandle,
      displayNameUpdatedAt: new Date(),
      role: isModerator ? 'moderator' : 'participant',
      audioEnabled: true,
      videoEnabled: false,
      handRaised: false,
      joinedAt: new Date(),
      connectionQuality: 'unknown',
    })

    await this.firestore.incrementParticipantCount(groupId)
    await this.logEvent(groupSession.sessionRecordId, 'LOBBY_JOINED', participantAnonId, {
      participantAnonHandle,
      isModerator,
      groupId,
    })

    const updatedParticipants = await this.firestore.getActiveParticipants(groupId)
    return {
      lobbyId: groupId,
      participantAnonId,
      participantAnonHandle,
      isModerator,
      participants: updatedParticipants.map((p) => ({
        anonId: p.anonId,
        anonHandle: p.displayName,
      })),
    }
  }

  async leaveLobby(groupId: string, participantAnonId: string): Promise<{ left: boolean }> {
    const groupSession = await this.getGroupSession(groupId)
    const activeParticipants = await this.firestore.getActiveParticipants(groupId)
    const participant = activeParticipants.find((p) => p.anonId === participantAnonId)
    if (!participant) {
      throw new NotFoundException('Participant not found in lobby')
    }

    await this.firestore.removeParticipant(groupId, participantAnonId)
    await this.firestore.decrementParticipantCount(groupId)
    await this.logEvent(groupSession.sessionRecordId, 'LOBBY_LEFT', participantAnonId, { groupId })

    return { left: true }
  }

  async startLobby(groupId: string, moderatorAnonId: string): Promise<{ started: boolean; roomId: string }> {
    const groupSession = await this.getGroupSession(groupId)
    this.assertModerator(groupSession, moderatorAnonId)

    await this.prisma.groupSessionRecord.update({
      where: { id: groupId },
      data: { lobbyActive: false, lobbyStartedAt: new Date() },
    })

    await this.firestore.updateRoom(groupId, {
      status: 'LIVE',
      startedAt: new Date(),
    })

    await this.logEvent(groupSession.sessionRecordId, 'LOBBY_STARTED', moderatorAnonId, { groupId })
    return { started: true, roomId: groupId }
  }

  async moderatorAction(
    groupId: string,
    moderatorAnonId: string,
    input: ModeratorActionInput,
  ): Promise<{ action: string; success: boolean }> {
    const groupSession = await this.getGroupSession(groupId)
    this.assertModerator(groupSession, moderatorAnonId)

    switch (input.action) {
      case 'mute':
        await this.logEvent(groupSession.sessionRecordId, 'MODERATOR_MUTED_ALL', moderatorAnonId, {
          groupId,
          reason: input.reason,
        })
        return { action: 'mute_all', success: true }

      case 'unmute':
        await this.logEvent(groupSession.sessionRecordId, 'MODERATOR_UNMUTED_ALL', moderatorAnonId, {
          groupId,
          reason: input.reason,
        })
        return { action: 'unmute_all', success: true }

      case 'remove':
        if (!input.targetAnonId) {
          throw new BadRequestException('Target participant required for remove action')
        }
        await this.firestore.removeParticipant(groupId, input.targetAnonId)
        await this.firestore.decrementParticipantCount(groupId)
        await this.logEvent(groupSession.sessionRecordId, 'PARTICIPANT_REMOVED', moderatorAnonId, {
          groupId,
          removedAnonId: input.targetAnonId,
          reason: input.reason,
        })
        return { action: 'remove', success: true }

      case 'end':
        await this.prisma.groupSessionRecord.update({
          where: { id: groupId },
          data: { lobbyActive: false },
        })
        await this.firestore.endRoom(groupId)
        await this.logEvent(groupSession.sessionRecordId, 'SESSION_ENDED', moderatorAnonId, {
          groupId,
          reason: 'moderator_ended',
        })
        return { action: 'end_session', success: true }

      default:
        throw new BadRequestException('Invalid moderator action')
    }
  }

  async getLobbyParticipants(groupId: string): Promise<
    Array<{ anonId: string; anonHandle: string; isModerator: boolean }>
  > {
    await this.getGroupSession(groupId)
    const activeParticipants = await this.firestore.getActiveParticipants(groupId)
    return activeParticipants.map((p) => ({
      anonId: p.anonId,
      anonHandle: p.displayName,
      isModerator: p.role === 'moderator',
    }))
  }

  private async getGroupSession(groupId: string) {
    const groupSession = await this.prisma.groupSessionRecord.findUnique({
      where: { id: groupId },
      include: { sessionRecord: true },
    })

    if (!groupSession) {
      throw new NotFoundException('Group session not found')
    }

    return groupSession
  }

  private assertModerator(groupSession: Awaited<ReturnType<GroupService['getGroupSession']>>, actorAnonId: string) {
    if (groupSession.sessionRecord?.moderatorAnonId !== actorAnonId) {
      throw new ForbiddenException('Only moderator can perform this action')
    }
  }

  private async logEvent(
    sessionRecordId: string,
    eventType: string,
    actorAnonId: string,
    eventData: Record<string, unknown>,
  ) {
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: eventType as any,
        severity: 'INFO',
        actorAnonId,
        eventData: eventData as any,
      },
    })
  }
}
