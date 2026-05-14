'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@hips/ui'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/organizations', label: 'Organizations' },
  { href: '/donate', label: 'Donate' },
]

export const Navbar = () => {
  const { user, signOut, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-neutral-200/50 bg-white/80 backdrop-blur-md" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="H.I.P.S. Home">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-brand-deep tracking-tight">H.I.P.S.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-2 rounded-md px-2 py-1"
                role="listitem"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-20 bg-neutral-100 animate-pulse rounded-lg" aria-hidden="true" />
            ) : user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-brand-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 rounded-md px-2 py-1">
                  Dashboard
                </Link>
                <Button variant="secondary" size="sm" onClick={signOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-neutral-600 hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 rounded-md px-2 py-1">
                  Sign In
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-600 hover:text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-30 bg-white pt-16 px-4 pb-6 flex flex-col gap-4 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-lg font-medium text-neutral-700 hover:text-brand-primary py-3 px-2 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth */}
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="h-12 bg-neutral-100 animate-pulse rounded-lg" aria-hidden="true" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-center py-3 px-4 rounded-lg bg-brand-primary/10 text-brand-primary font-medium hover:bg-brand-primary/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button variant="secondary" size="lg" onClick={() => { signOut(); setMobileMenuOpen(false) }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-center py-3 px-4 rounded-lg border border-brand-primary text-brand-primary font-medium hover:bg-brand-primary/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Close button */}
          <button
            className="absolute top-20 right-4 p-2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}