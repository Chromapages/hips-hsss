"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ScholarshipForm } from "@/components/forms/ScholarshipForm";

export default function ScholarshipPageClient() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-surface text-primary">
        <section className="mx-auto max-w-4xl px-5 py-12">
          {/* Section label - gold uppercase with tracking */}
          <p className="text-sm font-semibold uppercase tracking-wide text-accent brand-caps">
            Scholarship
          </p>
          {/* H1 - ceremonial serif */}
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary leading-tight">
            Request access support.
          </h1>
          {/* Body text - secondary for readability */}
          <p className="mt-3 max-w-2xl text-secondary font-body text-base md:text-lg leading-relaxed">
            Applications are reviewed privately and do not appear in session rooms.
          </p>
          <div className="mt-8">
            <ScholarshipForm />
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
