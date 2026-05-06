'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { SkeletonText } from '@hips/ui'

const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/donate',
  '/services',
]

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
      router.replace('/sign-in?error=insufficient_permissions')
    }
  }, [user, loading, pathname, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-full max-w-sm px-4 space-y-4">
          <SkeletonText lines={1} className="h-8" />
          <SkeletonText lines={3} />
        </div>
      </div>
    )
  }

  if (!user) return null

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900">Access denied</h2>
          <p className="mt-2 text-neutral-600">You don&apos;t have permission to view this page.</p>
          <a href="/sign-in" className="mt-4 text-sm text-brand-primary hover:underline">Return to sign in</a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function isPublicPath(path: string) {
  return PUBLIC_PATHS.some((p) => path.startsWith(p) || path === p)
}