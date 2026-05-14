import Link from 'next/link'

export default function AboutPage() {
  return (
    <section className="bg-brand-warm px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">About H.I.P.S.</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-deep">Peer support with identity kept out of the room.</h1>
        <p className="mt-5 text-lg leading-8 text-neutral-700">
          H.I.P.S. helps people access care sessions, coaching, cohorts, and workshops while keeping session participation anonymous. Commerce and identity records are separated from live session data so support can happen with less fear and more dignity.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['Anonymous by design', 'Session rooms use opaque tokens rather than personal profiles.'],
            ['Human support', 'Trained facilitators guide conversations and escalation moments.'],
            ['Clear boundaries', 'Identity vault access is limited to documented safety needs.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
            </div>
          ))}
        </div>
        <Link href="/services" className="mt-10 inline-flex rounded-full bg-brand-primary px-5 py-3 text-sm font-medium text-white">
          Explore services
        </Link>
      </div>
    </section>
  )
}
