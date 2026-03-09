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

const INITIAL: FormFields = {
  fullName: '',
  email: '',
  phone: '',
  noOfTravellers: '',
  message: '',
}

export function BookingFormModal({ open, onClose, trekName }: BookingFormModalProps) {
  const [fields, setFields] = useState<FormFields>(INITIAL)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus first input when modal opens; restore scroll lock
  useEffect(() => {
    if (!open) return
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
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setFields(INITIAL)
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
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
      aria-label="Make an Inquiry"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
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
            MAKE AN INQUIRY
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
              <p className="text-gray-800 font-semibold text-lg">Inquiry Submitted!</p>
              <p className="text-gray-500 text-sm">
                Thank you for reaching out. Our team will get back to you shortly.
              </p>
              <Button
                variant="primary"
                onClick={onClose}
                className="mt-2 hover:cursor-pointer"
              >
                Close
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
                  <input
                    ref={firstInputRef}
                    className={inputClass}
                    type="text"
                    name="fullName"
                    placeholder="Full Name*"
                    required
                    value={fields.fullName}
                    onChange={handleChange}
                  />
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    placeholder="E-mail*"
                    required
                    value={fields.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Row 2: Mobile + No of Travellers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={inputClass}
                    type="tel"
                    name="phone"
                    placeholder="Mobile*"
                    required
                    value={fields.phone}
                    onChange={handleChange}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    name="noOfTravellers"
                    placeholder="No of Travellers*"
                    min={1}
                    required
                    value={fields.noOfTravellers}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}
                <textarea
                  className={`${inputClass} resize-y min-h-[120px]`}
                  name="message"
                  placeholder="Message*"
                  required
                  value={fields.message}
                  onChange={handleChange}
                />

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-fit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
