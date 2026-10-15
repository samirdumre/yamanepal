import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { collectionTag } from '@/utilities/cachePolicy'

// Tag invalidation also invalidates Full Route Cache entries that consumed it.
export const revalidateRegion: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc
  revalidateTag(collectionTag('regions'))
  revalidateTag('pages-sitemap')
  for (const slug of new Set([doc.slug, previousDoc?.slug])) {
    if (slug) revalidatePath(`/regions/${slug}`)
  }
  return doc
}

export const revalidateRegionDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc
  revalidateTag(collectionTag('regions'))
  revalidateTag('pages-sitemap')
  if (doc.slug) revalidatePath(`/regions/${doc.slug}`)
  return doc
}

export const revalidateHomepage: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc
  revalidateTag('global_homepage')
  revalidatePath('/')
  return doc
}

export const revalidateRelatedContent = (collection: 'categories' | 'users' | 'forms') => {
  const invalidate = () => revalidateTag(collectionTag(collection))
  const afterChange: CollectionAfterChangeHook = ({ doc, req }) => {
    if (!req.context.disableRevalidate) invalidate()
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
    if (!req.context.disableRevalidate) invalidate()
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
