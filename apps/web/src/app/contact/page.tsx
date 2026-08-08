"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { Mail, MessageSquare, Building2, ShieldAlert, Newspaper, CreditCard, Send, Check, Loader2 } from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";

const contactSchema = z.object({
  submitterName: z.string().min(2, "Please share your name (at least 2 characters)").max(120),
  submitterEmail: z.string().email("A valid email is required so we can respond"),
  inquiryType: z.enum(["GENERAL", "SUPPORT", "PARTNERSHIP", "PRESS", "SECURITY", "BILLING"]),
  subject: z.string().min(3, "Please add a short subject").max(200),
  body: z.string().min(10, "Please describe your inquiry (at least 10 characters)").max(5000),
  consent: z.literal(true, { message: "You must consent to be contacted" }),
});

type ContactValues = z.infer<typeof contactSchema>;

const INQUIRY_TYPES: Array<{ value: ContactValues["inquiryType"]; label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = [
  { value: "GENERAL", label: "General", icon: MessageSquare, description: "Anything else" },
  { value: "SUPPORT", label: "Support", icon: Mail, description: "Need help with a session" },
  { value: "PARTNERSHIP", label: "Partnership", icon: Building2, description: "Org collaboration" },
  { value: "BILLING", label: "Billing", icon: CreditCard, description: "Payments or refunds" },
  { value: "PRESS", label: "Press", icon: Newspaper, description: "Media inquiries" },
  { value: "SECURITY", label: "Security", icon: ShieldAlert, description: "Vulnerability reports" },
];

const PRIORITY_BY_TYPE: Record<ContactValues["inquiryType"], "LOW" | "NORMAL" | "HIGH" | "URGENT"> = {
  GENERAL: "NORMAL",
  SUPPORT: "HIGH",
  PARTNERSHIP: "NORMAL",
  BILLING: "NORMAL",
  PRESS: "NORMAL",
  SECURITY: "URGENT",
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<{ id: string; slaDueAt: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: "GENERAL", consent: false as unknown as true },
  });
  const selectedType = watch("inquiryType");

  const onSubmit = async (values: ContactValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          priority: PRIORITY_BY_TYPE[values.inquiryType],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "We couldn't send your message. Please try again or email info@hips-support.org.");
        return;
      }
      setSubmitted({ id: data.inquiryId, slaDueAt: data.slaDueAt });
      reset({ inquiryType: "GENERAL", submitterName: "", submitterEmail: "", subject: "", body: "", consent: false as unknown as true });
    } catch (err) {
      setSubmitError("Network error. Please try again or email info@hips-support.org.");
    }
  };

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-primary">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Contact</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-primary leading-tight">
          How can we help?
        </h1>
        <p className="mt-3 max-w-2xl text-secondary font-body text-base md:text-lg leading-relaxed">
          Pick the category that best matches your message. A real human will respond within the priority SLA.
        </p>

        {submitted ? (
          <div
            role="status"
            className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">Message received</h2>
                <p className="mt-2 text-secondary">
                  Reference <code className="text-xs font-mono bg-surface px-1.5 py-0.5 rounded">{submitted.id}</code>.
                  We&apos;ll respond by{" "}
                  <strong className="text-primary">
                    {new Date(submitted.slaDueAt).toLocaleString()}
                  </strong>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="mt-4 text-sm font-semibold text-accent hover:underline"
                >
                  Send another message
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-8 bg-surface border border-border rounded-2xl p-8 shadow-soft">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary ml-1 mb-3">
                What is this about?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INQUIRY_TYPES.map((t) => {
                  const Icon = t.icon;
                  const active = selectedType === t.value;
                  return (
                    <label
                      key={t.value}
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col items-start gap-2 transition-all ${
                        active
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/40"
                      }`}
                    >
                      <input
                        type="radio"
                        value={t.value}
                        {...register("inquiryType")}
                        className="sr-only"
                      />
                      <Icon className={`w-4 h-4 ${active ? "text-accent" : "text-text-muted"}`} />
                      <div>
                        <p className="text-sm font-bold text-primary">{t.label}</p>
                        <p className="text-[11px] text-secondary">{t.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.inquiryType && (
                <p role="alert" className="text-xs text-destructive mt-2 ml-1">
                  {errors.inquiryType.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="submitterName" className="text-xs font-bold uppercase tracking-wider text-primary ml-1">
                  Your name
                </label>
                <input
                  id="submitterName"
                  type="text"
                  {...register("submitterName")}
                  aria-invalid={!!errors.submitterName}
                  aria-describedby={errors.submitterName ? "submitterName-error" : undefined}
                  className="mt-2 w-full h-12 rounded-lg border border-border bg-background px-4 text-sm text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  placeholder="Full name"
                />
                {errors.submitterName && (
                  <p id="submitterName-error" role="alert" className="text-xs text-destructive mt-1">
                    {errors.submitterName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="submitterEmail" className="text-xs font-bold uppercase tracking-wider text-primary ml-1">
                  Email
                </label>
                <input
                  id="submitterEmail"
                  type="email"
                  {...register("submitterEmail")}
                  aria-invalid={!!errors.submitterEmail}
                  aria-describedby={errors.submitterEmail ? "submitterEmail-error" : undefined}
                  className="mt-2 w-full h-12 rounded-lg border border-border bg-background px-4 text-sm text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  placeholder="you@example.com"
                />
                {errors.submitterEmail && (
                  <p id="submitterEmail-error" role="alert" className="text-xs text-destructive mt-1">
                    {errors.submitterEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-primary ml-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                {...register("subject")}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                className="mt-2 w-full h-12 rounded-lg border border-border bg-background px-4 text-sm text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                placeholder="Short summary"
              />
              {errors.subject && (
                <p id="subject-error" role="alert" className="text-xs text-destructive mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="body" className="text-xs font-bold uppercase tracking-wider text-primary ml-1">
                Message
              </label>
              <textarea
                id="body"
                rows={6}
                {...register("body")}
                aria-invalid={!!errors.body}
                aria-describedby={errors.body ? "body-error" : undefined}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                placeholder="Share the details of your inquiry..."
              />
              {errors.body && (
                <p id="body-error" role="alert" className="text-xs text-destructive mt-1">
                  {errors.body.message}
                </p>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-xs text-secondary leading-relaxed">
                  I consent to H.I.P.S. using the information above to respond to my inquiry.
                  Submissions are kept confidential.
                </span>
              </label>
              {errors.consent && (
                <p role="alert" className="text-xs text-destructive ml-7">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {submitError && (
              <div role="alert" className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-pill bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-soft hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send message
            </button>

            <p className="text-center text-[10px] text-text-muted uppercase tracking-widest">
              In crisis? Call or text <strong>988</strong> (US) immediately.
            </p>
          </form>
        )}

        <div className="mt-16 space-y-6 text-secondary leading-relaxed font-body">
          <h2 className="font-heading text-xl font-semibold text-primary mt-8">Direct contacts</h2>
          <p>General inquiries: <span className="text-accent">info@hips-support.org</span></p>
          <p>Security: <span className="text-accent">security@hips-support.org</span></p>
          <p>Partnerships: <span className="text-accent">partnerships@hips-support.org</span></p>
        </div>
      </div>
      </main>
    </>
  );
}
