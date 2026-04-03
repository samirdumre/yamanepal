import Image from 'next/image'
import Link from 'next/link'

// ============================================================
// IMAGE PLACEHOLDERS — replace these paths with your actual images
// ============================================================
const IMAGES = {
  footerMountain1: '/images/footer-image.webp', // Background mountain layer 1
  qrContact: '/images/qrcontact.webp', // QR code for contact
  avatarNepal: '/images/shantamagar.webp', // Nepal contact person avatar
  avatarJapan: '/images/shantamagar.webp', // Japan contact person avatar
}
// ============================================================

const quickLinks = [
  { label: 'ホーム', href: '/' },
  { label: '会社概要', href: '/about-yama-nepal' },
  { label: 'ブログ', href: '/posts' },
  { label: 'お支払い情報', href: '/how-to-make-payment' },
  { label: 'お問い合わせ', href: '/contact-yama-nepal' },
]

const destinations = [
  { label: 'エベレスト地域', href: '/regions/everest-region' },
  { label: 'ランタン地域', href: '/regions/langtang-region' },
  { label: 'ファミリーツアー', href: '/regions/family-tour' },
  { label: 'アンナプルナ地域', href: '/regions/annapurna-region' },
  { label: 'ドルパ地方', href: '/regions/dolpa-region' },
]

const contacts = [
  {
    country: 'ネパール',
    name: 'マガル　サンタ',
    phone: '+977-9866937865',
    avatar: IMAGES.avatarNepal,
  },
  // {
  //   country: '日本',
  //   name: 'ビマル マガル',
  //   phone: '+080-96321073',
  //   avatar: IMAGES.avatarJapan,
  // },
]

export function Footer() {
  return (
    <footer
      className="relative w-full flex  flex-col pt-10 bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mountain silhouette images — stacked absolutely on top of each other */}
      <div className="relative w-full aspect-[2160/453] min-h-[60px] lg:aspect-[4320/453]">
        <Image
          alt=""
          className="absolute inset-0 w-full object-cover"
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
            WebkitMaskImage: `url(${IMAGES.footerMountain1})`,
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }}
        />
      </div>

      {/* Footer content */}
      <div className="relative z-10 bg-[#020617] w-full pt-12 pb-0 mt-[-35px] sm:mt-[-50px] md:mt-[-70px] lg:mt-[-44px] lg:pt-16">
        <div className="max-w-[1256px] mx-auto px-6">
          {/* Main grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0">
            {/* Brand column */}
            <div className="flex flex-col gap-2.5 col-span-2">
              <h2 className="text-white text-[24px] tracking-[0.5px]" style={{ fontWeight: 600 }}>
                日本へのお問い合わせ
              </h2>
              <div className="flex flex-col gap-2.5">
                {/* <p className="text-[#e2e8f0] text-[14px]">所在地: ネパール・スワヤンブー</p> */}
                <p className="text-[#e2e8f0] text-[14px]">
                  メール:{' '}
                  <a
                    href="mailto:bimalgm336@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    bimalgm336@gmail.com
                  </a>
                </p>
                <div className="text-[#e2e8f0] text-[18px]">携帯番号: +080-96321073</div>
              </div>
              <div className="relative w-[218px] h-[218px] mt-2">
                <Image
                  fill
                  sizes="218px"
                  alt="連絡先QRコード"
                  className="object-cover"
                  src={IMAGES.qrContact}
                />
              </div>
            </div>
            {/* Quick Links */}

            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                クイックリンク
              </h3>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#d1d5dc] text-[14px] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                目的地
              </h3>
              <ul className="flex flex-col gap-2.5">
                {destinations.map((dest) => (
                  <li key={dest.href}>
                    <Link
                      href={dest.href}
                      className="text-[#d1d5dc] text-[14px] hover:text-white transition-colors"
                    >
                      {dest.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h3 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                ネパールへのお問い合わせ
              </h3>
              <div className="flex flex-col gap-4">
                {contacts.map((contact) => (
                  <div key={contact.country} className="flex gap-3 items-center">
                    {/* <div className="relative h-14 w-14 md:w-16 md:h-16 rounded-full ring-2 ring-white overflow-hidden shrink-0">
                      <Image
                        fill
                        alt={contact.name}
                        className="object-cover "
                        src={contact.avatar}
                      />
                    </div> */}
                    <div className="flex flex-col gap-2.5">
                      <p className="text-[#e2e8f0] text-[14px]" style={{ fontWeight: 600 }}>
                        {contact.country}
                      </p>
                      <div className="flex items-center gap-0.5 flex-wrap">
                        <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>
                          {contact.name}
                        </span>
                      </div>
                      <a href="mailto:yamanepal633@gmail.com" className="text-[#e2e8f0]">
                        yamanepal633@gmail.com
                      </a>
                      <span className="text-[#e2e8f0] text-[18px]">{contact.phone}</span>
                      <span className="text-[#e2e8f0] text-[14px]">
                        所在地: ネパール・スワヤンブー
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Copyright */}=
          <div className="mt-8 mb-4 flex flex-col items-center gap-2 md:grid md:grid-cols-3 md:items-center md:gap-0">
            {/* Empty spacer — mirrors the right column's width to keep copyright truly centered */}
            <div className="hidden md:block" />

            <p className="text-[#e2e8f0] text-[14px] text-center whitespace-nowrap">
              © {new Date().getFullYear()} Yama Nepal Trek & Expedition Pvt. Ltd. All rights
              reserved.
            </p>

            <p className="text-[#e2e8f0] text-[14px] text-center md:text-right">
              Website by{' '}
              <a
                href="https://www.atomikweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0cb6d8] hover:underline"
              >
                AtomikWeb
              </a>
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
