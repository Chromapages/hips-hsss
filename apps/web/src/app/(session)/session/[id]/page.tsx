'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@hips/ui'
import { AvatarSelector } from '@components/session/AvatarSelector'
import { VirtualOffice, type Participant, type GesturePreset } from '@components/session/VirtualOffice'
import { VoiceControls } from '@components/session/VoiceControls'
import { CrisisOverlay } from '@components/session/CrisisOverlay'
import { SessionReconnect } from '@components/session/SessionReconnect'
import { useSessionToken } from '@hooks/useSessionToken'
import { useAvatarConfig } from '@hooks/useAvatarConfig'

type SessionStage = 'lobby' | 'active' | 'ended'

type WSMessage =
  | { type: 'PARTICIPANT_JOIN'; participant: Participant }
  | { type: 'PARTICIPANT_LEAVE'; participantId: string }
  | { type: 'PARTICIPANT_UPDATE'; participant: Partial<Participant> & { id: string } }

function makeLocalParticipant(sessionToken: string | null, styleId: number | null, paletteId: number): Participant {
  return {
    id: 'local',
    avatarStyleId: styleId ?? 1,
    paletteId,
    displayName: 'You',
    isMuted: false,
    isSpeaking: false,
    isFacilitator: false,
    position: [0, 0, 0],
  }
}

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [stage, setStage] = useState<SessionStage>('lobby')
  const [muted, setMuted] = useState(false)
  const [crisisOpen, setCrisisOpen] = useState(false)
  const [crisisLevel, setCrisisLevel] = useState<'SOFT_ALERT' | 'ESCALATION_REVIEW' | 'CRISIS_ACTIVE'>('SOFT_ALERT')
  const [participants, setParticipants] = useState<Participant[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  const {
    token,
    phase,
    attemptCount,
    maxAttempts,
    countdown,
    endSession,
    flagCrisis,
    retryNow,
  } = useSessionToken({
    sessionId,
    onPhaseChange: (p) => {
      if (p === 'connected') setStage('active')
    },
    onCrisisFlag: (reason) => {
      setCrisisLevel('SOFT_ALERT')
      setCrisisOpen(true)
    },
    onError: (code) => {
      console.error('Session error:', code)
    },
  })

  const {
    styleId,
    paletteId,
    locked,
    selectStyle,
    selectPalette,
    lock: lockAvatar,
    clear: clearAvatar,
  } = useAvatarConfig({
    sessionId,
    sessionToken: token ?? '',
    onLockChange: (locked) => {
      if (locked) setStage('active')
    },
  })

  // Wire WebSocket to participant state
  useEffect(() => {
    if (!token) return

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL ?? 'wss://session.hips.org'}/ws/${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setWsConnected(true)
      // Add local participant once connected
      setParticipants([makeLocalParticipant(token, styleId, paletteId)])
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WSMessage
        switch (msg.type) {
          case 'PARTICIPANT_JOIN':
            setParticipants((prev) => {
              if (prev.some((p) => p.id === msg.participant.id)) return prev
              return [...prev, msg.participant]
            })
            break
          case 'PARTICIPANT_LEAVE':
            setParticipants((prev) => prev.filter((p) => p.id !== msg.participantId))
            break
          case 'PARTICIPANT_UPDATE':
            setParticipants((prev) =>
              prev.map((p) =>
                p.id === msg.participant.id ? { ...p, ...msg.participant } : p
              )
            )
            break
        }
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onclose = () => {
      setWsConnected(false)
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [token])

  // Update local participant avatar when config changes
  useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === 'local'
          ? { ...p, avatarStyleId: styleId ?? p.avatarStyleId, paletteId }
          : p
      )
    )
  }, [styleId, paletteId])

  const handleAvatarSelect = useCallback((newStyleId: number, newPaletteId: number) => {
    selectStyle(newStyleId)
    selectPalette(newPaletteId)
  }, [selectStyle, selectPalette])

  const handleAvatarLock = useCallback(() => {
    lockAvatar()
  }, [lockAvatar])

  const handleMuteToggle = useCallback(() => {
    setMuted((m) => !m)
    // Broadcast mute state via WebSocket
    wsRef.current?.send(JSON.stringify({ type: 'PARTICIPANT_UPDATE', participant: { id: 'local', isMuted: !muted } }))
  }, [muted])

  const handleEndSession = useCallback(() => {
    clearAvatar()
    endSession()
  }, [clearAvatar, endSession])

  const handleFlag = useCallback(() => {
    flagCrisis('User-initiated flag from session controls')
  }, [flagCrisis])

  const handleGesture = useCallback((gesture: string) => {
    // Emit gesture to WebSocket
    wsRef.current?.send(JSON.stringify({ type: 'GESTURE', gesture }))
  }, [])

  const handleCrisisClose = useCallback(() => {
    setCrisisOpen(false)
  }, [])

  const handleRetry = useCallback(() => {
    retryNow()
  }, [retryNow])

  const reconnectState = {
    phase: phase as 'connected' | 'reconnecting' | 'failed' | 'ended',
    attemptCount,
    maxAttempts,
    countdown,
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Lobby: avatar selection */}
      {stage === 'lobby' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <AvatarSelector
              onSelect={handleAvatarSelect}
              onLock={handleAvatarLock}
              locked={locked}
              currentStyleId={styleId ?? undefined}
              currentPaletteId={paletteId}
              disabled={false}
            />
            {locked && (
              <p className="text-center text-sm text-slate-500 mt-4">
                Session starting automatically&hellip;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active session */}
      {(stage === 'active' || stage === 'ended') && (
        <>
          {/* Virtual office (Three.js scene) */}
          <div className="flex-1 p-4">
            <VirtualOffice
              sessionId={sessionId}
              participants={participants}
              localParticipantId="local"
              className="h-full min-h-[400px]"
            />
          </div>

          {/* Voice controls */}
          <div className="p-4">
            <VoiceControls
              muted={muted}
              onMuteToggle={handleMuteToggle}
              onEndSession={handleEndSession}
              onFlag={handleFlag}
              onGesture={handleGesture}
              disabled={phase !== 'connected'}
              isFacilitator={false}
            />
          </div>
        </>
      )}

      {/* Reconnect overlay */}
      <SessionReconnect
        state={reconnectState}
        onRetry={handleRetry}
        onEnd={handleEndSession}
      />

      {/* Crisis overlay */}
      <CrisisOverlay
        open={crisisOpen}
        onClose={crisisLevel === 'SOFT_ALERT' ? handleCrisisClose : undefined}
        level={crisisLevel}
        sessionId={sessionId}
      />
    </div>
  )
}