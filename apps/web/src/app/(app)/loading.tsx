'use client'

export default function AppLoading() {
  return (
    <div className="min-h-screen bg-[var(--apple-canvas-parchment)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-64 bg-neutral-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
          </div>
          <div className="h-64 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}