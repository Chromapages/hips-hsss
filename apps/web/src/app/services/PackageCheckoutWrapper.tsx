"use client";

import dynamic from "next/dynamic";
import type { PackageTier } from "@/types/api";

const PackageCheckout = dynamic(
  () => import("@/components/checkout/PackageCheckout").then((m) => m.PackageCheckout),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-white font-medium">Loading checkout...</p>
        </div>
      </div>
    ),
  }
);

interface PackageCheckoutWrapperProps {
  packageId: PackageTier;
  onClose: () => void;
}

export function PackageCheckoutWrapper({ packageId, onClose }: PackageCheckoutWrapperProps) {
  return <PackageCheckout packageId={packageId} onClose={onClose} />;
}