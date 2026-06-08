"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        router.push("/dashboard");
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles && (!role || !allowedRoles.includes(role)))) {
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
