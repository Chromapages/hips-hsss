'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type ConnectionPhase = 'connecting' | 'connected' | 'reconnecting' | 'failed' | 'ended'

interface SessionTokenState {
  token: string | null
  phase: ConnectionPhase
  attemptCount: number
  maxAttempts: number
  countdown: number
  errorCode?: string
}

interface UseSessionTokenOptions {
  sessionId: string
  onPhaseChange?: (phase: ConnectionPhase) => void
  onCrisisFlag?: (reason: string) => void
  onError?: (code: string) => void
}

/**
 * Manages the anonymous session token lifecycle including:
 * - WebSocket connection establishment
 * - Automatic reconnection with exponential backoff
 * - Crisis flag emission to the session service
 * - Cleanup on session end or unmount
 *
 * The session token is anonymous — no PII is linked to it.
 * Reconnection state is surfaced to the SessionReconnect component.
 */
export function useSessionToken({
  sessionId,
  onPhaseChange,
  onCrisisFlag,
  onError,
}: UseSessionTokenOptions) {
  const [state, setState] = useState<SessionTokenState>({
    token: null,
    phase: 'connecting',
    attemptCount: 0,
    maxAttempts: 5,
    countdown: 0,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()

  const updatePhase = useCallback((phase: ConnectionPhase) => {
    setState((s) => ({ ...s, phase }))
    onPhaseChange?.(phase)
  }, [onPhaseChange])

  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  const startCountdown = useCallback((seconds: number, onZero: () => void) => {
    clearTimers()
    setState((s) => ({ ...s, countdown: seconds }))
    countdownRef.current = setInterval(() => {
      setState((s) => {
        if (s.countdown <= 1) {
          clearInterval(countdownRef.current!)
          onZero()
          return { ...s, countdown: 0 }
        }
        return { ...s, countdown: s.countdown - 1 }
      })
    }, 1000)
  }, [clearTimers])

  const connect = useCallback(async () => {
    // Fetch anonymous session token from session service
    try {
      const response = await fetch(`/api/v1/sessions/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const code = errorData.code ?? 'TOKEN_FETCH_FAILED'
        updatePhase('failed')
        onError?.(code)
        return
      }

      const data = await response.json() as { token: string }
      const token = data.token

      setState((s) => ({ ...s, token, attemptCount: 0 }))
      updatePhase('connected')

      // Establish WebSocket connection using the token
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL ?? 'wss://session.hips.org'}/ws/${token}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        updatePhase('connected')
        setState((s) => ({ ...s, attemptCount: 0, countdown: 0 }))
      }

      ws.onclose = () => {
        if (wsRef.current !== ws) return // already replaced
        wsRef.current = null

        setState((s) => {
          if (s.phase === 'ended') return s
          if (s.attemptCount >= s.maxAttempts) {
            updatePhase('failed')
            onError?.('MAX_RECONNECT_ATTEMPTS')
            return s
          }
          return s
        })
      }

      ws.onerror = () => {
        // Let onclose handle reconnection logic
      }

    } catch {
      updatePhase('failed')
      onError?.('TOKEN_FETCH_FAILED')
    }
  }, [sessionId, updatePhase, onError])

  const attemptReconnect = useCallback(() => {
    setState((s) => {
      if (s.attemptCount >= s.maxAttempts) {
        updatePhase('failed')
        onError?.('MAX_RECONNECT_ATTEMPTS')
        return s
      }
      const nextAttempt = s.attemptCount + 1
      const delay = Math.min(2 ** nextAttempt * 1000, 30000) // max 30s

      updatePhase('reconnecting')
      startCountdown(Math.ceil(delay / 1000), () => {
        setState((prev) => ({ ...prev, attemptCount: nextAttempt }))
        connect()
      })

      return { ...s, attemptCount: nextAttempt }
    })
  }, [connect, updatePhase, onError, startCountdown])

  // Initiate connection on mount
  useEffect(() => {
    connect()
    return () => {
      clearTimers()
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect, clearTimers])

  const endSession = useCallback(() => {
    clearTimers()
    updatePhase('ended')
    wsRef.current?.close()
    wsRef.current = null
    // Redirect to dashboard
    router.push('/dashboard')
  }, [clearTimers, updatePhase, router])

  const flagCrisis = useCallback((reason: string) => {
    // Emit crisis flag to session service via REST (not WebSocket, for reliability)
    fetch(`/api/v1/sessions/${sessionId}/crisis-flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': state.token ?? '',
      },
      body: JSON.stringify({ reason, timestamp: new Date().toISOString() }),
    }).catch(() => {
      // If REST fails, try WebSocket
      wsRef.current?.send(JSON.stringify({ type: 'CRISIS_FLAG', reason }))
    })
    onCrisisFlag?.(reason)
  }, [sessionId, state.token, onCrisisFlag])

  const retryNow = useCallback(() => {
    clearTimers()
    setState((s) => ({ ...s, attemptCount: s.attemptCount + 1 }))
    connect()
  }, [connect, clearTimers])

  return {
    token: state.token,
    phase: state.phase,
    attemptCount: state.attemptCount,
    maxAttempts: state.maxAttempts,
    countdown: state.countdown,
    errorCode: state.errorCode,
    endSession,
    flagCrisis,
    retryNow,
  }
}

export type { ConnectionPhase, SessionTokenState, UseSessionTokenOptions }