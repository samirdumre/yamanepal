import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          defaultValue: 'Explore Nepal with Local Guides',
        },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'Book a trek in Nepal now!!',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'tripOfTheMonth',
      type: 'group',
      fields: [
        {
          name: 'trek',
          type: 'relationship',
          relationTo: 'treks',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'The Langtang Valley Trek is one of the most beautiful trek in Nepal. It is the gateway to Kyagin Gumpa and Yala Peak...',
        },
      ],
    },
    {
      name: 'bestSellerSectionLabel',
      type: 'text',
      defaultValue: 'Best Seller 2026',
    },
    {
      name: 'lastMinuteSectionLabel',
      type: 'text',
      defaultValue: 'Deals and Discounts',
    },
  ],
}
