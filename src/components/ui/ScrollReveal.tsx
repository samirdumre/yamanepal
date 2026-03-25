'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  /** IntersectionObserver threshold (0-1). Default 0.15 */
  threshold?: number
  /** Delay before the reveal animation starts, in ms */
  delay?: number
  /** Custom className to merge */
  className?: string
  /** Custom inline style */
  style?: CSSProperties
}

export function ScrollReveal({
  children,
  threshold = 0.15,
  delay = 0,
  className = '',
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add('scroll-reveal--visible'), delay)
          } else {
            el.classList.add('scroll-reveal--visible')
          }
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, delay])

  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </div>
  )
}
