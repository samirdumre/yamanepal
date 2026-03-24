import { getPayload } from 'payload'
import config from '@payload-config'
import { getClientIp, rateLimit } from '@/utilities/rateLimit'
import type { Media } from '@/payload-types'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  const ip = getClientIp(request)
  const { success } = rateLimit(ip, { windowMs: 60 * 1000, max: 100, key: 'search' })

  if (!success) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  if (!q) {
    return Response.json([])
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'treks',
    where: {
      name: { like: q },
    },
    depth: 1,
    limit: 8,
    select: {
      name: true,
      days: true,
      description: true,
      slug: true,
      image: true,
    },
  })

  const docs = result.docs.map((trek) => {
    const media = trek.image as Media | null
    return {
      id: trek.id,
      name: trek.name,
      days: trek.days,
      description: trek.description ?? null,
      slug: trek.slug ?? null,
      imageUrl: media?.url ?? null,
    }
  })

  return Response.json(docs)
}
