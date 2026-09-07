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
}: CtaProps) {
  const cls = `cta cta-${variant} ${size === 'sm' ? 'cta-sm' : ''} ${className}`

  if (href) {
    return (
      <a href={href} onClick={onClick} data-cursor={cursorLabel} className={cls}>
        <span className="cta-label">{children}</span>
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} data-cursor={cursorLabel} className={cls}>
      <span className="cta-label">{children}</span>
    </button>
  )
}
