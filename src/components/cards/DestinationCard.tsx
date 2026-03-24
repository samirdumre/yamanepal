import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'

interface RegionCardProps {
  image: string | Media | number | null
  name: string
  slug: string
  trekCount: number
}

function StarRating() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-6 h-6" fill="#FDC700" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function RegionCard({ image, name, slug, trekCount }: RegionCardProps) {
  const imgSrc = typeof image === 'string' ? image : ((image as Media)?.url ?? '')

  return (
    <Link
      href={`/regions/${slug}`}
      className="relative rounded-lg overflow-hidden h-64 md:h-96 w-full group cursor-pointer block"
    >
      <div className="self-stretch h-64 md:h-96 rounded overflow-hidden flex-shrink-0 relative">
        <Image
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={name}
          className="object-cover group-hover:scale-103 transition-transform duration-300"
          src={imgSrc}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
          <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/50" />
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <div className="flex-1 flex flex-col items-start gap-1 md:gap-2">
          <StarRating />
          <h3 className="font-['Noto_Sans_JP',sans-serif] font-semibold text-xl md:text-2xl text-white">
            {name}
          </h3>
        </div>
        <div className="w-20 h-7 px-5 py-1.5 bg-[#0CB6D8] rounded-lg flex items-center justify-center">
          <span className="font-['Noto_Sans_JP',sans-serif] font-semibold text-base text-white whitespace-nowrap">
            {trekCount} パック
          </span>
        </div>
      </div>
    </Link>
  )
}
