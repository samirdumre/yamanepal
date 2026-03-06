import { getPayload } from 'payload'
import config from '@payload-config'
import { seedHomepage } from '@/endpoints/seed/seed-homepage'

// Seeding fetches many images — give it enough time
export const maxDuration = 60

export async function GET(): Promise<Response> {
  if (process.env.NEXT_PUBLIC_IS_LIVE === 'true') {
    return Response.json({ error: 'Seeding is disabled in production.' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })

    // db.deleteMany needs a req object; a minimal stub is sufficient here
    const req = { payload } as Parameters<typeof seedHomepage>[0]['req']

    await seedHomepage({ payload, req })

    return Response.json({ success: true, message: 'Homepage seeded successfully.' })
  } catch (err) {
    console.error('[seed-homepage]', err)
    return Response.json(
      {
        error: 'Seed failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
