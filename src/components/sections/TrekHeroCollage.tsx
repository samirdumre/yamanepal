'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Images } from 'lucide-react'

interface TrekHeroCollageProps {
  images: string[]
  trekName: string
}

export function TrekHeroCollage({ images, trekName }: TrekHeroCollageProps) {
  const [slot1, slot2, slot3] = images
  const total = images.length

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const close = () => setSelectedIndex(null)
  const prev = () => setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))
  const next = () => setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null)
      else if (e.key === 'ArrowLeft')
        setSelectedIndex((i) => (i === null ? 0 : (i - 1 + total) % total))
      else if (e.key === 'ArrowRight') setSelectedIndex((i) => (i === null ? 0 : (i + 1) % total))
    },
    [total],
  )

  useEffect(() => {
    if (selectedIndex === null) return
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex, onKeyDown])

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-8">
        <div className="flex gap-2">
          {/* Large left image */}
          <div
            className="flex-2 min-w-0 relative h-[240px] sm:h-[360px] md:h-[480px] cursor-pointer"
            onClick={() => slot1 && setSelectedIndex(0)}
          >
            {slot1 ? (
              <Image
                fill
                src={slot1}
                alt={trekName}
                className="object-cover rounded-xl hover:opacity-95 transition-opacity"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gray-200" />
            )}
          </div>

          {/* Two stacked right images (hidden on small screens) */}
          {(slot2 || slot3) && (
            <div className="flex flex-1 max-w-[324px] flex-col gap-2 min-w-0">
              {slot2 ? (
                <div
                  className="relative w-full h-[114px] sm:h-[236px] cursor-pointer"
                  onClick={() => setSelectedIndex(1)}
                >
                  <Image
                    fill
                    src={slot2}
                    alt={`${trekName} — photo 2`}
                    className="object-cover rounded-lg hover:opacity-95 transition-opacity"
                  />
                </div>
              ) : (
                <div className="w-full h-[114px] sm:h-[236px] rounded-xl bg-gray-100" />
              )}
              <div className="relative w-full h-[114px] sm:h-[236px]">
                {slot3 ? (
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setSelectedIndex(2)}
                  >
                    <Image
                      fill
                      src={slot3}
                      alt={`${trekName} — photo 3`}
                      className="object-cover rounded-lg hover:opacity-95 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[236px] rounded-lg bg-gray-100" />
                )}
                <button
                  className="absolute bottom-1 lg:bottom-3 hover:cursor-pointer right-1 lg:right-3 z-10 flex items-center gap-1.5 bg-white border border-gray-300 rounded-full px-2 lg:px-3 py-1.5 text-xs md:text-sm font-medium text-slate-950 font-['Inter'] shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(0)
                  }}
                >
                  <Images className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  See All Photos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox modal */}
      {selectedIndex !== null && (
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
              {selectedIndex + 1} / {total}
            </span>
            <button
              aria-label="Close lightbox"
              className="p-1 rounded hover:cursor-pointer hover:bg-white/10 transition-colors"
              onClick={close}
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
            {/* Transparent backdrop — clicking empty space closes the lightbox */}
            <div className="absolute inset-0" onClick={close} />

            {/* Previous arrow */}
            <button
              aria-label="Previous image"
              className="absolute left-4 z-10 hover:cursor-pointer p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                prev()
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

            {/* Active image */}
            <Image
              alt={`${trekName} — photo ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none"
              src={images[selectedIndex]!}
              width={1920}
              height={1080}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next arrow */}
            <button
              aria-label="Next image"
              className="absolute right-4 z-10 hover:cursor-pointer p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                next()
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
          </div>

          {/* Thumbnail strip */}
          <div
            className="flex justify-center items-center gap-2 px-6 py-3 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                  i === selectedIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
                onClick={() => setSelectedIndex(i)}
              >
                <Image
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  src={src}
                  width={64}
                  height={48}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
