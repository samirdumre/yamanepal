import type { CollectionConfig } from 'payload'
import { defaultLexical } from '@/fields/defaultLexical'
import { fullLexical } from '@/fields/fullLexical'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
}

export const Treks: CollectionConfig = {
  slug: 'treks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'region',
      'days',
      'difficulty',
      'price',
      'isBestSeller',
      'isLastMinuteDeal',
    ],
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      ({ data, operation: _operation }) => {
        if (data && !data.slug && data.name) {
          data.slug = toSlug(data.name)
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
      name: 'days',
      type: 'text',
      required: true,
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Easy', value: 'Easy' },
        { label: 'Moderate', value: 'Moderate' },
        { label: 'Hard', value: 'Hard' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Price in USD (numbers only, e.g. 1495)' },
    },
    {
      name: 'groupPricing',
      type: 'group',
      label: 'Group Discount Pricing',
      admin: {
        description:
          'Control the group discount table shown in the booking sidebar. Toggle it on/off and set a price for each tier.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show group discount table in booking sidebar',
          defaultValue: false,
        },
        {
          name: 'tiers',
          type: 'array',
          label: 'Price Tiers',
          maxRows: 10,
          admin: {
            description:
              'Add as many tiers as needed. Each tier has a label (e.g. 1 pax, 2-4 pax) and a price per person.',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Group Size Label',
              required: true,
              admin: { description: 'e.g. 1 pax, 2-4 pax' },
            },
            {
              name: 'price',
              type: 'number',
              label: 'Price per Person (USD)',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Primary hero image (also used as the first collage photo if no gallery is set)',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Hero Gallery (up to 10 photos)',
      minRows: 0,
      maxRows: 10,
      admin: {
        description:
          'Upload up to 10 photos. The first 3 are shown in the hero collage; all photos are accessible in the lightbox when a visitor clicks any image.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      admin: {
        description: 'Average rating, e.g. 4.9',
        step: 0.1,
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      label: 'Review Count',
      admin: { description: 'Total number of reviews, e.g. 12' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Used for the breadcrumb on the trek detail page (e.g. Trekking)',
        position: 'sidebar',
      },
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        description:
          'The geographic region this trek belongs to (e.g. Everest Region, Annapurna Region).',
        position: 'sidebar',
      },
    },
    {
      name: 'isBestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show in Best Seller section on homepage' },
    },
    {
      name: 'isLastMinuteDeal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Discount / Last Minute Deal',
      admin: {
        description:
          'Enable to show this trek in the Best Last Minute Deals section on the homepage',
      },
    },
    {
      name: 'discountedPrice',
      type: 'number',
      label: 'Discounted Price (USD)',
      admin: {
        description: 'Sale price shown on the card. Only visible when Discount is enabled.',
        condition: (data) => Boolean(data?.isLastMinuteDeal),
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name. Override manually if needed.',
      },
    },
    {
      name: 'overview',
      type: 'richText',
      editor: defaultLexical,
      admin: {
        description:
          'Short paragraph shown at top of the trek detail page (bold, italic, links supported)',
        components: {
          Label: '@/components/AdminLabel/SectionLabel#OverviewLabel',
        },
      },
    },
    {
      name: 'maxAltitude',
      type: 'text',
      label: 'Max. Altitude / Elevation',
      admin: { description: 'e.g. Kyanjin Ri (4773m / 15,659ft)' },
    },
    {
      name: 'bestSeason',
      type: 'text',
      label: 'Best Season',
      admin: { description: 'e.g. Spring and Autumn' },
    },
    {
      name: 'startEndPoint',
      type: 'text',
      label: 'Start / End Point',
      admin: { description: 'e.g. Kathmandu / Kathmandu' },
    },
    {
      name: 'trekAccommodation',
      type: 'text',
      label: 'Accommodation',
      admin: { description: 'e.g. Tea House or Lodge During Trek' },
    },
    {
      name: 'trekMeals',
      type: 'text',
      label: 'Meals (Included)',
      admin: { description: 'e.g. Breakfast, Lunch, and Dinner During Trek' },
    },
    {
      name: 'groupSize',
      type: 'text',
      label: 'Group Size',
      admin: { description: 'e.g. 1 to 10' },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights',
      admin: {
        description:
          'Bullet points shown as highlights — each item supports bold, italic, and links',
      },
      fields: [
        {
          name: 'text',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
    {
      name: 'detailedOverview',
      type: 'richText',
      label: 'Detailed Overview',
      editor: fullLexical,
      admin: {
        description:
          'Rich content section shown below highlights — supports headings (H2–H6), images, bold, italic, links, and horizontal rules',
        components: {
          Label: '@/components/AdminLabel/SectionLabel#DetailedOverviewLabel',
        },
      },
    },
    {
      name: 'includes',
      type: 'array',
      label: 'Cost Includes',
      admin: {
        description: 'Items included in the cost — each item supports bold, italic, and links',
      },
      fields: [
        {
          name: 'text',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
    {
      name: 'excludes',
      type: 'array',
      label: 'Cost Excludes',
      admin: {
        description: 'Items not included in the cost — each item supports bold, italic, and links',
      },
      fields: [
        {
          name: 'text',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
    {
      name: 'addonsDescription',
      type: 'richText',
      label: 'Add-ons & Options — Intro',
      editor: defaultLexical,
      admin: {
        description:
          'Introductory paragraph shown at the top of the Add-ons section (bold, italic, links supported)',
      },
    },
    {
      name: 'addons',
      type: 'array',
      label: 'Add-on Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Bold label e.g. "Porter Services for USD 160:"' },
        },
        {
          name: 'description',
          type: 'richText',
          editor: defaultLexical,
          required: true,
          admin: {
            description: 'Text that follows the bold label (bold, italic, links supported)',
          },
        },
      ],
    },
    {
      name: 'addonsPersonalizeTitle',
      type: 'text',
      label: 'Add-ons Personalize Heading',
      admin: {
        description: 'e.g. "How to Personalize Your Langtang Valley Trek with Our Add-Ons?"',
      },
    },
    {
      name: 'addonsSteps',
      type: 'text',
      label: 'Add-ons Steps',
      hasMany: true,
      admin: {
        description: 'Ordered steps shown below the personalize heading — press Enter to add each',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQs',
      admin: { description: 'Frequently asked questions shown on the trek detail page' },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Why Annapurna Base Camp Short Trekking?' },
        },
        {
          name: 'answer',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      label: "Travellers' Reviews",
      admin: { description: 'Customer reviews displayed on the trek detail page' },
      fields: [
        {
          name: 'reviewerName',
          type: 'text',
          required: true,
          label: 'Reviewer Name',
          admin: { description: 'e.g. Mr. Christa Elise' },
        },
        {
          name: 'reviewDate',
          type: 'date',
          required: true,
          label: 'Review Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMMM d, yyyy',
            },
          },
        },
        {
          name: 'rating',
          type: 'select',
          required: true,
          label: 'Rating',
          options: [
            { label: '1 Star', value: '1' },
            { label: '2 Stars', value: '2' },
            { label: '3 Stars', value: '3' },
            { label: '4 Stars', value: '4' },
            { label: '5 Stars', value: '5' },
          ],
        },
        {
          name: 'ratingLabel',
          type: 'text',
          label: 'Rating Label',
          admin: { description: 'e.g. Excellent, Very Good, Good' },
        },
        {
          name: 'reviewText',
          type: 'richText',
          label: 'Review Text',
          editor: defaultLexical,
        },
        {
          name: 'images',
          type: 'array',
          label: 'Review Images (max 5)',
          maxRows: 5,
          admin: { description: 'Optional photos uploaded by the reviewer' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'itinerary',
      type: 'array',
      label: 'Day-by-Day Itinerary',
      fields: [
        {
          name: 'day',
          type: 'number',
          required: true,
          admin: { description: 'Day number e.g. 1' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Fly to Lukla, Trek to Phakding' },
        },
        {
          name: 'description',
          type: 'richText',
          editor: defaultLexical,
          required: true,
        },
        {
          name: 'elevation',
          type: 'text',
          admin: { description: 'e.g. 2,610m' },
        },
        {
          name: 'distance',
          type: 'text',
          admin: { description: 'e.g. 8 km' },
        },
        {
          name: 'meals',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Lunch', value: 'lunch' },
            { label: 'Dinner', value: 'dinner' },
          ],
        },
        {
          name: 'accommodation',
          type: 'text',
          admin: { description: 'e.g. Tea house / Lodge' },
        },
        {
          name: 'photos',
          type: 'array',
          label: 'Day Photos (max 3)',
          maxRows: 3,
          admin: { description: 'Optional photos shown in the expanded itinerary row' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'showRecommended',
      type: 'checkbox',
      label: 'Show Recommended Packages',
      defaultValue: false,
      admin: {
        description: 'Toggle the recommended packages section on/off for this trek',
        position: 'sidebar',
      },
    },
    {
      name: 'recommendedTreks',
      type: 'relationship',
      relationTo: 'treks',
      hasMany: true,
      maxRows: 3,
      label: 'Recommended Packages',
      admin: {
        description: 'Up to 3 treks to show as recommendations below the reviews section',
        condition: (data) => Boolean(data?.showRecommended),
      },
    },
  ],
}
