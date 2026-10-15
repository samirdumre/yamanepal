import type { CollectionConfig } from 'payload'
import { revalidateRelatedContent } from '@/hooks/revalidateContent'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  hooks: revalidateRelatedContent('users'),
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Admin',
    defaultColumns: ['name', 'username'],
    useAsTitle: 'name',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
