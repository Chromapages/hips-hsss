import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  type Unsubscribe,
  type DocumentData,
  type QuerySnapshot,
  type DocumentReference,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp()
  }
  return initializeApp(firebaseConfig)
}

export const app = getFirebaseApp()
export const db = getFirestore(app)

// ─── Room presence helpers ────────────────────────────────────────────────────

export type RoomStatus = 'LOBBY' | 'LIVE' | 'ENDED' | 'CANCELLED'
export type ParticipantRole = 'moderator' | 'participant' | 'observer'
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'unknown'

export interface RoomDoc {
  roomId: string
  status: RoomStatus
  moderatorAnonId: string
  scheduledAt: Date
  startedAt: Date | null
  endedAt: Date | null
  maxParticipants: number
  participantCount: number
  serviceId: string | null
  serviceName: string | null
  crisisActive: boolean
  crisisFlagId: string | null
  updatedAt: Date
}

export interface ParticipantDoc {
  anonId: string
  displayName: string
  role: ParticipantRole
  audioEnabled: boolean
  videoEnabled: boolean
  handRaised: boolean
  joinedAt: Date
  lastSeenAt: Date
  leftAt: Date | null
  connectionQuality: ConnectionQuality
}

function docToRoom(snap: DocumentData): RoomDoc {
  const data = snap.data()
  return { roomId: snap.id, ...data } as RoomDoc
}

function docToParticipant(snap: DocumentData): ParticipantDoc {
  return { anonId: snap.id, ...snap.data() } as ParticipantDoc
}

export function subscribeToRoom(
  roomId: string,
  callback: (room: RoomDoc | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'rooms', roomId), (snap) => {
    if (!snap.exists()) {
      callback(null)
      return
    }
    callback(docToRoom(snap))
  })
}

export function subscribeToParticipants(
  roomId: string,
  callback: (participants: ParticipantDoc[]) => void,
  includeLeft = false,
): Unsubscribe {
  let q: ReturnType<typeof query>
  const coll = collection(db, 'rooms', roomId, 'participants')

  if (includeLeft) {
    q = query(coll, orderBy('joinedAt', 'asc'))
  } else {
    q = query(coll, where('leftAt', '==', null), orderBy('joinedAt', 'asc'))
  }

  return onSnapshot(q, (snap: QuerySnapshot) => {
    callback(snap.docs.map(docToParticipant))
  })
}

export function subscribeToActiveRooms(
  callback: (rooms: RoomDoc[]) => void,
  statuses: RoomStatus[] = ['LOBBY', 'LIVE'],
): Unsubscribe {
  const q = query(collection(db, 'rooms'), where('status', 'in', statuses))

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(docToRoom))
  })
}
