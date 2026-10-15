import { JAPANESE_KEYWORDS, resolveSEOImage } from '@/utilities/seo'
import { cache } from 'react'
import { trekCardSelect } from '@/utilities/trekCardSelect'
import { findPublicContent } from '@/utilities/getPublicContent'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from '@/components/ProgressLink'
import type { Region, Trek, Media } from '@/payload-types'
import { TrekCard } from '@/components/cards/TrekCard'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { buildCanonicalURL, buildJapaneseAlternates } from '@/utilities/alternates'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

const getRegionWithTreks = cache(
  async (slug: string): Promise<{ region: Region; treks: Trek[] } | null> => {
    const { docs: regions } = await findPublicContent({
      collection: 'regions',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      depth: 1,
    })

    const region = regions[0] as Region | undefined
    if (!region) return null

    const { docs: treks } = await findPublicContent({
      collection: 'treks',
      where: { region: { equals: region.id } },
      sort: 'name',
      select: trekCardSelect,
      limit: 100,
      pagination: false,
      depth: 1,
    })

    return { region, treks: treks as Trek[] }
  },
)

export async function generateStaticParams() {
  const { docs } = await findPublicContent({
    collection: 'regions',
    limit: 100,
    depth: 0,
  })
  return (docs as Region[]).filter((r) => r.slug).map((r) => ({ slug: r.slug as string }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getRegionWithTreks(slug)
  if (!result) return {}

  const { region } = result
  const url = buildCanonicalURL(`/regions/${slug}`)
  const title = `${region.name} | ヤマ・ネパール・トレック`
  const description =
    region.description ??
    `${region.name}のトレッキングコース・ツアー一覧。日程や料金を比較して、ネパール・ヒマラヤの旅をご検討ください。`

  const regionImage = region.image as Media | null | undefined
  const ogImage = regionImage?.url ? resolveSEOImage(regionImage.url) : undefined

  return {
    title,
    description,
    keywords: [...JAPANESE_KEYWORDS, region.name],
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || resolveSEOImage()],
    },
    alternates: buildJapaneseAlternates(`/regions/${slug}`),
    openGraph: mergeOpenGraph({
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getRegionWithTreks(slug)

  if (!result) return notFound()

  const { region, treks } = result
  const regionImage = region.image as Media | null | undefined

  return (
    <div className="bg-white w-full">
      {/* Hero image */}
      <div className="w-full h-[290px] lg:h-[567px] overflow-hidden relative">
        {regionImage?.url ? (
          <img
            alt={region.name}
            className="absolute h-[290px] w-full lg:h-full object-cover object-center"
            src={regionImage.url}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-6">
          <Link href="/" className="text-[#0cb6d8] text-[14px]">
            ホーム
          </Link>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <Link href="/regions" className="text-[#0cb6d8] text-[14px]">
            地域
          </Link>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#0cb6d8] text-[14px]">{region.name}</span>
        </div>

        {/* Region heading + description */}
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">
            {region.name}
          </h1>
          {region.description && (
            <p className="text-black text-[16px] leading-[29px]">{region.description}</p>
          )}
          <p className="text-[#0cb6d8] text-[14px]">
            {treks.length} {treks.length === 1 ? 'トレッキング' : 'トレッキングコース'} 利用可能
          </p>
        </div>

        {/* Treks grid — max 3 per row */}
        {treks.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            現在、この地域でご案内できるトレッキングコースはありません。
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {treks.map((trek) => (
              <TrekCard
                key={trek.id}
                image={trek.image as Media | string | null}
                name={trek.name}
                days={trek.days}
                difficulty={trek.difficulty}
                price={trek.price}
                slug={trek.slug ?? ''}
                discountedPrice={trek.discountedPrice}
                isLastMinuteDeal={trek.isLastMinuteDeal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
