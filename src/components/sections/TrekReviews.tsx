import type { Trek, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { User } from 'lucide-react'

type Review = NonNullable<Trek['reviews']>[number]

// Format an ISO date string as "11th Jan 2026"
function formatReviewDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''

  const day = d.getUTCDate()
  const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })
  const year = d.getUTCFullYear()

  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? 'th'
      : day % 10 === 1
        ? 'st'
        : day % 10 === 2
          ? 'nd'
          : day % 10 === 3
            ? 'rd'
            : 'th'

  return `${day}${suffix} ${month} ${year}`
}

function StarRow({ rating }: { rating: '1' | '2' | '3' | '4' | '5' }) {
  const filled = parseInt(rating, 10)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-4 h-4 ${n <= filled ? 'text-amber-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 1.5l1.75 3.54 3.91.57-2.83 2.76.67 3.89L8 10.27l-3.5 1.99.67-3.89L2.34 5.61l3.91-.57z" />
        </svg>
      ))}
    </div>
  )
}

interface TrekReviewsProps {
  reviews: Trek['reviews']
}

export function TrekReviews({ reviews }: TrekReviewsProps) {
  if (!reviews || reviews.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-black text-2xl font-semibold font-['Inter']">Travellers&apos; Reviews</h2>

      <div className="flex flex-col gap-4">
        {reviews.map((review: Review) => {
          const images =
            review.images?.filter((img) => img.image && typeof img.image === 'object') ?? []

          return (
            <div
              key={review.id ?? review.reviewerName}
              className="bg-white rounded-2xl outline outline-[0.67px] outline-gray-200 flex flex-col gap-5 p-5"
            >
              {/* Review text */}
              {review.reviewText && (
                <div className="text-gray-700 text-base font-['Inter'] leading-6 [&_strong]:font-semibold [&_strong]:text-slate-950">
                  <RichText
                    data={review.reviewText as any}
                    enableGutter={false}
                    enableProse={false}
                    className="text-gray-700 text-base leading-6"
                  />
                </div>
              )}

              {/* Image gallery */}
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, idx) => {
                    const media = img.image as Media
                    const src = getMediaUrl(media.url)
                    return (
                      <div
                        key={img.id ?? idx}
                        className="w-32 h-24 rounded-[10px] overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={src}
                          alt={media.alt ?? `Review photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Divider + author */}
              <div className="pt-5 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Stars, name, date */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <StarRow rating={review.rating} />
                      {review.ratingLabel && (
                        <span className="text-gray-700 text-sm font-normal font-['Inter'] leading-5">
                          - {review.ratingLabel}
                        </span>
                      )}
                    </div>
                    <span className="text-cyan-500 text-base font-semibold font-['Inter'] leading-6">
                      {review.reviewerName}
                    </span>
                    <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                      {formatReviewDate(review.reviewDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
