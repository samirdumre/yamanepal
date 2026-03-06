import { getPayload } from 'payload'
import config from '@payload-config'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { SectionHeading } from '@/components/ui/SectionLabel'
import { DestinationCard } from '@/components/cards/DestinationCard'
import { FeatureCard } from '@/components/cards/FeatureCard'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { GallerySection } from '@/components/sections/GallerySection'
import { TrekCarousel } from '@/components/sections/TrekCarousel'
import { Button } from '@/components/ui/button'
import type { Trek, Destination, Testimonial, Post, Media } from '@/payload-types'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import { CalendarCheck2, Tag } from 'lucide-react'
import Image from 'next/image'

// SVG Icons (inlined — no more external SVG imports)
function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M19.833 24.5v-2.333A4.667 4.667 0 0 0 15.167 17H5.833a4.667 4.667 0 0 0-4.666 4.667V24.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
      <circle
        cx="10.5"
        cy="10.5"
        r="4.667"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
      <path
        d="M26.833 24.5v-2.333a4.667 4.667 0 0 0-3.5-4.515M19.833 3.652a4.667 4.667 0 0 1 0 9.03"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
    </svg>
  )
}

function HeadphonesIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M4.667 18.667v-4.667a9.333 9.333 0 1 1 18.666 0v4.667M4.667 18.667A2.333 2.333 0 0 0 7 21h1.167A2.333 2.333 0 0 0 10.5 18.667v-3.5A2.333 2.333 0 0 0 8.167 12.833H4.667v5.834ZM23.333 18.667A2.333 2.333 0 0 1 21 21h-1.167A2.333 2.333 0 0 1 17.5 18.667v-3.5a2.333 2.333 0 0 1 2.333-2.334h3.5v5.834Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M9.333 2.333V7M18.667 2.333V7"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
      <rect
        x="2.333"
        y="4.667"
        width="23.333"
        height="21"
        rx="2"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
      <path
        d="M3.5 11.667H24.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2.333L3.5 7v7c0 6.475 4.55 12.53 10.5 14 5.95-1.47 10.5-7.525 10.5-14V7L14 2.333Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
      />
    </svg>
  )
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch all data in parallel
  const [
    { docs: bestSellerTreks },
    { docs: destinations },
    { docs: lastMinuteDeals },
    { docs: testimonials },
    { docs: blogPosts },
    homepage,
    { docs: galleryMedia },
  ] = await Promise.all([
    payload.find({ collection: 'treks', where: { isBestSeller: { equals: true } }, limit: 6 }),
    payload.find({ collection: 'destinations', limit: 6 }),
    payload.find({ collection: 'treks', where: { isLastMinuteDeal: { equals: true } }, limit: 6 }),
    payload.find({ collection: 'testimonials', limit: 3 }),
    payload.find({ collection: 'posts', limit: 4 }),
    payload.findGlobal({ slug: 'homepage' }),
    payload.find({ collection: 'media', limit: 11 }),
  ])

  const tripOfTheMonthTrek = homepage?.tripOfTheMonth?.trek as Trek | null
  const tripImage = tripOfTheMonthTrek?.image as Media | null

  const featuredPost = blogPosts.find((p: Post) => p.isFeatured) ?? blogPosts[0]
  const sidePosts = blogPosts.filter((p: Post) => p.id !== featuredPost?.id).slice(0, 3)

  const difficultyConfig = {
    Easy: { icon: '/images/easy.png', color: 'text-green-500' },
    Moderate: { icon: '/images/moderate.png', color: 'text-yellow-500' },
    Hard: { icon: '/images/hard.png', color: 'text-red-500' },
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] overflow-x-hidden">
      {/* <Navbar /> */}

      {/* Hero */}
      <HeroSection
        headline={homepage?.hero?.headline ?? 'Explore Nepal with Local Guides'}
        subheading={homepage?.hero?.subheading ?? 'Book a trek in Nepal now!!'}
      />

      {/* Best Seller Treks */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-10 py-16 overflow-hidden">
        <TrekCarousel
          treks={bestSellerTreks as Trek[]}
          label={homepage?.bestSellerSectionLabel ?? 'Best Seller 2026'}
          title="Best Seller Treks"
        />
      </section>

      {/* Explore Destinations */}
      <section className="bg-[#e2e8f0] py-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <SectionHeading
            align="center"
            label="Top Notch Destination"
            labelPosition="both"
            title="Explore Excellent Destination"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 mb-6">
            {destinations.map((dest: Destination) => (
              <DestinationCard
                key={dest.id}
                image={dest.image}
                name={dest.name}
                packsCount={dest.packsCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <WhyChooseUs />
        </div>
      </section>

      {/* Last Minute Deals */}
      <section className="max-w-[1320px] mx-auto px-5 md:px-10 pb-16 overflow-hidden">
        <TrekCarousel
          treks={lastMinuteDeals as Trek[]}
          label={homepage?.lastMinuteSectionLabel ?? 'Deals and Discounts'}
          title="Best Last Minute Deals"
        />
      </section>

      {/* Trip of the Month */}
      {tripOfTheMonthTrek && (
        <section className="bg-[#020617] w-full">
          <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-16 md:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="relative rounded-lg overflow-hidden h-[258px] w-full lg:w-[522px] flex-shrink-0">
                {tripImage?.url && (
                  <Image
                    alt={tripOfTheMonthTrek.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={tripImage.url}
                    height={400}
                    width={600}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[34%] to-black/80" />
                <div className="absolute bottom-[23px] left-0 right-0 flex items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-[14px]">
                      <CalendarCheck2 />
                    </span>
                    <span className="font-['Inter',sans-serif] text-[14px] text-white leading-[20px]">
                      {tripOfTheMonthTrek.days}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-[14px]">
                      <Image
                        alt={tripOfTheMonthTrek.difficulty}
                        className="w-10 h-6 object-contain flex-shrink-0"
                        src={
                          difficultyConfig[tripOfTheMonthTrek.difficulty]?.icon ??
                          difficultyConfig.Moderate.icon
                        }
                        width={32}
                        height={20}
                      />
                    </span>
                    <span className="font-['Inter',sans-serif] text-[14px] text-white leading-[20px]">
                      {tripOfTheMonthTrek.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Tag />
                    <span className="font-['Inter',sans-serif] text-[14px] text-white leading-[20px]">
                      US ${tripOfTheMonthTrek.price}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-['Inter',sans-serif] text-[16px] text-[#0cb6d8]">
                      Trip of the Month
                    </span>
                    <div className="w-[44px] h-[1px] bg-[#0cb6d8]" />
                  </div>
                  <h2 className="font-['Inter',sans-serif] font-semibold text-[28px] md:text-[32px] text-white tracking-[-0.64px]">
                    {tripOfTheMonthTrek.name}
                  </h2>
                </div>
                <p className="font-['Inter',sans-serif] text-[14px] text-white leading-[22px]">
                  {homepage?.tripOfTheMonth?.description}
                </p>
                <Button variant="primary" className="w-fit mt-2">
                  View Trip
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <GallerySection images={galleryMedia.map((m: any) => m.url).filter(Boolean)} />

      {/* Testimonials */}
      <section>
        <TestimonialCarousel testimonials={testimonials as Testimonial[]} />
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-5 md:px-10 py-16 lg:pb-20">
          <SectionHeading label="Blogs" title="Blogs from the Himalayas" />
          <div className="flex flex-col lg:flex-row gap-5 mt-8">
            {/* Featured Post */}
            {featuredPost && (
              <div className="relative rounded-[10px] overflow-hidden h-[392px] lg:flex-1 cursor-pointer group">
                {(featuredPost.image as Media)?.url && (
                  <img
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    src={(featuredPost.image as Media).url!}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-[#e2e8f0] rounded-full px-3 py-[3px] w-fit mb-3">
                    <span className="font-['Inter',sans-serif] text-[14px] text-[#020617]">
                      {featuredPost.tag}
                    </span>
                  </div>
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[20px] text-white leading-[32px]">
                    {featuredPost.title}
                  </h3>
                </div>
              </div>
            )}

            {/* Blog List */}
            <div className="flex flex-col gap-4 lg:w-[575px]">
              {sidePosts.map((post: Post) => (
                <div key={post.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-[160px] h-[120px] rounded-[10px] overflow-hidden flex-shrink-0">
                    {(post.image as Media)?.url && (
                      <img
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={(post.image as Media).url!}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[rgba(226,232,240,0.56)] rounded-full px-4 py-[3px] w-fit">
                      <span className="font-['Inter',sans-serif] text-[14px] text-[#020617]">
                        {post.tag}
                      </span>
                    </div>
                    <h4 className="font-['Inter',sans-serif] font-semibold text-[16px] text-[#020617] leading-[22px]">
                      {post.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* <Footer /> */}
    </div>
  )
}
