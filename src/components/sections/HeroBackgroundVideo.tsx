'use client'

import { useEffect, useRef, useState } from 'react'

interface Player {
  playVideo: () => void
  destroy: () => void
  getIframe: () => HTMLIFrameElement
}
type PlayerEvent = { target: Player; data: number }
type YouTubeWindow = Window & {
  YT?: {
    Player: new (
      element: HTMLElement,
      options: {
        host: string
        videoId: string
        playerVars: Record<string, string | number>
        events: {
          onReady: (event: PlayerEvent) => void
          onStateChange: (event: PlayerEvent) => void
        }
      },
    ) => Player
  }
  onYouTubeIframeAPIReady?: () => void
}
let apiReady: Promise<void> | undefined
function loadAPI(): Promise<void> {
  const youtube = window as YouTubeWindow
  if (youtube.YT?.Player) return Promise.resolve()
  if (!apiReady)
    apiReady = new Promise((resolve, reject) => {
      const previous = youtube.onYouTubeIframeAPIReady
      youtube.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve()
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.onerror = () => {
        apiReady = undefined
        reject(new Error('Video unavailable'))
      }
      document.head.appendChild(script)
    })
  return apiReady
}

export default function HeroBackgroundVideo() {
  const container = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    let disposed = false
    let player: Player | undefined
    void loadAPI()
      .then(() => {
        if (disposed || !container.current) return
        const youtube = window as YouTubeWindow
        player = new youtube.YT!.Player(container.current, {
          host: 'https://www.youtube-nocookie.com',
          videoId: 'R_V9gKlZAZc',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            fs: 0,
            rel: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: 'R_V9gKlZAZc',
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              if (disposed) return
              const frame = target.getIframe()
              frame.tabIndex = -1
              frame.setAttribute('aria-hidden', 'true')
              Object.assign(frame.style, {
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
              target.playVideo()
            },
            onStateChange: ({ data }) => {
              if (!disposed) setPlaying(data === 1)
            },
          },
        })
      })
      .catch(() => {
        /* The permanent poster remains visible if video fails. */
      })
    return () => {
      disposed = true
      player?.destroy()
    }
  }, [])
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 motion-reduce:transition-none"
      style={{ opacity: playing ? 1 : 0 }}
    >
      <div ref={container} />
    </div>
  )
}
