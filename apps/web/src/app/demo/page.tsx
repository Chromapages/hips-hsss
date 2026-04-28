const services = [
  ["One-on-one coaching", "$65", "Private peer support"],
  ["Small group circle", "$35", "Moderated anonymous room"],
  ["Care navigation", "$50", "Benefits and referral planning"],
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#101816] text-white">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8bd2c3]">
              Proof of Anonymity
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              Billing identity becomes a short-lived anonymous session token.
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-[#35524b] bg-[#17231f] p-5">
              <h2 className="text-lg font-semibold text-[#cfeee7]">
                Commerce DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#90aaa3]">Firebase UID</dt>
                  <dd>usr_89F2</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#90aaa3]">Package</dt>
                  <dd>6 sessions</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#90aaa3]">Session ref</dt>
                  <dd>sha256:a81e...</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-lg border border-[#61523a] bg-[#221d16] p-5">
              <h2 className="text-lg font-semibold text-[#f2dfb7]">
                Session DB
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#c8b98f]">Anonymous ID</dt>
                  <dd>anon_4KQ9</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#c8b98f]">Room</dt>
                  <dd>room_breath_12</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#c8b98f]">Status</dt>
                  <dd>active</dd>
                </div>
              </dl>
            </section>
          </div>

          <section className="rounded-lg border border-[#33433f] bg-[#15201d] p-5">
            <h2 className="text-lg font-semibold">Mock booking dashboard</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {services.map(([name, price, detail]) => (
                <article
                  className="rounded-md border border-[#314640] bg-[#101816] p-4"
                  key={name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-sm text-[#8bd2c3]">{price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#a8bbb5]">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="relative min-h-[620px] overflow-hidden rounded-lg border border-[#33433f] bg-[#1b2521]">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#3c5b55] to-[#1f2f2a]" />
          <div className="absolute inset-x-8 bottom-16 h-36 rounded-t-lg bg-[#2c3a34] shadow-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#786d5c]" />
          <div className="absolute bottom-20 left-1/2 h-32 w-52 -translate-x-1/2 rounded-lg bg-[#533d2f] shadow-xl" />
          <div className="absolute bottom-52 left-[22%] h-24 w-24 rounded-full bg-[#7fb4a8] shadow-xl" />
          <div className="absolute bottom-52 right-[22%] h-24 w-24 rounded-full bg-[#e0b266] shadow-xl" />
          <div className="absolute left-8 top-8 rounded-md border border-[#f2dfb7] bg-[#2b1818] px-4 py-3 text-sm font-semibold text-[#ffd7d7]">
            Crisis overlay armed
          </div>
          <div className="absolute bottom-8 left-8 right-8 rounded-lg bg-[#0e1513]/90 p-4 backdrop-blur">
            <h2 className="text-xl font-semibold">Virtual office mock</h2>
            <p className="mt-2 text-sm leading-6 text-[#b7c9c3]">
              A frontend-only room concept for client review. The production
              session engine remains isolated from commerce identity data.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
