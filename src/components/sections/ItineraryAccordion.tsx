'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Mountain, MapPin, Utensils, Home } from 'lucide-react'
import Image from 'next/image'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

interface ItineraryPhoto {
  image: { url?: string | null } | number | null
  id?: string | null
}

interface ItineraryDay {
  day: number
  title: string
  description: any
  elevation?: string | null
  distance?: string | null
  meals?: ('breakfast' | 'lunch' | 'dinner')[] | null
  accommodation?: string | null
  photos?: ItineraryPhoto[] | null
}

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[]
}

export function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(null)

  return (
    <div className="flex flex-col">
      {itinerary.map((item, index) => {
        const isOpen = openDay === item.day
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
                className="w-full flex items-start justify-between gap-4 text-left group"
                onClick={() => setOpenDay(isOpen ? null : item.day)}
              >
                <p className="text-lg font-medium leading-7">
                  <span className="text-gray-700">Day {item.day}: </span>
                  <span className="text-gray-800">{item.title}</span>
                </p>
                <span className="flex-shrink-0 mt-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {/* Expandable body */}
              {isOpen && (
                <div className="mt-3 space-y-4">
                  <ConvertRichText
                    data={item.description}
                    className="font-normal text-[16px] text-[#020617] leading-7"
                  />

                  {/* Meta pills */}
                  {(item.elevation ||
                    item.distance ||
                    (item.meals?.length ?? 0) > 0 ||
                    item.accommodation) && (
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
                      {item.meals && item.meals.length > 0 && (
                        <div className="flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1">
                          <Utensils className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs text-gray-700 capitalize">
                            {item.meals.join(', ')}
                          </span>
                        </div>
                      )}
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
                        <img
                          key={i}
                          src={url}
                          alt={`Day ${item.day} photo ${i + 1}`}
                          className="flex-1 h-36 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
