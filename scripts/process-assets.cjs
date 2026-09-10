/* One-time asset pipeline: originals (public/photos/_inspect) -> optimized site photography (public/photos).
 * Temp tool — run once, then delete. */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SRC = path.join(process.cwd(), 'public', 'photos', '_inspect')
const OUT = path.join(process.cwd(), 'public', 'photos')

/**
 * slots: [outputName, sourceFile, mode, args]
 *  mode 'cover' = resize+cover to w×h          args [w, h]
 *  mode 'full'  = keep aspect, cap long edge   args [cap]
 * All output webp q80. `position` lets me art-direct the crop.
 */
const slots = [
  // HERO — the strongest room photograph, wide cinematic crop
  ['hero', 'ambience-3.webp', 'cover', [2000, 1250], 'centre'],

  // ROOM
  ['room-mural', 'Ambience.webp', 'full', [1400]],        // painted face, portrait — dominant
  ['room-pink', 'ambience-2.avif', 'full', [900]],        // pink fringe corridor — detail
  ['room-wide', 'ambience-4.webp', 'cover', [2000, 1150], 'centre'], // booth + balloons — wide

  // CRAFT
  ['craft-hero', 'chilli potato.webp', 'full', [1100]],   // glossy starter, portrait — hero dish
  ['craft-paneer', 'chilli paneer.webp', 'cover', [1000, 1250], 'centre'],
  ['craft-spread', 'pasta-2.webp', 'full', [1400]],       // landscape mains
  ['craft-noodles', 'noodles.webp', 'cover', [1200, 900], 'centre'],
  ['craft-coffee', 'noodle and cold coffee.webp', 'full', [900]], // the drink

  // OCCASION
  ['occasion-cake', 'cake.webp', 'full', [1100]],         // portrait cake — hero of the act
  ['occasion-room', 'ambience-4.webp', 'cover', [1400, 1000], 'centre'], // celebration room (alt crop)

  // AFTER
  ['brand-seal', 'Favicon.png', 'full', [520]],           // "THE CAFE ARTIST" logo art
]

;(async () => {
  for (const [name, src, mode, args, position] of slots) {
    const input = path.join(SRC, src)
    if (!fs.existsSync(input)) {
      console.error('MISSING SOURCE:', src)
      process.exitCode = 1
      continue
    }
    let pipe = sharp(input, { failOn: 'none' })
    if (mode === 'cover') {
      pipe = pipe.resize(args[0], args[1], { fit: 'cover', position: position ?? 'centre' })
    } else {
      pipe = pipe.resize({ width: args[0], withoutEnlargement: true })
    }
    const info = await pipe.webp({ quality: 80 }).toFile(path.join(OUT, `${name}.webp`))
    console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kB  <- ${src}`)
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
