import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, Users, ShieldAlert, Award } from "lucide-react";

export function AuthBrandPanel({ variant = "participant" }: { variant?: "participant" | "facilitator" | "admin" | "host" }) {
  const isHost = variant === "host" || variant === "facilitator";
  const isAdmin = variant === "admin";

  let heading = "Hard Anonymity.";
  let goldHeading = "Real Connection.";
  let tagline = "The secure space for peer-led recovery, connection, and growth.";
  let mobileLabel = "Peer Support Network";
  let badges = [
    { icon: ShieldCheck, text: "No personal data stored" },
    { icon: Lock, text: "Encrypted group rooms" },
    { icon: Users, text: "Verified peer facilitators" },
  ];

  if (isHost) {
    heading = "Host Portal.";
    goldHeading = "Empower Peers.";
    tagline = "Provide support, facilitate group calls, and coordinate sessions with absolute participant anonymity.";
    mobileLabel = "Host Portal";
    badges = [
      { icon: ShieldCheck, text: "Authorized host access only" },
      { icon: ShieldAlert, text: "Host-level accountability" },
      { icon: Award, text: "Facilitator tools and insights" },
    ];
  } else if (isAdmin) {
    heading = "Admin Console.";
    goldHeading = "Platform Control.";
    tagline = "Authorized personnel access only. Secure systems configuration, compliance logs, and role management.";
    mobileLabel = "Admin Console";
    badges = [
      { icon: ShieldCheck, text: "Secure log auditing" },
      { icon: ShieldAlert, text: "Strict role compliance" },
      { icon: Lock, text: "Platform state control" },
    ];
  }

  return (
    <>
      {/* Mobile / Tablet Header Banner */}
      <header className="lg:hidden w-full bg-primary text-primary-foreground p-6 flex flex-col items-center text-center gap-2 relative overflow-hidden border-b border-border/10">
        {/* CSS Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-accent/10 blur-[50px] motion-safe:animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-accent/5 blur-[60px] motion-safe:animate-pulse [animation-delay:2s]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-2">
          <Link href="/" aria-label="H.I.P.S. Foundation — Return to homepage">
            <Image
              src="/hipslogo.png"
              alt="H.I.P.S. Logo"
              width={120}
              height={40}
              style={{ height: 'auto' }}
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
          <h1 className="text-xs font-semibold tracking-wider uppercase text-accent font-ui">
            {mobileLabel}
          </h1>
        </div>
      </header>

      {/* Desktop Column */}
      <aside className="hidden lg:flex flex-col justify-between p-16 bg-primary text-primary-foreground min-h-screen relative overflow-hidden">
        {/* CSS Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-[100px] motion-safe:animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-[120px] motion-safe:animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative z-10 flex flex-col gap-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="H.I.P.S. Foundation — Return to homepage">
              <Image
                src="/hipslogo.png"
                alt="H.I.P.S. Logo"
                width={200}
                height={60}
                style={{ height: 'auto' }}
                className="object-contain brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-4 max-w-lg mt-8">
            <h2 className="text-4xl font-extrabold tracking-tight font-heading leading-tight">
              {heading}{" "}
              <span className="text-accent block mt-1">{goldHeading}</span>
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-md font-body">
              {tagline}
            </p>
          </div>
        </div>

        {/* Badges and Footer */}
        <div className="relative z-10 space-y-12">
          <ul role="list" className="space-y-6">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <li key={idx} className="flex items-center gap-4 text-sm font-medium tracking-wide text-white">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent border border-accent/20 shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span>{badge.text}</span>
                </li>
              );
            })}
          </ul>

          <div className="pt-8 border-t border-border/10 space-y-3">
            <p className="text-xs text-accent font-ui tracking-widest uppercase font-bold">
              Secured by Hard Anonymity Protocol
            </p>
            <div className="text-xs text-zinc-300 font-body space-y-1">
              <p className="font-semibold">H.I.P.S. Foundation is a registered 501(c)(3) nonprofit organization.</p>
              <p>EIN: 12-3456789 | Support: (800) 555-0199 | contact@hipsfoundation.org</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
