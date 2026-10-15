// Next.js 15 Data Cache tags. Keep these shared by readers and CMS hooks.
export const CONTENT_REVALIDATE_SECONDS = 3600
export const collectionTag = (collection: string) => `collection_${collection}`

export const contentDependencies = {
  treks: ['treks', 'regions', 'categories', 'media'],
  regions: ['regions', 'media'],
  posts: ['posts', 'categories', 'users', 'media'],
  pages: ['pages', 'posts', 'treks', 'regions', 'categories', 'forms', 'media'],
} as const
