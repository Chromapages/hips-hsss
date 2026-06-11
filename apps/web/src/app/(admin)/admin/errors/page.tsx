"use client";

import { useState } from "react";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Bug, Loader2, AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { format } from "date-fns";

type ErrorLog = {
  id: string;
  message: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sessionId?: string;
  userAgent?: string;
  createdAt: string;
  stack?: string;
};

export default function AdminErrorQueuePage() {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchUrl =
    severityFilter === "ALL"
      ? "/api/admin/error-logs"
      : `/api/admin/error-logs?severity=${severityFilter}`;

  const { data, isLoading, refetch } = useFetchWithTimeout<ErrorLog[]>(fetchUrl);

  const logs = Array.isArray(data) ? data : [];

  const handleRowClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-accent" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              System Monitor
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Technical session logs
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Real-time tracker of client-side failures, connection issues, and voice processing errors during live peer sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted hover:bg-muted/80 text-foreground text-xs font-bold font-ui transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Feed
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-surface-offset mb-8 w-fit" role="tablist" aria-label="Error severity tabs">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => (
          <button
            key={level}
            role="tab"
            aria-selected={severityFilter === level}
            onClick={() => {
              setSeverityFilter(level);
              setExpandedId(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-ui transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              severityFilter === level
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/20 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-12" />
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Session Ref</th>
                  <th className="px-6 py-4">Error Message</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => handleRowClick(log.id)}
                      className="group transition-colors border-b border-border last:border-0"
                    >
                      <td colSpan={6} className="p-0">
                        <div
                          className="grid grid-cols-[3rem_8rem_7rem_10rem_1fr_8rem] items-center px-0 py-4 hover:bg-muted/10 cursor-pointer transition-colors"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRowClick(log.id);
                            }
                          }}
                        >
                          <div className="px-6 text-center">
                            <Bug className={`w-4 h-4 ${
                              log.severity === "CRITICAL" ? "text-red-500" :
                              log.severity === "HIGH" ? "text-orange-500" :
                              log.severity === "MEDIUM" ? "text-yellow-500" :
                              "text-blue-500"
                            }`} />
                          </div>
                          <div className="px-6 text-xs font-mono text-muted-foreground">
                            {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                          </div>
                          <div className="px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border font-ui ${
                              log.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              log.severity === "HIGH" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                              log.severity === "MEDIUM" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                              "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}>
                              {log.severity}
                            </span>
                          </div>
                          <div className="px-6 font-mono text-xs text-muted-foreground truncate">
                            {log.sessionId || "N/A"}
                          </div>
                          <div className="px-6 font-medium text-foreground truncate">
                            {log.message}
                          </div>
                          <div className="px-6 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(log.id);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all border border-border"
                            >
                              {isExpanded ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" /> Collapse
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" /> Inspect
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="bg-muted/5 px-8 py-6 border-t border-border">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-ui mb-1">
                                  Full Error Message
                                </h4>
                                <p className="text-sm text-foreground font-body leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                                  {log.message}
                                </p>
                              </div>
                              {log.stack && (
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-ui mb-1">
                                    Stack Trace
                                  </h4>
                                  <pre className="text-xs font-mono text-foreground p-4 bg-muted/30 rounded-lg border border-border overflow-x-auto max-h-[300px] leading-relaxed whitespace-pre-wrap">
                                    {log.stack}
                                  </pre>
                                </div>
                              )}
                              {log.userAgent && (
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-ui mb-1">
                                    User Agent Context
                                  </h4>
                                  <p className="text-xs font-mono text-foreground bg-muted/20 p-3 rounded-lg border border-border">
                                    {log.userAgent}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 opacity-25 mb-4" />
              <p className="font-ui font-semibold text-sm">No technical errors logged</p>
              <p className="text-xs text-muted-foreground mt-1 font-body">
                {severityFilter === "ALL"
                  ? "All systems functioning normally. No session failures detected."
                  : `No logs match the selected filter severity "${severityFilter}".`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
