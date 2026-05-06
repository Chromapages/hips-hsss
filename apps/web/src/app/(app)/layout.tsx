import { AuthProvider } from '@/components/providers/auth-provider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}