'use client'

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[var(--apple-canvas-parchment)]">
      <div className="animate-pulse">
        <div className="h-[80px] bg-neutral-200" />
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
          <div className="h-12 w-64 mx-auto bg-neutral-200 rounded" />
          <div className="h-6 w-96 mx-auto bg-neutral-200 rounded" />
          <div className="h-[400px] bg-neutral-200 rounded-lg mt-8" />
        </div>
      </div>
    </div>
  )
}