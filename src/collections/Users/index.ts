import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
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
