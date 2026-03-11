'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { SectionHeading } from '@/components/ui/SectionLabel'
import type { Testimonial } from '@/payload-types'
import ReviewCard from '../ui/ReviewCard'

const GAP = 20
const MIN_CARD_W = 332 // minimum card width in px
const SPEED = 60 // px/s — auto-scroll speed

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
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

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [cardW, setCardW] = useState(0)
  const cardWRef = useRef(0)
  const [visibleCount, setVisibleCount] = useState(1)

  // Double the items for a seamless infinite loop
  const items = [...testimonials, ...testimonials]

  useEffect(() => {
    cardWRef.current = cardW
  }, [cardW])

  // Measure card width dynamically from the container
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry!.contentRect.width
      let visible: number
      if (w < 640) {
        visible = 1
      } else if (w < 1024) {
        visible = 2
      } else {
        // laptop+: fit as many full cards as possible
        visible = Math.max(3, Math.floor((w + GAP) / (MIN_CARD_W + GAP)))
      }
      setVisibleCount(visible)
      const cw = (w - GAP * (visible - 1)) / visible
      setCardW(cw)
      cardWRef.current = cw
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Build (or rebuild) the continuous right-to-left auto-scroll tween from any x position
  const buildAutoTween = useCallback(
    (fromX: number) => {
      tweenRef.current?.kill()
      const hw = testimonials.length * (cardWRef.current + GAP)
      if (hw === 0) return

      // Normalise fromX into (−hw, 0]
      let x = fromX % -hw
      if (x > 0) x -= hw
      gsap.set(trackRef.current, { x })

      const dist = Math.abs(-hw - x) // remaining distance to complete this cycle
      const dur = dist / SPEED

      tweenRef.current = gsap.to(trackRef.current, {
        x: -hw,
        duration: dur,
        ease: 'none',
        onComplete: () => {
          // Seamless reset: position 0 looks identical to −hw because items are doubled
          gsap.set(trackRef.current, { x: 0 })
          tweenRef.current = gsap.to(trackRef.current, {
            x: -hw,
            duration: hw / SPEED,
            ease: 'none',
            repeat: -1,
          })
        },
      })
    },
    [testimonials.length],
  )

  // Start auto-scroll once card width is measured
  useEffect(() => {
    if (cardW === 0) return
    buildAutoTween(0)
    return () => {
      tweenRef.current?.kill()
    }
  }, [cardW, buildAutoTween])

  const pause = () => tweenRef.current?.pause()
  const resume = () => tweenRef.current?.resume()

  const slide = (dir: 1 | -1) => {
    const cw = cardWRef.current
    tweenRef.current?.kill()
    const currentX = gsap.getProperty(trackRef.current!, 'x') as number
    const nextX = currentX - dir * (cw + GAP)
    gsap.to(trackRef.current, {
      x: nextX,
      duration: 0.55,
      ease: 'power3.out',
      onComplete: () => {
        const finalX = gsap.getProperty(trackRef.current!, 'x') as number
        buildAutoTween(finalX)
      },
    })
  }

  return (
    <div>
      {/* Section heading — constrained to 1320px */}
      <div className="max-w-[1320px] mx-auto px-5">
        <SectionHeading
          align="center"
          label="Our Testimonials"
          labelPosition="both"
          title="What Our Client Say"
        />
      </div>

      {/* Carousel */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="relative mt-4">
          <div ref={wrapRef} className="overflow-hidden" onMouseEnter={pause} onMouseLeave={resume}>
            <div
              ref={trackRef}
              className="flex"
              style={{ gap: `${GAP}px`, willChange: 'transform' }}
            >
              {items.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{
                    width:
                      cardW > 0
                        ? `${cardW}px`
                        : `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`,
                  }}
                >
                  <ReviewCard
                    text={t.quote}
                    author={t.name}
                    location={t.location}
                    avatarSrc={
                      t.avatar && typeof t.avatar === 'object'
                        ? (t.avatar.url ?? undefined)
                        : undefined
                    }
                    avatarAlt={t.avatar && typeof t.avatar === 'object' ? t.avatar.alt : t.name}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Left arrow */}
          <button
            aria-label="Previous"
            className="absolute cursor-pointer left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300"
            onClick={() => slide(-1)}
            type="button"
          >
            <ChevronLeft />
          </button>

          {/* Right arrow */}
          <button
            aria-label="Next"
            className="absolute cursor-pointer right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-opacity duration-300"
            onClick={() => slide(1)}
            type="button"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}
