import Link from "next/link";
import type { ReactNode } from "react";
import { Download, LayoutDashboard, Package, Settings, Timer } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sessions", label: "Sessions", icon: Timer },
  { href: "/dashboard/packages", label: "Packages", icon: Package },
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen bg-black text-white">
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-white/10 bg-gray-950/90 p-4 backdrop-blur-xl md:block lg:w-20 xl:w-64">
        <Link className="mb-8 block px-3 text-lg font-bold xl:px-4" href="/">
          <span className="lg:hidden xl:inline">H.I.P.S.</span>
          <span className="hidden lg:inline xl:hidden">H</span>
        </Link>
        <nav aria-label="Dashboard navigation" className="grid gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 xl:px-4"
                href={item.href}
                key={item.href}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="lg:hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </main>
  );
}
