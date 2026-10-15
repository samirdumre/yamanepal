import React from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('next/image', () => ({
  default: ({
    fill: _fill,
    unoptimized: _unoptimized,
    priority: _priority,
    alt = '',
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    unoptimized?: boolean
    priority?: boolean
  }) => <img {...props} alt={alt} />,
}))
import { TrekHeroCollage } from '@/components/sections/TrekHeroCollage'

let sequence = 0
let requests: string[] = []
const fixture = () => ({
  images: [1, 2, 3].map((i) => `/${sequence}/original-${i}.webp`),
  previews: [1, 2, 3].map((i) => `/${sequence}/preview-${i}.webp`),
  thumbnails: [1, 2, 3].map((i) => `/${sequence}/thumb-${i}.webp`),
  trekName: 'Trek',
})

beforeEach(() => {
  sequence++
  requests = []
  vi.useFakeTimers()
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  Object.defineProperty(navigator, 'connection', { value: { saveData: false }, configurable: true })
  vi.stubGlobal(
    'Image',
    class {
      decoding = ''
      fetchPriority = ''
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(value: string) {
        requests.push(value)
      }
      decode() {
        return Promise.resolve()
      }
    },
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

it('opens immediately using previews even while every prefetch is still unresolved', () => {
  const props = fixture()
  render(<TrekHeroCollage {...props} />)
  fireEvent.click(screen.getByRole('button', { name: 'Trekの写真をすべて表示' }))
  expect(screen.getByRole('dialog')).not.toBeNull()
  expect(screen.getByAltText('Trek — 写真 1').getAttribute('src')).toBe(props.previews[0])
  expect(screen.getByAltText('サムネイル 1').getAttribute('src')).toBe(props.thumbnails[0])
  expect(requests.some((url) => url.includes('original'))).toBe(false)
  expect(document.body.style.overflow).toBe('hidden')
})

it('warms on intent, deduplicates requests and only prefetches adjacent previews', () => {
  const props = fixture()
  render(<TrekHeroCollage {...props} />)
  const trigger = screen.getByRole('button', { name: 'Trekの写真をすべて表示' })
  fireEvent.pointerEnter(trigger)
  const count = requests.length
  expect(requests).toContain(props.previews[0])
  expect(requests).toContain(props.previews[1])
  expect(requests).not.toContain(props.images[0])
  fireEvent.pointerEnter(trigger)
  expect(requests.length).toBe(count)
})

it('switches instantly, supports keyboard navigation, and restores focus and body scrolling', () => {
  render(<TrekHeroCollage {...fixture()} />)
  const trigger = screen.getByRole('button', { name: 'Trekの写真をすべて表示' })
  trigger.focus()
  fireEvent.keyDown(trigger, { key: 'Enter' })
  fireEvent.click(screen.getByRole('button', { name: '次の画像' }))
  expect(screen.getByText('2 / 3')).not.toBeNull()
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' })
  expect(screen.getByText('3 / 3')).not.toBeNull()
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.body.style.overflow).toBe('')
  expect(document.activeElement).toBe(trigger)
})

it('supports horizontal swipes without interpreting vertical scrolling as photo navigation', () => {
  render(<TrekHeroCollage {...fixture()} />)
  fireEvent.click(screen.getByRole('button', { name: 'Trekの写真をすべて表示' }))
  const area = screen.getByAltText('Trek — 写真 1').parentElement!.parentElement!
  fireEvent.touchStart(area, { touches: [{ clientX: 250, clientY: 100 }] })
  fireEvent.touchEnd(area, { changedTouches: [{ clientX: 100, clientY: 110 }] })
  expect(screen.getByText('2 / 3')).not.toBeNull()
  fireEvent.touchStart(area, { touches: [{ clientX: 200, clientY: 100 }] })
  fireEvent.touchEnd(area, { changedTouches: [{ clientX: 190, clientY: 300 }] })
  expect(screen.getByText('2 / 3')).not.toBeNull()
})

it('keeps the preview during a delayed desktop upgrade and loads only the selected original', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  const props = fixture()
  render(<TrekHeroCollage {...props} />)
  fireEvent.click(screen.getByRole('button', { name: 'Trekの写真をすべて表示' }))
  expect(requests.some((url) => url.includes('original'))).toBe(false)
  act(() => {
    vi.advanceTimersByTime(500)
  })
  expect(requests.filter((url) => url.includes('original'))).toEqual([props.images[0]])
  expect(screen.getByAltText('Trek — 写真 1').getAttribute('src')).toBe(props.previews[0])
})
