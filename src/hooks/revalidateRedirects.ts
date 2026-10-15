import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag, revalidatePath } from 'next/cache'

const invalidate = () => {
  revalidateTag('redirects')
  // A newly added redirect may target a previously cached 404.
  revalidatePath('/[slug]', 'page')
  revalidatePath('/posts/[slug]', 'page')
}
export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) invalidate()
  return doc
}
export const revalidateRedirectDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) invalidate()
  return doc
}
