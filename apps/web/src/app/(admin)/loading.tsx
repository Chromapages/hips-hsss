'use client'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}