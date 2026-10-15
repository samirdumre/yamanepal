import type { Metadata } from 'next'
import type { Page, Post } from '@/payload-types'
import { lexicalToText } from './lexicalToText'
import { buildCanonicalURL, buildJapaneseAlternates } from './alternates'

export const JAPANESE_SITE_TITLE = 'ネパールトレッキング・ヒマラヤ登山 | ヤマ・ネパール・トレック'
export const JAPANESE_DESCRIPTION =
  '日本語で相談できるネパールトレッキングとヒマラヤ登山。エベレスト、アンナプルナ、ランタンのコースや日程・料金をご案内。ヤマ・ネパール・トレックが旅の計画をお手伝いします。'
export const JAPANESE_KEYWORDS = [
  'ネパール トレッキング',
  'ネパール旅行',
  'ヒマラヤ トレッキング',
  'ネパール 日本語ガイド',
  'エベレストベースキャンプ',
  'アンナプルナ トレッキング',
  'ランタン トレッキング',
  'ヤマ・ネパール・トレック',
]

export const resolveSEOImage = (url?: string | null) =>
  new URL(url || '/images/coverimage.avif', buildCanonicalURL('/')).toString()

export function japaneseMetadata(title: string, description: string, pathname: string): Metadata {
  return {
    title,
    description,
    keywords: JAPANESE_KEYWORDS,
    alternates: buildJapaneseAlternates(pathname),
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      siteName: 'ヤマ・ネパール・トレック',
      title,
      description,
      url: buildCanonicalURL(pathname),
      images: [{ url: resolveSEOImage() }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [resolveSEOImage()] },
  }
}

// Derive a page-specific summary instead of repeating the homepage description
// across every article. Editorial meta descriptions still take precedence.
export function defaultJapaneseDescription(doc: Partial<Page> | Partial<Post> | null): string {
  const content = doc && 'content' in doc ? lexicalToText(doc.content) : ''
  const hero = doc && 'hero' in doc ? lexicalToText(doc.hero?.richText) : ''
  const summary = content || hero
  if (summary && /[\u3040-\u30ff\u3400-\u9fff]/u.test(summary)) {
    const characters = Array.from(summary)
    return characters.length > 150 ? `${characters.slice(0, 150).join('')}…` : summary
  }
  return doc?.title
    ? `${doc.title}。ネパール旅行・ヒマラヤトレッキングの情報を日本語でご案内します。`
    : JAPANESE_DESCRIPTION
}
