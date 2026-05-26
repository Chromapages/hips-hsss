import { OrganizationIntakeForm } from "@/components/forms/OrganizationIntakeForm";

export default function OrganizationsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
          Organizations
        </p>
        <h1 className="mt-3 text-4xl font-bold">Bring peer support to your team.</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Submit event details and the team will respond with a custom quote within 48 hours.
        </p>
        <div className="mt-8">
          <OrganizationIntakeForm />
        </div>
      </section>
    </main>
  );
}
