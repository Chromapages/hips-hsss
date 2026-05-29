'use client'
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Services error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-black p-6">
      <ErrorState
        title="Services Error"
        error="The services page could not be loaded. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
