import type { Media } from '@/payload-types'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#dbeafe] rounded-3xl p-6 relative h-[200px]">
      <div
        className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgb(0, 211, 243) 0%, rgb(43, 127, 255) 100%)',
        }}
      >
        {icon}
      </div>
      <h3 className="font-['Arial',sans-serif] font-bold text-[20px] text-[#101828] mb-2">
        {title}
      </h3>
      <p className="font-['Arial',sans-serif] text-[14px] text-[#4a5565] leading-[22.75px]">
        {description}
      </p>
    </div>
  )
}

interface ImageCardProps {
  image: Media | string | null
  alt?: string
}

export function ImageCard({ image, alt = '' }: ImageCardProps) {
  const imgSrc = typeof image === 'string' ? image : ((image as Media)?.url ?? '')
  return (
    <div className="rounded-3xl overflow-hidden h-[192px]">
      <img alt={alt} className="w-full h-full object-cover" src={imgSrc} />
    </div>
  )
}
