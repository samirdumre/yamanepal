// components/WhyChooseUs.tsx

import Image from 'next/image'
import { SectionHeading } from '../ui/SectionLabel'

// ─── SVG Paths ───────────────────────────────────────────────────────────────
const svgPaths = {
  p184ba090:
    'M18.6667 24.5V22.1667C18.6667 20.929 18.175 19.742 17.2998 18.8668C16.4247 17.9917 15.2377 17.5 14 17.5H7C5.76232 17.5 4.57534 17.9917 3.70017 18.8668C2.825 19.742 2.33333 20.929 2.33333 22.1667V24.5',
  p1b228440:
    'M23.3333 15.1667C23.3333 21 19.25 23.9167 14.3967 25.6083C14.1425 25.6945 13.8665 25.6903 13.615 25.5967C8.75 23.9167 4.66667 21 4.66667 15.1667V7C4.66667 6.69058 4.78958 6.39384 5.00838 6.17504C5.22717 5.95625 5.52391 5.83333 5.83333 5.83333C8.16667 5.83333 11.0833 4.43333 13.1133 2.66C13.3605 2.44883 13.6749 2.33281 14 2.33281C14.3251 2.33281 14.6395 2.44883 14.8867 2.66C16.9283 4.445 19.8333 5.83333 22.1667 5.83333C22.4761 5.83333 22.7728 5.95625 22.9916 6.17504C23.2104 6.39384 23.3333 6.69058 23.3333 7V15.1667Z',
  p25f79f00:
    'M18.6667 3.65167C19.6705 3.90868 20.5602 4.49248 21.1956 5.31103C21.8309 6.12957 22.1758 7.1363 22.1758 8.1725C22.1758 9.2087 21.8309 10.2154 21.1956 11.034C20.5602 11.8525 19.6705 12.4363 18.6667 12.6933',
  p2f1426c0:
    'M25.6667 24.5V22.1667C25.6659 21.1327 25.3217 20.1282 24.6883 19.311C24.0548 18.4938 23.1678 17.9102 22.1667 17.6517',
  p57f3600:
    'M22.1667 4.66667H5.83333C4.54467 4.66667 3.5 5.71134 3.5 7V23.3333C3.5 24.622 4.54467 25.6667 5.83333 25.6667H22.1667C23.4553 25.6667 24.5 24.622 24.5 23.3333V7C24.5 5.71134 23.4553 4.66667 22.1667 4.66667Z',
  p5d36b00:
    'M10.5 12.8333C13.0773 12.8333 15.1667 10.744 15.1667 8.16667C15.1667 5.58934 13.0773 3.5 10.5 3.5C7.92267 3.5 5.83333 5.58934 5.83333 8.16667C5.83333 10.744 7.92267 12.8333 10.5 12.8333Z',
  pcd14e00:
    'M3.5 16.3333H7C7.61884 16.3333 8.21233 16.5792 8.64992 17.0168C9.0875 17.4543 9.33333 18.0478 9.33333 18.6667V22.1667C9.33333 22.7855 9.0875 23.379 8.64992 23.8166C8.21233 24.2542 7.61884 24.5 7 24.5H5.83333C5.2145 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V14C3.5 11.2152 4.60625 8.54451 6.57538 6.57538C8.54451 4.60625 11.2152 3.5 14 3.5C16.7848 3.5 19.4555 4.60625 21.4246 6.57538C23.3938 8.54451 24.5 11.2152 24.5 14V22.1667C24.5 22.7855 24.2542 23.379 23.8166 23.8166C23.379 24.2542 22.7855 24.5 22.1667 24.5H21C20.3812 24.5 19.7877 24.2542 19.3501 23.8166C18.9125 23.379 18.6667 22.7855 18.6667 22.1667V18.6667C18.6667 18.0478 18.9125 17.4543 19.3501 17.0168C19.7877 16.5792 20.3812 16.3333 21 16.3333H24.5',
}

// ─── 🖼️ IMAGE PLACEHOLDERS — replace these with your actual image paths ───────
const IMAGE_TRAVEL_PLANNING = '/images/annapurna4.jpg'
const IMAGE_HIKER_SCENIC_ROCK = '/images/langtang1.jpg'
const IMAGE_FAMILY_TRAVELERS = '/images/camping.jpg'

