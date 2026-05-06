'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Building2,
  DollarSign,
  ShieldAlert,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@hips/ui'

const NAV_ITEMS = [
  { href: '/bookings', label: 'Bookings', icon: Calendar },
  { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/safety', label: 'Safety', icon: ShieldAlert },
  { href: '/facilitators', label: 'Facilitators', icon: Users },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-neutral-200 bg-white transition-all duration-250',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-neutral-200 px-4">
          {!collapsed && (
            <span className="font-sans text-lg font-bold text-brand-deep">
              H.I.P.S.
            </span>
          )}
          {collapsed && (
            <span className="font-sans text-lg font-bold text-brand-deep">H</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2" role="navigation" aria-label="Admin">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex h-12 items-center justify-center border-t border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
          <div className="flex flex-col">
            <h1 className="font-sans text-sm font-semibold text-neutral-900">
              Admin Panel
            </h1>
            <p className="text-xs text-neutral-500">H.I.P.S. Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-neutral-400">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
