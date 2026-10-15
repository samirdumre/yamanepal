'use client'

import { useState } from 'react'
import { GalleryLightbox } from './GalleryLightbox'
import { prefetchGalleryImage } from '@/utilities/prefetchGalleryImage'
import Image from 'next/image'
import { Images } from 'lucide-react'

interface TrekHeroCollageProps {
  images: string[]
  previews?: string[]
  thumbnails?: string[]
  trekName: string
}

export function TrekHeroCollage({
  images,
  previews = images,
  thumbnails = previews,
  trekName,
}: TrekHeroCollageProps) {
  const [slot1, slot2, slot3] = previews
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const warm = (index: number) => {
    prefetchGalleryImage(previews[index])
    prefetchGalleryImage(thumbnails[index])
    if (!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      prefetchGalleryImage(previews[(index + 1) % images.length])
  }

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-8">
        <div className="flex gap-2">
          {/* Large left image */}
          <div
            className="flex-2 min-w-0 relative h-[240px] sm:h-[360px] md:h-[480px] cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`${trekName}の写真をすべて表示`}
            onFocus={() => warm(0)}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ' ') && slot1) {
                event.preventDefault()
                setSelectedIndex(0)
              }
            }}
            onPointerEnter={() => warm(0)}
            onPointerDown={() => warm(0)}
            onClick={() => slot1 && setSelectedIndex(0)}
          >
            {slot1 ? (
              <Image
                fill
                unoptimized
                src={slot1}
                alt={trekName}
                priority
                fetchPriority="high"
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1319px) calc(67vw - 54px), 826px"
                className="object-cover rounded-xl hover:opacity-95 transition-opacity"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gray-200" />
            )}
          </div>

          {/* Two stacked right images (hidden on small screens) */}
          {(slot2 || slot3) && (
            <div className="hidden sm:flex flex-1 max-w-[324px] flex-col gap-2 min-w-0">
              {slot2 ? (
                <div
                  className="relative w-full h-[114px] sm:h-[236px] cursor-pointer"
                  onClick={() => setSelectedIndex(1)}
                >
                  <Image
                    fill
                    unoptimized
                    src={slot2}
                    alt={`${trekName} — 写真 2`}
                    sizes="(max-width: 768px) 240px, 324px"
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
                      unoptimized
                      src={slot3}
                      alt={`${trekName} — 写真 3`}
                      sizes="(max-width: 768px) 240px, 324px"
                      className="object-cover rounded-lg hover:opacity-95 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[236px] rounded-lg bg-gray-100" />
                )}
                <button
                  className="absolute bottom-1 lg:bottom-3 hover:cursor-pointer right-1 lg:right-3 z-10 flex items-center gap-1.5 bg-white border border-gray-300 rounded-full px-2 lg:px-3 py-1.5 text-xs md:text-sm font-medium text-slate-950  shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(0)
                  }}
                >
                  <Images className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  すべての写真を見る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedIndex !== null && (
        <GalleryLightbox
          images={images}
          previews={previews}
          thumbnails={thumbnails}
          initialIndex={selectedIndex}
          trekName={trekName}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
