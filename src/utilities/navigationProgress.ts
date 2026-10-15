export const NAVIGATION_START = 'yama:navigation-start'
export const NAVIGATION_END = 'yama:navigation-end'
export type NavigationProgressDetail = { id: number }
let sequence = 0

export const routeKey = (url: URL) =>
  `${url.pathname}${url.searchParams.size ? `?${url.searchParams.toString()}` : ''}`

// Hash jumps, external links and the current URL do not load another page.
export function beginNavigation(href?: string, force = false): number | null {
  if (typeof window === 'undefined') return null
  const current = new URL(window.location.href)
  if (href) {
    const target = new URL(href, current)
    if (target.origin !== current.origin) return null
    if (!force && routeKey(target) === routeKey(current)) return null
  }
  const id = ++sequence
  window.dispatchEvent(
    new CustomEvent<NavigationProgressDetail>(NAVIGATION_START, { detail: { id } }),
  )
  return id
}

export function endNavigation(id: number) {
  window.dispatchEvent(
    new CustomEvent<NavigationProgressDetail>(NAVIGATION_END, { detail: { id } }),
  )
}
