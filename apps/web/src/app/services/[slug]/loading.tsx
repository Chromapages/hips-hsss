export default function ServiceDetailLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading service details"
      className="min-h-screen bg-primary text-white pb-32 overflow-x-hidden"
    >
      <header className="relative pt-24 pb-20 border-b border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="h-4 w-32 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-white/5 animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-24 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
              </div>
              <div className="h-12 w-3/4 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
              <div className="mt-6 h-6 w-full rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
              <div className="mt-3 h-6 w-2/3 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-24 rounded-2xl bg-white/5 animate-pulse motion-reduce:animate-none" />
              <div className="h-10 w-32 rounded-2xl bg-white/5 animate-pulse motion-reduce:animate-none" />
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 max-w-6xl py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-7 space-y-20">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-1/2 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
                <div className="h-4 w-full rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
                <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse motion-reduce:animate-none" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="h-80 w-full rounded-3xl bg-white/5 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </section>
    </main>
  );
}
