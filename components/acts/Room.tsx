"use client";

import { useEffect, useRef } from "react";
import { room } from "@/lib/content";
import type { PhotoMap } from "@/lib/photos";
import { createActMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Act } from "@/components/primitives/Act";
import { ActHeader } from "@/components/primitives/ActHeader";
import { PhotoSlot } from "@/components/primitives/PhotoSlot";

export default function Room({ photos }: { photos: PhotoMap }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = createActMotion(ref.current);

    return () => ctx?.revert();
  }, [reduced]);

  return (
    <Act act="act-01">
      <div ref={ref}>
        <ActHeader
          meta={room.meta}
          lines={room.lines}
          body={room.body}
        />

        <div className="mt-[var(--space-row)] grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <figure className="room-frame">
            <PhotoSlot
              id="room-mural"
              src={photos["room-mural"]}
              aspect="aspect-[4/5]"
              caption="01 / THE MURAL"
              sizes="(max-width: 767px) 92vw, 42vw"
              className="w-full"
            />
          </figure>

          <figure className="room-frame">
            <PhotoSlot
              id="room-pink"
              src={photos["room-pink"]}
              aspect="aspect-[4/5]"
              caption="02 / THE ROOM"
              sizes="(max-width: 767px) 92vw, 42vw"
              className="w-full"
            />
          </figure>
        </div>

        <div className="mt-12 w-full text-center">
  <p className="tagline whitespace-nowrap">
    {room.closing}
  </p>

  <p className="meta mt-4">
    {room.emoticon}
  </p>
</div>
      </div>
    </Act>
  );
}