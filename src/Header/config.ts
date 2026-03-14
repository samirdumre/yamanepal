import type { GlobalConfig } from 'payload'

import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    description: 'Manage navigation menus and dropdown items.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'trekkingDropdownRegions',
      type: 'array',
      label: 'Nepal Trekking Dropdown — Regions',
      maxRows: 20,
      admin: {
        description:
          'Regions shown in the "Nepal Trekking" navigation dropdown. Each region will display its assigned treks as a labelled group. Add/remove/reorder regions here.',
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
      name: 'topTreksDropdownItems',
      type: 'array',
      label: 'Bhutan Dropdown Items',
      maxRows: 30,
      admin: {
        description:
          'Treks displayed in the "Bhutan" navigation dropdown. Add/remove/reorder here.',
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
