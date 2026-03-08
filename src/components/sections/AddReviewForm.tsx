'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { Button } from '../ui/button'

interface AddReviewFormProps {
  trekId: number
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}

export function AddReviewForm({ trekId }: AddReviewFormProps) {
  const router = useRouter()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const activeStar = hoveredStar || selectedRating

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!selectedRating) {
      setErrorMsg('Please select a star rating.')
      return
    }
    if (!reviewerName.trim()) {
      setErrorMsg('Please enter your name.')
      return
    }
    if (!reviewText.trim()) {
      setErrorMsg('Please write your review.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch(`/api/treks/${trekId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: reviewerName.trim(),
          rating: String(selectedRating),
          reviewText: reviewText.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Submission failed. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setReviewerName('')
      setReviewText('')
      setSelectedRating(0)
      setHoveredStar(0)
      // Refresh server component data to show the new review
      router.refresh()
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-black text-2xl font-semibold font-['Inter']">Write a Review</h2>

      <div className="bg-white rounded-2xl outline outline-[0.67px] outline-gray-200 p-5">
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-cyan-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-950 font-semibold text-base font-['Inter']">
              Thank you for your review!
            </p>
            <p className="text-gray-500 text-sm font-['Inter']">
              Your review has been posted successfully.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-cyan-500 text-sm font-medium font-['Inter'] hover:underline"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Star rating selector */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-950 text-sm font-semibold font-['Inter']">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHoveredStar(n)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setSelectedRating(n)}
                    aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                    className="focus:outline-none hover:cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        n <= activeStar
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                ))}
                {activeStar > 0 && (
                  <span className="ml-2 text-gray-600 text-sm font-['Inter']">
                    {RATING_LABELS[activeStar]}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reviewer-name"
                className="text-slate-950 text-sm font-semibold font-['Inter']"
              >
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. John Smith"
                maxLength={100}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-slate-950 font-['Inter'] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              />
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="review-text"
                className="text-slate-950 text-sm font-semibold font-['Inter']"
              >
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience on this trek..."
                rows={5}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-slate-950 font-['Inter'] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition resize-none"
              />
              <span className="text-gray-400 text-xs font-['Inter'] text-right">
                {reviewText.length}/2000
              </span>
            </div>

            {/* Error */}
            {(status === 'error' || errorMsg) && (
              <p className="text-red-500 text-sm font-['Inter']">{errorMsg}</p>
            )}

            {/* Submit */}
            <Button
              variant="outline"
              size="sm"
              type="submit"
              disabled={status === 'loading'}
              className="self-start"
            >
              {' '}
              {status === 'loading' ? 'Submitting…' : 'Submit Review'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
