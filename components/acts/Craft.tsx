'use client'

import { useEffect, useRef } from 'react'
import { craft, ordering } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'

/**
 * ACT 02 — THE CRAFT. Food only, sized to be appreciated, entirely on the
 * shared axes. Hierarchy: ONE hero dish (cols 1–5, the act's dominant image,
 * left edge = the headline's left edge) → one secondary dish anchoring the
 * page's right edge (cols 9–12) → a full-bleed mains spread → noodles +
 * cold coffee as the closing pair (0 / 6–8 / 9–12). Nothing floats.
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
        <ActHeader meta={craft.meta} lines={craft.lines} body={craft.body} />

        {/* THE HERO DISH — large, named, art-directed. Left edge = headline's. */}
<div className="craft-food-grid mt-[var(--space-row)] grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-20">
  <figure className="food-frame">
    <PhotoSlot
      id="craft-hero"
      src={photos["craft-hero"]}
      aspect="aspect-[4/5]"
      caption="01 / WHITE SAUCE PASTA"
      sizes="(max-width: 767px) 88vw, 42vw"
      className="w-full"
    />
    <figcaption>
      <h3>{craft.hero.name}</h3>
      <p>{craft.hero.note}</p>
    </figcaption>
  </figure>

  <figure className="food-frame">
    <PhotoSlot
      id="craft-paneer"
      src={photos["craft-paneer"]}
      aspect="aspect-[4/5]"
      caption="02 / CHILLI PANEER"
      sizes="(max-width: 767px) 88vw, 42vw"
      className="w-full"
    />
    <figcaption>
      <h3>{craft.side.name}</h3>
      <p>{craft.side.note}</p>
    </figcaption>
  </figure>

  <figure className="food-frame">
    <PhotoSlot
      id="craft-spread"
      src={photos["craft-spread"]}
      aspect="aspect-[4/5]"
      caption="03 / CHILLI POTATO"
      sizes="(max-width: 767px) 88vw, 42vw"
      className="w-full"
    />
    <figcaption>
      <h3>Chilli Potato</h3>
      <p>{craft.spread.note}</p>
    </figcaption>
  </figure>

  <figure className="food-frame">
    <PhotoSlot
      id="craft-coffee"
      src={photos["craft-coffee"]}
      aspect="aspect-[4/5]"
      caption="04 / HAKKA NOODLES"
      sizes="(max-width: 767px) 88vw, 42vw"
      className="w-full"
    />
    <figcaption>
      <h3>{craft.noodles.name}</h3>
      <p>{craft.noodles.note}</p>
    </figcaption>
  </figure>

</div>
      </div>
    </Act>
  )
}
