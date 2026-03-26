import Image from 'next/image'

import { SectionHeading } from '@/components/ui/SectionLabel'

interface GallerySectionProps {
  images: string[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const row1 = images.slice(0, 6)
  const row2 = images.slice(6, 11)

  return (
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
              className="relative aspect-[3/4] rounded overflow-hidden"
            >
              <Image
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                width={400}
                height={533}
                alt={`ギャラリー画像 ${i + 1}`}
                className="w-full h-full object-cover"
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
                className="relative w-52 aspect-[3/4] flex-shrink-0"
              >
                <Image
                  width={208}
                  height={277}
                  sizes="208px"
                  alt={`ギャラリー画像 ${i + 1}`}
                  className="w-full h-full object-cover rounded"
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
                  className="relative w-52 aspect-[3/4] flex-shrink-0"
                >
                  <Image
                    width={208}
                    height={277}
                    sizes="208px"
                    alt={`ギャラリー画像 ${i + 7}`}
                    className="w-full h-full object-cover rounded"
                    src={src}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
