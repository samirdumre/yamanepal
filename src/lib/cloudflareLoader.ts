import type { ImageLoaderProps } from 'next/image'

const DEFAULT_SITE_ORIGIN = 'https://yamanepaltrek.com'

const getSiteOrigin = (): string => {
  const configuredBase = process.env.NEXT_PUBLIC_SERVER_URL || DEFAULT_SITE_ORIGIN

  try {
    return new URL(configuredBase).origin
  } catch {
    return DEFAULT_SITE_ORIGIN
  }
}

const toAbsoluteSrc = (src: string, siteOrigin: string): string => {
  try {
    return new URL(src).toString()
  } catch {
    return new URL(src, siteOrigin).toString()
  }
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  const siteOrigin = getSiteOrigin()
  const absoluteSrc = toAbsoluteSrc(src, siteOrigin)

  return `${siteOrigin}/cdn-cgi/image/width=${width},format=auto,quality=${quality ?? 75},onerror=redirect/${absoluteSrc}`
}
