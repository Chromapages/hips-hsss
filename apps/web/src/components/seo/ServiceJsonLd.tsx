import type { Service } from "@/lib/services-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

export function ServiceJsonLd({ service }: { service: Service }) {
  const url = `${SITE_URL}/services/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url,
    provider: {
      "@type": "Organization",
      name: "H.I.P.S. Foundation",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${url}#book`,
    },
    category: service.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
