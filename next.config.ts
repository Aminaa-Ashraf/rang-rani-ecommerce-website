import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.VERCEL) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

export default nextConfig
