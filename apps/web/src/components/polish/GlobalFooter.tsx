"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/polish/Footer";

// Routes that render the DashboardShell and therefore should not show
// the global marketing footer.
const HIDE_FOOTER_PREFIXES = [
  "/admin",
  "/dashboard",
  "/facilitator",
  "/organizations",
  "/login",
  "/signup",
  "/forgot-password",
  "/mfa-verify",
  "/mfa-setup",
];

function isHiddenFooterPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDE_FOOTER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function GlobalFooter() {
  const pathname = usePathname();
  if (isHiddenFooterPath(pathname)) return null;
  return <Footer />;
}
