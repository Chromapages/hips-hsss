import { AuthProvider } from '@/components/providers/auth-provider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <a
        href="#app-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:font-medium focus:rounded-lg focus:ring-2 focus:ring-brand-primary/30"
      >
        Skip to main content
      </a>
      <main id="app-content">
        {children}
      </main>
    </AuthProvider>
  )
}