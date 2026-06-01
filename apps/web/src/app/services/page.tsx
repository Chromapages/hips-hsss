import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { PACKAGE_TIERS, INCLUDED_FEATURES, type PackageTier } from "@/lib/services-data";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageJsonLd } from "@/components/seo/PackageJsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

export const metadata: Metadata = {
  title: "Sanctuary Access | HSSS Services",
  description:
    "Secure your sessions in the Virtual Sanctuary. All packages include our proprietary Hard Anonymity Protocol and real-time voice masking. Single, Essential, and Sanctuary packs available.",
  keywords: [
    "anonymous peer support",
    "online sanctuary",
    "voice masking",
    "package pricing",
    "peer support packages",
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: "website",
    title: "Sanctuary Access | HSSS Services",
    description:
      "Secure your sessions in the Virtual Sanctuary. All packages include our proprietary Hard Anonymity Protocol and real-time voice masking.",
    url: `${SITE_URL}/services`,
    siteName: "HSSS Sanctuary",
    images: [
      {
        url: `${SITE_URL}/og/services`,
        width: 1200,
        height: 630,
        alt: "HSSS Sanctuary Access",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanctuary Access | HSSS Services",
    description:
      "Secure your sessions in the Virtual Sanctuary. All packages include our proprietary Hard Anonymity Protocol and real-time voice masking.",
    images: [`${SITE_URL}/og/services`],
  },
};

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <PackageJsonLd packages={PACKAGE_TIERS} />
      <div
        id="main-content"
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
      >
        <header className="max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            Sanctuary <span className="text-accent">Access</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary font-body">
            Secure your sessions in the Virtual Sanctuary. All packages include
            our proprietary Hard Anonymity Protocol and real-time voice
            masking.
          </p>
        </header>

        {/* Pricing Grid */}
        <ul
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 list-none p-0"
          aria-label="Available session packages"
        >
          {PACKAGE_TIERS.map((pkg: PackageTier) => (
            <li
              key={pkg.id}
              className={`relative flex flex-col rounded-3xl p-8 ring-1 ring-border transition-all hover:ring-primary/50 ${
                pkg.popular ? "bg-background ring-primary shadow-card" : "bg-surface"
              }`}
            >
              {pkg.popular ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-pill bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground brand-caps">
                  Most Popular
                </div>
              ) : null}

              <div className="flex items-center gap-x-4">
                <div className={`rounded-xl bg-gradient-to-br ${pkg.color} p-3`}>
                  <pkg.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-lg font-bold text-text-primary font-heading">
                  {pkg.name}
                </h2>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary font-body">
                {pkg.description}
              </p>

              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-text-primary font-heading">
                  ${pkg.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-text-muted font-body">
                  USD
                </span>
              </p>

              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-text-secondary font-body"
              >
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircle2
                      className="h-6 w-5 flex-none text-accent"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="mt-8 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide hover:bg-primary-dark motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-analytics={`cta-package-${pkg.id.toLowerCase()}`}
              >
                <Link href={`/checkout?package=${pkg.id}`}>
                  {pkg.id === "SINGLE"
                    ? "Book Single Session"
                    : `Buy ${pkg.name}`}
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        {/* Feature Blocks */}
        <section className="mt-32 border-t border-border pt-16">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Included with every session
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
            {INCLUDED_FEATURES.map((feature) => (
              <li key={feature.title} className="group relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 motion-safe:group-hover:bg-primary/20 motion-safe:transition-colors">
                  <feature.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-text-primary font-heading">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary font-body">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Footer */}
        <section className="mt-32 border-t border-border pt-16 text-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Not sure which package is right for you?
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Talk to a peer about your situation anonymously. No commitment,
            no pressure.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact" data-analytics="cta-talk-to-peer">
                Talk to a peer
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/scholarship" data-analytics="cta-apply-scholarship">
                Apply for scholarship
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
