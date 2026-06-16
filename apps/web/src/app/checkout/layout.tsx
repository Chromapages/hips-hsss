import { ClientShell } from "@/components/auth/ClientShell";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
