import Image from 'next/image'

type ReviewCardProps = {
  rating?: number // 0-5
  text: string
  author: string
  location?: string
  avatarSrc?: string
  avatarAlt?: string
  avatarSize?: number // px, default 48
  className?: string // optional extra sizing for the outer wrapper
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill={filled ? '#FBBC04' : '#D1D5DB'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export default function ReviewCard({
  rating = 5,
  text,
  author,
  location = '',
  avatarSrc,
  avatarAlt = `${author} profile photo`,
  avatarSize = 48,
  className = '',
}: ReviewCardProps) {
  const stars = Math.max(0, Math.min(5, rating))

  // Use slightly tighter padding for very large avatars
  const innerPad = avatarSize >= 96 ? 'p-5 md:p-6' : 'p-5 sm:p-6 md:p-7'

  return (
    <div className={`rounded-xl p-2 sm:p-4 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-[18px] bg-white ${innerPad} shadow-sm ring-1 ring-black/10`}
      >
        {/* Decorative quotes */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 top-1 px-4 text-5xl font-serif text-black/10 select-none"
        >
          “”
        </span>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < stars} />
          ))}
        </div>

        {/* Review text */}
        <p className="mt-2 text-base leading-normal font-sans font-normal text-slate-700">{text}</p>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className="relative overflow-hidden rounded-full ring-2 ring-white shadow shrink-0"
            style={{ width: avatarSize, height: avatarSize }}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={avatarAlt}
                fill
                className="object-cover"
                sizes={`${avatarSize}px`}
              />
            ) : (
              <div className="w-full h-full bg-slate-200" />
            )}
          </div>
          <div>
            <div className="text-lg font-heading font-medium leading-tight text-neutral-900">
              {author}
            </div>
            {location && (
              <div className="text-base font-normal font-heading leading-snug text-neutral-500">
                {location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
