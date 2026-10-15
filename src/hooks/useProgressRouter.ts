'use client'

import { useRouter as useNextRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useTransition } from 'react'
import { beginNavigation, endNavigation } from '@/utilities/navigationProgress'

export function useRouter() {
  const router = useNextRouter()
  const [isPending, startTransition] = useTransition()
  const pendingId = useRef<number | null>(null)
  const navigate = useCallback(
    (href: string | undefined, operation: () => void, force = false) => {
      const id = beginNavigation(href, force)
      if (id !== null) pendingId.current = id
      startTransition(operation)
    },
    [startTransition],
  )

  // A refresh has no URL change; React's router transition tells us when its
  // server response has committed. IDs prevent an old transition ending a new one.
  useEffect(() => {
    if (!isPending && pendingId.current !== null) {
      endNavigation(pendingId.current)
      pendingId.current = null
    }
  }, [isPending])

  return useMemo(
    () => ({
      ...router,
      push: (...args: Parameters<typeof router.push>) =>
        navigate(args[0], () => router.push(...args)),
      replace: (...args: Parameters<typeof router.replace>) =>
        navigate(args[0], () => router.replace(...args)),
      refresh: () => navigate(undefined, () => router.refresh(), true),
    }),
    [router, navigate],
  )
}
