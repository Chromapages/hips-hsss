"use client";

import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { ShieldAlert, Loader2, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";

type SafetyAlert = {
  id: string;
  sessionId: string;
  severity?: 'CRITICAL' | 'HIGH' | string;
  category?: string;
  createdAt: string;
};

export default function AdminSafetyQueuePage() {
  const { data, isLoading } = useFetchWithTimeout<SafetyAlert[]>('/api/admin/safety-alerts');

  const alerts = Array.isArray(data) ? data : [];

  return (
    <div className="p-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-text">
          Safety
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Human-reviewed escalation queue
        </h1>
        <p className="mt-3 max-w-3xl text-text">
          Flags appear by anonymous session reference. Crisis protocol and
          vault access require reviewer justification.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-text" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-text shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/5 text-text uppercase text-xs font-semibold tracking-wider">
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
                <tr key={alert.id} className="hover:bg-surface/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-muted">
                    {alert.sessionId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      alert.severity === 'CRITICAL' ? 'bg-destructive0/20 text-destructive border-destructive/30' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{alert.category}</span>
                  </td>
                  <td className="px-6 py-4 text-text">
                    {format(new Date(alert.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive0/10 text-destructive hover:bg-destructive0 hover:text-white transition-all text-xs font-bold">
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className="p-20 text-center text-text-muted0">
              <ShieldAlert className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No safety alerts detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
