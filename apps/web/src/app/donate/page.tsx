import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Gift, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";
import { Footer } from "@/components/polish/Footer";
import { Button } from "@/components/ui/button";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

export const metadata: Metadata = {
  title: "Support Our Mission | H.I.P.S. Foundation",
  description: "Your tax-deductible donation funds our scholarship program, enabling individuals in financial distress to access our secure, anonymous peer support services.",
  keywords: [
    "nonprofit donation",
    "donate to peer support",
    "mental health donation",
    "H.I.P.S. scholarship fund",
  ],
  alternates: { canonical: `${SITE_URL}/donate` },
  openGraph: {
    type: "website",
    title: "Support Our Mission | H.I.P.S. Foundation",
    description: "Your tax-deductible donation funds our scholarship program, enabling individuals in financial distress to access our secure, anonymous peer support services.",
    url: `${SITE_URL}/donate`,
    siteName: "H.I.P.S. Foundation",
  },
};

const IMPACTS = [
  {
    title: "Scholarship Funding",
    description: "Provide financial aid for sessions, materials, and resources to deserving individuals in financial distress.",
    icon: Gift,
  },
  {
    title: "Academic Mentorship",
    description: "Support tailored guidance, career counseling, and academic workshops to empower growth.",
    icon: Award,
  },
  {
    title: "Community Outreach",
    description: "Expand programs to empower students and foster growth in underserved communities.",
    icon: Heart,
  },
] as const;

export default function DonateLandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-text-primary selection:bg-[#173B57]/30 overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="relative bg-white pt-24 pb-20 border-b border-border"
          aria-labelledby="hero-title"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-brand text-[#C59A35] font-ui mb-6">
                  Giving Hope
                </span>
                <h1
                  id="hero-title"
                  className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#173B57] mb-6 leading-tight"
                >
                  Your Support <br />Funds Futures
                </h1>
                <p className="text-lg text-text-secondary mb-8 leading-relaxed font-body">
                  H.I.P.S. Foundation scholarships empower peers to overcome adversity, manage workplace burnout, and achieve mental wellness. Every donation creates a path forward.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="h-12 px-8 rounded-full bg-[#173B57] text-white hover:bg-[#C59A35] transition-all font-bold text-sm uppercase tracking-wide"
                  >
                    <Link href="/dashboard/donate">Donate Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm uppercase tracking-wide"
                  >
                    <a href="#impact">See Your Impact</a>
                  </Button>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-border bg-[#F6F8FA] p-8 md:p-10">
                <h3 className="font-heading text-2xl font-bold text-[#173B57] mb-4">Make a Lasting Impact</h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed mb-6">
                  Select a tier or enter a custom amount to provide anonymous support and scholarship access.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Link
                    href="/dashboard/donate"
                    className="h-12 flex items-center justify-center text-sm border border-border rounded-xl font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    $25 Supporter
                  </Link>
                  <Link
                    href="/dashboard/donate"
                    className="h-12 flex items-center justify-center text-sm border border-border rounded-xl font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    $50 Builder
                  </Link>
                  <Link
                    href="/dashboard/donate"
                    className="h-12 flex items-center justify-center text-sm border border-primary bg-primary/10 rounded-xl font-bold text-primary transition-all"
                  >
                    $100 Sustainer
                  </Link>
                  <Link
                    href="/dashboard/donate"
                    className="h-12 flex items-center justify-center text-sm border border-border rounded-xl font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    $500 Catalyst
                  </Link>
                </div>
                <Button
                  asChild
                  className="w-full h-12 bg-[#173B57] text-white hover:bg-[#C59A35] transition-all font-bold text-sm uppercase tracking-wide"
                >
                  <Link href="/dashboard/donate">Donate Now</Link>
                </Button>
                <p className="text-[11px] text-center text-text-muted mt-4 font-body">
                  100% of your tax-deductible donation directly funds H.I.P.S. scholarships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section
          id="impact"
          className="py-20 bg-white"
          aria-labelledby="impact-title"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wide text-[#C59A35] brand-caps">
                How Your Donations Change Lives
              </span>
              <h2
                id="impact-title"
                className="mt-3 font-heading text-3xl md:text-4xl font-bold text-[#173B57]"
              >
                Where Your Giving Goes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {IMPACTS.map((item) => (
                <article
                  key={item.title}
                  className="relative flex flex-col rounded-3xl border border-border bg-[#F6F8FA] p-8 shadow-soft"
                >
                  <div className="rounded-xl bg-[#173B57]/10 p-3 w-fit mb-6">
                    <item.icon
                      className="h-6 w-6 text-[#173B57]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#173B57] font-heading mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Tier Details & Testimonial */}
        <section className="py-20 bg-[#F6F8FA] border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-8 text-primary">Your Direct Impact</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-heading font-semibold text-primary mb-2">$50 Funds One Session</h4>
                    <p className="text-text-secondary text-sm font-body leading-relaxed">
                      Provides a full 45-minute peer support session for someone who otherwise couldn&apos;t afford it.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-accent mb-2">$200 Funds a Full Program</h4>
                    <p className="text-text-secondary text-sm font-body leading-relaxed">
                      Covers a 4-week workshop series for a participant dealing with severe workplace burnout or mental stress.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-[#C59A35] pl-6 py-4 italic text-text-secondary font-body text-lg leading-relaxed">
                &quot;H.I.P.S. allowed me to get help without risking my security clearance. The scholarship made it possible when I was between jobs. Thank you.&quot;
                <span className="block mt-4 text-xs font-bold uppercase tracking-wider text-text-muted font-ui not-italic">
                  — Scholarship Recipient
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section
          className="py-20 bg-[#173B57] text-white text-center border-t border-border relative overflow-hidden"
          aria-labelledby="cta-title"
        >
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C59A35] via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <ShieldCheck
              className="mx-auto h-12 w-12 text-[#C59A35] mb-6"
              aria-hidden="true"
            />
            <h2
              id="cta-title"
              className="font-heading text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Make a Lasting Impact?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 font-body text-base leading-relaxed">
              Your contribution enables peers to secure wellness sessions anonymously. IRS-compliant tax-deductible receipt provided.
            </p>
            <Button
              asChild
              className="h-12 px-8 rounded-full bg-[#C59A35] text-white hover:bg-[#A67F28] transition-all font-bold text-sm uppercase tracking-wide"
            >
              <Link href="/dashboard/donate">
                Donate Now
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
