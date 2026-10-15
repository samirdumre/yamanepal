import type { Metadata } from 'next'
import Link from '@/components/ProgressLink'
import type { Media } from '@/payload-types'
import { TrekCard } from '@/components/cards/TrekCard'
import { findPublicContent } from '@/utilities/getPublicContent'
import { trekCardSelect } from '@/utilities/trekCardSelect'
import { japaneseMetadata } from '@/utilities/seo'

export const revalidate = 3600
export const metadata: Metadata = japaneseMetadata(
  'ネパールトレッキング・登山ツアー一覧 | ヤマ・ネパール・トレック',
  'エベレスト、アンナプルナ、ランタンなどのネパールトレッキング・登山ツアーを一覧でご紹介。日程・難易度・料金を比較して、ご希望のコースをお選びください。',
  '/treks',
)

export default async function TreksPage() {
  // Shared collection_treks tag refreshes this directory and every other trek
  // consumer together. Payload hooks also explicitly invalidate /treks.
  const { docs: treks } = await findPublicContent({
    collection: 'treks',
    sort: 'name',
    limit: 1000,
    pagination: false,
    depth: 1,
    select: trekCardSelect,
    where: { slug: { exists: true } },
  })

  return (
    <main className="max-w-[1320px] mx-auto px-5 md:px-10 py-10 lg:py-16">
      <nav aria-label="パンくずリスト" className="mb-6 text-sm text-slate-500">
        <Link href="/" className="text-cyan-600 hover:underline">
          ホーム
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page">トレッキング一覧</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-semibold text-slate-950 mb-4">
        トレッキング・登山ツアー一覧
      </h1>
      <p className="text-slate-600 leading-8 max-w-3xl mb-10">
        ネパールとヒマラヤの旅を見つけましょう。日程・難易度・料金をご確認のうえ、ご希望に合ったコースを日本語でご相談いただけます。
      </p>
      {treks.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {treks.map((trek) => (
            <TrekCard
              key={trek.id}
              image={trek.image as Media | null}
              name={trek.name}
              slug={trek.slug ?? ''}
              days={trek.days}
              difficulty={trek.difficulty}
              price={trek.price}
              discountedPrice={trek.discountedPrice}
              isLastMinuteDeal={trek.isLastMinuteDeal}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-slate-500">
          現在ご案内できるコースはありません。ご希望の旅についてお問い合わせください。
        </p>
      )}
    </main>
  )
}
