'use client'

import { useEffect, useState } from 'react'
import { Cta } from '@/components/primitives/Cta'
import { site } from '@/lib/content'
import { scrollToTarget } from '@/lib/scroll'

/**
 * Appears once the curtain has passed (≈ half a viewport). Hairline + blur after.
 * Hidden during the first impression so the curtain owns the stage.
 */
export default function Nav() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-out ${
        shown
          ? 'translate-y-0 border-b border-rule bg-night-950/80 opacity-100 backdrop-blur-sm'
          : 'pointer-events-none -translate-y-3 border-b border-transparent opacity-0'
      }`}
    >
      <div className="flex items-center justify-between px-[var(--page)] py-4">
        <a
          href="#act-00"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget('#act-00')
          }}
          className="font-display text-[1.05rem] tracking-tight text-bone"
        >
          {site.name}
        </a>
        <Cta
          href="#act-03"
          variant="solid"
          size="sm"
          cursorLabel="PLAN"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget('#act-03')
          }}
        >
          Plan an evening
        </Cta>
      </div>
    </header>
  )
}
