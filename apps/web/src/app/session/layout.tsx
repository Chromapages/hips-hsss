import { ClientShell } from "@/components/auth/ClientShell";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
