import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageBalanceCard } from "@/components/dashboard/PackageBalanceCard";

export default function DashboardPackagesPage() {
  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold">Packages</h1>
        <p className="mt-3 text-gray-400">Track balances and expiry windows.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <PackageBalanceCard />
          <PackageBalanceCard />
        </div>
      </section>
    </DashboardLayout>
  );
}
