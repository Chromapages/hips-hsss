"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PackageBalanceCard() {
  const [ready, setReady] = useState(false);
  const used = 3;
  const total = 5;
  const expiresAt = "2026-07-01";
  const percent = Math.round((used / total) * 100);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) {
    return <Skeleton className="h-52 rounded-lg" />;
  }

  return (
    <article className="rounded-lg border border-white/10 bg-gray-950 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">Package balance</p>
          <h2 className="mt-2 text-3xl font-bold">
            {total - used} of {total} left
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          Expires soon
        </span>
      </div>
      <progress
        aria-label="Package usage"
        className="mt-6 h-3 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-indigo-500"
        max={100}
        value={percent}
      />
      <p className="mt-3 text-sm text-gray-400">Expires {expiresAt}</p>
    </article>
  );
}
