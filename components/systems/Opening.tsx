'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { curtain } from '@/lib/content'

const KEY = 'tca-intro-v1'

function isFirstVisit(): boolean {
  try {
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    /* sandboxed storage — treat as first visit */
    return true
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
}

/**
 * OPENING CEREMONY — black → ember → hairline → glow → the room.
 *
 * An overlay over the same page (no separate route). It owns the hero's entrance
 * ([data-hero-*] targets in Curtain) so there is exactly one H1 and one reveal.
 *
 *  - First visit: full ceremony (~2s). Returning session: quick dissolve (~0.6s).
 *  - Any pointer/key/scroll input skips to the final state (fast-forward, not abrupt).
 *  - Reduced motion / JS off: renders nothing — the hero is simply there.
 */
export default function Opening() {
  const ref = useRef<HTMLDivElement>(null)
  const skipRef = useRef<() => void>(() => {})
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced || done) return
    const overlay = ref.current
    if (!overlay) return

    const veil = overlay.querySelector('[data-open-veil]')
    const meta = overlay.querySelector('[data-open-meta]')
    const ember = overlay.querySelector('[data-open-ember]')
    const hairline = overlay.querySelector('[data-open-hairline]')
    const glow = overlay.querySelector('[data-open-glow]')
    const skipBtn = overlay.querySelector('[data-open-skip]')
    const heroImage = document.querySelector('[data-hero-image]')
    const heroLines = Array.from(document.querySelectorAll('[data-hero-line]'))
    const heroTagline = document.querySelector('[data-hero-tagline]')
    const heroCta = document.querySelector('[data-hero-cta]')
    const heroMeta = Array.from(document.querySelectorAll('[data-hero-meta]'))

    /* GSAP crashes on null targets — every array is filtered before it reaches gsap.set. */
    const targets = [...heroMeta, heroCta, heroTagline].filter(
      (el): el is Element => el !== null,
    )

    const first = isFirstVisit()
    let finished = false
    let tl: gsap.core.Timeline | null = null

    const finish = () => {
      if (finished) return
      finished = true
      markSeen()
      gsap.set(overlay, { display: 'none' })
      setDone(true)
    }

    const skip = () => {
      if (finished) return
      if (tl) tl.kill()
      gsap.set([veil, ember, hairline, glow, meta].filter(Boolean), { autoAlpha: 0 })
      if (heroImage) gsap.set(heroImage, { scale: 1 })
      gsap.set(heroLines, { yPercent: 0 })
      if (heroTagline) gsap.set(heroTagline, { autoAlpha: 1, y: 0 })
      gsap.set(targets, { autoAlpha: 1 })
      finish()
    }
    skipRef.current = skip

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') skip()
    }
    const onPointer = () => skip()
    const onWheel = () => skip()

    if (first) {
      /* ——— FULL CEREMONY (~2s) ——— */
      tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      if (heroImage) tl.set(heroImage, { scale: 1.06 })
      tl.set(heroLines, { yPercent: 120 })
      if (heroTagline) tl.set(heroTagline, { autoAlpha: 0, y: 14 })
      tl.set(targets, { autoAlpha: 0 })

      // Beat 01 — a tiny metadata line in the dark.
      tl.fromTo(meta, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0.05)
      // Beat 02 + 03 — ember appears, hairline draws from it.
      tl.fromTo(ember, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0.25)
      tl.fromTo(hairline, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.25)
      // Beat 04 — the room warms; the image is already settling behind the veil.
      tl.fromTo(glow, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 1, scale: 1.25, duration: 0.85, ease: 'sine.inOut' }, 0.5)
      if (heroImage) tl.to(heroImage, { scale: 1, duration: 1.7, ease: 'power2.out' }, 0.3)
      // Beat 05 — the veil lifts; the title enters through its mask.
      tl.to(veil, { autoAlpha: 0, duration: 0.8, ease: 'sine.inOut' }, 0.75)
      tl.to(ember, { autoAlpha: 0, duration: 0.4 }, 1.05)
      tl.to(hairline, { autoAlpha: 0, duration: 0.4 }, 1.05)
      tl.to(glow, { autoAlpha: 0, duration: 0.5 }, 1.15)
      if (heroLines[0]) tl.to(heroLines[0], { yPercent: 0, duration: 0.7 }, 0.95)
      if (heroLines[1]) tl.to(heroLines[1], { yPercent: 0, duration: 0.7 }, 1.1)
      // Beat 06 — tagline, CTA and metadata settle in as the overlay dissolves.
      if (heroTagline) tl.to(heroTagline, { autoAlpha: 1, y: 0, duration: 0.55 }, 1.35)
      tl.to(targets, { autoAlpha: 1, duration: 0.5 }, 1.45)
      tl.to(skipBtn, { autoAlpha: 1, duration: 0.4 }, 0.6)
      tl.call(finish, undefined, 1.95)

      window.addEventListener('keydown', onKey)
      window.addEventListener('pointerdown', onPointer)
      window.addEventListener('wheel', onWheel, { passive: true })
    } else {
      /* ——— RETURNING SESSION — quick dissolve (~0.6s), no ceremony ——— */
      tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      if (heroImage) tl.set(heroImage, { scale: 1.03 })
      tl.set(heroLines, { yPercent: 120 })
      if (heroTagline) tl.set(heroTagline, { autoAlpha: 0, y: 14 })
      tl.set(targets, { autoAlpha: 0 })
      tl.to(veil, { autoAlpha: 0, duration: 0.4, ease: 'sine.inOut' }, 0)
      if (heroImage) tl.to(heroImage, { scale: 1, duration: 0.9 }, 0.1)
      if (heroLines[0]) tl.to(heroLines[0], { yPercent: 0, duration: 0.5 }, 0.15)
      if (heroLines[1]) tl.to(heroLines[1], { yPercent: 0, duration: 0.5 }, 0.3)
      tl.to(targets, { autoAlpha: 1, duration: 0.45 }, 0.45)
      tl.call(finish, undefined, 0.6)
    }

    return () => {
      if (tl) tl.kill()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('wheel', onWheel)
    }
  }, [reduced, done])

  if (reduced || done) return null

  return (
    <div ref={ref} className="opening fixed inset-0 z-50 pointer-events-none">
      <div aria-hidden data-open-veil className="opening-veil" />
      <span aria-hidden data-open-ember className="opening-ember" />
      <span aria-hidden data-open-hairline className="opening-hairline" />
      <span aria-hidden data-open-glow className="opening-glow" />
      <span aria-hidden data-open-meta className="meta opening-meta">
        {curtain.meta}
      </span>
      <button
        type="button"
        data-open-skip
        className="opening-skip"
        onClick={() => skipRef.current()}
      >
        Skip intro
      </button>
    </div>
  )
}