import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'

/** Single-page site. The sitemap line appears only once the canonical URL is verified (P0). */
export default function robots(): MetadataRoute.Robots {
  const rules = [{ userAgent: '*', allow: '/' }]
  if (site.siteUrl) {
    return { rules, sitemap: `${site.siteUrl}/sitemap.xml` }
  }
  return { rules }
}