import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Download, Package, Timer } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";

const stats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Upcoming", value: "2", icon: Timer },
  { label: "Packages", value: "1 active", icon: Package },
  { label: "Downloads", value: "4 ready", icon: Download },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
            Overview
          </p>
          <h1 className="mt-3 text-4xl font-bold">Your anonymous support hub.</h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            View upcoming sessions, package balance, and resources without exposing identity inside live rooms.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <article className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10" key={label}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <Icon className="h-5 w-5 text-indigo-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">{label}</p>
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <article className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Timer className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Next session</h2>
              <p className="text-gray-400 mb-6">anon-a81e. Tomorrow at 2:00 PM. Voice and avatar room.</p>
              <Link
                className="inline-flex min-h-12 items-center rounded-lg bg-indigo-600 px-6 font-semibold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                href="/lobby/group-a81e"
              >
                Join lobby
              </Link>
            </article>

            <div className="space-y-4">
              <h3 className="text-xl font-bold px-1">Session History</h3>
              <SessionHistoryTable />
            </div>
          </div>

          <aside className="space-y-6">
            <PackageBalanceCard />
            
            <article className="rounded-xl border border-white/10 bg-gray-950 p-6">
              <h3 className="text-lg font-bold mb-4">Quick Resources</h3>
              <div className="space-y-3">
                {[
                  { label: 'Stress Management Guide', href: '/dashboard/downloads' },
                  { label: 'Peer Connection FAQ', href: '/dashboard/downloads' },
                  { label: 'Crisis Response Plan', href: '/dashboard/downloads' },
                ].map(res => (
                  <Link key={res.label} href={res.href} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition group">
                    <span className="text-sm text-gray-300 group-hover:text-white transition">{res.label}</span>
                    <Download className="w-4 h-4 text-gray-500 group-hover:text-indigo-400" />
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
