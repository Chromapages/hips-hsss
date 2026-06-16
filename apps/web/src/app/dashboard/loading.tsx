import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 animate-in fade-in duration-700">
        {/* Header Skeleton */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 bg-surface/5 border border-white/5" />
            <Skeleton className="h-10 w-80 bg-surface/5 border border-white/5" />
            <Skeleton className="h-4 w-96 bg-surface/5 border border-white/5" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-3 w-20 bg-surface/5 ml-auto" />
            <Skeleton className="h-6 w-32 bg-surface/5 ml-auto" />
          </div>
        </header>

        {/* Stat Bar Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 h-28 flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-28 bg-surface/10" />
                <Skeleton className="h-8 w-16 bg-surface/10" />
              </div>
              <Skeleton className="h-10 w-10 bg-surface/10 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Hero Skeleton */}
        <div className="h-48 bg-surface/5 border border-white/10 backdrop-blur-sm rounded-xl p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24 bg-surface/10 rounded-full" />
            <Skeleton className="h-8 w-72 bg-surface/10" />
            <Skeleton className="h-4 w-96 bg-surface/10" />
          </div>
          <Skeleton className="h-12 w-44 bg-surface/10 rounded-full" />
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36 bg-surface/10" />
              <Skeleton className="h-4 w-16 bg-surface/10" />
            </div>
            <div className="h-80 bg-surface/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <Skeleton className="h-10 bg-surface/10 rounded-md" />
              <Skeleton className="h-12 bg-surface/10 rounded-md" />
              <Skeleton className="h-12 bg-surface/10 rounded-md" />
              <Skeleton className="h-12 bg-surface/10 rounded-md" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="h-44 bg-surface/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-32 bg-surface/10" />
              <Skeleton className="h-12 bg-surface/10 rounded-lg" />
            </div>
            <div className="h-56 bg-surface/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-32 bg-surface/10" />
              <Skeleton className="h-12 bg-surface/10 rounded-lg" />
              <Skeleton className="h-12 bg-surface/10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
