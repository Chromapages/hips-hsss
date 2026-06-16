"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type Role } from "@/lib/roles";

export type AllowedRole = Role;

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: readonly AllowedRole[] | undefined;
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const fromPath = window.location.pathname + window.location.search;
        router.push("/login?from=" + encodeURIComponent(fromPath));
      } else if (allowedRoles && (!role || !allowedRoles.includes(role as Role))) {
        router.push(role === "FACILITATOR" ? "/facilitator" : role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles && (!role || !allowedRoles.includes(role as Role)))) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-text font-ui">Loading</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
