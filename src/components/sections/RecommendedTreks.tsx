import { TrekCard } from '@/components/cards/TrekCard'
import type { Trek, Media } from '@/payload-types'
import { SectionHeading } from '../ui/SectionLabel'

interface Props {
  treks: (number | Trek)[]
}

export function RecommendedTreks({ treks }: Props) {
  const resolved = treks.filter((t): t is Trek => typeof t === 'object')
  if (resolved.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="font-['Inter'] font-semibold text-2xl text-[#020617] mb-6">
        Recommended Packages
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {resolved.map((trek) => (
          <TrekCard
            key={trek.id}
            image={trek.image as Media}
            name={trek.name}
            days={trek.days}
            difficulty={trek.difficulty}
            price={trek.price}
            slug={trek.slug ?? ''}
          />
        ))}
      </div>
    </section>
  )
}
