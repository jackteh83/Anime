import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next.js 16: Turbopack is the default bundler for dev and build.
  reactStrictMode: true,
  images: {
    // Use remotePatterns (images.domains is deprecated in v16).
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
