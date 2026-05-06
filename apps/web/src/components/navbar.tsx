'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@hips/ui'

export const Navbar = () => {
  const { user, signOut, loading } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-neutral-200/50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-xl font-bold text-brand-deep tracking-tight">H.I.P.S.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/services" className="text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors">Services</Link>
          <Link href="/organizations" className="text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors">Organizations</Link>
          <Link href="/donate" className="text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors">Donate</Link>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-20 bg-neutral-100 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-brand-primary">Dashboard</Link>
              <Button variant="secondary" size="sm" onClick={signOut}>Sign Out</Button>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-neutral-600 hover:text-brand-primary">Sign In</Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
