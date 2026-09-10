'use client'

import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { candleScene } from '@/lib/content'
import { gsap } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Meta } from '@/components/primitives/Meta'
import { Cta } from '@/components/primitives/Cta'
import { scrollToTarget } from '@/lib/scroll'

const RING_C = 2 * Math.PI * 52 // progress ring circumference
const SMOKE_L = 130 // smoke path length (over-estimated, dash hides it fully)
const HOLD_SECONDS = 1.5

type HoldState = 'idle' | 'holding' | 'out'

/**
 * THE SIGNATURE INTERACTION — "Make a wish."
 *
 * A sticky, full-viewport scene: one candle. Hold anywhere (or press-and-hold
 * Space) to blow it out; the flame gutters and dies, a wisp of smoke rises,
 * the room warms up, and the tagline — "Always In My Heart." — is earned.
 * Keyboard completes on key-up; reduced motion completes on a single click.
 * No WebGL, no media permissions: SVG + GSAP only.
 */
export default function CandleScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const flameRef = useRef<SVGSVGElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ringSvgRef = useRef<SVGSVGElement>(null)
  const progressRef = useRef<SVGCircleElement>(null)
  const smokeRef = useRef<SVGSVGElement>(null)
  const smokePathRef = useRef<SVGPathElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)

  const stateRef = useRef<HoldState>('idle')
  const progressTweenRef = useRef<gsap.core.Tween | null>(null)
  const flickerRef = useRef<gsap.core.Timeline | null>(null)

  const [blown, setBlown] = useState(false)
  const [live, setLive] = useState('A single lit candle.')

  const reduced = useReducedMotion()

  // Scroll-driven entrance beats (scrubbed, no pinning library needed — CSS sticky).
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cs="pre"]',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', end: 'top 30%', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-cs="candle"]',
        { yPercent: 14, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 90%', end: 'top 35%', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-cs="wish"]',
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 60%', end: 'top 15%', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-cs="hint"]',
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 45%', end: 'top 8%', scrub: true },
        },
      )
      gsap.set(smokeRef.current, { opacity: 1 })
    }, wrapRef)
    return () => ctx.revert()
  }, [reduced])

  // Idle flame flicker — the only flicker in the entire site.
  useEffect(() => {
    if (reduced || blown) return
    const flame = flameRef.current
    const glow = glowRef.current
    if (!flame || !glow) return

    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(flame, { scaleX: 0.94, scaleY: 1.05, rotation: -2.5, duration: 0.12, transformOrigin: '50% 100%' })
      .to(flame, { scaleX: 1.04, scaleY: 0.96, rotation: 2.5, duration: 0.16 })
      .to(flame, { scaleX: 0.97, scaleY: 1.03, rotation: -1, duration: 0.14 })
    gsap.to(glow, { opacity: 0.85, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' })

    flickerRef.current = tl
    return () => {
      tl.kill()
      gsap.killTweensOf([flame, glow])
    }
  }, [reduced, blown])

  const start = () => {
    if (stateRef.current !== 'idle') return
    stateRef.current = 'holding'
    setLive('Holding — keep going…')
    flickerRef.current?.pause()
    progressTweenRef.current = gsap.fromTo(
      progressRef.current,
      { attr: { 'stroke-dashoffset': RING_C } },
      {
        attr: { 'stroke-dashoffset': 0 },
        duration: HOLD_SECONDS,
        ease: 'none',
        onComplete: () => blowOut(),
      },
    )
    gsap.to(ringSvgRef.current, { opacity: 1, duration: 0.25 })
    gsap.to(flameRef.current, {
      scale: 0.8,
      transformOrigin: '50% 100%',
      duration: HOLD_SECONDS,
      ease: 'power1.in',
    })
  }

  const cancel = () => {
    if (stateRef.current !== 'holding') return
    stateRef.current = 'idle'
    setLive('The flame steadies.')
    progressTweenRef.current?.kill()
    gsap.to(progressRef.current, { attr: { 'stroke-dashoffset': RING_C }, duration: 0.5, ease: 'power2.out' })
    gsap.to(ringSvgRef.current, { opacity: 0, duration: 0.4, delay: 0.35 })
    gsap.to(flameRef.current, { scale: 1, duration: 0.7, ease: 'power2.out' })
    flickerRef.current?.resume()
  }

  const blowOut = (force = false) => {
    if (stateRef.current === 'out') return
    if (!force && stateRef.current !== 'holding') return
    stateRef.current = 'out'
    setBlown(true)
    setLive('The flame is out. Make a wish.')
    gsap.set(flameRef.current, { opacity: 0, visibility: 'hidden' })

    if (reduced) return

    flickerRef.current?.kill()
    progressTweenRef.current?.kill()
    gsap.killTweensOf([flameRef.current, glowRef.current])
    gsap.to(ringSvgRef.current, { opacity: 0, duration: 0.3 })

    const tl = gsap.timeline()
    tl.to('[data-cs="pre"], [data-cs="wish"], [data-cs="hint"]', { autoAlpha: 0, duration: 0.5 })
      .to(
        flameRef.current,
        { scaleY: 0.08, scaleX: 0.5, autoAlpha: 0, duration: 0.5, ease: 'power2.in', transformOrigin: '50% 100%' },
        '<',
      )
      .call(() => {
        // Pin the final state synchronously so no later style recalc can resurrect the flame.
        gsap.set(flameRef.current, { opacity: 0, visibility: 'hidden' })
      })
      .to(glowRef.current, { opacity: 0, duration: 0.7 }, '<')
      .fromTo(
        smokePathRef.current,
        { attr: { 'stroke-dashoffset': SMOKE_L }, opacity: 0 },
        { attr: { 'stroke-dashoffset': 0 }, opacity: 0.85, duration: 1.3, ease: 'power2.out' },
        '-=0.15',
      )
      .to(smokeRef.current, { opacity: 0, y: -14, duration: 0.9, ease: 'power1.in' }, '-=0.35')
      .to(stageRef.current, { backgroundColor: '#241c15', duration: 1.8, ease: 'power2.inOut' }, '-=0.9')
      .to(bloomRef.current, { opacity: 1, duration: 1.6, ease: 'power2.out' }, '<')
      .fromTo(
        '[data-cs="after"]',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.18, duration: 1.1, ease: 'power4.out' },
        '-=1.1',
      )
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    start()
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault()
      if (reduced) blowOut(true)
      else start()
    }
  }

  const onKeyUp = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (stateRef.current === 'holding') blowOut(true)
    }
  }

  return (
    <div ref={wrapRef} className="relative h-[260vh]">
      <div
        ref={stageRef}
        data-cursor="HOLD"
        onPointerDown={onPointerDown}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        className="sticky top-0 flex h-screen select-none flex-col items-center justify-center overflow-hidden bg-night-950 [-webkit-touch-callout:none]"
        style={{ backgroundColor: '#120e0a' }}
      >
        <Meta className="absolute left-1/2 top-[16%] -translate-x-1/2 whitespace-nowrap text-center" data-cs="pre">
          {candleScene.pre}
        </Meta>

        {/* The candle */}
        <div data-cs="candle" className="relative flex h-[300px] w-[220px] items-end justify-center">
          <div
            ref={glowRef}
            aria-hidden
            className="absolute left-1/2 top-[107px] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgb(217 113 58 / 0.32), transparent 72%)' }}
          />

          <svg
            ref={smokeRef}
            aria-hidden
            viewBox="0 0 60 96"
            fill="none"
            className="absolute bottom-[220px] left-1/2 h-[96px] w-[60px] -translate-x-1/2"
          >
            <path
              ref={smokePathRef}
              d="M30 92 C 22 74, 40 62, 30 44 C 22 30, 38 20, 30 4"
              stroke="rgb(242 234 219 / 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={SMOKE_L}
              strokeDashoffset={SMOKE_L}
            />
          </svg>

          <svg
            ref={ringSvgRef}
            aria-hidden
            viewBox="0 0 120 120"
            className="absolute left-1/2 top-[107px] h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 opacity-0 -rotate-90"
          >
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(242 234 219 / 0.12)" strokeWidth="1" />
            <circle
              ref={progressRef}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#d9713a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>

          {/* GSAP owns the flame's opacity/scale exclusively — no CSS transition here,
              so the class-flip and the blow timeline can never race each other. */}
          <svg
            ref={flameRef}
            aria-hidden
            viewBox="0 0 36 54"
            className="absolute bottom-[166px] left-1/2 h-[54px] w-[36px] -translate-x-1/2"
            style={{ transformOrigin: '50% 100%' }}
          >
            <defs>
              <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7a2e12" />
                <stop offset="45%" stopColor="#d9713a" />
                <stop offset="100%" stopColor="#ffd9a0" />
              </linearGradient>
            </defs>
            <path d="M18 1 C 27 14, 31 24, 18 46 C 5 24, 9 14, 18 1 Z" fill="url(#flame-grad)" />
          </svg>

          <div aria-hidden className="absolute bottom-[150px] left-1/2 h-[16px] w-[3px] -translate-x-1/2 rounded-full bg-[#3a2a1c]" />
          <div
            aria-hidden
            className="h-[150px] w-[64px] rounded-t-[8px]"
            style={{ background: 'linear-gradient(180deg, #efe6d4 0%, #ddd0b8 60%, #c9bb9f 100%)' }}
          />
        </div>

        <p
          data-cs="wish"
          className="absolute bottom-[21%] left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(1.75rem,3.5vw,3rem)] italic text-bone"
        >
          {candleScene.wish}
        </p>

        <div
          data-cs="hint"
          className={`absolute bottom-[9%] left-1/2 w-full -translate-x-1/2 text-center transition-opacity duration-700 ${
            blown ? 'opacity-0' : ''
          }`}
        >
          <Meta>{candleScene.hintHold}</Meta>
          <Meta className="mt-2 hidden md:block">{candleScene.hintKey}</Meta>
        </div>

        {/* Warm bloom after the blow */}
        <div
          ref={bloomRef}
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] ${
            blown ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(60% 50% at 50% 42%, rgb(217 113 58 / 0.18), transparent 70%)',
          }}
        />

        {/* The earned moment */}
        <div
          aria-hidden={false}
          className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 transition-all duration-700 ${
            blown ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <p data-cs="after" className="tagline px-4 text-center text-bone">
            {candleScene.tagline}
          </p>
          <div data-cs="after" className="pointer-events-auto">
            <Cta
  href="https://wa.me/918130305256"
  variant="solid"
  size="sm"
  cursorLabel="PLAN"
>
  Plan an evening
</Cta>
          </div>
        </div>

        {/* Accessible hold surface */}
        <button
          type="button"
          aria-label="Hold to blow out the candle"
          disabled={blown}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onClick={reduced ? () => blowOut(true) : undefined}
          className="absolute inset-0 z-10 cursor-pointer bg-transparent opacity-0"
          tabIndex={blown ? -1 : 0}
        />

        <div aria-live="polite" className="sr-only">
          {live}
        </div>
      </div>
    </div>
  )
}
