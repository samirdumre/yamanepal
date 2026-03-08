import { ArrowRight } from 'lucide-react'
import type { Trek } from '@/payload-types'
import RichText from '@/components/RichText'

interface TrekAddonsCardProps {
  trek: Trek
}

export function TrekAddonsCard({ trek }: TrekAddonsCardProps) {
  const hasAddons = trek.addons && trek.addons.length > 0
  const hasSteps = trek.addonsSteps && trek.addonsSteps.length > 0

  if (!trek.addonsDescription && !hasAddons && !hasSteps) return null

  return (
    <div className="w-full bg-[#DBEAFE] rounded-2xl px-10 py-10 flex flex-col gap-6">
      {/* Title */}
      <h2 className="text-slate-950 text-xl font-medium font-['Inter'] leading-8">
        Add-ons &amp; Options
      </h2>

      {/* Intro paragraph */}
      {trek.addonsDescription && (
        <RichText
          data={trek.addonsDescription}
          enableGutter={false}
          enableProse={false}
          className="text-slate-950 text-base font-normal font-['Inter'] leading-6"
        />
      )}

      {/* Add-on items */}
      {hasAddons && (
        <ul className="flex flex-col gap-5">
          {(trek.addons ?? []).map((addon, i) => (
            <li key={addon.id ?? i} className="flex items-start gap-[14px]">
              <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0 mt-[5px]" />
              <div className="text-slate-950 text-base font-['Inter'] leading-6">
                <span className="font-semibold">{addon.label} </span>
                <RichText
                  data={addon.description}
                  enableGutter={false}
                  enableProse={false}
                  className="inline font-normal"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Personalize heading */}
      {trek.addonsPersonalizeTitle && (
        <h3 className="text-slate-950 text-lg font-medium font-['Inter'] leading-7">
          {trek.addonsPersonalizeTitle}
        </h3>
      )}

      {/* Steps */}
      {hasSteps && (
        <ul className="flex flex-col gap-4">
          {(trek.addonsSteps as string[]).map((step, i) => (
            <li key={i} className="flex items-center gap-[14px]">
              <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-slate-950 text-base font-normal font-['Inter'] leading-6">
                {step}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
