'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

interface FaqItem {
  question: string
  answer: any
  id?: string | null
}

interface TrekFaqAccordionProps {
  faqs: FaqItem[]
}

export function TrekFaqAccordion({ faqs }: TrekFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="inline-flex flex-col gap-6 w-full">
      <h2 className="text-black text-2xl font-semibold font-['Inter']">FAQs</h2>

      <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          const isLast = i === faqs.length - 1

          return (
            <div key={faq.id ?? i} className={!isLast ? 'border-b border-gray-200' : ''}>
              <button
                className="w-full h-16 px-8 flex justify-between items-center text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="flex-1 text-base font-['Inter'] leading-6">
                  <span className="text-blue-600 font-semibold">Q{i + 1}.</span>{' '}
                  <span className="text-gray-800 font-semibold">{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-8 pb-5">
                  <ConvertRichText
                    data={faq.answer}
                    className="text-gray-700 text-base font-normal font-['Inter'] leading-6"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
