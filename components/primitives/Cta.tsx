import type { MouseEvent, ReactNode } from 'react'

type CtaProps = {
  children: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  variant?: 'solid' | 'ghost'
  size?: 'md' | 'sm'
  cursorLabel?: string
  className?: string
  type?: 'button' | 'submit'
  /** Renders a directional arrow that nudges forward on hover/focus. */
  arrow?: boolean
}

/** The single button voice of the site: bone field, ember fill on hover. */
export function Cta({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  cursorLabel,
  className = '',
  type = 'button',
  arrow = false,
}: CtaProps) {
  const cls = `cta cta-${variant} ${size === 'sm' ? 'cta-sm' : ''} ${className}`
  const arrowMark = arrow ? (
    <svg aria-hidden className="cta-arrow" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2.5 9.5 L9.5 2.5" />
    </svg>
  ) : null

  if (href) {
    return (
      <a href={href} onClick={onClick} data-cursor={cursorLabel} className={cls}>
        <span className="cta-label">{children}</span>
        {arrowMark}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} data-cursor={cursorLabel} className={cls}>
      <span className="cta-label">{children}</span>
      {arrowMark}
    </button>
  )
}
