import { ChevronRight } from 'lucide-react'

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

export default function HowToMakePayment() {
  const sections: SectionProps[] = [
    {
      title: 'How to Make Payment',
      paragraphs: [
        'Yama Nepal is a trusted travel agency in Nepal offering trekking in Nepal, Nepal tour packages, cultural tours, wildlife safaris, adventure holidays, and customized trips across the Himalayas.',
        'We help solo travelers, couples, families, and groups discover Nepal through safe, well-planned, and authentic travel experiences. From iconic Himalayan trekking routes and ancient heritage sites to peaceful villages, national parks, and spiritual destinations, we create journeys that show travelers the true beauty and diversity of Nepal.',
        'Our team is passionate about delivering trips that are not only enjoyable but also meaningful. With strong local knowledge, personalized service, and a commitment to responsible tourism, Yama Nepal works to make every journey smooth, memorable, and deeply connected to the people, culture, and landscapes of Nepal.',
      ],
    },
  ]

  const sectionsAfterImage: SectionProps[] = [
    {
      title: 'Our Vision',
      paragraphs: [
        'Our vision is to become a leading Nepal travel company known for safe, authentic, and responsible travel experiences. We aim to connect travelers with the best of Nepal through Himalayan adventures, cultural journeys, spiritual travel, and immersive local experiences that leave a lasting impression.',
        "We believe tourism should create value for everyone involved. It should inspire travelers, support local communities, respect culture, and help preserve Nepal's natural beauty. For this reason, we promote responsible travel practices that encourage deeper connection and more thoughtful exploration.",
        'As Yama Nepal grows, we want to continue setting high standards for quality service, trusted guidance, and meaningful travel in Nepal. Our vision is not only to help people visit Nepal, but to help them truly experience it.',
      ],
    },
    {
      title: 'Our Mission',
      paragraphs: [
        "Our mission is to deliver high-quality Nepal tours and trekking packages with a strong focus on safety, service, authenticity, and flexibility. We design carefully planned itineraries and customized Nepal tour packages that match each traveler's interests, travel style, schedule, and comfort level.",
        'By working with experienced local guides, trusted drivers, accommodation partners, and community-based services, we make each trip enjoyable, seamless, and culturally enriching. Whether it is a short holiday, a heritage tour, a wildlife experience, or a long Himalayan trek, we give attention to every detail so travelers can focus on enjoying the journey.',
        'Yama Nepal is also committed to responsible tourism in Nepal. We believe travel should positively impact both visitors and local communities, so we support respectful cultural exchange, local employment, and travel experiences that honor the environment. Through every trip we organize, our mission is to create unforgettable memories while contributing to the long-term value of tourism in Nepal.',
      ],
    },
  ]

  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="w-full h-[290px]  lg:h-[567px] overflow-hidden relative">
        <img
          alt="Nepal mountain landscape"
          className="absolute w-full h-full object-cover"
          src="/images/langtang1.jpg"
        />
      </div>

      {/* Content */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4">
          <span className=" text-[#0cb6d8] text-[14px]">Home</span>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className=" text-[#0cb6d8] text-[14px]">How to Make Payment</span>
        </div>

        {/* How to Make Payment */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 w-full">
            <h2 className=" text-[#020617] text-[24px] font-semibold">How to Make a Payment</h2>
            <div className=" text-black text-[16px] leading-[28px]">
              <h3 className="font-semibold mb-2">SWIFT Transfer:</h3>
              <div>
                Pay to: Yama Nepal Trek & Expedition Pvt.Ltd. (Shanta Bahadur Pun) <br />
                A/c Number: 3100310374600001 <br /> A/c Name: Shanta Bahadur Pun <br />
                Paying Bank: Kumari Bank Ltd <br /> Branch: Dallu Branch, Kathmandu Nepal <br />
                <div className="flex gap-1">
                  <p className="font-semibold">Swift code:</p>
                  <p>KMBLNPKA</p>
                </div>
              </div>
              <div className="mt-2">
                (Bank service charges related to submitting a deposit are the responsibility of the
                client.)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
