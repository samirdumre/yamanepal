import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import {
  revalidatePath as nextRevalidatePath,
  revalidateTag as nextRevalidateTag,
} from 'next/cache'
import { collectionTag } from '@/utilities/cachePolicy'
import type { Region, Trek } from '@/payload-types'

// Existing trek migration/seed scripts also use this hook outside Next.js.
// Ignore only the missing request-store error; production invalidation errors surface.
const outsideNext = (error: unknown) =>
  error instanceof Error &&
  error.message.startsWith('Invariant: static generation store missing in ')
const revalidatePath = (...args: Parameters<typeof nextRevalidatePath>) => {
  try {
    nextRevalidatePath(...args)
  } catch (error) {
    if (!outsideNext(error)) throw error
  }
}
const revalidateTag = (...args: Parameters<typeof nextRevalidateTag>) => {
  try {
    nextRevalidateTag(...args)
  } catch (error) {
    if (!outsideNext(error)) throw error
  }
}

type RegionRelation = number | Region | null | undefined

const getRegionId = (value: RegionRelation): number | null => {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'object' && typeof value.id === 'number') return value.id
  return null
}

const getRegionSlugFromRelation = (value: RegionRelation): string | null => {
  if (!value || typeof value === 'number') return null
  if (typeof value.slug === 'string' && value.slug.length > 0) return value.slug
  return null
}

const resolveRegionSlug = async (
  value: RegionRelation,
  req: Parameters<CollectionAfterChangeHook<Trek>>[0]['req'],
): Promise<string | null> => {
  const fromRelation = getRegionSlugFromRelation(value)
  if (fromRelation) return fromRelation

  const regionId = getRegionId(value)
  if (!regionId) return null

  try {
    const region = (await req.payload.findByID({
      collection: 'regions',
      id: regionId,
      depth: 0,
      req,
      overrideAccess: false,
    })) as Region

    return typeof region?.slug === 'string' && region.slug.length > 0 ? region.slug : null
  } catch {
    return null
  }
}

const revalidateRegionPath = (slug: string | null) => {
  if (!slug) return
  revalidatePath(`/regions/${slug}`)
}

const revalidateTrekPath = (slug: string | null | undefined) => {
  if (!slug) return
  revalidatePath(`/treks/${slug}`)
}

export const revalidateTrek: CollectionAfterChangeHook<Trek> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (req.context.disableRevalidate) return doc

  req.payload.logger.info(`Revalidating trek: ${doc.slug ?? doc.id}`)

  revalidateTrekPath(doc.slug)

  const previousSlug = typeof previousDoc?.slug === 'string' ? previousDoc.slug : null
  if (previousSlug && previousSlug !== doc.slug) {
    revalidateTrekPath(previousSlug)
  }

  const [currentRegionSlug, previousRegionSlug] = await Promise.all([
    resolveRegionSlug(doc.region as RegionRelation, req),
    resolveRegionSlug(previousDoc?.region as RegionRelation, req),
  ])

  revalidateRegionPath(currentRegionSlug)
  if (previousRegionSlug !== currentRegionSlug) {
    revalidateRegionPath(previousRegionSlug)
  }

  revalidatePath('/treks')
  revalidateTag(collectionTag('treks'))
  revalidateTag('global_homepage')
  revalidatePath('/')
  revalidateTag('pages-sitemap')
  revalidateTag('global_header')

  return doc
}

export const revalidateTrekAfterDelete: CollectionAfterDeleteHook<Trek> = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  req.payload.logger.info(`Revalidating deleted trek: ${doc?.slug ?? doc?.id}`)

  revalidateTrekPath(doc?.slug)

  const regionSlug = await resolveRegionSlug(doc?.region as RegionRelation, req)
  revalidateRegionPath(regionSlug)

  revalidatePath('/treks')
  revalidateTag(collectionTag('treks'))
  revalidateTag('global_homepage')
  revalidatePath('/')
  revalidateTag('pages-sitemap')
  revalidateTag('global_header')

  return doc
}
