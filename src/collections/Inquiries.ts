import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    group: 'Customer',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'trekName', 'status', 'createdAt'],
    description: 'Booking inquiries submitted via the trek pages.',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  timestamps: true,
  fields: [
    {
      name: 'trekName',
      type: 'text',
      label: 'Trek',
      admin: { readOnly: true },
    },
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Mobile',
      required: true,
    },
    {
      name: 'noOfTravellers',
      type: 'number',
      label: 'No. of Travellers',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
    },
  ],
}
