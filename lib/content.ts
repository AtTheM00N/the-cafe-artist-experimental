/**
 * THE CAFE ARTIST — single source of truth for all site content.
 *
 * RULES (no-fabrication policy):
 *  - FACTS (name, location, price, tagline, hours, phone, address, Instagram) are
 *    client-supplied (reference pack info.txt). Never edit without verification.
 *  - VOICE COPY (claims, body lines, section titles) is studio-written interpretation
 *    of the brand — never a factual claim about the business.
 *  - `null` values are CONTENT DEPENDENCIES. They render as designed abstractions,
 *    never as invented facts.
 */

/** Studio credit — swap this one line when the studio name is confirmed. */
export const STUDIO_NAME = 'INSERT_NAME'

/**
 * FACTS — client-supplied ordering links (delivery/online ordering).
 */
export const ordering = {
  swiggy: 'https://www.swiggy.com/city/noida-1/the-cafe-artist-sector-18-rest603339',
  zomato: 'https://www.zomato.com/ncr/the-cafe-artist-sector-18-noida',
} as const

export const site = {
  name: 'The Cafe Artist',
  location: 'Sector 18, Noida',
  /** FACT — user-verified. */
  tagline: 'Always In My Heart.',
  /** FACT — user-verified. */
  packagePrice: '₹2,799',
  /** FACT — user-verified (reference pack). */
  instagram: '@thecafeartist_',
  /** FACT — user-verified (reference pack). */
  instagramUrl: 'https://www.instagram.com/thecafeartist_/',
  /** FACT — user-verified (reference pack). */
  hours: '11:30am – 11:30pm (Open Always <3)',
  /** FACT — user-verified (reference pack). */
  phone: '81303 05256',
  /** FACT — user-verified (reference pack). */
  whatsapp: '81303 05256',
  /** FACT — user-verified (reference pack). */
  addressLine:
    'In front of metro pillar 80, Near JS Arcade, D Block, Pocket K, Sector 18, Noida, Uttar Pradesh 201301',
  /** FACT — user-verified (reference pack). */
  mapsUrl:
    'https://www.google.com/maps/place/The+Cafe+artist/@28.5725162,77.3240413,778m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390ce529ed4e77e5:0xca2a6aea94c6582f!8m2!3d28.5725162!4d77.3240413!16s%2Fg%2F11s5bw4dh0',
  /** CONTENT DEPENDENCY (P0) — canonical production URL. `null` keeps robots/sitemap honest. */
  siteUrl: null as string | null,
} as const

/**
 * The five acts of the night. The rail and act labels read from this.
 */
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
  /** Rendered uppercase by .display-hero, one line each. lines[1] "Artist"
   *  carries the neon accent (magenta → ember) in the hero and the intro. */
  lines: ['The Cafe', 'Artist'],
  /** FACT — user-verified tagline; quieter than the title by design. */
  tagline: site.tagline,
  cta: 'Enter the room',
  ctaTarget: '#act-01',
  kicker: 'AN ART CAFE, AFTER DARK',
  cue: 'SCROLL',
} as const

export const room = {
  meta: 'MURALS · NEON · COLOUR',
  lines: ['Every wall', 'is in on it.'],
  body: 'Painted faces watch you eat. Neon hums over the coffee. Flowers and fringe light the corners, and the furniture refuses to match — on purpose. Nothing here is a backdrop; the room is the first artwork you sit inside.',
  closing: 'Move in for the evening.',
  emoticon: '────୨ৎ────'
} as const

export const craft = {
  meta: 'THE MENU, MOOD FIRST',
  lines: ['Plates that', 'pose first.'],
  body: 'Everything arrives looking better than it has any right to — saturated, warm, ready for its close-up. Photograph it while it\u2019s hot, then take your time.',
  /**
   * VOICE COPY, art-directed to the supplied photography. Dish identifications
   * come from the reference pack filenames; the voice lines are studio-written.
   */
  hero: {
    name: 'Chilli potato',
    note: 'The one regulars photograph first — gloss, crunch, sauce to the edges.',
  },
  side: {
    name: 'Chilli paneer',
    note: 'Wok-tossed, unapologetically orange, gone in minutes.',
  },
  spread: {
    name: 'White sauce pasta',
    caption: 'MAINS, SHARED',
    note: 'Plates land together. Nobody waits.',
  },
  noodles: {
    name: 'Hakka noodles',
    note: 'With the cold coffee — the order the booth was built for.',
  },
  order: {
    label: 'ORDER THE CRAFT',
    line: 'The room doesn\u2019t travel. The plates do.',
  },
} as const

export const occasion = {
  lines: ['Some occasions', 'ask for', 'a room.'],
  body: 'Birthdays, anniversaries, the small wins nobody throws parties for — some evenings need more than a good table. Balloons up, cake out, the whole painted room in on it.',
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
  lines: ['The evening', 'doesn\u2019t end', 'at the door.'],
  body: 'Find the room, bring the people, and let the walls do the rest. The next celebration is already saving you a seat.',
  /** FACTS — user-verified (reference pack). */
  instagram: site.instagram,
  instagramUrl: site.instagramUrl,
  addressLine: site.addressLine,
  mapsUrl: site.mapsUrl,
  hours: site.hours,
  contact: site.whatsapp,
  /** FACTS — client-supplied Google rating and reviews (trimmed, never rewritten). */
  google: {
    rating: '4.7',
    reviews: [
      'The Chicken Spicy Pizza is to die for. IT WAS FIRE!! Atmosphere is chill and cool, the staff is really friendly. Considering the quality, the price is reasonable.',
      'Excellent place — I\u2019d say it\u2019s the best place to eat in Sector 18. Food tastes so much better, and the owner works on feedback from the customers.',
      'A hidden gem where great food, beautiful vibes, and artistic charm come together.',
    ],
  },
  credit: `SITE BY ${STUDIO_NAME}`,
} as const
