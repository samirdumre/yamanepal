'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

interface ReviewImage {
  src: string
  alt: string
}

interface ReviewImageGalleryProps {
  images: ReviewImage[]
}

export function ReviewImageGallery({ images }: ReviewImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const total = images.length

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
      {/* Thumbnail grid */}
      <div className="flex gap-2 flex-wrap">
        {images.map((img, idx) => (
          <button
            key={idx}
            aria-label={`View ${img.alt}`}
            className="relative w-32 h-24 rounded-[10px] overflow-hidden shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            onClick={() => setSelectedIndex(idx)}
          >
            <Image
              fill
              src={img.src}
              alt={img.alt}
              className="object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </button>
        ))}
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
            {total > 1 && (
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
            )}

            {/* Active image */}
            <Image
              alt={images[selectedIndex]!.alt}
              className="max-h-full max-w-full object-contain select-none"
              src={images[selectedIndex]!.src}
              width={1920}
              height={1080}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next arrow */}
            {total > 1 && (
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
            )}
          </div>

          {/* Thumbnail strip */}
          {total > 1 && (
            <div
              className="flex justify-center items-center gap-2 px-6 py-3 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  className={`shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                    i === selectedIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <Image
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    src={img.src}
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
