'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { Trek } from '@/payload-types'

interface TrekFaqAccordionProps {
  faqs: NonNullable<Trek['faqs']>
}

export function TrekFaqAccordion({ faqs }: TrekFaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  const toggleIndex = (i: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="inline-flex flex-col gap-6 w-full">
      <h2 className="text-[#020617] text-2xl font-semibold font-['Inter']">FAQs</h2>

      <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = openIndices.has(i)
          const isLast = i === faqs.length - 1

          return (
            <div key={faq.id ?? i} className={!isLast ? 'border-b border-gray-200' : ''}>
              <button
                className="w-full h-16 px-8 flex justify-between hover:cursor-pointer items-center text-left"
                onClick={() => toggleIndex(i)}
                aria-expanded={isOpen}
              >
                <span className="flex-1 text-base font-['Inter'] leading-6">
                  <span className="text-blue-600 font-semibold">Q{i + 1}.</span>{' '}
                  <span className="text-[#020617] font-medium">{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-8 pb-5">
                    <ConvertRichText
                      data={faq.answer}
                      className="text-[#020617] text-base font-normal font-['Inter'] leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
