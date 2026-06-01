import React, { memo, useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { Users, Shield, Clock, Heart } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  display: string;
  suffix: string;
  icon: React.ElementType;
  descriptor: string;
}

const stats: StatItem[] = [
  {
    label: "Safe Sessions",
    value: 12400,
    display: "12,400",
    suffix: "+",
    icon: Shield,
    descriptor: "Completed with zero identity breaches",
  },
  {
    label: "Active Participants",
    value: 8200,
    display: "8,200",
    suffix: "+",
    icon: Users,
    descriptor: "Members in our anonymous network",
  },
  {
    label: "Support Hours",
    value: 45000,
    display: "45",
    suffix: "k+",
    icon: Clock,
    descriptor: "Hours of peer support delivered",
  },
  {
    label: "Scholarships",
    value: 2100,
    display: "2,100",
    suffix: "+",
    icon: Heart,
    descriptor: "Sessions sponsored for those in need",
  },
];

function StatBlock({ stat }: { stat: StatItem }) {
  const { ref, displayValue, hasStarted } = useCountUp<HTMLDivElement>(stat.value, {
    duration: 1500,
    startOnView: true,
    suffix: stat.suffix,
  });

  const Icon = stat.icon as React.ComponentType<{ className?: string; 'aria-hidden'?: string }>;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-4 py-6 md:py-8 group"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-[#C59A35]/10 border border-[#C59A35]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-5 h-5 text-[#C59A35]" aria-hidden="true" />
      </div>

      {/* Animated counter */}
      <span
        className="text-5xl md:text-6xl font-bold text-[#C59A35] tracking-tight leading-none mb-3 font-heading"
        aria-live="polite"
        aria-label={`${stat.display}${stat.suffix} ${stat.label}`}
      >
        {hasStarted ? displayValue : '0' + stat.suffix}
      </span>

      {/* Label */}
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F8291] mb-2 font-ui brand-caps">
        {stat.label}
      </span>

      {/* Descriptor */}
      <span className="text-sm text-[#445A6C] leading-relaxed max-w-[20ch] font-body">
        {stat.descriptor}
      </span>
    </div>
  );
}

export const ImpactStats = memo(function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: dividerRef, hasStarted } = useCountUp(0, { startOnView: false });

  return (
    <section
      ref={sectionRef}
      className="pt-16 md:pt-24 pb-24 md:pb-32 bg-[#F6F8FA] relative overflow-hidden"
      aria-label="Impact statistics"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23213d53' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Intro */}
        <div className="text-center mb-12 md:mb-16">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59A35]/30 bg-[#C59A35]/5 backdrop-blur-xl px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59A35]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C59A35] font-ui">
              Our Impact
            </span>
          </div>

          {/* Section intro sentence */}
          <p className="text-base md:text-lg text-[#445A6C] leading-relaxed max-w-2xl mx-auto font-body">
            Numbers that represent real people finding real support — without compromising who they are.
          </p>
        </div>

        {/* Stats Row */}
        <div className="relative">
          {/* Top border */}
          <div className="border-t border-[#D6E0E8] mb-0" />

          <div className="flex flex-col md:flex-row items-stretch md:items-center">
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                {/* Stat block */}
                <div className="flex-1">
                  <StatBlock stat={stat} />
                </div>

                {/* Vertical divider — between stats, hidden on mobile */}
                {index < stats.length - 1 && (
                  <div
                    className="hidden md:block w-px bg-[#D6E0E8] self-stretch my-4"
                    aria-hidden="true"
                  />
                )}

                {/* Horizontal divider — between rows on mobile */}
                {index < stats.length - 1 && (
                  <div
                    className="md:hidden border-t border-[#D6E0E8] mx-4"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom border */}
          <div className="border-t border-[#D6E0E8] mt-0" />
        </div>
      </div>
    </section>
  );
});
