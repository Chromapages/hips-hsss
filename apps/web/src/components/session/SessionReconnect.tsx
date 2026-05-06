'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@hips/ui'

interface ReconnectState {
  phase: 'connected' | 'reconnecting' | 'failed' | 'ended'
  attemptCount: number
  maxAttempts: number
  countdown: number // seconds until next retry
}

interface SessionReconnectProps {
  state: ReconnectState
  onRetry: () => void
  onEnd: () => void
}

/**
 * WebRTC connection drop + reconnect UI.
 * Shows when the WebSocket connection drops mid-session.
 * Grants a 2-minute reconnect window before auto-teardown.
 */
export function SessionReconnect({ state, onRetry, onEnd }: SessionReconnectProps) {
  const { phase, attemptCount, maxAttempts, countdown } = state
  const [localCountdown, setLocalCountdown] = useState(countdown)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (phase !== 'reconnecting') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setLocalCountdown(countdown)
      return
    }
    setLocalCountdown(countdown)
    intervalRef.current = setInterval(() => {
      setLocalCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase, countdown])

  if (phase === 'connected') return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
      role="alertdialog"
      aria-live="polite"
      aria-label="Connection issue"
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        {/* Animated icon */}
        <div className="mb-5 flex justify-center">
          <div
            className={cn(
              'h-14 w-14 rounded-full flex items-center justify-center',
              phase === 'reconnecting' && 'bg-yellow-900/50 border border-yellow-700',
              phase === 'failed' && 'bg-red-900/50 border border-red-700',
              phase === 'ended' && 'bg-slate-700 border border-slate-600'
            )}
          >
            {phase === 'reconnecting' && (
              <svg className="h-7 w-7 text-yellow-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {phase === 'failed' && (
              <svg className="h-7 w-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {phase === 'ended' && (
              <svg className="h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0z" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            )}
          </div>
        </div>

        {phase === 'reconnecting' && (
          <>
            <h2 className="text-lg font-bold text-white mb-2">Reconnecting…</h2>
            <p className="text-sm text-slate-400 mb-1">
              Your connection dropped. Attempting to reconnect…
            </p>
            <p className="text-xs text-slate-500 mb-5">
              Attempt {attemptCount} of {maxAttempts} — retrying in {localCountdown}s
            </p>
            <div className="w-full bg-slate-700 rounded-full h-1 mb-5">
              <div
                className="h-1 rounded-full bg-yellow-500 transition-all duration-1000"
                style={{ width: `${((maxAttempts - attemptCount) / maxAttempts) * 100}%` }}
              />
            </div>
            <button
              onClick={onEnd}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 text-sm hover:bg-slate-700 transition-colors"
            >
              End Session Now
            </button>
          </>
        )}

        {phase === 'failed' && (
          <>
            <h2 className="text-lg font-bold text-white mb-2">Connection Lost</h2>
            <p className="text-sm text-slate-400 mb-5">
              We could not restore your connection after {maxAttempts} attempts.
              Your session will now end.
            </p>
            <button
              onClick={onEnd}
              className="px-5 py-2.5 rounded-lg bg-brand-accent text-brand-deep font-medium text-sm hover:bg-brand-accent/90 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}

        {phase === 'ended' && (
          <>
            <h2 className="text-lg font-bold text-white mb-2">Session Ended</h2>
            <p className="text-sm text-slate-400 mb-5">
              Your session has ended. Thank you for participating.
            </p>
            <button
              onClick={onEnd}
              className="px-5 py-2.5 rounded-lg bg-brand-accent text-brand-deep font-medium text-sm hover:bg-brand-accent/90 transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  )
}
