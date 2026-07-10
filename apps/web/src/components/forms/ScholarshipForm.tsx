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
import { useAuth } from "@/components/auth/AuthProvider";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const scholarshipSchema = z.object({
  employmentStatus: z.enum(["employed", "unemployed", "student", "disabled"], {
    message: "Please select your status",
  }),
  incomeRange: z.string().min(1, "Income estimate is required"),
  serviceType: z.string().min(1, "Please select a service"),
  personalStatement: z.string()
    .min(50, "Statement must be at least 50 characters")
    .max(500, "Statement must not exceed 500 characters"),
  referralSource: z.string().min(1, "Please tell us how you heard about us"),
  consentAcknowledged: z.boolean().refine((value) => value, "You must confirm the accuracy"),
});

type ScholarshipValues = z.infer<typeof scholarshipSchema>;

const STEPS = ["Eligibility", "Details", "Review"];

export function ScholarshipForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { getToken } = useAuth();
  const toast = useToast();

  const methods = useForm<ScholarshipValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      incomeRange: "",
      serviceType: "",
      personalStatement: "",
      referralSource: "",
      consentAcknowledged: false,
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchAll = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof ScholarshipValues)[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["employmentStatus", "incomeRange", "serviceType"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["personalStatement", "referralSource"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: ScholarshipValues) => {
    try {
      const token = await getToken();
      if (!token) {
        toast("error", "You must be logged in to apply.");
        return;
      }

      const requestedCents =
        values.serviceType === "peer-support" ? 15000 :
        values.serviceType === "group-coaching" ? 10000 :
        values.serviceType === "care-navigation" ? 5000 : 10000;

      const res = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestedCents,
          employmentStatus: values.employmentStatus,
          incomeRange: values.incomeRange,
          serviceType: values.serviceType,
          personalStatement: values.personalStatement,
          referralSource: values.referralSource,
          consentAcknowledged: values.consentAcknowledged,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const message = data.code === 'DEADLINE_PASSED'
          ? 'Applications are closed for this cycle. Please check back next time.'
          : data.code === 'DUPLICATE_APPLICATION'
            ? 'You already have an active application under review.'
            : data.error || 'Failed to submit application.';
        toast("error", message);
        return;
      }

      setIsSubmitted(true);
      toast("success", "Application submitted successfully.");
    } catch (err) {
      toast("error", "Failed to submit application. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-[2.5rem] bg-surface/5 border border-white/10 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
        <p className="text-text max-w-sm mx-auto leading-relaxed">
          Our team will review your request within 48 hours. You will receive an update via your secure dashboard.
        </p>
        <Button 
          variant="outline" 
          className="mt-8 rounded-2xl px-8 h-12"
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-surface/5 -translate-y-1/2 z-0" />
        {STEPS.map((label, index) => (
          <div key={label} className="relative z-10 flex flex-col items-center gap-3">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                currentStep === index 
                  ? "bg-primary border-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]" 
                  : currentStep > index
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : "bg-black border-white/10"
              )}
            >
              {currentStep > index ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <span className={cn("text-sm font-bold", currentStep === index ? "text-white" : "text-muted-foreground")}>
                  {index + 1}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              currentStep === index ? "text-text" : "text-text"
            )}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted ml-1" htmlFor="employmentStatus">Employment Status</label>
                <FormField name="employmentStatus">
                  <select
                    id="employmentStatus"
                    {...register("employmentStatus")}
                    className="w-full h-12 rounded-2xl border border-white/5 bg-surface/5 px-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all appearance-none"
                  >
                    <option value="" className="bg-text">Select your status</option>
                    <option value="employed" className="bg-text">Employed</option>
                    <option value="unemployed" className="bg-text">Unemployed</option>
                    <option value="student" className="bg-text">Student</option>
                    <option value="disabled" className="bg-text">Disabled</option>
                  </select>
                </FormField>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted ml-1" htmlFor="incomeRange">Monthly Income Estimate</label>
                <FormField name="incomeRange">
                  <Input 
                    placeholder="e.g. $2,500"
                    {...register("incomeRange")}
                  />
                </FormField>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted ml-1" htmlFor="serviceType">Desired Service</label>
                <FormField name="serviceType">
                  <select
                    id="serviceType"
                    {...register("serviceType")}
                    className="w-full h-12 rounded-2xl border border-white/5 bg-surface/5 px-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none transition-all appearance-none"
                  >
                    <option value="" className="bg-text">Select a service</option>
                    <option value="peer-support" className="bg-text">1:1 Peer Support</option>
                    <option value="group-coaching" className="bg-text">Group Coaching</option>
                    <option value="care-navigation" className="bg-text">Care Navigation</option>
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-text-muted" htmlFor="personalStatement">Personal Statement</label>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter",
                    watchAll.personalStatement.length >= 50 ? "text-emerald-500" : "text-muted-foreground"
                  )}>
                    {watchAll.personalStatement.length}/500
                  </span>
                </div>
                <FormField name="personalStatement">
                  <Textarea 
                    placeholder="Briefly describe why you are seeking support access..."
                    className="min-h-[160px]"
                    {...register("personalStatement")}
                  />
                </FormField>
                <p className="text-[10px] text-muted-foreground ml-1">Min 50 characters required for review.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted ml-1" htmlFor="referralSource">How did you hear about us?</label>
                <FormField name="referralSource">
                  <Input 
                    placeholder="e.g. Social media, Friend, Healthcare provider"
                    {...register("referralSource")}
                  />
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="rounded-2xl bg-black/40 border border-white/5 divide-y divide-white/5 overflow-hidden">
                {[
                  { label: "Status", value: watchAll.employmentStatus },
                  { label: "Income", value: watchAll.incomeRange },
                  { label: "Service", value: watchAll.serviceType },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between px-5 py-4 text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-text-muted font-medium capitalize">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 px-1">
                <label className="flex gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="consentAcknowledged"
                    aria-invalid={!!errors.consentAcknowledged}
                    aria-describedby={errors.consentAcknowledged ? "consentAcknowledged-error" : undefined}
                    className="mt-1 h-4 w-4 rounded border-border-strong bg-zinc-950 text-text focus:ring-primary focus:ring-offset-black"
                    {...register("consentAcknowledged")}
                  />
                  <span className="text-xs text-text leading-relaxed group-hover:text-text-muted transition-colors">
                    I confirm that the information provided is accurate and that I am requesting access support in good faith.
                  </span>
                </label>
                {errors.consentAcknowledged && (
                  <p id="consentAcknowledged-error" role="alert" className="text-xs text-destructive ml-7">
                    {errors.consentAcknowledged.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            {currentStep > 0 && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={prevStep}
                className="flex-1 h-12 rounded-2xl"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary shadow-lg shadow-primary/20"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary shadow-lg shadow-primary/20"
              >
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
