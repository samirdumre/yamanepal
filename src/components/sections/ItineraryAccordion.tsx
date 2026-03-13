'use client'

import { useState, useCallback, useEffect } from 'react'
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

  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)

  const closeLightbox = () => setLightbox(null)
  const prevPhoto = () =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : null,
    )
  const nextPhoto = () =>
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : null))

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    else if (e.key === 'ArrowLeft') prevPhoto()
    else if (e.key === 'ArrowRight') nextPhoto()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox, onKeyDown])

  return (
    <>
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
                    <span className="text-gray-700 font-medium">{item.day}日目: </span>
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
                                alt="距離"
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
                            <span className="text-xs text-gray-700">含まれる食事</span>
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
                            <div
                              key={i}
                              className="relative w-1/3 flex-shrink-0 h-36 cursor-pointer"
                              onClick={() => setLightbox({ photos, index: i })}
                            >
                              <Image
                                fill
                                src={url}
                                alt={`${item.day}日目の写真 ${i + 1}`}
                                className="object-cover rounded-lg hover:opacity-90 transition-opacity"
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

      {/* Lightbox modal */}
      {lightbox && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex flex-col bg-black/85"
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 py-3 text-white select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">
              {lightbox.index + 1} / {lightbox.photos.length}
            </span>
            <button
              aria-label="ライトボックスを閉じる"
              className="p-1 rounded hover:cursor-pointer hover:bg-white/10 transition-colors"
              onClick={closeLightbox}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Main image area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0" onClick={closeLightbox} />
            {lightbox.photos.length > 1 && (
              <button
                aria-label="前の画像"
                className="absolute left-4 z-10 hover:cursor-pointer p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <Image
              alt={`画像 ${lightbox.index + 1}`}
              className="max-h-full max-w-full object-contain select-none"
              src={lightbox.photos[lightbox.index]!}
              width={1920}
              height={1080}
              onClick={(e) => e.stopPropagation()}
            />
            {lightbox.photos.length > 1 && (
              <button
                aria-label="次の画像"
                className="absolute right-4 z-10 hover:cursor-pointer p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {lightbox.photos.length > 1 && (
            <div
              className="flex justify-center items-center gap-2 px-6 py-3 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.photos.map((src, i) => (
                <button
                  key={i}
                  aria-label={`写真 ${i + 1} へ移動`}
                  className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                    i === lightbox.index
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  onClick={() => setLightbox((lb) => (lb ? { ...lb, index: i } : null))}
                >
                  <Image
                    alt={`サムネイル ${i + 1}`}
                    className="w-full h-full object-cover"
                    src={src}
                    width={64}
                    height={48}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
