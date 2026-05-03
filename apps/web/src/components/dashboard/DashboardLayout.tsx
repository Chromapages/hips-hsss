"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Package, Settings, Timer, EyeOff, ShoppingBag, ShieldAlert, Users } from "lucide-react";
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

  const accentClass = isAdminMode ? 'text-indigo-400' : (isFacilitatorMode ? 'text-emerald-400' : 'text-indigo-400');
  const bgAccentClass = isAdminMode 
    ? 'bg-indigo-600/10 border-indigo-500/20 group-hover:bg-indigo-600/20' 
    : (isFacilitatorMode ? 'bg-emerald-600/10 border-emerald-500/20 group-hover:bg-emerald-600/20' : 'bg-indigo-600/10 border-indigo-500/20 group-hover:bg-indigo-600/20');

  const glowClass = isAdminMode 
    ? "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_70%)]" 
    : (isFacilitatorMode ? "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_70%)]" : "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_70%)]");

  return (
    <main className="flex min-h-screen bg-black text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-20 flex-col items-center border-r border-white/5 bg-black/40 backdrop-blur-3xl py-8 md:flex xl:w-72 xl:items-stretch xl:px-6 z-40 transition-all">
        <Link href={isAdminMode ? "/admin" : (isFacilitatorMode ? "/facilitator" : "/dashboard")} className="flex items-center space-x-3 group mb-12 xl:px-2">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all border group-hover:rotate-6",
            bgAccentClass
          )}>
            <EyeOff className={cn("w-5 h-5", accentClass)} />
          </div>
          <div className="hidden flex-col -space-y-1 xl:flex">
            <span className="font-black tracking-tighter text-2xl text-white">HSSS</span>
            <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", isAdminMode ? "text-indigo-500/80" : (isFacilitatorMode ? "text-emerald-500/80" : "text-indigo-500/80"))}>
              {isAdminMode ? 'Admin Console' : (isFacilitatorMode ? 'Lead Console' : 'Dashboard')}
            </span>
          </div>
        </Link>

        <nav aria-label="Dashboard navigation" className="flex flex-col gap-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex min-h-12 w-12 items-center justify-center rounded-2xl transition-all xl:w-full xl:justify-start xl:px-4",
                  isActive 
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full hidden xl:block",
                    (isAdminMode || !isFacilitatorMode) ? "bg-indigo-500" : "bg-emerald-500"
                  )} />
                )}
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-all group-hover:scale-110",
                  isActive && (isFacilitatorMode ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]")
                )} />
                <span className="hidden ml-4 font-bold text-sm xl:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* User Status Bottom */}
        <div className="mt-auto hidden xl:block pt-8 border-t border-white/5 px-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center",
              isFacilitatorMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-indigo-500/10 border-indigo-500/20"
            )}>
              <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isFacilitatorMode ? "bg-emerald-500" : "bg-indigo-500")} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                {isAdminMode ? 'Platform Admin' : (isFacilitatorMode ? 'Lead Agent' : 'Anon User')}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                {isAdminMode ? 'System Root' : (isFacilitatorMode ? 'Verified Lead' : 'Protected')}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="min-w-0 flex-1 relative overflow-y-auto h-screen pb-20 md:pb-0">
        {/* Ambient background glow */}
        <div className={cn("fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none", glowClass)} />
        <div className="relative z-10">
          {children}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-white/5 bg-black/80 backdrop-blur-3xl md:hidden px-4">
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl transition-all",
                isActive 
                  ? (isFacilitatorMode ? "text-emerald-400" : "text-indigo-400") 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && (isFacilitatorMode ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"))} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
