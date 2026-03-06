import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ItineraryAccordion } from '@/components/sections/ItineraryAccordion'
import { BookingSidebar } from '@/components/sections/BookingSidebar'
import { TrekStatsCard } from '@/components/sections/TrekStatsCard'
import { TrekAddonsCard } from '@/components/sections/TrekAddonsCard'
import { TrekFaqAccordion } from '@/components/sections/TrekFaqAccordion'
import { TrekReviews } from '@/components/sections/TrekReviews'
import { AddReviewForm } from '@/components/sections/AddReviewForm'
import RichText from '@/components/RichText'
import type { Trek, Media, Category } from '@/payload-types'

import {
  Check,
  X,
  Mountain,
  Tag,
  Clock,
  ChevronRight,
  Star,
  Images,
  ArrowRight,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function TrekDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'treks',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const trek = docs[0] as Trek | undefined
  if (!trek) notFound()

  function imgUrl(img: Media | number | null | undefined): string | null {
    if (!img || typeof img !== 'object') return null
    return (img as Media).url ?? null
  }

  const gallery = trek.gallery
  const slot1 = imgUrl(gallery?.[0]?.image as Media) ?? imgUrl(trek.image as Media)
  const slot2 = imgUrl(gallery?.[1]?.image as Media)
  const slot3 = imgUrl(gallery?.[2]?.image as Media)

  const category = trek.category as Category | null | undefined
  const categoryTitle = category && typeof category === 'object' ? category.title : null
  const categorySlug = category && typeof category === 'object' ? category.slug : null
  const rating = trek.rating
  const reviewCount = trek.reviewCount

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* ── Hero: full-width 3-photo collage only ── */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-8">
        <div className="flex gap-2">
          {/* Large left image */}
          <div className="flex-2 min-w-0">
            {slot1 ? (
              <img
                src={slot1}
                alt={trek.name}
                className="w-full h-[240px] sm:h-[360px] md:h-[480px] object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-[240px] sm:h-[360px] md:h-[480px] rounded-lg bg-gray-200" />
            )}
          </div>

          {/* Two stacked right images (hidden on small screens) */}
          {(slot2 || slot3) && (
            <div className="hidden sm:flex flex-1 flex-col gap-2 min-w-0">
              {slot2 ? (
                <img
                  src={slot2}
                  alt={`${trek.name} — photo 2`}
                  className="w-full h-[236px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-[236px] rounded-xl bg-gray-100" />
              )}
              <div className="relative w-full h-[236px]">
                {slot3 ? (
                  <img
                    src={slot3}
                    alt={`${trek.name} — photo 3`}
                    className="w-full h-[236px] object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-[236px] rounded-lg bg-gray-100" />
                )}
                <button className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white border border-gray-300 rounded-full px-3 py-1.5 text-sm font-medium text-slate-950 font-['Inter'] shadow-sm hover:bg-gray-50 transition-colors">
                  <Images className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  See All Photos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Two-column layout: sidebar now aligns with title ── */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row gap-12">
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
              <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-black">
                {trek.name}
              </h1>

              {rating != null && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-black">
                    {rating}/5{reviewCount != null ? ` from ${reviewCount} Reviews` : ''}
                  </span>
                </div>
              )}

              {/* Quick stats */}
              {/* <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-sm">{trek.days}</span>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
                  <Mountain className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-sm">{trek.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-sm font-bold">US ${trek.price}</span>
                </div>
              </div> */}
            </div>

            {/* Overview */}
            {trek.overview && (
              <section className="mb-6">
                <RichText
                  data={trek.overview as any}
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
              <section className="mb-10">
                <h2 className="font-['Inter'] font-semibold text-2xl text-black mb-2.5">
                  Highlights
                </h2>
                <div className="flex flex-col gap-2">
                  {(trek.highlights as any[]).map((h: any, i: number) => (
                    <div key={h.id ?? i} className="flex justify-center items-start gap-2">
                      <ArrowRight className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                      <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                        <RichText data={h.text as any} enableGutter={false} enableProse={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Detailed Overview */}
            {(trek as any).detailedOverview && (
              <section className="mb-10">
                <h2 className="font-['Inter'] font-semibold text-2xl text-black mb-4">
                  Detailed Overview
                </h2>
                <RichText
                  data={(trek as any).detailedOverview as any}
                  enableGutter={false}
                  enableProse={true}
                  className="max-w-none"
                />
              </section>
            )}

            {/* Itinerary Accordion */}
            {trek.itinerary && trek.itinerary.length > 0 && (
              <section className="mb-12">
                <h2 className="font-['Inter',sans-serif] font-semibold text-[28px] text-[#020617] mb-6">
                  Day-by-Day Itinerary
                </h2>
                <ItineraryAccordion itinerary={trek.itinerary as any} />
              </section>
            )}

            {/* Includes / Excludes */}
            <section className="mb-12 flex flex-col gap-10">
              {trek.includes && trek.includes.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                  <h3 className="text-black text-xl font-semibold font-['Inter']">Cost Includes</h3>
                  <ul className="flex flex-col gap-2">
                    {(trek.includes as any[]).map((inc: any, i: number) => (
                      <li key={inc.id ?? i} className="flex items-start gap-2">
                        <Check className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                          <RichText
                            data={inc.text as any}
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
                  <h3 className="text-black text-xl font-semibold font-['Inter']">Cost Excludes</h3>
                  <ul className="flex flex-col gap-2">
                    {(trek.excludes as any[]).map((exc: any, i: number) => (
                      <li key={exc.id ?? i} className="flex items-start gap-2">
                        <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1 font-normal text-base text-[#020617] leading-7">
                          <RichText
                            data={exc.text as any}
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
              <div className="mb-12">
                <TrekFaqAccordion
                  faqs={trek.faqs as { question: string; answer: any; id?: string | null }[]}
                />
              </div>
            )}

            {/* Travellers' Reviews */}
            <div className="mb-8">
              <TrekReviews reviews={trek.reviews} />
            </div>

            {/* Add a Review */}
            <div className="mb-12">
              <AddReviewForm trekId={trek.id} />
            </div>
          </div>

          {/* Right: Booking Sidebar */}
          <div className="lg:w-[360px] flex-shrink-0 mt-12">
            <BookingSidebar price={trek.price} />
          </div>
        </div>
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
