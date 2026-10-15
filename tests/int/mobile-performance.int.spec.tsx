import React from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({
    fill: _fill,
    unoptimized: _unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; unoptimized?: boolean }) => (
    <img {...props} />
  ),
}))
vi.mock('next/dynamic', () => ({
  default: () =>
    function Video() {
      return <div data-testid="background-video" />
    },
}))
vi.mock('@/components/ProgressLink', () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}))

import { HeroSection } from '@/components/sections/HeroSection'
import HeroBackgroundVideo from '@/components/sections/HeroBackgroundVideo'
import { getMediaImage } from '@/utilities/getMediaImage'

const configureDevice = (eligible: boolean, saveData = false) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: eligible, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
  Object.defineProperty(navigator, 'connection', {
    value: { saveData, effectiveType: '4g' },
    configurable: true,
  })
}
beforeEach(() => {
  vi.useFakeTimers()
  configureDevice(false)
  vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

it('keeps the homepage poster visible and does not load video on mobile or reduced-motion devices', () => {
  render(<HeroSection headline="ネパールの旅" subheading="ご相談ください" />)
  act(() => {
    vi.advanceTimersByTime(15000)
  })
  expect(screen.queryByTestId('background-video')).toBeNull()
  const picture = document.querySelector('picture')!
  expect(picture.querySelector('source')?.getAttribute('srcset')).toBe('/images/hero-mobile.avif')
  expect(picture.querySelector('img')?.getAttribute('fetchpriority')).toBe('high')
  expect(picture.querySelector('img')?.className).toBe('object-cover')
  expect(document.querySelector('script[src*="youtube"]')).toBeNull()
})

it('does not load decorative video when data saver is enabled', () => {
  configureDevice(true, true)
  render(<HeroSection headline="ネパールの旅" subheading="ご相談ください" />)
  act(() => {
    vi.advanceTimersByTime(15000)
  })
  expect(screen.queryByTestId('background-video')).toBeNull()
})

it('defers desktop video until idle and keeps the same poster mounted underneath', () => {
  configureDevice(true)
  let onIdle: IdleRequestCallback | undefined
  vi.stubGlobal(
    'requestIdleCallback',
    vi.fn((callback) => {
      onIdle = callback
      return 1
    }),
  )
  vi.stubGlobal('cancelIdleCallback', vi.fn())
  render(<HeroSection headline="ネパールの旅" subheading="ご相談ください" />)
  const poster = document.querySelector('picture img')
  expect(screen.queryByTestId('background-video')).toBeNull()
  act(() => {
    onIdle?.({ didTimeout: false, timeRemaining: () => 50 })
  })
  expect(screen.queryByTestId('background-video')).not.toBeNull()
  expect(document.querySelector('picture img')).toBe(poster)
  expect(poster?.className).toBe('object-cover')
})

it('disables background video controls and hides the iframe if playback pauses', async () => {
  type Event = { target: FakePlayer; data: number }
  type Options = {
    playerVars: Record<string, string | number>
    events: { onReady: (event: Event) => void; onStateChange: (event: Event) => void }
  }
  let options: Options | undefined
  const instances: FakePlayer[] = []
  class FakePlayer {
    frame = document.createElement('iframe')
    constructor(element: HTMLElement, opts: Options) {
      options = opts
      instances.push(this)
      element.appendChild(this.frame)
      queueMicrotask(() => opts.events.onReady({ target: this, data: -1 }))
    }
    getIframe() {
      return this.frame
    }
    playVideo() {
      options!.events.onStateChange({ target: this, data: 1 })
    }
    destroy() {
      this.frame.remove()
    }
  }
  vi.stubGlobal('YT', { Player: FakePlayer })
  const view = render(<HeroBackgroundVideo />)
  await act(async () => {
    await Promise.resolve()
  })
  const player = instances[0]
  expect(options?.playerVars).toMatchObject({ controls: 0, disablekb: 1, fs: 0, mute: 1, loop: 1 })
  expect(player?.frame.tabIndex).toBe(-1)
  expect(player?.frame.style.pointerEvents).toBe('none')
  expect((view.container.firstChild as HTMLElement).style.opacity).toBe('1')
  act(() => {
    options!.events.onStateChange({ target: player!, data: 2 })
  })
  expect((view.container.firstChild as HTMLElement).style.opacity).toBe('0')
})

describe('CMS image variants', () => {
  it('uses the existing tablet image and versions it for cache revalidation', () => {
    expect(
      getMediaImage({
        url: '/original.webp',
        sizes: { tablet: { url: '/tablet.webp' } },
        updatedAt: '2026-10-15',
      }),
    ).toBe('/tablet.webp?v=2026-10-15')
  })
  it('falls back safely when older media has no generated size', () => {
    expect(getMediaImage({ url: '/original.webp' })).toBe('/original.webp')
    expect(getMediaImage(null)).toBe('')
    expect(getMediaImage('/static.avif')).toBe('/static.avif')
  })
})
