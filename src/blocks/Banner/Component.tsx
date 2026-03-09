import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div className="border border-[#bfdbfe] bg-[#dbeafe] text-[#020617] py-3 px-6 flex items-center rounded">
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
