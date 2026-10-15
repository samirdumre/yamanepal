import type { CollectionConfig } from 'payload'
import { revalidateRelatedContent } from '@/hooks/revalidateContent'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

function toSlug(str: string): string {
  return str
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Trekking',
    useAsTitle: 'title',
  },
  hooks: {
    ...revalidateRelatedContent('categories'),
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = toSlug(data.title)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. Override manually if needed.',
      },
    },
  ],
}
