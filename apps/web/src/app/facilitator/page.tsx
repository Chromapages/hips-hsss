import Link from "next/link";
import { PageShell, SectionHeader } from "@/components/PageShell";

export default function FacilitatorPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeader
          eyebrow="Facilitator"
          title="Session assignments without participant identity."
          body="Facilitators see anonymous session references, room status, notes, and safety controls."
        />
        <div className="mt-10 rounded-lg border border-[var(--color-neutral-200)] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {["session-a81e", "Today 2:00 PM", "Lobby", "3 joined"].map(
              (value) => (
                <div key={value}>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    Assignment
                  </p>
                  <p className="font-semibold">{value}</p>
                </div>
              ),
            )}
          </div>
          <Link
            className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[var(--color-brand-primary)] px-4 font-semibold text-white"
            href="/session/a81e"
          >
            Open session view
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
