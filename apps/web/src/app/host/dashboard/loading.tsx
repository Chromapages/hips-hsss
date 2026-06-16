import { Skeleton } from "@/components/ui/skeleton";

export default function HostDashboardLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col">
      <section className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-700">
        {/* Header Skeleton */}
        <header className="mb-10">
          <Skeleton className="h-6 w-32 bg-surface/5 border border-white/5 rounded-full mb-4" />
          <Skeleton className="h-12 w-96 bg-surface/5 border border-white/5" />
          <Skeleton className="h-4 w-120 bg-surface/5 border border-white/5 mt-4" />
        </header>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-surface/5 p-6 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-surface/10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-surface/10" />
                <Skeleton className="h-6 w-12 bg-surface/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Host Dashboard content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-white/10 bg-surface/5 p-8 space-y-4">
              <Skeleton className="h-8 w-64 bg-surface/10" />
              <Skeleton className="h-20 bg-surface/10 rounded-xl" />
              <Skeleton className="h-20 bg-surface/10 rounded-xl" />
            </div>

            <div className="rounded-3xl border border-white/10 bg-surface/5 p-8 space-y-4">
              <Skeleton className="h-8 w-64 bg-surface/10" />
              <div className="space-y-2">
                <Skeleton className="h-12 bg-surface/10 rounded-xl" />
                <Skeleton className="h-12 bg-surface/10 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-surface/5 p-6 space-y-4">
              <Skeleton className="h-6 w-32 bg-surface/10" />
              <Skeleton className="h-44 bg-surface/10 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
