'use client'

import { Search } from 'lucide-react'
import { useRef, useState } from 'react'

// ─── Hardcode your assets here ───────────────────────────────────────────────
const HERO_IMAGE_SRC = '/images/hero1.jpg'
const HERO_VIDEO_ID = 'https://youtu.be/lji8NyYSIrE?si=7SZxRdiMIF584rON' // ← replace with your YouTube video ID
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string
          playerVars?: Record<string, number | string>
          events?: { onReady?: (e: YTPlayerEvent) => void }
        },
      ) => void
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayerEvent {
  target: {
    playVideo: () => void
    getIframe: () => HTMLIFrameElement
  }
}

interface HeroSectionProps {
  headline: string
  subheading: string
}

export function HeroSection({ headline, subheading }: HeroSectionProps) {
  const [isActive, setIsActive] = useState(false)
  const hasInteracted = useRef(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  function activate() {
    if (hasInteracted.current) return
    hasInteracted.current = true

    function createPlayer() {
      if (!playerContainerRef.current) return
      new window.YT.Player(playerContainerRef.current, {
        videoId: HERO_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          playlist: HERO_VIDEO_ID,
        },
        events: {
          onReady: (e) => {
            e.target.playVideo()
            // Make the injected iframe fill the container like object-fit: cover
            const iframe = e.target.getIframe()
            Object.assign(iframe.style, {
              position: 'absolute',
              top: '50%',
              left: '50%',
              // 16:9 cover: whichever dimension is larger wins
              width: '100vw',
              height: '56.25vw',
              minHeight: '100%',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            })
            setIsActive(true)
          },
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }
  }

  return (
    <section
      className="relative w-full h-[500px] md:h-[716px] flex items-start justify-center pt-32 md:pt-44"
      onMouseEnter={activate}
      onTouchStart={activate}
    >
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static image — rendered immediately for a fast LCP */}
        <img
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isActive ? 'opacity-0' : 'opacity-100'
          }`}
          fetchPriority="high"
          loading="eager"
          src={HERO_IMAGE_SRC}
        />

        {/* YouTube player mounts here; crossfades in once the video is ready */}
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          ref={playerContainerRef}
        />

        {/* Dark overlay — sits above both layers */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Foreground content */}
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
