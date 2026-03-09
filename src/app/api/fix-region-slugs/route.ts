import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'regions',
    limit: 100,
    depth: 0,
  })

  const results = []
  for (const region of docs) {
    if (region.slug?.startsWith('/')) {
      const fixed = region.slug.replace(/^\/+/, '')
      await payload.update({
        collection: 'regions',
        id: region.id,
        data: { slug: fixed },
      })
      results.push({ id: region.id, name: region.name, old: region.slug, new: fixed })
    }
  }

  return Response.json({ fixed: results.length, results })
}
