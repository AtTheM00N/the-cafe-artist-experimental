'use client'

import { useEffect, useRef } from 'react'
import { room } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'

/**
 * ACT 01 — THE ROOM. Ambience only, on the shared grid. The mural wall is the
 * dominant image (cols 1–8, its right edge = the headline's right edge); the
 * pink corridor is the secondary detail anchored to the page's right edge
 * (cols 9–12, mirroring the header's copy column); the celebration booth runs
 * full-bleed as the act's closing environment, its caption pulled back to --page.
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
        <ActHeader meta={room.meta} lines={room.lines} body={room.body} />

        {/* THE MURAL — dominant. Right edge lands on the header's column 8. */}
        <div className="mt-[var(--space-row)] grid grid-cols-12 items-end gap-x-6">
          <PhotoSlot
            id="room-mural"
            src={photos['room-mural']}
            aspect="aspect-[3/4] md:aspect-[3/3.55]"
            caption="01 / THE MURAL WALL"
            sizes="(max-width: 767px) 92vw, 57vw"
            className="col-span-11 md:col-span-8"
          />
          {/* THE PINK CORRIDOR — secondary detail, anchored to the page edge (cols 9–12) */}
          <PhotoSlot
            id="room-pink"
            src={photos['room-pink']}
            aspect="aspect-square"
            caption="02 / THE PINK CORRIDOR"
            sizes="(max-width: 767px) 52vw, 24vw"
            className="col-span-7 col-start-6 mt-10 md:col-span-4 md:col-start-9 md:mt-0"
          />
        </div>

        {/* Full-bleed wide — the act closes inside the celebration booth.
            The tagline is anchored to the page gutter (same left axis as every
            headline); the caption is pulled back to --page as well. */}
        <div className="relative mt-[var(--space-env)]">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PhotoSlot
              id="room-wide"
              src={photos['room-wide']}
              aspect="aspect-[16/10] max-md:aspect-[4/3]"
              caption="03 / THE ROOM, DRESSED"
              captionClassName="px-[var(--page)]"
              sizes="100vw"
              parallax={9}
              className="w-full"
              overlay={<p className="tagline max-w-[14ch] text-bone">{room.closing}</p>}
            />
          </div>
        </div>
      </div>
    </Act>
  )
}
