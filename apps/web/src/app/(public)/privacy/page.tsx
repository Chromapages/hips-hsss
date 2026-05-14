export default function PrivacyPage() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-brand-deep">Privacy Policy</h1>
        <p className="mt-4 text-sm text-neutral-500">Last updated May 13, 2026</p>
        <div className="mt-8 space-y-6 text-base leading-8 text-neutral-700">
          <p>
            H.I.P.S. collects only the information needed to provide accounts, payments, scheduling, support sessions, safety workflows, and platform operations.
          </p>
          <p>
            Live session participation uses anonymous tokens. Personal identity data is separated from session records and is only accessed under documented operational or safety requirements.
          </p>
          <p>
            We use trusted service providers for payments, authentication, hosting, email, and analytics. We do not sell personal information.
          </p>
          <p>
            Contact support for privacy requests, access requests, or account deletion.
          </p>
        </div>
      </div>
    </section>
  )
}
