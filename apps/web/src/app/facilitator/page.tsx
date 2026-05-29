'use client';

import { useState, useEffect } from 'react';

export const dynamic = "force-dynamic";

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { Timer, Users, Shield, Zap, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
type QueueItem = {
  id: string;
  serviceName: string;
  startsAt: string;
  createdAt: string;
};

export default function FacilitatorDashboard() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const { getToken } = useAuth();

  const loadQueue = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/facilitator/queue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (error) {
      console.error('Failed to load queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // Poll every 30 seconds for new sessions
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, [getToken]);

  const handleClaim = async (sessionId: string) => {
    setIsClaiming(sessionId);
    try {
      const token = await getToken();
      const res = await fetch('/api/facilitator/claim', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      toast.success('Session claimed successfully!');
      loadQueue(); // Refresh queue
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim session');
    } finally {
      setIsClaiming(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              Live Console
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Lead <span className="text-emerald-500">Dispatch</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
            Monitor incoming session requests. Claim assignments that match your expertise and availability.
          </p>
        </header>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
           <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                   <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Queue</p>
                   <p className="text-2xl font-black text-white">{queue.length}</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 opacity-50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-500/10">
                   <CheckCircle className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Led</p>
                   <p className="text-2xl font-black text-white">0</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6 opacity-50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-500/10">
                   <Users className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Rating</p>
                   <p className="text-2xl font-black text-white">5.0</p>
                </div>
              </div>
           </div>
        </div>

        {/* Queue Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
             <Timer className="h-5 w-5 text-emerald-400" />
             Pending Sessions
          </h2>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-zinc-900/30">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                <p className="text-zinc-500 text-sm">Connecting to secure queue...</p>
             </div>
          ) : queue.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-zinc-900/30 text-center px-6">
                <Shield className="h-12 w-12 text-zinc-800 mb-4" />
                <h3 className="text-white font-bold">Clear Skies</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                   There are currently no sessions awaiting facilitation. You will be notified when a new request arrives.
                </p>
             </div>
          ) : (
            <div className="grid gap-4">
              {queue.map((session) => (
                <div 
                  key={session.id}
                  className="group relative flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-all hover:border-emerald-500/30"
                >
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-zinc-400 font-black text-xs uppercase group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                      {session.id.substring(0, 4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {session.serviceName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          Starts: {new Date(session.startsAt).toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Priority: Standard
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isClaiming === session.id}
                    onClick={() => handleClaim(session.id)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-500/10"
                  >
                    {isClaiming === session.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Claim Session
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
