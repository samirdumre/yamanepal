# Mobile rendering and media performance

## Scope

The homepage, `/treks/[slug]`, and `/posts/[slug]` share the rendering improvements. The existing tagged Data Cache and ISR invalidation remain in place.

## Measured baseline

Lighthouse 13.5.0, default mobile simulated throttling, cold browser profile, production domain:

| Page | Performance | FCP | LCP | Blocking time | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | 52 | 1.9s | 10.6s | 530ms | 0.015 | 8,599 KiB |
| `/treks/khopra-danda-trek-12days` | 84 | 2.0s | 4.2s | 70ms | 0 | 1,106 KiB |
| `/posts/annapurna-base-camp-vs-everest-base-camp-which-one-is-best-for-you` | 72 | 2.2s | 7.5s | 130ms | 0 | 1,233 KiB |

Lab numbers vary with network/server conditions. These are template samples rather than promises for every content record or device. Trek gallery behavior is also checked on `/treks/langtang-valley-trek`, which has populated images.

## Changes

- A permanent, server-rendered hero poster replaces the previous image/video visibility handoff. The poster is never hidden, unmounted, or swapped by hydration.
- Mobile uses a 15,161-byte, 828px poster; desktop uses a 54,062-byte poster. Media-qualified preloads ensure a phone does not download both. Only the hero receives high fetch priority; below-the-fold homepage images no longer preload.
- Decorative video loads only on desktop after the initial window load and an idle callback. Reduced-motion, mobile and data-saver devices keep the still image. There is no automatic YouTube request on those devices, or on trek/article pages.
- Video is muted, looping and non-interactive. YouTube controls, fullscreen UI and keyboard controls are disabled. The iframe is transparent until playing and hidden on pause/failure, with the poster underneath.
- Japanese native system fonts replace the web font. This removes the initial font download waterfall and prevents a late font swap. Typography varies slightly with the device's installed Japanese fonts.
- A 192px logo replaces the 1344px source for navigation. Regenerate optimized assets with `node --import=tsx scripts/optimize-critical-images.ts`.
- Trek/article heroes and CMS cards use existing Payload `tablet` derivatives, with a fallback for old uploads. Media update timestamps version the image URL. Hidden mobile collage thumbnails no longer preload.
- Carousel CSS reserves the mobile/tablet/desktop card width before hydration, avoiding the previous initial three-column layout on phones.
- The editor bar is rendered during draft preview rather than loading its authentication UI for every anonymous visitor. CMS authentication and draft preview remain uncached.

## Gallery loading

The lightbox opens synchronously and reuses the exact versioned CDN preview URL already loaded by the collage. Hover, focus and pointer-down warm the first preview and next photo; once open, only adjacent previews are prefetched at low priority. The thumbnail strip uses small Payload thumbnail files, rather than downloading every original. Prefetch URLs are deduplicated with a bounded in-memory set, and the browser/CDN caches can reuse the same URL until the media update timestamp changes.

Mobile displays the tablet preview, with a small blurred thumbnail while a new preview loads. Large desktop screens upgrade only the selected photo to its original resolution after a short delay and successful background decoding. Data-saver connections skip speculative adjacent-image loading. Keyboard arrows, swipe navigation, focus trapping/restoration and scroll locking keep the gallery usable while requests are pending. Older media without derivatives falls back to the existing source.

## Verification

Run the focused Vitest tests, TypeScript checks, import-map generation and production build. Chromium smoke tests check that the homepage hero keeps its geometry and opacity, mobile sends no YouTube or font requests, generated CMS previews load, the full-size gallery still opens/closes, and desktop background controls are disabled.

Repeat Lighthouse against the same three production URLs after deployment using the same version and mobile settings. Monitor real-user Core Web Vitals separately in Search Console; field-data windows do not update immediately after a deployment.
