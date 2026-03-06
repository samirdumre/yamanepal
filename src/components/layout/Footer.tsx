import Image from 'next/image'

// ============================================================
// IMAGE PLACEHOLDERS — replace these paths with your actual images
// ============================================================
const IMAGES = {
  footerMountain1: '/images/footer-image.png', // Background mountain layer 1
  qrContact: '/images/qrcontact.jpeg', // QR code for contact
  avatarNepal: '/images/shantamagar.jpeg', // Nepal contact person avatar
  avatarJapan: '/images/shantamagar.jpeg', // Japan contact person avatar
}
// ============================================================

const quickLinks = ['Home', 'Destinations', 'Activities', 'Travel Guide', 'Company']
const destinations = [
  'Everest Region',
  'Langtang Region',
  'Chitwan Region',
  'Annapurna Region',
  'Kathmandu',
]

const contacts = [
  {
    country: 'NEPAL',
    name: 'Shanta Magar',
    phone: '+977 9866937865',
    avatar: IMAGES.avatarNepal,
  },
  {
    country: 'JAPAN',
    name: 'Nisesh Magar',
    phone: '+81 9866937865',
    avatar: IMAGES.avatarJapan,
  },
]

export function Footer() {
  return (
    <footer
      className="relative w-full flex  flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mountain silhouette images — stacked absolutely on top of each other */}
      <div className="relative w-full aspect-[2160/453]">
        <Image
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          src={IMAGES.footerMountain1}
          width={1440}
          height={250}
          style={{ backgroundColor: '#ffffff' }}
        />

        {/* Overlay — only paints over non-transparent pixels of the PNG */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: '#020617',
            maskImage: `url(${IMAGES.footerMountain1})`,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            // Safari support
            WebkitMaskImage: `url(${IMAGES.footerMountain1})`,
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }}
        />
      </div>

      {/* Footer content */}
      <div className="relative z-10 bg-[#020617] w-full pt-16 pb-0 mt-[-88px]">
        <div className="max-w-[1256px] mx-auto px-6">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-0">
            {/* Brand column */}
            <div className="flex flex-col gap-4 md:col-span-2">
              <h2 className="text-white text-[24px] tracking-[0.5px]" style={{ fontWeight: 600 }}>
                YAMA NEPAL
              </h2>
              <div className="flex flex-col gap-3">
                <p className="text-[#e2e8f0] text-[14px]">Location: Swayambhu, Nepal</p>
                <p className="text-[#e2e8f0] text-[14px]">
                  Email:{' '}
                  <a
                    href="mailto:info@yamatravel.com"
                    className="hover:text-white transition-colors"
                  >
                    info@yamatravel.com
                  </a>
                </p>
              </div>
              <div className="w-[218px] h-[218px] mt-2">
                <img
                  alt="QR Contact"
                  className="w-full h-full object-cover"
                  src={IMAGES.qrContact}
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                Quick Links
              </h3>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[#d1d5dc] text-[14px] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                Destinations
              </h3>
              <ul className="flex flex-col gap-2.5">
                {destinations.map((dest) => (
                  <li key={dest}>
                    <a
                      href="#"
                      className="text-[#d1d5dc] text-[14px] hover:text-white transition-colors"
                    >
                      {dest}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                Contact
              </h3>
              <div className="flex flex-col gap-4">
                {contacts.map((contact) => (
                  <div key={contact.country} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                      <img
                        alt={contact.name}
                        className="w-full h-full object-cover"
                        src={contact.avatar}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[#e2e8f0] text-[14px]" style={{ fontWeight: 600 }}>
                        {contact.country}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>
                          {contact.name}
                        </span>
                        <span className="text-[#e2e8f0] text-[18px]">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 mb-4 text-center">
            <p className="text-[#e2e8f0] text-[14px]">
              © {new Date().getFullYear()} Yama Nepal . All Rights Reserved
            </p>
          </div>

          {/* Large brand text */}
          {/* <div className="mt-6 overflow-hidden h-[155px] flex items-start justify-center">
            <p
              className="text-[180px] text-center tracking-[-4.5px] bg-clip-text text-transparent whitespace-nowrap"
              style={{
                fontWeight: 700,
                lineHeight: '180px',
                backgroundImage:
                  'linear-gradient(to bottom, rgb(74, 74, 74) 0%, rgb(26, 26, 26) 50%, rgba(0, 0, 0, 0) 100%)',
              }}
            >
              YAMA NEPAL
            </p>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
