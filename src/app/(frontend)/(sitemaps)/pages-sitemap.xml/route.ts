import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import fs from 'node:fs/promises'
import path from 'node:path'

async function collectFrontendStaticPaths(baseDir: string): Promise<string[]> {
  const staticPaths = new Set<string>()

  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }

      if (!entry.isFile() || entry.name !== 'page.tsx') continue

      const relativeDir = path.relative(baseDir, path.dirname(fullPath))
      const segments = relativeDir
        .split(path.sep)
        .filter(Boolean)
        .filter((segment) => !segment.startsWith('(') && !segment.endsWith(')'))

      // Skip dynamic app routes; they are handled via collection data.
      if (segments.some((segment) => segment.startsWith('[') && segment.endsWith(']'))) {
        continue
      }

      const routePath = segments.length === 0 ? '/' : `/${segments.join('/')}`
      staticPaths.add(routePath)
    }
  }

  await walk(baseDir)
  return Array.from(staticPaths)
}

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const frontendDir = path.join(process.cwd(), 'src', 'app', '(frontend)')
    const staticRoutePaths = await collectFrontendStaticPaths(frontendDir)

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

    const staticSitemap = staticRoutePaths.map((routePath) => ({
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
