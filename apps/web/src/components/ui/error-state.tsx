import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  title?: string
  error: Error | string
  onRetry?: () => void
}

export function ErrorState({ title = "Something went wrong", error, onRetry }: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-950/50 text-red-400 mb-4 ring-1 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 max-w-sm">{errorMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-6 bg-red-600 hover:bg-red-700 text-white" variant="default">
          Try Again
        </Button>
      )}
    </div>
  )
}
