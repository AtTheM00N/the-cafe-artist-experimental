import Opening from '@/components/systems/Opening'
import Curtain from '@/components/acts/Curtain'
import Room from '@/components/acts/Room'
import Craft from '@/components/acts/Craft'
import Occasion from '@/components/acts/Occasion'
import After from '@/components/acts/After'
import { resolvePhotos } from '@/lib/photo-files'

/**
 * One evening, five acts:
 * CURTAIN → THE ROOM → THE CRAFT → THE OCCASION → AFTER
 */
export default async function Page() {
  const photos = resolvePhotos()

  return (
    <>
      <Opening />
      <main id="main">
        <Curtain photos={photos} />
        <Room photos={photos} />
        <Craft photos={photos} />
        <Occasion photos={photos} />
        <After />
      </main>
    </>
  )
}
