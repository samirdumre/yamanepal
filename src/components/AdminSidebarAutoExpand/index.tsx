'use client'

import { useEffect } from 'react'

const detailsSelector =
  'aside details, nav details, [class*="sidebar"] details, [class*="nav"] details'

function isSidebarDetails(el: HTMLDetailsElement): boolean {
  return Boolean(el.closest('aside, nav, [class*="sidebar"], [class*="nav"]'))
}

function expandSidebarDetails() {
  const details = document.querySelectorAll<HTMLDetailsElement>(detailsSelector)

  details.forEach((el) => {
    if (isSidebarDetails(el) && !el.open) {
      el.open = true
    }
  })
}

export default function AdminSidebarAutoExpand() {
  useEffect(() => {
    expandSidebarDetails()

    const observer = new MutationObserver(() => {
      expandSidebarDetails()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    const onToggle = (event: Event) => {
      const target = event.target

      if (!(target instanceof HTMLDetailsElement)) return
      if (!isSidebarDetails(target)) return
      if (target.open) return

      requestAnimationFrame(() => {
        target.open = true
      })
    }

    document.addEventListener('toggle', onToggle, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('toggle', onToggle, true)
    }
  }, [])

  return null
}
