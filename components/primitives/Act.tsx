import type { ReactNode } from 'react'
import type { ActId } from '@/lib/content'
import { acts } from '@/lib/content'
import { Rule } from '@/components/primitives/Rule'
import { Meta } from '@/components/primitives/Meta'

type ActProps = {
  act: ActId
  children: ReactNode
  className?: string
}

/**
 * Chapter wrapper: a full-width hairline with the act's exhibit label seated on it —
 * the site's only numbering, and it earns its place as narrative furniture.
 */
export function Act({ act, children, className = '' }: ActProps) {
  const meta = acts.find((a) => a.id === act)
  if (!meta) return null

  return (
    <section
      id={meta.id}
      data-act={meta.index}
      aria-label={`Act ${meta.index} — ${meta.name}`}
      className={`act relative ${className}`}
    >
      <div className="relative mb-[var(--space-row)]">
        <Rule />
        <Meta className="absolute left-0 top-1/2 -translate-y-1/2 bg-night-950 pr-5">
          {meta.index} / {meta.name.toUpperCase()}
        </Meta>
      </div>
      {children}
    </section>
  )
}
