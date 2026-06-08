import React from "react";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, User, Settings, Shield } from "lucide-react";

const navItems = [
  { href: "/host/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/host/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/host/avatar-setup", label: "Avatar & Voice", icon: User },
  { href: "/host/settings", label: "Settings", icon: Settings },
];

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 bg-primary text-white flex flex-col min-h-screen"
        aria-label="Host navigation"
      >
        {/* Brand + badge */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent font-ui">
              Host Console
            </span>
          </div>
          <p className="text-xs text-white/50 font-body">H.I.P.S. Foundation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Host menu">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-surface/10 transition-all duration-150 group font-ui text-sm font-medium"
              aria-label={label}
            >
              <Icon
                className="w-4 h-4 text-white/50 group-hover:text-accent transition-colors"
                aria-hidden="true"
              />
              {label}
            </Link>
          ))}
        </nav>

        {/* Back to main site */}
        <div className="px-6 pb-6 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="text-[10px] text-white/40 hover:text-white/70 transition-colors font-ui uppercase tracking-wider"
          >
            ← Exit to Main Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-bg-subtle">
        {children}
      </main>
    </div>
  );
}
