import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Users, Award, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";
import { Button } from "@/components/ui/button";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

export const metadata: Metadata = {
  title: "Partnerships & Opportunities | H.I.P.S. Foundation",
  description: "Collaborate with H.I.P.S. Foundation to bring secure, anonymous peer support and mental wellness programs to your organization or community.",
  keywords: [
    "nonprofit partnership",
    "corporate wellness programs",
    "anonymous peer support",
    "community mental health",
    "academic collaborations",
  ],
  alternates: { canonical: `${SITE_URL}/opportunities` },
  openGraph: {
    type: "website",
    title: "Partnerships & Opportunities | H.I.P.S. Foundation",
    description: "Collaborate with H.I.P.S. Foundation to bring secure, anonymous peer support and mental wellness programs to your organization or community.",
    url: `${SITE_URL}/opportunities`,
    siteName: "H.I.P.S. Foundation",
  },
};

const PROGRAMS = [
  {
    title: "Corporate Partnerships",
    description: "Provide your teams with confidential, identity-protected support systems that prioritize employee wellness and psychological safety.",
    icon: Building2,
    features: [
      "Custom support environments",
      "Confidential wellness channels",
      "Interactive stress workshops",
    ],
  },
  {
    title: "Community Alliances",
    description: "Extend secure shelter to vulnerable communities. We align with local support groups, shelters, and advocacy circles to host safe spaces.",
    icon: Users,
    features: [
      "Targeted outreach programs",
      "Co-facilitated safe spaces",
      "Support resource syndication",
    ],
  },
  {
    title: "Academic Collaborations",
    description: "Bring anonymous support networks and student programs to universities, research centers, and education initiatives.",
    icon: Award,
    features: [
      "Student support integration",
      "Anonymized research partnerships",
      "Scholarship opportunities",
    ],
  },
] as const;

const STEPS = [
  {
    number: "1",
    title: "Explore Opportunities",
    description: "Review CSR targets, alignment goals, and custom peer support options with our partnership team.",
  },
  {
    number: "2",
    title: "Engage & Plan",
    description: "Define separation boundaries, launch parameters, and choose integration components.",
  },
  {
    number: "3",
    title: "Make an Impact",
    description: "Deploy secure, voice-masked anonymous support groups and monitor aggregated safety metrics.",
  },
] as const;

export default function OpportunitiesPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-text-primary selection:bg-primary/30 overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="relative bg-primary text-white py-24 md:py-32"
          aria-labelledby="hero-title"
        >
          {/* Subtle design element */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-6">
              Partnerships
            </span>
            <h1
              id="hero-title"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8 leading-tight max-w-4xl mx-auto"
            >
              Collaborating for Impact, <br />Building Brighter Futures.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-body">
              Explore strategic partnerships with H.I.P.S. Foundation to drive social change, protect identity, and empower your community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-8 rounded-full bg-accent text-white hover:bg-accent transition-all font-bold text-sm uppercase tracking-wide"
              >
                <Link href="/organizations">Partner With Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-8 rounded-full border-2 border-white bg-transparent text-white hover:bg-surface hover:text-text transition-all font-bold text-sm uppercase tracking-wide"
              >
                <a href="#programs">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section
          id="programs"
          className="py-20 bg-surface"
          aria-labelledby="programs-title"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wide text-accent brand-caps">
                Our Programs
              </span>
              <h2
                id="programs-title"
                className="mt-3 font-heading text-3xl md:text-4xl font-bold text-text"
              >
                Partnership Pathways
              </h2>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto font-body text-base leading-relaxed">
                We design and support custom implementations across a wide variety of organizational settings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROGRAMS.map((program) => (
                <article
                  key={program.title}
                  className="relative flex flex-col rounded-3xl border border-border bg-bg-subtle p-8 shadow-soft transition-all hover:shadow-card"
                >
                  <div className="flex items-center gap-x-4 mb-6">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <program.icon
                        className="h-6 w-6 text-text"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-text font-heading">
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-sm text-text-secondary font-body leading-relaxed mb-6 flex-grow">
                    {program.description}
                  </p>

                  <ul
                    role="list"
                    className="space-y-3 text-sm text-text-secondary font-body border-t border-border/60 pt-6"
                  >
                    {program.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3 items-center">
                        <CheckCircle
                          className="h-5 w-4 flex-none text-accent"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="py-20 bg-bg-subtle border-t border-border"
          aria-labelledby="how-it-works-title"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wide text-accent brand-caps">
                Integration Process
              </span>
              <h2
                id="how-it-works-title"
                className="mt-3 font-heading text-3xl md:text-4xl font-bold text-text"
              >
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop layout */}
              <div
                className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold font-heading mb-6 shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-body max-w-[280px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section
          className="py-20 bg-primary text-white text-center border-t border-border relative overflow-hidden"
          aria-labelledby="cta-title"
        >
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <ShieldCheck
              className="mx-auto h-12 w-12 text-accent mb-6"
              aria-hidden="true"
            />
            <h2
              id="cta-title"
              className="font-heading text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Create Change Together?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 font-body text-base leading-relaxed">
              Complete our custom program inquiry. Rest assured, your inquiry is handled confidentially by our partnership operations group.
            </p>
            <Button
              asChild
              className="h-12 px-8 rounded-full bg-accent text-white hover:bg-accent transition-all font-bold text-sm uppercase tracking-wide"
            >
              <Link href="/organizations">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 inline-block" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
