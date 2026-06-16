"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { OrganizationIntakeForm } from "@/components/forms/OrganizationIntakeForm";

const OrganizationsPageClient = () => {
  return (
    <AuthGuard>
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-text-primary selection:bg-primary/20">
        <section className="mx-auto max-w-4xl px-6 py-16 flex flex-col items-center">
          {/* Category Badge - Gold uppercase with tracking */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-widest text-accent font-ui mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Partnerships
          </div>
          {/* H1 - ceremonial serif centered */}
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter text-text-primary text-center leading-tight">
            Custom program inquiry.
          </h1>
          {/* Body text - centered secondary */}
          <p className="mt-4 max-w-xl text-text-secondary font-body text-base md:text-lg leading-relaxed text-center">
            Tailored peer support solutions for teams, organizations, and communities.
          </p>
          <div className="mt-10 w-full">
            <OrganizationIntakeForm />
          </div>
        </section>
      </main>
    </AuthGuard>
  );
};

export default OrganizationsPageClient;
