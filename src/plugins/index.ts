import { revalidateRelatedContent } from '@/hooks/revalidateContent'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects, revalidateRedirectDelete } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { buildCanonicalURL } from '@/utilities/alternates'
import { defaultJapaneseDescription, JAPANESE_SITE_TITLE } from '@/utilities/seo'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ヤマ・ネパール・トレック` : JAPANESE_SITE_TITLE
}

const generateURL: GenerateURL<Post | Page> = ({ doc, collectionSlug }) => {
  if (!doc?.slug || doc.slug === 'home') return buildCanonicalURL('/')
  return buildCanonicalURL(`${collectionSlug === 'posts' ? '/posts' : ''}/${doc.slug}`)
}

export const plugins: Plugin[] = [
  s3Storage({
    collections: {
      media: {
        generateFileURL: ({ filename, prefix }) => {
          const base = process.env.R2_PUBLIC_URL || ''
          return prefix ? `${base}/${prefix}/${filename}` : `${base}/${filename}`
        },
      },
    },
    bucket: process.env.R2_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    },
  }),
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        group: 'Admin',
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Redirects are revalidated automatically when saved or deleted.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
        afterDelete: [revalidateRedirectDelete],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateDescription: ({ doc }) => defaultJapaneseDescription(doc),
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      hooks: revalidateRelatedContent('forms'),
      admin: {
        group: 'Admin',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Admin',
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        group: 'Admin',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
