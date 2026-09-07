/**
 * THE CAFE ARTIST — single source of truth for all site content.
 *
 * RULES (no-fabrication policy):
 *  - FACTS (name, location, price, tagline) are user-verified. Never edit without verification.
 *  - VOICE COPY (claims, body lines, act titles) is studio-written interpretation of the
 *    brand — never a factual claim about the business.
 *  - `null` values are CONTENT DEPENDENCIES. They render as designed abstractions, never
 *    as invented facts. Fill them only with client-verified material (see CONTENT-REQUEST.md).
 */

/** Studio credit — swap this one line when the studio name is confirmed. */
export const STUDIO_NAME = 'INSERT_NAME'

export const site = {
  name: 'The Cafe Artist',
  location: 'Sector 18, Noida',
  /** FACT — user-verified. */
  tagline: 'Always In My Heart.',
  /** FACT — user-verified. */
  packagePrice: '₹2,799',
} as const

export const acts = [
  { id: 'act-00', index: '00', name: 'Curtain' },
  { id: 'act-01', index: '01', name: 'The Room' },
  { id: 'act-02', index: '02', name: 'The Craft' },
  { id: 'act-03', index: '03', name: 'The Occasion' },
  { id: 'act-04', index: '04', name: 'After' },
] as const

export type ActId = (typeof acts)[number]['id']

export const curtain = {
  meta: 'SECTOR 18 — NOIDA',
  /** Rendered uppercase by .display-hero. */
  lines: ['The Cafe', 'Artist'],
  kicker: 'AN EVENING IN FIVE ACTS',
  cue: 'SCROLL',
} as const

export const room = {
  lines: ['Low light. Long tables.', 'A room that', 'takes its time.'],
  body: 'Walk in and the evening slows down on purpose. The light is kept low, the tables are kept long, and nothing here is in a hurry — conversations outlast the coffee, and the table itself becomes part of the plan. This is a room built for lingering.',
  closing: "You'll know the room by its light.",
} as const

export const craft = {
  lines: ['Food with the', 'lights left low.'],
  body: 'The menu follows the mood of the room — small, considered plates for slow evenings. Everything is made to be photographed first and eaten slowly after. The plates below are waiting for their photographs; the room, meanwhile, is already open.',
  /** CONTENT DEPENDENCY — dish names are P1. `null` renders as a designed unexposed plate. */
  plates: [
    { name: null as string | null, note: null as string | null },
    { name: null as string | null, note: null as string | null },
    { name: null as string | null, note: null as string | null },
  ],
} as const

export const occasion = {
  lines: ['Some occasions', 'ask for a room.'],
  body: 'Birthdays, anniversaries, the quiet victories nobody throws parties for — some evenings deserve more than a table in a bright room. Here, the occasion gets the lighting it deserves.',
  invitation: {
    label: 'THE CELEBRATION',
    /** FACT — user-verified. */
    price: site.packagePrice,
    per: 'PER PACKAGE',
    /** CONTENT DEPENDENCY (P0) — inclusions render only when client-verified. */
    inclusions: [] as string[],
    cta: 'Plan an evening',
    ctaTarget: '#act-04',
  },
} as const

export const candleScene = {
  pre: 'EVERY EVENING ENDS THE SAME WAY.',
  wish: 'Make a wish.',
  hintHold: 'HOLD TO BLOW OUT THE CANDLE',
  hintKey: 'OR PRESS AND HOLD SPACE',
  /** FACT — user-verified tagline. Revealed after the flame goes out. */
  tagline: site.tagline,
  cta: 'Plan an evening',
  ctaTarget: '#act-04',
} as const

export const after = {
  lines: ["The evening doesn't", 'end at the door.'],
  body: 'Follow the room, find it again, and bring someone who deserves it. The next celebration is already saving you a seat.',
  /**
   * CONTENT DEPENDENCIES (P0). The Instagram handle @thecafeartist_ was observed in an
   * external search but is NOT VERIFIED — it stays `null` until the client confirms it.
   * Same for the exact address / maps link and opening hours. Rows render only when filled.
   */
  instagram: null as string | null,
  instagramUrl: null as string | null,
  addressLine: site.location,
  mapsUrl: null as string | null,
  hours: null as string | null,
  contact: null as string | null,
  credit: `SITE BY ${STUDIO_NAME}`,
} as const
