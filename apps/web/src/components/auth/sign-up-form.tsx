'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@hips/ui'
import { useAuth } from '@/components/providers/auth-provider'
import { getFirebaseAuthErrorMessage } from '@/lib/firebase/auth-helpers'

const schema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters.').max(50),
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = useMemo(() => {
    let s = 0
    if (password.length >= 8) s++
    if (password.length >= 12) s++
    if (/[A-Z]/.test(password)) s++
    if (/[a-z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  }, [password])

  const label = score < 3 ? 'Weak' : score < 5 ? 'Fair' : 'Strong'
  const color = score < 3 ? 'bg-semantic-error' : score < 5 ? 'bg-semantic-warning' : 'bg-semantic-success'

  return (
    <div className="space-y-1" aria-live="polite" aria-label={`Password strength: ${label}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? color : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500">
        {label} {score > 0 && `(${score}/5 criteria met)`}
      </p>
    </div>
  )
}

export function SignUpForm() {
  const { signUp, signInWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')

  const onSubmit = async (values: FormValues) => {
    setGlobalError(null)
    try {
      await signUp(values.email, values.password, values.displayName)
      setSuccess(true)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? 'unknown'
      setGlobalError(getFirebaseAuthErrorMessage(code))
    }
  }

  const handleGoogleSignIn = async () => {
    setGlobalError(null)
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? 'unknown'
      setGlobalError(getFirebaseAuthErrorMessage(code))
    } finally {
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-success/10">
          <svg className="h-6 w-6 text-semantic-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Check your email</h2>
        <p className="text-sm text-neutral-600">
          We sent a verification link to your email. Click the link to activate your account, then sign in.
        </p>
        <Button variant="primary" size="lg" className="w-full" onClick={() => window.location.href = '/sign-in'}>
          Go to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Privacy notice */}
      <div className="rounded-lg bg-brand-primary/5 border border-brand-primary/10 px-4 py-3 text-xs text-brand-primary">
        <strong>Your privacy is protected.</strong> We store only a Firebase UID — no email, name, or IP address in our commerce or session databases. PII is held in an isolated vault accessible only to you.
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
      >
        {googleLoading ? (
          <svg className="h-5 w-5 animate-spin text-neutral-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500">or</span>
        </div>
      </div>

      {/* Sign-up Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {globalError && (
          <div className="rounded-lg bg-semantic-error/10 border border-semantic-error/20 px-4 py-3 text-sm text-semantic-error" role="alert">
            {globalError}
          </div>
        )}

        {/* Display Name */}
        <div className="space-y-1.5">
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700">
            Your name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              placeholder="Alex Rivera"
              aria-describedby={errors.displayName ? "displayName-error" : undefined}
              aria-invalid={errors.displayName ? "true" : undefined}
              className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
              {...register('displayName')}
            />
          </div>
          {errors.displayName && (
            <p id="displayName-error" className="text-xs text-semantic-error" role="alert">{errors.displayName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : undefined}
              className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-xs text-semantic-error" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={errors.password ? "true" : undefined}
              className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword
                ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          {passwordValue && <PasswordStrengthIndicator password={passwordValue} />}
          {errors.password && (
            <p id="password-error" className="text-xs text-semantic-error" role="alert">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              aria-invalid={errors.confirmPassword ? "true" : undefined}
              className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-xs text-semantic-error" role="alert">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-brand-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}