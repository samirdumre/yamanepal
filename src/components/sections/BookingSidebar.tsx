'use client'

import { useState } from 'react'
import { TalkToExpert } from './TalkToExpert'

interface BookingSidebarProps {
  price: number
  expertQrSrc?: string
}

export function BookingSidebar({ price, expertQrSrc }: BookingSidebarProps) {
  const [tableOpen, setTableOpen] = useState(true)

  const tiers = [
    { label: '1 pax', price },
    { label: '2-4 pax', price: Math.round(price * 0.937) },
    { label: '5-10 pax', price: Math.round(price * 0.893) },
    { label: '11-25 pax', price: Math.round(price * 0.875) },
  ]

  return (
    <div className="sticky top-24 w-full flex flex-col gap-4">
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

          {/* Group discount table */}
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
                {tiers.map(({ label, price: tierPrice }) => (
                  <div key={label} className="px-4 flex justify-between items-center gap-2">
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

          {/* CTA buttons */}
          <button className="self-stretch p-2.5 bg-blue-500 flex justify-center items-center">
            <span className="text-white text-base font-semibold tracking-wide">BOOK NOW</span>
          </button>
          <button className="self-stretch p-2.5 outline outline-1 outline-blue-500 flex justify-center items-center">
            <span className="text-blue-500 text-base font-semibold tracking-wide">INQUIRE NOW</span>
          </button>
        </div>
      </div>
      <TalkToExpert qrSrc={'/images/contact-qr.jpg'} />
    </div>
  )
}
