'use client';

import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { DollarSign, Users, Activity, ShieldAlert, Loader2, TrendingUp, BarChart3, Globe } from "lucide-react";
import { format } from "date-fns";

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
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useFetchWithTimeout<AdminStats>('/api/admin/stats');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-text" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue || '0.00'}`, change: 'Gross', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Active Sessions', value: stats?.activeSessions || 0, change: 'Live Now', icon: Activity, color: 'text-text' },
    { label: 'Platform Users', value: stats?.totalUsers || 0, change: 'Total', icon: Users, color: 'text-blue-400' },
    { label: 'Safety Alerts', value: stats?.recentAlerts?.length || 0, change: 'Critical Priority', icon: ShieldAlert, color: 'text-rose-400' },
  ];

  const recentAlerts = stats?.recentAlerts ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-text text-[10px] font-black uppercase tracking-widest">
             System Monitor
           </div>
           <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-text-muted0 uppercase tracking-widest">Nodes Online</span>
           </div>
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Control <span className="text-text">Plane</span>
        </h1>
        <p className="mt-4 text-lg text-text max-w-2xl">
          Global platform oversight. Monitor commerce flow, safety incidents, and infrastructure health in real-time.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-3xl border border-white/5 bg-text/50 p-8 hover:bg-text transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-surface/5 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-text-muted0 uppercase tracking-widest">{card.change}</span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-text-muted0">{card.label}</p>
              <p className="mt-1 text-3xl font-black text-white">{card.value}</p>
            </div>
            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full bg-current ${card.color}`} />
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Stats Chart Placeholder */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-text/50 p-8 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-text" />
              Growth Velocity
            </h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-lg bg-surface/5 text-[10px] font-bold text-text">7D</div>
              <div className="px-3 py-1 rounded-lg bg-primary/20 text-[10px] font-bold text-text border border-primary/20">30D</div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-2xl bg-black/20">
            <BarChart3 className="h-12 w-12 text-text" />
          </div>
        </div>

        {/* Safety Feed */}
        <div className="rounded-3xl border border-white/5 bg-text/50 p-8 flex flex-col">
          <h3 className="font-bold text-white flex items-center gap-2 mb-8">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Live Safety Feed
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto">
             {recentAlerts.length > 0 ? (
               recentAlerts.map((alert) => (
                 <div key={alert.id} className="flex flex-col gap-1 pb-4 border-b border-white/5 last:border-0">
                   <div className="flex items-center justify-between">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                       alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                     }`}>
                       {alert.severity} • {alert.category}
                     </span>
                     <span className="text-[10px] text-text">{format(new Date(alert.createdAt), 'h:mm a')}</span>
                   </div>
                   <p className="text-xs font-mono text-text-muted0">REF: {alert.sessionId.substring(0, 12)}</p>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale">
                 <Globe className="h-12 w-12 text-text-muted0 mb-4" />
                 <p className="text-xs font-bold uppercase tracking-widest text-text">No Incidents Detected</p>
               </div>
             )}
          </div>
          <button className="mt-8 w-full py-3 rounded-xl bg-surface/5 text-[10px] font-black uppercase tracking-widest text-text hover:bg-surface/10 transition-all border border-white/5">
             View All Safety Logs
          </button>
        </div>
      </div>
    </div>
  );
}
