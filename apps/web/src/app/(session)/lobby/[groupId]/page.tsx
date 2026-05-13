'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@hips/ui'
import { AvatarSelector, AVATAR_STYLES, COLOR_PALETTES } from '@components/session/AvatarSelector'
import { useAvatarConfig } from '@hooks/useAvatarConfig'

interface ParticipantInfo {
  id: string
  displayName: string
  avatarStyleId: number
  paletteId: number
  isFacilitator: boolean
  joinedAt: number
}

interface GroupLobbyState {
  participants: ParticipantInfo[]
  isFacilitator: boolean
  sessionStarted: boolean
  maxParticipants: number
}

export default function GroupLobbyPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const [state, setState] = useState<GroupLobbyState>({
    participants: [],
    isFacilitator: false,
    sessionStarted: false,
    maxParticipants: 12,
  })
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const {
    styleId,
    paletteId,
    locked,
    selectStyle,
    selectPalette,
    lock: lockAvatar,
    clear: clearAvatar,
  } = useAvatarConfig({
    sessionId: groupId,
    sessionToken: sessionToken ?? '',
  })

  // Fetch anonymous group session token on mount
  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(`/api/v1/sessions/group-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groupId }),
        })
        if (res.ok) {
          const data = await res.json() as { token: string; isFacilitator: boolean; maxParticipants: number }
          setSessionToken(data.token)
          setState((s) => ({
            ...s,
            isFacilitator: data.isFacilitator,
            maxParticipants: data.maxParticipants ?? 12,
          }))
        }
      } catch {
        // keep lobby without token — allow local testing
      }
    }
    fetchToken()
  }, [groupId])

  // Poll for participant list updates (WebSocket would replace this in production)
  useEffect(() => {
    if (!sessionToken) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/sessions/group/${groupId}/participants`, {
          headers: { 'X-Session-Token': sessionToken },
        })
        if (res.ok) {
          const data = await res.json() as { participants: ParticipantInfo[]; sessionStarted: boolean }
          setState((s) => ({
            ...s,
            participants: data.participants,
            sessionStarted: data.sessionStarted,
          }))
          if (data.sessionStarted) {
            router.push(`/session/${groupId}`)
          }
        }
      } catch {
        // network error — keep current state
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [sessionToken, groupId, router])

  // Countdown to session start when facilitator has started
  useEffect(() => {
    if (!state.isFacilitator || state.participants.length === 0) return
    setTimeLeft(30) // 30-second countdown for facilitator to start
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(interval)
          return null
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.isFacilitator, state.participants.length])

  const handleAvatarSelect = useCallback((newStyleId: number, newPaletteId: number) => {
    selectStyle(newStyleId)
    selectPalette(newPaletteId)
  }, [selectStyle, selectPalette])

  const handleStartSession = useCallback(async () => {
    if (!sessionToken) return
    await fetch(`/api/v1/sessions/group/${groupId}/start`, {
      method: 'POST',
      headers: { 'X-Session-Token': sessionToken },
    })
  }, [sessionToken, groupId])

  const handleLeave = useCallback(() => {
    clearAvatar()
    router.push('/dashboard')
  }, [clearAvatar, router])

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/lobby/${groupId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [groupId])

  const avatarColors = [
    { primary: '#E07A5F', accent: '#F2CC8F' },
    { primary: '#81B29A', accent: '#F2CC8F' },
    { primary: '#3D405B', accent: '#81B29A' },
    { primary: '#F2CC8F', accent: '#E07A5F' },
    { primary: '#5C6B73', accent: '#9DB4C0' },
    { primary: '#2D6A4F', accent: '#95D5B2' },
    { primary: '#1B263B', accent: '#415A77' },
    { primary: '#D4A373', accent: '#CCD5AE' },
    { primary: '#BC6C25', accent: '#D4A373' },
    { primary: '#6C757D', accent: '#ADB5BD' },
    { primary: '#7B2D8E', accent: '#C77DFF' },
    { primary: '#0077B6', accent: '#00B4D8' },
  ]

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Group Session Lobby</h1>
          <p className="text-sm text-neutral-400 font-mono">{groupId}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400">
            {state.participants.length} / {state.maxParticipants} joined
          </span>
          {!state.isFacilitator && (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-800 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Invite Link'}
            </button>
          )}
          <button
            onClick={handleLeave}
            className="px-3 py-1.5 rounded-lg border border-neutral-600 text-neutral-400 text-sm hover:bg-neutral-800 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Avatar setup (if not locked) */}
          {!locked ? (
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <AvatarSelector
                  onSelect={handleAvatarSelect}
                  onLock={lockAvatar}
                  locked={false}
                  currentStyleId={styleId ?? undefined}
                  currentPaletteId={paletteId}
                  disabled={false}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Participant grid */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
                  Waiting Room ({state.participants.length})
                </h2>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                  {state.participants.map((p) => {
                    const colors = avatarColors[(p.avatarStyleId - 1) % avatarColors.length]
                    return (
                      <div
                        key={p.id}
                        className="flex flex-col items-center gap-2 p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl"
                      >
                        {/* Avatar preview */}
                        <div className="relative">
                          <div
                            className="h-14 w-14 rounded-full"
                            style={{ background: colors.primary }}
                          />
                          {p.isFacilitator && (
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand-accent rounded-full flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20 6 9 17 4 9" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-neutral-300 text-center truncate max-w-full">
                          {p.displayName}
                        </span>
                      </div>
                    )
                  })}
                  {/* Empty slots */}
                  {Array.from({ length: Math.max(0, state.maxParticipants - state.participants.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="h-20 border-2 border-dashed border-neutral-700 rounded-xl flex items-center justify-center"
                    >
                      <span className="text-xs text-neutral-600">Empty</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilitator controls */}
              {state.isFacilitator && (
                <div className="flex flex-col items-center gap-4">
                  {timeLeft !== null && (
                    <p className="text-sm text-neutral-400">
                      Starting in <span className="font-mono text-yellow-400">{timeLeft}s</span>
                    </p>
                  )}
                  <button
                    onClick={handleStartSession}
                    disabled={state.participants.length < 1}
                    className={cn(
                      'px-6 py-3 rounded-xl font-medium text-base transition-all',
                      state.participants.length >= 1
                        ? 'bg-brand-accent text-brand-deep hover:bg-brand-accent/90'
                        : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    )}
                  >
                    {state.participants.length >= 1 ? 'Start Session' : 'Waiting for participants…'}
                  </button>
                </div>
              )}

              {!state.isFacilitator && (
                <p className="text-center text-sm text-neutral-500 mt-4">
                  Your facilitator will start the session shortly…
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}