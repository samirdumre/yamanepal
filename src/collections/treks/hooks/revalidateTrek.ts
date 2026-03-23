import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Region, Trek } from '@/payload-types'

// ✅ Safe wrappers — no-op outside Next.js request context
const safeRevalidatePath = (...args: Parameters<typeof revalidatePath>) => {
  try {
    revalidatePath(...args)
  } catch {
    // Running outside Next.js (e.g. seed scripts) — skip silently
  }
}

const safeRevalidateTag = (...args: Parameters<typeof revalidateTag>) => {
  try {
    revalidateTag(...args)
  } catch {
    // Running outside Next.js (e.g. seed scripts) — skip silently
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
  safeRevalidatePath(`/regions/${slug}`)
}

const revalidateTrekPath = (slug: string | null | undefined) => {
  if (!slug) return
  safeRevalidatePath(`/treks/${slug}`)
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

  safeRevalidateTag('pages-sitemap')
  safeRevalidateTag('global_header')

  return doc
}

export const revalidateTrekAfterDelete: CollectionAfterDeleteHook<Trek> = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  req.payload.logger.info(`Revalidating deleted trek: ${doc?.slug ?? doc?.id}`)

  safeRevalidatePath('/')
  revalidateTrekPath(doc?.slug)

  const regionSlug = await resolveRegionSlug(doc?.region as RegionRelation, req)
  revalidateRegionPath(regionSlug)

  safeRevalidateTag('pages-sitemap')
  safeRevalidateTag('global_header')
  safeRevalidateTag('global_homepage')

  return doc
}
