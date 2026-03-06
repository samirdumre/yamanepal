import Link from 'next/link'
import type { Media } from '@/payload-types'

interface TrekCardProps {
  image: Media | string | null
  name: string
  days: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  price: number
  slug: string
}

const difficultyConfig = {
  Easy: { icon: '/images/easy.png', color: 'text-green-500' },
  Moderate: { icon: '/images/moderate.png', color: 'text-yellow-500' },
  Hard: { icon: '/images/hard.png', color: 'text-red-500' },
}

export function TrekCard({ image, name, days, difficulty, price, slug }: TrekCardProps) {
  const imgSrc = typeof image === 'string' ? image : ((image as Media)?.url ?? '')
  const { icon, color } = difficultyConfig[difficulty] ?? difficultyConfig.Moderate

  return (
    <Link href={`/treks/${slug}`} className="block">
      <div className="w-100 h-full bg-white rounded-lg inline-flex flex-col justify-start items-start gap-4 group cursor-pointer">
        {/* Trek image */}
        <div className="self-stretch h-80 rounded overflow-hidden flex-shrink-0 relative">
          <img
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={imgSrc}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Explore
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          {/* Trek name */}
          <div className="self-stretch text-slate-950 text-2xl font-semibold font-['Inter']">
            {name}
          </div>

          {/* Meta */}
          <div className="flex flex-col justify-start items-start gap-4">
            {/* Days + divider + difficulty */}
            <div className="flex items-center gap-4">
              <span className="text-slate-950 text-base font-normal font-['Inter']">{days}</span>
              <div className="w-px h-5 bg-cyan-500 flex-shrink-0" />
              <div className="flex items-center gap-3">
                <img alt={difficulty} className="w-8 h-5 object-contain flex-shrink-0" src={icon} />
                <span className={`text-base font-normal font-['Inter'] ${color}`}>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="inline-flex justify-start items-center gap-3">
              <span className="text-cyan-500 text-2xl font-bold font-['Inter']">US ${price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
