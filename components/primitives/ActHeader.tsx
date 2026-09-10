import type { ReactNode } from 'react'
import { Display } from '@/components/primitives/Display'
import { Meta } from '@/components/primitives/Meta'

type ActHeaderProps = {
  /** Exhibit meta line above the headline. Omitted where the act has none. */
  meta?: string
  lines: readonly string[]
  /** Supporting copy — always occupies the header's right column (cols 9–12). */
  body: ReactNode
}

/**
 * THE ACT HEADER — one composition, shared by every act.
 *
 * Headline occupies cols 1–8; supporting copy occupies cols 9–12 of the same
 * 12-column grid, so every act opens on identical axes: copy's left edge sits
 * on the header's column 8, and its right edge is the page's right edge.
 */
export function ActHeader({ meta, lines, body }: ActHeaderProps) {
  return (
    <>
      {meta ? (
        <Meta data-motion="fade" className="mb-8">
          {meta}
        </Meta>
      ) : null}
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 md:col-span-8">
          <Display lines={lines} />
        </div>
        <p data-motion="fade" className="body-serif col-span-12 mt-10 md:col-span-4 md:col-start-9 md:mt-16">
          {body}
        </p>
      </div>
    </>
  )
}
