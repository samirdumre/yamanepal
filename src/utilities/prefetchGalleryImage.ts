const warmed = new Set<string>()

// Use the same versioned CDN URL in the collage, prefetch and lightbox so the
// browser can reuse its memory/disk cache, rather than downloading it again.
export function prefetchGalleryImage(url: string | undefined) {
  if (!url || typeof window === 'undefined' || warmed.has(url)) return
  if (warmed.size >= 48) warmed.delete(warmed.values().next().value!)
  warmed.add(url)
  const image = new window.Image()
  image.decoding = 'async'
  image.fetchPriority = 'low'
  image.onerror = () => warmed.delete(url)
  image.onload = () => {
    void image.decode?.().catch(() => {})
  }
  image.src = url
}
