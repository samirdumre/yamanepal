import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Region, Trek } from '@/payload-types'

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

export const revalidateMedia: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  const mediaId = typeof doc?.id === 'number' ? doc.id : Number(doc?.id)
  if (!Number.isFinite(mediaId)) return doc

  req.payload.logger.info(`Revalidating media dependencies: ${mediaId}`)

  const { docs } = await req.payload.find({
    collection: 'treks',
    where: {
      or: [{ image: { equals: mediaId } }, { 'gallery.image': { equals: mediaId } }],
    },
    depth: 1,
    pagination: false,
    limit: 1000,
    select: {
      slug: true,
      region: true,
    },
    req,
    overrideAccess: false,
  })

  const regionIds = new Set<number>()
  const regionSlugs = new Set<string>()

  for (const trek of docs as Array<Pick<Trek, 'slug' | 'region'>>) {
    if (typeof trek.slug === 'string' && trek.slug.length > 0) {
      revalidatePath(`/treks/${trek.slug}`)
    }

    const region = trek.region as RegionRelation
    const regionSlug = getRegionSlugFromRelation(region)
    if (regionSlug) regionSlugs.add(regionSlug)

    const regionId = getRegionId(region)
    if (regionId) regionIds.add(regionId)
  }

  for (const regionId of regionIds) {
    try {
      const region = (await req.payload.findByID({
        collection: 'regions',
        id: regionId,
        depth: 0,
        req,
        overrideAccess: false,
      })) as Region

      if (typeof region?.slug === 'string' && region.slug.length > 0) {
        regionSlugs.add(region.slug)
      }
    } catch {
      continue
    }
  }

  for (const slug of regionSlugs) {
    revalidatePath(`/regions/${slug}`)
  }

  revalidateTag('pages-sitemap')

  return doc
}
