"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/polish/Footer";

// Routes that render the DashboardShell and therefore should not show
// the global marketing footer.
const DASHBOARD_PREFIXES = [
  "/admin",
  "/dashboard",
  "/facilitator",
  "/organizations",
];

function isDashboardPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function GlobalFooter() {
  const pathname = usePathname();
  if (isDashboardPath(pathname)) return null;
  return <Footer />;
}
