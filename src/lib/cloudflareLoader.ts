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

/**
 * Cloudflare Image Resizing loader.
 *
 * cdn-cgi/image/* URLs only work when the page is served through a Cloudflare
 * proxy (orange-cloud). In local development or any non-CF environment the
 * endpoint doesn't exist, so we fall back to returning the plain image URL
 * which Next.js (or the browser) handles normally.
 */
/**
 * Cloudflare Image Resizing loader — optimised for speed & quality.
 *
 * format=auto   → serves WebP / AVIF when the browser supports it
 * metadata=none → strips EXIF/IPTC metadata, reducing file size
 * sharpen=1     → restores sharpness lost during downscaling
 * fit=scale-down→ never upscales (avoids wasted bytes on small originals)
 * onerror=redirect → graceful fallback to original if transform fails
 *
 * cdn-cgi/image/* URLs only work when the page is proxied through Cloudflare
 * (orange-cloud). In local dev / non-CF environments the endpoint doesn't exist,
 * so we fall back to the plain image URL which Next.js handles normally.
 */
export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  const siteOrigin = getSiteOrigin()
  const absoluteSrc = toAbsoluteSrc(src, siteOrigin)

  // Adaptive quality: larger images (hero/banners) get higher quality;
  // thumbnails get a smaller quality value to keep file sizes lean.
  const q = quality ?? (width >= 1200 ? 100 : width >= 600 ? 80 : 75)

  const params = [
    `width=${width}`,
    `format=auto`, // WebP/AVIF — best modern compression
    `quality=${q}`,
    `metadata=none`, // Strip EXIF → smaller files
    `sharpen=1`, // Restore crispness after resize
    `fit=scale-down`, // Never upscale — avoids inflated file sizes
    `onerror=redirect`, // Fallback to original on transform failure
  ].join(',')

  // encodeURIComponent prevents the browser from normalising `https://` to
  // `https:/` when the absolute URL follows the options path segment.
  return `${siteOrigin}/cdn-cgi/image/${params}/${encodeURIComponent(absoluteSrc)}`
}
