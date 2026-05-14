'use client'

import { useEffect } from 'react'
import { Button } from '@hips/ui'
import Link from 'next/link'

export default function SessionError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Session route error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center text-white">
        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Session Error</h1>
        <p className="text-neutral-400 mb-6">
          We encountered an error with this session. Please try again.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full">
              Return to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}