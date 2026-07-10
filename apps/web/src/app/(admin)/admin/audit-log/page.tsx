"use client";

import { useState } from "react";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { FileText, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";

type AuditLogEntry = {
  id: string;
  correlationId: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  justification?: string;
  result: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

type PaginatedAuditLogs = {
  data: AuditLogEntry[];
  total: number;
  take: number;
  skip: number;
};

export default function AdminAuditLogPage() {
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [searchActor, setSearchActor] = useState<string>("");

  let fetchUrl = "/api/admin/audit-log";
  const params = new URLSearchParams();
  if (actionFilter !== "ALL") {
    params.append("action", actionFilter);
  }
  if (searchActor.trim()) {
    params.append("actorId", searchActor.trim());
  }
  const queryString = params.toString();
  if (queryString) {
    fetchUrl = `/api/admin/audit-log?${queryString}`;
  }

  const { data: response, isLoading, error, refetch } = useFetchWithTimeout<PaginatedAuditLogs>(fetchUrl);

  const logs = response?.data ?? [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" aria-hidden="true" />
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Compliance & Security
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Administrative Audit Log
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Immutable audit trail of all privileged administrative changes, role modifications, and manual overrides.
        </p>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="audit logs" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by Actor ID..."
            value={searchActor}
            onChange={(e) => setSearchActor(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="ROLE_CHANGE">Role Changes</option>
            <option value="SCHOLARSHIP_DECISION">Scholarship Decisions</option>
            <option value="INQUIRY_STATUS_CHANGE">Inquiry Changes</option>
            <option value="SAFETY_ALERT_ESCALATE">Safety Escalations</option>
            <option value="CRISIS_ACCESS_TRIGGER">Crisis Access</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/20 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-xs">{log.actorEmail}</span>
                        <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[120px]" title={log.actorId}>
                          {log.actorId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.targetType ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">{log.targetType}</span>
                          <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[100px]" title={log.targetId}>
                            {log.targetId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.result === "SUCCESS"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground truncate italic" title={log.justification}>
                        {log.justification ? `"${log.justification}"` : "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-25 mb-4" />
              <p className="font-semibold text-sm">No audit logs found</p>
              <p className="text-xs text-muted-foreground mt-1">
                No administrative actions match your current filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
