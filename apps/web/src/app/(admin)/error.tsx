'use client'
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-900 p-6">
      <ErrorState
        title="Something went wrong"
        error="An error occurred in the admin section. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
