import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'
import { collectionTag } from '@/utilities/cachePolicy'

export const revalidateMedia: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateTag(collectionTag('media'))
  return doc
}

export const revalidateMediaDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) revalidateTag(collectionTag('media'))
  return doc
}
