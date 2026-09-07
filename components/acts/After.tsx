'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { after, site } from '@/lib/content'
import { createActMotion } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Act } from '@/components/primitives/Act'
import { Display } from '@/components/primitives/Display'
import { Meta } from '@/components/primitives/Meta'
import { Rule } from '@/components/primitives/Rule'

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
 * ACT 04 — AFTER. Memory and logistics, rendered only as far as verified facts
 * allow: pending rows either show a designed confirmation marker or don't exist.
 * Primary motion: link underline draws. Everything else stays quiet.
 */
export default function After() {
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
        <Display lines={after.lines} />
        <p data-motion="fade" className="body-serif mt-12">
          {after.body}
        </p>

        <div className="mt-20 border-t border-rule md:mt-28">
          <Row label="INSTAGRAM">
            {after.instagram && after.instagramUrl ? (
              <a
                href={after.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="u-link text-bone"
              >
                {after.instagram}
              </a>
            ) : (
              <span className="text-bone-45">HANDLE TO BE CONFIRMED</span>
            )}
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

          {after.hours && <Row label="HOURS">{after.hours}</Row>}
          {after.contact && <Row label="REACH US">{after.contact}</Row>}
        </div>

        <footer
          data-motion="fade"
          className="mt-24 flex flex-col justify-between gap-6 border-t border-rule pt-10 md:mt-32 md:flex-row md:items-end"
        >
          <p className="font-display text-xl text-bone">{site.name}</p>
          <Meta>{site.tagline.toUpperCase()}</Meta>
          <Meta>{after.credit}</Meta>
        </footer>
      </div>
    </Act>
  )
}
