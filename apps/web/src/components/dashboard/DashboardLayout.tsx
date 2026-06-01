"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Package, Settings, Timer, ShoppingBag, ShieldAlert, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const participantNav: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/sessions", label: "Sessions", icon: Timer },
  { href: "/dashboard/packages", label: "Packages", icon: Package },
  { href: "/services", label: "Get Sessions", icon: ShoppingBag },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] ;

const facilitatorNav: DashboardNavItem[] = [
  { href: "/facilitator", label: "Lead View", icon: LayoutDashboard },
  { href: "/facilitator/queue", label: "Live Queue", icon: Timer },
  { href: "/facilitator/assignments", label: "Assignments", icon: Package },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] ;

const adminNav: DashboardNavItem[] = [
  { href: "/admin", label: "Control Plane", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Ops", icon: Users },
  { href: "/admin/safety", label: "Safety Feed", icon: ShieldAlert },
  { href: "/admin/scholarships", label: "Grants", icon: Package },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] ;

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminMode = pathname.startsWith('/admin');
  const isFacilitatorMode = !isAdminMode && pathname.startsWith('/facilitator');

  let nav: DashboardNavItem[] = participantNav;
  if (isAdminMode) nav = adminNav;
  else if (isFacilitatorMode) nav = facilitatorNav;

  const glowClass = isAdminMode
    ? "bg-[radial-gradient(circle_at_50%_0%,rgba(23,59,87,0.08)_0%,transparent_70%)]"
    : (isFacilitatorMode ? "bg-[radial-gradient(circle_at_50%_0%,rgba(197,154,53,0.05)_0%,transparent_70%)]" : "bg-[radial-gradient(circle_at_50%_0%,rgba(23,59,87,0.05)_0%,transparent_70%)]");

  return (
    <main className="flex min-h-screen bg-white text-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-20 flex-col items-center border-r border-border bg-white backdrop-blur-3xl py-8 md:flex xl:w-72 xl:items-stretch xl:px-6 z-40 transition-all">
        <Link href={isAdminMode ? "/admin" : (isFacilitatorMode ? "/facilitator" : "/dashboard")} className="flex items-center space-x-3 group mb-12 xl:px-2">
          <Image
            src="/hipslogo.png"
            alt="HIPS Logo"
            width={240}
            height={240}
            className="object-contain w-10 h-10 xl:w-32 xl:h-32 shrink-0"
            quality={85}
            priority
          />
        </Link>

        <nav aria-label="Dashboard navigation" className="flex flex-col gap-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex min-h-12 w-12 items-center justify-center rounded-2xl transition-all xl:w-full xl:justify-start xl:px-4 font-ui",
                  isActive
                    ? "bg-primary/10 text-primary shadow-soft"
                    : "text-muted hover:bg-surface hover:text-primary"
                )}
              >
                {isActive && (
                  <span className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full hidden xl:block",
                    (isAdminMode || !isFacilitatorMode) ? "bg-primary" : "bg-accent"
                  )} />
                )}
                <Icon className={cn(
                  "h-5 w-5 shrink-0 motion-safe:transition-all motion-safe:group-hover:scale-110",
                  isActive && (isFacilitatorMode ? "text-accent" : "text-primary")
                )} aria-hidden="true" />
                <span className="hidden ml-4 font-bold text-sm xl:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Status Bottom */}
        <div className="mt-auto hidden xl:block pt-8 border-t border-border px-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center",
              isFacilitatorMode ? "bg-accent/10 border-accent/20" : "bg-primary/10 border-primary/20"
            )}>
              <span className={cn("w-2.5 h-2.5 rounded-full motion-safe:animate-pulse", isFacilitatorMode ? "bg-accent" : "bg-primary")} aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">
                {isAdminMode ? 'Platform Admin' : (isFacilitatorMode ? 'Lead Agent' : 'Anon User')}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-widest font-ui">
                {isAdminMode ? 'System Root' : (isFacilitatorMode ? 'Verified Lead' : 'Protected')}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section aria-label="Dashboard content" className="min-w-0 flex-1 relative overflow-y-auto h-screen pb-20 md:pb-0">
        {/* Ambient background glow */}
        <div className={cn("fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none", glowClass)} />
        <div className="relative z-10">
          {children}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-border bg-white/95 backdrop-blur-3xl md:hidden px-4">
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl transition-all font-ui",
                isActive
                  ? (isFacilitatorMode ? "text-accent" : "text-primary")
                  : "text-muted hover:text-primary"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && (isFacilitatorMode ? "text-accent" : "text-primary"))} aria-hidden="true" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
