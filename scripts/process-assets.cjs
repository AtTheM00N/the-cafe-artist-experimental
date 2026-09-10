/* One-time asset pipeline: originals (public/photos/_inspect) -> optimized site photography (public/photos).
 * Temp tool — run once, then delete.
 *
 * Output contract (ALWAYS keep in sync with lib/photos.ts SLOT_IDS):
 *  - webp q78, AVIF variant for every slot except hero/brand-seal (AVIF costs
 *    more than it saves at hero sizes, and the seal is line art)
 *  - mobile gets a narrower variant where the crop changes the story
 *    (e.g. occasion-room is a tight booth crop at 3:4 on phones)
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SRC = path.join(process.cwd(), 'public', 'photos', '_inspect')
const OUT = path.join(process.cwd(), 'public', 'photos')
const Q = 78
const avifSave = { effort: 4 }

/**
 * slots: [outputName, sourceFile, mode, args, position, trimTopPct?]
 *  mode 'cover' = resize+cover to w×h          args [w, h]
 *  mode 'full'  = keep aspect, cap long edge   args [cap]
 * `position` art-directs the crop.
 * `trimTopPct` crops that % off the TOP before resizing (AC-unit removal).
 */
const slots = [
  // HERO — the strongest room photograph, wide cinematic crop
  ['hero', 'ambience-3.webp', 'cover', [2000, 1250], 'centre'],

  // ROOM
  // Mural: trim the top 14% (AC unit lives there), then a tight cover —
  // the painted face dominates, the table in front of the wall goes too.
  ['room-mural', 'Ambience.webp', 'cover', [1200, 1500], 'centre', 14],
  // Pink corridor: south-anchored and shorter — fringe and seating lead,
  // the dead ceiling band is cropped away.
  ['room-pink', 'ambience-2.avif', 'cover', [675, 560], 'south'],
  ['room-wide', 'ambience-4.webp', 'cover', [2000, 1150], 'centre'], // booth + balloons — wide

  // CRAFT
  ['craft-hero', 'chilli potato.webp', 'full', [1100]],   // glossy starter, portrait — hero dish
  // Paneer: north-anchored so the dish is never clipped at the top of frame.
  ['craft-paneer', 'chilli paneer.webp', 'cover', [765, 955], 'north'],
  ['craft-spread', 'pasta-2.webp', 'full', [1400]],       // landscape mains
  ['craft-coffee', 'noodle and cold coffee.webp', 'full', [900]], // noodles + the drink, portrait

  // OCCASION
  // Cake: trim the busy room band above the cake (chair, tables, flowers),
  // then tighten — the cake fills the frame, the printed wrap is just its base.
  ['occasion-cake', 'cake.webp', 'cover', [700, 875], 'centre', 18],
  // A DIFFERENT photograph of the celebration than Act 01's wide:
  // a tight booth crop that reads "reserved for you", not "the room again".
  ['occasion-room', 'ambience-4.webp', 'cover', [900, 1200], 'west'],
  ['occasion-room-mobile', 'ambience-4.webp', 'cover', [810, 1080], 'west'],

  // AFTER
  ['brand-seal', 'Favicon.png', 'full', [520]],           // "THE CAFE ARTIST" logo art
]

;(async () => {
  for (const [name, src, mode, args, position, trimTopPct] of slots) {
    const input = path.join(SRC, src)
    if (!fs.existsSync(input)) {
      console.error('MISSING SOURCE:', src)
      process.exitCode = 1
      continue
    }
    let pipe = sharp(input, { failOn: 'none' })
    if (trimTopPct) {
      const m = await pipe.metadata()
      const cut = Math.round((m.height * trimTopPct) / 100)
      pipe = pipe.extract({ left: 0, top: cut, width: m.width, height: m.height - cut })
    }
    if (mode === 'cover') {
      pipe = pipe.resize(args[0], args[1], { fit: 'cover', position: position ?? 'centre' })
    } else {
      pipe = pipe.resize({ width: args[0], withoutEnlargement: true })
    }
    const info = await pipe.webp({ quality: Q }).toFile(path.join(OUT, `${name}.webp`))
    console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kB  <- ${src}`)
    // AVIF companion (skipped for hero + brand-seal by contract above)
    if (name !== 'hero' && name !== 'brand-seal') {
      let aPipe = sharp(input, { failOn: 'none' })
      if (trimTopPct) {
        const m = await aPipe.metadata()
        const cut = Math.round((m.height * trimTopPct) / 100)
        aPipe = aPipe.extract({ left: 0, top: cut, width: m.width, height: m.height - cut })
      }
      const a = await aPipe
        .resize(...(mode === 'cover' ? [args[0], args[1]] : []), {
          ...(mode === 'cover'
            ? { width: args[0], height: args[1], fit: 'cover', position: position ?? 'centre' }
            : { width: args[0], withoutEnlargement: true }),
        })
        .avif(avifSave)
        .toFile(path.join(OUT, `${name}.avif`))
      console.log(`${name}.avif  ${a.width}x${a.height}  ${(a.size / 1024).toFixed(0)}kB`)
    }
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
