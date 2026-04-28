"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-black p-6 text-white">
      <ErrorState
        title="Something went wrong"
        error="The page could not finish loading. Try again when you are ready."
        onRetry={reset}
      />
    </main>
  );
}
