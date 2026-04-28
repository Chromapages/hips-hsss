import { ScholarshipForm } from "@/components/forms/ScholarshipForm";

export default function ScholarshipPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
          Scholarship
        </p>
        <h1 className="mt-3 text-4xl font-bold">Request access support.</h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          Applications are reviewed privately and do not appear in session rooms.
        </p>
        <div className="mt-8">
          <ScholarshipForm />
        </div>
      </section>
    </main>
  );
}
