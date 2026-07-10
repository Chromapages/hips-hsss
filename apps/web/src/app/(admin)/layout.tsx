import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientShell } from "@/components/auth/ClientShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell>{children}</DashboardShell>
    </ClientShell>
  );
}
