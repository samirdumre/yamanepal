import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const REQUIRED_STATIC_PATHS = [
  '/',
  '/about-yama-nepal',
  '/contact-yama-nepal',
  '/how-to-make-payment',
] as const

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const allStaticPaths = Array.from(new Set(REQUIRED_STATIC_PATHS))

    const pagesResult = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const treksResult = await payload.find({
      collection: 'treks',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const regionsResult = await payload.find({
      collection: 'regions',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const staticSitemap = allStaticPaths.map((routePath) => ({
      loc: `${SITE_URL}${routePath}`,
      lastmod: dateFallback,
    }))

    const pageDocsSitemap = pagesResult.docs
      ? pagesResult.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    const trekSitemap = treksResult.docs
      ? treksResult.docs
          .filter((trek) => Boolean(trek?.slug))
          .map((trek) => ({
            loc: `${SITE_URL}/treks/${trek?.slug}`,
            lastmod: trek.updatedAt || dateFallback,
          }))
      : []

    const regionSitemap = regionsResult.docs
      ? regionsResult.docs
          .filter((region) => Boolean(region?.slug))
          .map((region) => ({
            loc: `${SITE_URL}/regions/${region?.slug}`,
            lastmod: region.updatedAt || dateFallback,
          }))
      : []

    const deduped = new Map<string, { loc: string; lastmod: string }>()

    for (const item of [...staticSitemap, ...pageDocsSitemap, ...trekSitemap, ...regionSitemap]) {
      deduped.set(item.loc, item)
    }

    return Array.from(deduped.values())
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
