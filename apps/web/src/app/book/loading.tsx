import { Skeleton } from "@/components/ui/skeleton";

export default function BookLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col justify-center items-center">
      <section className="w-full max-w-xl px-6 py-10 space-y-8 animate-in fade-in duration-700">
        <header className="text-center space-y-4 mb-8">
          <Skeleton className="h-10 w-48 bg-surface/5 border border-white/5 rounded-lg mx-auto" />
          <Skeleton className="h-4 w-72 bg-surface/5 border border-white/5 mx-auto" />
        </header>

        <div className="bg-surface/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <Skeleton className="h-6 w-32 bg-surface/10" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-12 bg-surface/10 rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-6 w-32 bg-surface/10 mt-6" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 bg-surface/10 rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-12 w-full bg-surface/15 border border-white/5 rounded-xl mt-8" />
        </div>
      </section>
    </main>
  );
}
