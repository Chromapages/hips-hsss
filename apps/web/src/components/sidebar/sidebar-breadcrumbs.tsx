"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const segmentLabelMap: Record<string, string> = {
  dashboard: "Dashboard",
  sessions: "Sessions",
  packages: "Packages",
  services: "Services",
  settings: "Settings",
  facilitator: "Lead Console",
  queue: "Live Queue",
  assignments: "Assignments",
  admin: "Admin Console",
  users: "User Ops",
  safety: "Safety Feed",
  scholarships: "Grants",
};

export const SidebarBreadcrumbs = () => {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment) => {
    return (
      segmentLabelMap[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  });

  if (breadcrumbs.length === 0) {
    return (
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted font-ui">
        Dashboard
      </span>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] font-ui select-none">
        {breadcrumbs.map((label, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={index}>
              <li
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-text-primary" : "text-text-muted"}
              >
                {label}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="text-border font-light">
                  /
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
