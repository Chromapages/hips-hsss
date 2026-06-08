'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Timer, ExternalLink, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadSessions() {
      try {
        const token = await getToken();
        const res = await fetch('/api/facilitator/sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [getToken]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header className="mb-12">
          <h1 className="font-heading text-4xl font-extrabold text-white">My <span className="text-emerald-500">Assignments</span></h1>
          <p className="mt-4 text-text">Sessions you are scheduled to lead.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
        ) : sessions.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
            <Calendar className="mx-auto h-12 w-12 text-text" />
            <p className="mt-4 text-text-muted0">No assigned sessions found.</p>
            <Link href="/facilitator/queue" className="mt-6 inline-block text-emerald-400 font-bold hover:underline">
              Browse the Queue →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map(s => (
              <div key={s.id} className="p-6 rounded-2xl border border-white/5 bg-text/50 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{s.serviceName}</h3>
                  <p className="text-sm text-text-muted0">{new Date(s.startsAt).toLocaleString()}</p>
                </div>
                <Link 
                  href={`/session/${s.id}`}
                  className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-emerald-500/20"
                >
                  Join Room
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
