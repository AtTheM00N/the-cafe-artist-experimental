import Image from 'next/image'
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
  sizes?: string
  cursorLabel?: string
  parallax?: number
}

/**
 * Photography is a major storytelling medium here: slots bleed, offset and wipe —
 * never "image inside a card". Without a photo the slot renders as a designed
 * unexposed frame, so the site ships looking complete and upgrades by dropping
 * one file into public/photos/{slotId}.jpg.
 */
export function PhotoSlot({
  id,
  src,
  className = '',
  aspect,
  caption,
  sizes = '(max-width: 767px) 100vw, 45vw',
  cursorLabel = 'VIEW',
  parallax = 6,
}: PhotoSlotProps) {
  const meta = PHOTO_SLOTS[id]

  return (
    <figure
      data-motion="wipe"
      data-cursor={cursorLabel}
      className={`relative overflow-hidden bg-night-800 grain ${aspect} ${className}`}
    >
      <div className="absolute inset-0" data-motion-inner>
        <div className="absolute inset-[-7%]" data-parallax={String(parallax)}>
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
      {caption ? (
        <figcaption className="meta absolute -bottom-7 left-0 whitespace-nowrap">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
