'use client'

import NextLink from 'next/link'
import { forwardRef, useRef, type ComponentProps } from 'react'
import { beginNavigation } from '@/utilities/navigationProgress'

// onNavigate is a Next.js 15 public API: it excludes modified clicks, downloads,
// external URLs and prevented clicks, while retaining Next's normal prefetching.
const ProgressLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(
  function ProgressLink({ onNavigate, ...props }, forwardedRef) {
    const anchor = useRef<HTMLAnchorElement | null>(null)
    return (
      <NextLink
        {...props}
        ref={(element) => {
          anchor.current = element
          if (typeof forwardedRef === 'function') return forwardedRef(element)
          else if (forwardedRef) forwardedRef.current = element
        }}
        onNavigate={(event) => {
          let prevented = false
          onNavigate?.({
            preventDefault: () => {
              prevented = true
              event.preventDefault()
            },
          })
          if (!prevented && anchor.current) beginNavigation(anchor.current.href)
        }}
      />
    )
  },
)

export default ProgressLink
