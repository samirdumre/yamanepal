'use client'

import { useState } from 'react'
import { ChevronDown, MapPin, Menu, X, Phone } from 'lucide-react'
import { Button } from '../ui/button'

const navItems = [
  { label: 'Home', hasDropdown: false },
  { label: 'Destinations', hasDropdown: true },
  { label: 'Activities', hasDropdown: true },
  { label: 'Travel Info', hasDropdown: true },
  { label: 'Company', hasDropdown: true },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Top Bar */}
      {/* <div className="hidden lg:flex w-full h-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-70 bg-[#020617] justify-between items-center">
        <div className="flex justify-start items-center gap-4 lg:gap-10"> */}
          {/* Phone Numbers */}
          {/* <div className="flex justify-center items-center gap-1">
            <Phone className="w-4 h-4 text-white" />
            <div className="justify-start text-white text-xs lg:text-sm font-normal">
              +977 9841355452 / 9849325245
            </div>
          </div> */}

          {/* Location */}
          {/* <div className="flex justify-center items-center gap-1">
            <MapPin className="w-4 h-4 text-white" />
            <div className="justify-start text-white text-xs lg:text-sm font-normal">
              Syambhu, Kathmandu
            </div>
          </div>
        </div> */}

        {/* Tagline */}
        {/* <div className="hidden xl:flex justify-center items-center gap-1">
          <div className="justify-start text-white text-sm font-normal">
            +808438423 
          </div>
        </div>
      </div> */}

      <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
          <span className="font-['Inter',sans-serif] font-bold text-[32px] md:text-[40px] text-black">
            YAMA.
          </span>
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1 cursor-pointer group">
                <span className="font-['Inter',sans-serif] font-medium text-[15px] text-black group-hover:text-[#3b82f6] transition-colors">
                  {item.label}
                </span>
                {item.hasDropdown && (
                  <ChevronDown className="w-[18px] h-[18px] text-black group-hover:text-[#3b82f6] transition-colors" />
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <Button size="lg">Contact Us</Button>
          </div>
          <button
            className="lg:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-5 absolute w-full left-0 shadow-md">
            <div className="flex flex-col gap-4 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1 cursor-pointer">
                  <span className="font-medium text-[15px] text-black">{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-[18px] h-[18px] text-black" />}
                </div>
              ))}
              <Button className="w-full">Contact Us</Button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
