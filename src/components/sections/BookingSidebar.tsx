'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { TalkToExpert } from './TalkToExpert'
import { BookingFormModal } from './BookingFormModal'
import type { Trek } from '@/payload-types'
import { Button } from '../ui/button'

interface BookingSidebarProps {
  price: number
  trekName: string
  groupPricing?: Trek['groupPricing']
  expertQrSrc?: string
}

export function BookingSidebar({
  price,
  trekName,
  groupPricing,
  expertQrSrc: _expertQrSrc,
}: BookingSidebarProps) {
  const [tableOpen, setTableOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = document.getElementById('sidebar-stop-sentinel')
    const wrapper = wrapperRef.current
    if (!sentinel || !wrapper) return

    const parent = wrapper.parentElement as HTMLElement | null
    if (!parent) return

    const updateHeight = () => {
      const sentinelTop = sentinel.getBoundingClientRect().top + window.scrollY
      const parentTop = parent.getBoundingClientRect().top + window.scrollY
      parent.style.height = `${sentinelTop - parentTop}px`
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
      parent.style.height = ''
    }
  }, [])

  const showGroupTable =
    groupPricing?.enabled && groupPricing.tiers && groupPricing.tiers.length > 0
  const tiers = groupPricing?.tiers ?? []

  return (
    <div ref={wrapperRef} className="sticky top-16 flex flex-col gap-4 max-w-[312px]">
      <div className="w-full p-3 rounded-lg outline outline-1 outline-slate-200/80 flex flex-col items-center gap-3">
        {/* All Inclusive Price header */}
        <div className="self-stretch inline-flex justify-center items-center gap-2">
          <div className="flex-1 h-0 border-t max-w-11 border-cyan-500" />
          <span className="text-cyan-500 text-sm font-normal whitespace-nowrap">
            All Inclusive Price
          </span>
          <div className="flex-1 h-0 border-t max-w-11 border-cyan-500" />
        </div>

        <div className="self-stretch flex flex-col gap-2">
          {/* Price heading */}
          <div className="self-stretch text-center">
            <span className="text-blue-500 text-2xl font-semibold">USD {price}</span>
            <span className="text-black text-xl font-normal"> / person</span>
          </div>

          {/* Group discount table — only shown when enabled in admin */}
          {showGroupTable && (
            <div className="self-stretch bg-blue-100/80 flex flex-col items-center">
              {/* Header row — always visible */}
              <div className="self-stretch px-4 py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-black/50">
                  We Offer Group Discount Price
                </span>
                <button
                  onClick={() => setTableOpen((prev) => !prev)}
                  aria-expanded={tableOpen}
                  aria-label={
                    tableOpen ? 'Collapse group discount table' : 'Expand group discount table'
                  }
                  className="w-6 h-6 flex items-center justify-center text-blue-500 font-bold text-xl leading-none select-none hover:text-blue-700 transition-colors focus:outline-none"
                >
                  {tableOpen ? '−' : '+'}
                </button>
              </div>

              {/* Collapsible content */}
              <div
                className={`self-stretch overflow-hidden transition-all duration-300 ease-in-out ${
                  tableOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col items-stretch gap-3 pb-4">
                  {/* Column headers */}
                  <div className="px-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-black/50">No. of Travellers</span>
                    <span className="text-sm font-semibold text-black/50">Price per traveller</span>
                  </div>
                  <div className="w-full h-0 border-t border-blue-500/40" />
                  {tiers.map(({ label, price: tierPrice, id }) => (
                    <div key={id ?? label} className="px-4 flex justify-between items-center gap-2">
                      <span className="text-sm font-normal text-black/50 w-16">{label}</span>
                      <div className="flex-1 border-t border-dotted border-blue-500/50" />
                      <span className="text-sm font-normal text-black/50 text-right">
                        US${tierPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-2 justify-center">
            <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
              INQUIRE NOW
            </Button>
            {/* <Link href="/contact-yama-nepal">
              <Button variant="outline" size="md" className="w-full">
                INQUIRE NOW
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
      <TalkToExpert qrSrc={'/images/shantamagar.jpeg'} />
      <BookingFormModal open={modalOpen} onClose={() => setModalOpen(false)} trekName={trekName} />
    </div>
  )
}
