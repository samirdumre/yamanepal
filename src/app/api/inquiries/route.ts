import { getPayload } from 'payload'
import config from '@payload-config'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/<[^>]*>/g, '')
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    // Honeypot check — bots fill this hidden field; humans leave it empty
    if (body?.honeypot) {
      // Return a convincing 200 so bots don't retry
      return Response.json({ success: true })
    }

    const fullName = sanitize(body?.fullName)
    const email = sanitize(body?.email)
    const phone = sanitize(body?.phone)
    const message = sanitize(body?.message)
    const trekName = sanitize(body?.trekName)
    const noOfTravellers = Number(body?.noOfTravellers)

    // Validation
    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      return Response.json(
        { error: 'Full name must be between 2 and 100 characters.' },
        { status: 400 },
      )
    }
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!phone || phone.length < 7 || phone.length > 20) {
      return Response.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
    }
    if (!Number.isInteger(noOfTravellers) || noOfTravellers < 1 || noOfTravellers > 200) {
      return Response.json(
        { error: 'Number of travellers must be between 1 and 200.' },
        { status: 400 },
      )
    }
    if (!message || message.length < 10 || message.length > 2000) {
      return Response.json(
        { error: 'Message must be between 10 and 2000 characters.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'inquiries',
      data: {
        trekName,
        fullName,
        email,
        phone,
        noOfTravellers,
        message,
        status: 'new',
      },
      overrideAccess: true,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('[inquiries] POST error:', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
