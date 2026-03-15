import type { CollectionAfterDeleteHook, CollectionBeforeDeleteHook } from 'payload'

import type { Header, Homepage, Trek } from '@/payload-types'

type TrekRefValue = number | Trek | null | undefined

const toTrekId = (value: TrekRefValue): number | null => {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object' && typeof value.id === 'number') return value.id
  return null
}

export const cleanupDeletedTrek: CollectionAfterDeleteHook<Trek> = async ({ doc, req }) => {
  const deletedTrekId = toTrekId(doc)

  if (!deletedTrekId) return doc

  return doc
}

export const cleanupTrekReferencesBeforeDelete: CollectionBeforeDeleteHook = async (args) => {
  const { id, req } = args
  const deletedTrekId = typeof id === 'number' ? id : Number(id)

  if (!Number.isFinite(deletedTrekId)) return id

  const homepage = (await req.payload.findGlobal({
    slug: 'homepage',
    depth: 0,
    req,
    overrideAccess: false,
  })) as Homepage

  const tripOfTheMonthTrekId = toTrekId(homepage?.tripOfTheMonth?.trek)

  if (tripOfTheMonthTrekId === deletedTrekId) {
    await req.payload.updateGlobal({
      slug: 'homepage',
      data: {
        tripOfTheMonth: {
          ...(homepage?.tripOfTheMonth ?? {}),
          trek: null,
        },
      },
      req,
      overrideAccess: false,
    })
  }

  const header = (await req.payload.findGlobal({
    slug: 'header',
    depth: 0,
    req,
    overrideAccess: false,
  })) as Header

  const topTreks = header?.topTreksDropdownItems ?? []
  const filteredTopTreks = topTreks
    .filter((item) => {
      const trekId = toTrekId(item?.trek)
      return trekId != null && trekId !== deletedTrekId
    })
    .map((item) => ({
      ...(item?.id ? { id: item.id } : {}),
      trek: toTrekId(item?.trek) as number,
    }))

  if (filteredTopTreks.length !== topTreks.length) {
    await req.payload.updateGlobal({
      slug: 'header',
      data: {
        topTreksDropdownItems: filteredTopTreks,
      },
      req,
      overrideAccess: false,
    })
  }

  const { docs: treks } = await req.payload.find({
    collection: 'treks',
    depth: 0,
    pagination: false,
    limit: 1000,
    select: {
      id: true,
      recommendedTreks: true,
    },
    req,
    overrideAccess: false,
  })

  for (const trek of treks as Array<Pick<Trek, 'id' | 'recommendedTreks'>>) {
    if (typeof trek.id !== 'number' || trek.id === deletedTrekId) continue

    const currentRefs = Array.isArray(trek.recommendedTreks) ? trek.recommendedTreks : []
    const currentIds = currentRefs
      .map((ref) => toTrekId(ref as TrekRefValue))
      .filter(Boolean) as number[]
    const nextIds = currentIds.filter((id) => id !== deletedTrekId)

    if (nextIds.length === currentIds.length) continue

    await req.payload.update({
      collection: 'treks',
      id: trek.id,
      data: {
        recommendedTreks: nextIds,
      },
      req,
      overrideAccess: false,
    })
  }

  return id
}
