'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'

interface BookingFormModalProps {
  open: boolean
  onClose: () => void
  trekName: string
}

interface FormFields {
  fullName: string
  email: string
  phone: string
  noOfTravellers: string
  message: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL: FormFields = {
  fullName: '',
  email: '',
  phone: '',
  noOfTravellers: '',
  message: '',
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}
  const name = fields.fullName.trim()
  if (!name || name.length < 2 || name.length > 100)
    errors.fullName = 'お名前は2文字以上100文字以下で入力してください。'
  const emailTrimmed = fields.email.trim()
  if (!emailTrimmed || !EMAIL_REGEX.test(emailTrimmed) || emailTrimmed.length > 254)
    errors.email = '有効なメールアドレスを入力してください。'
  const phone = fields.phone.trim()
  if (!phone || phone.length < 7 || phone.length > 20)
    errors.phone = '有効な電話番号を入力してください。'
  const travellers = Number(fields.noOfTravellers)
  if (!fields.noOfTravellers || !Number.isInteger(travellers) || travellers < 1 || travellers > 200)
    errors.noOfTravellers = '参加人数は1〜200の範囲で入力してください。'
  const msg = fields.message.trim()
  if (!msg || msg.length < 10 || msg.length > 2000)
    errors.message = 'お問い合わせ内容は10文字以上2000文字以下で入力してください。'
  return errors
}

export function BookingFormModal({ open, onClose, trekName }: BookingFormModalProps) {
  const [fields, setFields] = useState<FormFields>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus first input when modal opens; restore scroll lock
  useEffect(() => {
    if (!open) return
    setErrors({})
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(() => firstInputRef.current?.focus(), 50)
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, trekName, honeypot }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'エラーが発生しました。もう一度お試しください。')
        setStatus('error')
        return
      }

      setStatus('success')
      setFields(INITIAL)
    } catch {
      setErrorMsg('通信エラーが発生しました。接続状況をご確認のうえ、再度お試しください。')
      setStatus('error')
    }
  }

  if (!open) return null

  const inputClass =
    'w-full border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      aria-modal="true"
      role="dialog"
      aria-label="お問い合わせ"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 text-gray-400 cursor-pointer transition-colors focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-[#020617] font-semibold text-xl tracking-[0.6] mb-6">
            お問い合わせフォーム
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-800 font-semibold text-lg">お問い合わせを受け付けました。</p>
              <p className="text-gray-500 text-sm">
                お問い合わせありがとうございます。担当者より順次ご連絡いたします。
              </p>
              <Button variant="primary" onClick={onClose} className="mt-2 hover:cursor-pointer">
                閉じる
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
              />

              <div className="flex flex-col gap-4">
                {/* Row 1: Full Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={firstInputRef}
                      className={inputClass}
                      type="text"
                      name="fullName"
                      placeholder="お名前*"
                      required
                      value={fields.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      className={inputClass}
                      type="email"
                      name="email"
                      placeholder="メールアドレス*"
                      required
                      value={fields.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2: Mobile + No of Travellers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      className={inputClass}
                      type="tel"
                      name="phone"
                      placeholder="電話番号*"
                      required
                      value={fields.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      className={inputClass}
                      type="number"
                      name="noOfTravellers"
                      placeholder="参加人数*"
                      min={1}
                      required
                      value={fields.noOfTravellers}
                      onChange={handleChange}
                    />
                    {errors.noOfTravellers && (
                      <p className="text-red-500 text-xs mt-1">{errors.noOfTravellers}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    className={`${inputClass} resize-y min-h-[120px]`}
                    name="message"
                    placeholder="お問い合わせ内容*"
                    required
                    value={fields.message}
                    onChange={handleChange}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-fit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? '送信中...' : '送信する'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
