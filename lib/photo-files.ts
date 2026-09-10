/**
 * SERVER-ONLY: resolves which photo slots have real photographs.
 * Do not import from client components.
 *
 * Drop files into `public/photos/{slotId}.jpg` (or .webp/.avif/.png) and rebuild.
 * AVIF first: the pipeline emits both formats and AVIF is the cheaper download.
 */
import fs from 'node:fs'
import path from 'node:path'
import { SLOT_IDS, type PhotoMap } from './photos'

const EXTENSIONS = ['.avif', '.webp', '.jpg', '.jpeg', '.png'] as const

export function resolvePhotos(): PhotoMap {
  const map = {} as PhotoMap
  const dir = path.join(process.cwd(), 'public', 'photos')

  for (const id of SLOT_IDS) {
    map[id] = null
    for (const ext of EXTENSIONS) {
      const file = path.join(dir, `${id}${ext}`)
      if (fs.existsSync(file)) {
        map[id] = `/photos/${id}${ext}`
        break
      }
    }
  }

  return map
}
