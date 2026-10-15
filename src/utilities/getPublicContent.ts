import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type FindOptions } from 'payload'
import type { Config } from '@/payload-types'
import { collectionTag, contentDependencies, CONTENT_REVALIDATE_SECONDS } from './cachePolicy'

type PublicCollection = keyof typeof contentDependencies
type PublicFindOptions<T extends PublicCollection> = Omit<
  FindOptions<T, never>,
  'user' | 'req' | 'context' | 'draft' | 'overrideAccess' | 'showHiddenFields' | 'select'
> & { overrideAccess?: false; select?: Config['collectionsSelect'][T] }

// Only anonymous, access-controlled content may enter the shared Data Cache.
// The complete query is an argument, so filters, depth, select and pagination
// are part of the cache key. Never pass requests, sessions or preview data here.
export async function findPublicContent<T extends PublicCollection>(options: PublicFindOptions<T>) {
  return unstable_cache(
    async (query: PublicFindOptions<T>) => {
      const payload = await getPayload({ config })
      return payload.find({ ...query, draft: false, overrideAccess: false })
    },
    ['public-content-v1'],
    {
      tags: contentDependencies[options.collection].map(collectionTag),
      revalidate: CONTENT_REVALIDATE_SECONDS,
    },
  )(options)
}
