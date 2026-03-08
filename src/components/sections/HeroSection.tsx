'use client'

import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const HERO_IMAGE_SRC = '/images/hero1.jpg'
const HERO_VIDEO_ID = 'R_V9gKlZAZc'

function extractYouTubeId(urlOrId: string): string {
  const shortMatch = urlOrId.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]!
  const longMatch = urlOrId.match(/[?&]v=([^?&]+)/)
  if (longMatch) return longMatch[1]!
  return urlOrId
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface YTPlayer {
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getDuration: () => number
  getCurrentTime: () => number
  getIframe: () => HTMLIFrameElement
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

  function scheduleRewind(player: YTPlayer) {
    if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current)
    const remaining = player.getDuration() - player.getCurrentTime()
    if (remaining > 0.3) {
      rewindTimerRef.current = setTimeout(
        () => player.seekTo(0),
        (remaining - 0.2) * 1000,
      )
    }
  }

  useEffect(() => {
    function createPlayer() {
      if (!playerContainerRef.current || playerRef.current) return
      const videoId = extractYouTubeId(HERO_VIDEO_ID)

      new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,       // ← play immediately, no interaction needed
          mute: 1,           // required for autoplay to work in all browsers
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
            // Belt-and-suspenders: call playVideo() in case autoplay was blocked
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
            })
          },
          onStateChange: (e) => {
            if (e.data === 1) { // PLAYING
              if (!hasStartedRef.current) {
                hasStartedRef.current = true
                setIsActive(true) // crossfade only when frames confirmed
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

    // Load immediately on mount — fastest possible startup
    loadAPI()

    return () => {
      if (rewindTimerRef.current) clearTimeout(rewindTimerRef.current)
    }
  }, [])

  return (
    <section className="relative w-full h-[500px] md:h-[716px] flex items-start justify-center pt-32 md:pt-44">
      <div className="absolute inset-0 overflow-hidden">

        {/* Static image — LCP element, stays visible until video is confirmed playing */}
        <Image
          fill
          priority
          alt=""
          className={`object-cover transition-opacity duration-700 ${
            isActive ? 'opacity-0' : 'opacity-100'
          }`}
          src={HERO_IMAGE_SRC}
        />

        {/* Video wrapper — crossfades in on first PLAYING state only */}
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div ref={playerContainerRef} className="absolute inset-0" />
        </div>

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[1002px] flex flex-col items-center gap-10 px-5">
        <div className="w-full flex flex-col items-center gap-4">
          <h1 className="w-full font-['Inter',sans-serif] font-bold text-[36px] md:text-6xl text-white leading-tight">
            {headline}
          </h1>
          <p className="w-full text-center font-['Inter',sans-serif] font-medium text-lg text-white">
            {subheading}
          </p>
        </div>
        <div className="h-10 pl-4 pr-5 py-1.5 bg-white rounded-lg flex items-center gap-3 w-full max-w-[630px]">
          <Search className="w-6 h-6 flex-shrink-0 text-slate-950/30" />
          <input
            className="flex-1 font-['Inter',sans-serif] text-base text-slate-950 placeholder:text-slate-950/30 outline-none bg-transparent"
            placeholder="Search Trips..."
            type="text"
          />
        </div>
      </div>
    </section>
  )
}
