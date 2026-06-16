import { Skeleton } from "@/components/ui/skeleton";

export default function DonateLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 animate-in fade-in duration-700">
        {/* Hero Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-12">
          <div className="space-y-6">
            <Skeleton className="h-6 w-32 bg-surface/5 border border-white/5 rounded-full" />
            <Skeleton className="h-16 w-80 bg-surface/5 border border-white/5" />
            <Skeleton className="h-4 w-full bg-surface/5 border border-white/5" />
            <Skeleton className="h-4 w-full bg-surface/5 border border-white/5" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36 bg-surface/10 rounded-full" />
              <Skeleton className="h-12 w-36 bg-surface/10 rounded-full" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface/5 p-8 space-y-6">
            <Skeleton className="h-8 w-48 bg-surface/10" />
            <Skeleton className="h-4 w-full bg-surface/10" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 bg-surface/10 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-12 w-full bg-surface/15 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
