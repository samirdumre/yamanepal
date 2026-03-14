'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { TrekCard } from '@/components/cards/TrekCard'
import type { Trek } from '@/payload-types'

const WHEEL_THRESHOLD = 40 // px of deltaX to trigger a slide
const TOUCH_THRESHOLD = 50 // px of touch swipe to trigger a slide
const HORIZONTAL_INTENT_RATIO = 1.25
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const MOBILE_VISIBLE = 1
const MOBILE_GAP = 12
const TABLET_VISIBLE = 2
const TABLET_GAP = 16
const DEFAULT_VISIBLE = 3
const DEFAULT_GAP = 20

interface TrekCarouselProps {
  treks: Trek[]
  label: string
  title: string
}

function ChevronLeft() {
  return (
    <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
      <path
        d="M9 1L1 8.5L9 16"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
      <path
        d="M1 1L9 8.5L1 16"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TrekCarousel({ treks, label, title }: TrekCarouselProps) {
  const [offset, setOffset] = useState(0)
  const [cardW, setCardW] = useState(0)
  const [visible, setVisible] = useState(DEFAULT_VISIBLE)
  const [gap, setGap] = useState(DEFAULT_GAP)
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wheelAccRef = useRef(0)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const offsetRef = useRef(0)
  const cardWRef = useRef(0)
  const visibleRef = useRef(DEFAULT_VISIBLE)
  const gapRef = useRef(DEFAULT_GAP)
  const resizeRafRef = useRef<number | null>(null)

  // Keep refs in sync so event handlers always read latest values
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])
  useEffect(() => {
    cardWRef.current = cardW
  }, [cardW])

  const maxOffset = Math.max(0, treks.length - visible)

  const slideTo = useCallback(
    (nextOffset: number) => {
      const clamped = Math.max(0, Math.min(maxOffset, nextOffset))
      setOffset(clamped)
      const x = -(clamped * (cardWRef.current + gapRef.current))
      gsap.to(trackRef.current, {
        x,
        duration: 0.55,
        ease: 'power3.out',
      })
    },
    [maxOffset],
  )

  // Measure card width
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (resizeRafRef.current != null) {
        cancelAnimationFrame(resizeRafRef.current)
      }

      resizeRafRef.current = requestAnimationFrame(() => {
        const w = entry!.contentRect.width
        const isMobile = w < MOBILE_BREAKPOINT
        const isTablet = w >= MOBILE_BREAKPOINT && w < TABLET_BREAKPOINT
        const vis = isMobile ? MOBILE_VISIBLE : isTablet ? TABLET_VISIBLE : DEFAULT_VISIBLE
        const g = isMobile ? MOBILE_GAP : isTablet ? TABLET_GAP : DEFAULT_GAP
        const cw = (w - g * (vis - 1)) / vis

        if (visibleRef.current !== vis) {
          setVisible(vis)
          visibleRef.current = vis
        }

        if (gapRef.current !== g) {
          setGap(g)
          gapRef.current = g
        }

        if (cardWRef.current !== cw) {
          setCardW(cw)
          cardWRef.current = cw
        }

        // Re-apply position without animation on resize
        gsap.set(trackRef.current, { x: -(offsetRef.current * (cw + g)) })
      })
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (resizeRafRef.current != null) {
        cancelAnimationFrame(resizeRafRef.current)
      }
    }
  }, [])

  // Trackpad horizontal wheel
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!isHorizontal) return

      wheelAccRef.current += e.deltaX

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      wheelTimerRef.current = setTimeout(() => {
        wheelAccRef.current = 0
      }, 150)

      if (wheelAccRef.current > WHEEL_THRESHOLD) {
        wheelAccRef.current = 0
        slideTo(offsetRef.current + 1)
      } else if (wheelAccRef.current < -WHEEL_THRESHOLD) {
        wheelAccRef.current = 0
        slideTo(offsetRef.current - 1)
      }
    }

    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [slideTo])

  // Touch swipe
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0]!.clientX
      touchStartYRef.current = e.touches[0]!.clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const deltaX = touchStartXRef.current - e.changedTouches[0]!.clientX
      const deltaY = touchStartYRef.current - e.changedTouches[0]!.clientY
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Ignore mostly vertical gestures so normal page scroll works on mobile.
      if (absDeltaX < TOUCH_THRESHOLD) return
      if (absDeltaX < absDeltaY * HORIZONTAL_INTENT_RATIO) return

      slideTo(offsetRef.current + (deltaX > 0 ? 1 : -1))
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [slideTo])

  return (
    <div>
      {/* Section heading */}
      <div className="flex flex-col gap-1 md:gap-2">
        <div className="flex items-center gap-2">
          <span className="font-['Noto_Sans_JP',sans-serif] text-base text-cyan-500">{label}</span>
          <div className="w-11 h-px bg-cyan-500" />
        </div>
        <h2 className="font-['Noto_Sans_JP',sans-serif] font-semibold text-2xl md:text-4xl text-[#020617]">
          {title}
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative mt-4 md:mt-6 lg:mt-8">
        <div ref={wrapRef} className="overflow-visible" style={{ touchAction: 'pan-y' }}>
          <div ref={trackRef} className="flex" style={{ gap: `${gap}px`, willChange: 'transform' }}>
            {treks.map((trek) => (
              <div
                key={trek.id}
                className="flex-shrink-0"
                style={{
                  width:
                    cardW > 0
                      ? `${cardW}px`
                      : `calc((100% - ${DEFAULT_GAP * (DEFAULT_VISIBLE - 1)}px) / ${DEFAULT_VISIBLE})`,
                }}
              >
                <TrekCard
                  image={typeof trek.image === 'object' ? trek.image : null}
                  name={trek.name}
                  days={trek.days}
                  difficulty={trek.difficulty as '初級' | '中級' | '上級'}
                  price={trek.price}
                  slug={trek.slug ?? ''}
                  discountedPrice={trek.discountedPrice}
                  isLastMinuteDeal={trek.isLastMinuteDeal}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Left arrow — hidden until scrolled */}
        <button
          aria-label="前へ"
          className={`absolute cursor-pointer left-0 top-32 md:top-40 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300 ${
            offset > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => slideTo(offset - 1)}
          type="button"
        >
          <ChevronLeft />
        </button>

        {/* Right arrow */}
        <button
          aria-label="次へ"
          className={`absolute cursor-pointer right-0 top-32 md:top-40 translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300 ${
            offset < maxOffset ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => slideTo(offset + 1)}
          type="button"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
