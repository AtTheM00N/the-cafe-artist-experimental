'use client'

import { useEffect, useRef } from 'react'
import { occasion } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'
import { Invitation } from '@/components/occasion/Invitation'
import CandleScene from '@/components/occasion/CandleScene'

/**
 * ACT 03 — THE OCCASION. One composition, not scattered parts: the cake
 * photograph (cols 1–5, left) and the ₹2,799 invitation (cols 7–12, right,
 * filling its columns so its right edge is the page's edge) sit as two panels
 * of the same celebratory frame; the dressed booth runs full-bleed beneath as
 * the act's environment. Then the signature candle scene.
 */
export default function Occasion({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = createActMotion(ref.current)
    return () => ctx?.revert()
  }, [reduced])

  return (
    <Act act="act-03">
      <div ref={ref}>
        <ActHeader lines={occasion.lines} body={occasion.body} />

        {/* ONE COMPOSITION — cake panel + price panel, seated on one shared row */}
        <div className="mt-[var(--space-row)] grid grid-cols-12 items-stretch gap-x-6">
          <PhotoSlot
  id="occasion-cake"
  src={photos['occasion-cake']}
  aspect="aspect-[4/5]"
  caption="03 / THE OCCASION — CAKE OUT"
  sizes="(max-width: 767px) 90vw, 34vw"
  className="col-span-12 md:col-span-5 md:col-start-1"
/>

<div className="col-span-12 mt-6 flex md:col-span-6 md:col-start-7 md:mt-0">
  <Invitation />
</div>
        </div>

        <CandleScene />
      </div>
    </Act>
  )
}
