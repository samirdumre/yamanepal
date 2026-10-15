# Japanese SEO and Vercel caching

## Japanese search metadata

`src/utilities/seo.ts` owns the Japanese title, description, keywords and social metadata defaults. Public HTML already uses `lang="ja"`; social metadata uses `ja_JP`. Static pages have individual Japanese titles and descriptions. Trek and region metadata uses the CMS name and description, with Japanese fallbacks. Page and post metadata preserves editorial SEO fields; otherwise it uses the document title and a summary of Japanese article/hero content, with Japanese defaults when content is missing. Existing English CMS content is not rewritten automatically: review saved names, descriptions, SEO fields and image alt text in Payload and write those in natural Japanese.

Search terms include ネパール トレッキング, ネパール旅行, ヒマラヤ トレッキング and ネパール 日本語ガイド. These reflect the existing services and content, rather than measured keyword volumes. Google ignores the meta keywords tag: relevant Japanese page content, titles, summaries and useful internal links are the main work. Metadata cannot guarantee rankings or display based on a visitor's nationality. No location-based redirects or separate cached versions are needed for this Japanese site.

Canonicals and Japanese alternates use `https://yamanepaltrek.com`. Absolute R2 images remain absolute. Internal search is `noindex,follow`. The sitemap index points to dynamically regenerated pages/treks/regions and posts sitemaps; private API/admin/preview paths are excluded from crawling. Homepage aggregate review count now uses the actual sum rather than a hardcoded count.

## Cache behavior

This project uses Next.js 15 APIs; do not copy Next.js 16 `use cache`/cache profile examples without upgrading first.

| Layer | Policy | Invalidation |
| --- | --- | --- |
| Public CMS queries | Next.js Data Cache, 1 hour fallback | Collection dependency tags |
| Header/footer/homepage globals | 1 hour fallback; slug **and depth** in key | Global tag and populated content dependencies |
| `/treks` directory and `/treks/[slug]` | 1 hour ISR plus shared `collection_treks` tag | Trek edits/deletes invalidate the tag, directory path, and old/new detail paths |
| Public route output | Next.js Full Route Cache / Vercel ISR where statically renderable | Data tag dependencies and affected paths |
| Blog listings | 10 minute route fallback | Post changes/deletions invalidate listing and pagination paths |
| XML sitemaps | 1 hour Data Cache and route fallback | Publish, unpublish, delete, slug and region changes |
| Redirect lookups | 1 hour fallback | Redirect edits/deletions and page/post changes |
| Optimized images | At least 1 hour | Use a new image filename/URL for replacements; upstream Cache-Control can extend the lifetime |
| Preview, admin, mutation APIs, per-request search | No new shared response cache | Existing request-based behavior |

`findPublicContent` only accepts public collections, excludes request/user/context/draft options, and enforces `draft:false` and `overrideAccess:false`. Query arguments include collection, filters, depth, projection and page number in the cache identity. Do not use this helper for authenticated or personalized data. Page/post draft previews use a separate uncached lookup, gated by the preview secret and authenticated preview session. Do not add `force-static` to preview-enabled routes: it would suppress draft cookies.

Collection dependencies are defined in `cachePolicy.ts`. A trek update invalidates trek queries, including homepage deals, navigation lists, regional listings and recommended packages; a region update invalidates region-dependent queries; media updates/deletions invalidate all queries that populate media. Post/page hooks invalidate both old and new slugs, including unpublishing. Category, public author-name and form configuration changes invalidate dependent data. Globals invalidate their own tags. CMS changes on the same Vercel deployment need no webhook secret.

On-demand invalidation marks data/routes stale; regeneration happens on the next request, rather than eagerly warming every route. Time-based expiry serves stale content while refreshing in the background and retries after errors. The fallback is not a guarantee that an already open browser refreshes itself: reload/navigate to see newly published content.

Do not add blanket `public, s-maxage` headers to the application or API routes. Let Next.js/Vercel manage ISR and their RSC/cookie-aware cache behavior. Hashed Next.js static assets already receive long immutable caching. Do not make mutable media URLs immutable.

## Deployment and verification

1. Set Vercel's production `NEXT_PUBLIC_SERVER_URL` to `https://yamanepaltrek.com`, along with valid `DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET` and the existing R2 settings. Use a supported modern Node runtime (Node 22 or 24). `next build` requires readable CMS data to generate pages; database errors should fail the build instead of silently publishing empty pages.
2. Deploy through the normal project workflow. The code changes do not modify Vercel settings or deploy automatically.
3. Open the same public URL repeatedly and inspect `x-vercel-cache` and `x-nextjs-cache` when present. Expect an initial MISS/STALE and subsequent HIT for statically rendered routes. Test production with `next build && next start`, not the development server. Some routes remain dynamic by design, while their public CMS data can still hit the Data Cache.
4. Edit a trek price/discount and confirm the detail page, homepage deals, region listing and navigation update after the next requests. Rename/delete a trek or region and check old URLs and the sitemap. Publish/unpublish/rename a post and verify its detail, listing, homepage feature and sitemap. Edit/delete media and verify dependent image metadata.
5. Confirm an authenticated draft preview updates immediately, that anonymous preview is rejected, and that regular visitors still see published content. Inspect Japanese titles, descriptions, canonicals, social images and sitemap URLs in page source.
6. Submit the sitemap in Google Search Console and request recrawling of important updated pages. Search result changes depend on crawling and indexing.

CMS scripts executed outside Next.js cannot invalidate a live Vercel deployment's cache. Use `context: { disableRevalidate: true }` in offline operations, then redeploy or save affected documents in the deployed CMS. Trek hooks tolerate only Next's specific missing-request-store error for existing seed/migration scripts; other invalidation errors are surfaced. If moving Payload to a separate deployment in future, add an authenticated revalidation webhook to the frontend deployment.

## References

- [Next.js 15 caching](https://nextjs.org/docs/15/app/guides/caching)
- [Next.js 15 unstable_cache](https://nextjs.org/docs/15/app/api-reference/functions/unstable_cache)
- [Next.js 15 ISR](https://nextjs.org/docs/15/app/guides/incremental-static-regeneration)
- [Vercel ISR](https://vercel.com/docs/incremental-static-regeneration)
- [Google-supported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## Navigation progress

The full-screen PageLoader and its minimum display timer have been removed. Public links use `ProgressLink`, which starts the slim top bar through Next.js 15's `onNavigate` event. It preserves normal prefetching and excludes cancelled navigation, new tabs, downloads, external links and same-page anchor jumps. Programmatic navigation uses `useProgressRouter`, including a transition-aware completion signal for refreshes. Path/query commits finish link navigation; popstate covers browser back/forward. Timers are cleared between transitions and on unmount. Failed/abandoned navigation resets after 30 seconds. The bar never blocks interaction and respects reduced-motion preferences.
