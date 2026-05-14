'use client'

import { useEffect } from 'react'
import { Button } from '@hips/ui'
import Link from 'next/link'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Public route error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[var(--apple-canvas-parchment)] flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
        <p className="text-neutral-600 mb-6">
          We encountered an error loading this page. Please try again.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Link href="/" className="block">
            <Button variant="secondary" className="w-full">
              Return home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}