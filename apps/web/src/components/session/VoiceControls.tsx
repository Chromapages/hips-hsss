'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@hips/ui'

interface VoiceControlsProps {
  muted: boolean
  onMuteToggle: () => void
  onEndSession: () => void
  onFlag: () => void
  onGesture?: (gesture: string) => void
  disabled?: boolean
  isFacilitator?: boolean
}

const GESTURES = ['Wave', 'Raise Hand', 'Nod', 'Shrug', 'Lean Forward']

export function VoiceControls({
  muted,
  onMuteToggle,
  onEndSession,
  onFlag,
  onGesture,
  disabled = false,
  isFacilitator = false,
}: VoiceControlsProps) {
  const [showGestures, setShowGestures] = useState(false)
  const [showFlagConfirm, setShowFlagConfirm] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good')

  // Simulate connection quality monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.9) setConnectionQuality('poor')
      else if (rand > 0.7) setConnectionQuality('fair')
      else setConnectionQuality('good')
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const qualityColor = {
    good: 'text-green-400',
    fair: 'text-yellow-400',
    poor: 'text-red-400',
  }[connectionQuality]

  const qualityLabel = {
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  }[connectionQuality]

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-session-controls-bg backdrop-blur-md rounded-2xl border border-slate-700">
      {/* Left: connection quality */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className={cn(
                'w-1 rounded-full transition-colors',
                bar === 1 && 'h-2',
                bar === 2 && 'h-3',
                bar === 3 && 'h-4',
                connectionQuality === 'good' && bar <= 3 && 'bg-green-400',
                connectionQuality === 'fair' && bar <= 2 && 'bg-yellow-400',
                connectionQuality === 'poor' && bar <= 1 && 'bg-red-400',
                (connectionQuality === 'fair' && bar === 3 || connectionQuality === 'poor' && bar > 1) && 'bg-slate-600'
              )}
            />
          ))}
        </div>
        <span className={cn('text-xs font-medium', qualityColor)}>{qualityLabel}</span>
      </div>

      {/* Center: main controls */}
      <div className="flex items-center gap-3">
        {/* Mute toggle */}
        <button
          onClick={onMuteToggle}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200',
            muted
              ? 'bg-red-900 border-red-700 text-red-300 hover:bg-red-800'
              : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={muted}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="2" y1="2" x2="22" y2="22" />
              <path d="M18.89 13.23A7.12 7.12 0 0 0 16 11.57V11a8 8 0 1 0 6.58 13.89" />
              <path d="M7 10.67A8 8 0 0 1 16 10.67V11" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* End session */}
        <button
          onClick={onEndSession}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full bg-red-800 border-2 border-red-700 text-red-200 hover:bg-red-700 transition-all duration-200',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          aria-label="End session"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0z" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>

        {/* Flag */}
        <button
          onClick={() => setShowFlagConfirm(true)}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-600 text-slate-400 hover:border-orange-500 hover:text-orange-400 transition-all duration-200',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          aria-label="Flag a concern"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>
      </div>

      {/* Right: gesture + timer */}
      <div className="flex items-center gap-3">
        {/* Gesture dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowGestures((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={showGestures}
          >
            Gesture
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showGestures && (
            <ul
              className="absolute bottom-full mb-2 right-0 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50"
              role="listbox"
            >
              {GESTURES.map((g) => (
                <li key={g}>
                  <button
                    onClick={() => {
                      onGesture?.(g)
                      setShowGestures(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 first:rounded-t-lg last:rounded-b-lg"
                    role="option"
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Flag confirm dialog */}
        {showFlagConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Flag a Concern</h3>
              <p className="text-sm text-slate-400 mb-4">
                This will alert the facilitator. Use this only if something concerning is happening in the session.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFlagConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onFlag()
                    setShowFlagConfirm(false)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-700 text-white hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Submit Flag
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
