"use client";

import { CalendarX2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";

const rows = Array.from({ length: 10 }, (_, index) => ({
  id: `anon-${(index + 1032).toString(16)}`,
  service: index % 2 === 0 ? "Peer support" : "Support navigation",
  date: `May ${10 + index}, 2026`,
  status: index < 2 ? "UPCOMING" : index === 7 ? "CANCELLED" : "COMPLETED",
  duration: index < 2 ? "45 min scheduled" : "45 min",
}));

const badgeClass = {
  UPCOMING: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  CANCELLED: "bg-gray-500/15 text-gray-300 border-gray-500/30",
} as const;

export function SessionHistoryTable() {
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const visible = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [page],
  );

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No sessions yet"
        description="Book your first session to get started."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-gray-950">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            {["Session ID", "Service", "Date", "Status", "Duration"].map(
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
              <td className="px-4 py-4 font-mono text-gray-300">{row.id}</td>
              <td className="px-4 py-4 text-white">{row.service}</td>
              <td className="px-4 py-4 text-gray-300">{row.date}</td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass[row.status as keyof typeof badgeClass]}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-300">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-sm text-gray-400">
        <span>
          Page {page + 1} of {Math.ceil(rows.length / pageSize)}
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
            disabled={(page + 1) * pageSize >= rows.length}
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
