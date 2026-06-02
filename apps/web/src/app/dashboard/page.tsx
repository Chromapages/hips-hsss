"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Download, Package, Timer, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSWRData } from "@/hooks/useSWR";
import { format } from "date-fns";
import { toast } from "sonner";

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

  const { data, error, isLoading } = useSWRData<DashboardData>(authLoading ? null : 'dashboard', {
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
          console.error('[Dashboard] Data validation failed:', error.errors);
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
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#173B57]" />
      </div>
    );
  }

  const dashboardData = data ?? emptyDashboardData;

  const upcomingSessions = dashboardData.sessions.filter(
    s => s.status === 'SCHEDULED' || s.status === 'UPCOMING'
  );
  const upcomingCount = upcomingSessions.length;
  const nextUpId = upcomingSessions[0]?.id;

  const statsList: { label: string; value: string; icon: LucideIcon; action?: () => void }[] = [
    { label: "Upcoming", value: dashboardData.stats.upcoming.toString(), icon: Timer },
    { label: "Packages", value: `${dashboardData.stats.packages} active`, icon: Package },
    { label: "Join Session", value: upcomingCount > 0 ? `${upcomingCount} ready` : "None", icon: Timer, action: () => {
      if (nextUpId) router.push(`/session/${nextUpId}`);
    }},
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#173B57] animate-pulse" />
              Mission Control
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter text-white">Your anonymous hub.</h1>
            <p className="mt-4 max-w-2xl text-zinc-500 leading-relaxed">
              Manage your upcoming sessions, package balances, and support resources with complete privacy.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Current Date</p>
            <p className="text-lg font-bold text-white">{format(new Date(), 'MMM d, yyyy')}</p>
          </div>
        </header>

        {/* Errors are handled gracefully in the background by SWR retries, no intrusive banner shown. */}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {statsList.map(({ label, value, icon: Icon, action }) => {
            const isInteractive = !!action;
            return (
              <article
                className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950 p-8 group transition-all duration-500 ${isInteractive ? 'cursor-pointer hover:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173B57]' : ''}`}
                key={label}
                onClick={action}
                role={isInteractive ? "button" : "region"}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={`${label} stat: ${value}${isInteractive ? '. Click to interact.' : ''}`}
                onKeyDown={(e) => {
                  if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    action();
                  }
                }}
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#173B57]/10 rounded-full blur-[40px] group-hover:bg-[#173B57]/20 transition-colors" />
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#173B57]/10 group-hover:border-[#173B57]/20 transition-all">
                    <Icon className="h-6 w-6 text-zinc-400 group-hover:text-[#173B57] transition-colors" aria-hidden="true" />
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-4xl font-bold tracking-tighter text-white mb-2">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Next Session Hero Card */}
            <article className="relative overflow-hidden rounded-[2.5rem] border border-[#173B57]/20 bg-gradient-to-br from-#173B57/40 to-black p-10 group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.15)_0%,transparent_50%)] pointer-events-none" />
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Timer className="w-48 h-48" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Next Session Ready</span>
                </div>

                {dashboardData.nextSession ? (
                  <>
                    <h2 className="font-heading text-3xl font-bold tracking-tighter text-white mb-4">
                      {dashboardData.nextSession.serviceName}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-[#173B57] mb-10">
                      <Timer className="w-4 h-4" />
                      <span>
                        {dashboardData.nextSession.startsAt
                          ? format(new Date(dashboardData.nextSession.startsAt), 'eeee, MMM d @ h:mm a')
                          : 'Time pending'}
                      </span>
                      <span>•</span>
                      <span>Anonymous Voice & Avatar Room</span>
                    </div>

                    <Link
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#173B57] px-8 text-base font-bold text-white transition-all hover:bg-[#173B57] shadow-xl shadow-[#173B57]/40 hover:scale-[1.02] active:scale-95"
                      href={`/session/${dashboardData.nextSession.id}`}
                    >
                      Enter Virtual Sanctuary
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="font-heading text-3xl font-bold tracking-tighter text-white mb-4">
                      No upcoming sessions
                    </h2>
                    <p className="text-zinc-400 mb-10">
                      You don&apos;t have any sessions scheduled. Browse our catalog to book your next support session.
                    </p>
                    <Link
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#173B57] text-white px-8 text-base font-bold transition-all hover:bg-[#173B57]/90 shadow-xl shadow-[#173B57]/20 hover:scale-[1.02] active:scale-95"
                      href="/services"
                    >
                      Browse Services
                    </Link>
                  </>
                )}
              </div>
            </article>

            {/* Session History */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold tracking-tight text-white">Session History</h3>
                <Link href="/dashboard/sessions" className="text-xs font-bold uppercase tracking-widest text-[#173B57] hover:text-[#173B57]">View All</Link>
              </div>
              <SessionHistoryTable sessions={dashboardData.sessions} />
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-8">
            {/* LiveKit System Test (Temporary) */}
            <article className="rounded-[2rem] border border-[#173B57]/20 bg-[#173B57]/5 p-8">
              <h3 className="text-lg font-bold tracking-tight text-white mb-2">Infrastructure Test</h3>
              <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed uppercase tracking-widest font-bold">Signaling & Token Engine</p>
              <button
                onClick={async () => {
                  try {
                    const token = await getToken();
                    const res = await fetch('/api/livekit/token', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    const data = await res.json();
                    if (data.token) {
                      toast.success("Token generated successfully.");
                    } else {
                      toast.error("Token generation failed: " + (data.error || JSON.stringify(data)));
                    }
                  } catch (e: unknown) {
                    toast.error("Connection test error: " + (e instanceof Error ? e.message : "Unknown error"));
                  }
                }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#173B57] text-xs font-bold text-white hover:bg-[#173B57] transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Run Connection Test
              </button>
            </article>

            <PackageBalanceCard packages={dashboardData.packages} />

            {/* Session Lobby Quick Access */}
            <article className="rounded-[2rem] border border-[#173B57]/20 bg-[#173B57]/5 p-8">
              <h3 className="text-lg font-bold tracking-tight text-white mb-2">Session Lobby</h3>
              <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed uppercase tracking-widest font-bold">Direct Session Access</p>
              <div className="space-y-3">
                <Link
                  href="/join"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#173B57]/20 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Enter a Session</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">With Session ID</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#173B57]/20 flex items-center justify-center group-hover:bg-[#173B57]/40 transition-all">
                    <ArrowRight className="w-4 h-4 text-[#173B57]" />
                  </div>
                </Link>
                {dashboardData.nextSession ? (
                  <Link
                    href={`/session/${dashboardData.nextSession.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#173B57]/20 border border-[#173B57]/30 hover:bg-[#173B57]/30 transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#173B57] group-hover:text-white transition-colors">Next Session</span>
                      <span className="text-[10px] font-bold text-[#173B57]/70 uppercase tracking-widest mt-1">{dashboardData.nextSession.serviceName}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#173B57]/30 flex items-center justify-center group-hover:bg-[#173B57]/50 transition-all">
                      <ArrowRight className="w-4 h-4 text-[#173B57]" />
                    </div>
                  </Link>
                ) : null}
                <Link
                  href="/services"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Browse Services</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Book a Session</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#173B57]/20 group-hover:text-[#173B57] transition-all">
                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-lg font-bold tracking-tight text-white mb-6">Support Resources</h3>
              <div className="space-y-3">
                {[
                  { label: 'Stress Management Guide', href: '/dashboard/downloads', type: 'PDF' },
                  { label: 'Peer Connection FAQ', href: '/dashboard/downloads', type: 'DOC' },
                  { label: 'Crisis Response Plan', href: '/dashboard/downloads', type: 'PDF' },
                ].map(res => (
                  <Link key={res.label} href={res.href} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{res.label}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{res.type} Document</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#173B57]/20 group-hover:text-[#173B57] transition-all">
                      <Download className="w-4 h-4 text-zinc-500 group-hover:text-[#173B57]" />
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
  );
}
