export default function AnonymityPage() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">Anonymity model</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-deep">Your support session does not need your identity.</h1>
        <div className="mt-8 space-y-6 text-base leading-8 text-neutral-700">
          <p>
            The platform separates checkout and account data from session participation. Live rooms receive anonymous session tokens, avatar choices, and safety state. Personal details stay in the identity vault.
          </p>
          <p>
            Facilitators can support the person in front of them without seeing unnecessary personal data. Crisis workflows are designed to request only the minimum information needed for safety.
          </p>
        </div>
        <div className="mt-10 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">What session peers see</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            <li>Anonymous display name and avatar</li>
            <li>Session presence and voice state</li>
            <li>Safety notices required for the room</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
