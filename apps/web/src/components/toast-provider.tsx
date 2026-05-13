'use client'

import { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { cn } from '@hips/ui'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-success/20 bg-success/5 text-success',
  error: 'border-error/20 bg-error/5 text-error',
  warning: 'border-warning/20 bg-warning/5 text-warning',
  info: 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutIdsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const isMountedRef = useRef(true)

  // Cleanup all timeouts on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      // Clear all pending timeouts
      for (const timeoutId of timeoutIdsRef.current.values()) {
        clearTimeout(timeoutId)
      }
      timeoutIdsRef.current.clear()
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    // Clear the timeout if it exists
    const timeoutId = timeoutIdsRef.current.get(id)
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutIdsRef.current.delete(id)
    }
    // Only update state if still mounted
    if (isMountedRef.current) {
      setToasts(prev => prev.filter(t => t.id !== id))
    }
  }, [])

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, variant }])

    // Store timeout ID so we can clear it if toast is dismissed early
    const timeoutId = setTimeout(() => {
      removeToast(id)
    }, 5000)
    timeoutIdsRef.current.set(id, timeoutId)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
      >
        {toasts.map(toast => {
          const Icon = ICONS[toast.variant]
          return (
            <div
              key={toast.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
                VARIANT_STYLES[toast.variant],
              )}
              role="alert"
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-neutral-900">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
