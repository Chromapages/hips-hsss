"use client";

import type { ReactNode } from "react";
import { GlobalDisclaimerBanner } from "./GlobalDisclaimerBanner";

export function RouteChrome({
  children,
  disclaimer = false,
}: {
  children: ReactNode;
  disclaimer?: boolean;
}) {
  return (
    <>
      {disclaimer ? <GlobalDisclaimerBanner /> : null}
      {children}
    </>
  );
}
