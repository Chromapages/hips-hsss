import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col">
      <section className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-700">
        {/* Header Skeleton */}
        <header className="mb-10">
          <Skeleton className="h-6 w-32 bg-surface/5 border border-white/5 rounded-full mb-4" />
          <Skeleton className="h-12 w-96 bg-surface/5 border border-white/5" />
          <Skeleton className="h-4 w-120 bg-surface/5 border border-white/5 mt-4" />
        </header>

        {/* Admin Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface/5 border border-white/10 rounded-2xl p-6 h-28 flex flex-col justify-between">
              <Skeleton className="h-3 w-24 bg-surface/10" />
              <Skeleton className="h-8 w-16 bg-surface/10" />
            </div>
          ))}
        </div>

        {/* Content Table Skeleton */}
        <div className="rounded-3xl border border-white/10 bg-surface/5 p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48 bg-surface/10" />
            <Skeleton className="h-10 w-32 bg-surface/10 rounded-xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center justify-between border-b border-white/5 py-4 last:border-0">
                <Skeleton className="h-4 w-32 bg-surface/10" />
                <Skeleton className="h-4 w-64 bg-surface/10" />
                <Skeleton className="h-4 w-20 bg-surface/10" />
                <Skeleton className="h-8 w-24 bg-surface/10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
