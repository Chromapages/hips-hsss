"use client";

import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Loader2 } from "lucide-react";

type DashboardResponse = {
  packages: Array<{
    id: string;
    service: string;
    remaining: number;
    total: number;
  }>;
};

export default function DashboardPackagesPage() {
  const { data, isLoading } = useFetchWithTimeout<DashboardResponse>('/api/dashboard');

  const packages = data?.packages ?? [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold text-white">Packages</h1>
        <p className="mt-3 text-zinc-400">Track balances and expiry windows.</p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#173B57]" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <PackageBalanceCard packages={packages} />
            </div>
          )}
        </div>
      </section>
  );
}
