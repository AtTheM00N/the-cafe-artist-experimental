'use client'

import { useEffect, useRef } from 'react'
import { curtain } from '@/lib/content'
import { createActMotion, gsap } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Meta } from '@/components/primitives/Meta'
import { Display } from '@/components/primitives/Display'

/**
 * ACT 00 — CURTAIN. The room dims up; the name is the room.
 * Primary motion: dim-up from black. Secondary: hairline draw.
 */
export default function Curtain() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = createActMotion(ref.current)

    // The dim-up: the site's opening breath.
    if (ref.current) {
      const overlay = ref.current.querySelector('[data-dimup]')
      if (overlay) {
        gsap.set(overlay, { opacity: 1 })
        gsap.to(overlay, { opacity: 0, duration: 1.8, ease: 'power2.out', delay: 0.15 })
      }
    }

    return () => ctx?.revert()
  }, [reduced])

  return (
    <section
      ref={ref}
      id="act-00"
      data-act="00"
      aria-label="Act 00 — Curtain"
      className="relative flex min-h-svh flex-col px-[var(--page)] pb-8 pt-24"
    >
      <div aria-hidden data-dimup className="pointer-events-none absolute inset-0 z-20 bg-[#0a0705]" />

      <Meta bright data-motion="fade">
        {curtain.meta}
      </Meta>

      <div className="flex flex-1 items-center">
        <Display as="h1" id="main-title" lines={curtain.lines} className="display-hero" />
      </div>

      <div className="relative">
        <div aria-hidden data-motion="rule" className="h-px w-full origin-left bg-rule" />
        <div className="flex items-end justify-between gap-6 pt-5">
          <Meta data-motion="fade" data-motion-delay="0.2">
            {curtain.kicker}
          </Meta>
          <div className="flex flex-col items-center gap-3" data-motion="fade" data-motion-delay="0.35">
            <Meta>{curtain.cue}</Meta>
            <div aria-hidden className="scroll-cue" />
          </div>
        </div>
      </div>
    </section>
  )
}
