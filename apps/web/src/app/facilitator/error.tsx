'use client'
export default function FacilitatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Facilitator Error</h1>
        <p className="text-muted-foreground mb-6">Something went wrong in the facilitator dashboard.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 font-bold text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
