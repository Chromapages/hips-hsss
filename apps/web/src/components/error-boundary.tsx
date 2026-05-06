'use client'

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle
        className="h-12 w-12 text-warning mb-4"
        aria-hidden="true"
      />
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">
        Something went wrong
      </h2>
      <p className="max-w-md text-neutral-500 mb-6">
        We encountered an unexpected error. Your session is safe. Please try
        again or refresh the page.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
      <p className="mt-4 font-mono text-xs text-neutral-400">
        {process.env.NODE_ENV === 'development' && error.message}
      </p>
    </div>
  )
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  )
}
