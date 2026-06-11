'use client';

import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { DollarSign, Users, Activity, ShieldAlert, Loader2, TrendingUp, Globe } from "lucide-react";
import { format } from "date-fns";
import { GrowthChart } from "@/components/admin/GrowthChart";

type AdminStats = {
  totalRevenue?: number | string;
  activeSessions?: number;
  totalUsers?: number;
  recentAlerts?: Array<{
    id: string;
    severity?: string;
    category?: string;
    createdAt: string;
    sessionId: string;
  }>;
  growthData?: Array<{
    date: string;
    sessions: number;
  }>;
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useFetchWithTimeout<AdminStats>('/api/admin/stats');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue || '0.00'}`, change: 'Gross', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Active Sessions', value: stats?.activeSessions || 0, change: 'Live Now', icon: Activity, color: 'text-primary' },
    { label: 'Platform Users', value: stats?.totalUsers || 0, change: 'Total', icon: Users, color: 'text-blue-500' },
    { label: 'Safety Alerts', value: stats?.recentAlerts?.length || 0, change: 'Critical Priority', icon: ShieldAlert, color: 'text-rose-500' },
  ];

  const recentAlerts = stats?.recentAlerts ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
             System Monitor
           </div>
           <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nodes Online</span>
           </div>
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Control <span className="text-accent">Plane</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Global platform oversight. Monitor commerce flow, safety incidents, and infrastructure health in real-time.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:bg-muted/20 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-primary/5 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{card.change}</span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-3xl font-black text-foreground">{card.value}</p>
            </div>
            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full bg-current ${card.color}`} />
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Stats Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 h-[400px] flex flex-col shadow-sm">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-accent" />
            Growth Velocity
          </h3>
          <div className="flex-1 min-h-0">
            <GrowthChart data={stats?.growthData ?? []} />
          </div>
        </div>

        {/* Safety Feed */}
        <div className="rounded-3xl border border-border bg-card p-8 flex flex-col shadow-sm">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-8">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Live Safety Feed
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto">
             {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex flex-col gap-1 pb-4 border-b border-border last:border-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        alert.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'
                      }`}>
                        {alert.severity} • {alert.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{format(new Date(alert.createdAt), 'h:mm a')}</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground">REF: {alert.sessionId.substring(0, 12)}</p>
                  </div>
                ))
             ) : (
               <div className="flex flex-col items-center justify-center h-full opacity-35">
                 <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                 <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No Incidents Detected</p>
               </div>
             )}
          </div>
          <button className="mt-8 w-full py-3 rounded-xl bg-muted hover:bg-muted/80 text-[10px] font-black uppercase tracking-widest text-foreground transition-all border border-border">
             View All Safety Logs
          </button>
        </div>
      </div>
    </div>
  );
}
