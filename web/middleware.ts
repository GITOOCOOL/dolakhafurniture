import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // 1. Handle double-slash issues (some social trackers cause this)
  if (url.pathname.includes('//')) {
    url.pathname = url.pathname.replace(/\/+/g, '/')
    return NextResponse.redirect(url)
  }

  // 2. Performance: If no changes needed, just continue
  return NextResponse.next()
}

// Ensure it runs on all routes except static assets
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
