"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingSwitcherProps {
  priceDisplay: string;
  serviceTitle: string;
}

export function PricingSwitcher({
  priceDisplay,
  serviceTitle,
}: PricingSwitcherProps) {
  const [mode, setMode] = useState<"standard" | "scholarship">("standard");

  const isStandard = mode === "standard";

  return (
    <div className="space-y-6">
      <div
        role="group"
        aria-label="Pricing mode"
        className="flex p-1 rounded-pill bg-surface border border-border w-full"
      >
        <button
          type="button"
          onClick={() => setMode("standard")}
          aria-pressed={isStandard}
          className={cn(
            "flex-1 py-3 rounded-pill text-[10px] font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isStandard
              ? "bg-primary text-primary-foreground"
              : "text-text-muted hover:text-text-primary",
          )}
        >
          Standard Rate
        </button>
        <button
          type="button"
          onClick={() => setMode("scholarship")}
          aria-pressed={!isStandard}
          className={cn(
            "flex-1 py-3 rounded-pill text-[10px] font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !isStandard
              ? "bg-primary text-primary-foreground shadow-soft"
              : "text-text-muted hover:text-text-primary",
          )}
        >
          Scholarship
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-background border border-border relative overflow-hidden group shadow-soft">
        {!isStandard ? (
          <div className="absolute top-0 right-0 px-4 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide rounded-bl-xl motion-safe:animate-in motion-safe:slide-in-from-top-2 motion-safe:duration-300">
            Available
          </div>
        ) : null}

        <div
          aria-live="polite"
          aria-atomic="true"
          className="flex items-end gap-2 mb-6 motion-safe:transition-all motion-safe:duration-500"
        >
          <span className="text-5xl font-bold tracking-tight text-text-primary">
            {isStandard ? priceDisplay : "$0"}
          </span>
          <span className="text-text-muted font-bold uppercase text-[10px] pb-2 tracking-wide">
            {isStandard ? "Per Session" : "With Approved Scholarship"}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            isStandard
              ? "Immediate booking access"
              : "Requires application & review",
            "Confidential peer support",
            "Camera-free 3D environment",
            "Access to session materials",
          ].map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <Check
                className="w-4 h-4 text-success shrink-0"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        {isStandard ? (
          <Button
            asChild
            className="w-full h-14 rounded-pill bg-primary text-primary-foreground hover:bg-primary-dark font-bold text-base shadow-soft group"
            data-analytics={`cta-book-standard-${serviceTitle.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Link href="/checkout?package=standard">
              Book {serviceTitle}
              <Sparkles
                className="w-4 h-4 ml-2 motion-safe:group-hover:rotate-12 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full h-14 rounded-pill border-2 border-accent text-accent hover:bg-accent/10 font-bold text-base"
            data-analytics={`cta-apply-scholarship-${serviceTitle.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Link href="/scholarship">Apply for Scholarship</Link>
          </Button>
        )}
      </div>

      <p className="text-[11px] text-center text-text-muted uppercase tracking-wide leading-relaxed">
        {isStandard
          ? "Payments are securely processed via Stripe. 100% of proceeds fund our scholarship program."
          : "Scholarships are funded by donors and assigned based on financial need and availability."}
      </p>
    </div>
  );
}
