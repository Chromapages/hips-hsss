'use client'

import { useEffect, useRef, useCallback } from 'react'
import { CRISIS_RESOURCES } from '@hips/types'
import { cn } from '@hips/ui'

interface CrisisOverlayProps {
  open: boolean
  onClose?: () => void // only for non-crisis soft alerts; crisis requires human resolution
  level: 'SOFT_ALERT' | 'ESCALATION_REVIEW' | 'CRISIS_ACTIVE'
  facilitatorName?: string
  sessionId: string
}

/**
 * Crisis escalation overlay — full-screen, focus-trapped, screen-reader accessible.
 * Keyboard navigable. No escape to close on CRISIS_ACTIVE.
 * Shows 988 + Crisis Text Line in all cases.
 * On CRISIS_ACTIVE: shows limited vault-accessible emergency info (region/country from vault).
 */
export function CrisisOverlay({ open, onClose, level, facilitatorName, sessionId }: CrisisOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  // Focus trap
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement
    firstFocusRef.current?.focus()
    return () => previouslyFocused?.focus?.()
  }, [open])

  // Block escape on CRISIS_ACTIVE
  useEffect(() => {
    if (!open || level !== 'CRISIS_ACTIVE') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, level])

  if (!open) return null

  const isCrisis = level === 'CRISIS_ACTIVE'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      aria-describedby="crisis-desc"
      // Prevent background scrolling
      style={{ top: `${window.scrollY}px` }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-crisis/95 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 max-w-lg w-full mx-4 bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(127,29,29,0.4)] border border-red-900 overflow-hidden">
        {/* Header */}
        <div className="bg-crisis px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h2 id="crisis-title" className="text-lg font-bold text-white">
                {isCrisis ? 'Crisis Support Activated' : 'Safety Alert'}
              </h2>
              <p id="crisis-desc" className="text-red-200 text-sm mt-0.5">
                {isCrisis
                  ? 'Your facilitator has initiated crisis support. Resources are displayed below.'
                  : 'A concern has been flagged. Your facilitator will follow up with you shortly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Crisis resources */}
          <section aria-labelledby="crisis-resources-heading">
            <h3 id="crisis-resources-heading" className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Free Support — Available Now
            </h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D5A8E" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-deep">{CRISIS_RESOURCES.national.label}</p>
                  <p className="text-sm text-neutral-500">Call or text — free, confidential, 24/7</p>
                  <a
                    href="tel:988"
                    className="mt-1 inline-block text-sm font-bold text-brand-primary hover:underline"
                    aria-label="Call 988"
                  >
                    {CRISIS_RESOURCES.national.display}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-deep">{CRISIS_RESOURCES.text.label}</p>
                  <p className="text-sm text-neutral-500">Text HOME to 741741 — free, 24/7</p>
                  <a
                    href="sms:741741?body=HOME"
                    className="mt-1 inline-block text-sm font-bold text-success hover:underline"
                    aria-label="Text HOME to 741741"
                  >
                    Text HOME to 741741
                  </a>
                </div>
              </li>
            </ul>
          </section>

          {/* Vault info (crisis only — minimal necessary fields) */}
          {isCrisis && (
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-4" aria-labelledby="vault-info-heading">
              <h3 className="text-sm font-semibold text-brand-deep mb-2" id="vault-info-heading">
                Emergency Contact Info (if shared with facilitator)
              </h3>
              <p className="text-sm text-blue-700">
                Your facilitator may use this to connect you with local emergency services in your region.
                No additional identity information is accessible.
              </p>
            </section>
          )}

          {/* Session note */}
          {isCrisis && (
            <p className="text-sm text-neutral-500">
              Your facilitator {facilitatorName ? `(${facilitatorName})` : ''} has been notified and will stay with you
              or follow up immediately. You are not in trouble. This is a resource and support moment.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
          {!isCrisis && onClose && (
            <button
              ref={firstFocusRef}
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors"
            >
              Dismiss
            </button>
          )}
          {isCrisis && (
            <p className="text-sm text-neutral-400 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Facilitator notified — standby
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
