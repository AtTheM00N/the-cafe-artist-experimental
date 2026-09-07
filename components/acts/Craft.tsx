'use client'

import { useEffect, useRef } from 'react'
import { craft } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { Display } from '@/components/primitives/Display'
import { Meta } from '@/components/primitives/Meta'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'

/**
 * ACT 02 — THE CRAFT. Plates as rows in a sketchbook: hairline, index, name, slot.
 * Dish names/notes are content dependencies — absent ones render as designed
 * unexposed plates (never as invented dishes).
 * Primary motion: staggered line reveals. Secondary: hover "development".
 */
export default function Craft({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = createActMotion(ref.current)
    return () => ctx?.revert()
  }, [reduced])

  return (
    <Act act="act-02">
      <div ref={ref}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-8">
            <Display lines={craft.lines} />
          </div>
          <p
            data-motion="fade"
            className="body-serif col-span-12 mt-12 md:col-span-4 md:col-start-9 md:mt-16"
          >
            {craft.body}
          </p>
        </div>

        <div className="mt-20 md:mt-32">
          {craft.plates.map((plate, i) => {
            const index = `0${i + 1}`
            const slotId = `plate-${i + 1}` as `plate-${1 | 2 | 3}`
            return (
              <article
                key={index}
                data-motion="fade"
                className={`grid grid-cols-12 items-end gap-x-6 border-t border-rule py-10 md:py-14 ${
                  i === craft.plates.length - 1 ? 'border-b' : ''
                }`}
              >
                <Meta className="col-span-2 md:col-span-1">{index}</Meta>
                {plate.name ? (
                  <h3 className="plate-name col-span-10 md:col-span-5">{plate.name}</h3>
                ) : (
                  <h3 className="meta text-bone-45 col-span-10 md:col-span-5">
                    PLATE {index}
                  </h3>
                )}
                {plate.note ? (
                  <p className="meta col-span-12 mt-4 md:col-span-3 md:col-start-6 md:mt-0">
                    {plate.note}
                  </p>
                ) : null}
                <PhotoSlot
                  id={slotId}
                  src={photos[slotId]}
                  aspect="aspect-[4/5]"
                  caption={`${index} / THE CRAFT`}
                  sizes="(max-width: 767px) 100vw, 32vw"
                  cursorLabel="OPEN"
                  className="col-span-9 col-start-2 mt-6 md:col-span-3 md:col-start-10 md:mt-0"
                />
              </article>
            )
          })}
        </div>
      </div>
    </Act>
  )
}
