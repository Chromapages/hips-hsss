"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Download, Package, Timer, Loader2, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { format } from "date-fns";

type DashboardData = {
  stats: {
    upcoming: number;
    packages: number;
  };
  nextSession: {
    id: string;
    serviceName: string;
    startsAt: string | null;
  } | null;
  sessions: Array<{
    id: string;
    service: string;
    date: string | null;
    status?: string;
  }>;
  packages: Array<{
    id: string;
    service: string;
    remaining: number;
    total: number;
  }>;
};

type DashboardError = {
  message: string;
  setupUrl?: string;
};

const emptyDashboardData: DashboardData = {
  stats: {
    upcoming: 0,
    packages: 0,
  },
  nextSession: null,
  sessions: [],
  packages: [],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(emptyDashboardData);
  const [error, setError] = useState<DashboardError | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (!token) {
          setError({ message: "Sign in to view your dashboard." });
          return;
        }

        const res = await fetch('/api/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError({
            message: json.details || json.error || 'Dashboard request failed',
            setupUrl: json.setupUrl,
          });
          return;
        }

        setData(json);
        setError(null);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setError({
          message: error instanceof Error ? error.message : 'Failed to load dashboard.',
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  const statsList: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Upcoming", value: data.stats.upcoming.toString(), icon: Timer },
    { label: "Packages", value: `${data.stats.packages} active`, icon: Package },
    { label: "Downloads", value: "4 ready", icon: Download },
  ];

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Mission Control
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Your anonymous hub.</h1>
            <p className="mt-4 max-w-2xl text-zinc-500 leading-relaxed">
              Manage your upcoming sessions, package balances, and support resources with complete privacy.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Current Date</p>
            <p className="text-lg font-bold text-white">{format(new Date(), 'MMM d, yyyy')}</p>
          </div>
        </header>

        {error ? (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-amber-100">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Dashboard data could not load.</p>
              <p className="mt-1 text-sm text-amber-100/75">{error.message}</p>
              {error.setupUrl ? (
                <a
                  className="mt-3 inline-flex text-sm font-bold text-amber-50 underline decoration-amber-200/50 underline-offset-4 hover:text-white"
                  href={error.setupUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Enable Firestore API
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {statsList.map(({ label, value, icon: Icon }) => (
            <article className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950 p-8 group hover:border-white/10 transition-all duration-500" key={label}>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-colors" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20 transition-all">
                  <Icon className="h-6 w-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-black tracking-tighter text-white mb-2">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Column */}
          <div className="space-y-8">
            {/* Next Session Hero Card */}
            <article className="relative overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-black p-10 group">
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

                {data.nextSession ? (
                  <>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-4">
                      {data.nextSession.serviceName}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-indigo-200 mb-10">
                      <Timer className="w-4 h-4" />
                      <span>
                        {data.nextSession.startsAt
                          ? format(new Date(data.nextSession.startsAt), 'eeee, MMM d @ h:mm a')
                          : 'Time pending'}
                      </span>
                      <span>•</span>
                      <span>Anonymous Voice & Avatar Room</span>
                    </div>
                    
                    <Link
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white transition-all hover:bg-indigo-500 shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95"
                      href={`/session/${data.nextSession.id}`}
                    >
                      Enter Virtual Sanctuary
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-4">
                      No upcoming sessions
                    </h2>
                    <p className="text-zinc-400 mb-10">
                      You don&apos;t have any sessions scheduled. Browse our catalog to book your next support session.
                    </p>
                    <Link
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-white text-black px-8 text-base font-bold transition-all hover:bg-zinc-200 shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-95"
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
                <Link href="/dashboard/sessions" className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300">View All</Link>
              </div>
              <SessionHistoryTable sessions={data.sessions} />
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-8">
            {/* LiveKit System Test (Temporary) */}
            <article className="rounded-[2rem] border border-indigo-500/20 bg-indigo-500/5 p-8">
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
                      console.log("LIVEKIT TOKEN:", data.token);
                      alert("SUCCESS: Token generated! Check console for the full JWT.");
                    } else {
                      alert("FAILED: " + JSON.stringify(data));
                    }
                  } catch (e: any) {
                    alert("ERROR: " + e.message);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Run Connection Test
              </button>
            </article>

            <PackageBalanceCard packages={data.packages} />
            
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
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                      <Download className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </DashboardLayout>
  );
}
