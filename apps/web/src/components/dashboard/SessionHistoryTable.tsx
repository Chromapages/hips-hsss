"use client";

import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { format } from "date-fns";

const badgeClass = {
  UPCOMING: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  SCHEDULED: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
} as const;

type SessionHistoryRow = {
  id: string;
  service: string;
  date: string | null;
  status?: keyof typeof badgeClass | string;
};

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
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-zinc-400">
          <tr>
            {["Session ID", "Service", "Date", "Status", "Duration", "Join"].map(
              (heading) => (
                <th className="px-4 py-3 font-medium" key={heading}>
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr className="border-t border-white/10" key={row.id}>
              <td className="px-4 py-4 font-mono text-zinc-300">{row.id}</td>
              <td className="px-4 py-4 text-white">{row.service}</td>
              <td className="px-4 py-4 text-zinc-300">
                {row.date ? format(new Date(row.date), 'MMM d, yyyy') : 'Pending'}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass[row.status as keyof typeof badgeClass] || badgeClass.COMPLETED}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-4 text-zinc-300">60 min</td>
              <td className="px-4 py-4">
                {(row.status === 'SCHEDULED' || row.status === 'UPCOMING') ? (
                  <Link
                    href={`/session/${row.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 text-xs font-bold text-indigo-300 hover:bg-indigo-600/40 transition-all"
                  >
                    Join
                  </Link>
                ) : (
                  <span className="text-zinc-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-zinc-400">
        <span>
          Page {page + 1} of {Math.ceil(sessions.length / pageSize)}
        </span>
        <div className="flex gap-2">
          <button
            className="min-h-11 rounded-md border border-white/10 px-3 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            className="min-h-11 rounded-md border border-white/10 px-3 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
