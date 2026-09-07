'use client'

import { useEffect, useRef } from 'react'
import { occasion } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { Display } from '@/components/primitives/Display'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'
import { Invitation } from '@/components/occasion/Invitation'
import CandleScene from '@/components/occasion/CandleScene'

/**
 * ACT 03 — THE OCCASION. The commercial core: the ₹2,799 invitation, then the
 * signature candle scene. Primary motion: the candle timeline (the site's only
 * pinned-feel scene). Secondary: warm bloom.
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
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-8">
            <Display lines={occasion.lines} />
          </div>
          <p
            data-motion="fade"
            className="body-serif col-span-12 mt-12 md:col-span-4 md:col-start-9 md:mt-16"
          >
            {occasion.body}
          </p>
        </div>

        <div className="mt-20 grid grid-cols-12 items-end gap-x-6 md:mt-32">
          <div data-motion="fade" className="col-span-12 md:col-span-7">
            <Invitation />
          </div>
          <PhotoSlot
            id="celebration"
            src={photos.celebration}
            aspect="aspect-[4/5]"
            caption="03 / THE OCCASION"
            sizes="(max-width: 767px) 80vw, 32vw"
            className="col-span-9 col-start-3 mt-16 md:col-span-4 md:col-start-9 md:mt-0"
          />
        </div>

        <CandleScene />
      </div>
    </Act>
  )
}
