'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const MIN_DISPLAY = 800 // ms

    let loaded = false
    let timerDone = false

    function tryDismiss() {
      if (loaded && timerDone) {
        setFadeOut(true)
        // Remove from DOM after fade-out transition
        setTimeout(() => setVisible(false), 500)
      }
    }

    // Minimum display timer
    const timer = setTimeout(() => {
      timerDone = true
      tryDismiss()
    }, MIN_DISPLAY)

    // Window load event (fires when all resources are loaded)
    function onLoad() {
      loaded = true
      tryDismiss()
    }

    if (document.readyState === 'complete') {
      loaded = true
      tryDismiss()
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`page-loader ${fadeOut ? 'page-loader--fade-out' : ''}`} aria-hidden="true">
      <div className="page-loader__content">
        <Image
          src="/images/logo.webp"
          alt=""
          width={80}
          height={80}
          priority
          unoptimized
          className="page-loader__logo"
        />
        <div className="page-loader__dots">
          <span className="page-loader__dot" />
          <span className="page-loader__dot" />
          <span className="page-loader__dot" />
        </div>
      </div>
    </div>
  )
}
