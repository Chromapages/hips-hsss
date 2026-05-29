"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/polish/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Send, Calendar, Users, Building2, User } from "lucide-react";

const intakeSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  isNonprofit: z.boolean().default(false),
  ein: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^\d{2}-\d{7}$/.test(val);
  }, "EIN must follow format XX-XXXXXXX"),
  eventType: z.string().min(1, "Please select an event type"),
  headcount: z.coerce.number().min(1, "Min 1 participant").max(500, "Max 500 participants"),
  preferredStart: z.string().min(1, "Start date is required"),
  preferredEnd: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.isNonprofit && !data.ein) return false;
  return true;
}, {
  message: "EIN is required for nonprofits",
  path: ["ein"],
});

type IntakeInput = z.input<typeof intakeSchema>;
type IntakeValues = z.output<typeof intakeSchema>;

export function OrganizationIntakeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IntakeInput, unknown, IntakeValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      isNonprofit: false,
      headcount: 10,
    },
  });

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
      <div className="rounded-[2.5rem] bg-white/5 border border-white/10 p-12 text-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden relative">
        {/* Success Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10" />
        
        <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Inquiry Received</h2>
        <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed mb-12">
          Thank you for reaching out. Our partnerships team will review your requirements and provide a custom proposal within 48 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          {[
            { step: 1, title: "Initial Review", desc: "We audit your request for team fit and capacity." },
            { step: 2, title: "Custom Proposal", desc: "You'll receive a tailored quote and date options." },
            { step: 3, title: "Onboarding", desc: "A 25% deposit locks your date and initiates setup." },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Phase 0{item.step}</span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="mt-12 rounded-2xl px-8 h-12"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 ml-1">
              <Building2 className="w-4 h-4 text-zinc-500" />
              Organization Name
            </label>
            <Input placeholder="e.g. Acme Corp" {...register("orgName")} />
            {errors.orgName && <p className="text-xs text-red-500 ml-1">{errors.orgName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 ml-1">
              <User className="w-4 h-4 text-zinc-500" />
              Primary Contact
            </label>
            <Input placeholder="Full Name" {...register("contactName")} />
            {errors.contactName && <p className="text-xs text-red-500 ml-1">{errors.contactName.message}</p>}
          </div>

          <div className="pt-2 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="h-5 w-5 rounded-lg border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-black transition-all"
                {...register("isNonprofit")}
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">This is a 501(c)(3) nonprofit organization</span>
            </label>

            {isNonprofit && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-zinc-300 ml-1">Tax ID (EIN)</label>
                <Input placeholder="XX-XXXXXXX" {...register("ein")} />
                {errors.ein && <p className="text-xs text-red-500 ml-1">{errors.ein.message}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              {...register("eventType")}
              className="w-full h-12 rounded-2xl border border-white/5 bg-white/5 px-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition-all appearance-none"
            >
              <option value="" className="bg-zinc-900">Select event type</option>
              <option value="workshop" className="bg-zinc-900">Interactive Workshop</option>
              <option value="recurring" className="bg-zinc-900">Recurring Peer Support</option>
              <option value="consultancy" className="bg-zinc-900">Care Navigation Setup</option>
            </select>
            {errors.eventType && <p className="text-xs text-red-500 ml-1">{errors.eventType.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 ml-1">
              <Users className="w-4 h-4 text-zinc-500" />
              Estimated Headcount
            </label>
            <Input type="number" {...register("headcount")} />
            {errors.headcount && <p className="text-xs text-red-500 ml-1">{errors.headcount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 ml-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Earliest Start
              </label>
              <Input type="date" {...register("preferredStart")} />
              {errors.preferredStart && <p className="text-xs text-red-500 ml-1">{errors.preferredStart.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Latest End</label>
              <Input type="date" {...register("preferredEnd")} />
              {errors.preferredEnd && <p className="text-xs text-red-500 ml-1">{errors.preferredEnd.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300 ml-1">Additional Requirements (Optional)</label>
        <Textarea 
          placeholder="Tell us more about your team's specific needs..."
          className="min-h-[120px]"
          {...register("notes")}
        />
      </div>

      <Button 
        type="submit" 
        isLoading={isSubmitting}
        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-base font-bold shadow-xl shadow-indigo-900/20 group"
      >
        Send Partnership Inquiry
        <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">
        Confidentiality Guaranteed • Response within 48 Hours
      </p>
    </form>
  );
}
