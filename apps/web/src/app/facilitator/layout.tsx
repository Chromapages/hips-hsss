"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function FacilitatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["FACILITATOR", "ADMIN"]}>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
