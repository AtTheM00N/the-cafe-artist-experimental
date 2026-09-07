'use client'

import { useEffect, useState } from 'react'
import { acts } from '@/lib/content'
import { scrollToTarget } from '@/lib/scroll'

/**
 * The rail is the site's spine: mono act indices 00–04 on the right (desktop),
 * a fixed act chip bottom-left on mobile. Current act is viewport-driven.
 */
export default function ChapterRail() {
  const [current, setCurrent] = useState('00')

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-act]'))
    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent((entry.target as HTMLElement).dataset.act ?? '00')
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((section) => io.observe(section))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <nav
        aria-label="Chapters"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
      >
        {acts.map((act) => {
          const active = act.index === current
          return (
            <a
              key={act.id}
              href={`#${act.id}`}
              aria-current={active ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(`#${act.id}`)
              }}
              className="group flex items-center gap-3"
            >
              <span
                className={`meta transition-colors duration-500 ${
                  active ? 'text-bone opacity-100 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {act.name}
              </span>
              <span
                className={`meta transition-colors duration-500 ${
                  active ? 'text-bone' : 'text-bone-45'
                }`}
              >
                {act.index}
              </span>
            </a>
          )
        })}
      </nav>

      <div
        aria-hidden
        className="meta fixed bottom-5 left-5 z-30 border border-rule bg-night-950/70 px-3 py-2 backdrop-blur-sm md:hidden"
      >
        {current} — {acts.find((a) => a.index === current)?.name.toUpperCase()}
      </div>
    </>
  )
}
