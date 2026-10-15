// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import type { Trek, Post, Page } from '@/payload-types'

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  find: vi.fn(),
  findGlobal: vi.fn(),
  cache: vi.fn((fn: (...args: never[]) => unknown, _keys: string[], _options: unknown) => fn),
}))
vi.mock('next/cache', () => ({
  unstable_cache: mocks.cache,
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({
  getPayload: async () => ({ find: mocks.find, findGlobal: mocks.findGlobal }),
}))

import { findPublicContent } from '@/utilities/getPublicContent'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { generateMeta } from '@/utilities/generateMeta'
import { japaneseMetadata, resolveSEOImage } from '@/utilities/seo'
import { revalidateTrek, revalidateTrekAfterDelete } from '@/collections/treks/hooks/revalidateTrek'
import { revalidatePost } from '@/collections/Posts/hooks/revalidatePost'
import { revalidatePage } from '@/collections/Pages/hooks/revalidatePage'
import {
  revalidateHomepage,
  revalidateRegion,
  revalidateRegionDelete,
} from '@/hooks/revalidateContent'
import { revalidateMediaDelete } from '@/hooks/revalidateMedia'
import { revalidateRedirectDelete } from '@/hooks/revalidateRedirects'

type ChangeArgs<T extends Trek | Post | Page = Trek> = Parameters<CollectionAfterChangeHook<T>>[0]
const req = { context: {}, payload: { logger: { info: vi.fn() }, findByID: vi.fn() } }
const args = (doc: object, previousDoc: object = {}) => ({ doc, previousDoc, req })
const tags = () => mocks.revalidateTag.mock.calls.map(([tag]) => tag)
const paths = () => mocks.revalidatePath.mock.calls.map(([path]) => path)

beforeEach(() => {
  vi.clearAllMocks()
  req.context = {}
  mocks.find.mockResolvedValue({ docs: [] })
  mocks.findGlobal.mockResolvedValue({})
})

describe('public cache boundaries', () => {
  it('enforces anonymous published reads and tags populated dependencies', async () => {
    await findPublicContent({
      collection: 'treks',
      where: { slug: { equals: 'everest' } },
      depth: 2,
    })
    expect(mocks.find).toHaveBeenCalledWith(
      expect.objectContaining({ overrideAccess: false, draft: false }),
    )
    expect(mocks.cache).toHaveBeenCalledWith(expect.any(Function), ['public-content-v1'], {
      revalidate: 3600,
      tags: expect.arrayContaining(['collection_treks', 'collection_regions', 'collection_media']),
    })
    // Query arguments, including pagination and filters, reach unstable_cache.
    expect(mocks.find.mock.calls[0][0].where.slug.equals).toBe('everest')
  })

  it('includes population depth in global cache identity and never bypasses access', async () => {
    await getCachedGlobal('header', 0)()
    await getCachedGlobal('header', 2)()
    expect(mocks.cache.mock.calls.map((call) => call[1])).toEqual([
      ['global-v2', 'header', '0'],
      ['global-v2', 'header', '2'],
    ])
    expect(mocks.findGlobal).toHaveBeenLastCalledWith({
      slug: 'header',
      depth: 2,
      overrideAccess: false,
    })
  })
})

describe('CMS revalidation', () => {
  it('refreshes homepage deals, dependencies, old slugs and both regions on trek changes', async () => {
    await revalidateTrek(
      args(
        { slug: 'new', region: { id: 1, slug: 'everest' } },
        { slug: 'old', region: { id: 2, slug: 'langtang' } },
      ) as unknown as ChangeArgs,
    )
    expect(tags()).toEqual(
      expect.arrayContaining([
        'collection_treks',
        'global_homepage',
        'global_header',
        'pages-sitemap',
      ]),
    )
    expect(paths()).toEqual(
      expect.arrayContaining([
        '/',
        '/treks',
        '/treks/new',
        '/treks/old',
        '/regions/everest',
        '/regions/langtang',
      ]),
    )
  })

  it('keeps relationship lookups inside the hook transaction', async () => {
    req.payload.findByID.mockResolvedValue({ slug: 'everest' })
    await revalidateTrek(args({ slug: 'trip', region: 7 }) as unknown as ChangeArgs)
    expect(req.payload.findByID).toHaveBeenCalledWith(
      expect.objectContaining({ req, overrideAccess: false, id: 7 }),
    )
  })

  it('invalidates trek caches on deletion and respects disabled revalidation', async () => {
    await revalidateTrekAfterDelete(
      args({ slug: 'removed' }) as unknown as Parameters<CollectionAfterDeleteHook<Trek>>[0],
    )
    expect(tags()).toContain('collection_treks')
    vi.clearAllMocks()
    req.context = { disableRevalidate: true }
    await revalidateTrek(args({ slug: 'ignored' }) as unknown as ChangeArgs)
    expect(mocks.revalidateTag).not.toHaveBeenCalled()
    expect(mocks.revalidatePath).not.toHaveBeenCalled()
  })

  it.each([
    ['post', revalidatePost, '/posts/old', '/posts/new'],
    ['page', revalidatePage, '/old', '/new'],
  ] as const)(
    'invalidates both published %s paths on a slug change',
    (_name, hook, oldPath, newPath) => {
      hook(
        args({ slug: 'new', _status: 'published' }, { slug: 'old', _status: 'published' }) as never,
      )
      expect(paths()).toEqual(expect.arrayContaining([oldPath, newPath]))
      expect(tags()).toContain('redirects')
    },
  )

  it('removes unpublished posts from listings and cached detail pages', () => {
    revalidatePost(
      args(
        { slug: 'new', _status: 'draft' },
        { slug: 'old', _status: 'published' },
      ) as unknown as ChangeArgs<Post>,
    )
    expect(tags()).toContain('collection_posts')
    expect(paths()).toEqual(
      expect.arrayContaining(['/posts/old', '/posts', '/posts/page/[pageNumber]']),
    )
  })

  it('does not invalidate public posts when editing an unpublished draft', () => {
    revalidatePost(args({ _status: 'draft' }, { _status: 'draft' }) as unknown as ChangeArgs<Post>)
    expect(mocks.revalidateTag).not.toHaveBeenCalled()
  })

  it('covers region edits/deletes, homepage, media deletes and redirect deletes', () => {
    revalidateRegion(
      args({ slug: 'new' }, { slug: 'old' }) as unknown as Parameters<CollectionAfterChangeHook>[0],
    )
    revalidateRegionDelete(
      args({ slug: 'deleted' }) as unknown as Parameters<CollectionAfterDeleteHook>[0],
    )
    revalidateHomepage(args({}) as unknown as Parameters<GlobalAfterChangeHook>[0])
    revalidateMediaDelete(args({}) as unknown as Parameters<CollectionAfterDeleteHook>[0])
    revalidateRedirectDelete(args({}) as unknown as Parameters<CollectionAfterDeleteHook>[0])
    expect(tags()).toEqual(
      expect.arrayContaining([
        'collection_regions',
        'global_homepage',
        'collection_media',
        'redirects',
      ]),
    )
    expect(paths()).toEqual(
      expect.arrayContaining(['/regions/old', '/regions/new', '/regions/deleted', '/']),
    )
  })
})

describe('Japanese SEO', () => {
  it('provides Japanese search terms, canonical and Japanese social metadata', () => {
    const meta = japaneseMetadata('ネパール旅行', '日本語でご相談ください。', '/contact-yama-nepal')
    expect(meta.keywords).toContain('ネパール トレッキング')
    expect(meta.alternates?.canonical).toBe('https://yamanepaltrek.com/contact-yama-nepal')
    expect(meta.openGraph).toMatchObject({ locale: 'ja_JP', title: 'ネパール旅行' })
    expect(meta.twitter).toMatchObject({ title: 'ネパール旅行' })
  })

  it('uses Japanese article text for a unique summary when no SEO description was saved', async () => {
    const meta = await generateMeta({
      doc: {
        title: '旅の準備',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  { text: 'ヒマラヤ旅行の持ち物をご紹介します。', type: 'text', version: 1 },
                ],
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })
    expect(meta.description).toBe('ヒマラヤ旅行の持ち物をご紹介します。')
  })

  it('keeps absolute R2 image URLs intact and resolves relative images', () => {
    expect(resolveSEOImage('https://media.example.jp/everest.jpg')).toBe(
      'https://media.example.jp/everest.jpg',
    )
    expect(resolveSEOImage('/images/coverimage.avif')).toBe(
      'https://yamanepaltrek.com/images/coverimage.avif',
    )
  })

  it('preserves editor metadata without duplicating the brand and supplies Japanese fallbacks', async () => {
    const meta = await generateMeta({
      doc: { meta: { title: '旅の準備 | ヤマ・ネパール・トレック' } },
      pathname: '/preparation',
    })
    expect(meta.title).toBe('旅の準備 | ヤマ・ネパール・トレック')
    expect(meta.description).toContain('日本語')
    expect(meta.twitter).toMatchObject({ title: meta.title, description: meta.description })
  })
})
