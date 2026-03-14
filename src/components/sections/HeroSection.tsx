'use client'

import { Search, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDebounce } from '@/utilities/useDebounce'

const HERO_IMAGE_SRC = '/images/heromax.jpg'
const HERO_VIDEO_ID = 'R_V9gKlZAZc'

function extractYouTubeId(urlOrId: string): string {
  const shortMatch = urlOrId.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]!
  const longMatch = urlOrId.match(/[?&]v=([^?&]+)/)
  if (longMatch) return longMatch[1]!
  return urlOrId
}

interface YTPlayer {
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getDuration: () => number
  getCurrentTime: () => number
  getIframe: () => HTMLIFrameElement
  getAvailableQualityLevels?: () => string[]
  setPlaybackQuality: (suggestedQuality: string) => void
  setPlaybackQualityRange?: (suggestedQuality: string) => void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (e: { target: YTPlayer }) => void
            onStateChange?: (e: { target: YTPlayer; data: number }) => void
          }
        },
      ) => void
    }
    onYouTubeIframeAPIReady: () => void
  }
}

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
  const [isActive, setIsActive] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)
  const rewindTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  function scheduleRewind(player: YTPlayer) {
    if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current)
    const remaining = player.getDuration() - player.getCurrentTime()
    if (remaining > 0.3) {
      rewindTimerRef.current = setTimeout(() => player.seekTo(0), (remaining - 0.2) * 1000)
    }
  }

  useEffect(() => {
    const isDesktop = () =>
      typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

    const qualityOrder = ['hd1080', 'hd720']

    function forcePreferredQuality(player: YTPlayer) {
      const preferredMinQuality = isDesktop() ? 'hd1080' : 'hd720'
      const available = player.getAvailableQualityLevels?.() ?? []

      // Pick the best available quality that still satisfies the desktop/mobile minimum target.
      const minIndex = qualityOrder.indexOf(preferredMinQuality)
      const chosen = qualityOrder.find((level) => {
        const levelIndex = qualityOrder.indexOf(level)
        return levelIndex >= 0 && levelIndex <= minIndex && available.includes(level)
      })

      const target = chosen ?? preferredMinQuality
      player.setPlaybackQuality(target)
      player.setPlaybackQualityRange?.(target)

      // Re-assert once after startup because YouTube may auto-adjust shortly after play begins.
      setTimeout(() => {
        player.setPlaybackQuality(target)
        player.setPlaybackQualityRange?.(target)
      }, 1200)
    }

    function createPlayer() {
      if (!playerContainerRef.current || playerRef.current) return
      const videoId = extractYouTubeId(HERO_VIDEO_ID)

      new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          cc_load_policy: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target
            forcePreferredQuality(e.target)
            e.target.playVideo()
            const iframe = e.target.getIframe()
            Object.assign(iframe.style, {
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100%',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              touchAction: 'none',
            })
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              forcePreferredQuality(e.target)
              if (!hasStartedRef.current) {
                hasStartedRef.current = true
                setIsActive(true)
              }
              scheduleRewind(e.target)
            }
          },
        },
      })
    }

    function loadAPI() {
      if (window.YT?.Player) {
        createPlayer()
        return
      }
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.()
        createPlayer()
      }
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.async = true
        document.head.appendChild(script)
      }
    }

    loadAPI()

    return () => {
      if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current)
    }
  }, [])

  return (
    <section
      className="relative w-full h-[500px] md:h-[716px] flex items-start justify-center pt-32 md:pt-44"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          fill
          priority
          alt=""
          className={`object-cover transition-opacity duration-500 ${
            isActive ? 'opacity-0' : 'opacity-100'
          }`}
          src={HERO_IMAGE_SRC}
        />

        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-500 pointer-events-none ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div ref={playerContainerRef} className="absolute inset-0 pointer-events-none" />
        </div>

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1002px] flex flex-col items-center gap-3 md:gap-10 px-5">
        <div className="w-full flex flex-col items-center gap-3">
          <h1 className="w-full font-bold text-center text-[32px] md:text-5xl text-white leading-tight font-['Noto_Sans_JP',sans-serif]">
            {headline}
          </h1>
          <p className="w-full lg:text-center font-['Noto_Sans_JP',sans-serif] font-medium text-lg text-white">
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
              className="flex-1 font-['Noto_Sans_JP',sans-serif] text-base text-slate-950 placeholder:text-slate-950/30 outline-none bg-transparent"
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
