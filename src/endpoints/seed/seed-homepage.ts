/**
 * Homepage seed script
 *
 * Creates demo data for every section visible on the frontend homepage:
 *   - 6 best-seller treks
 *   - 6 last-minute deal treks
 *   - 1 trip-of-the-month trek
 *   - 6 destinations
 *   - 9 testimonials
 *   - 4 blog posts (1 featured + 3 side)
 *   - homepage global (headline, subheading, section labels, tripOfTheMonth)
 *
 * Trigger via: GET /api/seed-homepage
 */

import type { File, Payload, PayloadRequest } from 'payload'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchPlaceholder(seed: string, w = 800, h = 600): Promise<File> {
  const url = `https://picsum.photos/seed/${seed}/${w}/${h}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch placeholder image: ${url}`)
  const data = await res.arrayBuffer()
  return {
    name: `${seed}.jpg`,
    data: Buffer.from(data),
    mimetype: 'image/jpeg',
    size: data.byteLength,
  }
}

async function createMedia(payload: Payload, seed: string, alt: string, w = 800, h = 600) {
  const file = await fetchPlaceholder(seed, w, h)
  return payload.create({ collection: 'media', data: { alt }, file })
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seedHomepage({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('— [seed-homepage] Clearing existing homepage data...')

  await Promise.allSettled([
    payload.db.deleteMany({ collection: 'treks', req, where: {} }),
    payload.db.deleteMany({ collection: 'destinations', req, where: {} }),
    payload.db.deleteMany({ collection: 'testimonials', req, where: {} }),
    payload.db.deleteMany({ collection: 'posts', req, where: {} }),
    payload.db.deleteMany({ collection: 'media', req, where: {} }),
  ])

  payload.logger.info('— [seed-homepage] Fetching placeholder images...')

  const [
    // Best-seller trek images (6)
    trek1Img, // EBC
    trek2Img, // Annapurna Circuit
    trek3Img, // Langtang
    trek4Img, // Gokyo Lakes
    trek5Img, // Poon Hill
    trek6Img, // Pikey Peak
    // Last-minute deal trek images (6)
    trek7Img, // Manaslu
    trek8Img, // Gosaikunda
    trek9Img, // Upper Mustang
    trek10Img, // Nar Phu Valley
    trek11Img, // Khopra Danda
    trek12Img, // Tamang Heritage
    // Trip of the month image (1)
    trek13Img, // Mardi Himal
    // Destination images (6)
    dest1Img,
    dest2Img,
    dest3Img,
    dest4Img,
    dest5Img,
    dest6Img,
    // Blog post images (4)
    post1Img,
    post2Img,
    post3Img,
    post4Img,
  ] = await Promise.all([
    createMedia(payload, 'trek-ebc', 'Everest Base Camp Trek'),
    createMedia(payload, 'trek-annapurna', 'Annapurna Circuit Trek'),
    createMedia(payload, 'trek-langtang', 'Langtang Valley Trek'),
    createMedia(payload, 'trek-gokyo', 'Gokyo Lakes Trek'),
    createMedia(payload, 'trek-poon-hill', 'Poon Hill Trek'),
    createMedia(payload, 'trek-pikey-peak', 'Pikey Peak Trek'),
    createMedia(payload, 'trek-manaslu', 'Manaslu Circuit Trek'),
    createMedia(payload, 'trek-gosaikunda', 'Gosaikunda Lake Trek'),
    createMedia(payload, 'trek-upper-mustang', 'Upper Mustang Trek'),
    createMedia(payload, 'trek-nar-phu', 'Nar Phu Valley Trek'),
    createMedia(payload, 'trek-khopra', 'Khopra Danda Trek'),
    createMedia(payload, 'trek-tamang', 'Tamang Heritage Trail'),
    createMedia(payload, 'trek-mardi', 'Mardi Himal Trek'),
    createMedia(payload, 'dest-kathmandu', 'Kathmandu Valley'),
    createMedia(payload, 'dest-pokhara', 'Pokhara'),
    createMedia(payload, 'dest-chitwan', 'Chitwan National Park'),
    createMedia(payload, 'dest-lumbini', 'Lumbini'),
    createMedia(payload, 'dest-nagarkot', 'Nagarkot'),
    createMedia(payload, 'dest-bandipur', 'Bandipur'),
    createMedia(payload, 'post-gear', 'Trekking Gear Guide'),
    createMedia(payload, 'post-culture', 'Sherpa Culture'),
    createMedia(payload, 'post-season', 'Best Season to Trek'),
    createMedia(payload, 'post-ebc-featured', 'Everest Base Camp Featured'),
  ])

  payload.logger.info('— [seed-homepage] Seeding treks...')

  const [
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    // best-sellers (indices 0–5)
    // last-minute deals (indices 6–11)
    trek13, // trip of the month (index 12)
  ] = await Promise.all([
    // -------------------------------------------------------------------------
    // Best-seller treks (6)
    // -------------------------------------------------------------------------
    payload.create({
      collection: 'treks',
      data: {
        name: 'Everest Base Camp Trek',
        slug: 'everest-base-camp-trek',
        days: '14 Days',
        difficulty: 'Hard',
        price: 1495,
        image: trek1Img.id,
        rating: 4.9,
        reviewCount: 128,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          "Walk in the footsteps of legends and stand at the foot of the world's highest peak.",
        maxAltitude: 'Kala Patthar (5645m / 18,519ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Kathmandu / Kathmandu',
        trekAccommodation: 'Tea House / Lodge',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 12',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Annapurna Circuit Trek',
        slug: 'annapurna-circuit-trek',
        days: '16 Days',
        difficulty: 'Moderate',
        price: 1250,
        image: trek2Img.id,
        rating: 4.8,
        reviewCount: 96,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          'Circumnavigate the Annapurna massif through dramatic landscapes and high passes.',
        maxAltitude: 'Thorong La Pass (5416m / 17,769ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Besisahar / Nayapul',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Langtang Valley Trek',
        slug: 'langtang-valley-trek',
        days: '10 Days',
        difficulty: 'Easy',
        price: 895,
        image: trek3Img.id,
        rating: 4.7,
        reviewCount: 72,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          'The "Valley of Glaciers" — stunning alpine scenery just a short drive from Kathmandu.',
        maxAltitude: 'Kyanjin Ri (4773m / 15,659ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Kathmandu / Kathmandu',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Gokyo Lakes Trek',
        slug: 'gokyo-lakes-trek',
        days: '13 Days',
        difficulty: 'Hard',
        price: 1350,
        image: trek4Img.id,
        rating: 4.8,
        reviewCount: 61,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          'Discover the turquoise Gokyo Lakes and summit Gokyo Ri for panoramic Everest views.',
        maxAltitude: 'Gokyo Ri (5357m / 17,575ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Kathmandu / Kathmandu',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 12',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Poon Hill Trek',
        slug: 'poon-hill-trek',
        days: '5 Days',
        difficulty: 'Easy',
        price: 450,
        image: trek5Img.id,
        rating: 4.7,
        reviewCount: 143,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          'The most popular short trek in Nepal — sunrise over Dhaulagiri and Annapurna from Poon Hill.',
        maxAltitude: 'Poon Hill (3210m / 10,531ft)',
        bestSeason: 'Year Round',
        startEndPoint: 'Nayapul / Nayapul',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 12',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Pikey Peak Trek',
        slug: 'pikey-peak-trek',
        days: '8 Days',
        difficulty: 'Easy',
        price: 720,
        image: trek6Img.id,
        rating: 4.6,
        reviewCount: 48,
        isBestSeller: true,
        isLastMinuteDeal: false,
        description:
          "Sir Edmund Hillary's favourite Himalayan viewpoint — far from the crowds, close to the sky.",
        maxAltitude: 'Pikey Peak (4065m / 13,336ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Phaplu / Salleri',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),

    // -------------------------------------------------------------------------
    // Last-minute deal treks (6)
    // -------------------------------------------------------------------------
    payload.create({
      collection: 'treks',
      data: {
        name: 'Manaslu Circuit Trek',
        slug: 'manaslu-circuit-trek',
        days: '18 Days',
        difficulty: 'Hard',
        price: 1650,
        image: trek7Img.id,
        rating: 4.9,
        reviewCount: 44,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description: "A remote circuit around the world's eighth highest mountain.",
        maxAltitude: 'Larkya La Pass (5160m / 16,929ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Arughat / Dharapani',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '2 to 8',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Gosaikunda Lake Trek',
        slug: 'gosaikunda-lake-trek',
        days: '8 Days',
        difficulty: 'Moderate',
        price: 750,
        image: trek8Img.id,
        rating: 4.6,
        reviewCount: 38,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description: 'A sacred alpine journey to the holy Gosaikunda lakes.',
        maxAltitude: 'Gosaikunda Lake (4380m / 14,370ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Kathmandu / Kathmandu',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Upper Mustang Trek',
        slug: 'upper-mustang-trek',
        days: '15 Days',
        difficulty: 'Moderate',
        price: 2100,
        image: trek9Img.id,
        rating: 4.9,
        reviewCount: 31,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description:
          'Journey into the forbidden kingdom — a plateau preserving ancient Tibetan culture.',
        maxAltitude: 'Lo Manthang (3840m / 12,598ft)',
        bestSeason: 'Spring & Summer',
        startEndPoint: 'Jomsom / Jomsom',
        trekAccommodation: 'Tea House / Lodge',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '2 to 8',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Nar Phu Valley Trek',
        slug: 'nar-phu-valley-trek',
        days: '16 Days',
        difficulty: 'Hard',
        price: 1850,
        image: trek10Img.id,
        rating: 4.8,
        reviewCount: 22,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description:
          "One of Nepal's most restricted and pristine valleys — raw Himalayan wilderness with a Tibetan-influenced culture.",
        maxAltitude: 'Kang La Pass (5306m / 17,408ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Besisahar / Koto',
        trekAccommodation: 'Tea House / Camping',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '2 to 8',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Khopra Danda Trek',
        slug: 'khopra-danda-trek',
        days: '10 Days',
        difficulty: 'Moderate',
        price: 890,
        image: trek11Img.id,
        rating: 4.7,
        reviewCount: 29,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description:
          'An off-the-beaten-path Annapurna trek with superb ridge-top views and serene Khayer Lake.',
        maxAltitude: 'Khayer Lake (4660m / 15,289ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Nayapul / Nayapul',
        trekAccommodation: 'Community Lodge',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),
    payload.create({
      collection: 'treks',
      data: {
        name: 'Tamang Heritage Trail',
        slug: 'tamang-heritage-trail',
        days: '9 Days',
        difficulty: 'Easy',
        price: 820,
        image: trek12Img.id,
        rating: 4.6,
        reviewCount: 35,
        isBestSeller: false,
        isLastMinuteDeal: true,
        description:
          'Walk through centuries-old Tamang villages, Buddhist monasteries, and rolling green hills north of Kathmandu.',
        maxAltitude: 'Nagthali (3165m / 10,384ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Syabrubesi / Timure',
        trekAccommodation: 'Community Lodge',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 12',
      },
    }),

    // -------------------------------------------------------------------------
    // Trip of the month (1)
    // -------------------------------------------------------------------------
    payload.create({
      collection: 'treks',
      data: {
        name: 'Mardi Himal Trek',
        slug: 'mardi-himal-trek',
        days: '7 Days',
        difficulty: 'Moderate',
        price: 650,
        image: trek13Img.id,
        rating: 4.8,
        reviewCount: 55,
        isBestSeller: false,
        isLastMinuteDeal: false,
        description:
          'A hidden gem in the Annapurna region with spectacular close-up Himalayan views.',
        maxAltitude: 'High Camp (4500m / 14,764ft)',
        bestSeason: 'Spring & Autumn',
        startEndPoint: 'Pokhara / Pokhara',
        trekAccommodation: 'Tea House',
        trekMeals: 'Breakfast, Lunch & Dinner',
        groupSize: '1 to 10',
      },
    }),
  ])

  payload.logger.info('— [seed-homepage] Seeding destinations...')

  await Promise.all([
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Kathmandu Valley',
        image: dest1Img.id,
        packsCount: 12,
        region: 'Bagmati Province',
      },
    }),
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Pokhara',
        image: dest2Img.id,
        packsCount: 8,
        region: 'Gandaki Province',
      },
    }),
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Chitwan',
        image: dest3Img.id,
        packsCount: 5,
        region: 'Bagmati Province',
      },
    }),
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Lumbini',
        image: dest4Img.id,
        packsCount: 4,
        region: 'Lumbini Province',
      },
    }),
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Nagarkot',
        image: dest5Img.id,
        packsCount: 6,
        region: 'Bagmati Province',
      },
    }),
    payload.create({
      collection: 'destinations',
      data: {
        name: 'Bandipur',
        image: dest6Img.id,
        packsCount: 3,
        region: 'Gandaki Province',
      },
    }),
  ])

  payload.logger.info('— [seed-homepage] Seeding testimonials...')

  await Promise.all([
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Sarah Mitchell',
        location: 'United Kingdom',
        quote:
          'Yama Travel made our Everest Base Camp dream come true. Every detail was perfectly organised and our guide Karma was outstanding and knowledgeable.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Takashi Yamamoto',
        location: 'Japan',
        quote:
          'I have trekked with several agencies over the years, but Yama Travel stands apart. The Annapurna Circuit was challenging, beautiful, and completely hassle-free thanks to their exceptional team.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Elena Rossi',
        location: 'Italy',
        quote:
          'From the first email to the farewell dinner in Kathmandu, the experience was flawless. I cannot recommend Yama Travel enough — they truly treat you like family.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Marcus Weber',
        location: 'Germany',
        quote:
          'The Manaslu Circuit exceeded every expectation. The remote trails, the warm lodge hosts, and our guide Dawa made this the most memorable trip of my life. Yama Travel is world class.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Priya Sharma',
        location: 'India',
        quote:
          'As a solo female traveller I had concerns, but Yama Travel made me feel safe and supported from day one. The Langtang trek was breathtaking and I will definitely be back for more.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: "James O'Brien",
        location: 'Australia',
        quote:
          'Poon Hill at sunrise with Yama Travel — a moment I will carry with me forever. Seamless logistics, incredible food at the lodges, and guides who genuinely love what they do.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Camille Dupont',
        location: 'France',
        quote:
          'Upper Mustang was unlike anything I had ever seen — ancient cave monasteries, barren red cliffs, and the warmest hospitality. Yama Travel handled the restricted area permits effortlessly.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Diego Fernández',
        location: 'Spain',
        quote:
          'I booked the Gokyo Lakes trek last minute and Yama Travel pulled everything together in 48 hours. Professional, responsive, and the trek itself was absolutely stunning.',
      },
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        name: 'Lena Andersen',
        location: 'Denmark',
        quote:
          'Our family of four — including two teenagers — completed the Tamang Heritage Trail with Yama Travel. The guides kept everyone engaged and the cultural immersion was truly special.',
      },
    }),
  ])

  payload.logger.info('— [seed-homepage] Seeding blog posts...')

  await Promise.all([
    payload.create({
      collection: 'posts',
      data: {
        title: 'Everything You Need to Know Before Trekking Everest Base Camp',
        tag: 'Everest Base Camp Trek',
        slug: 'everest-base-camp-guide',
        image: post4Img.id,
        isFeatured: true,
      },
    }),
    payload.create({
      collection: 'posts',
      data: {
        title: 'The Complete Trekking Gear Guide for Nepal',
        tag: 'Gear & Packing',
        slug: 'trekking-gear-guide-nepal',
        image: post1Img.id,
        isFeatured: false,
      },
    }),
    payload.create({
      collection: 'posts',
      data: {
        title: 'Sherpa Culture: The People Who Make Himalayan Trekking Possible',
        tag: 'Culture & People',
        slug: 'sherpa-culture-nepal',
        image: post2Img.id,
        isFeatured: false,
      },
    }),
    payload.create({
      collection: 'posts',
      data: {
        title: 'Best Season to Trek in Nepal: Month by Month Breakdown',
        tag: 'Travel Tips',
        slug: 'best-season-trek-nepal',
        image: post3Img.id,
        isFeatured: false,
      },
    }),
  ])

  payload.logger.info('— [seed-homepage] Updating homepage global...')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        headline: 'Explore Nepal with Local Guides',
        subheading: 'Authentic Himalayan adventures, expertly crafted since 2010',
      },
      bestSellerSectionLabel: 'Best Seller 2026',
      lastMinuteSectionLabel: 'Deals and Discounts',
      tripOfTheMonth: {
        trek: trek13.id,
        description:
          'The Mardi Himal Trek is a hidden gem in the Annapurna region of Nepal. It is the perfect trek for those who want to experience the beauty of the Himalayas without the crowds. The trail winds through rhododendron forests, high alpine meadows, and offers jaw-dropping views of Machhapuchhre (Fishtail) and the full Annapurna massif.',
      },
    },
  })

  payload.logger.info('— [seed-homepage] Done! ✓')
}
