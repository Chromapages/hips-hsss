"use client";

import { useState, useMemo, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSWRData } from "@/hooks/useSWR";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Timer,
  Package,
  CalendarX2,
} from "lucide-react";

type SessionRow = {
  id: string;
  service: string;
  date: string | null;
  status?: string;
  duration?: number;
};

const statusConfig = {
  SCHEDULED: {
    borderColor: "border-l-primary",
    iconBg: "bg-primary/10 text-primary border-primary/20",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    icon: Calendar,
  },
  UPCOMING: {
    borderColor: "border-l-primary",
    iconBg: "bg-primary/10 text-primary border-primary/20",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    icon: Calendar,
  },
  COMPLETED: {
    borderColor: "border-l-success",
    iconBg: "bg-success/10 text-success border-success/20",
    badgeColor: "bg-success/10 text-success border-success/20",
    icon: Check,
  },
  CANCELLED: {
    borderColor: "border-l-border",
    iconBg: "bg-muted text-text-muted border-border",
    badgeColor: "bg-muted text-text-muted border-border",
    icon: X,
  },
  ARCHIVED: {
    borderColor: "border-l-border",
    iconBg: "bg-muted text-text-muted border-border",
    badgeColor: "bg-muted text-text-muted border-border",
    icon: X,
  },
} as const;

type FilterType = "all" | "upcoming" | "completed" | "cancelled";

const PAGE_SIZE = 5;

const displayId = (id: string) => (id.length > 8 ? id.substring(0, 8) : id);

