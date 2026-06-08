"use client";

import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";

const badgeClass = {
  UPCOMING: "bg-primary/10 text-primary border-primary/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-surface text-text-secondary border-border",
  SCHEDULED: "bg-primary/10 text-primary border-primary/20",
  ARCHIVED: "bg-surface text-text-muted border-border",
} as const;

type SessionHistoryRow = {
  id: string;
  service: string;
  date: string | null;
  status?: keyof typeof badgeClass | string | undefined;
  duration?: number | undefined;
};

const displayId = (id: string) => id.length > 8 ? id.substring(0, 8) : id;

export function SessionHistoryTable({ sessions = [] }: { sessions?: SessionHistoryRow[] }) {
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const visible = useMemo(
    () => sessions.slice(page * pageSize, page * pageSize + pageSize),
    [page, sessions],
  );

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No sessions yet"
        description="Book your first session to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
      <table className="w-full text-left text-sm font-body">
        <thead className="bg-surface text-text-secondary font-ui text-xs uppercase tracking-wider">
          <tr>
            {["Session ID", "Service", "Date", "Status", "Duration", "Join"].map(
              (heading) => (
                <th className="px-4 py-3.5 font-bold" key={heading}>
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {visible.map((row) => (
            <tr className="hover:bg-surface transition-colors" key={row.id}>
              <td className="px-4 py-4 font-mono text-text-secondary text-xs">{displayId(row.id)}</td>
              <td className="px-4 py-4 text-text-primary font-bold font-heading">{row.service}</td>
              <td className="px-4 py-4 text-text-secondary">
                {row.date ? format(new Date(row.date), 'MMM d, yyyy') : 'Pending'}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass[row.status as keyof typeof badgeClass] || 'bg-surface text-text-secondary border-border'}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-4 text-text-secondary">{row.duration ?? 60} min</td>
              <td className="px-4 py-4">
                {(row.status === 'SCHEDULED' || row.status === 'UPCOMING') ? (
                  <Link
                    href={`/session/${row.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-pill bg-primary/10 border border-primary/20 px-4 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all font-ui uppercase tracking-wider"
                  >
                    Join
                  </Link>
                ) : (
                  <span className="text-text-muted font-bold">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-text-secondary font-ui">
        <span>
          Page {page + 1} of {Math.ceil(sessions.length / pageSize)}
        </span>
        <div className="flex gap-2">
          <button
            className="min-h-9 rounded-md border border-border px-3 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            disabled={page === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            className="min-h-9 rounded-md border border-border px-3 transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            disabled={(page + 1) * pageSize >= sessions.length}
            onClick={() => setPage((value) => value + 1)}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
