'use client'

import { useState, useRef } from 'react'
import { Button } from '../ui/button'

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

export function ContactInquiryForm() {
  const [fields, setFields] = useState<FormFields>(INITIAL)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

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
        body: JSON.stringify({ ...fields, trekName: '', honeypot }),
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

  const inputClass =
    'w-full border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition'

  return (
    <div className="w-full bg-white rounded-sm shadow-md p-8">
      <h2 className="text-[#020617] font-semibold text-2xl mb-6">MAKE AN INQUIRY</h2>

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
            onClick={() => setStatus('idle')}
            className="mt-2 hover:cursor-pointer hover:bg-[#020617]"
          >
            Send Another
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
                placeholder="No. of Travellers*"
                min={1}
                required
                value={fields.noOfTravellers}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <textarea
              className={`${inputClass} resize-none`}
              name="message"
              placeholder="Message*"
              rows={4}
              required
              value={fields.message}
              onChange={handleChange}
            />

            {status === 'error' && (
              <p className="text-red-600 text-sm" role="alert">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === 'submitting'}
              className="mt-2 hover:cursor-pointer disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending...' : 'SEND INQUIRY'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
