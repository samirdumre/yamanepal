import type { Config } from '@/payload-types'

export const trekCardSelect = {
  name: true,
  slug: true,
  image: true,
  days: true,
  difficulty: true,
  price: true,
  discountedPrice: true,
  isLastMinuteDeal: true,
} satisfies Config['collectionsSelect']['treks']
