import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'

/**
 * Single-page site — one URL. Stays empty (no sitemap served) until the
 * canonical production URL is verified; see `site.siteUrl` in lib/content.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.siteUrl) return []
  return [{ url: site.siteUrl, changeFrequency: 'monthly', priority: 1 }]
}