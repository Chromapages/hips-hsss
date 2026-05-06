'use client'

import Link from 'next/link'
import { cn } from '@hips/ui'
import { Smartphone } from 'lucide-react'

interface MobileBlockProps {
  className?: string
}

/**
 * Mobile session block page.
 * Shown when a mobile device attempts to initiate a session.
 * Renders a friendly message with a CTA to open on desktop.
 *
 * IMPORTANT: This component is rendered SERVER-SIDE via middleware/device detection.
 * The session token endpoint itself returns 403 for mobile User-Agents.
 * This component is the friendly UI for that 403 response.
 */
export function MobileBlock({ className }: MobileBlockProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center px-6',
        className
      )}
    >
      {/* Icon */}
      <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
        <Smartphone className="h-8 w-8 text-slate-400" aria-hidden="true" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-white text-center mb-3">
        Sessions require a laptop or desktop
      </h1>

      {/* Description */}
      <p className="text-center text-slate-400 max-w-sm text-base leading-relaxed mb-8">
        For your privacy and safety, live voice sessions with your facilitator
        can only be accessed from a laptop or desktop browser.
      </p>

      {/* What mobile users CAN do */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-5 mb-8">
        <p className="text-sm font-semibold text-slate-200 mb-3">On mobile, you can still:</p>
        <ul className="space-y-2 text-sm text-slate-400" role="list">
          {[
            'Browse and explore all services',
            'Book a session for later on your desktop',
            'Donate to support others',
            'Apply for scholarship access',
            'Purchase session packages',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <svg
                className="h-4 w-4 text-brand-accent mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 9" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-slate-500 mb-3">Open this page on your laptop or desktop to join your session.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-deep rounded-lg font-medium text-sm hover:bg-brand-accent/90 transition-colors"
        >
          Go to My Dashboard
        </Link>
      </div>

      {/* Safety note */}
      <p className="mt-12 text-xs text-slate-600 text-center max-w-xs">
        If you are experiencing a crisis, please call or text{' '}
        <a href="tel:988" className="text-slate-500 underline hover:text-slate-400">
          988
        </a>{' '}
        — free, confidential, 24/7.
      </p>
    </div>
  )
}
