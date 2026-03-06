import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import type { Trek } from '@/payload-types'

const RATING_LABELS: Record<string, string> = {
  '1': 'Poor',
  '2': 'Fair',
  '3': 'Good',
  '4': 'Very Good',
  '5': 'Excellent',
}

// Convert plain text to a minimal Lexical serialized state
function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: [
        {
          type: 'paragraph',
          version: 1,
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              style: '',
              mode: 'normal' as const,
              detail: 0,
            },
          ],
        },
      ],
    },
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const { reviewerName, rating, reviewText } = body as {
      reviewerName?: string
      rating?: string
      reviewText?: string
    }

    // Basic validation
    if (!reviewerName?.trim()) {
      return Response.json({ error: 'Reviewer name is required.' }, { status: 400 })
    }
    if (!rating || !['1', '2', '3', '4', '5'].includes(rating)) {
      return Response.json({ error: 'A valid rating is required.' }, { status: 400 })
    }
    if (!reviewText?.trim()) {
      return Response.json({ error: 'Review text is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Fetch the current trek (admin access — we control what data we write)
    const trek = await payload.findByID({
      collection: 'treks',
      id: Number(id),
      depth: 0,
    })

    if (!trek) {
      return Response.json({ error: 'Trek not found.' }, { status: 404 })
    }

    const existingReviews = (trek.reviews ?? []) as NonNullable<Trek['reviews']>

    const newReview = {
      reviewerName: reviewerName.trim(),
      reviewDate: new Date().toISOString(),
      rating: rating as '1' | '2' | '3' | '4' | '5',
      ratingLabel: RATING_LABELS[rating],
      reviewText: textToLexical(reviewText.trim()),
      images: [],
    }

    await payload.update({
      collection: 'treks',
      id: Number(id),
      data: {
        reviews: [...existingReviews, newReview],
      },
      overrideAccess: true,
    })

    // Revalidate the trek detail page so the new review appears immediately
    revalidatePath(`/treks/${trek.slug}`)

    return Response.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/treks/[id]/review]', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
