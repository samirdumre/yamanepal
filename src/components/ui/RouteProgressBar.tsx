'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Inner component that uses useSearchParams (must be inside Suspense).
 * Notifies the parent on every route change via a callback.
 */
function RouteChangeDetector({ onChange }: { onChange: (key: string) => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onChange(`${pathname}?${searchParams.toString()}`)
  }, [pathname, searchParams, onChange])

  return null
}

export function RouteProgressBar() {
  const [state, setState] = useState<'idle' | 'loading' | 'complete'>('idle')
  const prevKeyRef = useRef<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleRouteChange = useCallback((key: string) => {
    // Skip the initial mount
    if (prevKeyRef.current === null) {
      prevKeyRef.current = key
      return
    }

    // Same route — no action
    if (prevKeyRef.current === key) return

    prevKeyRef.current = key

    // Route changed — animate
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Show loading bar
    setState('loading')

    // After a brief delay, snap to complete then reset
    timeoutRef.current = setTimeout(() => {
      setState('complete')
      timeoutRef.current = setTimeout(() => {
        setState('idle')
      }, 400)
    }, 150)
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <RouteChangeDetector onChange={handleRouteChange} />
      </Suspense>

      {state !== 'idle' && (
        <div className="route-progress" aria-hidden="true">
          <div
            className={`route-progress__bar ${
              state === 'complete' ? 'route-progress__bar--complete' : ''
            }`}
          />
        </div>
      )}
    </>
  )
}
