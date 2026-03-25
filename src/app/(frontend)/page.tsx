import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroSection } from '@/components/sections/HeroSection'
import { SectionHeading } from '@/components/ui/SectionLabel'
import { RegionCard } from '@/components/cards/DestinationCard'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { GallerySection } from '@/components/sections/GallerySection'
import { TrekCarousel } from '@/components/sections/TrekCarousel'
import { Button } from '@/components/ui/button'
import type { Trek, Region, Testimonial, Post, Media } from '@/payload-types'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import { CalendarCheck2, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch all data in parallel
  const [
    { docs: bestSellerTreks },
    { docs: regions },
    { docs: lastMinuteDeals },
    { docs: testimonials },
    homepage,
    { docs: galleryMedia },
    { docs: allTreks },
  ] = await Promise.all([
    payload.find({ collection: 'treks', where: { isBestSeller: { equals: true } }, limit: 6 }),
    payload.find({ collection: 'regions', limit: 6, sort: 'id' }),
    payload.find({ collection: 'treks', where: { isLastMinuteDeal: { equals: true } }, limit: 6 }),
    payload.find({ collection: 'testimonials', limit: 3 }),
    payload.findGlobal({ slug: 'homepage', depth: 2 }),
    payload.find({
      collection: 'media',
      limit: 11,
      where: {
        id: { in: [238, 236, 235, 233, 222, 189, 183, 176, 182, 9, 10] },
      },
    }),
    payload.find({
      collection: 'treks',
      depth: 0,
      pagination: false,
      select: {
        region: true,
      },
    }),
  ])

  const regionTrekCounts = new Map<number | string, number>()
  for (const trek of allTreks as Array<Pick<Trek, 'region'>>) {
    const regionId = typeof trek.region === 'object' ? trek.region?.id : trek.region
    if (regionId != null) {
      regionTrekCounts.set(regionId, (regionTrekCounts.get(regionId) ?? 0) + 1)
    }
  }

  const tripOfTheMonthTrek = homepage?.tripOfTheMonth?.trek as Trek | null
  const tripImage = tripOfTheMonthTrek?.image as Media | null

  const blogPosts = (homepage?.featuredBlogs ?? []).filter(
    (p): p is Post => typeof p === 'object',
  ) as Post[]
  const featuredPost = blogPosts[0] ?? null
  const sidePosts = blogPosts.slice(1, 4)

  const difficultyConfig = {
    初級: { icon: '/images/easy.png', color: 'text-green-500' },
    中級: { icon: '/images/moderate.png', color: 'text-yellow-500' },
    上級: { icon: '/images/hard.png', color: 'text-red-500' },
  }

  return (
    <div className="min-h-screen bg-white font-['Noto_Sans_JP',sans-serif]">
      {/* <Navbar /> */}

      {/* Hero */}
      <HeroSection
        headline={'地元ガイドと一緒にネパールを探検しよう'}
        subheading={'ネパールのトレッキングを今すぐ予約！'}
      />

      {/* Best Seller Treks */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-10 py-10 lg:py-16 overflow-hidden">
        <TrekCarousel
          treks={bestSellerTreks as Trek[]}
          label={homepage?.bestSellerSectionLabel ?? '2026年 ベストセラー'}
          title="人気トレッキング"
        />
      </section>

      {/* Explore Destinations */}
      <section className="relative bg-[#e2e8f0] py-10 lg:py-16 overflow-hidden">
        {/* Content */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-10">
          <SectionHeading
            align="center"
            label="一流の目的地"
            labelPosition="both"
            title="素晴らしい目的地を探索"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mt-4 md:mt-6 lg:mt-8 mb-6">
            {regions.map((region: Region) => (
              <RegionCard
                key={region.id}
                image={region.image ?? null}
                name={region.name}
                slug={region.slug ?? ''}
                trekCount={regionTrekCounts.get(region.id) ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1320px] mx-auto px-2 md:px-10">
          <WhyChooseUs />
        </div>
      </section>

      {/* Last Minute Deals */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-10 pb-8 lg:pb-16 overflow-hidden">
        <TrekCarousel
          treks={lastMinuteDeals as Trek[]}
          label={'お得なセール'}
          title="直前割引プラン"
        />
      </section>

      {/* Trip of the Month */}
      {tripOfTheMonthTrek && (
        <section className="relative bg-[#020617] w-full overflow-hidden">
          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-80 w-full h-full pointer-events-none"
            style={{
              backgroundImage: `
          linear-gradient(to right, #ffffff12 1px, transparent 1px),
          linear-gradient(to bottom, #ffffff12 1px, transparent 1px)
        `,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-10 py-10 lg:py-16 md:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20">
              <div className="relative rounded-lg overflow-hidden h-[180px] md:h-[258px] w-full lg:w-[522px] flex-shrink-0">
                {tripImage?.url && (
                  <Image
                    unoptimized
                    alt={tripOfTheMonthTrek.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={tripImage.url}
                    height={400}
                    priority
                    sizes="(max-width: 1024px) 100vw, 522px"
                    width={600}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[34%] to-black/80" />
                <div className="absolute bottom-[23px] left-0 right-0 flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-[14px]">
                      <CalendarCheck2 />
                    </span>
                    <span className="font-['Noto_Sans_JP',sans-serif] text-[14px] text-white leading-[20px]">
                      {tripOfTheMonthTrek.days}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-[14px]">
                      <Image
                        unoptimized
                        alt={tripOfTheMonthTrek.difficulty}
                        className="w-10 h-6 object-contain flex-shrink-0"
                        src={
                          difficultyConfig[tripOfTheMonthTrek.difficulty]?.icon ??
                          difficultyConfig.中級.icon
                        }
                        width={32}
                        height={20}
                      />
                    </span>
                    <span className="font-['Noto_Sans_JP',sans-serif] text-[14px] text-white leading-[20px]">
                      {tripOfTheMonthTrek.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Tag />
                    <span className="font-['Noto_Sans_JP',sans-serif] text-[14px] text-white leading-[20px]">
                      US ${tripOfTheMonthTrek.price}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] text-[#0cb6d8]">今月のおすすめ旅</span>
                    <div className="w-[44px] h-[1px] bg-[#0cb6d8]" />
                  </div>
                  <h2 className="font-semibold text-2xl md:text-4xl text-white">
                    {tripOfTheMonthTrek.name}
                  </h2>
                </div>
                <p className="font-['Noto_Sans_JP',sans-serif] text-[14px] text-white leading-[22px]">
                  {homepage?.tripOfTheMonth?.description}
                </p>
                <Link href={`/treks/${tripOfTheMonthTrek.slug ?? ''}`} className="w-fit">
                  <Button variant="primary" className="w-fit mt-2">
                    旅の詳細を見る
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <GallerySection
        images={[238, 236, 235, 233, 222, 189, 183, 176, 182, 9, 10]
          .map((id) => galleryMedia.find((m) => m.id === id)?.url)
          .filter((u): u is string => u != null)}
      />

      {/* Testimonials */}
      <section className="relative bg-gradient-to-b from-[#dbeafe] to-white py-10 lg:py-16 overflow-hidden">
        {/* Grid Pattern Overlay — fades out going down via mask */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `
        linear-gradient(to right, #94a3b820 1px, transparent 1px),
        linear-gradient(to bottom, #94a3b820 1px, transparent 1px)
      `,
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          }}
        />

        {/* Content stays on top */}
        <div className="relative z-10">
          <TestimonialCarousel testimonials={testimonials as Testimonial[]} />
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-5 md:px-10 lg:pb-20">
          <SectionHeading label="ブログ" title="ヒマラヤからのブログ" />
          <div className="flex flex-col lg:flex-row gap-5 mt-8">
            {/* Featured Post */}
            {featuredPost && (
              <Link
                href={`/posts/${featuredPost.slug ?? ''}`}
                className="relative rounded-[10px] overflow-hidden h-[392px] lg:flex-1 cursor-pointer group block"
              >
                {(featuredPost.image as Media)?.url && (
                  <Image
                    fill
                    unoptimized
                    alt={featuredPost.title}
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={(featuredPost.image as Media).url!}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-[#e2e8f0] rounded-full px-3 py-[3px] w-fit mb-3">
                    <span className="font-['Noto_Sans_JP',sans-serif] text-[14px] text-[#020617]">
                      {featuredPost.tag}
                    </span>
                  </div>
                  <h3 className="font-['Noto_Sans_JP',sans-serif] font-semibold text-[20px] text-white leading-[32px]">
                    {featuredPost.title}
                  </h3>
                </div>
              </Link>
            )}

            {/* Blog List */}
            <div className="flex flex-col gap-4 lg:w-[575px]">
              {sidePosts.map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug ?? ''}`}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative w-[160px] h-[120px] rounded-[10px] overflow-hidden flex-shrink-0">
                    {(post.image as Media)?.url && (
                      <Image
                        fill
                        unoptimized
                        alt={post.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="160px"
                        src={(post.image as Media).url!}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[rgba(226,232,240,0.56)] rounded-full px-4 py-[3px] w-fit">
                      <span className="text-[14px] text-[#020617]">{post.tag}</span>
                    </div>
                    <h4 className="font-semibold text-[16px] text-[#020617] leading-[22px]">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
