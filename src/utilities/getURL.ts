import canUseDOM from './canUseDOM'

const toNonWww = (url: string) => url.replace('://www.', '://')

export const getServerSideURL = () => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')

  return toNonWww(url)
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return toNonWww(`${protocol}//${domain}${port ? `:${port}` : ''}`)
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return toNonWww(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }

  return toNonWww(process.env.NEXT_PUBLIC_SERVER_URL || '')
}
