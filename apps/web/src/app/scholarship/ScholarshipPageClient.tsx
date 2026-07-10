"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ScholarshipForm } from "@/components/forms/ScholarshipForm";
import { AlertCircle, CalendarClock } from "lucide-react";

type DeadlineState = {
  loading: boolean;
  accepting: boolean;
  deadline: string | null;
  message: string | null;
};

export default function ScholarshipPageClient() {
  const [state, setState] = useState<DeadlineState>({
    loading: true,
    accepting: true,
    deadline: null,
    message: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch("/api/scholarships/apply", { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) {
          setState({ loading: false, accepting: true, deadline: null, message: null });
          return;
        }
        const data = await r.json();
        setState({
          loading: false,
          accepting: Boolean(data.accepting),
          deadline: data.deadline ?? null,
          message: data.message ?? null,
        });
      })
      .catch(() => {
        setState({ loading: false, accepting: true, deadline: null, message: null });
      });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <AuthGuard>
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-primary">
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

          {!state.loading && !state.accepting && (
            <div
              role="alert"
              className="mt-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-700 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Applications are closed</p>
                <p className="text-sm mt-1">
                  {state.message ?? "The current application cycle has ended. Please check back next cycle."}
                </p>
                {state.deadline && (
                  <p className="text-xs mt-2 inline-flex items-center gap-1.5 opacity-80">
                    <CalendarClock className="w-3.5 h-3.5" />
                    Closed on {new Date(state.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {!state.loading && state.accepting && state.deadline && (
            <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" />
              Applications close {new Date(state.deadline).toLocaleDateString()}
            </p>
          )}

          <div className="mt-8">
            {state.accepting ? (
              <ScholarshipForm />
            ) : (
              <div className="rounded-[2.5rem] bg-surface/5 border border-white/10 p-12 text-center opacity-60">
                <p className="text-text">
                  The application form is currently closed. Thank you for your interest.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
