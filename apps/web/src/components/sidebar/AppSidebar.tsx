"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Settings,
  Timer,
  EyeOff,
  ShoppingBag,
  ShieldAlert,
  Users,
  Calendar,
  Download,
  Headphones,
  BookOpen,
  Inbox,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { PlatformUser, UserRole } from "@/types/api";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

// =============================================================================
// SIDEBAR CONTEXT & HOOK
// =============================================================================

type SidebarState = "expanded" | "collapsed";

interface SidebarContextValue {
  state: SidebarState;
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useAppSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within an AppSidebarProvider");
  }
  return context;
}

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarState>("expanded");

  // Load initial state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hips-sidebar-state");
      if (stored === "collapsed" || stored === "expanded") {
        setState(stored);
      }
    }
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hips-sidebar-state", state);
    }
  }, [state]);

  // Keyboard shortcut: Cmd+B (Mac) / Ctrl+B (Windows) to toggle sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const shortcut = isMac ? e.metaKey && e.key === "b" : e.ctrlKey && e.key === "b";

      if (shortcut) {
        e.preventDefault();
        toggle();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setState(collapsed ? "collapsed" : "expanded");
  }, []);

  return (
    <SidebarContext.Provider value={{ state, isCollapsed: state === "collapsed", toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

// =============================================================================
// ROLE-BASED NAVIGATION CONFIGURATION
// =============================================================================

const participantNav: NavGroup[] = [
  {
    title: "Portal",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/sessions", label: "Sessions", icon: Timer },
      { href: "/dashboard/packages", label: "Packages", icon: Package },
      { href: "/dashboard/downloads", label: "Downloads", icon: Download },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/services", label: "Get Sessions", icon: ShoppingBag },
    ],
  },
];

const facilitatorNav: NavGroup[] = [
  {
    title: "Lead Console",
    items: [
      { href: "/facilitator", label: "Lead View", icon: LayoutDashboard },
      { href: "/facilitator/queue", label: "Live Queue", icon: Headphones },
      { href: "/facilitator/assignments", label: "Assignments", icon: Calendar },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/dashboard/packages", label: "Packages", icon: Package },
      { href: "/dashboard/downloads", label: "Downloads", icon: Download },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    title: "Control Plane",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "User Ops", icon: Users },
      { href: "/admin/safety", label: "Safety Feed", icon: ShieldAlert },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/scholarships", label: "Grants", icon: BookOpen },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
      { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/reports", label: "Reports", icon: FileText },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getNavForRole(role: UserRole): NavGroup[] {
  switch (role) {
    case "ADMIN":
      return adminNav;
    case "FACILITATOR":
      return facilitatorNav;
    default:
      return participantNav;
  }
}

function getRoleColors(role: UserRole): {
  accent: string;
  bgAccent: string;
  glow: string;
  label: string;
  sublabel: string;
  indicator: string;
} {
  switch (role) {
    case "ADMIN":
      return {
        accent: "text-indigo-400",
        bgAccent: "bg-indigo-500/10 border-indigo-500/20",
        glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08)_0%,transparent_70%)]",
        label: "Platform Admin",
        sublabel: "System Root",
        indicator: "bg-indigo-500",
      };
    case "FACILITATOR":
      return {
        accent: "text-emerald-400",
        bgAccent: "bg-emerald-500/10 border-emerald-500/20",
        glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_70%)]",
        label: "Lead Agent",
        sublabel: "Verified Facilitator",
        indicator: "bg-emerald-500",
      };
    default:
      return {
        accent: "text-indigo-400",
        bgAccent: "bg-indigo-500/10 border-indigo-500/20",
        glow: "bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_70%)]",
        label: "Participant",
        sublabel: "Protected User",
        indicator: "bg-indigo-500",
      };
  }
}

function getNavForPathname(pathname: string): UserRole {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/facilitator")) return "FACILITATOR";
  return "PARTICIPANT";
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface SidebarHeaderProps {
  role: UserRole;
  isCollapsed: boolean;
}

export function SidebarHeader({ role, isCollapsed }: SidebarHeaderProps) {
  const colors = getRoleColors(role);
  const roleLabel = role === "ADMIN" ? "Admin Console" : role === "FACILITATOR" ? "Lead Console" : "Dashboard";
  const logoHref = role === "ADMIN" ? "/admin" : role === "FACILITATOR" ? "/facilitator" : "/dashboard";

  return (
    <div className="flex items-center space-x-3 group mb-12 xl:px-2">
      <Link href={logoHref} className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all border group-hover:rotate-6",
            colors.bgAccent
          )}
        >
          <EyeOff className={cn("w-5 h-5", colors.accent)} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col -space-y-1">
            <span className="font-black tracking-tighter text-2xl text-white">HSSS</span>
            <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", colors.accent)}>
              {roleLabel}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  role: UserRole;
  isCollapsed: boolean;
}

