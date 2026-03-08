import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ItineraryAccordion } from '@/components/sections/ItineraryAccordion'
import { TrekHeroCollage } from '@/components/sections/TrekHeroCollage'
import { BookingSidebar } from '@/components/sections/BookingSidebar'
import { TrekStatsCard } from '@/components/sections/TrekStatsCard'
import { TrekAddonsCard } from '@/components/sections/TrekAddonsCard'
import { TrekFaqAccordion } from '@/components/sections/TrekFaqAccordion'
import { TrekReviews } from '@/components/sections/TrekReviews'
import { AddReviewForm } from '@/components/sections/AddReviewForm'
import { TrekSectionNav } from '@/components/sections/TrekSectionNav'
import { RecommendedTreks } from '@/components/sections/RecommendedTreks'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Trek, Media, Category } from '@/payload-types'
import { lexicalToText } from '@/utilities/lexicalToText'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { Check, X, ChevronRight, Star, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getTrek(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'treks',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] as Trek | undefined
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const trek = await getTrek(slug)
  if (!trek) return {}

  const serverUrl = getServerSideURL()
  const url = `${serverUrl}/treks/${slug}`

  const description =
    trek.description || lexicalToText(trek.overview) || `Explore the ${trek.name} with Yama Nepal.`

  const trekImage = trek.image as Media | null | undefined
  const ogImage = trekImage?.url ? serverUrl + trekImage.url : undefined

  const title = `${trek.name} | Yama Nepal`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      title,
      description,
      url,
      images: ogImage ? [{ url: ogImage }] : undefined,
    }),
  }
}

