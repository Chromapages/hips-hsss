import { AdminLayout } from '@/app/admin/AdminLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — H.I.P.S.',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
