import type { Metadata } from 'next'

export const CANONICAL_BASE_URL = 'https://yamanepaltrek.com'

const stripQueryAndHash = (value: string) => value.split('#')[0]?.split('?')[0] ?? ''

const normalizePathname = (pathname: string = '/') => {
  const raw = stripQueryAndHash(pathname.trim())
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`

  if (withLeadingSlash === '/' || withLeadingSlash.length === 0) {
    return '/'
  }

  return withLeadingSlash.replace(/\/+$/, '')
}

export const buildCanonicalURL = (pathname: string = '/') => {
  const normalized = normalizePathname(pathname)
  return `${CANONICAL_BASE_URL}${normalized === '/' ? '/' : normalized}`
}

export const buildJapaneseAlternates = (pathname: string = '/'): Metadata['alternates'] => {
  const canonical = buildCanonicalURL(pathname)

  return {
    canonical,
    languages: {
      ja: canonical,
      'ja-JP': canonical,
      'x-default': canonical,
    },
  }
}
