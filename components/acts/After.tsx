'use client'

import Image from 'next/image'
import { useEffect, useRef, type ReactNode } from 'react'
import { after, ordering, site } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-motion="fade" className="grid grid-cols-12 gap-x-6 border-b border-rule py-8">
      <Meta className="col-span-12 md:col-span-3">{label}</Meta>
      <div className="col-span-12 mt-3 text-[0.9375rem] text-bone-70 md:col-span-8 md:col-start-5 md:mt-0">
        {children}
      </div>
    </div>
  )
}

/**
 * ACT 04 — AFTER. Memory and logistics: every row is a verified fact from the
 * reference pack. The footer is ONE composition — the cafe's signage artwork
 * sits on the act's left axis (cols 1–3, the info labels' edge), the name sits
 * on the values axis (col 4), and the utility row spans gutter to page edge.
 */
export default function After({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const ctx = createActMotion(ref.current)
    return () => ctx?.revert()
  }, [reduced])

  return (
    <Act act="act-04">
      <div ref={ref}>
        <ActHeader lines={after.lines} body={after.body} />

        {/* THE VERDICT — the room's Google rating, set like the act's own
            exhibit: one big serif number, real words beneath, no widget chrome. */}
        <div data-motion="fade" className="mt-[var(--space-row)] grid grid-cols-12 gap-x-6 border-t border-rule pt-12">
          <div className="col-span-12 md:col-span-3">
            <Meta>GOOGLE RATING</Meta>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl leading-none text-bone md:text-7xl">
                {after.google.rating}
              </span>
              <span className="text-lg" style={{ color: 'var(--color-ember)' }} aria-hidden>
                ★★★★★
              </span>
            </p>
          </div>
          <ul className="col-span-12 mt-10 space-y-6 md:col-span-7 md:col-start-6 md:mt-0">
            {after.google.reviews.map((quote) => (
              <li key={quote.slice(0, 24)} className="body-serif normal-case tracking-normal">
                <span className="text-bone-45">“</span>
                {quote}
                <span className="text-bone-45">”</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[var(--space-env)] border-t border-rule">
          <Row label="INSTAGRAM">
            {after.instagram && after.instagramUrl ? (
              <a href={after.instagramUrl} target="_blank" rel="noreferrer" className="u-link text-bone">
                {after.instagram}
              </a>
            ) : (
              <span className="text-bone-45">HANDLE TO BE CONFIRMED</span>
            )}
          </Row>

          <Row label="HOURS">{after.hours}</Row>

          <Row label="REACH US">
            <a
              href={`https://wa.me/91${after.contact.replace(/\s/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="u-link text-bone"
            >
              {after.contact}
            </a>
          </Row>

          <Row label="ORDER IN">
            <div className="flex flex-wrap gap-3">
              <Cta href={ordering.swiggy} size="sm" cursorLabel="SWIGGY">
                SWIGGY
              </Cta>
              <Cta href={ordering.zomato} size="sm" cursorLabel="ZOMATO">
                ZOMATO
              </Cta>
            </div>
          </Row>

          <Row label="FIND US">
            {after.addressLine}
            {after.mapsUrl && (
              <>
                {' · '}
                <a href={after.mapsUrl} target="_blank" rel="noreferrer" className="u-link text-bone">
                  OPEN IN MAPS
                </a>
              </>
            )}
          </Row>
        </div>

        <footer
          data-motion="fade"
          className="mt-[var(--space-env)] border-t border-rule pt-8 md:pt-10"
        >
          <div className="grid grid-cols-12 items-end gap-x-4 gap-y-5 md:gap-x-6">
            <div className="col-span-4 flex items-end md:col-span-2">
              {photos['brand-seal'] && (
                <Image
                  src={photos['brand-seal']}
                  alt="The Cafe Artist signage artwork"
                  width={220}
                  height={220}
                  sizes="(max-width: 767px) 26vw, 12vw"
                  className="h-auto w-[84px] max-w-full opacity-95 md:w-[120px]"
                />
              )}
            </div>

            <div className="col-span-8 md:col-span-7 md:col-start-4">
              <p className="font-display leading-[0.82] tracking-[-0.07em] text-bone text-[clamp(2.6rem,7.5vw,8rem)]">
                {site.tagline}
              </p>
            </div>

            <div className="col-span-12 md:col-span-2 md:col-start-11 md:text-right">
              <p className="font-meta text-[0.56rem] tracking-[0.2em] text-bone-45 uppercase">
                {site.name}
              </p>
              <p className="mt-3 font-meta text-[0.56rem] tracking-[0.2em] text-bone-70 uppercase">
                {after.credit}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-5 md:mt-10">
            <div className="flex items-center gap-3 text-bone-45">
              <svg
                aria-hidden="true"
                viewBox="0 0 160 18"
                className="h-4 w-28 md:w-36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 14C20 12 30 6 40 6C52 6 57 14 68 14C77 14 82 9 90 9C100 9 105 14 118 14C128 14 136 9 160 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <p className="font-meta text-[0.56rem] tracking-[0.2em] text-bone-45 uppercase">
                The Cafe Artist
              </p>
              <p className="font-meta text-[0.56rem] tracking-[0.2em] text-bone-70 uppercase">
                {after.credit}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Act>
  )
}
