'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
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
  { label: 'Home', hasDropdown: false },
  { label: 'Destinations', hasDropdown: true },
  { label: 'Top Treks', hasDropdown: true },
  { label: 'Travel Info', hasDropdown: true },
  { label: 'Company', hasDropdown: true },
]

function TrekDropdown({ items }: { items: TrekkingDropdownItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="absolute top-full hidden group-hover:block pt-2 z-50 min-w-[260px]">
      <div className="bg-white rounded-xs shadow-lg border border-gray-100 py-1 overflow-hidden divide-y divide-gray-100">
        {items.map((trek) => (
          <NextLink
            key={trek.slug}
            href={`/treks/${trek.slug}`}
            className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-gray-50 transition-colors group/item"
          >
            <span className="text-[14px] font-medium text-gray-800 group-hover/item:text-[#3b82f6] transition-colors">
              {trek.name}
            </span>
            <span className="text-[12px] text-gray-400 shrink-0">{trek.days}</span>
          </NextLink>
        ))}
      </div>
    </div>
  )
}

function TrekRegionDropdown({ groups }: { groups: TrekRegionGroup[] }) {
  if (groups.length === 0) return null
  return (
    <div className="absolute top-full hidden group-hover:block pt-2 z-50 min-w-[240px]">
      <div className="bg-white rounded-xs shadow-lg border border-gray-100 py-1 overflow-hidden divide-y divide-gray-100">
        {groups.map((group) => (
          <NextLink
            key={group.regionSlug}
            href={`/regions/${group.regionSlug}`}
            className="block px-4 py-2.5 text-[14px] font-medium text-gray-800 hover:bg-gray-50 hover:text-[#3b82f6] transition-colors"
          >
            {group.regionName}
          </NextLink>
        ))}
      </div>
    </div>
  )
}

