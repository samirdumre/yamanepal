import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
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
import { getServerSideURL } from '@/utilities/getURL'
import { Navbar } from '@/components/layout/Navbar'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const headerData = (await getCachedGlobal('header', 1)()) as HeaderType

  const mapTrekItems = (items: HeaderType['trekkingDropdownItems']): TrekkingDropdownItem[] =>
    (items ?? []).flatMap((item) => {
      const trek = item.trek
      if (typeof trek === 'object' && trek !== null) {
        return [{ name: trek.name, slug: trek.slug ?? '', days: trek.days }]
      }
      return []
    })

  const trekkingItems = mapTrekItems(headerData?.trekkingDropdownItems)
  const topTreksItems = mapTrekItems(headerData?.topTreksDropdownItems)

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

  const travelInfoItems: LinkDropdownItem[] = (headerData?.travelInfoDropdownItems ?? []).map(
    (item) => ({ label: item.label, url: item.url }),
  )
  const companyItems: LinkDropdownItem[] = (headerData?.companyDropdownItems ?? []).map((item) => ({
    label: item.label,
    url: item.url,
  }))

  return (
    <html className={cn(inter.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Navbar
            trekkingItems={trekkingItems}
            trekkingRegionGroups={trekkingRegionGroups}
            topTreksItems={topTreksItems}
            travelInfoItems={travelInfoItems}
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
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
