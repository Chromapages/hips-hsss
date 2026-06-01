import type { PackageTier } from "@/lib/services-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hips.foundation";

export function PackageJsonLd({ packages }: { packages: PackageTier[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: packages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: pkg.name,
        description: pkg.description,
        brand: { "@type": "Brand", name: "HSSS Sanctuary" },
        offers: {
          "@type": "Offer",
          price: pkg.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/checkout?package=${pkg.id}`,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
