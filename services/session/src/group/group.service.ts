import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SessionPrismaService } from '../common/prisma'
import { JoinLobbyInput, ModeratorActionInput } from '../common/dto/session.dto'
import { FirestoreService } from '../firestore/firestore.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class GroupService {
  constructor(
    private prisma: SessionPrismaService,
    private configService: ConfigService,
    private firestore: FirestoreService,
  ) {}

  // ─── Join lobby ─────────────────────────────────────────────────────────────

  async joinLobby(
    groupId: string,
    input: JoinLobbyInput,
    actorAnonId: string,
  ): Promise<{
    lobbyId: string
    participantAnonId: string
    participantAnonHandle: string
    isModerator: boolean
    participants: Array<{ anonId: string; anonHandle: string }>
  }> {
    const groupSession = await this.prisma.groupSessionRecord.findUnique({
      where: { id: groupId },
    })

    if (!groupSession) {
      throw new NotFoundException('Group session not found')
    }

    if (groupSession.status !== 'LOBBY') {
      throw new BadRequestException('Lobby is not active')
    }

    const maxParticipants = this.configService.get<number>('LIVEKIT_MAX_PARTICIPANTS', 12)
    const activeParticipants = await this.firestore.getActiveParticipants(groupId)

    if (activeParticipants.length >= maxParticipants) {
      throw new BadRequestException('Lobby is at full capacity')
    }

    // Ensure Firestore room document exists
    const existingRoom = await this.firestore.getRoom(groupId)
    if (!existingRoom) {
      await this.firestore.createRoom({
        roomId: groupId,
        status: 'LOBBY',
        moderatorAnonId: groupSession.moderatorAnonId,
        scheduledAt: groupSession.scheduledAt,
        startedAt: null,
        endedAt: null,
        maxParticipants,
        participantCount: activeParticipants.length,
        groupSessionRecordId: groupId,
        serviceId: groupSession.serviceId ?? null,
        serviceName: null,
        crisisActive: false,
        crisisFlagId: null,
      })
    }

    const isModerator = groupSession.moderatorAnonId === actorAnonId
    const participantAnonId = uuidv4()
    const participantCount = activeParticipants.length + 1
    const participantAnonHandle = `Participant #${participantCount}`

    // Write participant to Firestore real-time presence
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

    // Audit log → PostgreSQL (source of truth)
    await this.prisma.auditEvent.create({
      data: {
        eventType: 'LOBBY_JOINED',
        severity: 'INFO',
        actorId: participantAnonId,
        targetId: groupId,
        metadata: { participantAnonHandle, isModerator, groupId },
      },
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

  // ─── Leave lobby ────────────────────────────────────────────────────────────

  async leaveLobby(
    groupId: string,
    participantAnonId: string,
  ): Promise<{ left: boolean }> {
    const activeParticipants = await this.firestore.getActiveParticipants(groupId)
    const participant = activeParticipants.find((p) => p.anonId === participantAnonId)

    if (!participant) {
      throw new NotFoundException('Participant not found in lobby')
    }

    await this.firestore.removeParticipant(groupId, participantAnonId)
    await this.firestore.decrementParticipantCount(groupId)

    await this.prisma.auditEvent.create({
      data: {
        eventType: 'LOBBY_LEFT',
        severity: 'INFO',
        actorId: participantAnonId,
        targetId: groupId,
        metadata: { groupId },
      },
    })

    return { left: true }
  }

  // ─── Start lobby ────────────────────────────────────────────────────────────

  async startLobby(
    groupId: string,
    moderatorAnonId: string,
  ): Promise<{ started: boolean; roomId: string }> {
    const groupSession = await this.prisma.groupSessionRecord.findUnique({
      where: { id: groupId },
    })

    if (!groupSession) {
      throw new NotFoundException('Group session not found')
    }

    if (groupSession.moderatorAnonId !== moderatorAnonId) {
      throw new ForbiddenException('Only moderator can start the lobby')
    }

    // Update PostgreSQL
    await this.prisma.groupSessionRecord.update({
      where: { id: groupId },
      data: { status: 'LIVE', startedAt: new Date() },
    })

    // Update Firestore room status
    await this.firestore.updateRoom(groupId, {
      status: 'LIVE',
      startedAt: new Date(),
    })

    await this.prisma.auditEvent.create({
      data: {
        eventType: 'LOBBY_STARTED',
        severity: 'INFO',
        actorId: moderatorAnonId,
        targetId: groupId,
        metadata: { groupId },
      },
    })

    return { started: true, roomId: groupId }
  }

  // ─── Moderator actions ──────────────────────────────────────────────────────

  async moderatorAction(
    groupId: string,
    moderatorAnonId: string,
    input: ModeratorActionInput,
  ): Promise<{ action: string; success: boolean }> {
    const groupSession = await this.prisma.groupSessionRecord.findUnique({
      where: { id: groupId },
    })

    if (!groupSession) {
      throw new NotFoundException('Group session not found')
    }

    if (groupSession.moderatorAnonId !== moderatorAnonId) {
      throw new ForbiddenException('Only moderator can perform this action')
    }

    switch (input.action) {
      case 'mute':
        await this.prisma.auditEvent.create({
          data: {
            eventType: 'MODERATOR_MUTED_ALL',
            severity: 'INFO',
            actorId: moderatorAnonId,
            targetId: groupId,
            metadata: { groupId, reason: input.reason },
          },
        })
        return { action: 'mute_all', success: true }

      case 'unmute':
        await this.prisma.auditEvent.create({
          data: {
            eventType: 'MODERATOR_UNMUTED_ALL',
            severity: 'INFO',
            actorId: moderatorAnonId,
            targetId: groupId,
            metadata: { groupId, reason: input.reason },
          },
        })
        return { action: 'unmute_all', success: true }

      case 'remove':
        if (!input.targetAnonId) {
          throw new BadRequestException('Target participant required for remove action')
        }
        await this.firestore.removeParticipant(groupId, input.targetAnonId)
        await this.firestore.decrementParticipantCount(groupId)

        await this.prisma.auditEvent.create({
          data: {
            eventType: 'PARTICIPANT_REMOVED',
            severity: 'WARNING',
            actorId: moderatorAnonId,
            targetId: groupId,
            metadata: { groupId, removedAnonId: input.targetAnonId, reason: input.reason },
          },
        })
        return { action: 'remove', success: true }

      case 'end':
        await this.prisma.groupSessionRecord.update({
          where: { id: groupId },
          data: { status: 'ENDED', endedAt: new Date() },
        })

        await this.firestore.endRoom(groupId)

        await this.prisma.auditEvent.create({
          data: {
            eventType: 'SESSION_ENDED',
            severity: 'INFO',
            actorId: moderatorAnonId,
            targetId: groupId,
            metadata: { groupId, reason: 'moderator_ended' },
          },
        })
        return { action: 'end_session', success: true }

      default:
        throw new BadRequestException('Invalid moderator action')
    }
  }

  // ─── Get lobby participants ──────────────────────────────────────────────────

  async getLobbyParticipants(groupId: string): Promise<
    Array<{ anonId: string; anonHandle: string; isModerator: boolean }>
  > {
    const groupSession = await this.prisma.groupSessionRecord.findUnique({
      where: { id: groupId },
    })

    if (!groupSession) {
      throw new NotFoundException('Group session not found')
    }

    const activeParticipants = await this.firestore.getActiveParticipants(groupId)
    return activeParticipants.map((p) => ({
      anonId: p.anonId,
      anonHandle: p.displayName,
      isModerator: p.role === 'moderator',
    }))
  }
}
