import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'packsCount',
      type: 'number',
      required: true,
      admin: { description: 'e.g. 5 → displays as "5 Packs"' },
    },
    {
      name: 'region',
      type: 'text',
    },
  ],
}
