const services = [
  ["One-on-one coaching", "$65", "Private peer support"],
  ["Small group circle", "$35", "Moderated anonymous room"],
  ["Care navigation", "$50", "Benefits and referral planning"],
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Proof of Anonymity
            </p>
            <h1 className="text-3xl md:text-6xl font-semibold leading-tight sm:text-6xl">
              Billing identity becomes a short-lived anonymous session token.
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-emerald-500/30 bg-emerald-950/50 p-5">
              <h2 className="text-lg font-semibold text-emerald-200">
                Commerce DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Firebase UID</dt>
                  <dd>usr_89F2</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Package</dt>
                  <dd>6 sessions</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-400">Session ref</dt>
                  <dd>sha256:a81e...</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-5">
              <h2 className="text-lg font-semibold text-amber-200">
                Session DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-300">Anonymous ID</dt>
                  <dd>anon_4KQ9</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-300">Room</dt>
                  <dd>room_breath_12</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-amber-300">Status</dt>
                  <dd>active</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="rounded-lg border border-zinc-700/50 bg-zinc-900/40 p-5">
            <h2 className="text-lg font-semibold">Mock booking dashboard</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {services.map(([name, price, detail]) => (
                <article
                  className="rounded-xl border border-zinc-700 bg-black p-4"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-sm text-emerald-400">{price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="relative min-h-[620px] overflow-hidden rounded-lg border border-zinc-700/50 bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-teal-500/20 to-emerald-500/20" />
          <div className="absolute inset-x-8 bottom-16 h-36 rounded-t-lg bg-zinc-800 shadow-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-zinc-700/80" />
          <div className="absolute bottom-20 left-1/2 h-32 w-52 -translate-x-1/2 rounded-lg bg-amber-900/50 shadow-xl" />
          <div className="absolute bottom-52 left-[22%] h-24 w-24 rounded-full bg-emerald-400/30 shadow-xl" />
          <div className="absolute bottom-52 right-[22%] h-24 w-24 rounded-full bg-amber-400/30 shadow-xl" />
          <div className="absolute left-8 top-8 rounded-md border border-amber-500/50 bg-red-950/50 px-4 py-3 text-sm font-semibold text-red-200">
            Crisis overlay armed
          </div>
          <div className="absolute bottom-8 left-8 right-8 rounded-lg bg-black/90 p-4 backdrop-blur">
            <h2 className="text-xl font-semibold">Virtual office mock</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              A frontend-only room concept for client review. The production
              session engine remains isolated from commerce identity data.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
