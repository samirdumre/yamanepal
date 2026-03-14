'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

import { SectionHeading } from '@/components/ui/SectionLabel'

interface GallerySectionProps {
  images: string[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const row1 = images.slice(0, 6)
  const row2 = images.slice(6, 11)
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

  useEffect(() => {
    if (selectedIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedIndex])

  return (
    <>
      <section className="max-w-[1340px] mx-auto px-5 md:px-10 py-16">
        <div className="flex flex-col items-center gap-8">
          <SectionHeading
            align="center"
            label="ギャラリー"
            labelPosition="both"
            title="旅人たちの思い出"
          />
          {/* Mobile/Tablet: responsive grid — max 10 images */}
          <div className="xl:hidden w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.slice(0, 10).map((src, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] cursor-pointer rounded overflow-hidden"
                onClick={() => setSelectedIndex(i)}
              >
                <Image
                  fill
                  alt={`ギャラリー画像 ${i + 1}`}
                  className="object-cover hover:opacity-90 transition-opacity"
                  src={src}
                />
              </div>
            ))}
          </div>

          {/* Desktop: original two-row layout */}
          <div className="hidden xl:flex flex-col justify-start items-center gap-4">
            {/* Row 1 — 6 images */}
            <div className="self-stretch inline-flex justify-center items-center gap-4">
              {row1.map((src, i) => (
                <div
                  key={i}
                  className="relative w-52 h-69 flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedIndex(i)}
                >
                  <Image
                    fill
                    alt={`ギャラリー画像 ${i + 1}`}
                    className="object-cover rounded hover:opacity-90 transition-opacity"
                    src={src}
                  />
                </div>
              ))}
            </div>
            {/* Row 2 — 5 images */}
            {row2.length > 0 && (
              <div className="inline-flex justify-center items-center gap-4">
                {row2.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-52 h-69 flex-shrink-0 cursor-pointer"
                    onClick={() => setSelectedIndex(i + 6)}
                  >
                    <Image
                      fill
                      alt={`ギャラリー画像 ${i + 7}`}
                      className="object-cover rounded hover:opacity-90 transition-opacity"
                      src={src}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

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
              aria-label="閉じる"
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
            {/* Transparent backdrop — clicking empty space around the image closes the lightbox */}
            <div className="absolute inset-0" onClick={close} />
            {/* Previous arrow */}
            <button
              aria-label="前の画像"
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
              alt={`ギャラリー画像 ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none"
              src={images[selectedIndex]}
              width={1920}
              height={1080}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next arrow */}
            <button
              aria-label="次の画像"
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
                aria-label={`画像 ${i + 1} に移動`}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                  i === selectedIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
                onClick={() => setSelectedIndex(i)}
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
        </div>
      )}
    </>
  )
}
