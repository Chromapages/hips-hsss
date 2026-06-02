"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarBreadcrumbs } from "@/components/sidebar/sidebar-breadcrumbs";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-surface">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-sm">
          <SidebarTrigger
            className="h-8 w-8 rounded-md text-text-primary transition-colors hover:bg-surface-alt hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle navigation sidebar"
          />
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <SidebarBreadcrumbs />
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
