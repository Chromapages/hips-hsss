export default function ServicesLoading() {
  return (
    <main id="main" tabIndex={-1}
      role="status"
      aria-live="polite"
      aria-label="Loading services"
      className="mx-auto max-w-7xl px-6 pt-24 pb-12 lg:px-8"
    >
      <div className="max-w-2xl">
        <div className="h-12 w-72 rounded-md bg-surface animate-pulse motion-reduce:animate-none" />
        <div className="mt-6 h-6 w-full max-w-xl rounded-md bg-surface animate-pulse motion-reduce:animate-none" />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-3xl bg-surface p-8 ring-1 ring-border"
          >
            <div className="flex items-center gap-x-4">
              <div className="h-12 w-12 rounded-xl bg-border animate-pulse motion-reduce:animate-none" />
              <div className="h-6 w-32 rounded-md bg-border animate-pulse motion-reduce:animate-none" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-border animate-pulse motion-reduce:animate-none" />
              <div className="h-4 w-3/4 rounded bg-border animate-pulse motion-reduce:animate-none" />
            </div>
            <div className="mt-8 h-10 w-24 rounded-md bg-border animate-pulse motion-reduce:animate-none" />
            <div className="mt-8 h-12 w-full rounded-xl bg-border animate-pulse motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </main>
  );
}
