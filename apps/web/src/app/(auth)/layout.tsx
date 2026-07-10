"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  let variant: "participant" | "facilitator" | "admin" | "host" = "participant";
  if (pathname?.startsWith("/login/admin") === true) {
    variant = "admin";
  } else if (pathname?.startsWith("/login/facilitator") === true) {
    variant = "facilitator";
  } else if (pathname?.startsWith("/login/host") === true) {
    variant = "host";
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary/30 overflow-x-hidden">
      <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[3fr_2fr]">
        {/* Brand Panel */}
        <AuthBrandPanel variant={variant} />
        
        {/* Form Area */}
        <main
          id="main"
          tabIndex={-1}
          className="relative flex-1 flex items-center justify-center p-6 sm:p-8 bg-surface min-h-[calc(100vh-140px)] lg:min-h-0 overflow-y-auto"
        >
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

