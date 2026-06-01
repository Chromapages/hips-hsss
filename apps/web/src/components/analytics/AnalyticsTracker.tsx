"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (
      event: string,
      options?: { props?: Record<string, unknown> },
    ) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-analytics]",
      );
      if (!target) return;

      const name = target.getAttribute("data-analytics");
      if (!name) return;

      const props: Record<string, unknown> = {
        href: target.getAttribute("href") ?? undefined,
        text: (target.textContent ?? "").trim().slice(0, 80) || undefined,
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
      };

      if (typeof window.plausible === "function") {
        window.plausible(name, { props });
      } else if (typeof window.posthog?.capture === "function") {
        window.posthog.capture(name, props);
      } else {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({ event: name, ...props });
      }

      if (process.env.NODE_ENV === "development") {
        console.debug("[analytics]", name, props);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