// ─── Sub-components ──────────────────────────────────────────────────────────

// function Divider() {
//   return <div className="w-11 h-px bg-[#0CB6D8] shrink-0" />
// }

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundImage: 'linear-gradient(135deg, rgb(0, 211, 243) 0%, rgb(43, 127, 255) 100%)',
      }}
      className="flex items-center justify-center rounded-full size-11 shrink-0"
    >
      <svg className="size-[22px]" fill="none" viewBox="0 0 28 28">
        {children}
      </svg>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-[#dbeafe] rounded-3xl p-4 flex flex-col gap-2 w-full">
      <IconCircle>{icon}</IconCircle>
      <h3 className="font-['Arial',sans-serif] font-bold text-[#101828] text-lg">{title}</h3>
      <p className="font-['Arial',sans-serif] text-[#4a5565] text-sm leading-[21px]">
        {description}
      </p>
    </div>
  )
}

function ImageCard({
  src,
  alt = '',
  className = '',
}: {
  src: string
  alt?: string
  className?: string
}) {
  return (
    <div className={`relative rounded-3xl overflow-hidden w-full shrink-0 ${className}`}>
      <Image fill unoptimized sizes="(max-width: 1024px) 100vw, 33vw" src={src} alt={alt} className="object-cover" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhyChooseUs() {
  return (
    <div className="flex flex-col items-center max-w-[1320px]">
      {/* Header */}
      <div className="flex flex-col items-center">
        <SectionHeading
          align="center"
          label="選ばれる理由"
          labelPosition="both"
          title="なぜヤマネパール？"
        />
      </div>

      {/* Content Grid */}
      <div className="bg-white w-full max-w-[1320px] flex justify-center mt-4 md:mt-6 lg:mt-8  overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-5 max-w-[1320px] w-full px-4">
          {/* Left Column */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-col gap-3 lg:gap-5 flex-1 justify-center">
            <FeatureCard
              icon={
                <>
                  <path
                    d={svgPaths.p184ba090}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d={svgPaths.p5d36b00}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d={svgPaths.p2f1426c0}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d={svgPaths.p25f79f00}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                </>
              }
              title="厳選されたパッケージ"
              description="お客様のご要望に合わせた丁寧な旅程設計。"
            />
            <FeatureCard
              icon={
                <path
                  d={svgPaths.pcd14e00}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
              }
              title="24時間サポート"
              description="旅のあらゆる場面で、いつでもどこでもサポートいたします。"
            />
            {/* 🖼️ IMAGE SLOT 1 — Travel Planning photo */}
            <ImageCard src={IMAGE_TRAVEL_PLANNING} alt="旅行の計画" className="h-[154px]" />
          </div>

          {/* Center Column — Hero Image */}
          {/* 🖼️ IMAGE SLOT 2 — Hiker at scenic rock formation (hero/tall image) */}
          <div className="relative flex-[0.80] rounded-3xl overflow-hidden shrink-0 order-first lg:order-none h-64 md:h-80 md:col-span-2 lg:h-auto">
            <Image
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={IMAGE_HIKER_SCENIC_ROCK}
              alt="景観の良い岩場のハイカー"
              className="object-cover"
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-col gap-5 flex-1 justify-center">
            {/* 🖼️ IMAGE SLOT 3 — Family travelers photo */}
            <ImageCard src={IMAGE_FAMILY_TRAVELERS} alt="家族旅行" className="h-[154px]" />
            <FeatureCard
              icon={
                <>
                  <path
                    d="M9.33333 2.33333V7"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d="M18.6667 2.33333V7"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d={svgPaths.p57f3600}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                  <path
                    d="M3.5 11.6667H24.5"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.33333"
                  />
                </>
              }
              title="簡単予約"
              description="安心・安全な予約手続き。100%満足保証。"
            />
            <FeatureCard
              icon={
                <path
                  d={svgPaths.p1b228440}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.33333"
                />
              }
              title="最高の旅行ガイド"
              description="あなたの安全を第一に考える地元ガイド。"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
