'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertOctagon, Phone, MessageSquare, MapPin } from 'lucide-react'
import { Button } from '@hips/ui'
import { cn } from '@hips/ui'

interface CrisisEscalationProps {
  /** Session ID — used to display anonymous reference only */
  sessionId: string
  /** Whether the overlay is visible */
  visible: boolean
  /** Local emergency resource retrieved via crisis protocol (region/country lookup) */
  localResource?: {
    region?: string
    country?: string
    emergencyNumber?: string
  }
  /** Called when user chooses to stay in session */
  onStayInSession: () => void
  /** Called when user chooses to end session safely */
  onEndSession: () => void
  /** Loading state while vault access is in progress */
  loading?: boolean
  /** Error state */
  error?: string
}

const HEADING_ID = 'crisis-overlay-heading'
const RESOURCE_LIST_ID = 'crisis-resource-list'

export function CrisisEscalation({
  sessionId,
  visible,
  localResource,
  onStayInSession,
  onEndSession,
  loading = false,
  error,
}: CrisisEscalationProps) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus on first focusable element when overlay opens
  useEffect(() => {
    if (visible && firstFocusRef.current) {
      firstFocusRef.current.focus()
    }
  }, [visible])

  // Focus trap — keep focus within overlay
  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      // Escape does NOT close crisis overlay — explicit action only
      if (e.key === 'Escape') {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!mounted || !visible) return null

  const content = (
    <div
      ref={overlayRef}
      role="alertdialog"
      aria-labelledby={HEADING_ID}
      aria-describedby={RESOURCE_LIST_ID}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-crisis, #7F1D1D)' }}
    >
      {/* Decorative top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-black/20" aria-hidden="true" />

      <div
        className="w-full max-w-xl rounded-2xl bg-semantic-crisis p-8 shadow-2xl"
        style={{ maxWidth: '640px' }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="rounded-full bg-white/10 p-4">
            <AlertOctagon className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h2
          id={HEADING_ID}
          className="text-center text-2xl font-bold text-white mb-8"
          style={{ fontSize: '1.5rem', lineHeight: '2rem' }}
        >
          You're not alone. Help is available right now.
        </h2>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
            <p className="text-sm text-white/70">Connecting to resources...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-lg bg-white/10 p-4 text-center">
            <p className="text-sm text-white/80">{error}</p>
          </div>
        )}

        {/* Resource list */}
        {!loading && !error && (
          <ul
            id={RESOURCE_LIST_ID}
            className="mb-8 space-y-4"
            aria-label="Crisis resources"
          >
            {/* 988 — National Suicide & Crisis Lifeline */}
            <li className="flex items-start gap-4 rounded-lg bg-white/10 p-4">
              <Phone className="h-6 w-6 text-white shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="text-base font-bold text-white">988 Suicide & Crisis Lifeline</p>
                <a
                  href="tel:988"
                  className="mt-1 block text-xl font-bold text-white underline decoration-white/50 underline-offset-2 hover:text-white/80"
                >
                  Call or text 988
                </a>
                <p className="mt-1 text-sm text-white/70">Available 24 hours a day, 7 days a week</p>
              </div>
            </li>

            {/* Crisis Text Line */}
            <li className="flex items-start gap-4 rounded-lg bg-white/10 p-4">
              <MessageSquare className="h-6 w-6 text-white shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="text-base font-bold text-white">Crisis Text Line</p>
                <a
                  href="sms:741741&body=HOME"
                  className="mt-1 block text-xl font-bold text-white underline decoration-white/50 underline-offset-2 hover:text-white/80"
                >
                  Text HOME to 741741
                </a>
                <p className="mt-1 text-sm text-white/70">Text-based support, anytime</p>
              </div>
            </li>

            {/* Local resource — only shown if vault access succeeded */}
            {localResource?.emergencyNumber && (
              <li className="flex items-start gap-4 rounded-lg bg-white/10 p-4">
                <MapPin className="h-6 w-6 text-white shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-base font-bold text-white">Local Emergency Services</p>
                  <a
                    href={`tel:${localResource.emergencyNumber.replace(/\D/g, '')}`}
                    className="mt-1 block text-xl font-bold text-white underline decoration-white/50 underline-offset-2 hover:text-white/80"
                  >
                    {localResource.emergencyNumber}
                  </a>
                  {localResource.region && localResource.country && (
                    <p className="mt-1 text-sm text-white/70">
                      {localResource.region}, {localResource.country}
                    </p>
                  )}
                </div>
              </li>
            )}
          </ul>
        )}

        {/* Session info — anonymous only */}
        <p className="mb-8 text-center text-sm text-white/50">
          Session{' '}
          <span className="font-mono text-white/70">{sessionId.slice(0, 8)}</span>
          {' '}· Crisis support is confidential and free
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button
            ref={firstFocusRef}
            variant="primary"
            size="lg"
            className="w-full bg-white text-semantic-crisis hover:bg-white/90 focus:ring-white/50"
            onClick={onStayInSession}
          >
            Stay in session
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10 focus:ring-white/30"
            onClick={onEndSession}
          >
            End session safely
          </Button>
        </div>

        {/* Screen reader announcement */}
        <div className="sr-only" role="status" aria-live="assertive">
          Crisis resources. Help is available. Contact 988 or text HOME to 741741.
        </div>
      </div>

      {/* Backdrop — dark */}
      <div
        className="fixed inset-0 -z-10 bg-black/60"
        aria-hidden="true"
      />
    </div>
  )

  // Portal to body to escape stacking contexts
  return createPortal(content, document.body)
}

export type { CrisisEscalationProps }