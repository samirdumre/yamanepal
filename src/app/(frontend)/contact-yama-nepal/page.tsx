import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import Map from '@/components/ui/Map'
import { ContactInquiryForm } from '@/components/sections/ContactInquiryForm'

const contactDetails = [
  {
    icon: Phone,
    title: '電話',
    lines: ['+080-96321073', '+977-9743290500'],
  },
  {
    icon: Mail,
    title: 'メール',
    lines: ['yamanepal633@gmail.com'],
  },
  {
    icon: MapPin,
    title: '所在地',
    lines: ['カトマンズ、スワヤンブ'],
  },
  {
    icon: Clock,
    title: '営業時間',
    lines: ['月曜日 - 土曜日: 午前7:00 - 午後7:00', '日曜日: 午前8:00 - 午後5:00'],
  },
]

const ContactSection = () => {
  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="w-full h-[290px] lg:h-[567px] overflow-hidden relative">
        <img
          alt="ネパールの山岳風景"
          className="absolute w-full h-full object-cover"
          src="/images/coverimage.jpg"
        />
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-[#0cb6d8] text-[14px]">ホーム</span>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#0cb6d8] text-[14px]">お問い合わせ</span>
        </div>

        {/* ── Get in Touch ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center pb-10">
          {/* Left – Contact Information */}
          <div className="flex flex-col gap-5 sm:gap-5">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">
                お問い合わせ
              </h2>
              <p className="text-black text-[17px] leading-[30px]">
                トレッキング、ツアー、旅行に関するあらゆるご相談をお手伝いします。
              </p>
            </div>

            {/* Contact Detail Items */}
            <div className="flex flex-col gap-3 md:gap-5">
              {contactDetails.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#dbeafe] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#020617]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-black text-lg sm:text-xl font-semibold">{title}</h3>
                    {lines.map((line) => (
                      <p key={line} className="text-zinc-950/80 text-[16px] leading-[29px]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {/* <a href="tel:9849289569" className="xl:hidden mt-2 md:mt-4">
              <Button>お電話はこちら</Button>
            </a> */}
          </div>

          {/* Right – Inquiry Form */}
          <ContactInquiryForm />
        </div>
      </div>

      {/* ── Find Us ── full-width gradient band */}
      <div className="w-full bg-gradient-to-b from-[#DBEAFE80] to-white py-14 pb-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-4 text-center">
            <h2 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">アクセス</h2>
            <p className="text-black text-[16px] leading-[29px] max-w-2xl mx-auto">
              カトマンズのスワヤンブに位置し、
              皆さまの旅行プランをサポートできるよう準備しております。
            </p>
          </div>

          {/* Map */}
          <Map />
        </div>
      </div>
    </div>
  )
}

export default ContactSection
