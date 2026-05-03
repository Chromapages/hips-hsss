"use client";

import Link from "next/link";

type PackageBalance = {
  id: string;
  service: string;
  remaining: number;
  total: number;
};

export function PackageBalanceCard({ packages = [] }: { packages?: PackageBalance[] }) {
  if (packages.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold px-1">Active Packages</h3>
      {packages.map((pkg) => {
        const progress = pkg.total > 0 ? (pkg.remaining / pkg.total) * 100 : 0;

        return (
          <article key={pkg.id} className="rounded-xl border border-white/10 bg-indigo-500/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">{pkg.service}</h4>
              <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                {pkg.remaining} left
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-gray-500">{pkg.remaining} sessions remaining of {pkg.total} pack</p>
          </article>
        );
      })}
      <Link 
        href="/services"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-white/20 text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all group"
      >
        <span className="text-sm font-bold">Purchase More Sessions</span>
        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
          <span className="text-lg">+</span>
        </div>
      </Link>
    </div>
  );
}
