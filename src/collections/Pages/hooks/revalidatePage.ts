import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Page } from '@/payload-types'
import { collectionTag } from '@/utilities/cachePolicy'

const invalidate = (slugs: Array<string | null | undefined>) => {
  revalidateTag(collectionTag('pages'))
  revalidateTag('pages-sitemap')
  revalidateTag('redirects')
  for (const slug of new Set(slugs)) {
    if (slug) revalidatePath(slug === 'home' ? '/' : `/${slug}`)
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, previousDoc, req }) => {
  if (
    !req.context.disableRevalidate &&
    (doc._status === 'published' || previousDoc?._status === 'published')
  ) {
    invalidate([doc.slug, previousDoc?.slug])
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req }) => {
  if (!req.context.disableRevalidate) invalidate([doc.slug])
  return doc
}
