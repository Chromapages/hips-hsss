"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrganizationIntakeForm } from "@/components/forms/OrganizationIntakeForm";

export default function OrganizationsPageClient() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <section className="mx-auto max-w-4xl px-5 py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
            Partnerships
          </p>
          <h1 className="mt-3 text-4xl font-bold">Custom program inquiry.</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Tailored peer support solutions for teams, organizations, and communities.
          </p>
          <div className="mt-8">
            <OrganizationIntakeForm />
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