const DashboardSessionsPage = () => {
  const { getToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, error, isLoading, mutate } = useSWRData<{ sessions: SessionRow[] }>(
    authLoading ? null : "/api/dashboard",
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
      fetcher: async (url: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);
        try {
          const token = await getToken();
          if (!token) throw new Error("Unauthorized");
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error || `Failed to load (${res.status})`);
          }
          return res.json();
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Session list request timed out. Please refresh.");
          }
          throw error;
        } finally {
          clearTimeout(timeoutId);
        }
      },
    }
  );

  const sessions = useMemo(() => data?.sessions ?? [], [data]);

  // Compute stat counts from all sessions
  const stats = useMemo(() => {
    const total = sessions.length;
    const upcoming = sessions.filter(
      (s) => s.status === "SCHEDULED" || s.status === "UPCOMING"
    ).length;
    const completed = sessions.filter((s) => s.status === "COMPLETED").length;
    const cancelled = sessions.filter(
      (s) => s.status === "CANCELLED" || s.status === "ARCHIVED"
    ).length;

    return { total, upcoming, completed, cancelled };
  }, [sessions]);

  // Filter sessions based on selected tab
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (activeTab === "upcoming") {
        return session.status === "SCHEDULED" || session.status === "UPCOMING";
      }
      if (activeTab === "completed") {
        return session.status === "COMPLETED";
      }
      if (activeTab === "cancelled") {
        return session.status === "CANCELLED" || session.status === "ARCHIVED";
      }
      return true;
    });
  }, [sessions, activeTab]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSessions.length / PAGE_SIZE);
  }, [filteredSessions]);

  // Reset page when tab changes
  const handleTabChange = (tab: FilterType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleRetry = () => {
    mutate();
  };

  // Keyboard navigation for accessibility
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabKeys: FilterType[] = ["all", "upcoming", "completed", "cancelled"];
    if (e.key === "ArrowRight") {
      const nextIndex = (index + 1) % tabKeys.length;
      const nextTab = tabKeys[nextIndex] as FilterType;
      handleTabChange(nextTab);
      const nextButton = document.getElementById(`tab-${nextTab}`);
      nextButton?.focus();
    } else if (e.key === "ArrowLeft") {
      const prevIndex = (index - 1 + tabKeys.length) % tabKeys.length;
      const prevTab = tabKeys[prevIndex] as FilterType;
      handleTabChange(prevTab);
      const prevButton = document.getElementById(`tab-${prevTab}`);
      prevButton?.focus();
    }
  };

  const visibleSessions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredSessions.slice(start, end);
  }, [filteredSessions, currentPage]);

  if (authLoading || isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8 animate-pulse">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-border rounded-full" />
            <div className="h-10 w-80 bg-border rounded-lg" />
            <div className="h-4 w-96 bg-border rounded-md" />
          </div>
          <div className="h-12 w-40 bg-border rounded-pill" />
        </header>

        {/* Stats mini-bar Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6 h-28 flex items-center justify-between"
            >
              <div className="space-y-3">
                <div className="h-3 w-28 bg-border rounded" />
                <div className="h-8 w-16 bg-border rounded-md" />
              </div>
              <div className="h-10 w-10 bg-border rounded-lg" />
            </div>
          ))}
        </div>

        {/* Cards Skeletons */}
        <div className="space-y-4" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface border border-border rounded-xl gap-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-pill shrink-0" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10">
        <ErrorState
          title="Failed to Load Session History"
          error={error}
          onRetry={handleRetry}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Header Row */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-widest text-accent font-ui mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Session History
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tighter text-text-primary">
            Session history
          </h1>
          <p className="mt-2 text-text-secondary font-body leading-relaxed max-w-xl">
            Your anonymous session records and statuses.
          </p>
        </div>
        <div>
          <Link
            href="/services"
            className="inline-flex h-10 items-center justify-center rounded-pill border-2 border-accent bg-surface text-accent hover:bg-accent/5 px-6 text-xs font-bold font-ui uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shadow-soft"
          >
            Book a Session
          </Link>
        </div>
      </header>

      {/* Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div
          role="tablist"
          aria-label="Filter session records"
          className="flex flex-wrap gap-2"
        >
          {(
            [
              { id: "all", label: "All", count: stats.total },
              { id: "upcoming", label: "Upcoming", count: stats.upcoming },
              { id: "completed", label: "Completed", count: stats.completed },
              { id: "cancelled", label: "Cancelled", count: stats.cancelled },
            ] as const
          ).map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="sessions-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-ui uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "bg-surface text-text-secondary border border-border hover:bg-surface-alt hover:text-text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-surface/20 text-white"
                      : "bg-border text-text-secondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Stats Mini-Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Sessions", value: stats.total, icon: Package },
          { label: "Upcoming Sessions", value: stats.upcoming, icon: Timer },
          { label: "Completed Sessions", value: stats.completed, icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="bg-surface border border-border rounded-xl p-5 shadow-soft flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary font-ui mb-1">
                {label}
              </p>
              <p className="font-heading text-3xl font-bold text-accent">
                {value}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
              <Icon className="h-5 w-5 text-text-primary" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

      {/* Session Feed Panel */}
      <div
        id="sessions-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="space-y-4"
      >
        {visibleSessions.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title={
              activeTab === "all"
                ? "No sessions yet"
                : `No ${activeTab} sessions`
            }
            description={
              activeTab === "all"
                ? "Book your first session to get started with our support network."
                : activeTab === "upcoming"
                ? "You have no upcoming support sessions scheduled at this time."
                : activeTab === "completed"
                ? "You haven't completed any sessions yet."
                : "No cancelled or archived sessions in your records."
            }
            {...((activeTab === "all" || activeTab === "upcoming")
              ? {
                  action: {
                    label: "Book a Session",
                    onClick: () => router.push("/services"),
                  },
                }
              : {})}
          />
        ) : (
          <>
            <div className="space-y-4">
              {visibleSessions.map((session) => {
                const config =
                  statusConfig[session.status as keyof typeof statusConfig] || {
                    borderColor: "border-l-border",
                    iconBg: "bg-muted text-text-muted border-border",
                    badgeColor: "bg-muted text-text-muted border-border",
                    icon: X,
                  };
                const IconComponent = config.icon;

                return (
                  <article
                    key={session.id}
                    aria-label={`Session for ${session.service}`}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface border border-border border-l-4 ${config.borderColor} rounded-xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 gap-4`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${config.iconBg} border shrink-0`}
                        aria-hidden="true"
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-heading text-lg font-bold text-text-primary leading-tight">
                          {session.service}
                        </h3>
                        <p className="text-sm text-text-secondary font-body">
                          {session.date
                            ? format(
                                new Date(session.date),
                                "eeee, MMMM d, yyyy @ h:mm a"
                              )
                            : "Scheduling Pending"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-ui ${config.badgeColor}`}
                          >
                            {session.status || "PENDING"}
                          </span>
                          <span className="text-xs text-text-muted font-body">
                            · {session.duration ?? 60} min session
                          </span>
                          <span className="text-xs text-text-muted font-mono bg-surface border border-border px-1.5 py-0.5 rounded">
                            ID: {displayId(session.id)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-end">
                      {session.status === "SCHEDULED" ||
                      session.status === "UPCOMING" ? (
                        <Link
                          href={`/session/${session.id}`}
                          aria-label={`Join session for ${session.service}`}
                          className="inline-flex h-10 items-center justify-center rounded-pill bg-primary hover:bg-primary-dark text-white px-6 text-xs font-bold font-ui uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-soft whitespace-nowrap"
                        >
                          Join Session →
                        </Link>
                      ) : (
                        <span className="text-text-muted font-ui text-xs font-bold uppercase tracking-wider mr-4">
                          {session.status === "COMPLETED"
                            ? "Completed"
                            : "Archived"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-6 mt-8 text-xs text-text-secondary font-ui uppercase tracking-wider">
                <span>
                  Page <span className="font-bold text-text-primary">{currentPage}</span> of{" "}
                  <span className="font-bold text-text-primary">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    className="flex items-center gap-1 rounded-lg h-9"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={handleNextPage}
                    className="flex items-center gap-1 rounded-lg h-9"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DashboardSessionsPage;