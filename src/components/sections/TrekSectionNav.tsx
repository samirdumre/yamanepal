'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, Map, CheckSquare, HelpCircle, Star } from 'lucide-react'

const SECTIONS = [
  { id: 'overview', label: 'Overview', Icon: Eye },
  { id: 'itinerary', label: 'Itinerary', Icon: Map },
  { id: 'inclusions', label: 'Inclusions', Icon: CheckSquare },
  { id: 'faqs', label: 'FAQs', Icon: HelpCircle },
  { id: 'reviews', label: 'Reviews', Icon: Star },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export function TrekSectionNav() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [visible, setVisible] = useState(false)
  const sectionObserverRef = useRef<IntersectionObserver | null>(null)
  const sentinelObserverRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const overviewEl = document.getElementById('highlights') // Sentinel is placed in Highlights section, which is the first section after hero
    if (!overviewEl) return

    sentinelObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show when overview is on screen OR has already scrolled above the viewport
        setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    sentinelObserverRef.current.observe(overviewEl)

    return () => sentinelObserverRef.current?.disconnect()
  }, [])

  // Highlight active section as user scrolls — unchanged
  useEffect(() => {
    const ratioMap: Record<string, number> = {}

    sectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap[entry.target.id] = entry.intersectionRatio
        }
        let best: SectionId = 'overview'
        let bestRatio = -1
        for (const { id } of SECTIONS) {
          const r = ratioMap[id] ?? 0
          if (r > bestRatio) {
            bestRatio = r
            best = id
          }
        }
        if (bestRatio > 0) setActiveSection(best)
      },
      { rootMargin: '-10% 0px -85% 0px', threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id)
      if (el) sectionObserverRef.current.observe(el)
    }

    return () => sectionObserverRef.current?.disconnect()
  }, [])

  function handleClick(id: SectionId) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  return (
    <div
      className={[
        // ✅ fixed instead of sticky — no space reserved in DOM when hidden
        'fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm',
        'transition-transform duration-300 ease-in-out',
        visible ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
      aria-hidden={!visible}
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <nav
          className="flex items-center overflow-x-auto scrollbar-none -mb-px"
          aria-label="Trek sections"
        >
          {SECTIONS.map(({ id, label, Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={[
                  'flex items-center hover:cursor-pointer gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  isActive
                    ? 'border-cyan-500 text-cyan-500'
                    : 'border-transparent text-gray-500 hover:text-cyan-500 hover:border-cyan-300',
                ].join(' ')}
                aria-current={isActive ? 'true' : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
