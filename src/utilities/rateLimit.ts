export interface RateLimitOptions {
  windowMs: number
  max: number
  key?: string
}

declare global {
  var rateLimiterStore: Map<string, { count: number; resetTime: number }> | undefined
}

const Store = globalThis.rateLimiterStore || new Map<string, { count: number; resetTime: number }>()

if (process.env.NODE_ENV !== 'production') {
  globalThis.rateLimiterStore = Store
}

export function rateLimit(ip: string, options: RateLimitOptions) {
  const { windowMs, max, key = 'global' } = options
  const now = Date.now()
  const storeKey = `${key}:${ip}`

  const record = Store.get(storeKey)

  if (!record || record.resetTime < now) {
    Store.set(storeKey, { count: 1, resetTime: now + windowMs })
    return { success: true, count: 1, limit: max }
  }

  if (record.count >= max) {
    return { success: false, count: record.count, limit: max }
  }

  record.count += 1
  return { success: true, count: record.count, limit: max }
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}
