/**
 * THE CAFE ARTIST — photo slot manifest.
 *
 * Every slot maps to an ORIGINAL supplied photograph (processed into
 * public/photos/*.webp by scripts/process-assets.cjs from public/photos/_inspect).
 * Screenshots and social previews are reference material only — never shipped.
 */

export const SLOT_IDS = [
  'hero',
  'room-mural',
  'room-pink',
  'room-wide',
  'craft-hero',
  'craft-paneer',
  'craft-spread',
  'craft-coffee',
  'occasion-cake',
  'occasion-room',
  'brand-seal',
] as const

export type SlotId = (typeof SLOT_IDS)[number]

export type PhotoMap = Record<SlotId, string | null>

export const PHOTO_SLOTS: Record<
  SlotId,
  { subject: string; alt: string; priority: boolean }
> = {
  hero: {
    subject: 'THE ROOM — EVENING',
    alt: 'The Cafe Artist dining room in the evening — blue banquettes, warm wood ceiling and neon light',
    priority: true,
  },
  'room-mural': {
    subject: 'THE MURAL WALL',
    alt: 'A painted mural face on a polka-dot wall at The Cafe Artist',
    priority: false,
  },
  'room-pink': {
    subject: 'THE PINK CORRIDOR',
    alt: 'A pink fringe-lit corridor with cafe seating at The Cafe Artist',
    priority: false,
  },
  'room-wide': {
    subject: 'THE CELEBRATION BOOTH',
    alt: 'A booth dressed with balloons and heart signage at The Cafe Artist',
    priority: false,
  },
  'craft-hero': {
    subject: 'SIGNATURE PLATE — CHILLI POTATO',
    alt: 'Chilli potato — glossy, sauce-coated starter plated on ceramic at The Cafe Artist',
    priority: false,
  },
  'craft-paneer': {
    subject: 'SIGNATURE PLATE — CHILLI PANEER',
    alt: 'Chilli paneer tossed with capsicum and onion in a ceramic bowl at The Cafe Artist',
    priority: false,
  },
  'craft-spread': {
    subject: 'THE MAINS SPREAD',
    alt: 'A saucy White sauce pasta plated with garlic bread at The Cafe Artist',
    priority: false,
  },
  'craft-coffee': {
    subject: 'NOODLES AND COLD COFFEE',
    alt: 'A bowl of noodles and a tall glass of cold coffee on a purple placemat at The Cafe Artist',
    priority: false,
  },
  'occasion-cake': {
    subject: 'THE BIRTHDAY CAKE',
    alt: 'A decorated birthday cake with chocolate drip and berries at The Cafe Artist',
    priority: false,
  },
  'occasion-room': {
    subject: 'THE CELEBRATION SETUP',
    alt: 'The booth styled for a booked celebration — balloons, heart signage and fringe light at The Cafe Artist',
    priority: false,
  },
  'brand-seal': {
    subject: 'THE CAFE ARTIST — SIGNAGE ART',
    alt: 'The Cafe Artist signage artwork — hand-drawn pan-flame logo and lettering',
    priority: false,
  },
}
