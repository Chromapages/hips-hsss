"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function ServiceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Service detail error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-primary text-white p-6">
      <div
        role="alert"
        className="flex flex-col items-center justify-center p-12 text-center bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-lg mx-auto shadow-2xl shadow-black/50"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6 ring-1 ring-destructive/20">
          <AlertTriangle className="h-12 w-12" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Couldn&apos;t load this service
        </h1>
        <p className="mt-4 text-white/70 leading-relaxed">
          We hit a problem loading this service. Please try again — if it
          persists, return to the catalog.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-white/40 font-mono">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 px-8 bg-accent text-accent-foreground rounded-full font-semibold tracking-wide uppercase text-[11px] transition-all hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Try again
          </button>
          <Link
            href="/services"
            className="inline-flex items-center justify-center h-12 px-8 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
