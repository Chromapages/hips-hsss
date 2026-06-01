'use client';

import React, { memo, useRef, useState, useEffect } from "react";
import { Shield, Lock, Heart, Star, CheckCircle2 } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

// Avatar data for overlapping circles
const avatarUsers = [
  { initials: "AJ", bg: "#213d53" },
  { initials: "KL", bg: "#2a4a6b" },
  { initials: "MR", bg: "#3d6080" },
  { initials: "SP", bg: "#4a7595" },
  { initials: "TC", bg: "#5a8aaa" },
];

interface TrustStat {
  value: number;
  display: string;
  label: string;
  icon: React.ElementType;
  noAnimate?: boolean;
  iconAccent?: boolean;
}

const trustStats: TrustStat[] = [
  {
    value: 12400,
    display: "12,400+",
    label: "Sessions completed safely",
    icon: Shield,
  },
  {
    value: 0,
    display: "Zero",
    label: "Identity breaches",
    icon: Lock,
    iconAccent: true,
  },
  {
    value: 98,
    display: "98%",
    label: "Report feeling safer after",
    icon: Heart,
  },
  {
    value: 49,
    display: "4.9★",
    label: "Average participant rating",
    icon: Star,
    noAnimate: true,
  },
];

interface StatBlockProps {
  stat: TrustStat;
  index: number;
  animationClass: string;
}

function StatBlock({ stat, index, animationClass }: StatBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (blockRef.current) observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  const { displayValue, hasStarted } = useCountUp<HTMLDivElement>(stat.value, {
    duration: 1500,
    startOnView: true,
  });

  const Icon = stat.icon as React.ComponentType<{ className?: string; 'aria-hidden'?: string | boolean }>;

  return (
    <div
      ref={blockRef}
      className={`flex flex-col items-center text-center px-3 py-4 rounded-xl hover:bg-[#C59A35]/8 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#C59A35]/30 ${animationClass}`}
      style={index % 2 === 0 && index > 0 ? { borderLeft: "1px solid #D6E0E8" } : index > 1 ? { borderTop: "1px solid #D6E0E8" } : undefined}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${stat.iconAccent ? 'bg-[#C59A35]/10 border border-[#C59A35]/20' : 'bg-[#C59A35]/10 border border-[#C59A35]/20'}`}>
        {stat.iconAccent ? (
          <CheckCircle2 className="w-4 h-4 text-[#C59A35]" aria-hidden="true" />
        ) : (
          <Icon className="w-4 h-4 text-[#C59A35]" aria-hidden="true" />
        )}
      </div>

      {/* Animated counter */}
      <span
        className="text-3xl md:text-4xl font-bold text-[#213d53] tracking-tight leading-none mb-1 font-heading"
        aria-live="polite"
        aria-label={`${stat.display} ${stat.label}`}
      >
        {visible && (stat.noAnimate ? (hasStarted ? stat.display : '0') : (hasStarted ? displayValue : '0'))}
      </span>

      {/* Label */}
      <span className="text-[10px] text-[#6F8291] leading-relaxed font-body text-center max-w-[12ch]">
        {stat.label}
      </span>
    </div>
  );
}

export const TrustStrip = memo(function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const trustBadges = ['NBC News', 'Forbes', 'Psychology Today', 'HuffPost'];

  return (
    <section
      ref={sectionRef}
      className="py-[clamp(2rem,4vw,3rem)] md:py-[clamp(2.5rem,5vw,3.5rem)] bg-[#F6F8FA] border-t border-b border-[#D6E0E8]"
      aria-label="Trust and credibility statistics"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Two-column grid: left = credibility content, right = quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Left Column — credibility hierarchy */}
          <div>
            {/* Row 1: Overlapping avatars + reassurance line */}
            <div className={`flex items-center gap-4 mb-5 ${visible ? 'trust-fade-1' : 'opacity-0'}`}>
              {/* Overlapping avatar circles */}
              <div className="flex -space-x-2">
                {avatarUsers.map((user, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#F6F8FA] flex items-center justify-center text-[9px] font-bold text-white font-heading"
                    style={{ backgroundColor: user.bg, zIndex: 5 - i }}
                    aria-hidden="true"
                  >
                    {user.initials}
                  </div>
                ))}
              </div>
              {/* Credibility line */}
              <p className="text-sm font-bold text-[#213d53] font-heading leading-snug">
                Trusted by <span className="text-[#C59A35]">12,400+</span> people in crisis
              </p>
            </div>

            {/* Row 2: Emotional reassurance hook */}
            <div className={`mb-6 ${visible ? 'trust-fade-2' : 'opacity-0'}`}>
              <p className="font-heading text-xl md:text-2xl font-bold text-[#213d53] leading-snug">
                You are not alone.<br />This works.
              </p>
            </div>

            {/* Row 3: 2×2 stat grid */}
            <div className={`grid grid-cols-2 gap-y-2 gap-x-4 mb-6 ${visible ? 'trust-fade-3' : 'opacity-0'}`}>
              {trustStats.map((stat, index) => (
                <StatBlock key={stat.label} stat={stat} index={index} animationClass="" />
              ))}
            </div>

            {/* Row 4: Trust badges / press logos */}
            <div className={`${visible ? 'trust-fade-4' : 'opacity-0'}`}>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6F8291] mb-3 font-ui">
                As seen in
              </p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#213d53]/60 font-ui opacity-60"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Testimonial Quote */}
          <div className="pl-0 md:pl-10 md:border-l border-[#D6E0E8]">
            <div className={`text-center md:text-left ${visible ? 'trust-fade-5' : 'opacity-0'}`}>
              {/* Quote mark accent */}
              <span className="text-5xl text-[#C59A35]/30 font-serif leading-none block mb-4">"</span>

              {/* Quote text */}
              <blockquote>
                <p className="font-heading text-2xl md:text-3xl italic text-[#213d53] leading-relaxed">
                  I came here broken and invisible. I left feeling seen for the first time in years — without ever showing my face.
                </p>
              </blockquote>

              {/* Attribution */}
              <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                {/* Avatar initials badge */}
                <div
                  className="w-10 h-10 rounded-full bg-[#213d53] text-white flex items-center justify-center text-sm font-bold font-heading shrink-0"
                  aria-hidden="true"
                >
                  MT
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#213d53] font-heading">Marcus T.</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6F8291] font-ui">Peer Support Participant</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});