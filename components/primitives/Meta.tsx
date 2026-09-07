import type { HTMLAttributes } from 'react'

type MetaProps = HTMLAttributes<HTMLSpanElement> & { bright?: boolean }

/** Mono exhibit-label style: uppercase, letterspaced, dim by default. */
export function Meta({ bright, className = '', ...rest }: MetaProps) {
  return (
    <span
      {...rest}
      className={`meta block ${bright ? 'text-bone-70' : ''} ${className}`}
    />
  )
}
