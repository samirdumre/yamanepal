import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { collectionTag, contentDependencies, CONTENT_REVALIDATE_SECONDS } from './cachePolicy'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    overrideAccess: false,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), ['global-v2', slug, String(depth)], {
    tags: [
      `global_${slug}`,
      ...new Set(Object.values(contentDependencies).flat().map(collectionTag)),
    ],
    revalidate: CONTENT_REVALIDATE_SECONDS,
  })
