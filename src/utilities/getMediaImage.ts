import type { Media } from '@/payload-types'

type ImageMedia = { url?: string | null; sizes?: Media['sizes']; updatedAt?: string | null }

// Use Payload's already-resized files as the optimizer input. This also bounds
// downloads when a hosting image service passes the original file through.
export function getMediaImage(
  media: ImageMedia | string | number | null | undefined,
  variant: 'thumbnail' | 'tablet' | 'og' = 'tablet',
): string {
  if (typeof media === 'string') return media
  if (!media || typeof media !== 'object') return ''
  const url = media.sizes?.[variant]?.url || media.url || ''
  if (!url || !media.updatedAt) return url
  return `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(media.updatedAt)}`
}
