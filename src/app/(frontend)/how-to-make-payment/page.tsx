import { ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import { buildJapaneseAlternates } from '@/utilities/alternates'

interface SectionProps {
  title: string
  paragraphs: string[]
}

function Section({ title, paragraphs }: SectionProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className=" text-[#020617] text-[24px] font-semibold tracking-[-0.8px]">{title}</h2>
      <div className=" text-black text-[16px] leading-[29px]">
        {paragraphs.map((p, i) => (
          <p key={i} className={i < paragraphs.length - 1 ? 'mb-0' : ''}>
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'How to make payment to Yama Nepal Trek (ヤマ・ネパール・トレック)',
  alternates: buildJapaneseAlternates('/how-to-make-payment'),
}

export default function HowToMakePayment() {
  const sections: SectionProps[] = [
    {
      title: 'お支払い方法',
      paragraphs: [
        'Yama Nepal Trek (ヤマ・ネパール・トレック) は、ネパールで信頼される旅行会社として、ネパールトレッキング、ネパール周遊パッケージ、文化ツアー、野生動物サファリ、アドベンチャーホリデー、そしてヒマラヤ各地へのオーダーメイド旅行を提供しています。',
        '私たちは、一人旅、カップル、家族、グループなど、あらゆる旅行者の皆さまに、安全で綿密に計画された本物志向の旅を通してネパールの魅力をお届けします。代表的なヒマラヤのトレッキングルートや古代遺産から、静かな村々、国立公園、スピリチュアルな聖地まで、ネパールの真の美しさと多様性を体感できる旅をつくります。',
        '私たちのチームは、楽しいだけでなく心に残る意味のある旅を提供することに情熱を注いでいます。豊富な地域知識、きめ細やかなサービス、そして責任ある観光への取り組みにより、Yama Nepalはすべての旅がスムーズで忘れられないものとなり、ネパールの人々・文化・風景と深くつながる体験になるよう努めています。',
      ],
    },
  ]

  const sectionsAfterImage: SectionProps[] = [
    {
      title: '私たちのビジョン',
      paragraphs: [
        '私たちのビジョンは、安全で本物志向、そして責任ある旅で知られるネパール有数の旅行会社になることです。ヒマラヤでの冒険、文化的な旅、スピリチュアルな体験、そして地域に深く触れるプログラムを通して、旅行者の皆さまにネパールの魅力を最大限に届けることを目指しています。',
        '私たちは、観光は関わるすべての人に価値を生み出すべきだと考えています。旅行者に感動を与え、地域社会を支え、文化を尊重し、ネパールの自然の美しさを守ることが大切です。そのため、より深いつながりと丁寧な探求を促す責任ある旅のあり方を推進しています。',
        'Yama NepalTrek が成長するこれからも、質の高いサービス、信頼できる案内、そして意義あるネパール旅行の高い基準を追求し続けます。私たちのビジョンは、ネパールを訪れていただくだけでなく、ネパールを本当に体験していただくことです。',
      ],
    },
    {
      title: '私たちのミッション',
      paragraphs: [
        '私たちのミッションは、安全性、サービス品質、本物らしさ、柔軟性を重視しながら、高品質なネパールツアーとトレッキングパッケージを提供することです。旅行者一人ひとりの興味、旅のスタイル、日程、快適さに合わせて、綿密に計画した旅程とオーダーメイドのツアーパッケージを設計します。',
        '経験豊富な現地ガイド、信頼できるドライバー、宿泊パートナー、地域に根ざしたサービスと連携することで、すべての旅を快適でスムーズ、かつ文化的に豊かな体験へと高めています。短期旅行、遺産巡り、野生動物体験、長期のヒマラヤトレッキングまで、細部にまで配慮し、旅行者の皆さまが旅そのものを楽しめるようにしています。',
        'Yama Nepal Trek (ヤマ・ネパール・トレック) は、ネパールにおける責任ある観光にも力を入れています。旅は旅行者と地域社会の双方に良い影響をもたらすべきだと考え、敬意ある文化交流、地域雇用、環境に配慮した旅行体験を支援しています。私たちは、企画するすべての旅を通して、忘れられない思い出を生み出すと同時に、ネパール観光の長期的な価値向上に貢献することを使命としています。',
      ],
    },
  ]

  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="w-full h-[290px]  lg:h-[567px] overflow-hidden relative">
        <img
          alt="ネパールの山岳風景"
          className="absolute w-full h-full object-cover"
          src="/images/coverimage.avif"
        />
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4">
          <span className=" text-[#0cb6d8] text-[14px]">ホーム</span>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className=" text-[#0cb6d8] text-[14px]">お支払い方法</span>
        </div>

        {/* How to Make Payment */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 w-full">
            <h2 className=" text-[#020617] text-[24px] font-semibold">お支払い方法</h2>
            <div className=" text-black text-[16px] leading-[28px]">
              <h3 className="font-semibold mb-2">SWIFT送金:</h3>
              <div>
                受取人: Yama Nepal Trek & Expedition Pvt.Ltd. (ヤマ・ネパール・トレック) (Shanta
                Bahadur Pun) <br />
                口座番号: 3100310374600001 <br /> 口座名義: Shanta Bahadur Pun <br />
                取扱銀行: Kumari Bank Ltd <br /> 支店名: Dallu Branch, Kathmandu Nepal <br />
                <div className="flex gap-1">
                  <p className="font-semibold">SWIFTコード:</p>
                  <p>KMBLNPKA</p>
                </div>
              </div>
              <div className="mt-2">（振込に伴う銀行手数料はお客様のご負担となります。）</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
