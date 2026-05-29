'use client'
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Checkout error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-black p-6">
      <ErrorState
        title="Checkout Error"
        error="Something went wrong with your checkout. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
