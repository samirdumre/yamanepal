import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { buildCanonicalURL, buildJapaneseAlternates } from './alternates'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  pathname?: string
}): Promise<Metadata> => {
  const { doc, pathname = '/' } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Yama Nepal Trek | ヤマ・ネパール・トレック'
    : 'Yama Nepal Trek | ヤマ・ネパール・トレック'
  const canonical = buildCanonicalURL(pathname)

  return {
    description: doc?.meta?.description,
    alternates: buildJapaneseAlternates(pathname),
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: canonical,
    }),
    title,
  }
}
