'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  subscribeToRoom,
  subscribeToParticipants,
  subscribeToActiveRooms,
  type RoomDoc,
  type ParticipantDoc,
  type RoomStatus,
} from '@/lib/firestore'

// ─── Single room presence ────────────────────────────────────────────────────

interface UseRoomPresenceOptions {
  includeLeftParticipants?: boolean
}

interface RoomPresenceState {
  room: RoomDoc | null
  participants: ParticipantDoc[]
  loading: boolean
  error: string | null
}

export function useRoomPresence(
  roomId: string | null,
  options: UseRoomPresenceOptions = {},
): RoomPresenceState {
  const { includeLeftParticipants = false } = options
  const [room, setRoom] = useState<RoomDoc | null>(null)
  const [participants, setParticipants] = useState<ParticipantDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const roomUnsubRef = useRef<Unsubscribe | null>(null)
  const participantsUnsubRef = useRef<Unsubscribe | null>(null)

  useEffect(() => {
    if (!roomId) {
      setRoom(null)
      setParticipants([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    let isMounted = true

    roomUnsubRef.current = subscribeToRoom(roomId, (r) => {
      if (!isMounted) return
      setRoom(r)
      if (r !== null) setLoading(false)
    })

    participantsUnsubRef.current = subscribeToParticipants(
      roomId,
      (p) => {
        if (!isMounted) return
        setParticipants(p)
      },
      includeLeftParticipants,
    )

    // Set loading false after a short window (room may not exist yet)
    const timer = setTimeout(() => { if (isMounted) setLoading(false) }, 3000)

    return () => {
      isMounted = false
      clearTimeout(timer)
      roomUnsubRef.current?.()
      participantsUnsubRef.current?.()
    }
  }, [roomId, includeLeftParticipants])

  return { room, participants, loading, error }
}

// ─── Active rooms list ────────────────────────────────────────────────────────

interface UseActiveRoomsOptions {
  statuses?: RoomStatus[]
}

interface ActiveRoomsState {
  rooms: RoomDoc[]
  loading: boolean
}

export function useActiveRooms(
  options: UseActiveRoomsOptions = {},
): ActiveRoomsState {
  const { statuses = ['LOBBY', 'LIVE'] } = options
  const [rooms, setRooms] = useState<RoomDoc[]>([])
  const [loading, setLoading] = useState(true)

  const unsubRef = useRef<Unsubscribe | null>(null)

  useEffect(() => {
    let isMounted = true

    unsubRef.current = subscribeToActiveRooms(
      (r) => {
        if (!isMounted) return
        setRooms(r)
        setLoading(false)
      },
      statuses,
    )

    return () => {
      isMounted = false
      unsubRef.current?.()
    }
  }, [statuses.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return { rooms, loading }
}

// ─── Participant heartbeat ────────────────────────────────────────────────────

/**
 * Call this every 30s on the client to signal the participant is still connected.
 * The session page component should start this when the user joins a room
 * and stop when they leave.
 */
export function useParticipantHeartbeat(
  roomId: string | null,
  anonId: string | null,
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (!roomId || !anonId) return

    // Fire once immediately
    import('@/lib/firestore').then(({ db }) => {
      import {
        doc,
        update,
        serverTimestamp,
      } from 'firebase/firestore').then(({ serverTimestamp: ts }) => {
        update(doc(db, 'rooms', roomId, 'participants', anonId), {
          lastSeenAt: ts(),
        }).catch(() => {
          // Participant doc may not exist yet — ignore
        })
      })
    })

    intervalRef.current = setInterval(() => {
      import('@/lib/firestore').then(({ db }) => {
        import {
          doc,
          update,
          serverTimestamp,
        } from 'firebase/firestore').then(({ serverTimestamp: ts }) => {
          update(doc(db, 'rooms', roomId, 'participants', anonId), {
            lastSeenAt: ts(),
          }).catch(() => {
            // Silently ignore — participant may have left
          })
        })
      })
    }, 30_000)
  }, [roomId, anonId])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stop()
  }, [stop])

  return { start, stop }
}
