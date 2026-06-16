"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Download,
  Package,
  Timer,
  Loader2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";
import { ParticipantJourney } from "@/components/dashboard/ParticipantJourney";
import { SessionFeedbackCard } from "@/components/dashboard/SessionFeedbackCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSWRData } from "@/hooks/useSWR";
import { formatDate, formatDateTime } from "@/lib/format";
import { z } from "zod";

const DashboardSessionSchema = z.object({
  id: z.string(),
  service: z.string(),
  date: z.string().nullable(),
  status: z.string().optional(),
});

const DashboardPackageSchema = z.object({
  id: z.string(),
  service: z.string(),
  remaining: z.number(),
  total: z.number(),
});

const DashboardDataSchema = z.object({
  stats: z.object({
    upcoming: z.number(),
    packages: z.number(),
  }),
  nextSession: z.object({
    id: z.string(),
    serviceName: z.string(),
    startsAt: z.string().nullable(),
  }).nullable(),
  sessions: z.array(DashboardSessionSchema),
  packages: z.array(DashboardPackageSchema),
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;

const emptyDashboardData: DashboardData = {
  stats: { upcoming: 0, packages: 0 },
  nextSession: null,
  sessions: [],
  packages: [],
};

export default function DashboardPage() {
  const { getToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [feedbackDismissed, setFeedbackDismissed] = useState(false);

  const { data, error, isLoading, mutate } = useSWRData<DashboardData>(authLoading ? null : 'dashboard', {
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
    refreshInterval: 30_000,
    fetcher: async (key: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);
      try {
        const token = await getToken();
        if (!token) throw new Error('Unauthorized');
        const res = await fetch(`/api/${key}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          const err = new Error(json.details || json.error || 'Dashboard request failed') as Error & {
            setupUrl?: string;
          };
          err.setupUrl = json.setupUrl;
          throw err;
        }
        const json = await res.json();
        // Runtime validation to ensure data integrity
        return DashboardDataSchema.parse(json);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[Dashboard] Data validation failed:', error.issues);
          throw new Error('Received invalid data from server.');
        }
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Dashboard request timed out. Please refresh.');
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    },
  });

  if (authLoading || isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-border rounded-full" />
            <div className="h-10 w-80 bg-border rounded-lg" />
            <div className="h-4 w-96 bg-border rounded-md" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-3 w-20 bg-border rounded-md ml-auto" />
            <div className="h-6 w-32 bg-border rounded-md ml-auto" />
          </div>
        </header>

        {/* Zone A: Stat Bar Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 h-28 flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-3 w-28 bg-border rounded" />
                <div className="h-8 w-16 bg-border rounded-md" />
              </div>
              <div className="h-10 w-10 bg-border rounded-lg" />
            </div>
          ))}
        </div>

        {/* Zone B: Hero Skeleton */}
        <div className="h-48 bg-surface border border-border rounded-xl p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 w-24 bg-border rounded-full" />
            <div className="h-8 w-72 bg-border rounded-md" />
            <div className="h-4 w-96 bg-border rounded" />
          </div>
          <div className="h-12 w-44 bg-border rounded-full" />
        </div>

        {/* Zone C: Main Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-36 bg-border rounded-md" />
              <div className="h-4 w-16 bg-border rounded" />
            </div>
            <div className="h-80 bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="h-10 bg-surface rounded-md" />
              <div className="h-12 bg-surface rounded-md" />
              <div className="h-12 bg-surface rounded-md" />
              <div className="h-12 bg-surface rounded-md" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="h-44 bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="h-6 w-32 bg-border rounded-md" />
              <div className="h-12 bg-surface rounded-lg" />
            </div>
            <div className="h-56 bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="h-6 w-32 bg-border rounded-md" />
              <div className="h-12 bg-surface rounded-lg" />
              <div className="h-12 bg-surface rounded-lg" />
            </div>
          </div>
        </div>

        {/* Zone D: Crisis Strip Skeleton */}
        <div className="h-20 bg-surface border border-border rounded-xl p-5" />
      </section>
    );
  }

  const dashboardData = data ?? emptyDashboardData;

  const completedSessions = dashboardData.sessions.filter(
    s => s.status === 'COMPLETED'
  );
  const completedCount = completedSessions.length;
  const recentCompletedSession = completedSessions[0];
  const showFeedbackPrompt = recentCompletedSession &&
    !feedbackDismissed &&
    typeof window !== "undefined" &&
    localStorage.getItem(`hips-feedback-submitted-${recentCompletedSession.id}`) !== "true";

  const statsList = [
    { label: "Upcoming Sessions", value: dashboardData.stats.upcoming.toString(), icon: Timer },
    { label: "Active Packages", value: dashboardData.stats.packages.toString(), icon: Package },
    { label: "Completed Sessions", value: completedCount.toString(), icon: ShieldCheck },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Error Banner */}
      {error && !errorDismissed && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive font-body text-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error.message || "Failed to load dashboard. Showing cached or fallback data."}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => mutate()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-white font-ui font-semibold text-xs uppercase tracking-wider transition-all hover:bg-destructive/90 active:scale-95"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
            <button
              onClick={() => setErrorDismissed(true)}
              className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors font-ui text-xs uppercase tracking-wide font-bold"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Member Portal
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter text-text-primary">Your anonymous hub.</h1>
          <p className="mt-4 max-w-2xl text-text-secondary leading-relaxed font-body">
            Manage your upcoming sessions, package balances, and support resources with complete privacy.
          </p>
        </div>
        <div className="text-left md:text-right font-ui">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Current Date</p>
          <p className="text-lg font-bold text-text-primary">{formatDate(new Date())}</p>
        </div>
      </header>

      {/* Zone A: Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsList.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="bg-surface border border-border rounded-xl p-6 shadow-soft flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-ui mb-1">{label}</p>
              <p className="font-heading text-3xl font-bold text-accent">{value}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
              <Icon className="h-5 w-5 text-text-primary" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

      {/* Zone B: Next Session Hero */}
      {dashboardData.nextSession ? (
        <article className="relative overflow-hidden rounded-xl border border-border border-t-4 border-t-accent bg-surface p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-wider text-accent font-ui">
              <span>NEXT SESSION</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              {dashboardData.nextSession.serviceName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary font-body">
              <div className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-text-muted" />
                <span>
                  {dashboardData.nextSession.startsAt
                    ? formatDateTime(dashboardData.nextSession.startsAt)
                    : 'Time pending'}
                </span>
              </div>
              <span className="hidden sm:inline text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-emerald-600">Ready</span>
              </div>
              <span className="hidden sm:inline text-text-muted">•</span>
              <span>Anonymous Voice &amp; Avatar Room</span>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-pill bg-primary hover:bg-primary-dark text-white px-8 text-sm font-bold shadow-soft transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap font-ui uppercase tracking-wider"
              href={`/session/${dashboardData.nextSession.id}`}
            >
              Enter Sanctuary →
            </Link>
          </div>
        </article>
      ) : (
        <article className="relative overflow-hidden rounded-xl border border-border border-t-4 border-t-primary bg-surface p-10 shadow-soft text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
            No sessions scheduled
          </h2>
          <p className="text-text-secondary text-sm max-w-md mb-8 font-body">
            You don&apos;t have any virtual peer support sessions scheduled at this time. Get started by booking a session or enter a session code below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-pill bg-primary hover:bg-primary-dark text-white px-8 text-sm font-bold shadow-soft transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap font-ui uppercase tracking-wider"
              href="/services"
            >
              Browse Services
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-pill border border-border bg-surface text-text-primary hover:bg-surface px-8 text-sm font-bold shadow-soft transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap font-ui uppercase tracking-wider"
              href="/join"
            >
              Enter with Session ID
            </Link>
          </div>
        </article>
      )}

      {/* Zone C: Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main Column */}
        <div className="space-y-6">
          {showFeedbackPrompt && (
            <SessionFeedbackCard
              sessionId={recentCompletedSession.id}
              serviceName={recentCompletedSession.service}
              getToken={getToken}
              onSubmitted={() => setFeedbackDismissed(true)}
            />
          )}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold tracking-tight text-text-primary font-heading">Session History</h3>
            <Link 
              href="/dashboard/sessions" 
              className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark font-ui"
            >
              View All
            </Link>
          </div>
          <SessionHistoryTable sessions={dashboardData.sessions} />
        </div>

        {/* Sidebar Column */}
        <aside className="space-y-6">
          <ParticipantJourney completedCount={completedCount} />
          <PackageBalanceCard packages={dashboardData.packages} />

          {/* Quick Actions Card */}
          <article className="rounded-xl border border-border bg-surface p-6 shadow-soft space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-text-primary font-heading border-b border-border pb-3">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/demo-room"
                className="flex items-center justify-between p-3.5 rounded-lg border border-accent/30 bg-accent/5 hover:border-accent hover:bg-accent/10 transition-all group animate-pulse"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-accent group-hover:text-accent transition-colors flex items-center gap-1.5">
                    Try Demo Session
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-bold uppercase tracking-wider">Demo</span>
                  </span>
                  <span className="text-[10px] text-text-secondary font-body mt-0.5">Test WebRTC voice &amp; 3D avatar</span>
                </div>
                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/join"
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface hover:border-accent/40 hover:bg-surface transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Enter Session ID</span>
                  <span className="text-[10px] text-text-secondary font-body mt-0.5">Connect with a code</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
              </Link>

              <Link
                href="/services"
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface hover:border-accent/40 hover:bg-surface transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Browse Services</span>
                  <span className="text-[10px] text-text-secondary font-body mt-0.5">Explore support packages</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/downloads"
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface hover:border-accent/40 hover:bg-surface transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Download Resources</span>
                  <span className="text-[10px] text-text-secondary font-body mt-0.5">Guides &amp; worksheets</span>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        </aside>
      </div>

      {/* Zone D: Crisis Strip */}
      <article className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 shadow-soft">
            <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-text-primary">Immediate Support Needed?</h3>
            <p className="text-text-secondary text-xs font-body">If you are experiencing a crisis or in immediate danger, confidential help is available 24/7.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="tel:988"
            className="flex-1 md:flex-none inline-flex h-10 items-center justify-center rounded-pill bg-destructive text-white px-5 text-xs font-bold font-ui uppercase tracking-wide transition-all hover:bg-destructive/90 active:scale-95 whitespace-nowrap shadow-soft"
          >
            Call or Text 988
          </a>
          <Link
            href="/crisis"
            className="flex-1 md:flex-none inline-flex h-10 items-center justify-center rounded-pill border border-border bg-surface text-text-primary px-5 text-xs font-bold font-ui uppercase tracking-wide transition-all hover:bg-surface active:scale-95 whitespace-nowrap shadow-soft"
          >
            Crisis Resources
          </Link>
        </div>
      </article>
    </section>
  );
}
