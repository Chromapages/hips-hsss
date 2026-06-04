import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
