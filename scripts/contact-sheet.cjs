/* Inspect tool: labeled contact sheet of every original asset. Temporary — deleted after QA. */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const DIR = path.join(process.cwd(), 'public', 'photos', '_inspect')
const OUT = path.join(process.cwd(), '.freebuff', 'contact-sheet.jpg')
const TILE_W = 400
const TILE_H = 300
const LABEL_H = 56
const COLS = 4

;(async () => {
  const files = fs.readdirSync(DIR).filter((f) => /\.(webp|avif|png|jpe?g)$/i.test(f) && !f.startsWith('.'))
  const cells = []
  for (const f of files) {
    const img = sharp(path.join(DIR, f), { failOn: 'none' })
    const meta = await img.metadata()
    const buf = await sharp(path.join(DIR, f), { failOn: 'none' })
      .resize(TILE_W, TILE_H, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer()
    const label = `${f.replace(/\.(webp|avif|png|jpe?g)$/i, '')}  ${meta.width ?? '?'}×${meta.height ?? '?'}`
    const labelSvg = Buffer.from(
      `<svg width="${TILE_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#16120e"/>
        <text x="12" y="36" font-family="monospace" font-size="24" fill="#f7efe3">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
      </svg>`,
    )
    const labelBuf = await sharp(labelSvg).png().toBuffer()
    cells.push(await sharp({ create: { width: TILE_W, height: TILE_H + LABEL_H, channels: 3, background: '#16120e' } })
      .composite([
        { input: buf, top: 0, left: 0 },
        { input: labelBuf, top: TILE_H, left: 0 },
      ])
      .jpeg({ quality: 85 })
      .toBuffer())
  }

  const rows = Math.ceil(cells.length / COLS)
  const canvas = sharp({
    create: { width: COLS * (TILE_W + 8) + 8, height: rows * (TILE_H + LABEL_H + 8) + 8, channels: 3, background: '#211a15' },
  })
  const comps = cells.map((c, i) => ({
    input: c,
    left: 8 + (i % COLS) * (TILE_W + 8),
    top: 8 + Math.floor(i / COLS) * (TILE_H + LABEL_H + 8),
  }))
  await canvas.composite(comps).jpeg({ quality: 88 }).toFile(OUT)
  console.log('WROTE', OUT, cells.length, 'cells')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
