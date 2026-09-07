'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion'

/**
 * Contextual cursor: 8px bone dot + ring that expands with a mono label over
 * [data-cursor="VIEW|OPEN|PLAN|HOLD"] targets. mix-blend-difference keeps it legible
 * over photography. Desktop fine-pointer only; disappears on touch and reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('has-cursor')

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.14, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.14, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = false
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: Event) => {
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as
        | HTMLElement
        | null
      if (target) {
        label.textContent = target.dataset.cursor ?? ''
        ring.classList.add('is-active')
      } else {
        label.textContent = ''
        ring.classList.remove('is-active')
      }
    }

    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      document.documentElement.classList.remove('has-cursor')
      gsap.killTweensOf([dot, ring])
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none">
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner">
          <span ref={labelRef} className="cursor-label" />
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
