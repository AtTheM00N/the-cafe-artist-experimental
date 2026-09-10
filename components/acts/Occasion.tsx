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
            aspect="aspect-[4/5] md:aspect-auto md:h-full"
            caption="03 / THE OCCASION — CAKE OUT"
            sizes="(max-width: 767px) 92vw, 33vw"
            className="col-span-11 md:col-span-5"
          />
          <div className="col-span-12 mt-6 flex md:col-span-7 md:col-start-6 md:mt-0">
            <Invitation />
          </div>
        </div>

        {/* THE DRESSED ROOM — full-bleed environment beneath the offer */}
        <div className="relative mt-[var(--space-env)]">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PhotoSlot
              id="occasion-room"
              src={photos['occasion-room']}
              aspect="aspect-[16/10] max-md:aspect-[4/3]"
              caption="04 / THE ROOM, RESERVED"
              captionClassName="px-[var(--page)]"
              sizes="100vw"
              parallax={8}
              className="w-full"
            />
          </div>
        </div>

        <CandleScene />
      </div>
    </Act>
  )
}
