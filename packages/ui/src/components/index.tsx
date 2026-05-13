import * as React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Button ──────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'crisis'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps, ref) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'rounded-full bg-brand-primary text-white hover:bg-brand-primary/90', // Apple pill style
    secondary: 'rounded-full border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10', // Apple ghost pill
    ghost: 'rounded-full text-brand-primary hover:bg-brand-primary/5',
    destructive: 'rounded-lg bg-semantic-error text-white hover:bg-semantic-error/90',
    crisis: 'rounded-lg bg-semantic-crisis text-white ring-2 ring-semantic-crisis/50',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[48px]',
  }

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
})

// ─── Badge ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-neutral-200 text-neutral-700',
    success: 'bg-semantic-success/10 text-semantic-success',
    warning: 'bg-semantic-warning/10 text-semantic-warning',
    error: 'bg-semantic-error/10 text-semantic-error',
    info: 'bg-semantic-info/10 text-semantic-info',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-neutral-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export namespace Card {
  export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
  }
  export function Content({ className, children, ...props }: ContentProps) {
    return (
      <div className={cn('p-6', className)} {...props}>
        {children}
      </div>
    )
  }
}

export const CardContent = Card.Content

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('border-b border-neutral-200 px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900', className)} {...props}>
      {children}
    </h3>
  )
}

// ─── EmptyState ────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  heading: string
  body: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({ heading, body, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon ? (
        <div className="text-neutral-400 mb-4" aria-hidden="true">{icon}</div>
      ) : (
        <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4" aria-hidden="true">
          <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900">{heading}</h3>
      <p className="mt-1 text-sm text-neutral-600 max-w-sm">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-neutral-200 rounded animate-pulse" style={{ width: `${60 + (i * 17) % 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  )
}

// ─── CrisisEscalation ─────────────────────────────────────────────────────────

export interface CrisisEscalationProps {
  open: boolean
  onStayInSession: () => void
  onEndSessionSafely: () => void
  localResources?: string
}

export function CrisisEscalation({ open, onStayInSession, onEndSessionSafely, localResources }: CrisisEscalationProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(127, 29, 29, 0.95)', backdropFilter: 'blur(4px)' }}
      role="alertdialog"
      aria-labelledby="crisis-heading"
      aria-describedby="crisis-resources"
      aria-modal="true"
    >
      <div className="max-w-md mx-auto px-6 py-12 text-center space-y-8">
        {/* Crisis icon */}
        <svg className="h-16 w-16 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        <h2 id="crisis-heading" className="text-2xl font-bold text-white">
          You're not alone. Help is available right now.
        </h2>

        <div id="crisis-resources" className="rounded-xl bg-white/10 p-6 space-y-4 text-left">
          <div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-wide">988 Suicide & Crisis Lifeline</p>
            <a href="tel:988" className="mt-1 text-3xl font-bold text-white hover:underline block">
              Call or text <span className="underline">988</span>
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-wide">Crisis Text Line</p>
            <a href="sms:741741&body=HOME" className="mt-1 text-3xl font-bold text-white hover:underline block">
              Text HOME to <span className="underline">741741</span>
            </a>
          </div>
          {localResources && (
            <div>
              <p className="text-sm font-medium text-white/80 uppercase tracking-wide">Local Resources</p>
              <p className="mt-1 text-lg text-white">{localResources}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onStayInSession}
            className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-semantic-crisis hover:bg-white/90 transition-colors duration-150"
          >
            Stay in session
          </button>
          <button
            onClick={onEndSessionSafely}
            className="w-full rounded-lg border-2 border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors duration-150"
          >
            End session safely
          </button>
        </div>
      </div>
    </div>
  )
}


export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onDismiss?: () => void
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  const styles = {
    success: 'bg-semantic-success text-white',
    error: 'bg-semantic-error text-white',
    warning: 'bg-semantic-warning text-white',
    info: 'bg-semantic-info text-white',
  }

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }

  return (
    <div
      className={cn('flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-slide-in', styles[type])}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-auto opacity-80 hover:opacity-100" aria-label="Dismiss">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
