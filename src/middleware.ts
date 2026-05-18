import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory map for rate limiting
// Key: IP:Route, Value: { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number, resetTime: number }>()

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const url = request.nextUrl.pathname

  // Define limits
  let limit = 100 // Default limit
  let windowMs = 60 * 1000 // 1 minute

  if (url === '/admin/login') {
    limit = 5
  } else if (url === '/verify') {
    limit = 20
  } else {
    return NextResponse.next()
  }

  const now = Date.now()
  const key = `${ip}:${url}`
  const record = rateLimitMap.get(key)

  if (!record) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return NextResponse.next()
  }

  if (now > record.resetTime) {
    // Reset window
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return NextResponse.next()
  }

  record.count++

  if (record.count > limit) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  rateLimitMap.set(key, record)
  return NextResponse.next()
}

// Matcher to only run on specific routes
export const config = {
  matcher: ['/admin/login', '/verify'],
}
