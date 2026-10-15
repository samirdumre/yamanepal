'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { prefetchGalleryImage } from '@/utilities/prefetchGalleryImage'

interface Props {
  images: string[]
  previews: string[]
  thumbnails: string[]
  initialIndex: number
  trekName: string
  onClose: () => void
}

function ActivePhoto({
  original,
  preview,
  thumbnail,
  alt,
}: {
  original: string
  preview: string
  thumbnail: string
  alt: string
}) {
  const [ready, setReady] = useState(false)
  const [enhanced, setEnhanced] = useState(false)
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (
      original === preview ||
      !window.matchMedia('(min-width: 1280px)').matches ||
      connection?.saveData
    )
      return
    let disposed = false
    const timer = setTimeout(() => {
      const image = new window.Image()
      image.fetchPriority = 'low'
      image.decoding = 'async'
      image.onload = () => {
        void (image.decode?.() ?? Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (!disposed) setEnhanced(true)
          })
      }
      image.src = original
    }, 500)
    return () => {
      disposed = true
      clearTimeout(timer)
    }
  }, [original, preview])

  return (
    <div className="relative w-full h-full pointer-events-none">
      {!ready && thumbnail !== preview && (
        <Image
          unoptimized
          fill
          src={thumbnail}
          alt=""
          aria-hidden="true"
          className="object-contain blur-sm"
          loading="eager"
        />
      )}
      <Image
        unoptimized
        fill
        src={preview}
        alt={alt}
        className="object-contain select-none"
        loading="eager"
        fetchPriority="high"
        onLoad={() => setReady(true)}
      />
      {enhanced && (
        <Image
          unoptimized
          fill
          src={original}
          alt=""
          aria-hidden="true"
          className="object-contain select-none"
          loading="eager"
        />
      )}
      {!ready && (
        <span className="sr-only" role="status">
          写真を読み込み中
        </span>
      )}
    </div>
  )
}

export function GalleryLightbox({
  images,
  previews,
  thumbnails,
  initialIndex,
  trekName,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex)
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const activeThumb = useRef<HTMLButtonElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const total = images.length
  const move = useCallback(
    (delta: number) => setIndex((value) => (value + delta + total) % total),
    [total],
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  useEffect(() => {
    // Only warm neighbours, never the whole original-resolution gallery.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!connection?.saveData)
      for (const next of [(index + 1) % total, (index - 1 + total) % total]) {
        prefetchGalleryImage(previews[next] || images[next])
        prefetchGalleryImage(thumbnails[next])
      }
    activeThumb.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [index, images, previews, thumbnails, total])

  return (
    <div
      ref={dialog}
      aria-modal="true"
      aria-label={`${trekName}の写真`}
      role="dialog"
      className="fixed inset-0 z-[100] flex h-dvh flex-col bg-black/95"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        }
        if (event.key === 'Tab') {
          const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>('button')
          const first = buttons?.[0],
            last = buttons?.[buttons.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-2 text-white">
        <span className="text-sm tabular-nums" aria-live="polite">
          {index + 1} / {total}
        </span>
        <button
          ref={closeButton}
          aria-label="ライトボックスを閉じる"
          className="flex size-11 items-center justify-center rounded-full hover:bg-white/10"
          onClick={onClose}
        >
          <X className="size-6" />
        </button>
      </div>
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={(event) => {
          const point = event.touches[0]
          if (point) touch.current = { x: point.clientX, y: point.clientY }
        }}
        onTouchEnd={(event) => {
          const start = touch.current,
            end = event.changedTouches[0]
          touch.current = null
          if (!start || !end) return
          const dx = end.clientX - start.x,
            dy = end.clientY - start.y
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.25) move(dx < 0 ? 1 : -1)
        }}
      >
        <div className="absolute inset-0" onClick={onClose} />
        <ActivePhoto
          key={previews[index] || images[index]}
          original={images[index]!}
          preview={previews[index] || images[index]!}
          thumbnail={thumbnails[index] || previews[index] || images[index]!}
          alt={`${trekName} — 写真 ${index + 1}`}
        />
        <button
          aria-label="前の画像"
          onClick={() => move(-1)}
          className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="次の画像"
          onClick={() => move(1)}
          className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
        {images.map((image, item) => (
          <button
            key={image}
            ref={item === index ? activeThumb : undefined}
            aria-label={`画像 ${item + 1} へ移動`}
            aria-current={item === index ? 'true' : undefined}
            className={`relative h-12 w-16 shrink-0 overflow-hidden rounded first:ml-auto last:mr-auto ${item === index ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
            onPointerEnter={() => prefetchGalleryImage(previews[item] || image)}
            onFocus={() => prefetchGalleryImage(previews[item] || image)}
            onClick={() => setIndex(item)}
          >
            <Image
              unoptimized
              fill
              src={thumbnails[item] || previews[item] || image}
              alt={`サムネイル ${item + 1}`}
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
