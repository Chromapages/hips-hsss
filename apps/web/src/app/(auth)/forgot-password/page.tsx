'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Button } from '@hips/ui'
import { auth } from '@/lib/firebase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setStatus('idle')
    try {
      await sendPasswordResetEmail(auth, email)
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-warm px-4 py-16">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-deep">Reset password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your account email and we will send a reset link if the account exists.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          {status === 'sent' && (
            <p className="rounded-lg bg-semantic-success/10 px-3 py-2 text-sm text-semantic-success" role="status">
              Check your email for a password reset link.
            </p>
          )}
          {status === 'error' && (
            <p className="rounded-lg bg-semantic-error/10 px-3 py-2 text-sm text-semantic-error" role="alert">
              We could not send a reset link. Please try again.
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
        <Link href="/sign-in" className="mt-5 inline-block text-sm text-brand-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
