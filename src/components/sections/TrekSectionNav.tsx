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

const NAV_HEIGHT = 56 // approximate nav bar height in px

export function TrekSectionNav() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [visible, setVisible] = useState(false)
  const sentinelObserverRef = useRef<IntersectionObserver | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const buttonRefs = useRef<Partial<Record<SectionId, HTMLButtonElement>>>({})

  // Show/hide the nav bar based on whether the page has scrolled past the highlights section
  useEffect(() => {
    const overviewEl = document.getElementById('highlights')
    if (!overviewEl) return

    sentinelObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    sentinelObserverRef.current.observe(overviewEl)

    return () => sentinelObserverRef.current?.disconnect()
  }, [])

  // Detect the active section using scroll position — more reliable across all screen sizes
  useEffect(() => {
    function onScroll() {
      const offset = NAV_HEIGHT + 20
      let best: SectionId = 'overview'
      let bestTop = -Infinity

      for (const { id } of SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top - offset
        // Pick the section whose top is closest to (and at or above) the detection line
        if (top <= 0 && top > bestTop) {
          bestTop = top
          best = id
        }
      }
      setActiveSection(best)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run once on mount to set initial state
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-scroll the nav horizontally so the active button is visible
  useEffect(() => {
    const btn = buttonRefs.current[activeSection]
    const nav = navRef.current
    if (!btn || !nav) return

    const navWidth = nav.clientWidth
    const btnLeft = btn.offsetLeft
    const btnWidth = btn.offsetWidth
    // Center the active button inside the scrollable nav
    const targetScroll = btnLeft - navWidth / 2 + btnWidth / 2
    nav.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [activeSection])

  function handleClick(id: SectionId) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  return (
    <div
      className={[
        'fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm',
        'transition-transform duration-300 ease-in-out',
        visible ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
      aria-hidden={!visible}
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <nav
          ref={navRef}
          className="flex items-center overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden -mb-px"
          style={{ scrollbarWidth: 'none' }}
          aria-label="Trek sections"
        >
          {SECTIONS.map(({ id, label, Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                ref={(el) => {
                  if (el) buttonRefs.current[id] = el
                }}
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
