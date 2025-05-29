import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Maximum number of requests per minute
const RATE_LIMIT = 60
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const MAX_URL_LENGTH = 2048 // Maximum URL length to prevent URL_TOO_LONG errors
const MAX_HEADER_SIZE = 8192 // Maximum header size to prevent REQUEST_HEADER_TOO_LARGE errors

// Simple in-memory store for rate limiting
const ipRequests = new Map<string, { count: number; timestamp: number }>()

// Error response helper
const createErrorResponse = (status: number, message: string) => {
  return new NextResponse(
    JSON.stringify({
      error: message,
      status,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export function middleware(request: NextRequest) {
  try {
    // Check URL length
    if (request.url.length > MAX_URL_LENGTH) {
      return createErrorResponse(414, 'URL too long')
    }

    // Check header size
    const headerSize = Object.entries(request.headers).reduce(
      (size, [key, value]) => size + key.length + (value?.length || 0),
      0
    )
    if (headerSize > MAX_HEADER_SIZE) {
      return createErrorResponse(431, 'Request header too large')
    }

    // Validate request method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
    if (!allowedMethods.includes(request.method)) {
      return createErrorResponse(405, 'Method not allowed')
    }

    // Rate limiting
    const ip = request.ip ?? 'anonymous'
    const now = Date.now()
    const requestData = ipRequests.get(ip)

    if (requestData) {
      if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
        // Reset if window has passed
        ipRequests.set(ip, { count: 1, timestamp: now })
      } else if (requestData.count >= RATE_LIMIT) {
        // Rate limit exceeded
        return createErrorResponse(429, 'Too many requests')
      } else {
        // Increment request count
        requestData.count++
        ipRequests.set(ip, requestData)
      }
    } else {
      // First request from this IP
      ipRequests.set(ip, { count: 1, timestamp: now })
    }

    // Add security headers
    const response = NextResponse.next()
    
    // Security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // Cache control headers
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    // Prevent infinite redirects
    response.headers.set('X-Redirect-Limit', '5')
    
    return response
  } catch (error) {
    // Handle any unexpected errors
    console.error('Middleware error:', error)
    return createErrorResponse(500, 'Internal Server Error')
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 