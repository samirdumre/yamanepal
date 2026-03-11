import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import Map from '@/components/ui/Map'
import { Button } from '@/components/ui/button'
import { ContactInquiryForm } from '@/components/sections/ContactInquiryForm'

const contactDetails = [
  {
    icon: Phone,
    title: 'Phone',
    lines: ['+977 9849289569', '+080 96321073', '+977 9743290500'],
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
      <div className="w-full h-[290px] lg:h-[567px] overflow-hidden relative">
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
          <span className="text-[#0cb6d8] text-[14px]">Home</span>
          <ChevronRight className="size-5 text-[#0cb6d8]" />
          <span className="text-[#0cb6d8] text-[14px]">Contact Us</span>
        </div>

        {/* ── Get in Touch ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center pb-10">
          {/* Left – Contact Information */}
          <div className="flex flex-col gap-5 sm:gap-5">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[#020617] text-[32px] font-semibold tracking-[-0.8px]">
                Contact Us
              </h2>
              <p className="text-black text-[17px] leading-[30px]">
                We&apos;re here to help with all your trekking, tour, and travel needs.
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
              <Button>Click to Call Us</Button>
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
