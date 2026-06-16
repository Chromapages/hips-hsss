import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ClientShell } from "@/components/auth/ClientShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientShell>
      <DashboardShell>{children}</DashboardShell>
    </ClientShell>
  );
}
