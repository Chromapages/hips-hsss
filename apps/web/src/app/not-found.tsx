import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-warm px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-brand-deep">Page not found</h1>
        <p className="mt-4 text-neutral-600">
          The page you are looking for is not available.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-primary px-5 py-3 text-sm font-medium text-white">
          Return home
        </Link>
      </div>
    </main>
  )
}
