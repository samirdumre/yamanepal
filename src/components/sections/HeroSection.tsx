'use client'

import { Search, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from '@/components/ProgressLink'
import { useDebounce } from '@/utilities/useDebounce'

const HeroBackgroundVideo = dynamic(() => import('./HeroBackgroundVideo'), { ssr: false })

interface TrekResult {
  id: number
  name: string
  days: string
  description: string | null
  slug: string | null
  imageUrl: string | null
}

interface HeroSectionProps {
  headline: string
  subheading: string
}

export function HeroSection({ headline, subheading }: HeroSectionProps) {
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TrekResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const abortController = new AbortController()
    let cancelled = false
    setIsLoading(true)

    fetch(`/api/treks/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data: TrekResult[]) => {
        if (!cancelled) {
          setResults(data)
          setIsOpen(true)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      abortController.abort()
    }
  }, [debouncedQuery])

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    )
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection
    if (
      !media.matches ||
      connection?.saveData ||
      /(^|-)2g|3g/.test(connection?.effectiveType ?? '')
    )
      return
    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const enable = () => {
      if ('requestIdleCallback' in window)
        idle = window.requestIdleCallback(() => setVideoEnabled(media.matches), { timeout: 3000 })
      else timer = setTimeout(() => setVideoEnabled(media.matches), 1000)
    }
    const onResize = () => {
      if (!media.matches) setVideoEnabled(false)
    }
    // Decorative video must not compete with the poster or initial page resources.
    if (document.readyState === 'complete') enable()
    else window.addEventListener('load', enable, { once: true })
    media.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('load', enable)
      media.removeEventListener('change', onResize)
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <section
      className="relative w-full h-[500px] md:h-[716px] flex items-start justify-center pt-32 md:pt-44"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <link
          rel="preload"
          as="image"
          href="/images/hero-mobile.avif"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-desktop.avif"
          media="(min-width: 1024px)"
          fetchPriority="high"
        />
        <picture>
          <source media="(max-width: 1023px)" srcSet="/images/hero-mobile.avif" />
          <Image
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            alt=""
            className="object-cover"
            src="/images/hero-desktop.avif"
          />
        </picture>
        {videoEnabled && <HeroBackgroundVideo />}

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1002px] flex flex-col items-center gap-3 md:gap-10 px-5">
        <div className="w-full flex flex-col items-center gap-3">
          <h1 className="w-full font-bold text-center text-[32px] md:text-5xl text-white leading-tight font-sans">
            {headline}
          </h1>
          <p className="w-full lg:text-center font-sans font-medium text-lg text-white">
            {subheading}
          </p>
        </div>

        <div ref={searchWrapperRef} className="relative w-full max-w-[630px]">
          <div className="h-10 pl-4 pr-5 py-1.5 bg-white rounded-lg flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="w-5 h-5 flex-shrink-0 text-slate-950/30 animate-spin" />
            ) : (
              <Search className="w-6 h-6 flex-shrink-0 text-slate-950/30" />
            )}
            <input
              className="flex-1 font-sans text-base text-slate-950 placeholder:text-slate-950/30 outline-none bg-transparent"
              placeholder="トレッキングを検索..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true)
              }}
            />
          </div>

          {isOpen && (
            <div
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-[480px] overflow-y-auto"
              style={{ touchAction: 'pan-y' }}
            >
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  すべてのトリップ
                </span>
              </div>

              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  検索結果がありません。
                </div>
              ) : (
                <ul>
                  {results.map((trek) => (
                    <li key={trek.id}>
                      <Link
                        href={`/treks/${trek.slug ?? ''}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                          {trek.imageUrl ? (
                            <Image
                              src={trek.imageUrl}
                              alt={trek.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {trek.name}
                            {trek.days ? (
                              <span className="font-normal text-slate-500"> - {trek.days}日間</span>
                            ) : null}
                          </p>
                          {trek.description && (
                            <p className="text-xs text-slate-500 truncate">
                              {trek.description.length > 90
                                ? trek.description.slice(0, 90) + '…'
                                : trek.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
