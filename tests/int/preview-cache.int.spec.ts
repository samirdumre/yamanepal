// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  redirect: vi.fn(),
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({
  getPayload: async () => ({ auth: mocks.auth, logger: { error: vi.fn() } }),
}))
vi.mock('next/headers', () => ({
  draftMode: async () => ({ enable: mocks.enable, disable: mocks.disable }),
}))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))
import { GET } from '@/app/(frontend)/next/preview/route'

const request = (secret = 'test-preview-secret') =>
  ({
    url: `https://example.jp/next/preview?path=/draft&collection=pages&slug=draft&previewSecret=${secret}`,
    headers: new Headers(),
  }) as NextRequest

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('PREVIEW_SECRET', 'test-preview-secret')
})

describe('preview cache isolation', () => {
  it('rejects an unauthenticated Payload auth result, without enabling previews', async () => {
    mocks.auth.mockResolvedValue({ user: null })
    const response = await GET(request())
    expect(response.status).toBe(403)
    expect(mocks.disable).toHaveBeenCalled()
    expect(mocks.enable).not.toHaveBeenCalled()
  })

  it('enables previews only for an authenticated session', async () => {
    mocks.auth.mockResolvedValue({ user: { id: 1 } })
    await GET(request())
    expect(mocks.enable).toHaveBeenCalled()
    expect(mocks.redirect).toHaveBeenCalledWith('/draft')
  })

  it('rejects an invalid secret before accessing authentication', async () => {
    const response = await GET(request('invalid'))
    expect(response.status).toBe(403)
    expect(mocks.auth).not.toHaveBeenCalled()
    expect(mocks.enable).not.toHaveBeenCalled()
  })
})
