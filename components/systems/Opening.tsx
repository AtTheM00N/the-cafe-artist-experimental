'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site } from '@/lib/content'

const KEY = 'tca-intro-v2'

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

/* The cafe's real illuminated wall, redrawn as one contour. The stroke is
   split into two mirrored halves that BOTH start at the exact centre, so
   the draw is outward from the light origin — light spreading both ways. */
const WAVE_L = 'M300 60 C 230 28, 150 28, 60 84'
const WAVE_R = 'M300 60 C 370 92, 450 92, 540 36'
const WAVE_LEN = 320

/**
 * OPENING — "THE LIGHTS COME ON."
 *
 * One centred stage over the page (no separate route). It owns the hero's entrance
 * ([data-hero-*] targets in Curtain) so there is exactly one H1 and one reveal.
 *
 *  - First visit: full ceremony (~2.2s). Returning session: quick dissolve (~0.6s).
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

    const stage = overlay.querySelector('[data-open-stage]')
    const veil = overlay.querySelector('[data-open-veil]')
    const dot = overlay.querySelector('[data-open-dot]')
    const glow = overlay.querySelector('[data-open-glow]')
    const title = overlay.querySelector('[data-open-title]')
    const word = overlay.querySelector('[data-open-word]')
    const sub = overlay.querySelector('[data-open-sub]')
    const skipBtn = overlay.querySelector('[data-open-skip]')
    const heroImage = document.querySelector('[data-hero-image]')
    const heroLines = Array.from(document.querySelectorAll('[data-hero-line]'))
    const heroTagline = document.querySelector('[data-hero-tagline]')
    const heroCta = document.querySelector('[data-hero-cta]')
    const heroMeta = Array.from(document.querySelectorAll('[data-hero-meta]'))

    /* GSAP crashes on null targets — every array is filtered before it reaches gsap.set. */
    const heroTargets = [...heroMeta, heroCta, heroTagline].filter(
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
      gsap.set([stage, dot, glow, title, sub].filter(Boolean), { autoAlpha: 0 })
      gsap.set('[data-open-wave] path', { strokeDashoffset: 0 })
      if (heroImage) gsap.set(heroImage, { scale: 1, yPercent: 0 })
      gsap.set(heroLines, { yPercent: 0 })
      if (heroTagline) gsap.set(heroTagline, { autoAlpha: 1, y: 0 })
      gsap.set(heroTargets, { autoAlpha: 1 })
      finish()
    }
    skipRef.current = skip

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') skip()
    }
    const onPointer = () => skip()
    const onWheel = () => skip()

    if (first) {
      /* ——— FULL CEREMONY — the lights come on ——— */
      tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      /* QA affordance: /?slowintro stretches the ceremony for visual inspection. */
      const qa = new URLSearchParams(window.location.search)
      if (qa.has('slowintro')) tl.timeScale(0.2)
      if (heroImage) tl.set(heroImage, { scale: 1.08 })
      tl.set(heroLines, { yPercent: 120 })
      if (heroTagline) tl.set(heroTagline, { autoAlpha: 0, y: 14 })
      tl.set(heroTargets, { autoAlpha: 0 })

      // The stage is dark; nothing is visible yet.
      tl.set(dot, { autoAlpha: 0, scale: 0.4 })
      tl.set(glow, { autoAlpha: 0 })
      tl.set('[data-open-wave] path', {
        autoAlpha: 0,
        strokeDasharray: WAVE_LEN,
        strokeDashoffset: WAVE_LEN,
      })
      tl.set(title, { autoAlpha: 0, y: 18 })
      tl.set(word, { autoAlpha: 0 })
      tl.set(sub, { autoAlpha: 0, y: 10 })

      // Beat 02 — a point of light, dead centre.
      tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, 0.12)
      // Beat 03 — the room's light wakes around it.
      tl.to(glow, { autoAlpha: 1, duration: 0.9, ease: 'sine.inOut' }, 0.22)
      // Beat 04–06 — the illuminated line draws outward from centre, carrying colour.
      tl.to('[data-open-wave] path', { autoAlpha: 1, duration: 0.1 }, 0.5)
      tl.to('[data-open-wave] path', { strokeDashoffset: 0, duration: 1.05, ease: 'power2.inOut' }, 0.5)
      tl.fromTo('[data-open-wave] path', { stroke: '#e07abc' }, { stroke: '#d9713a', duration: 0.9, ease: 'sine.inOut' }, 0.55)
      // Beat 07 — the name, carrying the light in "Artist".
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.95)
      tl.to(word, { autoAlpha: 1, duration: 0.45, ease: 'sine.out' }, 1.15)
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.25)
      tl.to(skipBtn, { autoAlpha: 1, duration: 0.4 }, 0.6)

      // Beat 09 — the lights hand over to the hero; the room is the destination.
      if (heroImage) tl.to(heroImage, { scale: 1, duration: 1.9, ease: 'power2.out' }, 0.35)
      tl.to([dot, glow], { autoAlpha: 0, duration: 0.6, ease: 'sine.inOut' }, 1.55)
      /* Veil + stage fade TOGETHER — the ceremony dissolves into the room
         itself, never into black and never a hard cut. */
      tl.to([stage, veil], { autoAlpha: 0, duration: 0.7, ease: 'sine.inOut' }, 1.6)
      if (heroLines[0]) tl.to(heroLines[0], { yPercent: 0, duration: 0.7 }, 1.65)
      if (heroLines[1]) tl.to(heroLines[1], { yPercent: 0, duration: 0.7 }, 1.78)
      if (heroTagline) tl.to(heroTagline, { autoAlpha: 1, y: 0, duration: 0.55 }, 1.95)
      tl.to(heroTargets, { autoAlpha: 1, duration: 0.5 }, 2.0)
      tl.call(finish, undefined, 2.25)

      /* QA affordance: /?introfreeze=<s> holds the finished ceremony at a chosen
         beat (seek AFTER all tweens exist, so every mid-state is coherent).
         A frozen ceremony has no skip listeners — nothing may fast-forward it. */
      const freeze = qa.get('introfreeze')
      if (freeze) {
        tl.pause(Number(freeze))
        return () => {}
      }

      window.addEventListener('keydown', onKey)
      window.addEventListener('pointerdown', onPointer)
      window.addEventListener('wheel', onWheel, { passive: true })
    } else {
      /* ——— RETURNING SESSION — quick dissolve, no ceremony ——— */
      tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      if (heroImage) tl.set(heroImage, { scale: 1.03 })
      tl.set(heroLines, { yPercent: 120 })
      if (heroTagline) tl.set(heroTagline, { autoAlpha: 0, y: 14 })
      tl.set(heroTargets, { autoAlpha: 0 })
      tl.set(stage, { autoAlpha: 1 })
      tl.to([stage, veil], { autoAlpha: 0, duration: 0.4, ease: 'sine.inOut' }, 0)
      if (heroImage) tl.to(heroImage, { scale: 1, duration: 0.9 }, 0.1)
      if (heroLines[0]) tl.to(heroLines[0], { yPercent: 0, duration: 0.5 }, 0.15)
      if (heroLines[1]) tl.to(heroLines[1], { yPercent: 0, duration: 0.5 }, 0.3)
      tl.to(heroTargets, { autoAlpha: 1, duration: 0.45 }, 0.45)
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
      <div aria-hidden data-open-stage className="opening-stage">
        {/* Top row — empty by design; the grid keeps the centre dead centre. */}
        <div className="opening-stage-top" />

        {/* Centre row — the light, the line, the name. All optically centred. */}
        <div className="opening-stage-center">
          <div aria-hidden className="opening-core">
            <span data-open-dot className="opening-dot" />
            <span data-open-glow className="opening-glow" />
            <svg aria-hidden data-open-wave className="opening-wave" viewBox="0 0 600 120">
              <path d={WAVE_L} strokeWidth="2" />
              <path d={WAVE_R} strokeWidth="2" />
            </svg>
          </div>
          <h2 data-open-title className="opening-title">
            The Cafe <em data-open-word>Artist</em>
          </h2>
          <p data-open-sub className="opening-sub">
            {site.location.toUpperCase()}
          </p>
        </div>

        {/* Bottom row — the only way out is forward. */}
        <div className="opening-stage-bottom">
          <button
            type="button"
            data-open-skip
            className="opening-skip"
            onClick={() => skipRef.current()}
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  )
}