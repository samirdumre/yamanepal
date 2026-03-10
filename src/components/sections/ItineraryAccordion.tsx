'use client'

import { useState } from 'react'
import { ChevronDown, Mountain, Utensils, Home } from 'lucide-react'
import Image from 'next/image'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { Trek } from '@/payload-types'

interface ItineraryAccordionProps {
  itinerary: NonNullable<Trek['itinerary']>
}

export function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set(itinerary.map((item) => item.day)),
  )

  return (
    <div className="flex flex-col">
      {itinerary.map((item, index) => {
        const isOpen = openDays.has(item.day)
        const isLast = index === itinerary.length - 1

        const photos = (item.photos ?? [])
          .slice(0, 3)
          .map((p) => (p.image && typeof p.image === 'object' ? (p.image.url ?? null) : null))
          .filter(Boolean) as string[]

        return (
          <div key={item.day} className="flex gap-4">
            {/* Timeline: dot + connecting line */}
            <div className="flex flex-col items-center flex-shrink-0 w-6">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-400 mt-[7px] flex-shrink-0" />
              {!isLast && <div className="w-0.5 bg-gray-300 flex-1 mt-1" />}
            </div>

            {/* Row content */}
            <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-5'}`}>
              {/* Clickable header */}
              <button
                className="w-full flex items-start justify-between gap-4 text-left group hover:cursor-pointer"
                onClick={() =>
                  setOpenDays((prev) => {
                    const next = new Set(prev)
                    isOpen ? next.delete(item.day) : next.add(item.day)
                    return next
                  })
                }
              >
                <p className="text-lg font-medium leading-7">
                  <span className="text-gray-700 font-medium">Day {item.day}: </span>
                  <span className="text-gray-800 font-medium">{item.title}</span>
                </p>
                <span
                  className={`flex-shrink-0 mt-1 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>

              {/* Expandable body */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 space-y-4">
                    <ConvertRichText
                      data={item.description}
                      className="font-normal text-[16px] text-slate-700 leading-7"
                    />

                    {/* Meta pills */}
                    {(item.elevation || item.distance || item.accommodation || true) && (
                      <div className="flex flex-wrap gap-2">
                        {item.elevation && (
                          <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
                            <Mountain className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-gray-700">{item.elevation}</span>
                          </div>
                        )}
                        {item.distance && (
                          <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
                            <Image
                              src="/images/hiking-icon.svg"
                              alt="Distance"
                              width={16}
                              height={16}
                              className="w-3.5 h-3.5 text-blue-400"
                              style={{
                                WebkitMaskImage: 'url(/images/hiking-icon.svg)',
                                maskImage: 'url(/images/hiking-icon.svg)',
                                WebkitMaskSize: 'contain',
                                maskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                              }}
                            />
                            <span className="text-xs text-gray-700">{item.distance}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
                          <Utensils className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs text-gray-700">Meals Included</span>
                        </div>
                        {item.accommodation && (
                          <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
                            <Home className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-gray-700">{item.accommodation}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Up to 3 day photos */}
                    {photos.length > 0 && (
                      <div className="flex gap-2">
                        {photos.map((url, i) => (
                          <div key={i} className="relative w-1/3 flex-shrink-0 h-36">
                            <Image
                              fill
                              src={url}
                              alt={`Day ${item.day} photo ${i + 1}`}
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
