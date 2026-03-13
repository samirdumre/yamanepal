import {
  Clock,
  BarChart2,
  Mountain,
  Footprints,
  CloudSun,
  MapPin,
  Home,
  Utensils,
  Users,
} from 'lucide-react'
import type { Trek, Category } from '@/payload-types'

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-[14px]">
      <div className="w-8 h-8 flex-shrink-0 text-[#0CB6D8] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] md:text-sm font-normal  leading-5 text-slate-950 opacity-70">
          {label}
        </span>
        <span className="text-sm md:text-[15px] font-medium  leading-5 text-slate-950">
          {value}
        </span>
      </div>
    </div>
  )
}

interface TrekStatsCardProps {
  trek: Trek
}

export function TrekStatsCard({ trek }: TrekStatsCardProps) {
  const category = trek.category as Category | null | undefined
  const activityType = category && typeof category === 'object' ? (category.title ?? null) : null

  const stats: { icon: React.ReactNode; label: string; value: string | null | undefined }[] = [
    { icon: <Clock className="w-8 h-8" />, label: '所要日数', value: trek.days },
    { icon: <BarChart2 className="w-8 h-8" />, label: '難易度', value: trek.difficulty },
    {
      icon: <Mountain className="w-8 h-8" />,
      label: '最高標高',
      value: trek.maxAltitude,
    },
    { icon: <Footprints className="w-8 h-8" />, label: 'アクティビティ', value: activityType },
    { icon: <CloudSun className="w-8 h-8" />, label: '最適シーズン', value: trek.bestSeason },
    { icon: <MapPin className="w-8 h-8" />, label: '出発地・到着地', value: trek.startEndPoint },
    {
      icon: <Home className="w-8 h-8" />,
      label: '宿泊',
      value: trek.trekAccommodation,
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      label: '食事（含む）',
      value: trek.trekMeals,
    },
    { icon: <Users className="w-8 h-8" />, label: 'グループ人数', value: trek.groupSize },
  ]

  const visibleStats = stats.filter((s) => s.value)

  if (visibleStats.length === 0) return null

  return (
    <div className="w-full bg-[#DBEAFE] rounded-lg px-4 lg:px-10 pt-8 pb-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {visibleStats.map((stat) => (
          <StatItem
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value as string}
          />
        ))}
      </div>
    </div>
  )
}
