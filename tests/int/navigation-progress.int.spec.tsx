import React, { forwardRef } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(() => ({ pathname: '/', search: '' }))
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}))
vi.mock('next/link', () => ({
  default: forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      onNavigate?: (event: { preventDefault: () => void }) => void
    }
  >(function MockLink({ onNavigate, onClick, ...props }, ref) {
    return (
      <a
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event)
          if (
            event.defaultPrevented ||
            event.ctrlKey ||
            event.metaKey ||
            props.target === '_blank' ||
            props.download
          )
            return
          event.preventDefault()
          onNavigate?.({ preventDefault: vi.fn() })
        }}
      />
    )
  }),
}))

import { RouteProgressBar } from '@/components/ui/RouteProgressBar'
import ProgressLink from '@/components/ProgressLink'
import { beginNavigation, endNavigation } from '@/utilities/navigationProgress'

beforeEach(() => {
  vi.useFakeTimers()
  window.history.replaceState({}, '', '/')
  navigation.pathname = '/'
  navigation.search = ''
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
const bar = () => screen.queryByRole('progressbar')

describe('navigation progress', () => {
  it('does not impose an initial loading overlay or artificial delay', () => {
    render(<RouteProgressBar />)
    expect(bar()).toBeNull()
    expect(document.querySelector('.page-loader')).toBeNull()
  })

  it('starts before navigation, stays below 100%, and completes when the route commits', () => {
    const view = render(<RouteProgressBar />)
    act(() => {
      beginNavigation('/treks')
    })
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
    expect(bar()?.firstElementChild?.getAttribute('style')).not.toContain('scaleX(1)')
    navigation.pathname = '/treks'
    view.rerender(<RouteProgressBar />)
    expect(bar()?.getAttribute('data-route-progress')).toBe('complete')
    act(() => {
      vi.advanceTimersByTime(220)
    })
    expect(bar()).toBeNull()
  })

  it('finishes query-only navigation, including search and pagination', () => {
    const view = render(<RouteProgressBar />)
    act(() => {
      beginNavigation('/?q=nepal')
    })
    navigation.search = 'q=nepal'
    view.rerender(<RouteProgressBar />)
    expect(bar()?.getAttribute('data-route-progress')).toBe('complete')
  })

  it('does not start for same-route, hash-only or external destinations', () => {
    render(<RouteProgressBar />)
    act(() => {
      expect(beginNavigation('/')).toBeNull()
      expect(beginNavigation('/#reviews')).toBeNull()
      expect(beginNavigation('https://external.example/treks')).toBeNull()
    })
    expect(bar()).toBeNull()
  })

  it('ignores completion from an older navigation and clears old dismiss timers', () => {
    render(<RouteProgressBar />)
    let first: number | null = null
    let second: number | null = null
    act(() => {
      first = beginNavigation('/posts')
    })
    act(() => {
      second = beginNavigation('/treks')
    })
    act(() => {
      endNavigation(first!)
    })
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
    act(() => {
      endNavigation(second!)
    })
    act(() => {
      beginNavigation('/search')
    })
    act(() => {
      vi.advanceTimersByTime(220)
    })
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
  })

  it('covers browser history navigation and resets an abandoned request', () => {
    render(<RouteProgressBar />)
    act(() => {
      window.history.pushState({}, '', '/treks')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(bar()).toBeNull()
  })

  it('cleans up timers and subscriptions when unmounted', () => {
    const view = render(<RouteProgressBar />)
    act(() => {
      beginNavigation('/treks')
    })
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    view.unmount()
    expect(vi.getTimerCount()).toBe(0)
    act(() => {
      beginNavigation('/posts')
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('starts from a real link navigation and respects a cancelled onNavigate', () => {
    render(
      <>
        <RouteProgressBar />
        <ProgressLink href="/treks">Treks</ProgressLink>
        <ProgressLink href="/posts" onNavigate={(event) => event.preventDefault()}>
          Cancelled
        </ProgressLink>
      </>,
    )
    fireEvent.click(screen.getByText('Cancelled'))
    expect(bar()).toBeNull()
    fireEvent.click(screen.getByText('Treks'))
    expect(bar()?.getAttribute('data-route-progress')).toBe('loading')
  })

  it('does not show progress for modified clicks opening another tab', () => {
    render(
      <>
        <RouteProgressBar />
        <ProgressLink href="/treks">Treks</ProgressLink>
      </>,
    )
    fireEvent.click(screen.getByText('Treks'), { ctrlKey: true })
    expect(bar()).toBeNull()
  })
})
