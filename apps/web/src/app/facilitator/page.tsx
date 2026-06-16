'use client';

import { useState, useEffect } from 'react';

export const dynamic = "force-dynamic";

import { useAuth } from '@/components/auth/AuthProvider';
import { Timer, Users, Shield, Zap, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { asError } from '@/lib/errors';
type QueueItem = {
  id: string;
  serviceName: string;
  startsAt: string;
  createdAt: string;
  priority: 'CRISIS' | 'URGENT' | 'STANDARD';
};

type HostItem = {
  id: string;
  name: string;
  specialty: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  caseload: number;
};

export default function FacilitatorDashboard() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [hosts, setHosts] = useState<HostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostsLoading, setHostsLoading] = useState(true);
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

  const loadHosts = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/facilitator/hosts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setHosts(data.hosts || []);
    } catch (error) {
      console.error('Failed to load hosts:', error);
    } finally {
      setHostsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    loadHosts();
    
    // Poll every 30 seconds for new sessions and host statuses
    const interval = setInterval(() => {
      loadQueue();
      loadHosts();
    }, 30000);
    
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
    } catch (error: unknown) {
      toast.error(asError(error).message || 'Failed to claim session');
    } finally {
      setIsClaiming(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
              Live Console
            </div>
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Lead <span className="text-emerald-500">Dispatch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Monitor incoming session requests. Claim assignments that match your expertise and availability.
          </p>
        </header>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
           <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-muted/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                   <Zap className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Active Queue</p>
                   <p className="text-2xl font-black text-foreground">{queue.length}</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl border border-border bg-card p-6 shadow-sm opacity-50 hover:bg-muted/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted">
                   <CheckCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Led</p>
                   <p className="text-2xl font-black text-foreground">0</p>
                </div>
              </div>
           </div>
           <div className="rounded-2xl border border-border bg-card p-6 shadow-sm opacity-50 hover:bg-muted/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted">
                   <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Rating</p>
                   <p className="text-2xl font-black text-foreground">5.0</p>
                </div>
              </div>
           </div>
        </div>

        {/* Queue & Host Availability Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue Section (left) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
               <Timer className="h-5 w-5 text-emerald-500" />
               Pending Sessions
            </h2>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 border border-border rounded-3xl bg-card shadow-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                  <p className="text-muted-foreground text-sm">Connecting to secure queue...</p>
               </div>
            ) : queue.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-3xl bg-muted/20 text-center px-6">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-foreground font-bold">Clear Skies</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                     There are currently no sessions awaiting facilitation. You will be notified when a new request arrives.
                  </p>
               </div>
            ) : (
              <div className="grid gap-4">
                {queue.map((session) => {
                  let badgeClass = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
                  if (session.priority === 'CRISIS') {
                    badgeClass = "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse";
                  } else if (session.priority === 'URGENT') {
                    badgeClass = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                  }

                  return (
                    <div 
                      key={session.id}
                      className="group relative flex items-center justify-between p-6 rounded-2xl border border-border bg-card hover:bg-muted/10 transition-all hover:border-emerald-500/30 shadow-sm"
                    >
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold text-xs uppercase group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                          {session.id.substring(0, 4)}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                            {session.serviceName}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1 font-body">
                              <Timer className="h-3.5 w-3.5" />
                              Starts: {new Date(session.startsAt).toLocaleString()}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-ui ${badgeClass}`}>
                              {session.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={isClaiming === session.id}
                        onClick={() => handleClaim(session.id)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
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
                  );
                })}
              </div>
            )}
          </div>

          {/* Host Availability Panel (right) */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 font-heading">
                 <Users className="h-5 w-5 text-emerald-500" />
                 Host Availability
              </h2>

              {hostsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              ) : hosts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center font-body py-6">
                  No active hosts registered in system.
                </p>
              ) : (
                <div className="space-y-4">
                  {hosts.map((host) => (
                    <div key={host.id} className="flex flex-col gap-1 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground font-heading">{host.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            host.status === 'ONLINE' ? 'bg-emerald-500' :
                            host.status === 'BUSY' ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground'
                          }`} />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-ui">{host.status}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">{host.specialty}</p>
                      <span className="text-[10px] font-semibold text-emerald-600 font-ui mt-1">
                        Active caseload: {host.caseload} session{host.caseload !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
  );
}
