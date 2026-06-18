import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hips.foundation'
  const routes = [
    '',
    '/services',
    '/opportunities',
    '/about',
    '/donate',
    '/crisis',
    '/contact',
    '/privacy',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
