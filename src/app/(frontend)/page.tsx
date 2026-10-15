import { trekCardSelect } from '@/utilities/trekCardSelect'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { findPublicContent } from '@/utilities/getPublicContent'
import { HeroSection } from '@/components/sections/HeroSection'
import { SectionHeading } from '@/components/ui/SectionLabel'
import { RegionCard } from '@/components/cards/DestinationCard'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { GallerySection } from '@/components/sections/GallerySection'
import { TrekCarousel } from '@/components/sections/TrekCarousel'
import { Button } from '@/components/ui/button'
import type { Trek, Post, Media } from '@/payload-types'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import { CalendarCheck2, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from '@/components/ProgressLink'
import type { Metadata } from 'next'
import { japaneseMetadata, JAPANESE_SITE_TITLE, JAPANESE_DESCRIPTION } from '@/utilities/seo'
import { buildCanonicalURL } from '@/utilities/alternates'

export const revalidate = 3600 // On-demand CMS invalidation, with an hourly fallback

export const metadata: Metadata = japaneseMetadata(JAPANESE_SITE_TITLE, JAPANESE_DESCRIPTION, '/')

export default async function HomePage() {
  // Fetch all data in parallel
  const [{ docs: bestSellerTreks }, { docs: lastMinuteDeals }, homepage, { docs: trekRatings }] =
    await Promise.all([
      findPublicContent({
        collection: 'treks',
        where: { isBestSeller: { equals: true } },
        limit: 6,
        pagination: false,
        depth: 1,
        select: trekCardSelect,
      }),
      findPublicContent({
        collection: 'treks',
        where: { isLastMinuteDeal: { equals: true } },
        depth: 1,
        select: trekCardSelect,
        limit: 6,
        pagination: false,
      }),
      getCachedGlobal('homepage', 2)(),
      findPublicContent({
        collection: 'treks',
        depth: 0,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
        select: {
          rating: true,
          reviewCount: true,
        },
      }),
    ])

  const homepageUrl = buildCanonicalURL('/')

  const ratings = (trekRatings ?? []).flatMap((trek) => {
    const rating = typeof trek.rating === 'number' ? trek.rating : null
    const reviewCount = typeof trek.reviewCount === 'number' ? trek.reviewCount : 0

    if (rating == null || !Number.isFinite(rating) || reviewCount <= 0) {
      return []
    }

    return [{ rating, reviewCount }]
  })

  const totalReviewCount = ratings.reduce((sum, item) => sum + item.reviewCount, 0)
  const weightedRatingSum = ratings.reduce((sum, item) => sum + item.rating * item.reviewCount, 0)
  const averageRating =
    totalReviewCount > 0 ? Number((weightedRatingSum / totalReviewCount).toFixed(1)) : null
  const homepageSchemaReviewCount = totalReviewCount

  const homepageReviewSchema =
    averageRating != null
      ? {
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          '@id': `${homepageUrl}#travel-agency`,
          name: 'Yama Nepal Trek (ヤマ・ネパール・トレック)',
          url: homepageUrl,
          inLanguage: 'ja',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            reviewCount: homepageSchemaReviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : null

  const placeholderRegions = [
    {
      id: 1,
      image: '/regions/langtang region.avif',
      name: 'ランタン地域',
      slug: 'langtang-region',
      trekCount: 3,
    },
    {
      id: 2,
      image: '/regions/annapurna region.avif',
      name: 'アンナプルナ地方',
      slug: 'annapurna-region',
      trekCount: 7,
    },
    {
      id: 3,
      image: '/regions/everest region.avif',
      name: 'エベレスト地域',
      slug: 'everest-region',
      trekCount: 9,
    },
    {
      id: 4,
      image: '/regions/dolpa region.avif',
      name: 'ドルパ地方',
      slug: 'dolpa-region',
      trekCount: 2,
    },
    {
      id: 5,
      image: '/regions/manaslu region.avif',
      name: 'マナスル地方',
      slug: 'manaslu-region',
      trekCount: 2,
    },
    {
      id: 6,
      image: '/regions/chitwan region.avif',
      name: 'ファミリーツアー',
      slug: 'family-tour',
      trekCount: 3,
    },
  ]

  const placeholderTripOfTheMonth = {
    trek: {
      name: 'ランタン谷トレッキング',
      slug: '/langtang-valley-trek',
      days: '7 日間',
      difficulty: '中級',
      price: 945,
    },
    image: { url: '/images/camping.avif' },
    description:
      'ランタン谷トレッキングは、ネパールで最も美しいトレッキングコースの一つです。キャンジン・リ（4,400m）とツェルコ・リ（5,700m）への玄関口となっています...',
  }

  const tripOfTheMonthTrek = placeholderTripOfTheMonth.trek as any
  const tripImage = placeholderTripOfTheMonth.image as any
  const tripOfTheMonthDescription = placeholderTripOfTheMonth.description

  const placeholderTestimonials = [
    {
      id: 1,
      name: '鈴木明子',
      location: 'Sendai, Japan',
      quote:
        'アイランドピーク、最高でした！正直めちゃくちゃ不安だったけど、ガイドさんがずっと支えてくれて、無事に登頂できました。装備のチェックも丁寧にしてくれて、本当に心強かったです。山頂に立ったときは泣きそうになりました笑。このエージェンシー、ほんとにおすすめです！',
      avatar: '/regions/island peak morning.avif',
    },
    {
      id: 2,
      name: '佐藤花',
      location: 'Shinjuku, Japan',
      quote:
        '初めての海外トレッキングで超不安だったけど、ガイドさんのおかげで全部吹き飛びました笑。ずっと気にかけてくれてアドバイスも的確で、ほんとに心強かったです。一人だったら絶対こんなに楽しめなかった。ありがとうございました！',
      avatar: '/images/trekking nepal.avif',
    },
    {
      id: 3,
      name: '田中結愛',
      location: 'Chiba, Japan',
      quote:
        'ランタン谷トレッキングは本当に素晴らしい体験でした。タマン族の文化やチェルコリからのヒマラヤの絶景に感動し、ガイドさんのサポートのおかげで安心して楽しめました。このエージェンシーを選んで大正解でした。心からおすすめします!',
      avatar: '/images/camping.avif',
    },
    {
      id: 4,
      name: '山本 浩',
      location: 'Tokyo, Japan',
      quote:
        'グループでのアンナプルナベースキャンプ、最高すぎました！最初はみんなと歩けるか不安だったけど、気づいたら仲間と笑いながら歩いてて、しんどさも全然気にならなかった笑。ガイドさんもグループ全員のペースをしっかり見てくれて、誰も置いてけぼりにしない安心感がありました。ベースキャンプで見たアンナプルナの景色は、言葉にならないくらい感動的でした。このツアーに参加して本当によかった。友達にも絶対すすめます！',
      avatar: '/images/annapurna4.avif',
    },
    {
      id: 5,
      name: 'マイケル・レイスナー',
      location: 'Florida, USA',
      quote:
        'エベレストベースキャンプ、夢が叶いました！カラパタールからの景色はもう言葉にならないです。高山病が心配で正直ビビってたんですが、ガイドさんが毎日体調チェックしてくれて、ペース配分も完璧で安心して歩けました。テントの中で飲んだ温かいチャイが忘れられない笑。また絶対ネパールに来ます！',
      avatar: '/images/everest-testimonial.avif',
    },
    {
      id: 6,
      name: '中村 美咲',
      location: 'Kyoto, Japan',
      quote:
        'プーンヒルトレッキング、最高の旅でした！早朝の展望台からダウラギリとアンナプルナが朝焼けに染まる瞬間、思わず息をのみました。初心者向けって聞いてたけど、実際歩いてみるとなかなかハードで笑。でもガイドさんがずっと励ましてくれて、地元の文化や村の話もたくさん教えてもらえてすごく充実してました。山も村も人も、全部が温かくて。このエージェンシーに任せて本当によかったです。',
      avatar: '/images/poonhill.avif',
    },
    {
      id: 7,
      name: '高橋 龍',
      location: 'Sapporo, Japan',
      quote:
        'ゴーキョトレッキング最高でした。エベレストベースキャンプより静かで、湖の透明度とチョ・オユーの眺めが想像以上に美しくて圧倒されました。英語があまり得意じゃない私にも、ガイドさんが辛抱強く対応してくれてすごく助かりました笑。来年は家族を連れてまた来たいと思ってます！',
      avatar: '/images/shantamagar.avif',
    },
  ]

  const blogPosts = (homepage?.featuredBlogs ?? []).filter(
    (p): p is Post => typeof p === 'object',
  ) as Post[]
  const featuredPost = blogPosts[0] ?? null
  const sidePosts = blogPosts.slice(1, 4)

  const difficultyConfig = {
    初級: { icon: '/images/easy.avif', color: 'text-green-500' },
    中級: { icon: '/images/moderate.avif', color: 'text-yellow-500' },
    上級: { icon: '/images/hard.avif', color: 'text-red-500' },
  }

  return (
    <div className="min-h-screen bg-white font-['Noto_Sans_JP',sans-serif]">
      {homepageReviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageReviewSchema) }}
        />
      )}
      {/* <Navbar /> */}

      {/* Hero */}
      <HeroSection
        headline={'ネパール トレッキング ローカルガイド付き'}
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
            {placeholderRegions.map((region) => (
              <RegionCard
                key={region.id}
                image={region.image}
                name={region.name}
                slug={region.slug}
                trekCount={region.trekCount}
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
                        alt={tripOfTheMonthTrek.difficulty}
                        className="w-10 h-6 object-contain flex-shrink-0"
                        src={
                          difficultyConfig[
                            tripOfTheMonthTrek.difficulty as keyof typeof difficultyConfig
                          ]?.icon ?? difficultyConfig.中級.icon
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
                  {tripOfTheMonthDescription}
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
        images={[
          '/images/annapurna4.avif',
          '/images/breakfast on everest trail.avif',
          '/images/camping.avif',
          '/images/island peak with guide.avif',
          '/images/annapurna mountain.avif',
          '/images/yak on everest.avif',
          '/images/trekking nepal.avif',
          '/images/travel1.avif',
          '/images/nepal-hill.avif',
          '/images/kyanjinri.avif',
          '/images/everest base camp.avif',
        ]}
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
          <TestimonialCarousel testimonials={placeholderTestimonials as any} />
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
