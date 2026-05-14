'use client'

export default function SessionLoading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 bg-neutral-700 rounded-full mx-auto mb-4" />
        <div className="h-6 w-48 bg-neutral-700 rounded" />
        <p className="text-neutral-500 mt-2">Loading session...</p>
      </div>
    </div>
  )
}