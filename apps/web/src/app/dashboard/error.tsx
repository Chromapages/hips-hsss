'use client'
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-black p-6">
      <ErrorState
        title="Dashboard Error"
        error="The dashboard could not be loaded. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
