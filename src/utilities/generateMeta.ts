import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import {
  japaneseMetadata,
  defaultJapaneseDescription,
  JAPANESE_SITE_TITLE,
  resolveSEOImage,
} from './seo'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object') return resolveSEOImage(image.sizes?.og?.url || image.url)
  return resolveSEOImage()
}

export const generateMeta = async ({
  doc,
  pathname = '/',
}: {
  doc: Partial<Page> | Partial<Post> | null
  pathname?: string
}): Promise<Metadata> => {
  const title =
    doc?.meta?.title ||
    (doc?.title ? `${doc.title} | ヤマ・ネパール・トレック` : JAPANESE_SITE_TITLE)
  const description = doc?.meta?.description || defaultJapaneseDescription(doc)
  const metadata = japaneseMetadata(title, description, pathname)
  const image = getImageURL(doc?.meta?.image)
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [{ url: image }] },
    twitter: { ...metadata.twitter, images: [image] },
  }
}