export function SidebarNavItem({ item, isActive, role, isCollapsed }: SidebarNavItemProps) {
  const colors = getRoleColors(role);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex min-h-12 w-12 items-center justify-center rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black xl:w-full xl:justify-start xl:px-4",
        isActive
          ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          : "text-zinc-500 hover:bg-white/5 hover:text-white"
      )}
    >
      {isActive && (
        <span
          className={cn(
            "absolute start-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-e-full hidden xl:block",
            colors.indicator
          )}
        />
      )}
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-all group-hover:scale-110",
          isActive && (role === "FACILITATOR"
            ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]")
        )}
      />
      {!isCollapsed && (
        <>
          <span className="hidden ms-4 font-bold text-sm xl:block">{item.label}</span>
          {item.badge && (
            <span className="ml-auto hidden xl:flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500/20 px-1.5 text-xs font-bold text-indigo-400">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

interface SidebarNavGroupProps {
  group: NavGroup;
  role: UserRole;
  isCollapsed: boolean;
  pathname: string;
}

export function SidebarNavGroup({ group, role, isCollapsed, pathname }: SidebarNavGroupProps) {
  // Helper to check if a route is active (supports nested routes)
  const isActiveHref = (href: string) => {
    // Root dashboard routes need exact match
    if (href === "/dashboard" || href === "/facilitator" || href === "/admin") {
      return pathname === href;
    }
    // Other routes: check if pathname starts with href (for nested routes)
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col gap-2">
      {!isCollapsed && (
        <h4 className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600 xl:block">
          {group.title}
        </h4>
      )}
      <div className="flex flex-col gap-1">
        {group.items.map((item) => {
          const isActive = isActiveHref(item.href);
          return (
            <SidebarNavItem key={item.href} item={item} isActive={isActive} role={role} isCollapsed={isCollapsed} />
          );
        })}
      </div>
    </div>
  );
}

interface SidebarFooterProps {
  role: UserRole;
  user?: PlatformUser;
  isCollapsed: boolean;
}

export function SidebarFooter({ role, user, isCollapsed }: SidebarFooterProps) {
  const colors = getRoleColors(role);

  return (
    <div className="mt-auto hidden xl:block pt-8 border-t border-white/5 px-2">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full border flex items-center justify-center",
            colors.bgAccent
          )}
        >
          <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", colors.indicator)} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {user?.email ? user.email.split("@")[0] : colors.label}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {colors.sublabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export interface AppSidebarProps {
  user?: PlatformUser;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

export function AppSidebar({ user, className }: AppSidebarProps) {
  const pathname = usePathname();
  const { state, isCollapsed, toggle } = useAppSidebar();
  const role = user?.role || getNavForPathname(pathname);
  const navGroups = getNavForRole(role);
  const colors = getRoleColors(role);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen flex-col items-center border-e border-white/5 bg-black/40 backdrop-blur-3xl py-8 md:flex z-40 transition-all",
          isCollapsed ? "w-20" : "w-72 xl:items-stretch xl:px-6",
          className
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={toggle}
          className="absolute top-8 right-4 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar (Cmd+B)" : "Collapse sidebar (Cmd+B)"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Header */}
        <SidebarHeader role={role} isCollapsed={isCollapsed} />

        {/* Navigation */}
        <nav aria-label="Dashboard navigation" className={cn("flex flex-col gap-6", isCollapsed ? "" : "w-full")}>
          {navGroups.map((group) => (
            <SidebarNavGroup key={group.title} group={group} role={role} isCollapsed={isCollapsed} pathname={pathname} />
          ))}
        </nav>

        {/* Footer */}
        <SidebarFooter role={role} isCollapsed={isCollapsed} {...(user ? { user } : {})} />
      </aside>

      {/* Mobile Bottom Navigation */}
      <MobileNav navGroups={navGroups} pathname={pathname} role={role} />
    </>
  );
}

// =============================================================================
// MOBILE NAV COMPONENT
// =============================================================================

interface MobileNavProps {
  navGroups: NavGroup[];
  pathname: string;
  role: UserRole;
}

function MobileNav({ navGroups, pathname, role }: MobileNavProps) {
  const allItems = navGroups.flatMap((group) => group.items);

  // Helper to check if a route is active (supports nested routes)
  const isActiveHref = (href: string) => {
    if (href === "/dashboard" || href === "/facilitator" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 start-0 end-0 z-50 flex h-20 items-center justify-around border-t border-white/5 bg-black/80 backdrop-blur-3xl md:hidden px-4">
      {allItems.slice(0, 4).map((item) => {
        const Icon = item.icon;
        const isActive = isActiveHref(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              isActive
                ? role === "FACILITATOR"
                  ? "text-emerald-400"
                  : "text-indigo-400"
                : "text-zinc-500 hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                isActive &&
                  (role === "FACILITATOR"
                    ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]")
              )}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default AppSidebar;