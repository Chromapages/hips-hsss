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
      <h3 className="text-xl font-bold px-1 text-text-primary font-heading">Active Packages</h3>
      {packages.map((pkg) => {
        const progress = pkg.total > 0 ? (pkg.remaining / pkg.total) * 100 : 0;

        return (
          <article key={pkg.id} className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-text-primary font-heading">{pkg.service}</h4>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {pkg.remaining} left
              </div>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-text-secondary font-body">{pkg.remaining} sessions remaining of {pkg.total} pack</p>
          </article>
        );
      })}
      <Link 
        href="/services"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-border text-text-secondary hover:border-accent/50 hover:text-accent transition-all group font-ui text-xs uppercase tracking-wide"
      >
        <span className="font-bold">Purchase More Sessions</span>
        <div className="w-5 h-5 rounded-full bg-surface-alt flex items-center justify-center group-hover:bg-accent/20 transition-all">
          <span className="text-lg leading-none">+</span>
        </div>
      </Link>
    </div>
  );
}
