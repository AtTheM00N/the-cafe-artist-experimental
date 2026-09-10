'use client'

import Image from 'next/image'
import { useEffect, useRef, type ReactNode } from 'react'
import { after, site } from '@/lib/content'
import type { PhotoMap } from '@/lib/photos'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { ActHeader } from '@/components/primitives/ActHeader'
import { Meta } from '@/components/primitives/Meta'

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
              WHATSAPP {after.contact}
            </a>
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

        <footer data-motion="fade" className="mt-[var(--space-env)] border-t border-rule pt-12">
          <div className="grid grid-cols-12 items-start gap-x-6">
            {/* The brand seal — the cafe's actual signage artwork, left axis */}
            {photos['brand-seal'] && (
              <div className="col-span-7 md:col-span-3">
                <Image
                  src={photos['brand-seal']}
                  alt="The Cafe Artist signage artwork"
                  width={520}
                  height={520}
                  sizes="(max-width: 767px) 58vw, 25vw"
                  className="h-auto w-full max-w-[260px]"
                />
              </div>
            )}
            {/* The name — on the same axis as the info rows' values (col 4) */}
            <div className="col-span-12 mt-8 md:col-span-8 md:col-start-5 md:mt-1">
              <p className="font-display text-xl text-bone">{site.name}</p>
            </div>
          </div>
          {/* Utility row — tagline to the left gutter, credit to the page edge */}
          <div className="mt-10 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <Meta>{site.tagline.toUpperCase()}</Meta>
            <Meta>{after.credit}</Meta>
          </div>
        </footer>
      </div>
    </Act>
  )
}
