'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { Button } from '../ui/button'

interface AddReviewFormProps {
  trekId: number
}

const RATING_LABELS: Record<number, string> = {
  1: 'やや不満',
  2: '普通',
  3: '良い',
  4: 'とても良い',
  5: '素晴らしい',
}

type FormErrors = {
  rating?: string
  reviewerName?: string
  reviewText?: string
}

function validate(selectedRating: number, reviewerName: string, reviewText: string): FormErrors {
  const errors: FormErrors = {}
  if (!selectedRating) errors.rating = '星評価を選択してください。'
  const name = reviewerName.trim()
  if (!name || name.length < 2 || name.length > 100)
    errors.reviewerName = 'お名前は2文字以上100文字以下で入力してください。'
  const text = reviewText.trim()
  if (!text || text.length < 10 || text.length > 2000)
    errors.reviewText = '口コミは10文字以上2000文字以下で入力してください。'
  return errors
}

export function AddReviewForm({ trekId }: AddReviewFormProps) {
  const router = useRouter()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewerName, setReviewerName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const activeStar = hoveredStar || selectedRating

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    const validationErrors = validate(selectedRating, reviewerName, reviewText)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
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
        setErrorMsg(data.error ?? '送信に失敗しました。もう一度お試しください。')
        setStatus('error')
        return
      }

      setStatus('success')
      setReviewerName('')
      setReviewText('')
      setSelectedRating(0)
      setHoveredStar(0)
      setErrors({})
      // Refresh server component data to show the new review
      router.refresh()
    } catch {
      setErrorMsg('通信エラーが発生しました。接続状況をご確認のうえ、再度お試しください。')
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-black text-2xl font-semibold ">口コミを投稿</h2>

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
            <p className="text-slate-950 font-semibold text-base ">
              口コミのご投稿ありがとうございます。
            </p>
            <p className="text-gray-500 text-sm ">口コミが正常に投稿されました。</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-cyan-500 text-sm font-medium  hover:underline"
            >
              別の口コミを投稿する
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Star rating selector */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-950 text-sm font-semibold ">
                評価 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHoveredStar(n)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => {
                      setSelectedRating(n)
                      setErrors((prev) => ({ ...prev, rating: undefined }))
                    }}
                    aria-label={`${n}つ星で評価`}
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
                  <span className="ml-2 text-gray-600 text-sm ">{RATING_LABELS[activeStar]}</span>
                )}
              </div>
              {errors.rating && <p className="text-red-500 text-xs mt-1 ">{errors.rating}</p>}
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reviewer-name" className="text-slate-950 text-sm font-semibold ">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(e) => {
                  setReviewerName(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewerName: undefined }))
                }}
                placeholder="例：山田 太郎"
                maxLength={100}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-slate-950  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
              />
              {errors.reviewerName && (
                <p className="text-red-500 text-xs mt-1 ">{errors.reviewerName}</p>
              )}
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="review-text" className="text-slate-950 text-sm font-semibold ">
                口コミ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value)
                  setErrors((prev) => ({ ...prev, reviewText: undefined }))
                }}
                placeholder="このトレックに参加した感想をご記入ください..."
                rows={5}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-slate-950  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition resize-none"
              />
              <span className="text-gray-400 text-xs  text-right">{reviewText.length}/2000</span>
              {errors.reviewText && <p className="text-red-500 text-xs ">{errors.reviewText}</p>}
            </div>

            {/* Error */}
            {(status === 'error' || errorMsg) && (
              <p className="text-red-500 text-sm ">{errorMsg}</p>
            )}

            {/* Submit */}
            <Button
              variant="outline"
              size="sm"
              type="submit"
              disabled={status === 'loading'}
              className="self-start"
            >
              {status === 'loading' ? '送信中…' : '口コミを送信'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
