"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/polish/ToastProvider";

export function OrganizationIntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [nonprofit, setNonprofit] = useState(false);
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    ein: "",
    eventType: "",
    headcount: "",
    preferredStart: "",
    preferredEnd: "",
    notes: "",
  });
  const fields: {
    label: string;
    key: keyof typeof form;
    type?: string;
  }[] = [
    { label: "Organization name", key: "orgName" },
    { label: "Contact name", key: "contactName" },
    { label: "Event type", key: "eventType" },
    { label: "Headcount", key: "headcount", type: "number" },
    { label: "Preferred start", key: "preferredStart", type: "date" },
    { label: "Preferred end", key: "preferredEnd", type: "date" },
  ];
  const toast = useToast();
  const valid = useMemo(() => {
    const headcount = Number(form.headcount);
    const einOk = !nonprofit || /^\d{2}-\d{7}$/.test(form.ein);
    return (
      form.orgName &&
      form.contactName &&
      form.eventType &&
      headcount >= 1 &&
      headcount <= 500 &&
      form.preferredStart &&
      form.preferredEnd &&
      einOk
    );
  }, [form, nonprofit]);

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Inquiry received</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          Thank you for reaching out. Our team is reviewing your event details.
        </p>
        <div className="text-left max-w-md mx-auto space-y-4">
          <div className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">1</span>
            <p className="text-sm text-gray-300"><span className="text-white font-medium">Initial Review</span>: We will audit your request within 48 hours.</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">2</span>
            <p className="text-sm text-gray-300"><span className="text-white font-medium">Custom Quote</span>: We&apos;ll email you a tailored proposal and availability.</p>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">3</span>
            <p className="text-sm text-gray-300"><span className="text-white font-medium">Confirmation</span>: A 25% deposit confirms your event date.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5 rounded-lg border border-white/10 bg-gray-950 p-6 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        toast("success", "Organization inquiry submitted.");
      }}
    >
      {fields.map(({ label, key, type = "text" }) => (
        <label className="grid gap-2" key={key}>
          <span>{label}</span>
          <input
            className="min-h-11 rounded-md border border-white/10 bg-black px-3"
            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            type={type}
            value={form[key as keyof typeof form]}
          />
        </label>
      ))}
      <label className="flex items-center gap-3 md:col-span-2">
        <input
          checked={nonprofit}
          className="h-4 w-4 accent-indigo-500"
          onChange={(event) => setNonprofit(event.target.checked)}
          type="checkbox"
        />
        <span>This organization is a nonprofit</span>
      </label>
      {nonprofit ? (
        <label className="grid gap-2 md:col-span-2">
          <span>EIN</span>
          <input
            className="min-h-11 rounded-md border border-white/10 bg-black px-3"
            onChange={(event) => setForm({ ...form, ein: event.target.value })}
            placeholder="12-3456789"
            value={form.ein}
          />
        </label>
      ) : null}
      <label className="grid gap-2 md:col-span-2">
        <span>Additional notes</span>
        <textarea
          className="min-h-32 rounded-md border border-white/10 bg-black p-3"
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          value={form.notes}
        />
      </label>
      <button
        className="min-h-11 rounded-md bg-indigo-500 px-4 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
        disabled={!valid}
        type="submit"
      >
        Send inquiry
      </button>
    </form>
  );
}
