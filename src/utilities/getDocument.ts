import type { Config } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { collectionTag, CONTENT_REVALIDATE_SECONDS } from './cachePolicy'

type Collection = 'pages' | 'posts'
export const getCachedDocument = (collection: Collection, id: Config['db']['defaultIDType']) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      return payload.findByID({ collection, id, depth: 0, overrideAccess: false })
    },
    ['redirect-document-v2', collection, String(id)],
    {
      tags: [collectionTag(collection)],
      revalidate: CONTENT_REVALIDATE_SECONDS,
    },
  )
