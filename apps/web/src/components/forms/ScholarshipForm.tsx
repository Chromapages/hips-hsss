"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/polish/ToastProvider";

type ScholarshipData = {
  employmentStatus: string;
  incomeRange: string;
  serviceType: string;
  personalStatement: string;
  referralSource: string;
  consentAcknowledged: boolean;
};

const initial: ScholarshipData = {
  employmentStatus: "",
  incomeRange: "",
  serviceType: "",
  personalStatement: "",
  referralSource: "",
  consentAcknowledged: false,
};

export function ScholarshipForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState(initial);
  const toast = useToast();

  const valid = useMemo(() => {
    if (step === 0) {
      return data.employmentStatus && data.incomeRange && data.serviceType;
    }
    if (step === 1) {
      return data.personalStatement.length >= 50 && data.referralSource;
    }
    return data.consentAcknowledged;
  }, [data, step]);

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-8">
        <h2 className="text-2xl font-bold text-emerald-100">Application received</h2>
        <p className="mt-3 text-emerald-100/80">
          The team will review it within 48 hours and reply with next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-lg border border-white/10 bg-gray-950 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        window.setTimeout(() => {
          setLoading(false);
          setSubmitted(true);
          toast("success", "Scholarship application submitted.");
        }, 500);
      }}
    >
      <div role="list" aria-label="Application steps" className="mb-6 flex gap-2">
        {(["Eligibility", "Details", "Review"] as const).map((label, index) => (
          <span
            role="listitem"
            aria-current={step === index ? "step" : undefined}
            className={[
              "rounded-full border px-3 py-1 text-xs",
              step === index
                ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                : "border-white/10 text-gray-400",
            ].join(" ")}
            key={label}
          >
            {label}
          </span>
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span>Current employment status</span>
            <select
              className="min-h-11 rounded-md border border-white/10 bg-black px-3"
              onChange={(event) => setData({ ...data, employmentStatus: event.target.value })}
              value={data.employmentStatus}
            >
              <option value="">Select one</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span>Monthly income estimate</span>
            <input
              className="min-h-11 rounded-md border border-white/10 bg-black px-3"
              onChange={(event) => setData({ ...data, incomeRange: event.target.value })}
              value={data.incomeRange}
            />
          </label>
          <label className="grid gap-2">
            <span>Service type</span>
            <select
              className="min-h-11 rounded-md border border-white/10 bg-black px-3"
              onChange={(event) => setData({ ...data, serviceType: event.target.value })}
              value={data.serviceType}
            >
              <option value="">Select one</option>
              <option value="peer-support">Peer support</option>
              <option value="support-navigation">Support navigation</option>
              <option value="group-coaching">Group coaching</option>
            </select>
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span>Personal statement</span>
            <textarea
              className="min-h-40 rounded-md border border-white/10 bg-black p-3"
              maxLength={500}
              onChange={(event) => setData({ ...data, personalStatement: event.target.value })}
              value={data.personalStatement}
            />
            <span className="text-sm text-gray-400">{data.personalStatement.length}/500</span>
          </label>
          <label className="grid gap-2">
            <span>How did you hear about us?</span>
            <input
              className="min-h-11 rounded-md border border-white/10 bg-black px-3"
              onChange={(event) => setData({ ...data, referralSource: event.target.value })}
              value={data.referralSource}
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 text-sm text-gray-300">
          {([
            { key: 'employmentStatus', label: 'Employment Status' },
            { key: 'incomeRange',       label: 'Monthly Income' },
            { key: 'serviceType',       label: 'Service Type' },
            { key: 'personalStatement', label: 'Personal Statement' },
            { key: 'referralSource',    label: 'Referral Source' },
          ] as const).map(({ key, label }) => (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-2" key={key}>
              <span className="text-gray-500">{label}</span>
              <span className="text-right max-w-[60%] truncate">{String(data[key])}</span>
            </div>
          ))}
          <label className="flex gap-3">
            <input
              checked={data.consentAcknowledged}
              className="mt-1 h-4 w-4 accent-indigo-500"
              onChange={(event) => setData({ ...data, consentAcknowledged: event.target.checked })}
              type="checkbox"
            />
            <span>I confirm this request is accurate.</span>
          </label>
        </div>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        <button
          className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          type="button"
        >
          Back
        </button>
        {step < 2 ? (
          <button
            className="min-h-11 rounded-md bg-indigo-500 px-4 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!valid}
            onClick={() => setStep((value) => value + 1)}
            type="button"
          >
            Continue
          </button>
        ) : (
          <button
            className="min-h-11 rounded-md bg-indigo-500 px-4 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!valid || loading}
            type="submit"
          >
            {loading ? "Submitting..." : "Submit application"}
          </button>
        )}
      </div>
    </form>
  );
}
