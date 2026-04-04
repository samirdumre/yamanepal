import type { Metadata } from 'next'
import Script from 'next/script'

import { cn } from '@/utilities/ui'
import { Noto_Sans_JP } from 'next/font/google'
import React from 'react'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Footer } from '@/components/layout/Footer'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header as HeaderType, Region, Trek } from '@/payload-types'
import type {
  TrekkingDropdownItem,
  LinkDropdownItem,
  TrekRegionGroup,
} from '@/components/layout/Navbar'
import { getPayload } from 'payload'
import config from '@payload-config'

import './globals.css'
import { CANONICAL_BASE_URL, buildJapaneseAlternates } from '@/utilities/alternates'
import { Navbar } from '@/components/layout/Navbar'
import { PageLoader } from '@/components/ui/PageLoader'
import { RouteProgressBar } from '@/components/ui/RouteProgressBar'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const headerData = (await getCachedGlobal('header', 1)()) as HeaderType

  const topTreksItems = (headerData?.topTreksDropdownItems ?? []).flatMap((item) => {
    const trek = item.trek
    if (typeof trek === 'object' && trek !== null) {
      return [{ name: trek.name, slug: trek.slug ?? '', days: trek.days }]
    }
    return []
  })

  const bhutanTreksItems = (headerData?.bhutanTreksDropdownItems ?? []).flatMap((item) => {
    const trek = item.trek
    if (typeof trek === 'object' && trek !== null) {
      return [{ name: trek.name, slug: trek.slug ?? '', days: trek.days }]
    }
    return []
  })

  const climbingItems = (headerData?.travelInfoDropdownItems ?? []).flatMap((item) => {
    const trek = item.trek
    if (typeof trek === 'object' && trek !== null) {
      return [{ name: trek.name, slug: trek.slug ?? '', days: trek.days }]
    }
    return []
  })

  // Build region-grouped dropdown from trekkingDropdownRegions
  const regionEntries = (headerData?.trekkingDropdownRegions ?? []).filter(
    (entry) => typeof entry.region === 'object' && entry.region !== null,
  ) as { region: Region; id?: string | null }[]

  let trekkingRegionGroups: TrekRegionGroup[] = []
  if (regionEntries.length > 0) {
    const regionIds = regionEntries.map((entry) => entry.region.id)
    const payload = await getPayload({ config })
    const { docs: regionTreks } = await payload.find({
      collection: 'treks',
      where: { region: { in: regionIds } },
      limit: 200,
      depth: 0,
      overrideAccess: false,
    })
    const treksByRegion: Record<number, TrekkingDropdownItem[]> = {}
    for (const trek of regionTreks as Trek[]) {
      const regionId =
        typeof trek.region === 'object'
          ? trek.region?.id
          : (trek.region as number | null | undefined)
      if (regionId == null) continue
      if (!treksByRegion[regionId]) treksByRegion[regionId] = []
      treksByRegion[regionId]!.push({ name: trek.name, slug: trek.slug ?? '', days: trek.days })
    }
    trekkingRegionGroups = regionEntries.map((entry) => ({
      regionName: entry.region.name,
      regionSlug: entry.region.slug ?? '',
      treks: treksByRegion[entry.region.id] ?? [],
    }))
  }

  const companyItems: LinkDropdownItem[] = (headerData?.companyDropdownItems ?? []).map((item) => ({
    label: item.label,
    url: item.url,
  }))

  return (
    <html className={cn(notoSansJP.variable)} lang="ja">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://s.ytimg.com" />
      </head>
      <body suppressHydrationWarning>
        <PageLoader />
        <RouteProgressBar />
        <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Navbar
            trekkingItems={[]}
            trekkingRegionGroups={trekkingRegionGroups}
            topTreksItems={topTreksItems}
            bhutanTreksItems={bhutanTreksItems}
            climbingItems={climbingItems}
            companyItems={companyItems}
          />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_BASE_URL),
  alternates: buildJapaneseAlternates('/'),
  openGraph: mergeOpenGraph({
    locale: 'ja_JP',
    url: `${CANONICAL_BASE_URL}/`,
  }),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
