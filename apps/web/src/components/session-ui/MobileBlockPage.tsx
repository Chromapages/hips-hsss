"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MobileBlockPageProps {
  returnUrl?: string;
}

// Task 5.12 — Mobile block page (require laptop ≥1024px)
export function MobileBlockPage({ returnUrl = "/dashboard" }: MobileBlockPageProps) {
  const router = useRouter();
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-8 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10">
        {/* Laptop icon */}
        <svg
          className="h-10 w-10 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115.75 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Sessions require a laptop or desktop computer</h1>
      <p className="mt-3 max-w-sm text-zinc-400">
        Your device screen is too small for the 3D session environment. Please switch to a
        device with a screen width of at least 1024 pixels.
      </p>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <p className="font-mono text-xs text-zinc-500">
          Current width: {viewportWidth}px | Required: ≥1024px
        </p>
      </div>
      <button
        className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-500"
        onClick={() => router.push(returnUrl)}
        type="button"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

// Hook to check if viewport is mobile
export function useIsMobile(threshold = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < threshold);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [threshold]);

  return isMobile;
}