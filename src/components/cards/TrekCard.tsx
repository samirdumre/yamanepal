import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface TrekCardProps {
  image: Media | string | null
  name: string
  days: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  price: number
  slug: string
  discountedPrice?: number | null
  isLastMinuteDeal?: boolean | null
}

const difficultyConfig = {
  Easy: { icon: '/images/easy.png', color: 'text-green-500' },
  Moderate: { icon: '/images/moderate.png', color: 'text-yellow-500' },
  Hard: { icon: '/images/hard.png', color: 'text-red-500' },
}

export function TrekCard({
  image,
  name,
  days,
  difficulty,
  price,
  slug,
  discountedPrice,
  isLastMinuteDeal,
}: TrekCardProps) {
  const imgSrc = typeof image === 'string' ? image : ((image as Media)?.url ?? '')
  const { icon, color } = difficultyConfig[difficulty] ?? difficultyConfig.Moderate
  const showDiscount = discountedPrice != null && discountedPrice < price

  return (
    <Link href={`/treks/${slug}`} className="block">
      <div className="w-full h-full bg-white rounded-lg inline-flex flex-col justify-start items-start gap-3 md:gap-4 group cursor-pointer">
        {/* Trek image */}
        <div className="self-stretch h-52 md:h-80 rounded overflow-hidden flex-shrink-0 relative">
          <Image
            fill
            alt={name}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            src={imgSrc}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              詳しく見る
            </span>
          </div>
          {/* Deal badge */}
          {isLastMinuteDeal && (
            <span className="absolute top-3 left-3 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded">
              セール
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="self-stretch flex flex-col justify-start items-start gap-1 md:gap-2">
          {/* Trek name */}
          <div className="self-stretch text-slate-950 text-xl md:text-xl lg:text-2xl font-semibold font-['Noto_Sans_JP']">
            {name}
          </div>

          {/* Meta */}
          <div className="flex flex-col justify-start items-start gap-4">
            {/* Days + divider + difficulty */}
            <div className="flex items-center gap-4">
              <span className="text-slate-950 text-sm md:text-base font-normal font-['Noto_Sans_JP']">
                {days}
              </span>
              <div className="w-px h-5 bg-cyan-500 flex-shrink-0" />
              <div className="flex items-center gap-3">
                <Image
                  alt={difficulty}
                  className="w-5 h-4 md:w-8 md:h-5 object-contain flex-shrink-0"
                  src={icon}
                  width={32}
                  height={20}
                />
                <span className={`text-sm md:text-base font-normal font-['Noto_Sans_JP'] ${color}`}>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="inline-flex justify-start items-center gap-3">
              {showDiscount ? (
                <>
                  <span className="text-cyan-500 text-lg md:text-xl lg:text-2xl font-bold font-['Noto_Sans_JP']">
                    US ${discountedPrice}
                  </span>
                  <span className="text-slate-400 text-base font-normal font-['Noto_Sans_JP'] line-through">
                    US ${price}
                  </span>
                </>
              ) : (
                <span className="text-cyan-500 text-lg md:text-xl lg:text-2xl font-bold font-['Noto_Sans_JP']">
                  US ${price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
