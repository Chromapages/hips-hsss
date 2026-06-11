"use client";

import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { ShieldAlert, Loader2, Eye } from "lucide-react";
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
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Safety
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Human-reviewed escalation queue
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Flags appear by anonymous session reference. Crisis protocol and
          vault access require reviewer justification.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/20 text-muted-foreground uppercase text-xs font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Session Ref</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {alert.sessionId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      alert.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground font-medium">{alert.category}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(alert.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all text-xs font-bold">
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <ShieldAlert className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No safety alerts detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
