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
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-lg mx-auto shadow-2xl shadow-black/50">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6 ring-1 ring-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-4 text-zinc-400 leading-relaxed">{errorMessage}</p>
      {onRetry && (
        <div className="mt-8 flex gap-3">
          <Button 
            onClick={onRetry} 
            className="px-8 h-12 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition-all font-semibold"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="ghost"
            className="h-12 px-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            Home
          </Button>
        </div>
      )}
    </div>
  )
}
