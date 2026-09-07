import type { ElementType } from 'react'

type DisplayProps = {
  lines: readonly string[]
  as?: ElementType
  id?: string
  className?: string
}

/**
 * Signage type. Each line sits in an overflow-mask and rises in on scroll
 * (driven by lib/motion.ts). Manual line breaks are art direction, not reflow.
 */
export function Display({ lines, as: Tag = 'h2', id, className = '' }: DisplayProps) {
  return (
    <Tag id={id} className={`display ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="display-line">
          <span data-motion="line" data-motion-delay={i * 0.09}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
