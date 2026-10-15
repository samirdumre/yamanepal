import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Post } from '@/payload-types'
import { collectionTag } from '@/utilities/cachePolicy'

const invalidate = (slugs: Array<string | null | undefined>) => {
  revalidateTag(collectionTag('posts'))
  revalidateTag('posts-sitemap')
  revalidateTag('redirects')
  for (const slug of new Set(slugs)) {
    if (slug) revalidatePath(`/posts/${slug}`)
  }
  revalidatePath('/posts')
  revalidatePath('/posts/page/[pageNumber]', 'page')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req }) => {
  if (
    !req.context.disableRevalidate &&
    (doc._status === 'published' || previousDoc?._status === 'published')
  ) {
    invalidate([doc.slug, previousDoc?.slug])
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req }) => {
  if (!req.context.disableRevalidate) invalidate([doc.slug])
  return doc
}
