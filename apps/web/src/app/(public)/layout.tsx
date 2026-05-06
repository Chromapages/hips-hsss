import React from 'react'
import { Navbar } from '@/components/navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} H.I.P.S. — Healing Individuals through Peer Support. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-neutral-400">
            Strictly Anonymous. HIPAA Compliant. Zero-PII Policy.
          </p>
        </div>
      </footer>
    </div>
  )
}
