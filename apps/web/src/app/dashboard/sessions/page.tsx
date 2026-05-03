"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

export default function DashboardSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadSessions() {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch('/api/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [getToken]);

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold text-white">Session history</h1>
        <p className="mt-3 text-zinc-400">Anonymous session records and statuses.</p>
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <SessionHistoryTable sessions={sessions} />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
