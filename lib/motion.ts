'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Shared act choreography. Opt-in per element:
 *  - [data-motion="line"]  masked line rise (inside .display-line wrappers)
 *  - [data-motion="fade"]  soft rise + fade
 *  - [data-motion="rule"]  hairline draw, left origin
 *  - [data-motion="wipe"]  clip-path reveal on a photo slot (inner scales down)
 *  - [data-parallax="8"]   scrubbed ±N% vertical drift on the marked element
 *
 * Initial states are set inside the effect (never in CSS) so content stays visible
 * without JavaScript and under prefers-reduced-motion.
 */
export function createActMotion(scope: HTMLElement | null) {
  if (!scope) return undefined

  const ctx = gsap.context(() => {
    // Masked line reveals
    gsap.utils.toArray<HTMLElement>('[data-motion="line"]', scope).forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: 'power4.out',
          delay: Number(el.dataset.motionDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      )
    })

    // Soft fades
    gsap.utils.toArray<HTMLElement>('[data-motion="fade"]', scope).forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: Number(el.dataset.motionDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      )
    })

    // Hairline draws
    gsap.utils.toArray<HTMLElement>('[data-motion="rule"]', scope).forEach((el) => {
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        },
      )
    })

    // Masked photo wipes
    gsap.utils.toArray<HTMLElement>('[data-motion="wipe"]', scope).forEach((el) => {
      const inner = el.querySelector('[data-motion-inner]')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
      tl.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.35, ease: 'power4.inOut' },
      )
      if (inner) {
        tl.fromTo(
          inner,
          { scale: 1.16 },
          { scale: 1, duration: 1.7, ease: 'power3.out' },
          0,
        )
      }
    })

    // Scrubbed parallax
    gsap.utils.toArray<HTMLElement>('[data-parallax]', scope).forEach((el) => {
      const amount = Number(el.dataset.parallax ?? 8)
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
  }, scope)

  return ctx
}
