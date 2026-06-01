"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrganizationIntakeForm } from "@/components/forms/OrganizationIntakeForm";

export default function OrganizationsPageClient() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-white text-primary">
        <section className="mx-auto max-w-4xl px-5 py-12">
          {/* Section label - gold uppercase with tracking */}
          <p className="text-sm font-semibold uppercase tracking-wide text-accent brand-caps">
            Partnerships
          </p>
          {/* H1 - ceremonial serif */}
          <h1 className="mt-3 font-heading text-4xl font-bold text-primary leading-tight">
            Custom program inquiry.
          </h1>
          {/* Body text - secondary for readability */}
          <p className="mt-3 max-w-2xl text-secondary font-body text-base md:text-lg leading-relaxed">
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
