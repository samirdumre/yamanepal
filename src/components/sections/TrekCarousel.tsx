'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { TrekCard } from '@/components/cards/TrekCard'
import type { Trek } from '@/payload-types'

const GAP = 20
const VISIBLE = 3
const WHEEL_THRESHOLD = 40 // px of deltaX to trigger a slide
const TOUCH_THRESHOLD = 50 // px of touch swipe to trigger a slide

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
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wheelAccRef = useRef(0)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartXRef = useRef(0)
  const offsetRef = useRef(0)
  const cardWRef = useRef(0)

  // Keep refs in sync so event handlers always read latest values
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])
  useEffect(() => {
    cardWRef.current = cardW
  }, [cardW])

  const maxOffset = Math.max(0, treks.length - VISIBLE)

  const slideTo = useCallback(
    (nextOffset: number) => {
      const clamped = Math.max(0, Math.min(maxOffset, nextOffset))
      setOffset(clamped)
      const x = -(clamped * (cardWRef.current + GAP))
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
      const w = entry!.contentRect.width
      const cw = (w - GAP * (VISIBLE - 1)) / VISIBLE
      setCardW(cw)
      cardWRef.current = cw
      // Re-apply position without animation on resize
      gsap.set(trackRef.current, { x: -(offsetRef.current * (cw + GAP)) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Trackpad horizontal wheel
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!isHorizontal) return
      e.preventDefault()

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

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [slideTo])

  // Touch swipe
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0]!.clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartXRef.current - e.changedTouches[0]!.clientX
      if (Math.abs(delta) < TOUCH_THRESHOLD) return
      slideTo(offsetRef.current + (delta > 0 ? 1 : -1))
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-['Inter',sans-serif] text-base text-cyan-500">{label}</span>
          <div className="w-11 h-px bg-cyan-500" />
        </div>
        <h2 className="font-['Inter',sans-serif] font-semibold text-4xl text-slate-950">{title}</h2>
      </div>

      {/* Carousel */}
      <div className="relative mt-8">
        <div ref={wrapRef} className="overflow-visible">
          <div ref={trackRef} className="flex gap-5" style={{ willChange: 'transform' }}>
            {treks.map((trek) => (
              <div
                key={trek.id}
                className="flex-shrink-0"
                style={{ width: cardW > 0 ? `${cardW}px` : `calc((100% - 40px) / 3)` }}
              >
                <TrekCard
                  image={typeof trek.image === 'object' ? trek.image : null}
                  name={trek.name}
                  days={trek.days}
                  difficulty={trek.difficulty as 'Easy' | 'Moderate' | 'Hard'}
                  price={trek.price}
                  slug={trek.slug ?? ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Left arrow — hidden until scrolled */}
        <button
          aria-label="Previous"
          className={`absolute cursor-pointer left-0 top-40 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300 ${
            offset > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => slideTo(offset - 1)}
          type="button"
        >
          <ChevronLeft />
        </button>

        {/* Right arrow */}
        <button
          aria-label="Next"
          className={`absolute cursor-pointer right-0 top-40 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300 ${
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
