import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'trekkingDropdownRegions',
      type: 'array',
      label: 'Trekking Dropdown — Regions',
      maxRows: 20,
      admin: {
        description:
          'Regions shown in the "Trekking" navigation dropdown. Each region will display its assigned treks as a labelled group. Add/remove/reorder regions here.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'region',
          type: 'relationship',
          relationTo: 'regions',
          required: true,
        },
      ],
    },
    {
      name: 'trekkingDropdownItems',
      type: 'array',
      label: 'Trekking Dropdown Items (flat fallback)',
      maxRows: 30,
      admin: {
        description:
          'Fallback flat list — only used when no Regions are configured above. Add/remove/reorder here.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'trek',
          type: 'relationship',
          relationTo: 'treks',
          required: true,
        },
      ],
    },
    {
      name: 'topTreksDropdownItems',
      type: 'array',
      label: 'Top Treks Dropdown Items',
      maxRows: 30,
      admin: {
        description:
          'Treks displayed in the "Top Treks" navigation dropdown. Add/remove/reorder here.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'trek',
          type: 'relationship',
          relationTo: 'treks',
          required: true,
        },
      ],
    },
    {
      name: 'travelInfoDropdownItems',
      type: 'array',
      label: 'Travel Info Dropdown Items',
      maxRows: 30,
      admin: {
        description: 'Links displayed in the "Travel Info" navigation dropdown.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Use a relative path (e.g. /travel-info/visas) or full URL.',
          },
        },
      ],
    },
    {
      name: 'companyDropdownItems',
      type: 'array',
      label: 'Company Dropdown Items',
      maxRows: 30,
      admin: {
        description: 'Links displayed in the "Company" navigation dropdown.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Use a relative path (e.g. /about-yama-nepal) or full URL.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
