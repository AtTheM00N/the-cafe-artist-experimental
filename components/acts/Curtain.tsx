'use client'

import { useEffect, useRef } from 'react'
import { curtain } from '@/lib/content'
import { gsap } from '@/lib/motion'
import { getLenis } from '@/components/systems/SmoothScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'
import type { PhotoMap } from '@/lib/photos'

/**
 * ACT 00 — CURTAIN / HERO.
 *
 * One environment — the actual room, full bleed. No floating fragments.
 * The interaction is ENTER THE ROOM: pointer movement gives the photograph a
 * whisper of camera depth (desktop, fine pointer only) while the ambient
 * light follows like the cafe's own lighting waking up. The CTA triggers a
 * restrained ~0.8s push — the room breathes forward, the type yields, the
 * page glides to the Room act. On touch, the same journey is simply the
 * first intentional scroll. Entrance choreography is owned by Opening.tsx
 * ([data-hero-*]); depth lives on the inner [data-hero-depth] wrapper so the
 * two never write to the same transform.
 */
export default function Curtain({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  /* ENTER THE ROOM — ambient light + camera depth, then the activation push.
     Desktop (fine pointer) only; reduced motion gets a static, excellent hero. */
  useEffect(() => {
    if (reduced) return
    const section = ref.current
    if (!section) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const glow = section.querySelector<HTMLElement>('[data-hero-glow]')
    const image = section.querySelector<HTMLElement>('[data-hero-image]')
    const depth = section.querySelector<HTMLElement>('[data-hero-depth]')
    const title = section.querySelector<HTMLElement>('[data-hero-title]')
    const tagline = section.querySelector<HTMLElement>('[data-hero-tagline]')

    let tx = 50
    let ty = 30
    let cx = 50
    let cy = 30
    let px = 0 // pointer offset in -0.5..0.5, for camera depth
    let py = 0
    let qx = 0
    let qy = 0
    let lit = false
    let entered = false
    const born = performance.now()
    let enterTl: gsap.core.Timeline | null = null

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 100
      ty = ((e.clientY - r.top) / r.height) * 100
      px = (e.clientX - r.left) / r.width - 0.5
      py = (e.clientY - r.top) / r.height - 0.5
      if (!lit) {
        lit = true
        gsap.to(glow, { opacity: 1, duration: 1.6, ease: 'sine.out' })
      }
    }
    const onLeave = () => {
      lit = false
      tx = 50
      ty = 30
      px = 0
      py = 0
      gsap.to(glow, { opacity: 0.15, duration: 1.2, ease: 'sine.out' })
    }

    /* One ticker eases light and depth; no per-event style writes. Type depth
       waits out the intro so it never competes with the entrance. */
    const tick = () => {
      cx += (tx - cx) * 0.075
      cy += (ty - cy) * 0.075
      qx += (px - qx) * 0.06
      qy += (py - qy) * 0.06
      if (glow) {
        glow.style.setProperty('--gx', `${cx}%`)
        glow.style.setProperty('--gy', `${cy}%`)
      }
      if (depth && !entered) {
        depth.style.transform = `scale(1.05) translate3d(${(qx * -0.7).toFixed(3)}%, ${(qy * -0.5).toFixed(3)}%, 0)`
      }
      if (performance.now() - born < 2400 || entered) return
      if (title) {
        title.style.transform = `translate3d(${(qx * 0.35).toFixed(3)}rem, ${(qy * 0.25).toFixed(3)}rem, 0)`
      }
      if (tagline) {
        tagline.style.transform = `translate3d(${(qx * 0.22).toFixed(3)}rem, ${(qy * 0.15).toFixed(3)}rem, 0)`
      }
    }

    /* THE ACTIVATION — a short cinematic push into the room, ~0.8s.
       Returns false when the moment has passed (scrolled away); the CTA
       then behaves as a normal anchor. */
    const enter = () => {
      if (entered) return true
      if (!getLenis() || section.getBoundingClientRect().top < -window.innerHeight * 0.5) {
        return false
      }
      entered = true
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      if (glow) gsap.to(glow, { opacity: 0.55, duration: 0.8 })
      enterTl = gsap
        .timeline({
          defaults: { ease: 'power2.inOut' },
          onComplete: () => {
            entered = false
            section.addEventListener('pointermove', onMove)
            section.addEventListener('pointerleave', onLeave)
          },
        })
        .to(image, { scale: 1.14, duration: 0.8 }, 0)
        .to(title, { scale: 0.965, y: 10, autoAlpha: 0.55, duration: 0.8 }, 0)
        .to(tagline, { autoAlpha: 0.25, duration: 0.6 }, 0)
        .to(tagline, { autoAlpha: 1, duration: 0.5 }, 0.65)
        .to([image, title], { clearProps: 'transform,opacity,visibility' }, 0.85)
      return true
    }

    const onCta = (e: Event) => {
      if (!enter()) return
      e.preventDefault()
      const target = document.querySelector('#act-01')
      if (target) getLenis()?.scrollTo(target as HTMLElement, { duration: 1.15 })
    }

    const cta = section.querySelector<HTMLElement>('[data-hero-cta] a')

    gsap.ticker.add(tick)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    cta?.addEventListener('click', onCta as EventListener)
    return () => {
      gsap.ticker.remove(tick)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      cta?.removeEventListener('click', onCta as EventListener)
      enterTl?.kill()
      gsap.killTweensOf([glow, image, title, tagline])
      if (depth) depth.style.transform = ''
      if (title) title.style.transform = ''
      if (tagline) tagline.style.transform = ''
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
      {/* THE ANCHOR — the room itself, full bleed, environment not backdrop.
          Outer layer is the intro/activation camera; inner layer carries depth. */}
      <div data-hero-image className="absolute inset-0 overflow-hidden">
        <div data-hero-depth className="absolute inset-0 will-change-transform">
          <PhotoSlot
            id="hero"
            src={photos.hero}
            aspect="aspect-auto"
            className="h-full w-full"
            motion={false}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Readability scrim — keeps the atmosphere, earns the text */}
      <div aria-hidden data-hero-scrim className="hero-scrim pointer-events-none absolute inset-0 z-10" />

      {/* Ambient warm light — pointer-following; CSS hides it on touch / reduced motion */}
      <div aria-hidden data-hero-glow className="hero-glow pointer-events-none absolute inset-0 z-10" />

      <div className="relative z-30 flex flex-1 flex-col px-[var(--page)] pt-24">
        <div className="flex items-baseline justify-between gap-8">
          <Meta data-hero-meta>{curtain.meta}</Meta>
          <Meta data-hero-meta className="text-right">{curtain.kicker}</Meta>
        </div>

        <div className="flex-1" />

        <h1 id="main-title" data-hero-title className="display display-hero">
          <span className="display-line">
            <span data-hero-line>{curtain.lines[0]}</span>
          </span>
          <span className="display-line neon-accent-line">
            <span data-hero-line>{curtain.lines[1]}</span>
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6">
          <p data-hero-tagline className="tagline-hero">
            {curtain.tagline}
          </p>
          <div data-hero-cta>
            <Cta href={curtain.ctaTarget} arrow cursorLabel="ENTER">
              {curtain.cta}
            </Cta>
          </div>
        </div>
      </div>

      <div className="relative z-30 px-[var(--page)] pb-10">
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