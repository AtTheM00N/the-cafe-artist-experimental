'use client'

import { useEffect, useRef } from 'react'
import { curtain } from '@/lib/content'
import { gsap } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'
import type { PhotoMap } from '@/lib/photos'

/**
 * ACT 00 — CURTAIN / HERO. The opening frame of the film: full-bleed room,
 * signage title, quiet tagline, one CTA. Entrance choreography is owned by
 * Opening.tsx ([data-hero-*]) so there is exactly one H1 and one reveal.
 */
export default function Curtain({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  /* Ambient warm light — follows the pointer like light in a room, not a spotlight. */
  useEffect(() => {
    if (reduced) return
    const section = ref.current
    if (!section) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const glow = section.querySelector<HTMLElement>('[data-hero-glow]')
    if (!glow) return

    let tx = 50
    let ty = 30
    let cx = 50
    let cy = 30
    let lit = false

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 100
      ty = ((e.clientY - r.top) / r.height) * 100
      if (!lit) {
        lit = true
        gsap.to(glow, { opacity: 1, duration: 1.6, ease: 'sine.out' })
      }
    }
    const onLeave = () => {
      lit = false
      gsap.to(glow, { opacity: 0.15, duration: 1.2, ease: 'sine.out' })
    }
    const tick = () => {
      cx += (tx - cx) * 0.075
      cy += (ty - cy) * 0.075
      glow.style.setProperty('--gx', `${cx}%`)
      glow.style.setProperty('--gy', `${cy}%`)
    }

    gsap.ticker.add(tick)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      gsap.ticker.remove(tick)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(glow)
    }
  }, [reduced])

  return (
    <section
      ref={ref}
      id="act-00"
      data-act="00"
      aria-label="Act 00 — Curtain"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* The room — full bleed, environment not backdrop */}
      <div data-hero-image className="absolute inset-0">
        <PhotoSlot
          id="hero"
          src={photos.hero}
          aspect="aspect-auto"
          className="absolute inset-0"
          motion={false}
          sizes="100vw"
        />
      </div>

      {/* Readability scrim — keeps the atmosphere, earns the text */}
      <div aria-hidden data-hero-scrim className="hero-scrim pointer-events-none absolute inset-0 z-10" />

      {/* Ambient warm light — pointer-following; CSS hides it on touch / reduced motion */}
      <div aria-hidden data-hero-glow className="hero-glow pointer-events-none absolute inset-0 z-10" />

      <div className="relative z-20 flex flex-col px-[var(--page)] pt-24">
        <div className="flex items-baseline justify-between gap-8">
          <Meta data-hero-meta>{curtain.meta}</Meta>
          <Meta data-hero-meta className="text-right">{curtain.kicker}</Meta>
        </div>

        <div className="flex-1" />

        <h1 id="main-title" className="display display-hero">
          <span className="display-line">
            <span data-hero-line>{curtain.lines[0]}</span>
          </span>
          <span className="display-line">
            <span data-hero-line>{curtain.lines[1]}</span>
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6">
          <p data-hero-tagline className="tagline-hero">
            {curtain.tagline}
          </p>
          <div data-hero-cta>
            <Cta href={curtain.ctaTarget} arrow cursorLabel="OPEN">
              {curtain.cta}
            </Cta>
          </div>
        </div>
      </div>

      <div className="relative z-20 px-[var(--page)] pb-10">
        <div aria-hidden className="h-px w-full origin-left bg-rule" />
        <div className="flex items-end justify-between gap-6 pt-5">
          <span aria-hidden />
          <div className="flex flex-col items-center gap-3" data-hero-meta>
            <Meta>{curtain.cue}</Meta>
            <div aria-hidden className="scroll-cue" />
          </div>
        </div>
      </div>
    </section>
  )
}