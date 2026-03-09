import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
}

export const Regions: CollectionConfig = {
  slug: 'regions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation: _operation }) => {
        if (data) {
          if (!data.slug && data.name) {
            data.slug = toSlug(data.name)
          } else if (data.slug) {
            // Strip accidental leading slash: "/everest-region" → "everest-region"
            data.slug = (data.slug as string).replace(/^\/+/, '')
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from the region name. Can be customised.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional. Shown on the region listing page.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional hero image for the region listing page.',
      },
    },
  ],
}
