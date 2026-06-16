import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Lock,
  EyeOff,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  Clock,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
} from "lucide-react";

import {
  SERVICES_CATALOG,
  SERVICES_FAQ,
  TRUST_SIGNALS,
  EMERGENCY_CONTACTS,
  DEFAULT_EMERGENCY,
  type Service,
} from "@/lib/services-data";
import { getUserCountry } from "@/lib/geo";
import { PricingSwitcher } from "@/components/polish/PricingSwitcher";
import { MobileBookingBar } from "@/components/polish/MobileBookingBar";
import { Button } from "@/components/ui/button";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

const HOW_IT_WORKS = [
  {
    icon: Lock,
    title: "Anonymous Entry",
    desc: "Join using your unique session token. Your real identity remains decoupled from your presence.",
  },
  {
    icon: EyeOff,
    title: "Avatar Native",
    desc: "Represent yourself with a curated 3D abstract avatar. No cameras, no prejudice, no exposure.",
  },
  {
    icon: MessageSquare,
    title: "Support Focus",
    desc: "Engage in meaningful, voice-based support led by experts who focus on your story, not your appearance.",
  },
];

const TRUST_ICONS: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  lock: Lock,
  clock: Clock,
  heart: HeartHandshake,
  card: CreditCard,
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };

  const title = `${service.title} | HSSS Sanctuary`;
  const description = `${service.description} ${service.duration} session starting at ${service.priceDisplay}.`;
  const url = `${SITE_URL}/services/${service.slug}`;

  return {
    title,
    description,
    keywords: [
      "anonymous peer support",
      `${service.category} session`,
      "online support",
      "camera-free support alternative",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "HSSS Sanctuary",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/og/services/${service.slug}`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og/services/${service.slug}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return SERVICES_CATALOG.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const country = await getUserCountry();
  const emergency =
    EMERGENCY_CONTACTS[country] ?? DEFAULT_EMERGENCY;

  const relatedServices = SERVICES_CATALOG
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <ServiceJsonLd service={service} />
      <FAQJsonLd faqs={SERVICES_FAQ} />
      <BreadcrumbJsonLd
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title, href: `/services/${service.slug}` },
        ]}
      />

      <main id="main" tabIndex={-1}
        className="min-h-screen bg-background text-text-primary pb-32 overflow-x-hidden"
      >
        {/* Hero Section */}
        <header className="relative pt-24 pb-20 border-b border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <Link
              href="/services"
              data-analytics="cta-back-to-catalog"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-muted hover:text-text-primary mb-10 transition-colors p-3 -ml-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[44px]"
            >
              <ArrowLeft
                className="w-3 h-3 group-hover:-translate-x-1 transition-transform"
                aria-hidden="true"
              />
              Back to Catalog
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <service.icon
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-brand text-text-muted">
                    {service.category}
                  </span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight mb-6">
                  {service.title}
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex gap-3 md:mb-2">
                <div className="px-5 py-2 rounded-2xl bg-surface border border-border text-xs font-bold uppercase tracking-wide text-text-secondary inline-flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {service.duration}
                </div>
                <div className="px-5 py-2 rounded-2xl bg-success/10 border border-success/20 text-xs font-bold uppercase tracking-wide text-success inline-flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-success motion-safe:animate-pulse"
                    aria-hidden="true"
                  />
                  Available Now
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-6 max-w-6xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            {/* Main Content */}
            <div className="lg:col-span-7 space-y-20">
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary mb-8">
                  About this session
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                  {service.longDescription}
                </p>

                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-primary"
                    aria-hidden="true"
                  />
                  Commitment to Anonymity
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-text-secondary text-sm p-4 rounded-2xl bg-surface border border-border"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How it Works Timeline */}
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary mb-12">
                  How it works
                </h2>
                <ol className="space-y-12 relative list-none p-0">
                  <div
                    className="absolute left-[27px] top-4 bottom-4 w-px bg-border"
                    aria-hidden="true"
                  />
                  {HOW_IT_WORKS.map((step) => (
                    <li
                      key={step.title}
                      className="flex gap-8 relative group"
                    >
                      <div className="h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center shrink-0 z-10 transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                        <step.icon
                          className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="pt-2">
                        <h3 className="text-lg font-bold text-text-primary mb-2">
                          {step.title}
                        </h3>
                        <p className="text-text-muted text-sm leading-relaxed max-w-md">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary mb-8 flex items-center gap-3">
                  <HelpCircle
                    className="w-7 h-7 text-primary"
                    aria-hidden="true"
                  />
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {SERVICES_FAQ.map((faq, i) => (
                    <details
                      key={faq.question}
                      className="group rounded-2xl bg-surface border border-border overflow-hidden"
                      {...(i === 0 ? { open: true } : {})}
                    >
                      <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <h3 className="text-base font-bold text-text-primary">
                          {faq.question}
                        </h3>
                        <ChevronDown
                          className="w-5 h-5 text-text-muted shrink-0 transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Crisis Warning */}
              <aside
                role="note"
                aria-label="Important medical disclaimer"
                className="p-8 rounded-3xl bg-warning/10 border border-warning/30 flex gap-6"
              >
                <ShieldAlert
                  className="w-8 h-8 text-warning shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div className="space-y-3">
                  <h3 className="font-bold text-text-primary">
                    Important Disclaimer
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    HSSS provides peer support, coaching, and support
                    navigation. It is not emergency care. We do not provide
                    psychiatric evaluation or medical advice. If you are
                    experiencing a medical emergency or active crisis, please
                    call{" "}
                    <a
                      href={`tel:${emergency.phone.replace(/\s+/g, "")}`}
                      className="text-warning font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2 rounded"
                      aria-label={`Call ${emergency.label}`}
                    >
                      {emergency.phone}
                    </a>{" "}
                    ({emergency.label}) or your local emergency services.
                  </p>
                  <Link
                    href="/crisis"
                    className="inline-block text-xs font-bold uppercase tracking-wide text-text-muted hover:text-text-primary underline underline-offset-4"
                    data-analytics="cta-crisis-resources"
                  >
                    Wrong region? See all crisis resources →
                  </Link>
                </div>
              </aside>
            </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32 space-y-8">
                <PricingSwitcher
                  priceDisplay={service.priceDisplay}
                  serviceTitle={service.title}
                />

                <div className="p-6 rounded-2xl bg-surface border border-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide">
                      Questions?
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      Anonymous Support Chat
                    </span>
                  </div>
                  <Button asChild size="sm">
                    <Link
                      href="/contact"
                      data-analytics="cta-contact-service"
                    >
                      Contact Us
                    </Link>
                  </Button>
                </div>

                {/* Trust signals */}
                <ul className="space-y-3" aria-label="Trust and safety">
                  {TRUST_SIGNALS.map((signal) => {
                    const Icon = TRUST_ICONS[signal.icon] ?? ShieldCheck;
                    return (
                      <li
                        key={signal.label}
                        className="flex items-center gap-3 text-sm text-text-secondary"
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success"
                          aria-hidden="true"
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        {signal.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 ? (
          <section className="container mx-auto px-6 max-w-6xl py-20 border-t border-border">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">
              Related services
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0">
              {relatedServices.map((related: Service) => (
                <li key={related.slug}>
                  <Link
                    href={`/services/${related.slug}`}
                    data-analytics={`cta-related-${related.slug}`}
                    className="group block p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <related.icon
                          className="w-5 h-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-base font-bold text-text-primary font-heading">
                        {related.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                      {related.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-primary">
                        {related.priceDisplay}
                      </span>
                      <span className="text-text-muted">
                        {related.duration}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <MobileBookingBar
        priceDisplay={service.priceDisplay}
        serviceTitle={service.title}
        analyticsId={`cta-mobile-book-${service.slug}`}
      />
    </>
  );
}
