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
  title: 'About Yama Nepal Trek (ヤマ・ネパール・トレック)',
  description:
    'ネパール旅行会社ヤマ・ネパール・トレックの紹介ページ。日本語対応ガイドによるネパール トレッキング ツアー、ヒマラヤ トレッキング ツアー、オーダーメイド手配、安全で丁寧な安心サポートを提供しています。',
  alternates: buildJapaneseAlternates('/about-yama-nepal'),
}

export default function About() {
  const sections: SectionProps[] = [
    {
      title: 'ネパール旅行会社としての私たちについて',
      paragraphs: [
        'Yama Nepal Trek (ヤマ・ネパール・トレック) は、ネパール旅行会社として実績を重ね、ネパール トレッキング ツアー、ネパール 観光 おすすめコース、文化体験、野生動物サファリ、ヒマラヤ トレッキング ツアー、そしてネパール 個人旅行 手配まで幅広く提供しています。',
        '私たちは、一人旅、カップル、家族、グループなど、あらゆる旅行者の皆さまに、安全で綿密に計画された本物志向の旅を通してネパールの魅力をお届けします。代表的なヒマラヤのトレッキングルートや古代遺産から、静かな村々、国立公園、スピリチュアルな聖地まで、ネパールの真の美しさと多様性を体感できる旅をつくります。',
        '私たちのチームは、楽しいだけでなく心に残る意味のある旅を提供することに情熱を注いでいます。豊富な地域知識、きめ細やかなサービス、そして責任ある観光 ネパールへの取り組みにより、Yama Nepal Trek (ヤマ・ネパール・トレック) は、ネパール 旅行 安心サポートとネパール 旅行 丁寧なサービスを大切にしています。',
      ],
    },
    {
      title: 'ネパール旅行会社の実績と歩み',
      paragraphs: [
        'Yama Nepal Trek (ヤマ・ネパール・トレック) は、世界中の旅行者にネパールの美しさ、文化、冒険を届けたいというシンプルな想いから設立されました。私たちは、一般的な観光を超え、よりパーソナルで本格的、そして丁寧に設計された体験を生み出す旅行会社を目指しました。',
        '創業当初からの目標は、プロフェッショナルな品質と温かいローカルの心配りを両立したサービスを提供することです。最適な旅程選びからネパール到着後の旅まで、あらゆる段階で安心していただけるとき、最高の旅が生まれると私たちは信じています。',
        'ヒマラヤの本質と旅行者をつなぎたいというビジョンから始まった私たちは、ネパール旅行 信頼できる旅行会社として、ネパール ガイド 日本語、現地ガイド 日本語対応、安全なネパール旅行の体制を整え、オーダーメイドのネパール旅行を求める方々にとって信頼できるパートナーへと成長しました。',
      ],
    },
  ]

  const sectionsAfterImage: SectionProps[] = [
    {
      title: 'ネパール旅行のビジョン - 日本語対応と本物体験',
      paragraphs: [
        '私たちのビジョンは、安全で本物志向、そして責任ある旅で知られるネパール有数の旅行会社になることです。ネパール 旅行 日本語対応の強化を軸に、ヒマラヤでの冒険、文化的な旅、スピリチュアルな体験、そして地域に深く触れるプログラムを通して、旅行者の皆さまにネパールの魅力を最大限に届けることを目指しています。',
        '私たちは、観光は関わるすべての人に価値を生み出すべきだと考えています。旅行者に感動を与え、地域社会を支え、文化を尊重し、ネパールの自然の美しさを守ることが大切です。そのため、より深いつながりと丁寧な探求を促す責任ある旅のあり方を推進しています。',
        'Yama Nepal Trek (ヤマ・ネパール・トレック) が成長するこれからも、質の高いサービス、信頼できる案内、そして意義あるネパール旅行の高い基準を追求し続けます。ヒマラヤ 初心者 トレッキングからネパール 一人旅 安全プランまで、幅広いニーズに応えることが私たちの使命です。',
      ],
    },
    {
      title: 'ネパール旅行のミッション - 安全・本物・日本語対応サービス',
      paragraphs: [
        '私たちのミッションは、安全性、サービス品質、本物らしさ、柔軟性を重視しながら、高品質なネパールツアーとトレッキングパッケージを提供することです。旅行者一人ひとりの興味、旅のスタイル、日程、快適さに合わせて、綿密に計画した旅程とネパール オーダーメイド ツアーを設計します。',
        '経験豊富な現地ガイド、信頼できるドライバー、宿泊パートナー、地域に根ざしたサービスと連携することで、すべての旅を快適でスムーズ、かつ文化的に豊かな体験へと高めています。短期旅行、遺産巡り、野生動物体験、長期のヒマラヤトレッキングまで、細部にまで配慮し、旅行者の皆さまが旅そのものを楽しめるようにしています。',
        'Yama Nepal Trek (ヤマ・ネパール・トレック) は、ネパールにおける責任ある観光にも力を入れています。シニア ネパール 旅行、ネパール 家族旅行 ツアー、ネパール 文化体験ツアー、カトマンズ 観光 ツアー、チトワン 野生動物 サファリ、ルンビニ 聖地 巡礼ツアーなど多様な需要に応えながら、忘れられない思い出を生み出すことを使命としています。',
      ],
    },
  ]

  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="w-full h-[290px]  lg:h-[567px] overflow-hidden relative">
        <img
          alt="ヒマラヤ トレッキングに最適なネパール 山岳風景"
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
          <span className=" text-[#0cb6d8] text-[14px]">私たちについて</span>
        </div>

        {/* About Us & Our Story */}
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </div>

        {/* Story Image */}
        <div className="w-full h-[464px] overflow-hidden relative my-10">
          <img
            alt="マナスル トレッキングとネパール旅行会社の現地体験"
            className="absolute w-full h-full object-cover"
            src="/images/manaslu-trek.avif"
          />
        </div>

        {/* Our Vision & Our Mission */}
        <div className="flex flex-col gap-10">
          {sectionsAfterImage.map((section) => (
            <Section key={section.title} {...section} />
          ))}
        </div>

        {/* Story Image */}
        <div className="w-full h-[464px] overflow-hidden relative my-10 pb-16">
          <img
            alt="ネパール観光おすすめコースとヒマラヤ トレッキング体験"
            className="absolute w-full h-full object-cover object-bottom"
            src="/images/travel1.avif"
          />
        </div>
      </div>
    </div>
  )
}
