'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/motion'

let lenisInstance: Lenis | null = null

/** Access the shared Lenis instance (null when reduced motion or pre-hydration). */
export function getLenis(): Lenis | null {
  return lenisInstance
}

/**
 * Mounts once in the layout. Desktop-only smoothing — touch stays native.
 * With reduced motion, no Lenis at all: the site is fully usable without it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return null
}
