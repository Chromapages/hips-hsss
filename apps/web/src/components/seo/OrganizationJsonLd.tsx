import React from 'react'

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hips.foundation'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'H.I.P.S. Foundation',
    url: siteUrl,
    logo: `${siteUrl}/hipslogo.png`,
    sameAs: [],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}
