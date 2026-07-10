import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientShell } from "@/components/auth/ClientShell";

export default function FacilitatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientShell allowedRoles={["FACILITATOR", "ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell>{children}</DashboardShell>
    </ClientShell>
  );
}
