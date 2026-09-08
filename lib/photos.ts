/**
 * THE CAFE ARTIST — photo slot manifest.
 *
 * The design ships complete without photography: every slot renders as a designed
 * "unexposed frame" until a photo is dropped into `public/photos/{slotId}.jpg`.
 * Rebuild after adding photos (slots are resolved at build time).
 *
 * Spec for the client: JPG/WebP, >= 2000px long edge, landscape for full-bleeds,
 * 4:5-croppable for dishes. Per-slot crops are applied by the manifest ratios.
 */

export const SLOT_IDS = [
  'hero',
  'room-wide',
  'room-detail',
  'plate-1',
  'plate-2',
  'plate-3',
  'celebration',
] as const

export type SlotId = (typeof SLOT_IDS)[number]

export type PhotoMap = Record<SlotId, string | null>

export const PHOTO_SLOTS: Record<
  SlotId,
  { subject: string; alt: string; priority: boolean }
> = {
  hero: {
    subject: 'INTERIOR — EVENING',
    alt: 'The Cafe Artist at night — low light, long tables, candlelight',
    priority: true,
  },
  'room-wide': {
    subject: 'INTERIOR — WIDE',
    alt: 'Wide view of The Cafe Artist at night — low light and long tables',
    priority: false,
  },
  'room-detail': {
    subject: 'THE ROOM — DETAIL',
    alt: 'Detail of the room — candlelight on a set table',
    priority: false,
  },
  'plate-1': {
    subject: 'SIGNATURE PLATE 01',
    alt: 'Signature dish at The Cafe Artist, plated in low light',
    priority: false,
  },
  'plate-2': {
    subject: 'SIGNATURE PLATE 02',
    alt: 'Signature dish at The Cafe Artist, plated in low light',
    priority: false,
  },
  'plate-3': {
    subject: 'SIGNATURE PLATE 03',
    alt: 'Signature dish or drink at The Cafe Artist, plated in low light',
    priority: false,
  },
  celebration: {
    subject: 'CELEBRATION SETUP',
    alt: 'A celebration table set at The Cafe Artist — cake and candles',
    priority: false,
  },
}
