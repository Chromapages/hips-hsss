"use client";

import type { ReactNode } from "react";

export function RouteChrome({
  children,
  disclaimer = false,
}: {
  children: ReactNode;
  disclaimer?: boolean;
}) {
  return (
    <>
      {children}
    </>
  );
}
