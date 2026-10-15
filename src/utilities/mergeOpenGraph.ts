import type { Metadata } from 'next'
import { JAPANESE_DESCRIPTION, JAPANESE_SITE_TITLE, resolveSEOImage } from './seo'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: JAPANESE_DESCRIPTION,
  locale: 'ja_JP',
  images: [
    {
      url: resolveSEOImage(),
    },
  ],
  siteName: 'Yama Nepal Trek (ヤマ・ネパール・トレック)',
  title: JAPANESE_SITE_TITLE,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
