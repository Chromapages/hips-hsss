"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, User } from "lucide-react";
import { type Role } from "@/lib/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SidebarUserFooterProps = {
  displayName: string | null;
  email: string | null;
  role: string | null;
  onLogout: () => Promise<unknown> | unknown;
  isLoading?: boolean;
};

const ROLE_META: Record<Role, { badgeClasses: string; label: string }> = {
  SUPER_ADMIN: {
    badgeClasses: "bg-violet-600 text-white",
    label: "SUPER ADMIN",
  },
  ADMIN: {
    badgeClasses: "bg-destructive text-white",
    label: "ADMIN",
  },
  FACILITATOR: {
    badgeClasses: "bg-accent text-primary",
    label: "LEAD",
  },
  PARTICIPANT: {
    badgeClasses: "bg-accent/20 text-accent border border-accent/40",
    label: "MEMBER",
  },
};

const isKnownRole = (role: string | null): role is Role =>
  role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACILITATOR" || role === "PARTICIPANT";

const resolveRoleMeta = (role: string | null) =>
  isKnownRole(role) ? ROLE_META[role] : ROLE_META.PARTICIPANT;

const getInitials = (name: string | null, email: string | null): string => {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const first = parts[0]?.charAt(0) ?? "";
      const last = parts[parts.length - 1]?.charAt(0) ?? "";
      return `${first}${last}`.toUpperCase();
    }
    return (parts[0] ?? "").slice(0, 2).toUpperCase();
  }
  return email ? email.charAt(0).toUpperCase() : "?";
};

const getGuestInitial = () => "G";

export const SidebarUserFooter = ({
  displayName,
  email,
  role,
  onLogout,
  isLoading,
}: SidebarUserFooterProps) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await onLogout();
        router.push("/login");
      } catch {
        // Auth guard will route if logout fails; the spinner is enough UX
      }
    });
  };

  if (isLoading) {
    return (
      <div className="pt-3 mt-1 px-2">
        <div className="flex items-center gap-3 rounded-lg bg-surface/5 px-3 py-2.5 animate-pulse">
          <div className="h-9 w-9 rounded-full bg-surface/10 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-24 bg-surface/10 rounded" />
            <div className="h-2.5 w-12 bg-surface/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const trimmedName = displayName?.trim() ?? "";
  const isGuest = !trimmedName && !email;

  const initials = isGuest ? getGuestInitial() : getInitials(displayName, email);
  const { badgeClasses, label: roleLabel } = resolveRoleMeta(role);
  const nameDisplay = trimmedName || email || "Guest Access";

  if (isGuest) {
    return (
      <div className="pt-3 mt-1">
        <div className="group-data-[collapsible=icon]:hidden px-2">
          <div className="rounded-xl border border-white/10 bg-surface/5 px-3 py-3">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-xs font-bold text-accent font-ui select-none"
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white leading-tight">Guest session</p>
                <p className="mt-0.5 text-[11px] leading-tight text-white/55">
                  Sign in again to restore account actions and package data.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-primary"
            >
              <span>Return to login</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hidden group-data-[collapsible=icon]:flex justify-center px-0 pb-1">
          <Link
            href="/login"
            aria-label="Return to login"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-xs font-bold text-accent font-ui transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {initials}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3 mt-1">
      {/* Expanded state — hidden when sidebar is icon-only */}
      <div className="group-data-[collapsible=icon]:hidden px-2">
        <div className="rounded-xl border border-white/10 bg-surface/5 px-3 py-3">
          <div className="flex items-center gap-3">
          {/* Avatar */}
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold font-ui select-none"
            >
              {initials}
            </div>

            {/* Name + Role */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span
                className="truncate text-sm font-semibold text-white leading-tight"
                title={nameDisplay}
              >
                {nameDisplay}
              </span>
              <span
                className={`inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest font-ui ${badgeClasses}`}
              >
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex flex-col gap-1">
            <Link
              href="/dashboard/settings"
              aria-label="View profile settings"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 transition-colors duration-150 hover:bg-surface/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-primary"
            >
              <User size={13} aria-hidden="true" />
              <span>Profile Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isPending}
              aria-label="Sign out of your account"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 transition-colors duration-150 hover:bg-surface/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={13} aria-hidden="true" />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collapsed state — avatar icon with popup menu */}
      <div className="hidden group-data-[collapsible=icon]:flex justify-center px-0 pb-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Account menu for ${nameDisplay}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold font-ui transition-colors hover:ring-2 hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=open]:ring-2 data-[state=open]:ring-accent/40"
          >
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="w-52 p-3 bg-sidebar text-sidebar-foreground border-sidebar-border"
          >
            <DropdownMenuLabel className="flex flex-col gap-0.5 p-0 pb-2 mb-1 border-b border-sidebar-border">
              <span className="truncate text-xs font-semibold text-white leading-tight">
                {nameDisplay}
              </span>
              {email && (
                <span className="truncate text-[10px] text-white/50 leading-none font-normal">
                  {email}
                </span>
              )}
              <span
                className={`inline-flex w-fit items-center rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest font-ui mt-1 ${badgeClasses}`}
              >
                {roleLabel}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuItem
              asChild
              className="px-2.5 py-1.5 text-xs text-white/60 focus:bg-surface/5 focus:text-white rounded-md"
            >
              <Link href="/dashboard/settings">
                <User size={13} aria-hidden="true" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className="px-2.5 py-1.5 text-xs text-white/60 focus:bg-surface/5 focus:text-white rounded-md"
            >
              <LogOut size={13} aria-hidden="true" />
              <span>{isPending ? "Signing out…" : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
