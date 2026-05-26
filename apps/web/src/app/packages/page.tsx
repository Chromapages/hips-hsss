import { PageShell, SectionHeader } from "@/components/PageShell";
import { packages } from "@/data/catalog";
import { useState } from "react";

export default function PackagesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeader
          eyebrow="Packages"
          title="Plan ahead without changing the session experience."
          body="Package use and expiry warnings stay in commerce workflows, while live rooms receive only anonymous session references."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {packages.map((item) => (
            <article
              className="rounded-lg border border-[var(--color-neutral-200)] bg-white p-6"
              key={item.name}
            >
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="mt-3 text-[var(--color-neutral-600)]">
                {item.sessions}
              </p>
              <p className="mt-6 text-4xl font-bold">{item.price}</p>
              <p className="mt-2 text-sm text-[var(--color-success)]">
                Saves {item.savings}
              </p>
              <button className="mt-6 min-h-11 rounded-xl bg-[var(--color-brand-primary)] px-4 font-semibold text-white">
                Select package
              </button>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
