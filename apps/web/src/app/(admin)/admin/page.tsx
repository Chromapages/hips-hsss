'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DollarSign, Users, Activity, ShieldAlert, Loader2, TrendingUp, BarChart3, Globe } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadStats() {
      try {
        const token = await getToken();
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue || '0.00'}`, change: 'Gross', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Active Sessions', value: stats?.activeSessions || 0, change: 'Live Now', icon: Activity, color: 'text-indigo-400' },
    { label: 'Platform Users', value: stats?.totalUsers || 0, change: 'Total', icon: Users, color: 'text-blue-400' },
    { label: 'Safety Alerts', value: stats?.recentAlerts?.length || 0, change: 'Critical Priority', icon: ShieldAlert, color: 'text-rose-400' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
             System Monitor
           </div>
           <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nodes Online</span>
           </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Control <span className="text-indigo-500">Plane</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
          Global platform oversight. Monitor commerce flow, safety incidents, and infrastructure health in real-time.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 p-8 hover:bg-zinc-900 transition-all">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-white/5 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{card.change}</span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-zinc-500">{card.label}</p>
              <p className="mt-1 text-3xl font-black text-white">{card.value}</p>
            </div>
            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full bg-current ${card.color}`} />
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Stats Chart Placeholder */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-zinc-900/50 p-8 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Growth Velocity
            </h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-400">7D</div>
              <div className="px-3 py-1 rounded-lg bg-indigo-500/20 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">30D</div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-2xl bg-black/20">
            <BarChart3 className="h-12 w-12 text-zinc-800" />
          </div>
        </div>

        {/* Safety Feed */}
        <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8 flex flex-col">
          <h3 className="font-bold text-white flex items-center gap-2 mb-8">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Live Safety Feed
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto">
             {stats?.recentAlerts?.length > 0 ? (
               stats.recentAlerts.map((alert: any) => (
                 <div key={alert.id} className="flex flex-col gap-1 pb-4 border-b border-white/5 last:border-0">
                   <div className="flex items-center justify-between">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                       alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                     }`}>
                       {alert.severity} • {alert.category}
                     </span>
                     <span className="text-[10px] text-zinc-600">{format(new Date(alert.createdAt), 'h:mm a')}</span>
                   </div>
                   <p className="text-xs font-mono text-zinc-500">REF: {alert.sessionId.substring(0, 12)}</p>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale">
                 <Globe className="h-12 w-12 text-zinc-500 mb-4" />
                 <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">No Incidents Detected</p>
               </div>
             )}
          </div>
          <button className="mt-8 w-full py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 transition-all border border-white/5">
             View All Safety Logs
          </button>
        </div>
      </div>
    </div>
  );
}
