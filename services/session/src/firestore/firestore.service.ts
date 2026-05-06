import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { Firestore, FieldValue } from '@google-cloud/firestore'

export type RoomStatus = 'LOBBY' | 'LIVE' | 'ENDED' | 'CANCELLED'
export type ParticipantRole = 'moderator' | 'participant' | 'observer'
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'unknown'

export interface RoomDocument {
  roomId: string
  status: RoomStatus
  moderatorAnonId: string
  scheduledAt: Date
  startedAt: Date | null
  endedAt: Date | null
  maxParticipants: number
  participantCount: number
  groupSessionRecordId: string | null
  serviceId: string | null
  serviceName: string | null
  crisisActive: boolean
  crisisFlagId: string | null
  updatedAt: Date
}

export interface ParticipantDocument {
  anonId: string
  displayName: string
  displayNameUpdatedAt: Date
  role: ParticipantRole
  audioEnabled: boolean
  videoEnabled: boolean
  handRaised: boolean
  joinedAt: Date
  lastSeenAt: Date
  leftAt: Date | null
  connectionQuality: ConnectionQuality
}

@Injectable()
export class FirestoreService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FirestoreService.name)
  private db: Firestore

  onModuleInit() {
    this.db = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: this.getCredentials(),
    })
    this.logger.log('Firestore connected')
  }

  onModuleDestroy() {
    // Firestore has no open connections to close
  }

  private getCredentials() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    }
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      return {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    }
    return undefined // falls back to Application Default Credentials
  }

  // ─── Room operations ─────────────────────────────────────────────────────────

  async createRoom(room: Omit<RoomDocument, 'updatedAt'>): Promise<void> {
    const doc: RoomDocument = { ...room, updatedAt: new Date() }
    await this.db.collection('rooms').doc(room.roomId).set(doc)
    this.logger.debug(`Room created: ${room.roomId}`)
  }

  async updateRoom(roomId: string, updates: Partial<Omit<RoomDocument, 'roomId'>>): Promise<void> {
    await this.db.collection('rooms').doc(roomId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  async getRoom(roomId: string): Promise<RoomDocument | null> {
    const snap = await this.db.collection('rooms').doc(roomId).get()
    if (!snap.exists) return null
    return { roomId: snap.id, ...snap.data() } as RoomDocument
  }

  async incrementParticipantCount(roomId: string): Promise<number> {
    const ref = this.db.collection('rooms').doc(roomId)
    const snap = await ref.get()
    const current = (snap.data()?.participantCount ?? 0) as number
    await ref.update({ participantCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() })
    return current + 1
  }

  async decrementParticipantCount(roomId: string): Promise<number> {
    const ref = this.db.collection('rooms').doc(roomId)
    const snap = await ref.get()
    const current = (snap.data()?.participantCount ?? 0) as number
    const newCount = Math.max(0, current - 1)
    await ref.update({ participantCount: newCount, updatedAt: FieldValue.serverTimestamp() })
    return newCount
  }

  async setCrisisActive(roomId: string, active: boolean, flagId?: string): Promise<void> {
    await this.db.collection('rooms').doc(roomId).update({
      crisisActive: active,
      crisisFlagId: flagId ?? null,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  async endRoom(roomId: string): Promise<void> {
    await this.db.collection('rooms').doc(roomId).update({
      status: 'ENDED',
      endedAt: FieldValue.serverTimestamp(),
      participantCount: 0,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  // ─── Participant operations ─────────────────────────────────────────────────

  async upsertParticipant(
    roomId: string,
    participant: Omit<ParticipantDocument, 'lastSeenAt' | 'leftAt'>,
  ): Promise<void> {
    const ref = this.db.collection('rooms').doc(roomId).collection('participants').doc(participant.anonId)
    await ref.set({
      ...participant,
      lastSeenAt: FieldValue.serverTimestamp(),
      joinedAt: FieldValue.serverTimestamp(),
      leftAt: null,
    })
  }

  async updateParticipantPresence(
    roomId: string,
    anonId: string,
    updates: Partial<Pick<ParticipantDocument, 'audioEnabled' | 'videoEnabled' | 'handRaised' | 'connectionQuality'>>,
  ): Promise<void> {
    await this.db
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .doc(anonId)
      .update({
        ...updates,
        lastSeenAt: FieldValue.serverTimestamp(),
      })
  }

  async removeParticipant(roomId: string, anonId: string): Promise<void> {
    await this.db
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .doc(anonId)
      .update({
        leftAt: FieldValue.serverTimestamp(),
        lastSeenAt: FieldValue.serverTimestamp(),
      })
  }

  async getActiveParticipants(roomId: string): Promise<ParticipantDocument[]> {
    const snap = await this.db
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .where('leftAt', '==', null)
      .get()

    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ anonId: d.id, ...d.data() } as ParticipantDocument))
  }

  async getAllParticipants(roomId: string): Promise<ParticipantDocument[]> {
    const snap = await this.db
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .get()

    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ anonId: d.id, ...d.data() } as ParticipantDocument))
  }
}
