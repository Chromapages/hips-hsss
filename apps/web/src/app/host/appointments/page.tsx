"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Play,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  clientHandle: string;
  serviceName: string;
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const generateMockHistory = (): Appointment[] => {
  const items: Appointment[] = [];
  const services = [
    "Emotional Support Session",
    "Peer Mentoring",
    "Crisis Intervention",
    "Skill Building Workshop",
    "Advocacy Consultation",
  ];
  const handles = [
    "Brave-Owl-3", "Silent-River-9", "Gentle-Fox-2", "Swift-Hawk-7",
    "Calm-Bear-5", "Quiet-Deer-1", "Hopeful-Lark-4", "Strong-Wolf-8",
    "Steady-Eagle-6", "Kind-Raven-2",
  ];

  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(9 + (i % 8), i % 2 === 0 ? 0 : 30, 0, 0);
    items.push({
      id: `past-${i}`,
      clientHandle: handles[i % handles.length]!,
      serviceName: services[i % services.length]!,
      startsAt: date.toISOString(),
      durationMinutes: [30, 50][i % 2]!,
      status: i === 0 ? "UPCOMING" : i < 3 ? "UPCOMING" : i === 5 ? "CANCELLED" : "COMPLETED",
    });
  }
  return items;
};

const ALL_APPOINTMENTS = generateMockHistory();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const statusConfig: Record<AppointmentStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  UPCOMING: { label: "Upcoming", icon: Clock, className: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  IN_PROGRESS: { label: "In Progress", icon: Play, className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  COMPLETED: { label: "Completed", icon: CheckCircle, className: "bg-bg-subtle text-text-muted0 border-border" },
  CANCELLED: { label: "Cancelled", icon: XCircle, className: "bg-destructive text-destructive border-destructive" },
};

const ITEMS_PER_PAGE = 8;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HostAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [page, setPage] = useState(1);

  const upcoming = ALL_APPOINTMENTS.filter(
    (a) => a.status === "UPCOMING" || a.status === "IN_PROGRESS"
  );
  const past = ALL_APPOINTMENTS.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const activeList = activeTab === "upcoming" ? upcoming : past;
  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);
  const paginatedList = activeList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-text-muted font-ui">
          <li>
            <Link href="/host/dashboard" className="hover:text-text transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-bold text-text">Appointments</li>
        </ol>
      </nav>

      <h1 className="font-heading text-3xl font-bold text-text mb-8">
        Appointments
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-offset mb-8 w-fit" role="tablist" aria-label="Appointment tabs">
        {(["upcoming", "past"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            onClick={() => handleTabChange(tab)}
            tabIndex={activeTab === tab ? 0 : -1}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-ui transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === tab
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            {tab === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {/* Table panel */}
      <section
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-label={`${activeTab} appointments`}
      >
        {paginatedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-surface text-center px-6">
            <CalendarDays className="w-10 h-10 text-text-muted mb-3" aria-hidden="true" />
            <p className="font-bold text-text text-sm">No appointments</p>
            <p className="text-xs text-text-muted mt-1 font-body">
              {activeTab === "upcoming"
                ? "You have no upcoming sessions scheduled."
                : "No past sessions to show yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_2fr_2fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-bg-subtle">
                {["Client", "Service", "Date & Time", "Duration", ""].map((h) => (
                  <p key={h} className="text-[9px] font-bold uppercase tracking-widest text-text-muted font-ui">
                    {h}
                  </p>
                ))}
              </div>

              {/* Rows */}
              {paginatedList.map((appt) => {
                const cfg = statusConfig[appt.status];
                const StatusIcon = cfg.icon;
                return (
                  <article
                    key={appt.id}
                    className="grid grid-cols-[2fr_2fr_2fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-b-0 hover:bg-bg-subtle transition-colors group"
                    aria-label={`Session with ${appt.clientHandle}`}
                  >
                    {/* Client */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-text/40" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-text font-ui">{appt.clientHandle}</span>
                    </div>

                    {/* Service */}
                    <span className="text-sm text-text-muted font-body">{appt.serviceName}</span>

                    {/* Date */}
                    <span className="text-sm text-text-muted font-body">{formatDateTime(appt.startsAt)}</span>

                    {/* Duration */}
                    <span className="text-sm text-text-muted font-body">{appt.durationMinutes} min</span>

                    {/* Status + Action */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border font-ui ${cfg.className}`}
                      >
                        <StatusIcon className="w-3 h-3" aria-hidden="true" />
                        {cfg.label}
                      </span>
                      {(appt.status === "UPCOMING" || appt.status === "IN_PROGRESS") && (
                        <Link
                          href={`/session/host-${appt.id}?role=host`}
                          aria-label={`Join session with ${appt.clientHandle}`}
                          className="hidden group-hover:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold font-ui transition-all"
                        >
                          <Play className="w-3 h-3" aria-hidden="true" />
                          Join
                          <ChevronRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-xs text-text-muted font-ui">
                  Page {page} of {totalPages} · {activeList.length} total
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Previous page"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider font-ui rounded-xl border border-border text-text-muted hover:border-primary hover:text-text disabled:opacity-40 transition-all"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next page"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider font-ui rounded-xl border border-border text-text-muted hover:border-primary hover:text-text disabled:opacity-40 transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
