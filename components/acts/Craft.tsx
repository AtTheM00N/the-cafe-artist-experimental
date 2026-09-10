'use client'

import { useEffect, useRef } from 'react'
import { craft } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { PhotoSlot } from '@/components/primitives/PhotoSlot'

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
        <div className="mt-[var(--space-row)] grid grid-cols-12 items-end gap-x-6">
          <PhotoSlot
            id="craft-hero"
            src={photos['craft-hero']}
            aspect="aspect-[3/4]"
            caption="01 / SIGNATURE"
            sizes="(max-width: 767px) 78vw, 40vw"
            className="col-span-9 md:col-span-6"
          />
          <div className="col-span-12 mt-10 md:col-span-6 md:col-start-7 md:mt-0">
            <h3 data-motion="fade" className="plate-name">
              {craft.hero.name}
            </h3>
            <p data-motion="fade" className="meta mt-4 max-w-[30ch] text-bone-70 normal-case tracking-normal">
              {craft.hero.note}
            </p>
          </div>
        </div>

        {/* SECONDARY DISH — its label shares the hero-dish label's left edge;
            the image anchors the page's right edge (cols 9–12). */}
        <div className="mt-[var(--space-row)] grid grid-cols-12 items-start gap-x-6">
          <div className="col-span-12 order-2 mt-10 md:order-1 md:col-span-5 md:mt-16">
            <h3 data-motion="fade" className="plate-name">
              {craft.side.name}
            </h3>
            <p data-motion="fade" className="meta mt-4 max-w-[30ch] text-bone-70 normal-case tracking-normal">
              {craft.side.note}
            </p>
          </div>
          <PhotoSlot
            id="craft-paneer"
            src={photos['craft-paneer']}
            aspect="aspect-[4/5]"
            caption="02 / WOK-TOSSED"
            sizes="(max-width: 767px) 62vw, 41vw"
            className="col-span-9 order-1 md:order-2 md:col-span-5 md:col-start-8"
          />
        </div>

        {/* THE SPREAD — full-bleed, landscape, breathing room for the food. */}
        <div className="relative mt-[var(--space-env)]">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <PhotoSlot
              id="craft-spread"
              src={photos['craft-spread']}
              aspect="aspect-[16/10] max-md:aspect-[4/3]"
              caption="03 / MAINS, SHARED"
              captionClassName="px-[var(--page)]"
              sizes="100vw"
              parallax={8}
              className="w-full"
              overlay={<p className="tagline max-w-[14ch] text-bone">{craft.spread.line}</p>}
            />
          </div>
        </div>

        {/* THE CLOSING PAIR — noodles with the cold coffee: three grid voices,
            0 / 6–8 / 9–12, right edge = page edge, captions on one baseline. */}
        <div className="mt-[var(--space-row)] grid grid-cols-12 items-end gap-x-6">
          <PhotoSlot
            id="craft-noodles"
            src={photos['craft-noodles']}
            aspect="aspect-[4/3]"
            caption="04 / FROM THE WOK"
            sizes="(max-width: 767px) 92vw, 33vw"
            className="col-span-11 md:col-span-6"
          />
          <div className="col-span-12 mt-10 md:col-span-3 md:col-start-7 md:mt-0">
            <h3 data-motion="fade" className="plate-name">
              {craft.noodles.name}
            </h3>
            <p data-motion="fade" className="meta mt-4 max-w-[26ch] text-bone-70 normal-case tracking-normal">
              {craft.noodles.note}
            </p>
          </div>
          <PhotoSlot
            id="craft-coffee"
            src={photos['craft-coffee']}
            aspect="aspect-[4/5]"
            caption="05 / AND THE COLD COFFEE"
            sizes="(max-width: 767px) 72vw, 24vw"
            className="col-span-11 md:col-span-3 md:col-start-10 md:mt-0"
          />
        </div>
      </div>
    </Act>
  )
}
