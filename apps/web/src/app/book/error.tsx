'use client'
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function BookError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Book error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-black p-6">
      <ErrorState
        title="Booking Error"
        error="The booking page could not be loaded. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
