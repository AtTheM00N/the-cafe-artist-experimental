'use client'

import { useEffect, useRef } from 'react'
import { room } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { Display } from '@/components/primitives/Display'
import { Meta } from '@/components/primitives/Meta'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'

/**
 * ACT 01 — THE ROOM. Feel the space before seeing it.
 * Primary motion: masked photo wipes. Secondary: ±8% parallax.
 */
export default function Room({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = createActMotion(ref.current)
    return () => ctx?.revert()
  }, [reduced])

  return (
    <Act act="act-01">
      <div ref={ref}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-9">
            <Display lines={room.lines} className="text-bone" />
          </div>
          <p
            data-motion="fade"
            className="body-serif col-span-12 mt-14 md:col-span-5 md:col-start-5 md:mt-20"
          >
            {room.body}
          </p>
          <PhotoSlot
            id="room-detail"
            src={photos['room-detail']}
            aspect="aspect-[3/4]"
            caption="02 / THE ROOM — DETAIL"
            sizes="(max-width: 767px) 90vw, 34vw"
            className="col-span-9 col-start-4 mt-16 md:col-span-4 md:col-start-9 md:-mt-16"
          />
        </div>

        {/* Full-bleed wide with the act's closing line laid over the image */}
        <div className="relative mt-20 md:mt-32">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PhotoSlot
              id="room-wide"
              src={photos['room-wide']}
              aspect="aspect-[16/10] max-md:aspect-[4/3]"
              caption="01 / THE ROOM — WIDE"
              sizes="100vw"
              parallax={9}
              className="w-full"
            />
            <p className="tagline absolute bottom-10 left-[max(var(--page),4vw)] max-w-[14ch] text-bone md:bottom-14">
              {room.closing}
            </p>
          </div>
        </div>
      </div>
    </Act>
  )
}
