'use client'

import { getLenis } from '@/components/systems/SmoothScroll'

/** Smooth-scroll to a CSS selector target via Lenis, with a graceful native fallback. */
export function scrollToTarget(selector: string) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(selector, {
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    })
    return
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
