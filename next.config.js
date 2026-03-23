import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudflareLoader.ts',
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
              protocol: 'https',
            },
          ]
        : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  eslint: {
    // Warning: allows build to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
