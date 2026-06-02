"use client";

import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSWRData } from "@/hooks/useSWR";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SessionRow = {
  id: string;
  service: string;
  date: string | null;
  status?: string;
  duration?: number;
};

export default function DashboardSessionsPage() {
  const { getToken, loading: authLoading } = useAuth();

  const { data, error, isLoading } = useSWRData<{ sessions: SessionRow[] }>(
    authLoading ? null : '/api/dashboard',
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
      fetcher: async (url: string) => {
        // 10s hard cap on the entire fetch operation. Without this, a hung
        // backend or network blackhole would leave isLoading=true forever.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);
        try {
          const token = await getToken();
          if (!token) throw new Error('Unauthorized');
          const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error || `Failed to load (${res.status})`);
          }
          return res.json();
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Session list request timed out. Please refresh.');
          }
          throw error;
        } finally {
          clearTimeout(timeoutId);
        }
      },
    }
  );

  const sessions = data?.sessions ?? [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold text-white font-heading">Session history</h1>
        <p className="mt-3 text-zinc-400">Anonymous session records and statuses.</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-4">
              {/* Table header skeleton */}
              <div className="flex gap-4 px-4 py-3 bg-white/5 rounded-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              {/* Skeleton rows */}
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 px-4 py-4 border-t border-white/10">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12 rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Failed to load sessions.</p>
                <p className="mt-1 text-sm text-amber-700">{error.message}</p>
              </div>
            </div>
          ) : (
            <SessionHistoryTable sessions={sessions} />
          )}
        </div>
      </section>
  );
}