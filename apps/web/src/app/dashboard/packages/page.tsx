"use client";

import { useState, useMemo, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  Package,
  Timer,
  ShieldCheck,
  Package2,
  CalendarX2,
} from "lucide-react";

type DashboardResponse = {
  packages: Array<{
    id: string;
    service: string;
    remaining: number;
    total: number;
  }>;
};

type FilterType = "all" | "active" | "used";

const DashboardPackagesPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterType>("all");

  const { data, error, isLoading, refetch } = useFetchWithTimeout<DashboardResponse>("/api/dashboard", {
    timeoutMs: 10_000,
  });

  const packages = useMemo(() => data?.packages ?? [], [data]);

  // Compute stat counts and aggregates
  const stats = useMemo(() => {
    const active = packages.filter((p) => p.remaining > 0).length;
    const used = packages.filter((p) => p.remaining === 0).length;
    const totalRemaining = packages.reduce((acc, p) => acc + p.remaining, 0);
    const totalPurchased = packages.reduce((acc, p) => acc + p.total, 0);

    return { total: packages.length, active, used, totalRemaining, totalPurchased };
  }, [packages]);

  // Filter packages based on active tab
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (activeTab === "active") {
        return pkg.remaining > 0;
      }
      if (activeTab === "used") {
        return pkg.remaining === 0;
      }
      return true;
    });
  }, [packages, activeTab]);

  const handleTabChange = (tab: FilterType) => {
    setActiveTab(tab);
  };

  const handleRetry = () => {
    refetch();
  };

  // Keyboard navigation for accessibility
  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabKeys: FilterType[] = ["all", "active", "used"];
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

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8 animate-pulse">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-6 w-36 bg-border rounded-full" />
            <div className="h-10 w-80 bg-border rounded-lg" />
            <div className="h-4 w-96 bg-border rounded-md" />
          </div>
          <div className="h-12 w-44 bg-border rounded-pill" />
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
        <div className="grid gap-6 md:grid-cols-2" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 bg-surface border border-border rounded-xl space-y-4 h-48 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-36 rounded-pill" />
                </div>
              </div>
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
          title="Failed to Load Package Balances"
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
            Package Balances
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tighter text-text-primary">
            Your support credits.
          </h1>
          <p className="mt-2 text-text-secondary font-body leading-relaxed max-w-xl">
            Track remaining session balances, active packages, and schedule credits.
          </p>
        </div>
        <div>
          <Link
            href="/services"
            className="inline-flex h-10 items-center justify-center rounded-pill border-2 border-accent bg-surface text-accent hover:bg-accent/5 px-6 text-xs font-bold font-ui uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shadow-soft"
          >
            Purchase Sessions
          </Link>
        </div>
      </header>

      {/* Stats Mini-Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Active Packages", value: `${stats.active} Packages`, icon: Package },
          { label: "Remaining Sessions", value: `${stats.totalRemaining} Left`, icon: Timer },
          { label: "Total Purchased", value: `${stats.totalPurchased} Sessions`, icon: ShieldCheck },
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
                {value.split(" ")[0]}
              </p>
              <p className="text-xs text-text-secondary font-body mt-0.5">
                {value.split(" ").slice(1).join(" ")}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
              <Icon className="h-5 w-5 text-text-primary" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div
          role="tablist"
          aria-label="Filter packages"
          className="flex flex-wrap gap-2"
        >
          {(
            [
              { id: "all", label: "All", count: stats.total },
              { id: "active", label: "Active", count: stats.active },
              { id: "used", label: "Fully Used", count: stats.used },
            ] as const
          ).map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="packages-panel"
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

      {/* Packages Grid Panel */}
      <div
        id="packages-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {filteredPackages.length === 0 ? (
          <EmptyState
            icon={Package2}
            title={
              activeTab === "all"
                ? "No packages purchased"
                : `No ${activeTab} packages`
            }
            description={
              activeTab === "all"
                ? "You haven't purchased any virtual peer support session packages yet."
                : activeTab === "active"
                ? "You don't have any active packages with remaining session credits."
                : "You don't have any fully used packages in your purchase history."
            }
            action={{
              label: "Purchase Sessions",
              onClick: () => router.push("/services"),
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPackages.map((pkg) => {
              const isActive = pkg.remaining > 0;
              const progress = pkg.total > 0 ? (pkg.remaining / pkg.total) * 100 : 0;
              const leftBorderColor = isActive ? "border-l-accent" : "border-l-border";
              const fractionColor = isActive ? "text-accent" : "text-text-muted";
              const progressColor = isActive ? "bg-accent" : "bg-border";

              return (
                <article
                  key={pkg.id}
                  aria-label={`Package for ${pkg.service}`}
                  className={`flex flex-col justify-between p-6 bg-surface border border-border border-l-4 ${leftBorderColor} rounded-xl shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 min-h-48 gap-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-ui ${
                            isActive
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-surface text-text-muted border-border"
                          }`}
                        >
                          {isActive ? "Active" : "Fully Used"}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-text-primary leading-tight">
                          {pkg.service}
                        </h3>
                      </div>
                      <div className={`font-heading text-2xl font-bold ${fractionColor} shrink-0`}>
                        {pkg.remaining}/{pkg.total}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div
                      role="progressbar"
                      aria-valuenow={pkg.remaining}
                      aria-valuemin={0}
                      aria-valuemax={pkg.total}
                      aria-label={`${pkg.remaining} of ${pkg.total} sessions remaining`}
                      className="h-2 rounded-full bg-surface-alt border border-border/40 overflow-hidden"
                    >
                      <div
                        className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-text-secondary font-body">
                        {pkg.remaining} sessions remaining of {pkg.total} pack
                      </p>
                      <div>
                        {isActive ? (
                          <Link
                            href="/services"
                            className="inline-flex h-10 items-center justify-center rounded-pill bg-primary hover:bg-primary-dark text-white px-5 text-xs font-bold font-ui uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-soft whitespace-nowrap"
                          >
                            Schedule Session
                          </Link>
                        ) : (
                          <Link
                            href="/services"
                            className="inline-flex h-10 items-center justify-center rounded-pill border-2 border-accent bg-surface text-accent hover:bg-accent/5 px-5 text-xs font-bold font-ui uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-soft whitespace-nowrap"
                          >
                            Renew Package
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPackagesPage;
