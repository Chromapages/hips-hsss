'use client'

import React from 'react'
import Link from 'next/link'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { Card } from '@hips/ui'

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-brand-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-brand-secondary/5 blur-[100px] rounded-full" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 border-none shadow-2xl shadow-brand-deep/10 bg-white/80 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/20">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-brand-deep">Create your Account</h1>
          <p className="text-neutral-500 mt-2">Start your healing journey anonymously</p>
        </div>

        <SignUpForm />

        <p className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-brand-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
