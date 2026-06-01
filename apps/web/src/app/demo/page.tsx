const services = [
  ["One-on-one coaching", "$65", "Private peer support"],
  ["Small group circle", "$35", "Moderated anonymous room"],
  ["Care navigation", "$50", "Benefits and referral planning"],
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white text-primary overflow-x-hidden">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            {/* Section label - emerald for technical demo, uppercase with tracking */}
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 brand-caps">
              Proof of Anonymity
            </p>
            {/* H1 - serif heading */}
            <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-tight text-primary mt-4">
              Billing identity becomes a short-lived anonymous session token.
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-emerald-500/30 bg-emerald-50 p-5">
              {/* H2 - serif heading */}
              <h2 className="font-heading text-lg font-semibold text-emerald-800">
                Commerce DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm font-body">
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">Firebase UID</dt>
                  <dd className="text-primary font-medium">usr_89F2</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">Package</dt>
                  <dd className="text-primary font-medium">6 sessions</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">Session ref</dt>
                  <dd className="text-primary font-medium">sha256:a81e...</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-lg border border-amber-900/50 bg-amber-50/50 p-5">
              {/* H2 - serif heading */}
              <h2 className="font-heading text-lg font-semibold text-amber-800">
                Session DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm font-body">
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-700">Anonymous ID</dt>
                  <dd className="text-accent font-medium">anon_4KQ9</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-700">Room</dt>
                  <dd className="text-accent font-medium">room_breath_12</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-700">Status</dt>
                  <dd className="text-success font-medium">active</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="rounded-lg border border-border bg-surface p-5">
            {/* H2 - serif heading */}
            <h2 className="font-heading text-lg font-semibold text-primary">Mock booking dashboard</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {services.map(([name, price, detail]) => (
                <article
                  className="rounded-xl border border-border bg-white p-4"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-primary font-heading">{name}</h3>
                    <span className="text-sm text-accent font-medium">{price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-secondary font-body">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="relative min-h-[620px] overflow-hidden rounded-lg border border-border bg-surface">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-teal-500/20 to-emerald-500/20" />
          <div className="absolute inset-x-8 bottom-16 h-36 rounded-t-lg bg-white shadow-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/80" />
          <div className="absolute bottom-20 left-1/2 h-32 w-52 -translate-x-1/2 rounded-lg bg-accent/20 shadow-xl" />
          <div className="absolute bottom-52 left-[22%] h-24 w-24 rounded-full bg-primary/20 shadow-xl" />
          <div className="absolute bottom-52 right-[22%] h-24 w-24 rounded-full bg-accent/20 shadow-xl" />
          <div className="absolute left-8 top-8 rounded-md border border-amber-500/50 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Crisis overlay armed
          </div>
          <div className="absolute bottom-8 left-8 right-8 rounded-lg bg-white/90 p-4 backdrop-blur border border-border">
            {/* H2 - serif heading */}
            <h2 className="font-heading text-xl font-semibold text-primary">Virtual office mock</h2>
            <p className="mt-2 text-sm leading-6 text-secondary font-body">
              A frontend-only room concept for client review. The production
              session engine remains isolated from commerce identity data.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