export default async function TrekDetailPage({ params }: PageProps) {
  const { slug } = await params
  const trek = await getTrek(slug)
  if (!trek) notFound()

  function imgUrl(img: Media | number | null | undefined): string | null {
    if (!img || typeof img !== 'object') return null
    return (img as Media).url ?? null
  }

  const galleryImages = (trek.gallery ?? [])
    .map((g) => imgUrl(g.image as Media))
    .filter((s): s is string => Boolean(s))

  const fallbackImage = imgUrl(trek.image as Media)
  const allImages: string[] =
    galleryImages.length > 0 ? galleryImages : fallbackImage ? [fallbackImage] : []

  const category = trek.category as Category | null | undefined
  const categoryTitle = category && typeof category === 'object' ? category.title : null
  const categorySlug = category && typeof category === 'object' ? category.slug : null
  const rating = trek.rating
  const reviewCount = trek.reviewCount

  // ── JSON-LD structured data ─────────────────────────────────────────────
  const serverUrl = getServerSideURL()
  const trekUrl = `${serverUrl}/treks/${slug}`

  const metaDescription =
    trek.description || lexicalToText(trek.overview) || `Explore the ${trek.name} with Yama Nepal.`

  const touristTripSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trek.name,
    description: metaDescription,
    url: trekUrl,
    image: allImages.length > 0 ? allImages : undefined,
    offers: {
      '@type': 'Offer',
      price: String(trek.price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: trekUrl,
    },
    ...(trek.rating != null && trek.reviewCount != null
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: trek.rating,
            reviewCount: trek.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...((trek.itinerary ?? []).length > 0
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: (trek.itinerary ?? []).length,
            itemListElement: (trek.itinerary ?? []).map((item) => ({
              '@type': 'ListItem',
              position: item.day,
              item: {
                '@type': 'TouristAttraction',
                name: `Day ${item.day}: ${item.title}`,
                description: lexicalToText(item.description),
              },
            })),
          },
        }
      : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${serverUrl}/` },
      ...(categorySlug
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: categoryTitle ?? 'Trekking',
              item: `${serverUrl}/treks?category=${categorySlug}`,
            },
            { '@type': 'ListItem', position: 3, name: trek.name },
          ]
        : [{ '@type': 'ListItem', position: 2, name: trek.name }]),
    ],
  }

  const faqSchema =
    (trek.faqs ?? []).length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (trek.faqs ?? []).map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: lexicalToText(faq.answer),
            },
          })),
        }
      : null
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen font-['Inter',sans-serif] bg-gradient-to-b from-[#fdfcff] to-white">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* ── Hero: first 3 shown in collage, all images accessible in lightbox ── */}
      <TrekHeroCollage images={allImages} trekName={trek.name} />

      {/* ── Sticky section nav ── */}
      <TrekSectionNav />

      {/* ── Two-column layout: sidebar now aligns with title ── */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: breadcrumb + title + main content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 mt-4">
              <Link href="/" className="text-cyan-500 text-sm hover:underline">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              {categorySlug ? (
                <Link
                  href={`/treks?category=${categorySlug}`}
                  className="text-cyan-500 text-sm hover:underline"
                >
                  {categoryTitle ?? 'Trekking'}
                </Link>
              ) : (
                <span className="text-cyan-500 text-sm">Trekking</span>
              )}
              <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <span className="text-cyan-500 text-sm">{trek.name}</span>
            </nav>
            {/* Title + star rating */}
            <div className="mt-3 mb-5">
              <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#020617]">
                {trek.name}
              </h1>

              {rating != null && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-[#020617]">
                    {rating}/5{reviewCount != null ? ` from ${reviewCount} Reviews` : ''}
                  </span>
                </div>
              )}
            </div>
            {/* Overview */}
            {trek.overview && (
              <section id="overview" className="mb-6 scroll-mt-16">
                <RichText
                  data={trek.overview as DefaultTypedEditorState}
                  enableGutter={false}
                  enableProse={false}
                  className="font-normal text-base text-[#020617] leading-7"
                />
              </section>
            )}
            {/* Trek Stats Card */}
            <div className="mb-10">
              <TrekStatsCard trek={trek} />
            </div>
            {/* Highlights */}
            {trek.highlights && trek.highlights.length > 0 && (
              <section className="mb-10" id="highlights">
                <h2 className="font-['Inter'] font-semibold text-2xl text-[#020617] mb-2.5">
                  Highlights
                </h2>
                <div className="flex flex-col gap-2">
                  {(trek.highlights ?? []).map((h, i) => (
                    <div key={h.id ?? i} className="flex justify-center items-start gap-2">
                      <ArrowRight className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                      <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                        <RichText
                          data={h.text as DefaultTypedEditorState}
                          enableGutter={false}
                          enableProse={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Detailed Overview */}
            {trek.detailedOverview && (
              <section className="mb-10">
                <h2 className="font-['Inter'] font-semibold text-2xl text-[#020617] mb-4">
                  Detailed Overview
                </h2>
                <RichText
                  data={trek.detailedOverview as DefaultTypedEditorState}
                  enableGutter={false}
                  enableProse={true}
                  className="max-w-none text-[#020617]"
                />
              </section>
            )}
            {/* Itinerary Accordion */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <section id="itinerary" className="mb-12 scroll-mt-16">
                <h2 className="font-['Inter',sans-serif] font-semibold text-[28px] text-[#020617] mb-6">
                  Day-by-Day Itinerary
                </h2>
                <ItineraryAccordion itinerary={trek.itinerary!} />
              </section>
            )}
            {/* Includes / Excludes */}
            <section id="inclusions" className="mb-12 flex flex-col gap-10 scroll-mt-16">
              {trek.includes && trek.includes.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                  <h3 className="text-[#020617] text-xl font-semibold font-['Inter']">
                    Cost Includes
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {(trek.includes ?? []).map((inc, i) => (
                      <li key={inc.id ?? i} className="flex items-start gap-2">
                        <Check className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                          <RichText
                            data={inc.text as DefaultTypedEditorState}
                            enableGutter={false}
                            enableProse={false}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {trek.excludes && trek.excludes.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                  <h3 className="text-[#020617] text-xl font-semibold font-['Inter']">
                    Cost Excludes
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {(trek.excludes ?? []).map((exc, i) => (
                      <li key={exc.id ?? i} className="flex items-start gap-2">
                        <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                          <RichText
                            data={exc.text as DefaultTypedEditorState}
                            enableGutter={false}
                            enableProse={false}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
            {/* Add-ons & Options */}
            <div className="mb-12">
              <TrekAddonsCard trek={trek} />
            </div>
            {/* FAQs */}
            {trek.faqs && trek.faqs.length > 0 && (
              <div id="faqs" className="mb-12 scroll-mt-16">
                <TrekFaqAccordion faqs={trek.faqs!} />
              </div>
            )}
            {/* Travellers' Reviews */}
            <div id="reviews" className="mb-8 scroll-mt-16">
              <TrekReviews reviews={trek.reviews} />
            </div>

            {/* Sentinel: sidebar becomes unsticky once this enters the viewport */}
            <div id="sidebar-stop-sentinel" aria-hidden="true" />

            {/* Add a Review */}
            <div className="mb-12">
              <AddReviewForm trekId={trek.id} />
            </div>
          </div>
          {/* Right: Booking Sidebar */}
          {/* Right: Booking Sidebar */}
          <div className="w-[300px] flex-shrink-0 mt-12 self-start">
            <BookingSidebar price={trek.price} groupPricing={trek.groupPricing} />
          </div>
        </div>
        {/* Recommended Packages */}

        {trek.showRecommended && trek.recommendedTreks && trek.recommendedTreks.length > 0 && (
          <RecommendedTreks treks={trek.recommendedTreks} />
        )}
      </div>
    </div>
  )
}

// Generate static paths for all treks at build time
export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'treks', limit: 100 })
  return docs.map((trek: Trek) => ({ slug: trek.slug }))
}
