import { occasion } from '@/lib/content'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'
import { scrollToTarget } from '@/lib/scroll'

/**
 * The occasion's proof: a designed ticket. Inclusions render ONLY when the
 * client has verified them (lib/content.ts) — the price never invents its contents.
 */
export function Invitation() {
  const inv = occasion.invitation

  return (
    <div className="border border-rule bg-night-900 p-8 md:p-14">
      <Meta>{inv.label}</Meta>
      <p
        className="mt-8 font-display font-medium leading-none tracking-[-0.02em] text-bone"
        style={{ fontSize: 'clamp(4rem, 9vw, 8.5rem)' }}
      >
        {inv.price}
      </p>
      <Meta className="mt-5">{inv.per}</Meta>

      {inv.inclusions.length > 0 && (
        <ul className="mt-10 grid gap-3 border-t border-rule pt-8">
          {inv.inclusions.map((item) => (
            <li key={item} className="flex gap-4 text-[0.9375rem] text-bone-70">
              <span aria-hidden className="text-ember">—</span>
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12">
        <Cta
          href={inv.ctaTarget}
          cursorLabel="PLAN"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget(inv.ctaTarget)
          }}
        >
          {inv.cta}
        </Cta>
      </div>
    </div>
  )
}
