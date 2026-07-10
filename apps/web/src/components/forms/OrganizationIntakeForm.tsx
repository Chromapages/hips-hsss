"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod/v3";
import { useToast } from "@/components/polish/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/FormField";
import { Check, Send, Calendar, Users, Building2, User, Mail } from "lucide-react";

const intakeSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("A valid work email is required"),
  isNonprofit: z.boolean().default(false),
  ein: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^\d{2}-\d{7}$/.test(val);
  }, "EIN must follow format XX-XXXXXXX"),
  eventType: z.string().min(1, "Please select an event type"),
  headcount: z.coerce.number().min(1, "Min 1 participant").max(500, "Max 500 participants"),
  preferredStart: z.string().min(1, "Start date is required"),
  preferredEnd: z.string().min(1, "End date is required"),
  message: z.string().optional(),
}).refine((data) => {
  if (data.isNonprofit && !data.ein) return false;
  return true;
}, {
  message: "EIN is required for nonprofits",
  path: ["ein"],
}).refine((data) => {
  if (!data.preferredStart || !data.preferredEnd) return true;
  return new Date(data.preferredEnd) >= new Date(data.preferredStart);
}, {
  message: "End date must be on or after the start date",
  path: ["preferredEnd"],
});

type IntakeInput = z.input<typeof intakeSchema>;
type IntakeValues = z.output<typeof intakeSchema>;

export function OrganizationIntakeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const methods = useForm<IntakeInput, unknown, IntakeValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      isNonprofit: false,
      headcount: 10,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const isNonprofit = watch("isNonprofit");

  const onSubmit = async (values: IntakeValues) => {
    try {
      const res = await fetch('/api/organizations/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast("error", data.error || "Failed to submit inquiry.");
        return;
      }

      setIsSubmitted(true);
      toast("success", "Organization inquiry sent.");
    } catch (err) {
      toast("error", "Failed to submit inquiry. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-12 text-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative shadow-card">
        {/* Success Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
        
        <div className="mx-auto w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-4 font-heading">Inquiry Received</h2>
        <p className="text-text-secondary max-w-sm mx-auto leading-relaxed mb-12 font-body">
          Thank you for reaching out. Our partnerships team will review your requirements and provide a custom proposal within 48 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          {[
            { step: 1, title: "Initial Review", desc: "We audit your request for team fit and capacity." },
            { step: 2, title: "Custom Proposal", desc: "You'll receive a tailored quote and date options." },
            { step: 3, title: "Onboarding", desc: "A 25% deposit locks your date and initiates setup." },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-xl bg-surface border border-border space-y-3 shadow-soft">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-ui">Phase 0{item.step}</span>
              <h3 className="text-sm font-bold text-text-primary font-heading">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed font-body">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="mt-12 rounded-pill px-8 h-12 font-ui text-xs uppercase tracking-wider"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-border rounded-2xl p-8 md:p-10 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="orgName">
                <Building2 className="w-4 h-4 text-text-muted" />
                Organization Name
              </label>
              <FormField name="orgName">
                <Input placeholder="e.g. Acme Corp" {...register("orgName")} />
              </FormField>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="contactName">
                <User className="w-4 h-4 text-text-muted" />
                Primary Contact
              </label>
              <FormField name="contactName">
                <Input placeholder="Full Name" {...register("contactName")} />
              </FormField>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="email">
                <Mail className="w-4 h-4 text-text-muted" />
                Work Email
              </label>
              <FormField name="email">
                <Input type="email" placeholder="name@organization.org" {...register("email")} />
              </FormField>
            </div>

            <div className="pt-2 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-white transition-all cursor-pointer"
                  {...register("isNonprofit")}
                />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors cursor-pointer select-none font-body">This is a 501(c)(3) nonprofit organization</span>
              </label>

              {isNonprofit && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="ein">Tax ID (EIN)</label>
                  <FormField name="ein">
                    <Input placeholder="XX-XXXXXXX" {...register("ein")} />
                  </FormField>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="eventType">Event Type</label>
              <FormField name="eventType">
                <div className="relative">
                  <select
                    id="eventType"
                    {...register("eventType")}
                    className="w-full h-12 rounded-lg border border-border bg-surface px-4 text-sm text-text-primary focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer font-body"
                  >
                    <option value="" className="bg-surface text-text-primary">Select event type</option>
                    <option value="WORKSHOP" className="bg-surface text-text-primary">Interactive Workshop</option>
                    <option value="RECURRING" className="bg-surface text-text-primary">Recurring Peer Support</option>
                    <option value="CONSULTANCY" className="bg-surface text-text-primary">Care Navigation Setup</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary" aria-hidden="true">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </FormField>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="headcount">
                <Users className="w-4 h-4 text-text-muted" />
                Estimated Headcount
              </label>
              <FormField name="headcount">
                <Input type="number" {...register("headcount")} />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="preferredStart">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  Earliest Start
                </label>
                <FormField name="preferredStart">
                  <Input type="date" {...register("preferredStart")} />
                </FormField>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="preferredEnd">Latest End</label>
                <FormField name="preferredEnd">
                  <Input type="date" {...register("preferredEnd")} />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold font-ui uppercase tracking-wider text-text-primary ml-1" htmlFor="message">Additional Requirements (Optional)</label>
          <FormField name="message">
            <Textarea
              placeholder="Tell us more about your team's specific needs..."
              className="min-h-[120px]"
              {...register("message")}
            />
          </FormField>
        </div>

        <Button 
          type="submit" 
          isLoading={isSubmitting}
          className="w-full h-12 rounded-pill bg-primary hover:bg-primary-dark text-xs font-bold font-ui uppercase tracking-wider shadow-soft transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          Send Partnership Inquiry
          <Send className="w-3.5 h-3.5" />
        </Button>

        <p className="text-center text-[10px] text-text-muted font-ui uppercase tracking-widest">
          Confidentiality Guaranteed • Response within 48 Hours
        </p>
      </form>
    </FormProvider>
  );
}
