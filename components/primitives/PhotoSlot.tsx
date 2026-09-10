import Image from 'next/image'
import type { ReactNode } from 'react'
import type { SlotId } from '@/lib/photos'
import { PHOTO_SLOTS } from '@/lib/photos'

type PhotoSlotProps = {
  id: SlotId
  /** Resolved src from lib/photo-files.ts — null renders the designed unexposed frame. */
  src: string | null
  className?: string
  /** Aspect via Tailwind classes, e.g. "aspect-[3/4]" — responsive crops stay art-directed. */
  aspect: string
  caption?: string
  /** Extra caption classes — e.g. gutter padding so full-bleed captions land on --page. */
  captionClassName?: string
  /** Copy anchored inside the image box (bottom, gutter-inset) — full-bleed taglines. */
  overlay?: ReactNode
  sizes?: string
  cursorLabel?: string
  parallax?: number
  /** Set false when entrance is owned elsewhere (hero: Opening.tsx) — no wipe/parallax. */
  motion?: boolean
}

/**
 * Photography is a major storytelling medium here: slots bleed, offset and wipe —
 * never "image inside a card". Without a photo the slot renders as a designed
 * unexposed frame, so the site ships looking complete and upgrades by dropping
 * one file into public/photos/{slotId}.jpg.
 *
 * Geometry contract: the clipping context wraps ONLY the image; the caption sits
 * in flow beneath it, so a caption's left edge is always the image's left edge
 * (pad full-bleed slots to --page) and neighbouring images share caption baselines.
 */
export function PhotoSlot({
  id,
  src,
  className = '',
  aspect,
  caption,
  captionClassName = '',
  overlay,
  sizes = '(max-width: 767px) 100vw, 45vw',
  cursorLabel = 'VIEW',
  parallax = 6,
  motion = true,
}: PhotoSlotProps) {
  const meta = PHOTO_SLOTS[id]

  return (
    <figure
      {...(motion ? { 'data-motion': 'wipe' } : {})}
      data-cursor={cursorLabel}
      className={`relative ${aspect} ${className}`}
    >
      <div className="grain relative h-full w-full overflow-hidden bg-night-800">
        <div className="absolute inset-0" {...(motion ? { 'data-motion-inner': '' } : {})}>
          <div
            className="absolute inset-0"
            {...(motion ? { 'data-parallax': String(parallax) } : {})}
          >
            {src ? (
              <Image
                src={src}
                alt={meta.alt}
                fill
                sizes={sizes}
                priority={meta.priority}
                className="photo-grade object-cover"
              />
            ) : (
              <div aria-hidden className="absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(80% 60% at 50% 30%, rgb(217 113 58 / 0.10), transparent 70%)',
                  }}
                />
                <span className="meta absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                  UNEXPOSED — {meta.subject}
                </span>
              </div>
            )}
          </div>
        </div>
        {overlay ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 px-[var(--page)] md:bottom-14">
            {overlay}
          </div>
        ) : null}
      </div>
      {caption ? (
        <figcaption className={`meta mt-3 ${captionClassName}`}>{caption}</figcaption>
      ) : null}
    </figure>
  )
}
