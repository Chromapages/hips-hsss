import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SessionHistoryTable } from "@/components/dashboard/SessionHistoryTable";

export default function DashboardSessionsPage() {
  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold">Session history</h1>
        <p className="mt-3 text-gray-400">Anonymous session records and statuses.</p>
        <div className="mt-8">
          <SessionHistoryTable />
        </div>
      </section>
    </DashboardLayout>
  );
}
