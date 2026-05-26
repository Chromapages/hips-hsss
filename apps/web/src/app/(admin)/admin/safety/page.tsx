"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShieldAlert, Loader2, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";

export default function AdminSafetyQueuePage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/safety-alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load safety alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [getToken]);

  return (
    <div className="p-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">
          Safety
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Human-reviewed escalation queue
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-400">
          Flags appear by anonymous session reference. Crisis protocol and
          vault access require reviewer justification.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Session Ref</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-zinc-300">
                    {alert.sessionId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{alert.category}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {format(new Date(alert.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold">
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className="p-20 text-center text-zinc-500">
              <ShieldAlert className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No safety alerts detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
