import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import Map from '@/components/ui/Map'
import { Button } from '@/components/ui/button'

const contactDetails = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+977 9849289569', '+977 9849325245'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['yamanepal633@gmail.com'],
  },
  {
    icon: MapPin,
    title: 'Location',
    lines: ['Swoyambhu, Kathmandu'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Monday - Saturday: 7:00 AM - 7:00 PM', 'Sunday: 8:00 AM - 5:00 PM'],
  },
]

const ContactSection = () => {
  return (
    <div className="bg-white w-full">
      {/* Hero Image */}
      <div className="w-full h-[567px] overflow-hidden relative">
        <img
          alt="Nepal mountain landscape"
          className="absolute w-full h-full object-cover"
          src="/images/travel1.jpeg"
        />
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-[#0cb6d8] text-[14px]">Home</span>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#0cb6d8] text-[14px]">Contact Us</span>
        </div>

        {/* ── Get in Touch ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center pb-10">
          {/* Left – Contact Information */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">
                Contact Us
              </h2>
              <p className="text-black text-[16px] leading-[29px]">
                We&apos;re here to help with all your trekking, tour, and travel needs.
              </p>
            </div>

            {/* Contact Detail Items */}
            <div className="flex flex-col gap-6 sm:gap-7">
              {contactDetails.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-950" />
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
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
            <a href="tel:9849289569" className="xl:hidden mt-2 md:mt-4">
              <Button>Click to Call Us</Button>
            </a>
          </div>

          {/* Right – Images */}
          <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] w-full">
            <div className="relative w-full h-full">
              {/* Image 1 */}
              <div className="absolute left-0 top-0 w-[45%] sm:w-[48%] h-[65%] sm:h-[70%]">
                <Image
                  src="/images/shantamagar.jpeg"
                  alt="Yama Nepal team"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Image 2 */}
              <div className="absolute right-0 top-[15%] sm:top-[12%] w-[45%] sm:w-[48%] h-[65%] sm:h-[70%]">
                <Image
                  src="/images/gallery4.jpg"
                  alt="Nepal trekking experience"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 md:pt-6 bg-[#3b82f6] rounded-lg shadow-lg flex flex-col gap-1 sm:gap-2">
                <div className="text-white text-3xl sm:text-4xl font-bold text-center">200+</div>
                <div className="text-white text-xs sm:text-sm md:text-base font-medium text-center leading-tight">
                  Happy
                  <br />
                  Travellers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Find Us ── full-width gradient band */}
      <div className="w-full bg-gradient-to-b from-[#DBEAFE80] to-white py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-0 flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-4 text-center">
            <h2 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">
              Our Location
            </h2>
            <p className="text-black text-[16px] leading-[29px] max-w-2xl mx-auto">
              We&apos;re conveniently located in Swoyambhu, Kathmandu and ready to assist you with
              all your travel plans.
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
