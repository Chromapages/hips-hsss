import * as React from "react"
import { LucideIcon, SearchX } from "lucide-react"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900/50 text-indigo-400 mb-4 ring-1 ring-white/10 shadow-inner">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6" variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  )
}
