import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { Media } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const heroImage = (post.heroImage ?? post.image) as Media | null

  return (
    <article className="bg-white w-full font-['Inter',sans-serif]">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero Image */}
      <div className="w-full h-[290px] lg:h-[567px] overflow-hidden relative">
        {heroImage?.url ? (
          <Image
            fill
            sizes="100vw"
            alt={post.title}
            className="object-cover"
            src={heroImage.url}
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#e2e8f0]" />
        )}
      </div>

      {/* Content */}
      <div className="max-w-[898px] mx-auto px-6 py-6 md:py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-6 flex-wrap">
          <Link href="/" className="text-[#0cb6d8] text-[14px] hover:underline">
            ホーム
          </Link>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <Link href="/posts" className="text-[#0cb6d8] text-[14px] hover:underline">
            ブログ
          </Link>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#020617] text-[14px]">{post.title}</span>
        </div>

        {/* Tag */}
        {post.tag && (
          <div className="bg-[rgba(226,232,240,0.56)] rounded-full px-4 py-[3px] w-fit mb-4">
            <span className="text-[14px] text-[#020617]">{post.tag}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-[#020617] text-[28px] md:text-[36px] font-semibold tracking-[-0.8px] mb-8">
          {post.title}
        </h1>

        {/* Rich Text Content */}
        {post.content && (
          <div className="text-[17px] leading-7">
            <RichText data={post.content} enableGutter={false} />
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#e2e8f0]">
            <RelatedPosts docs={post.relatedPosts.filter((post) => typeof post === 'object')} />
          </div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