function LinkDropdown({ items }: { items: LinkDropdownItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="absolute top-full hidden group-hover:block pt-2 z-50 min-w-[220px]">
      <div className="bg-white rounded-xs shadow-lg border border-gray-100 py-1 overflow-hidden divide-y divide-gray-100">
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
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-1 flex items-center justify-between">
           <Link href="/">
          <Image
            src="/images/logo.jpeg"
            alt="Logo"
            width={88}
            height={88}
            className="hidden lg:block"
            />
            </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const dropdownMap: Record<string, React.ReactNode> = {
                Destinations:
                  trekkingRegionGroups.length > 0 ? (
                    <TrekRegionDropdown groups={trekkingRegionGroups} />
                  ) : (
                    <TrekDropdown items={trekkingItems} />
                  ),
                'Top Treks': <TrekDropdown items={topTreksItems} />,
                'Travel Info': <LinkDropdown items={travelInfoItems} />,
                Company: <LinkDropdown items={companyItems} />,
              }
              const dropdown = dropdownMap[item.label]
              const hasItems =
                (item.label === 'Destinations' &&
                  (trekkingRegionGroups.length > 0 || trekkingItems.length > 0)) ||
                (item.label === 'Top Treks' && topTreksItems.length > 0) ||
                (item.label === 'Travel Info' && travelInfoItems.length > 0) ||
                (item.label === 'Company' && companyItems.length > 0)

              if (item.hasDropdown && hasItems) {
                return (
                  <div key={item.label} className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span className="font-medium text-[15px] text-black group-hover:text-[#3b82f6] transition-colors hover:cursor-pointer">
                        {item.label}
                      </span>
                      <ChevronDown className="w-[18px] h-[18px] text-black group-hover:text-[#3b82f6] transition-transform duration-200 group-hover:rotate-180" />
                    </div>
                    {dropdown}
                  </div>
                )
              }

              return (
                <div key={item.label} className="flex items-center gap-1 cursor-pointer group">
                  <span className=" font-medium text-[15px] text-black group-hover:text-[#3b82f6] transition-colors">
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-[18px] h-[18px] text-black group-hover:text-[#3b82f6] transition-colors hover:cursor-pointer" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="hidden lg:block">
            <Link href="/contact-yama-nepal">
            <Button size="lg">Contact Us</Button>
            </Link>
          </div>

          <button
            className="lg:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-5 absolute w-full left-0 shadow-md z-50">
            <div className="flex flex-col gap-4 py-4">
              {navItems.map((item) => {
                // Handle Destinations separately to support region grouping
                if (
                  item.label === 'Destinations' &&
                  (trekkingRegionGroups.length > 0 || trekkingItems.length > 0)
                ) {
                  const isOpen = openAccordion === 'Destinations'
                  return (
                    <div key="Destinations">
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setOpenAccordion(isOpen ? null : 'Destinations')}
                      >
                        <span className="font-medium text-[15px] text-black">Destinations</span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 hover:cursor-pointer ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      {isOpen && (
                        <div className="mt-2 ml-3 flex flex-col border-l-2 border-gray-100 pl-3">
                          {trekkingRegionGroups.length > 0
                            ? trekkingRegionGroups.map((group) => (
                                <NextLink
                                  key={group.regionSlug}
                                  href={`/regions/${group.regionSlug}`}
                                  className="py-1.5 text-[14px] font-medium text-gray-700 hover:text-[#3b82f6] transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {group.regionName}
                                </NextLink>
                              ))
                            : trekkingItems.map((trek) => (
                                <NextLink
                                  key={trek.slug}
                                  href={`/treks/${trek.slug}`}
                                  className="py-1.5 flex items-center gap-1.5 text-[14px] text-gray-700 hover:text-[#3b82f6] transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span>{trek.name}</span>
                                  <span className="text-gray-400 text-[12px]">{trek.days}</span>
                                </NextLink>
                              ))}
                        </div>
                      )}
                    </div>
                  )
                }

                const mobileTrekItems: Record<string, TrekkingDropdownItem[]> = {
                  'Top Treks': topTreksItems,
                }
                const mobileLinkItems: Record<string, LinkDropdownItem[]> = {
                  'Travel Info': travelInfoItems,
                  Company: companyItems,
                }

                if (item.label in mobileTrekItems && mobileTrekItems[item.label]!.length > 0) {
                  const trekList = mobileTrekItems[item.label]!
                  const isOpen = openAccordion === item.label
                  return (
                    <div key={item.label}>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                      >
                        <span className="font-medium text-[15px] text-black">{item.label}</span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 hover:cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                      {isOpen && (
                        <div className="mt-2 ml-3 flex flex-col border-l-2 border-gray-100 pl-3">
                          {trekList.map((trek) => (
                            <NextLink
                              key={trek.slug}
                              href={`/treks/${trek.slug}`}
                              className="py-1.5 flex items-center gap-1.5 text-[14px] text-gray-700 hover:text-[#3b82f6] transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{trek.name}</span>
                              <span className="text-gray-400 text-[12px]">{trek.days}</span>
                            </NextLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                if (item.label in mobileLinkItems && mobileLinkItems[item.label]!.length > 0) {
                  const linkList = mobileLinkItems[item.label]!
                  const isOpen = openAccordion === item.label
                  return (
                    <div key={item.label}>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                      >
                        <span className="font-medium text-[15px] text-black">{item.label}</span>
                        <ChevronDown
                          className={`w-[18px] h-[18px] text-black transition-transform duration-200 hover:cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                      {isOpen && (
                        <div className="mt-2 ml-3 flex flex-col border-l-2 border-gray-100 pl-3">
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
                      )}
                    </div>
                  )
                }

                return (
                  <div key={item.label} className="flex items-center gap-1 cursor-pointer">
                    <span className="font-medium text-[15px] text-black">{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-[18px] h-[18px] text-black hover:cursor-pointer" />
                    )}
                  </div>
                )
              })}
              <Button className="w-full">Contact Us</Button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
