import type { Metadata, Viewport } from 'next'
import { Fraunces, Space_Grotesk, Space_Mono } from 'next/font/google'
import { site } from '@/lib/content'
// @ts-ignore - Next.js resolves global CSS imports in the app router.
import './globals.css'
import SmoothScroll from '@/components/systems/SmoothScroll'
import Cursor from '@/components/systems/Cursor'
import Nav from '@/components/systems/Nav'
import ChapterRail from '@/components/systems/ChapterRail'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'], // 700 is unused site-wide — don't ship the second face
  variable: '--font-mono',
  display: 'swap',
})

const description =
  'A candlelit digital evening in five acts — low light, long tables, and a room that takes its time. The Cafe Artist, Sector 18, Noida.'

const social = {
  title: 'The Cafe Artist — Sector 18, Noida',
  description,
}

/**
 * No OG image on purpose: the hero photograph doesn't exist yet and a designed
 * placeholder would be a fake social image. Add `openGraph.images` once a real
 * photo is verified (P0 hero slot). `siteUrl` (P0) unlocks canonical + sitemap.
 */
export const metadata: Metadata = {
  title: social.title,
  description,
  applicationName: 'The Cafe Artist',
  category: 'food',
  alternates: site.siteUrl ? { canonical: site.siteUrl } : undefined,
  openGraph: {
    ...social,
    type: 'website',
    siteName: 'The Cafe Artist',
    locale: 'en_IN',
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
  },
  twitter: {
    card: 'summary',
    ...social,
  },
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#120e0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        <Nav />
        <ChapterRail />
        {children}
      </body>
    </html>
  )
}
