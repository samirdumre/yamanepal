import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const { fullName, email, phone, noOfTravellers, message, trekName, honeypot } = body

    // Honeypot check — bots fill this hidden field; humans leave it empty
    if (honeypot) {
      // Return a convincing 200 so bots don't retry
      return Response.json({ success: true })
    }

    // Basic validation
    if (!fullName || !email || !phone || !noOfTravellers || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'inquiries',
      data: {
        trekName: trekName ?? '',
        fullName,
        email,
        phone,
        noOfTravellers: Number(noOfTravellers),
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
