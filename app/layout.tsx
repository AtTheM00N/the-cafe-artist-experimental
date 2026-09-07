import type { Metadata, Viewport } from 'next'
import { Fraunces, Space_Grotesk, Space_Mono } from 'next/font/google'
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
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Cafe Artist — Sector 18, Noida',
  description:
    'A digital evening in five acts — low light, long tables, and a room that takes its time. The Cafe Artist, Sector 18, Noida.',
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
