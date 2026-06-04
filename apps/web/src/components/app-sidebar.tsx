"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  LayoutDashboard,
  Package,
  Settings,
  Timer,
  ShoppingBag,
  ShieldAlert,
  Users,
  Award,
  ListChecks,
  Server,
  Download,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/roles";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarUserFooter } from "@/components/sidebar/sidebar-user-footer";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exactMatch?: boolean;
  badge?: number;
  badgeVariant?: "danger" | "warning";
};

const participantNav: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard, exactMatch: true },
  { title: "Sessions", href: "/dashboard/sessions", icon: Timer },
  { title: "Packages", href: "/dashboard/packages", icon: Package },
  { title: "Downloads", href: "/dashboard/downloads", icon: Download },
  { title: "Get Sessions", href: "/services", icon: ShoppingBag },
  { title: "Partnerships", href: "/organizations", icon: Building2 },
  { title: "Donate", href: "/dashboard/donate", icon: Heart },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const facilitatorNav: NavItem[] = [
  { title: "Lead View", href: "/facilitator", icon: LayoutDashboard, exactMatch: true },
  { title: "Live Queue", href: "/facilitator/queue", icon: ListChecks },
  { title: "Assignments", href: "/facilitator/assignments", icon: Package },
  { title: "Packages", href: "/dashboard/packages", icon: Package },
  { title: "Downloads", href: "/dashboard/downloads", icon: Download },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { title: "Control Plane", href: "/admin", icon: Server, exactMatch: true },
  { title: "User Ops", href: "/admin/users", icon: Users },
  { title: "Safety Feed", href: "/admin/safety", icon: ShieldAlert },
  { title: "Grants", href: "/admin/scholarships", icon: Award },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

type ConsoleContext = {
  nav: NavItem[];
  consoleLabel: string;
  homeHref: string;
};

const NavItemRow = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
  const IconComponent = item.icon;
  const showBadge = item.badge !== undefined && item.badge > 0;

  return (
    <SidebarMenuItem className="sidebar-item-enter relative">
      {isActive && (
        <span 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-accent rounded-r-full z-20 transition-all duration-200"
          aria-hidden="true"
        />
      )}
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "rounded-xl border transition-all duration-200 py-2.5 pl-3 pr-3 shadow-none relative overflow-hidden group/btn",
          isActive
            ? "border-accent/20 bg-white/[0.08] text-white"
            : "border-transparent text-white/70 hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-white",
          "[&_svg]:!size-[18px] [&_svg]:shrink-0",
          isActive
            ? "[&_svg]:text-accent [&_svg]:[stroke-width:2.2]"
            : "[&_svg]:text-white/60 [&_svg]:[stroke-width:1.8] group-hover/btn:[&_svg]:text-white/80 group-hover/btn:[&_svg]:scale-105 group-hover/btn:[&_svg]:[stroke-width:2.0] group-hover/btn:[&_svg]:translate-x-0.5",
          // Collapsed icon styling overrides
          "group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:mx-auto",
          isActive && "group-data-[collapsible=icon]:bg-accent/15 group-data-[collapsible=icon]:border-accent/30 group-data-[collapsible=icon]:text-accent"
        )}
      >
        <Link
          href={item.href}
          aria-label={item.title}
          aria-current={isActive ? "page" : undefined}
          className="w-full flex items-center"
        >
          <IconComponent aria-hidden="true" />
          <span className="font-semibold tracking-wide font-body text-sm ml-3 transition-colors duration-150 group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>

      {showBadge && (
        <SidebarMenuBadge
          aria-label={`${item.badge} alert${item.badge !== 1 ? "s" : ""}`}
          className={cn(
            "rounded-full px-1.5 text-[9px] font-bold h-4 min-w-5 border-0",
            item.badgeVariant === "warning"
              ? "bg-warning text-white"
              : "bg-destructive text-white",
            item.badgeVariant !== "warning" && "sidebar-badge-pulse",
          )}
        >
          {item.badge}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, role, loading, logout } = useAuth();

  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isFacilitator = !isAdmin && (pathname?.startsWith("/facilitator") ?? false);

  const ctx: ConsoleContext = isAdmin
    ? { nav: adminNav, consoleLabel: "Admin Console", homeHref: "/admin" }
    : isFacilitator
      ? { nav: facilitatorNav, consoleLabel: "Lead Console", homeHref: "/facilitator" }
      : { nav: participantNav, consoleLabel: "Dashboard", homeHref: "/dashboard" };
  const { nav, consoleLabel, homeHref } = ctx;

  const isItemActive = (item: NavItem): boolean =>
    item.exactMatch
      ? pathname === item.href
      : pathname?.startsWith(item.href) ?? false;

  const extraNavItems: NavItem[] = [];
  if (role === ROLES.ADMIN) {
    if (!isAdmin) extraNavItems.push({ title: "Admin Console", href: "/admin", icon: Server });
    if (!isFacilitator) extraNavItems.push({ title: "Lead Console", href: "/facilitator", icon: ListChecks });
    if (isAdmin || isFacilitator) {
      extraNavItems.push({ title: "Participant View", href: "/dashboard", icon: LayoutDashboard, exactMatch: true });
    }
  } else if (role === ROLES.FACILITATOR) {
    if (!isFacilitator) extraNavItems.push({ title: "Lead Console", href: "/facilitator", icon: ListChecks });
    if (isFacilitator) {
      extraNavItems.push({ title: "Participant View", href: "/dashboard", icon: LayoutDashboard, exactMatch: true });
    }
  }

  const handleLogout = () => {
    void logout();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 text-white"
      style={{ "--sidebar-width": "260px" } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-white/6 px-3 pb-4 pt-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <Link
          href={homeHref}
          className="flex min-h-[84px] items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 transition-[padding,background-color,border-color] duration-200 hover:border-white/14 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-primary group-data-[collapsible=icon]:min-h-[40px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent"
          aria-label={`Go to ${consoleLabel}`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/12 text-accent group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-lg">
            <Building2 className="h-5 w-5 group-data-[collapsible=icon]:hidden" />
            <BadgeCheck className="hidden h-5 w-5 group-data-[collapsible=icon]:block" />
          </div>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <Image
              src="/hipslogo.png"
              alt="HIPS Foundation"
              width={88}
              height={36}
              className="mb-2 h-6 w-auto shrink-0 object-contain brightness-[1.18] contrast-[1.08]"
            />
            <span className="block truncate text-[11px] font-bold uppercase tracking-[0.22em] text-accent font-ui leading-none">
              HIPS Foundation
            </span>
            <span className="mt-1 block truncate text-[11px] font-medium text-white/58 leading-none">
              {consoleLabel}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-0 py-3">
        <nav aria-label="Primary" className="flex flex-col">
          <SidebarGroup className="gap-0 px-0">
            <SidebarGroupLabel
              className={cn(
                "px-4 pb-2 pt-2 text-[9px] font-bold uppercase tracking-[0.22em] font-ui",
                "text-white/55 group-data-[collapsible=icon]:hidden",
              )}
            >
              Navigation
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu className="gap-1 px-0">
                  {nav.map((item) => (
                    <NavItemRow key={item.href} item={item} isActive={isItemActive(item)} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {extraNavItems.length > 0 && (
            <>
              <SidebarSeparator className="mx-2 mt-2" />
              <SidebarGroup className="gap-0 px-0">
                <SidebarGroupLabel
                  className={cn(
                    "px-4 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.22em] font-ui",
                    "text-white/55 group-data-[collapsible=icon]:hidden",
                  )}
                >
                  Switch Console
                </SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu className="gap-1 px-0">
                    {extraNavItems.map((item) => (
                      <NavItemRow key={item.href} item={item} isActive={isItemActive(item)} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/6 px-3 pb-3 pt-2 group-data-[collapsible=icon]:p-2">
        <SidebarUserFooter
          displayName={user?.displayName ?? null}
          email={user?.email ?? null}
          role={role}
          onLogout={handleLogout}
          isLoading={loading}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
