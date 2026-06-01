import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  title?: string
  error: Error | string
  onRetry?: () => void
  digest?: string | undefined
}

export function ErrorState({ title = "Something went wrong", error, onRetry, digest }: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-12 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-500 bg-surface border border-border rounded-3xl max-w-lg mx-auto shadow-card"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6 border border-destructive/20">
        <AlertTriangle className="h-12 w-12" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-text-primary tracking-tight">{title}</h2>
      <p className="mt-4 text-text-muted leading-relaxed">{errorMessage}</p>
      {digest ? (
        <p className="mt-2 text-xs text-text-muted font-mono">Reference: {digest}</p>
      ) : null}
      {onRetry ? (
        <div className="mt-8 flex gap-3">
          <Button
            onClick={onRetry}
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Home
          </Button>
        </div>
      ) : null}
    </div>
  )
}
