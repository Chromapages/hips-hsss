"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

export default function DashboardPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadPackages() {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch('/api/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setPackages(data.packages || []);
      } catch (error) {
        console.error('Failed to load packages:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [getToken]);

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold text-white">Packages</h1>
        <p className="mt-3 text-zinc-400">Track balances and expiry windows.</p>
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <PackageBalanceCard packages={packages} />
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
