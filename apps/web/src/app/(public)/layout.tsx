import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:font-medium focus:rounded-lg focus:ring-2 focus:ring-brand-primary/30"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} H.I.P.S. - Healing Individuals through Peer Support. All rights reserved.
          </p>
          <nav aria-label="Footer" className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500">
            <Link href="/about" className="hover:text-brand-primary">About</Link>
            <Link href="/anonymity" className="hover:text-brand-primary">Anonymity</Link>
            <Link href="/privacy" className="hover:text-brand-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-primary">Terms</Link>
          </nav>
          <p className="mt-3 text-xs text-neutral-400">Strictly anonymous. Zero-PII session policy.</p>
        </div>
      </footer>
    </div>
  )
}
