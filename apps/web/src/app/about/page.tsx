import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  Heart, 
  Users, 
  Award, 
  ArrowRight, 
  FileText, 
  Globe 
} from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Mission & Story | H.I.P.S. Foundation",
  description: "Learn about the H.I.P.S. Foundation Sanctuary. Discover our story, core values, non-profit transparency, and commitment to secure, anonymous peer support.",
  keywords: [
    "nonprofit mental health",
    "peer support organization",
    "anonymous mental wellness",
    "support for regulated industries",
    "burnout prevention program",
    "H.I.P.S. story"
  ],
};

const pillars = [
  {
    title: "Anonymity First",
    description: "Traditional mental healthcare systems require extensive identity verification, creating barriers. We decouple identity entirely to create absolute peace of mind.",
    icon: ShieldCheck,
  },
  {
    title: "Lived Experience",
    description: "Our matching pool consists of vetted peers who understand the unique pressures of stressful, high-impact careers and personal crises first-hand.",
    icon: Users,
  },
  {
    title: "Radical Accessibility",
    description: "Financial distress should never block access to a listening ear. Our scholarship programs ensure that cost is never a barrier.",
    icon: Heart,
  },
  {
    title: "Vetted Professionalism",
    description: "All facilitators complete rigorous ethics training, background checks, and active listening audits to maintain strict boundary compliance.",
    icon: Award,
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-primary selection:bg-primary/30 overflow-x-hidden">
        
        {/* Hero Section */}
        <section 
          className="relative bg-surface pt-24 pb-20 border-b border-border"
          aria-labelledby="hero-title"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-6">
                Who We Are
              </span>
              <h1 
                id="hero-title" 
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text mb-6 leading-tight"
              >
                Safe Spaces Built <br />on Shared Experience
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed font-body">
                The H.I.P.S. Foundation is a 501(c)(3) non-profit organization dedicated to providing secure, completely anonymous peer-to-peer coaching and mental wellness support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  className="h-12 px-8 rounded-full bg-primary text-white hover:bg-accent transition-all font-bold text-sm uppercase tracking-wide"
                >
                  <Link href="/services">
                    Get Support
                    <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="h-12 px-8 rounded-full border-primary text-text hover:bg-bg-subtle transition-all font-bold text-sm uppercase tracking-wide"
                >
                  <Link href="/donate">Support Our Mission</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story / Motivation */}
        <section className="py-24 bg-surface border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-3 block">
                  The Problem We Solve
                </span>
                <h2 className="font-heading text-3xl font-bold text-text mb-6 leading-tight">
                  Overcoming the Silence of High-Stakes Careers
                </h2>
                <div className="space-y-6 text-text-secondary font-body leading-relaxed text-base">
                  <p>
                    For professionals working in highly regulated fields—such as healthcare, software engineering, defense, public education, and emergency services—seeking mental health support comes with real-world risks. Fear of career stagnation, security clearance reviews, or professional licensing consequences often forces people to suffer in silence.
                  </p>
                  <p>
                    We created H.I.P.S. (Healing Interaction Peer Support) Sanctuary as a direct response to this dilemma. By utilizing a zero-knowledge approach to user profiles and combining it with a network of certified peer facilitators, we provide an outlet that requires zero trust and zero disclosure.
                  </p>
                </div>
              </div>
              
              <div className="bg-bg-subtle p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                <h3 className="font-heading text-2xl font-bold text-text mb-6">Our Operating Mandates</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs mt-1">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text mb-1">Strict Anonymity Boundaries</h4>
                      <p className="text-text-secondary text-xs font-body leading-relaxed">No tracking, no history linking, and dynamic handle generation.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs mt-1">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text mb-1">Peer Empowerment Only</h4>
                      <p className="text-text-secondary text-xs font-body leading-relaxed">Focus on active listening and shared experiences rather than medical or diagnostic labels.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs mt-1">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-text mb-1">Financial Integrity</h4>
                      <p className="text-text-secondary text-xs font-body leading-relaxed">All public donations directly purchase session matching credits for scholarship recipients.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Pillars */}
        <section className="py-24 bg-bg-subtle border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-3 block">
                Foundational Principles
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-4">
                What Sets the H.I.P.S. Sanctuary Apart
              </h2>
              <p className="text-text-secondary font-body leading-relaxed">
                We believe that a safe environment is built through rigorous engineering and transparent mission alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, index) => {
                const PillarIcon = pillar.icon;
                return (
                  <div 
                    key={index} 
                    className="p-8 bg-surface border border-border rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-bg-subtle border border-border flex items-center justify-center text-accent flex-shrink-0">
                      <PillarIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-bold text-text">
                        {pillar.title}
                      </h3>
                      <p className="text-text-muted text-sm font-body leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Nonprofit Transparency Block */}
        <section className="py-24 bg-surface border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-primary text-white p-8 md:p-16 rounded-3xl border border-border shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-surface/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent font-ui">
                    Transparency & Governance
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
                    Registered 501(c)(3) Non-Profit Organization
                  </h2>
                  <p className="text-white/80 font-body text-base leading-relaxed max-w-2xl">
                    The H.I.P.S. Foundation operates as a transparent non-profit entity. Your donations are tax-deductible to the extent permitted by law, and our reports are publicly listed. We commit to dedicating at least 85% of all funds raised directly to peer support services and scholarship matching.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <span className="bg-surface/10 px-4 py-2 rounded-lg text-xs font-bold font-ui text-accent">
                      EIN: 88-1234567
                    </span>
                    <span className="bg-surface/10 px-4 py-2 rounded-lg text-xs font-bold font-ui text-accent">
                      GuideStar Gold Standard Alignment
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="p-6 bg-surface/5 rounded-2xl border border-white/10">
                    <h3 className="font-heading font-bold text-lg mb-2 text-accent">Financials</h3>
                    <p className="text-white/60 text-xs font-body mb-4">View our annual budgets, filing receipts, and distribution audits.</p>
                    <Link 
                      href="/compliance" 
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-white transition-colors font-ui"
                    >
                      <FileText className="w-4 h-4" />
                      View Postings
                    </Link>
                  </div>

                  <div className="p-6 bg-surface/5 rounded-2xl border border-white/10">
                    <h3 className="font-heading font-bold text-lg mb-2 text-accent">Partnerships</h3>
                    <p className="text-white/60 text-xs font-body mb-4">Learn about sponsoring H.I.P.S. scholarship cohorts for your industry group.</p>
                    <Link 
                      href="/opportunities" 
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:text-white transition-colors font-ui"
                    >
                      <Globe className="w-4 h-4" />
                      Partner Portal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section 
          className="py-20 bg-bg-subtle text-center border-t border-border relative overflow-hidden"
          aria-labelledby="about-cta-title"
        >
          <div className="max-w-3xl mx-auto px-6">
            <Heart 
              className="mx-auto h-12 w-12 text-accent mb-6" 
              aria-hidden="true"
            />
            <h2 
              id="about-cta-title" 
              className="font-heading text-3xl md:text-4xl font-bold mb-4 text-text"
            >
              Take the Next Step With Us
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8 font-body text-base leading-relaxed">
              Whether you need to talk to a peer who understands, or want to sponsor support for those in distress, we welcome you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="h-12 px-8 rounded-full bg-primary text-white hover:bg-accent transition-all font-bold text-sm uppercase tracking-wide"
              >
                <Link href="/services">
                  Request Support
                  <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="h-12 px-8 rounded-full border-primary text-text hover:bg-bg-subtle transition-all font-bold text-sm uppercase tracking-wide"
              >
                <Link href="/donate">Donate to Scholarship</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
