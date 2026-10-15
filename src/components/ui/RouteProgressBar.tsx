'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  NAVIGATION_START,
  NAVIGATION_END,
  beginNavigation,
  routeKey,
  type NavigationProgressDetail,
} from '@/utilities/navigationProgress'

function RouteChangeDetector({ onCommit }: { onCommit: (key: string) => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    onCommit(`${pathname}${searchParams.size ? `?${searchParams.toString()}` : ''}`)
  }, [pathname, searchParams, onCommit])
  return null
}

export function RouteProgressBar() {
  const [progress, setProgress] = useState(0)
  const [state, setState] = useState<'idle' | 'loading' | 'complete'>('idle')
  const activeId = useRef<number | null>(null)
  const committedKey = useRef<string | null>(null)
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null)
  const dismiss = useRef<ReturnType<typeof setTimeout> | null>(null)
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (trickle.current) clearInterval(trickle.current)
    if (dismiss.current) clearTimeout(dismiss.current)
    if (watchdog.current) clearTimeout(watchdog.current)
  }, [])

  const finish = useCallback(() => {
    if (activeId.current === null) return
    activeId.current = null
    clearTimers()
    setProgress(1)
    setState('complete')
    dismiss.current = setTimeout(() => {
      setState('idle')
      setProgress(0)
    }, 220)
  }, [clearTimers])

  const onCommit = useCallback(
    (key: string) => {
      const previous = committedKey.current
      committedKey.current = key
      if (previous !== null && previous !== key) finish()
    },
    [finish],
  )

  useEffect(() => {
    const start = (event: Event) => {
      clearTimers()
      activeId.current = (event as CustomEvent<NavigationProgressDetail>).detail.id
      setProgress(0.12)
      setState('loading')
      trickle.current = setInterval(
        () => setProgress((value) => Math.min(0.92, value + (0.95 - value) * 0.12)),
        250,
      )
      // An aborted/offline request may never commit. Reset without pretending
      // that it completed, rather than leaving a stuck bar over later pages.
      watchdog.current = setTimeout(() => {
        activeId.current = null
        clearTimers()
        setState('idle')
        setProgress(0)
      }, 30000)
    }
    const end = (event: Event) => {
      if ((event as CustomEvent<NavigationProgressDetail>).detail.id === activeId.current) finish()
    }
    const onPopState = () => {
      if (routeKey(new URL(window.location.href)) !== committedKey.current) beginNavigation()
    }
    window.addEventListener(NAVIGATION_START, start)
    window.addEventListener(NAVIGATION_END, end)
    window.addEventListener('popstate', onPopState)
    return () => {
      clearTimers()
      window.removeEventListener(NAVIGATION_START, start)
      window.removeEventListener(NAVIGATION_END, end)
      window.removeEventListener('popstate', onPopState)
    }
  }, [clearTimers, finish])

  return (
    <>
      <Suspense fallback={null}>
        <RouteChangeDetector onCommit={onCommit} />
      </Suspense>
      {state !== 'idle' && (
        <div
          className="route-progress"
          data-route-progress={state}
          role="progressbar"
          aria-label="ページを読み込み中"
        >
          <div
            className={`route-progress__bar ${state === 'complete' ? 'route-progress__bar--complete' : ''}`}
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}
    </>
  )
}
