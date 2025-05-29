/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase timeout for function invocations
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Configure image optimization
  images: {
    domains: [], // Add your image domains here
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },

  // Configure redirects
  async redirects() {
    return []
  },

  // Configure rewrites
  async rewrites() {
    return []
  },

  // Increase payload size limit
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '4mb',
  },

  // Configure webpack if needed
  webpack: (config, { isServer }) => {
    return config
  },
}

module.exports = nextConfig 