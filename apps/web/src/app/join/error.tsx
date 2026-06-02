"use client";

import { useEffect } from "react";

export default function JoinError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) {
      console.error("[JoinError] digest:", error.digest);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-primary">Join Failed</h1>
        <p className="text-text-muted mb-6">
          We couldn&apos;t connect you to this session. The link may have expired.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            type="button"
          >
            Try Again
          </button>
          <a
            href="/join"
            className="px-6 py-3 rounded-xl border border-border bg-surface font-medium text-text-secondary transition-colors hover:bg-surface-alt"
          >
            Find Another Session
          </a>
        </div>
      </div>
    </main>
  );
}
