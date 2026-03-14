'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import NextLink from 'next/link'
import Link from 'next/link'

export type TrekkingDropdownItem = {
  name: string
  slug: string
  days: string
}

export type LinkDropdownItem = {
  label: string
  url: string
}

export type TrekRegionGroup = {
  regionName: string
  regionSlug: string
  treks: TrekkingDropdownItem[]
}

type NavbarProps = {
  trekkingItems?: TrekkingDropdownItem[]
  trekkingRegionGroups?: TrekRegionGroup[]
  topTreksItems?: TrekkingDropdownItem[]
  travelInfoItems?: LinkDropdownItem[]
  companyItems?: LinkDropdownItem[]
}

const navItems = [
  { label: 'ホーム', hasDropdown: false },
  { label: 'ネパールトレッキング', hasDropdown: true },
  { label: 'ブータン', hasDropdown: true },
  { label: '旅行情報', hasDropdown: true },
  { label: '会社について', hasDropdown: true },
]

/* ─────────────────────────────────────────────────
   Two-panel mega-menu for Destinations
   Left: region list  |  Right: treks in 2-column grid
───────────────────────────────────────────────── */
function DestinationsMegaMenu({ groups }: { groups: TrekRegionGroup[] }) {
  const [activeRegion, setActiveRegion] = useState<string>(groups[0]?.regionSlug ?? '')

  if (groups.length === 0) return null

  const activeGroup = groups.find((g) => g.regionSlug === activeRegion) ?? groups[0]!

  return (
    <div
      className="absolute top-full -left-56 hidden group-hover:flex z-50"
      style={{ minWidth: 872 }}
    >
      <div className="flex w-full bg-white shadow-xl border border-gray-100 rounded-xs overflow-hidden pt-2">
        {/* Left panel — regions */}
        <div className="w-56 shrink-0 border-r border-gray-100 overflow-y-auto max-h-[75vh]">
          {groups.map((group) => {
            const isActive = activeRegion === group.regionSlug
            return (
              <button
                key={group.regionSlug}
                onClick={() => setActiveRegion(group.regionSlug)}
                className={`w-full hover:cursor-pointer flex items-center justify-between gap-2 px-5 py-3 text-left transition-colors border-b border-gray-50 ${
                  isActive
                    ? 'border-r-2 border-r-slate-700 bg-white text-gray-900'
                    : 'border-r-2 border-r-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-[14px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {group.regionName}
                </span>
                <ChevronRight className="w-[14px] h-[14px] shrink-0 text-gray-400" />
              </button>
            )
          })}
        </div>

        {/* Right panel — treks in two-column grid */}
        <div className="flex-1 p-5 overflow-y-auto max-h-[75vh]">
          {activeGroup.treks.length > 0 ? (
            <>
              <h3 className="text-[14px] font-semibold text-[#020617] mb-4">
                {activeGroup.regionName}
              </h3>
              <div className="grid grid-cols-2 gap-x-24 gap-y-0">
                {activeGroup.treks.map((trek) => (
                  <NextLink
                    key={trek.slug}
                    href={`/treks/${trek.slug}`}
                    className="py-1.5 text-[14px] text-slate-700 hover:text-[#3b82f6] transition-colors leading-snug"
                  >
                    {trek.name}
                    {trek.days ? ` – ${trek.days}` : ''}
                  </NextLink>
                ))}
              </div>
            </>
          ) : (
            <div className="text-[14px] text-gray-400 py-4">No treks listed yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Fallback flat dropdown (when no region groups)
───────────────────────────────────────────────── */
function TrekDropdown({ items }: { items: TrekkingDropdownItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="absolute top-full -left-4 hidden group-hover:block z-50 min-w-[288px]">
      <div className="bg-white pt-2 rounded-xs shadow-xl border border-gray-100 py-1 overflow-hidden divide-y divide-gray-100">
        {items.map((trek) => (
          <NextLink
            key={trek.slug}
            href={`/treks/${trek.slug}`}
            className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-gray-50 transition-colors group/item"
          >
            <span className="text-[14px] font-medium text-gray-800 group-hover/item:text-[#3b82f6] transition-colors">
              {trek.name}
              {trek.days ? ` – ${trek.days}` : ''}
            </span>
            {/* <span className="text-[12px] text-gray-400 shrink-0">{trek.days}</span> */}
          </NextLink>
        ))}
      </div>
    </div>
  )
}

function LinkDropdown({ items }: { items: LinkDropdownItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="absolute -left-4  top-full hidden group-hover:block z-50 min-w-[280px]">
      <div className="bg-white rounded-xs shadow-xl border border-gray-100 py-1 overflow-hidden divide-y divide-gray-100">
        {items.map((item) => (
          <NextLink
            key={item.url}
            href={item.url}
            className="block px-4 py-2.5 text-[14px] font-medium text-gray-800 hover:bg-gray-50 hover:text-[#3b82f6] transition-colors"
          >
            {item.label}
          </NextLink>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────── */
export function Navbar({
  trekkingItems = [],
  trekkingRegionGroups = [],
  topTreksItems = [],
  travelInfoItems = [],
  companyItems = [],
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const pathname = usePathname()
  const isSticky = !pathname.startsWith('/treks')

  return (
    <>
      <nav className={`w-full bg-white z-50 shadow-sm ${isSticky ? 'sticky top-0' : 'relative'}`}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-1 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/logo.jpeg"
              alt="Logo"
              width={88}
              height={88}
              className="w-15 h-15 sm:w-16 sm:h-16 lg:w-[88px] lg:h-[88px] object-contain"
            />
            <div className="flex flex-col">
              <span className="lg:hidden font-semibold text-[17px] sm:text-[19px] text-gray-900 leading-tight">
                Yama
              </span>
              <span className="lg:hidden font-semibold text-[17px] sm:text-[19px] text-gray-900 leading-tight">
                Nepal
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => {
              const hasItems =
                (item.label === 'ネパールトレッキング' &&
                  (trekkingRegionGroups.length > 0 || trekkingItems.length > 0)) ||
                (item.label === 'ブータン' && topTreksItems.length > 0) ||
                (item.label === '旅行情報' && travelInfoItems.length > 0) ||
                (item.label === '会社について' && companyItems.length > 0)

              if (item.hasDropdown && hasItems) {
                let dropdown: React.ReactNode = null
                if (item.label === 'ネパールトレッキング') {
                  dropdown =
                    trekkingRegionGroups.length > 0 ? (
                      <DestinationsMegaMenu groups={trekkingRegionGroups} />
                    ) : (
                      <TrekDropdown items={trekkingItems} />
                    )
                } else if (item.label === 'ブータン') {
                  dropdown = <TrekDropdown items={topTreksItems} />
                } else if (item.label === '旅行情報') {
                  dropdown = <LinkDropdown items={travelInfoItems} />
                } else if (item.label === '会社について') {
                  dropdown = <LinkDropdown items={companyItems} />
                }

                return (
                  <div key={item.label} className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span className="font-medium text-[15px] text-black group-hover:text-[#3b82f6] transition-colors">
                        {item.label}
                      </span>
                      <ChevronDown className="w-[18px] h-[18px] text-black group-hover:text-[#3b82f6] transition-transform duration-200 group-hover:rotate-180" />
                    </div>
                    {dropdown}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.label === 'ホーム' ? '/' : '#'}
                  className="flex items-center gap-1 cursor-pointer group"
                >
                  <span className="font-medium text-[15px] text-black group-hover:text-[#3b82f6] transition-colors">
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-[18px] h-[18px] text-black group-hover:text-[#3b82f6] transition-colors" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Contact Us — desktop */}
          <div className="hidden lg:block">
            <Link href="/contact-yama-nepal">
              <Button size="lg">お問い合わせ</Button>
            </Link>
          </div>

          {/* Hamburger — mobile/tablet */}
          <button
            className="lg:hidden text-black p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile / Tablet slide-down menu */}
        <div
          className={`absolute top-full left-0 right-0 z-50 lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 sm:px-8 pb-5 overflow-y-auto max-h-[80vh] shadow-md">
            <div className="flex flex-col gap-1 py-3">
              {navItems.map((item) => {
                /* Plain link */
                if (!item.hasDropdown) {
                  return (
                    <NextLink
                      key={item.label}
                      href="/"
                      className="py-2.5 font-medium text-[15px] text-black hover:text-[#3b82f6] transition-colors border-b border-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NextLink>
                  )
                }

                /* Nepal Trekking accordion — regions then treks */
                if (
                  item.label === 'ネパールトレッキング' &&
                  (trekkingRegionGroups.length > 0 || trekkingItems.length > 0)
                ) {
                  const isOpen = openAccordion === 'ネパールトレッキング'
                  return (
                    <div key="ネパールトレッキング" className="border-b border-gray-100">
                      <button
                        className="w-full flex items-center justify-between py-2.5"
                        onClick={() => setOpenAccordion(isOpen ? null : 'ネパールトレッキング')}
                      >
                        <span className="font-medium text-[15px] text-black">
                          ネパールトレッキング
                        </span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? 'max-h-[900px]' : 'max-h-0'
                        }`}
                      >
                        {/* Regions with nested treks */}
                        {trekkingRegionGroups.length > 0 ? (
                          <MobileRegionAccordion
                            groups={trekkingRegionGroups}
                            onNavigate={() => setMobileMenuOpen(false)}
                          />
                        ) : (
                          <div className="pb-3">
                            <div className="bg-white border border-gray-100 rounded shadow-sm">
                              <div className="p-3 flex flex-col sm:grid sm:grid-cols-2 gap-x-6">
                                {trekkingItems.map((trek) => (
                                  <NextLink
                                    key={trek.slug}
                                    href={`/treks/${trek.slug}`}
                                    className="py-1.5 text-[13px] text-slate-700 hover:text-[#3b82f6] transition-colors leading-snug"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {trek.name}
                                    {trek.days ? ` – ${trek.days}` : ''}
                                  </NextLink>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }

                /* Bhutan accordion */
                if (item.label === 'ブータン' && topTreksItems.length > 0) {
                  const isOpen = openAccordion === item.label
                  return (
                    <div key={item.label} className="border-b border-gray-100">
                      <button
                        className="w-full flex items-center justify-between py-2.5"
                        onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                      >
                        <span className="font-medium text-[15px] text-black">{item.label}</span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? 'max-h-[600px]' : 'max-h-0'
                        }`}
                      >
                        <div className="pb-3">
                          <div className="bg-white border border-gray-100 rounded shadow-sm">
                            <div className="p-3 flex flex-col sm:grid sm:grid-cols-2 gap-x-6">
                              {topTreksItems.map((trek) => (
                                <NextLink
                                  key={trek.slug}
                                  href={`/treks/${trek.slug}`}
                                  className="py-1.5 text-[13px] text-slate-700 hover:text-[#3b82f6] transition-colors leading-snug"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {trek.name}
                                  {trek.days ? ` – ${trek.days}` : ''}
                                </NextLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                /* Travel Info / Company accordion */
                const mobileLinkItems: Record<string, LinkDropdownItem[]> = {
                  旅行情報: travelInfoItems,
                  会社について: companyItems,
                }
                if (item.label in mobileLinkItems && mobileLinkItems[item.label]!.length > 0) {
                  const linkList = mobileLinkItems[item.label]!
                  const isOpen = openAccordion === item.label
                  return (
                    <div key={item.label} className="border-b border-gray-100">
                      <button
                        className="w-full flex items-center justify-between py-2.5"
                        onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                      >
                        <span className="font-medium text-[15px] text-black">{item.label}</span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="ml-3 flex flex-col border-l-2 border-gray-100 pl-3 pb-2">
                          {linkList.map((link) => (
                            <NextLink
                              key={link.url}
                              href={link.url}
                              className="py-1.5 text-[14px] text-gray-700 hover:text-[#3b82f6] transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {link.label}
                            </NextLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                /* Dropdown item with no data yet */
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-1 py-2.5 border-b border-gray-100"
                  >
                    <span className="font-medium text-[15px] text-black">{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-[18px] h-[18px] text-black" />}
                  </div>
                )
              })}

              <div className="pt-3">
                <Link href="/contact-yama-nepal" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

/* ─────────────────────────────────────────────────
   Mobile: nested region → trek accordion
───────────────────────────────────────────────── */
function MobileRegionAccordion({
  groups,
  onNavigate,
}: {
  groups: TrekRegionGroup[]
  onNavigate: () => void
}) {
  const [openRegions, setOpenRegions] = useState<Set<string>>(new Set())

  const toggleRegion = (slug: string) => {
    setOpenRegions((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  return (
    <div className="pb-3">
      {groups.map((group) => {
        const isOpen = openRegions.has(group.regionSlug)
        return (
          <div key={group.regionSlug}>
            <button
              className={`w-full flex items-center justify-between px-2 py-2 rounded-sm transition-colors ${
                isOpen
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => toggleRegion(group.regionSlug)}
            >
              <span
                className={`text-[14px] transition-colors ${
                  isOpen ? 'font-medium text-gray-900' : 'font-medium'
                }`}
              >
                {group.regionName}
              </span>
              {group.treks.length > 0 && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {group.treks.length > 0 && (
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="mb-2 bg-white border border-gray-100 rounded shadow-sm">
                  {/* <p className="px-4 pt-3 pb-2 text-[13px] font-semibold text-[#020617] border-b border-gray-50">
                    {group.regionName}
                  </p> */}
                  <div className="p-3 flex flex-col sm:grid sm:grid-cols-2 gap-x-6">
                    {group.treks.map((trek) => (
                      <NextLink
                        key={trek.slug}
                        href={`/treks/${trek.slug}`}
                        className="py-1.5 text-[14px] text-slate-700 hover:text-[#3b82f6] transition-colors leading-snug"
                        onClick={onNavigate}
                      >
                        {trek.name}
                        {trek.days ? ` – ${trek.days}` : ''}
                      </NextLink>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
