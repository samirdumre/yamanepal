import type { Metadata } from 'next/types'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Media } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      tag: true,
      image: true,
    },
  })

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <div className="relative w-full h-[290px] lg:h-[567px] overflow-hidden">
        <Image
          fill
          alt="Blogs from the Himalayas"
          className="object-cover"
          src="/images/coverimage.jpg"
          priority
        />
      </div>

      {/* Blog Grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0 py-12">
        <div className="flex items-center gap-1 mb-2">
          <Link href="/" className="text-[#0cb6d8] text-[14px]">
            ホーム
          </Link>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#0cb6d8] text-[14px]">ブログ</span>
        </div>

        <h1 className="text-left font-semibold mb-4 text-[32px] text-[#020617] tracking-tight">
          ヒマラヤからのブログ
        </h1>
        {posts.totalDocs === 0 ? (
          <p className="text-[#64748b] text-center py-20">No blogs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.docs.map((post) => {
              const image = post.image as Media | null
              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col rounded-[10px] overflow-hidden border border-[#e2e8f0] hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative w-full h-[220px] overflow-hidden flex-shrink-0">
                    {image?.url ? (
                      <Image
                        fill
                        alt={post.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        src={image.url}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e2e8f0]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    {post.tag && (
                      <div className="bg-[rgba(226,232,240,0.56)] rounded-full px-4 py-[3px] w-fit">
                        <span className="font-['Inter',sans-serif] text-[13px] text-[#020617]">
                          {post.tag}
                        </span>
                      </div>
                    )}
                    <h2 className="font-['Inter',sans-serif] font-semibold text-[16px] text-[#020617] leading-[24px]">
                      {post.title}
                    </h2>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {posts.totalPages > 1 && posts.page && (
          <div className="mt-10">
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          </div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blogs | Yama Nepal Trek',
  }
}
