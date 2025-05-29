import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Maximum number of requests per minute
const RATE_LIMIT = 60
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

// Simple in-memory store for rate limiting
const ipRequests = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  try {
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
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            message: 'Please try again later',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
            },
          }
        )
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
    
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
  } catch (error) {
    // Handle any unexpected errors
    console.error('Middleware error:', error)
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 