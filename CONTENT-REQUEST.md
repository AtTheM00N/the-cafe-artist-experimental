# THE CAFE ARTIST — Content Request

The site is designed to ship complete on verified facts alone. Everything below is
prioritized; nothing is invented in the meantime — pending items render as designed
abstractions ("unexposed frames"), never as fake facts.

**All copy goes into one file: `lib/content.ts`.** Photos go into `public/photos/`.

---

## P0 — REQUIRED BEFORE PUBLIC LAUNCH (facts)

| Item | Why | Where it goes |
|---|---|---|
| Instagram handle + URL | The handle `@thecafeartist_` appeared in an external search but is **unverified** — it stays hidden until confirmed | `after.instagram`, `after.instagramUrl` |
| Contact method (WhatsApp number, or "DM on Instagram") | The "Plan an evening" CTA needs a real destination | `after.contact` |
| Exact address + Google Maps link | Only "Sector 18, Noida" is verified today | `after.mapsUrl` |
| ₹2,799 package inclusions (list) **or** approval to show the price without itemization | The invitation shows the verified price only; it never invents its contents | `occasion.invitation.inclusions` |
| Opening hours (or a decision to omit hours entirely) | No hours are verified — the row simply doesn't render until provided | `after.hours` |
| **Production URL** | Unlocks canonical URL, robots sitemap line, and OG `url` — nothing is guessed in the meantime | `site.siteUrl` |
| **Hero photograph** — the room at night, wide, atmospheric | The hero is the site's first impression and the LCP priority; until it arrives the frame is a designed unexposed slot | `public/photos/hero.jpg` |

## P1 — STRONGLY RECOMMENDED BEFORE LAUNCH

**Photos** — drop into `public/photos/` using these exact filenames, then rebuild:

| Filename | Subject | Orientation / count |
|---|---|---|
| `hero.jpg` | **The room at night, wide** — the hero's full-bleed environment | Landscape, ≥ 2000px long edge, 1 |
| `room-wide.jpg` | Interior, wide — the room at its atmospheric best | Landscape (16:10 crop), 1 |
| `room-detail.jpg` | Table detail — candlelight, glassware, texture | Portrait (3:4 crop), 1 |
| `plate-1.jpg` | Signature dish or drink #1 | 4:5-croppable, 1 |
| `plate-2.jpg` | Signature dish or drink #2 | 4:5-croppable, 1 |
| `plate-3.jpg` | Signature dish or drink #3 | 4:5-croppable, 1 |
| `celebration.jpg` | A celebration table — cake, candles, setup | 4:5-croppable, 1 |

Spec: JPG or WebP, ≥ 2000px long edge, shot in the room's low light (no flash-bright
press photos). Warm/low-light photography is the house look.

**Dish names** — 3 names (+ optional one-line notes) for the plates in `craft.plates`.
Until then they render as designed unexposed plates — never as invented dishes.

**Review quotes** — 2–3 real customer quotes (with permission). There is currently no
review section by design; quotes can be added to Act 04 once real ones exist.

**Wordmark/logo** (if one exists) — otherwise the typographic treatment is the brand. A temporary candle-mark favicon (`public/icon.svg`) stands in until a real logo arrives.

## P2 — ENRICHMENT (post-launch)

- Ambience/food/celebration reels (a video slot can be added to Act 01)
- Staff or artist-at-work portraits
- More celebration photography for a rotating gallery in Act 03
- Verified awards/press — none are assumed or displayed today

---

## Where verified facts currently live (do not duplicate)

`lib/content.ts` is the single source of truth: name, location, ₹2,799 price,
"Always In My Heart." tagline are marked **FACT**; everything else is either
studio voice copy or a `null` dependency. The studio credit is the `STUDIO_NAME`
constant at the top of the same file — swap `INSERT_NAME` there when confirmed.
