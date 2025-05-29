/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase timeout for function invocations
  experimental: {
    serverComponentsExternalPackages: [],
    // Enable edge runtime for better performance
    runtime: 'edge',
    // Increase memory limit
    memoryBasedWorkersCount: true,
  },
  
  // Configure image optimization
  images: {
    domains: [], // Add your image domains here
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Add image optimization error handling
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Configure redirects with error handling
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-redirect-limit',
            value: '(?<count>\\d+)',
          },
        ],
        destination: '/error?code=INFINITE_LOOP_DETECTED',
        permanent: false,
      }
    ]
  },

  // Configure rewrites
  async rewrites() {
    return []
  },

  // Increase payload size limit and add timeout
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '4mb',
    // Add timeout configuration
    timeout: 30, // seconds
  },

  // Configure webpack with optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    }

    return config
  },

  // Add error handling for deployment issues
  onError: (err) => {
    console.error('Next.js build error:', err)
  },

  // Configure build output
  output: 'standalone',
  
  // Add compression
  compress: true,
  
  // Configure powered by header
  poweredByHeader: false,
}

module.exports = nextConfig 